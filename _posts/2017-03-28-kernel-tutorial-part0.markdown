---
layout: post
title: Kernel Development Series - Part 0 - The Setup
comments: true
lang: en
---

## Part 0: The Setup etc.

* wat
{: toc}

### What we are building

So, that should be a kernel development tutorial, preferably in `x86-64` architecture. I use Mac OSX, so the exact instructions will be for OSX. This will be more or less a journal of my kernel development adventure. I've developed a couple of (mostly non-working) kernels but this is the first time I'm actually documenting the process. Oh, also the project is called `xdillah` because most Unix-y operating systems have an X somewhere in the title and that was some sort of in-joke we used among friends. I'm also running OSX Yosemite, and have Xcode and brew installed, which is required for some of the setup process.

Now, we need to get started with this entire thing. So, the first thing we need to know is "should you"? The answer is generally "You shouldn't". Unless you really know what everything is, don't venture much further than this paragraph right here (continuing this paragraph should be ok). Next thing is, what are we exactly writing? So, we'll be writing a **kernel**, the really core component of an entire operating system. It shouldn't really do much. But the first thing we'll need is a way to isolate different processes from each other, then a way to abstract some basic I/O devices like terminal input/output, hard drive, CD-ish device, Serial port etc. Then we might need support for further stuff, networking, graphic support, dynamic linking and so on. What we won't be writing is a bootloader, we use `GRUB`, which is included in `QEMU`, or a libc replacement, I think we'll be using `musl` or something. And surprise surprise, we'll need `QEMU` to test the thing we wrote. In order to create a bootable `.iso` file, we'll need another couple of utilities.

I'll probably face some really weird errors in the process, to the point where I'll just quit this endeavor very early, recreating the fact that practically all kernel development tutorials end too early as well as reminding me that I have a terrible patience. Plus, we'll be using some good old C, plus some Assembly where needed (and yes, it will be needed). I'm somewhat of a masochist for trying to write my own kernel, repeatedly, but not enough of a masochist to write an entire kernel in Assembly. No C++ either, at a low-enough level, t's not too different than C, only more of a hassle. Plus, we won't be using Rust - although I like it and it's a pretty suitable language for kernel development; I'm definitely not hipster enough to use `Rust`. It also needs somewhat (slightly) more runtime support than C. And simply say 'no' to Go. It's just not up to the task and I personally don't like Go. Any other higher level language is also out of the question as just writing in X language at a bare metal level is about a difficult enough tas as writing a kernel.

### What we'll need

First of all, we need ridiculous amounts of documentation. Google will always be your friend in this process. But to give a non-exhaustive list of suggested readings;

- [http://wiki.osdev.org/Main_Page](http://wiki.osdev.org/Main_Page) (Yes, preferably all of it)
- [https://www.reddit.com/r/osdev](https://www.reddit.com/r/osdev) (Start reading the top posts)
- [https://littleosbook.github.io](https://littleosbook.github.io)
- [http://www.brokenthorn.com/Resources/OSDevIndex.html](http://www.brokenthorn.com/Resources/OSDevIndex.html)
- [http://www.jamesmolloy.co.uk/tutorial_html/](http://www.jamesmolloy.co.uk/tutorial_html/) (JamesM might be the greatest kernel tutorial ever)
- [https://pdos.csail.mit.edu/6.828/2016/xv6/book-rev9.pdf](https://pdos.csail.mit.edu/6.828/2016/xv6/book-rev9.pdf) the MIT book and its source https://github.com/mit-pdos/xv6-public
- [https://github.com/Stichting-MINIX-Research-Foundation/minix](https://github.com/Stichting-MINIX-Research-Foundation/minix) the entire minix source is a bit more advanced, but might be useful in the future
- [http://intermezzos.github.io/book/](http://intermezzos.github.io/book/)
- [http://os.phil-opp.com/](http://os.phil-opp.com/)

Although the last two were for `Rust`, they should be useful for 64-bit specific stuff (Most kernel tutorials are i386)

Then we need a couple utilities for building and running the kernel. Namely, `nasm`, cross-compiled `gcc` and binutils, plus `gcc`. We can simply install `nasm` and `qemu` packages via homebrew. We'll need to comple our cross-compiling gcc and binutils, which will be explained in the next section.

Then we need a couple of dependencies for building cross binutils and gcc. Namely, `gmp`, `mpfr` and `libmpc`. You can just install those via homebrew, and we'll specify their paths while building the cross-compiler. Oh also, install the GNU GCC via brew as well since compiling GCC with Apple's LLVM GCC might lead to "interesting" bugs

### Building cross-gcc

http://wiki.osdev.org/GCC_Cross-Compiler is the main guide to follow.

First, we'll need to download gcc and binutils sources from ftp://ftp.gnu.org/gnu/binutils/ and ftp://ftp.gnu.org/gnu/gcc/. Downloading the last version should be OK but I'll continue with `gcc 5.3.0` and `binutils 2.27` as I (apparently) already downloaded their sources.Then go ahead and unzip those files. You should have `gcc-<version>` and `binutils-<version>` folders now.

Then set some basic config options with `export PREFIX="$HOME/opt/cross"` (change this if you want to install the thing somewhere else) `export TARGET=x86_64-elf` (This is the cross compiling target we'll use) and `export CC=gcc-5` (So that it uses the GNU GCC, not Apple's fake one).

Then we need to create two directories `build_binutils` and `build_gcc`. Go into `build_binutils` and issue the command 

```../binutils-<version>/configure --prefix=$PREFIX --target=$TARGET \
--with-sysroot --disable-nls --disable-werror
```

and then `make` and `make install` (`sudo make install` if your prefix is not owned by the user). Finally, test that we installed the thing by executing `$PREFIX/bin/x86_64-elf-ld --version`. If you get a meaningful answer, you've installed it correctly.

Now on to GCC. You need to be in a shell where the previous environment variables are still defined. Then `cd` into the `build_gcc` directory and then run 

```../gcc-<version>/configure --prefix=$PREFIX --target=$TARGET \
--disable-nls --enable-languages=c,c++ --without-headers
```

Then run `make all-gcc` and `make all-target-libgcc`. Note that executing the `make` commands might take some time, like 20-ish minutes. Then run the `make install-gcc` and `make install-target-libgcc`. Finally, we need to check that gcc is installed. Run `PREFIX/bin/x86_64-elf-gcc --version`. Again, if you get a meaningful answer, you probably installed it quickly.

Finally, check if `nasm` and `qemu-system-x86_64` are installed. We'll need those tools.

### Setting Up a Development Environment

Although you don't really need a build system for a really quick-and dirty thing probably limited to a couple of files; anything going over 5 or 6 files tend to need one, for automation process. I'm pretty much going to copy over the stuff I've used for a previous project. It really consists of.

To begin; I created two separate empty git repositories; [xdillah_top](https://github.com/kuzux/xdillah_top) and [xdillah_take2](https://github.com/kuzux/xdillah_take2) and cloned the first one to my local. Then used `git submodule add git@github.com:kuzux/xdillah_take2.git kernel` to clone the take2 repository into the toplevel. 

So the directory structure will be something like

```
xdillah/
|- kernel/
   |- .gitignore
   |- README.md
   |- LICENSE
   |- Makefile
   |- linker.ld
   |- src/
      |- bunch of c files
      |- arch/
         |- x86_64/
            |- bunch of assembly files
   |- target/
      |- obj/
         |- bunch of o files compiled from C ones
         |- arch/
            |- x86_64/
               |- bunch of o files compiled from assembly files
      |- bin/
         |- kernel
   |- include/
      |- bunch of header files
|- libc/
   |- .gitignore
   |- README.md
   |- LICENSE
   |- Makefile
   |- src/
      |- Bunch of vendor stuff?
   |- include/
      |- Bunch of vendor header stuff?
   |- target/
      |- obj/
         |- again, bunch of o files
      |- lib/
         |- libc.a
         |- libk.a
|- sysroot/
   |- boot/
      |- kernel
   |- we'll probably need more stuff in sysroot in the future.
|- config.sh
|- build.sh
|- qemu.sh
|- bunch of other shell files
|- README.md
|- LICENSE
|- possibly other projects?
```

The projects should all be a git submodule. In the end, we'll probably 'write' a libc for our own OS which will essentially be a port of `musl` or a similar libc implementation. The `libk` is just libc implemented to be statically linked to the kernel, not using any syscall's etc.

Rest to be written

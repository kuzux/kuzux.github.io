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

- http://wiki.osdev.org/Main_Page (Yes, possibly all of it)
- https://www.reddit.com/r/osdev (Start reading the top posts)
- https://littleosbook.github.io
- http://www.brokenthorn.com/Resources/OSDevIndex.html
- http://www.jamesmolloy.co.uk/tutorial_html/ (JamesM might be the greatest kernel tutorial ever)
- https://pdos.csail.mit.edu/6.828/2016/xv6/book-rev9.pdf the MIT book and its source https://github.com/mit-pdos/xv6-public
- https://github.com/Stichting-MINIX-Research-Foundation/minix the entire minix source is a bit more advanced, but might be useful in the future
- http://intermezzos.github.io/book/
- http://os.phil-opp.com/

Although the last two were for `Rust`, they should be useful for 64-bit specific stuff (Most kernel tutorials are i386)

Then we need a couple utilities for building and running the kernel. Namely, `nasm`, cross-compiled `gcc` and binutils, plus `gcc`. We can simply install `nasm` and `qemu` packages via homebrew. We'll need to comple our cross-compiling gcc and binutils, which will be explained in the next section.

Then we need a couple of dependencies for building cross binutils and gcc. Namely, `gmp`, `mpfr` and `libmpc`. You can just install those via homebrew, and we'll specify their paths while building the cross-compiler

### Building cross-gcc

To be written

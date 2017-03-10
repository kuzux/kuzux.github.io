---
layout: post
title: A Kernel development bug
comments: true
lang: en
---

So, the thing is; sometime around last year, I decided to write a simple kernel. Just for fun. The thing is called xdillah, it's n my github profile and is ridiculously incomplete as of now. I was actively developing it some time around last summer, and here's a very late post mortem about a bug I encountered sometime last August (or September or something). Oh, also, when developing, I extensively used JamesM's tutorials (the link changes every now and then) and `osdev.org`. Both great resources.

So, when you're doing kernel development, you generally need to have some sort of basic I/O for things like printf, puts etc. So I impleented some basic I/O functionality there, no problem. Then, one day, suddenly, some of the stuff I was printing out just stopped being displayed correctly. At that time, I hadn't been able to hook a debugger to qemu where I was testing my kernel, so the obvious solution was good old printf-debugging. But the problem was; how do you printf debug when the printf routine is your problem? The answer is; you add another function to write out to your serial port (qemu redirects serial port output to stdout), check that it works; and then continue with serial port debugging!

So, when I was serial port debugging my printf routine, I was just putting serial port put statements around the code. After a bit of playing around, I noticed one peculiar thing: None of the statements were outputting anything to the serial port when there was a bug in the execution! After a lot of googling around, I found the culprit: when `gcc` does optimization, it turns single argument printf calls or `printf("%s", asd)` calls into calls to the `puts` function. So, turns out my printf implementation was fine, my puts implementation was the actual problem. However; one problem remained, the puts implementation is so simple that it obviously has no weird behavior. Sio the defect remains to this day.

In the end; I was able to work around this by replacing all the single argument printf calls within my code into `printf("%s \n", asd)`s and was able to disable that 'feature'. However, the original bug in the puts remains there and boggles my mind to this day. I thought that was a pointer issue; but the strings print just fine when they are `printf`'d just fine. How can such a simple implementation have such a bug?

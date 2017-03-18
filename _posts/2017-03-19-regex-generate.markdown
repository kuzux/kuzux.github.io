---
layout: post
title: Generate Strings to Match a Regular Expression
comments: true
lang: en
---

So, the dailyprogrammer subreddit is a thing, and there are a number of challenges there. I made a solution for the problem #306 [Hard], which was [Generate Strings to Match a Regular Expression](https://www.reddit.com/r/dailyprogrammer/comments/5zxebw/20170317_challenge_306_hard_generate_strings_to/). That was surprisingly easy and the solution is [here](https://gist.github.com/kuzux/ad805f01de024f345e8df754ead4f80f). 
The challenge was surprisingly easy considering it was a "Hard" one, and by my experience, thoe are somewhat challenging. My solution is one written in Python (working on CPython 2.7) in about 10/20 minutes. So, we basically need some form of a regex parser (or some subset-ish of Perl regexes) and for that, we define a bunch of token classes each with a generate method to generate a matching string. Then we need some sort of a parser for regexes we parse, and that is a regular language; so we can't use FSAs. However, I just use a state machine with the states "start", "brace", "dash" and "backspace" plus an array[^1] to get a list of tokens in the end.
The most interesting part of the code for me was the actual "main" bit. I had no idea you could just loop through lines like that in python and that might be a useful thing to know when writing command line utilities. Also we need to note that this method actually waits for an end of input, and then loops over all the night. Plus, the lines we loop over include the newline characters which I remove by .rstrip() method.

[^1]: Yep, I realized, that ends up being a pushdown automata, the correct thing to recognize a context free grammar
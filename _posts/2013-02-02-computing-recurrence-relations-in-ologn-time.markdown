---
layout: post
title: Computing recurrence relations in O(log N) time
lang: en
---
A few days ago, while trying to solve a problem which went as;

> You have unlimited supply of colored rectangles. There are five types of them:
>
> * Red 1x3 rectangle
> * Green 2x2 rectangle
> * Blue 3x1 rectangle
> * Yellow 3x3 rectangle
>
> You want to build as many different 3xN rectangles as possible. Note that you are not allowed to rotate the rectangles.
> ($$ N \leq 10^{18} $$)

The first step to find a recurrence relation for the problem, that was the relatively easy part and i'm not going to go into much detail here. The recurrence relation i've come up with for the number of different 3xN rectangles was 

$$ R_N = R_{N-1} + R_{N-2} + 4R_{N-3} $$

With the initial values

$$ R_0 = 1 , R_1 = 1 , R_2 = 2 $$

So I went on and implemented the most straightforward (alright, not _the_ most straightforward solution per se, but relatively straightforward) solution, using the simple dynamic programming method of computing recurrence relations in $$ O(N) $$ complexity. However, this solution simply _blew up in my face_ when used with values larger than $$ 10^{7} $$ or so. 

So, we need to find an order of magnitude more efficient solution. Turns out there is such a solution, which lies buried deep within the secrets of matrices. The initial step to the solution is the following definition;

$$ u_i = \begin{bmatrix} R_i \\\\ R_{i-1} \\\\ R_{i-2} \end{bmatrix} $$

Using that and the definition of matrix multiplication; we can write the following equation:

$$ 
\begin{bmatrix} R_{i+1} \\\\ R_{i} \\\\ R_{i-1} \end{bmatrix} = \begin{bmatrix} 1 & 1 & 4 \\\\ 1 & 0 & 0 \\\\ 0 & 1 & 0 \end{bmatrix} . \begin{bmatrix} R_i \\\\ R_{i-1} \\\\ R_{i-2} \end{bmatrix} 
\Leftrightarrow u_{i+1} = \begin{bmatrix} 1 & 1 & 4 \\\\ 1 & 0 & 0 \\\\ 0 & 1 & 0 \end{bmatrix} . u_i
$$

If we name the 3x3 matrix $$ T $$, the general formula for the equation becomes $$ u_n = T^n . u_0 $$. However, $$u_0$$ and $$u_1$$ are not defined, so just transform the equation into 

$$ u_n = T^{n-2} . u_2 $$

So, what does this form give us? For that, we'll need to look into [Exponentiation by Squaring](http://en.wikipedia.org/wiki/Exponentiation_by_squaring). It's a $$ \Theta(log n) $$ algorithm for finding $$x^n$$. It can be described in pseudocode as;

    def exp(base,n):
        if(n==0): 1
        elsif(even?(n)): exp(base*base, n/2)
        else: exp(base*base, (n-1)/2)*base

This algorithm is designed for exponentiating integers, but it happens to work in our case as well[^1], just replace the 1 with identity matrix and the multiplication operator with matrix multiplication. 

So; the steps of solution to the problem were

> 1. Find a recurrence relation that gives the answer to the question
> 1. Transform it to a matrix multiplication
> 1. Code the matrix multiplication and fast exponentiation functions (relatively easy)
> 1. Use those functions to compute the recurrence relation for the very large number $$N$$, in $$O(logN)$$ time.

Note that this method also works for non-homogeneous recurrence relations. For example; given the recurrence relation $$ R_N = 2R_{N-1} + R_{N-2}+3 $$, we can define 

$$ u_i = \begin{bmatrix} R_i \\\\ R_{i-1} \\\\ 1 \end{bmatrix} $$

and 

$$ T = \begin{bmatrix} 2 & 1 & 3 \\\\ 1 & 0 & 0 \\\\ 0 & 0 & 1 \end{bmatrix} $$

such that $$ u_{i+1} = T . u_i $$ and use exponentiation by squaring.

[^1]: _Why_ this works is another question, the exponentiation by squaring algorithm can be defined on [Rings](http://en.wikipedia.org/wiki/Ring_(mathematics)) and both integers and square matrices constitute rings. (The main difference between them is; integers form a commutative ring while square matrices do not.)
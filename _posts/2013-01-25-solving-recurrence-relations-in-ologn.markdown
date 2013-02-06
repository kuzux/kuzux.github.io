---
layout: post
title: Calculating recurrence relations in O(log N) time
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
> ($ N \leq 10^{18} $)

The first step to find a recurrence relation for the problem, that was the relatively easy part and i'm not going to go into much detail here. The recurrence relation i've come up with for the number of different 3xN rectangles was 

$$ R_N = R_{N-1} + R_{N-2} + 4R_{N-3} $$

With the initial values

$$ R_0 = 1 , R_1 = 1 , R_2 = 2 $$

So I went on and implemented the most straightforward (alright, not _the_ most straightforward solution per se, but relatively straightforward) solution, using the simple dynamic programming method of computing recurrence relations in $O(N)$ complexity. However, this solution simply _blew up in my face_ when used with values larger than $ 10^{7} $ or so. 

So, we need to find an order of magnitude more efficient solution. Turns out there is such a solution, which lies buried deep within the secrets of matrices. The initial step to the solution is the following definition;

$$ u_i = \begin{bmatrix} R_i \\\\ R_{i-1} \\\\ R_{i-2} \end{bmatrix} $$

Using that and the definition of matrix multiplication; we can write the following equation:

$$ 
\begin{bmatrix} R_{i+1} \\\\ R_{i} \\\\ R_{i-1} \end{bmatrix} = \begin{bmatrix} 1 & 1 & 4 \\\\ 1 & 0 & 0 \\\\ 0 & 1 & 0 \end{bmatrix} . \begin{bmatrix} R_i \\\\ R_{i-1} \\\\ R_{i-2} \end{bmatrix} 
\Leftrightarrow u_{i+1} = \begin{bmatrix} 1 & 1 & 4 \\\\ 1 & 0 & 0 \\\\ 0 & 1 & 0 \end{bmatrix} . u_i
$$


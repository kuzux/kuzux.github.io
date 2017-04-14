---
layout: post
title: Line Segment Intersection in 2 Dimensions Explained
lang: en
comments: true
---

<script src = "/line-segment-intersection.js"> </script>
<style> canvas { width: 150px; height: 150px; float:left; } .push-down{padding-top: 50px;} </style>


* wat
{:toc}

-----

Geometric things have always been really tricky to program for me, and quite a lot of other people as well. I think I need more practice coding geometric stuff and explaining them in a post would help me remember them well. So I decided this would be the first step since finding whether two line segments on a cartesian plane intersect or not is pretty much the simplest problem to be faced in computational geometry. And hopefully, this will be the first in a series of blog posts.

<div class="row">
<canvas id="not-intersecting" class="draw-lines span6" data-line1="30 60 80 120" data-line2="80 50 130 100"> </canvas>
<p class="col-xs-12 col-md-6 push-down">
Not intersecting
</p>
</div>

<div class="row">
<canvas id="intersecting" class="draw-lines col-xs-12 col-md-6" data-line1="30 40 80 120" data-line2="80 30 30 120"> </canvas>
<p class="col-xs-12 col-md-6 push-down">
Intersecting
</p>
</div>

So, how do we find whether two lines are intersecting? In the first example; consider the red line segment, and the line segment from top of red segment to both ends of the green segment.Call them $$\bf{a}$$, $$\bf{b_1}$$ and $$\bf{b_2}$$ respectively.

<div class="row">
<canvas class="draw-lines draw-vectors col-xs-12 col-md-6" data-line1="30 60 80 120" data-line2="80 50 130 100"> </canvas>
<p class="col-xs-12 col-md-6 push-down">
Notice that both of the vectors are to the right of the line segment.
</p>    
</div>

<div class="row">
<canvas class="draw-lines draw-vectors col-xs-12 col-md-6" data-line1="30 40 80 120" data-line2="80 30 30 120"> </canvas>
<p class="col-xs-12 col-md-6 push-down">
One of the vectors is to the left of the red line, and the other is to the right of it
</p>
</div>

So, just check whether the opposite ends of the second segment are on the opposite sides of the first segment, right? Well, there is an (pretty obvious) exception to that:

<canvas id="corner1" class="draw-lines draw-vectors" data-line1="30 40 40 100" data-line2="80 80 30 120"> </canvas>

In this case; one end of the green line segment is to the left of the red one and the other one is to the right, but they don't intersect. To solve this, just check for both line segments.

<div class="row">
<canvas class="draw-lines draw-vectors col-xs-12 col-md-6" data-line2="30 40 40 100" data-line1="80 80 30 120"> </canvas>
<p class="col-xs-12 col-md-6 push-down">
See how both ends of the green segment is to the left of the red one in this flipped graph?
</p>    
</div>

------

#### Leftward or rightward?

That leaves us with one more question, how do we find out if a vector is to the left or to the right of another one. And the answer for that, is the [Cross Product](http://en.wikipedia.org/wiki/Cross_product). The cross product $$\bf{a}\times\bf{b}$$ results in a vector perpendicular to the plane the vectors $$\bf{a}$$ and $$\bf{b}$$ are in, so in case of 2-dimensional vectors, the resultant vector only has the z component. For 2-Dimensional vectors; the cross product is calculated as 

$$\|\bf{a}\times\bf{b}\|=(\bf{a}\times\bf{b})_z = \bf{a}_x \bf{b}_y - \bf{b}_x \bf{a}_y$$

Due to the anticommutativity[^1] of the cross product, we can find the order vectors are oriented, i.e. whether a vector is to the left or right of the other one[^2]. In 2-dimensions; If $$\|\bf{a}\times\bf{b}\|>0$$; $$\bf{a}$$ is to the right of $$\bf{b}$$, and vice versa if the product is negative. The vectors are collinear if the cross product is equal to zero. There is a right-hand rule for that, but most of the times, I can't remember the rule, the easy way to come up with is just check the cross product of two vectors, say $$\begin{bmatrix}1 & 1\end{bmatrix} \times \begin{bmatrix}1 & 2\end{bmatrix}$$ and see if it is positive or negative.

------

#### One Last Corner Case

<canvas id="corner2" class="draw-lines" data-line1="100 100 50 50" data-line2="80 80 20 20"> </canvas>

If two line segments lie on the same line, this method will always return false, whether there is overlap between line segments or not. To cover this case, we can check for both ends of the second line if they are within the first line or not. To do that; we can find the corresponding line to the line segment ($$a_x$$, $$a_y$$) -- ($$b_x$$, $$b_y$$), which is 

$$ y - a_y = \frac{b_y-a_y}{b_x-a_x}x-a_x $$ 

and test if the point tested satisfies the equation *and* check if its x coordinate lies between $$a_x$$ and $$b_x$$. If one of the endpoints of the second line segment is contained within the first one, then those line segments intersect.

------

#### The Code

The intersection checking code is pretty short, about 35 lines long in my javascript implementation. In terms of time and memory, it obviosly has $$O(1)$$ complexity, since what we're doing is just a few mathematical operations regardless of the size, shape etc. of the line segments. 

The code(for line segment intersection, the demo and drawing line segments on canvas) can be found here: <https://github.com/kuzux/kuzux.github.com/blob/master/line-segment-intersection.js>

------

#### And the Demo

Usage: Just click around in the area below :)

<canvas id="demo" width="450" height="450" style="border:1px dashed;"> </canvas>

<p id="demo-result"></p>

<input type="button" id="demo-clear" value="Reset" />

[^1]: i.e. $$\bf{a}\times\bf{b} = -\bf{b}\times\bf{a}$$

[^2]: Actually, what we've found is if the turn from $$\bf{a}$$ to $$\bf{b}$$ is clockwise or counterclockwise, and leftward and rightward are only valid in first two quadrants of the 2 dimensional cartesian coordinate system, and since in this case, we're only checking whether the vectors are on the same side or not, this distinction doesn't really matter.
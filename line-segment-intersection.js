$(document).ready(function(){
    /*
    *   Drawing lines onto canvas
    */
    var drawCircle = function(ctx, x, y, color){
        ctx.strokeStyle = color;
        ctx.fillStyle = color;

        ctx.beginPath();
        ctx.arc(x, y, 2, 0, 2*Math.PI, false);
        ctx.fill();
    }

    var drawLine = function(ctx, pts, color){
        drawCircle(ctx, pts[0], pts[1], color);

        ctx.beginPath();
        ctx.lineWidth = 2;
        ctx.moveTo(pts[0], pts[1]);
        ctx.lineTo(pts[2], pts[3]);
        ctx.stroke();

        drawCircle(ctx, pts[2], pts[3], color);
    }

    var drawArrow = function(context, fromx, fromy, tox, toy){
        var headlen = 5;   // length of head in pixels
        var angle = Math.atan2(toy-fromy,tox-fromx);
        context.beginPath();
        context.lineWidth = 1;
        context.strokeStyle="black";
        context.moveTo(fromx, fromy);
        context.lineTo(tox, toy);
        context.lineTo(tox-headlen*Math.cos(angle-Math.PI/6),toy-headlen*Math.sin(angle-Math.PI/6));
        context.moveTo(tox, toy);
        context.lineTo(tox-headlen*Math.cos(angle+Math.PI/6),toy-headlen*Math.sin(angle+Math.PI/6));
        context.stroke();
    }

    var drawLines = function(idx, canvas){
        var ctx = canvas.getContext('2d');
        var points1 = $(canvas).data("line1").split(" ").map(Number);
        var points2 = $(canvas).data("line2").split(" ").map(Number);

        drawLine(ctx, points1, "red");
        drawLine(ctx, points2, "green");
    }

    var drawVectors = function(idx, canvas){
        var ctx = canvas.getContext('2d');
        var points1 = $(canvas).data("line1").split(" ").map(Number);
        var points2 = $(canvas).data("line2").split(" ").map(Number);

        drawArrow(ctx, points1[0], points1[1], points2[0], points2[1]);
        drawArrow(ctx, points1[0], points1[1], points2[2], points2[3]);
    }

    $(".draw-lines").each(drawLines);
    $(".draw-vectors").each(drawVectors);

    /********
    *  Line Segment Intersection
    ********/

    var crossProduct = function(ax, ay, bx, by){
        return ax*by-ay*bx;
    }

    // returns true if point p is contained within ab line segment
    var pointWithinLineSegment = function(ax, ay, bx, by, px, py){
        var m = (by-ay)/(bx-ax);
        if((py-ay) == m*(px-ax)){
            if(ax<bx)
                return ax<=px && px<=bx;
            else
                return bx<=px && px<=ax;
        } else{
            return false;
        }
    }

    // returns true if the left-right test succeeds (the vectors are on different sides)
    var checkLeftRight = function(va, vb){
        var vector_a = [va[2]-va[0], va[3]-va[1]];
        var vector_b1 = [vb[0]-va[0], vb[1]-va[1]];
        var vector_b2 = [vb[2]-va[0], vb[3]-va[1]];

        var result = crossProduct(vector_a[0], vector_a[1], vector_b1[0], vector_b1[1]) * crossProduct(vector_a[0], vector_a[1], vector_b2[0], vector_b2[1]);
        return result <= 0;
    }

    // returns true if line segments intersect
    var checkIntersection = function(pts1, pts2){
        // check if endpoints of second segment is within the line 
        if(pointWithinLineSegment(pts1[0],pts1[1],pts1[2],pts1[3],pts2[0],pts2[1])
            || pointWithinLineSegment(pts1[0],pts1[1],pts1[2],pts1[3],pts2[2],pts2[3])){
            return true;
        }

        return checkLeftRight(pts1, pts2) && checkLeftRight(pts2, pts1);
    }

    var checkCanvas = function(canvas){
        var points1 = $(canvas).data("line1").split(" ").map(Number);
        var points2 = $(canvas).data("line2").split(" ").map(Number);
        alert(checkIntersection(points1, points2));
    }

    /*********
    * Line Segment Intersection Demo on Canvas
    **********/

    function relMouseCoords(canvas, evt) {
        var rect = canvas.getBoundingClientRect();
        return {
          x: evt.clientX - rect.left,
          y: evt.clientY - rect.top
        };
      }

    function Demo(){
        var numPoints = 0;
        var points = [];

        var calculateIntersection = function(){
            if(checkIntersection([points[0].x, points[0].y, points[1].x, points[1].y],
                [points[2].x, points[2].y, points[3].x, points[3].y])){
                $("#demo-result").html("intersecting");
            } else{
                $("#demo-result").html("not intersecting");
            }
        }

        this.addPoint = function(coords, ctx){

            if(numPoints==4) return;
            points[numPoints] = coords;
            numPoints++;
            if(numPoints==1){
                drawCircle(ctx, coords.x, coords.y, "red");
            } else if(numPoints==2){
                drawLine(ctx, [points[0].x, points[0].y, coords.x, coords.y], "red");
            } else if(numPoints==3){
                drawCircle(ctx, coords.x, coords.y, "green");
            } else if(numPoints==4){
                drawLine(ctx, [points[2].x, points[2].y, coords.x, coords.y], "green");
                calculateIntersection();
            }
        }
    }

    var demo = new Demo();
    var canvas = $("#demo");
    var ctx = canvas[0].getContext("2d");
    canvas.click(function(evt){
        var coords = relMouseCoords(canvas[0], evt);
        demo.addPoint(coords, ctx);
    });

    $("#demo-clear").click(function(){
        canvas[0].width = canvas[0].width;
        $("#demo-result").html("")
        demo = new Demo();
    })
});

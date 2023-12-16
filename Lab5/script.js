const EXTRA_BUFFER = 10;

// default styles
style = {
  point: {
    color: "Black",
    fill: "Black",
    arc1: 0,
    arc2: 2 * Math.PI
  }
}

// This is the actual input
var points = inputJSON.points; // Requires inputJSON variable set in file
var boundaries = inputJSON.boundaries; // This will be used in Lab 5
var showBoundaries = false;
var showLabels = false;

// IMPORTANT: if you modify the points, e.g., adding three extra points for the containing triangle, make sure to call computeExtents afterwards
var extents = computeExtents(points); // Required to fit points to canvas

var canvas = document.getElementsByTagName('canvas')[0];
var ctx = canvas.getContext('2d');
var dcel_ds;

style.point.radius = inputJSON.point_radius; // Take radius to draw points from JSON
style.point.width = inputJSON.point_width; // Take line width also from JSON

var triangles; // Used to store the resulting triangles of the triangulation

// Computes the point set extents
function computeExtents(points) {
	
	var extents = {"xmin":Number.MAX_VALUE, "xmax":-Number.MAX_VALUE, "ymin":Number.MAX_VALUE, "ymax":-Number.MAX_VALUE};
	
	for (var i = 0; i < points.length; i++) {
		var p = points[i];
		if (p.x < extents.xmin) {
			extents.xmin = p.x;
			}
		if (p.y < extents.ymin) {
			extents.ymin = p.y;
			}
		if (p.x > extents.xmax) {
			extents.xmax = p.x;
			}
		if (p.y > extents.ymax) {
			extents.ymax = p.y;
			}
	}
			
	return extents;
}

// Transforms the coordinates of point to draw it properly in canvas
function transformPointToCanvas(p) {
	// Scales to canvas size
	var xfact  = (canvas.width-2*EXTRA_BUFFER)/(extents.xmax-extents.xmin);
	var yfact = (canvas.height-2*EXTRA_BUFFER)/(extents.ymax-extents.ymin);
	if (xfact<yfact)
		yfact = xfact;
	else
		xfact = yfact;
	var x = (p.x-extents.xmin)*xfact+EXTRA_BUFFER;
	var y = (p.y-extents.ymin)*yfact+EXTRA_BUFFER;
	// Note: below we flip y-coordinate to simulate positive y-axis going upwards
	return {"x":x, "y":canvas.height-y, "z":p.z};
}

// Draws one point as a circle
function drawPoint(ctx, style, origP, index) {
	var p = transformPointToCanvas(origP);
    ctx.lineWidth = style.point.width;
    ctx.strokeStyle = style.point.color;
	if (index == 693) ctx.strokeStyle = "Red";
    ctx.fillStyle = style.point.fill;
    ctx.beginPath();
    ctx.arc(p.x, p.y, style.point.radius, style.point.arc1, style.point.arc2, true);
    ctx.fill();
    ctx.stroke();
	ctx.font = "1px Arial";
	// Uncomment to draw label of each point next to it
	if (showLabels) ctx.fillText(index, p.x+6*style.point.width, p.y);
}

// Draws triangles they are given in one array, an each triangle is an array of three point indices
function drawTriangles(ctx) {
	if (triangles != null) {
		for(i = 0; i<triangles.length; i++) {
				ctx.beginPath();
				ctx.moveTo(transformPointToCanvas(points[triangles[i][0]]).x, transformPointToCanvas(points[triangles[i][0]]).y);
				
				ctx.lineTo(transformPointToCanvas(points[triangles[i][1]]).x, transformPointToCanvas(points[triangles[i][1]]).y);
				
				ctx.lineTo(transformPointToCanvas(points[triangles[i][2]]).x, transformPointToCanvas(points[triangles[i][2]]).y);
				
				ctx.closePath();
				ctx.stroke();
			  }
		  }
}

function drawBoundaries(ctx) {
	var prevColor = ctx.strokeStyle;
	ctx.strokeStyle = "blue"; // Draw them in blue
	for (var i=0; i<boundaries.length; i++) {
		var b = boundaries[i];
		//Draw one boundary only if it has more than one point
		if (b.length>1) {
			ctx.beginPath();
			ctx.moveTo(transformPointToCanvas(points[b[0]]).x, transformPointToCanvas(points[b[0]]).y);
			for (var j=1; j<b.length;++j) {
				ctx.lineTo(transformPointToCanvas(points[b[j]]).x, transformPointToCanvas(points[b[j]]).y);
			}
			ctx.closePath();
			ctx.stroke();
		}
	}
	ctx.strokeStyle = prevColor;
}

// Draws all points
function drawPoints(ctx, style, points) {
	//For each pair draw pair after classifying intersection
	for (var i = 0; i < points.length; i++) {
		drawPoint(ctx, style, points[i], i);
	}
}

// Redraws the whole canvas.
function redraw(){
	// Clear the entire canvas
	var p1 = ctx.transformedPoint(0,0);
	var p2 = ctx.transformedPoint(canvas.width,canvas.height);
	ctx.clearRect(p1.x,p1.y,p2.x-p1.x,p2.y-p1.y);

	ctx.save();
	ctx.setTransform(1,0,0,1,0,0);
	ctx.clearRect(0,0,canvas.width,canvas.height);
	ctx.restore();

	// Draw the interesting stuff
	drawPoints(ctx, style, points);
	drawTriangles(ctx);
	if (showBoundaries)
		drawBoundaries(ctx);
}

function toggleShowBoundaries() {
	var checkBox = document.getElementById("showBoundariesCheckBox");
	showBoundaries = checkBox.checked ;

	var labelCheckBox = document.getElementById("showLabels");
	showLabels = labelCheckBox.checked;
	redraw();
}

function doTriangulate() {
	// Measure time
	var t0 = performance.now();
	var ret = computeTriangulation(points, boundaries); // This function is in triangulation.js
	triangles = ret[0];
	dcel_ds   = ret[1];
	var t1 = performance.now();
	
	// Log time
	var string = "Vertices: " + points.length + ". Triangles: " + triangles.length;
	string += ". Triangulation time: " + (t1 - t0).toFixed(0) + " milliseconds.";
	console.log(string)
	// Also show it in page
	document.getElementById("time_label").innerHTML=string;
	redraw();
}
/*
function doPruneBoundaries(){
	var edgeMap = new Map();
	var faceMap = new Map();
	// Pruning of the boundaries
	for (let e = 0; e < dcel_ds.egVector.length; ++e)
	{
		var min = Math.min(dcel_ds.egVector[e].from, dcel_ds.egVector[e].next.from);
		var max = Math.max(dcel_ds.egVector[e].from, dcel_ds.egVector[e].next.from);

		if (!edgeMap.has(JSON.stringify([min, max])))
		{
			edgeMap.set(JSON.stringify([min, max]), dcel_ds.egVector[e]);
		}
	}

	for (let f = 0; f < triangles.length; ++f){
		var tri = triangles[f];
		
		for (let i = 0; i < 3; ++i)
		for (let j = 0; j < i; ++j)
		{
			// Insert
			var min = Math.min(triangles[f][i], triangles[f][j]);
			var max = Math.max(triangles[f][i], triangles[f][j]);
	
			if (!faceMap.has(JSON.stringify([min, max]))){
				faceMap.set(JSON.stringify([min, max]), [f]);
			}
			else {
				var before = faceMap.get(JSON.stringify([min, max]));
				faceMap.set(JSON.stringify([min, max]), before.concat([f]));
			}
		}
	}

	// Traverse the boundaries
	for (let i = 0; i < boundaries.length; ++i){

		if (boundaries[i].length == 1){
			// Remove all incident edges emanating from 
		}

		for (let j = 1; j < boundaries[i].length; ++j){
			var vx1 = boundaries[i][j-1] + 3; // Add three because of the three starting nodes
			var vx2 = boundaries[i][j]   + 3; // Add three because of the three starting nodes
			var min = Math.min(vx1, vx2);
			var max = Math.max(vx1, vx2);
	
			/*var edge = edgeMap.get(JSON.stringify([min, max]));

			if (edge == undefined) {
				console.log("Undefined edge from " + min + "  to " + max);
				continue;
			}

			// We want the edge going from 1 to 2
			if (edge.from == vx2) edge = edge.twin;
			
			var trigs = faceMap.get(JSON.stringify([min, max]));

			if (trigs == undefined) {
				console.log("Undefined triangle from " + min + "  to " + max);
				continue;
			}



		}
	}
}

*/
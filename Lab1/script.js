//========= Auxiliary objects and data =========//

// Input Segments
var segments = inputJSON.segments; // Requires inputJSON variable set in file
//var segments = inputJSON.segments.slice(0,6); // You can use slice() to select a subset of the segments. Make sure it is an even number!
var points = [];

var colors = [
	"#FF5733", // Red
	"#28CC45", // Green
	"#3357FF", // Blue
	"#FF33F3", // Pink
	"#836953", // Brown
	"#FFD700", // Gold
	"#8A2BE2"  // BlueViolet
  ];

// Style for canvas segments
style = {
  curve: {
    width: 6,
    color: "#333"
  },
  line: {
    width: 5,
    color: "#C00"
  },
  point: {
    radius: 4,
    width: 2,
    color: "Black",
    fill: "Black",
    arc1: 0,
    arc2: 2 * Math.PI
  }
}

context1 = canvas.getContext("2d");
document.getElementById("resetButton").addEventListener("click", clearSegments);
document.getElementById("loadDefaultButton").addEventListener("click", defaultSegments);

function clearSegments(){
	window.segments = []; // Empty
	drawCanvas();
}

function defaultSegments(){
	window.segments = inputJSON.segments;
	drawCanvas();
}

drawCanvas();


//========= Auxiliary functions =========//


// Method to show mouse position relative to canvas as the mouse moves.
canvas.addEventListener('mousemove', function(e) {
	var rect = canvas.getBoundingClientRect();
	var x = e.clientX - Math.round(rect.left);
	var y = e.clientY - Math.round(rect.top);
	document.getElementById("mousepos").innerHTML = "(" + x + ", " + y + ")";
});

function drawCanvas() {
	// Clear everything
	context1.clearRect(-canvas.width / 2, -canvas.height / 2, 2 * canvas.width, 2 * canvas.height);
	// Draw whatever needs to be drawn
	console.log(segments);
	drawSegments(context1, style, window.segments); 
}

// Draws one point as circle
function drawPoint(ctx, style, p) {
    ctx.lineWidth = style.point.width;
    ctx.strokeStyle = style.point.color;
    ctx.fillStyle = style.point.fill;
    ctx.beginPath();
    ctx.arc(p.x, p.y, style.point.radius, style.point.arc1, style.point.arc2, true);
    ctx.fill();
    ctx.stroke();
}

// Draws one segment
function drawSegment(ctx, style, segment, lineColor) {
    p1 = segment.from;
	p2 = segment.to;

	// Line segment
    ctx.lineWidth = style.line.width;
	ctx.strokeStyle = lineColor;
    ctx.beginPath();
	ctx.moveTo(p1.x,p1.y);
	ctx.lineTo(p2.x,p2.y);
    ctx.stroke();
			
	// Draw vertices
	drawPoint(ctx, style, segment.from);
	drawPoint(ctx, style, segment.to);
}

function drawSegments(ctx, style, segments) {
	// Clear results span
	document.getElementById("result").innerHTML = "";

	//For each pair draw pair after classifying intersection
	for (var i = 0; i < window.segments.length; i=i+2) {
		// Classify intersection and obtain color to draw pair of segments
		var intersectionClass = classifyIntersection(segments[i], segments[i+1]);
		
		reportResult(intersectionClass); // print description
		var lineColor = colors[intersectionClass.type];
		// Draw segment 
		drawSegment(ctx, style, segments[i], lineColor);
		drawSegment(ctx, style, segments[i+1], lineColor);
	}
}

// Outputs the value of the intersection classification to the "results" HTML element
function reportResult(intersectionClass) {
	var text = "<font color='" + colors[intersectionClass.type] + "'>";
	text = text + intersectionClass.type + ": " + intersectionClass.description;
	text = text + "</font><br>";
	document.getElementById("result").innerHTML = document.getElementById("result").innerHTML + text;
}

//========= Your code probably should be somewhere here =========//


// Given a segment (from and to points) and a point, computes the area of the trapezoid
function computeArea(seg, pt) {
	return (seg.to.x - seg.from.x) * (pt.y - seg.from.y) - (seg.to.y - seg.from.y) * (pt.x - seg.from.x);
}

// Computes the dpt product of two vectors
function dotProduct(vec1, vec2) {
	return vec1.x * vec2.x + vec1.y * vec2.y;
}

// Determines whether two points are equal
function arePtsEq(p1, p2){
	return (p1.x == p2.x && p2.y == p1.y);
}

// Determines whether point pt lies inside the segment seg
function isPointInsideSegment(seg, pt, endsAllowed = true){

	if (computeArea(seg, pt) != 0) return false;

	if (!endsAllowed && (arePtsEq(seg.from, pt) || arePtsEq(seg.to, pt)))
		return false;

	var fstVect = {'x': pt.x - seg.from.x, 'y': pt.y - seg.from.y};
	var sndVect = {'x': pt.x - seg.to.x, 'y': pt.y - seg.to.y};

	if (dotProduct(fstVect, sndVect) > 0) return false;
	else return true;
}

// Determines whether segment s1 is completely inside segment s2
// Precondition: All four endpoints are colinear
function isSegmentInsideSegment(s1, s2){
	return (isPointInsideSegment(s2, s1.to) && isPointInsideSegment(s2, s1.from));
}

function classifyIntersection(s1, s2) {
	var intersectionType, intersectionTypeDescription;
	
	var fstFrom = computeArea(s1, s2.from);
	var fstTo   = computeArea(s1, s2.to);

	var sndFrom = computeArea(s2, s1.from);
	var sndTo   = computeArea(s2, s1.to);

	// Check if they intersect in an interior point
	if (fstFrom * fstTo < 0 && sndFrom * sndTo < 0) {
		intersectionType = 1;
		intersectionTypeDescription = "Interior point intersection";
	}
	// Check if all four points are collinear
	else if (fstFrom == 0 && fstTo == 0 && sndFrom == 0 && sndTo == 0) {

		// Check if they are coincident
		if ((arePtsEq(s1.to, s2.to) && arePtsEq(s1.from, s2.from)) || (arePtsEq(s1.from, s2.to) && arePtsEq(s1.to, s2.from))){
			intersectionType = 5;
			intersectionTypeDescription = "Coincident segments"
		}
		// Check if segment 1 completely shadows segment 2
		else if (isSegmentInsideSegment(s1, s2) || isSegmentInsideSegment(s2, s1)){
			intersectionType = 6;
			intersectionTypeDescription = "Multiple point intersection w/ total cover"
		}
		// Check if they intersect
		else if (isPointInsideSegment(s1, s2.from) || isPointInsideSegment(s1, s2.to) ||
				 isPointInsideSegment(s2, s1.from) || isPointInsideSegment(s2, s1.to)){
			if (arePtsEq(s1.from, s2.from) || arePtsEq(s1.to, s2.to) || arePtsEq(s1.to, s2.from) || arePtsEq(s2.to, s1.from)){
				intersectionType = 3;
				intersectionTypeDescription = "Double endpoint intersection";
			} else {
				intersectionType = 4;
				intersectionTypeDescription = "Multiple point intersection w/ partial cover";		
	
			}
		}
		else {
			intersectionType = 0;
			intersectionTypeDescription = "No intersection"
		}
	
	// Check if there is a one-endpoint intersection
	} else if (isPointInsideSegment(s1, s2.from) || isPointInsideSegment(s1, s2.to) ||
			   isPointInsideSegment(s2, s1.from) || isPointInsideSegment(s2, s1.to)){
		if (arePtsEq(s1.from, s2.from) || arePtsEq(s1.to, s2.to) || arePtsEq(s1.to, s2.from) || arePtsEq(s2.to, s1.from)){
			intersectionType = 3;
			intersectionTypeDescription = "Double endpoint intersection";
		} else {
			intersectionType = 2;
			intersectionTypeDescription = "Single endpoint intersection";		
	
		}
	
	// If everything fails, there is no intersection sadly
	} else {
		intersectionType = 0;
		intersectionTypeDescription = "No intersection";
	}
		
	// Return object with two fields: a numbered type, and a description
	return {"type": intersectionType, "description": intersectionTypeDescription} ;
}
// Important: these are the input data sets
var inputJSONs = [inputJSON1,inputJSON2,inputJSON3] ; 

var points = inputJSONs[0].points; // Default data set
var triangle = inputJSONs[0].triangle;

// See names colors at https://www.w3schools.com/colors/colors_names.asp
// Some colors you could use
var colors = [
	"#FF5733", // Red
	"#28CC45", // Green
	"#3357FF", // Blue
	"#FF33F3", // Pink
	"#836953", // Brown
	"#FFD700", // Gold
	"#8A2BE2"  // BlueViolet
  ];


// default styles
style = {
  curve: {
    width: 6,
    color: "#333"
  },
  line: {
    width: 2,
    color: "#000000"
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
context1.translate(120,150); // Translation so see full points
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
  document.getElementById("result").innerHTML = "";
  // Draw stuff
  drawPoints(context1, style, points, triangle); 
  drawTriangle(context1, style, triangle);

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

// Draws one triangle
function drawTriangle(ctx, style, t) {
	ctx.lineWidth = style.line.width;
	ctx.strokeStyle = style.line.color;
    ctx.beginPath();
	ctx.moveTo(t[0].x,t[0].y);
	ctx.lineTo(t[1].x,t[1].y);
	ctx.lineTo(t[2].x,t[2].y);
	ctx.lineTo(t[0].x,t[0].y);
    ctx.stroke();
}


// Draws all input points, with its classification color
function drawPoints(ctx, style, points, triangle) {

	for (var i = 0; i < points.length; i++) {
	
		var result = classifyPoint(points[i], triangle);
		style.point.fill = result.color;
		style.point.color = result.color;
		reportResult (result, i);
		drawPoint(ctx, style, points[i]);
	}
}

// Outputs the value of the intersection classification to the "results" HTML element
function reportResult(classification, index) {
	var text = "<font color='" + classification.color + "'>" + (index+1) + ":";
	text = text + classification.description;
	text = text + "</font><br>";
	document.getElementById("result").innerHTML = document.getElementById("result").innerHTML + text;
}

// Method to choose between the different data set
function changeDataSet() {
	var index = document.getElementById("dataset").value;
	// Change points and triangle
	points = inputJSONs[index].points; // Default dat set
	triangle = inputJSONs[index].triangle;
	drawCanvas(); // Redraw
}

//========= Your code somewhere here =========//

// Given a segment (from and to points) and a point, computes the area of the trapezoid
function getAreaSign(seg, pt) {
	var area = (seg.to.x - seg.from.x) * (pt.y - seg.from.y) - (seg.to.y - seg.from.y) * (pt.x - seg.from.x);

  if (area > 0) return 1;
  else if (area == 0) return 0;
  else return -1;
}

// TODO: Add your code here to classify the point w.r.t. the triangle
function classifyPoint(p, triangle) {
	// TODO Change this!
  var segments = [{from: triangle[0], to: triangle[1]}, 
                  {from: triangle[1], to: triangle[2]},
                  {from: triangle[2], to: triangle[0]}];
  
  var areas = segments.map(seg => getAreaSign(seg, p));

  if ((areas[0] > 0 && areas[1] > 0 && areas[2] > 0) || (areas[0] < 0 && areas[1] < 0 && areas[2] < 0))
  {
    return {"color": colors[1], "description": "Inside"} ;
  }
  else if (areas[0] == 0){
    if (areas[1] * areas[2] == 0) return {"color": colors[2], "description": "Coincides with vertex"};
    else if (areas[1] * areas[2] > 0) return {"color": colors[3], "description": "Coincides with one segment"};
    else return {"color": colors[0], "description": "Outside"};
  }
  else if (areas[1] == 0){
    if (areas[0] * areas[2] == 0) return {"color": colors[2], "description": "Coincides with vertex"};
    else if (areas[0] * areas[2] > 0) return {"color": colors[3], "description": "Coincides with one segment"};
    else return {"color": colors[0], "description": "Outside"};
  }
  else if (areas[2] == 0){
    if (areas[1] * areas[0] == 0) return {"color": colors[2], "description": "Coincides with vertex"};
    else if (areas[1] * areas[0] > 0) return {"color": colors[3], "description": "Coincides with one segment"};
    else return {"color": colors[0], "description": "Outside"};

  }
  else return {"color": colors[0], "description": "Outside"};
}

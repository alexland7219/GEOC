
//========= Auxiliary objects and data =========//

// Important: these are the input data sets
var inputJSONs = [inputJSON1,inputJSON2] ; 

var points = inputJSONs[0].points; // Default dat set
var circle_points = inputJSONs[0].circle_points;
var currentJSON = inputJSONs[0];

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
    width: 1,
    color: "#000"
  },
  point: {
    radius: 4,
    width: 2,
    color: "Black",
    fill: "Black",
    arc1: 0,
    arc2: 2 * Math.PI
  },
  circle: {
	color:"black",
	fill: "none",
    width: 2,
  }
}

context1 = canvas.getContext("2d");
context1.translate(320,320); // Translation so see full points
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
  drawPoints(context1, style, points, circle_points); 
  drawCircle(context1, style);

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

// Draws the circle
function drawCircle(ctx, style) {
	ctx.lineWidth = style.circle.width;
	ctx.strokeStyle = style.circle.color;
    ctx.beginPath();
    ctx.arc(currentJSON.c.x, currentJSON.c.y, currentJSON.r, style.point.arc1, style.point.arc2, true);
    ctx.stroke();
}


// Draws all input points, with its classification color
function drawPoints(ctx, style, points) {

	for (var i = 0; i < points.length; i++) {
	
		var result = classifyPoint(points[i], circle_points);
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
	circle_points = inputJSONs[index].circle_points;
	currentJSON=inputJSONs[index];
	drawCanvas(); // Redraw
}

//========= Your code somewhere here =========//

function determinant3x3(M){
    // Sarrus law
    pos = M[0][0] * M[1][1] * M[2][2] + M[0][1] * M[1][2] * M[2][0] + M[0][2] * M[1][0] * M[2][1];
    neg = M[0][2] * M[1][1] * M[2][0] + M[0][1] * M[1][0] * M[2][2] + M[0][0] * M[1][2] * M[2][1];
    
    return pos - neg;
}

function testCCWorder(circle_points){
    var mx = [[circle_points[0].x, circle_points[0].y, 1],
              [circle_points[1].x, circle_points[1].y, 1],
              [circle_points[2].x, circle_points[2].y, 1]                
            ];

    return determinant3x3(mx) > 0;
}

// TODO: Add your code here to classify the point w.r.t. the circle given by three points
function classifyPoint(p, circle_points) {
	// TODO Change this!
    var a = circle_points[0];
    var b = circle_points[0];
    var c = circle_points[0];

    var dax = circle_points[0].x - p.x;
    var day = circle_points[0].y - p.y;
    var dbx = circle_points[1].x - p.x;
    var dby = circle_points[1].y - p.y;
    var dcx = circle_points[2].x - p.x;
    var dcy = circle_points[2].y - p.y;

    var mx = [[dax, day, dax*dax + day*day],
               [dbx, dby, dbx*dbx + dby*dby],
               [dcx, dcy, dcx*dcx + dcy*dcy]];

    var det = determinant3x3(mx);
    var ccw = testCCWorder(circle_points);

    if (det == 0){
        // On the circle
        var color = colors[2];
        var description = "On the circle";
        return {"color": color, "description": description} ;
    }
    else if ((det > 0 && ccw) || (det < 0 && !ccw)){
        // Inside the circle
        var color = colors[1];
        var description = "Inside the circle";
        return {"color": color, "description": description} ;
    } else {
        // Outside the circle
        var color = colors[0];
        var description = "Outside the circle";
        return {"color": color, "description": description} ;
        
    }
}

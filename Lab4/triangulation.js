/**
 TODO Replace this by your own, correct, triangulation function
 Triangles should be return as arrays of array of indexes
 e.g., [[1,2,3],[2,3,4]] encodes two triangles, where the indices are relative to the array points
**/
function computeTriangulation(points) {
	// Wrong code! Just connects consecutive three after sorting by x-coord
	// Note that this does NOT return a triangulation, just a subset of it
	//var newPoints = points.sort(function(a,b) { if ((a.x) < (b.x)) return -1; else return 1;})
	var k = Math.floor(points.length/3); 
	var outputTriangles = new Array(k); 
	
	for (i=0;i<k;i++) {
		// This is how one triangle is represented: array of three point indices
		outputTriangles[i] = [3*i, 3*i+1, 3*i+2]; // Store INDICES, not points
	}

	return outputTriangles;
}




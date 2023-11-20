
// Computes a triangulation and populates the DCEL
function computeTriangulation(points) {

	var dcel_ds = new DCEL();
	var delta = (extents.xmax - extents.xmin) / 2;

	// Three point to add to the set
	var a = {x: extents.xmin - delta, y:extents.ymin - delta, z:0};
	var b = {x: extents.xmax + delta, y:extents.ymin - delta, z:0};
	var c = {x: extents.xmin + (extents.xmax - extents.xmin) / 2, 
			 y: extents.ymax + ((extents.ymax - a.y) / delta) * delta, z:0};
	
	dcel_ds.addVertex(a.x, a.y, false);
	dcel_ds.addVertex(b.x, b.y, false);
	dcel_ds.addVertex(c.x, c.y, false);

	var k = Math.floor(points.length/3); 
	var outputTriangles = new Array(k); 
	
	for (i=0;i<k;i++) {
		// This is how one triangle is represented: array of three point indices
		outputTriangles[i] = [3*i, 3*i+1, 3*i+2]; // Store INDICES, not points
	}

	return outputTriangles;
}




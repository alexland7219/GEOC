
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

	// Adding the first three points to make a triangle
	dcel_ds.addEdge(0, 1);
	dcel_ds.addEdge(1, 2);
	dcel_ds.addEdge(2, 0);

	// Next points will have an offset of +3 (because of the first three points)
	for (let i = 0; i < points.length; ++i){
		
		dcel_ds.addVertex(points[i].x, points[i].y, true);
	}

	return [];
}





// Computes a triangulation and populates the DCEL
function computeTriangulation(points) {

	var dcel_ds = new DCEL();
	var delta = (extents.xmax - extents.xmin) / 2;

	// Three point to add to the set
	var a = {x: extents.xmin - delta, y:extents.ymin - delta, z:0};
	var b = {x: extents.xmax + delta, y:extents.ymin - delta, z:0};
	var c = {x: extents.xmin + (extents.xmax - extents.xmin) / 2, 
			 y: extents.ymax + ((extents.ymax - a.y) / delta) * delta, z:0};
	
	points.push(a);
	points.push(b);
	points.push(c);

	// Ternary Tree
	var tree_ds = new Ternary(a, b, c, points.length - 3, points.length - 2, points.length - 1);

	dcel_ds.addVertex(a.x, a.y, false);
	dcel_ds.addVertex(b.x, b.y, false);
	dcel_ds.addVertex(c.x, c.y, false);

	// Adding the first three points to make a triangle
	dcel_ds.addEdge(0, 1);
	dcel_ds.addEdge(1, 2);
	dcel_ds.addEdge(2, 0);

	var finalSet = [];

	for (let i = 0; i < points.length - 3; ++i){
		
		dcel_ds.addVertex(points[i].x, points[i].y, true);

		tree_ds.addPoint(points[i], i);
		
		//finalSet.push([newEdges[0], newEdges[1], i]);
		//finalSet.push([newEdges[1], newEdges[2], i]);
		//finalSet.push([newEdges[2], newEdges[0], i]);
	}

	// DFS through the tree. Get smallest triangles.
	return tree_ds.dfs();
}




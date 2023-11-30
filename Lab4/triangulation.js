
// Computes a triangulation and populates the DCEL
function computeTriangulation(points) {

	var dcel_ds = new DCEL();
	var delta = (extents.xmax - extents.xmin) / 2;

	// Three point to add to the set
	var a = {x: extents.xmin - delta, y:extents.ymin - delta, z:0};
	var b = {x: extents.xmax + delta, y:extents.ymin - delta, z:0};
	var c = {x: extents.xmin + (extents.xmax - extents.xmin) / 2, 
			 y: extents.ymax + ((extents.ymax - a.y) / delta) * delta, z:0};
	
	points.unshift(a);
	points.unshift(b);
	points.unshift(c);

	// Ternary Tree
	var tree_ds = new Ternary(a, b, c, 2, 1, 0);

	dcel_ds.addVertex(c.x, c.y, false);
	dcel_ds.addVertex(b.x, b.y, false);
	dcel_ds.addVertex(a.x, a.y, false);

	// Adding the first three points to make a triangle
	dcel_ds.addEdge(2, 1);
	dcel_ds.addEdge(1, 0);
	dcel_ds.addEdge(0, 2);


	for (let i = 3; i < points.length; ++i){
		
		dcel_ds.addVertex(points[i].x, points[i].y, true);

		var innerTriangle = tree_ds.addPoint(points[i], i);
		
		if (innerTriangle.length != 4){
			for (let j = 0; j < innerTriangle.length; ++j) dcel_ds.addEdge(i, innerTriangle[j]);
		}
		else {
			dcel_ds.splitEdge(innerTriangle[1], innerTriangle[2], i);
			dcel_ds.addEdge(i, innerTriangle[0]);

		}
	}

	// Finished. Only thing left is to create the faces.
	var triangles = tree_ds.dfs();

	for (let tidx = 0; tidx < triangles.length; ++tidx){
		dcel_ds.addFace(triangles[tidx][0], triangles[tidx][1], triangles[tidx][2]);
	}

	console.log(dcel_ds);

	// DFS through the tree. Get smallest triangles.
	return tree_ds.dfs();
}




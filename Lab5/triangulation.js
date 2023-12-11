
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
	//var tree_ds = new Ternary(a, b, c, 2, 1, 0);

	dcel_ds.addVertex(c.x, c.y, false);
	dcel_ds.addVertex(b.x, b.y, false);
	dcel_ds.addVertex(a.x, a.y, false);

	// Adding the first three points to make a triangle
	dcel_ds.addEdge(2, 1);
	dcel_ds.addEdge(1, 0);
	dcel_ds.addEdge(0, 2);

	dcel_ds.addFace(0, 1, 2);

	// Buckets holds a reference (index) to the face (fcVector)
	var buckets = [];
	for (let i = 0; i < points.length; ++i) buckets.push(0);

	// We shall employ a bucket approach to locate the new sites
	// 
	// Each face can be thought of a bucket containing the sites that have yet to be inserted.
	// When we flip triangles, the buckets of the removed triangles will need to be updated.
	// Initially, all points fall inside the bucket of the super triangle.

	for (let i = 3; i < points.length; ++i)
	{
		var p = points[i];
		var faceInside = dcel_ds.fcVector[i]; // This is the face where the point lands

		dcel_ds.addVertex(p);
		
		var ab = undefined;
		var bc = undefined;
		var ca = undefined;

		var currEdge = faceInside.edge;

		while (ab == undefined || bc == undefined || ac == undefined)
		{
			// Find vertices ab, bc, ac
			if (currEdge.from == faceInside.vA && currEdge.next.from == faceInside.vB) ab = currEdge;
			else if (currEdge.from == faceInside.vB && currEdge.next.from == faceInside.vC) bc = currEdge;
			else if (currEdge.from == faceInside.vC && currEdge.next.from == faceInside.vA) ca = currEdge;
			else if (currEdge.from == faceInside.vA && currEdge.next.from == faceInside.vC) ca = currEdge.twin;
			else if (currEdge.from == faceInside.vB && currEdge.next.from == faceInside.vA) ab = currEdge.twin;
			else if (currEdge.from == faceInside.vC && currEdge.next.from == faceInside.vB) bc = currEdge.twin;
		}

		dcel_ds.addEdge(i, faceInside.vA);
		dcel_ds.addEdge(i, faceInside.vB);
		dcel_ds.addEdge(i, faceInside.vC);

		// Now we know ab, bc and ca
		dcel_ds.swapTest(i, ab);
		dcel_ds.swapTest(i, bc);
		dcel_ds.swapTest(i, ca);
	}

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

		// Now Delaunay takes effect and will fix edges

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
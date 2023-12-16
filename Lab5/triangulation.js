
// Computes a triangulation and populates the DCEL
function computeTriangulation(points, boundaries) {

	var dcel_ds = new DCEL();
	var delta = (extents.xmax - extents.xmin) / 2;

	// Three point to add to the set
	var a = {x: extents.xmin - delta, y:extents.ymin - delta, z:0};
	var b = {x: extents.xmax + delta, y:extents.ymin - delta, z:0};
	var c = {x: extents.xmin + (extents.xmax - extents.xmin) / 2, 
			 y: extents.ymax + ((extents.ymax - a.y) / delta) * delta + 4, z:0};
	
	points.unshift(a);
	points.unshift(b);
	points.unshift(c);

	// Ternary Tree
	var tree_ds = new Ternary(a, b, c, 2, 1, 0, null);
	tree_ds.root = tree_ds;

	dcel_ds.addVertex(c.x, c.y, false);
	dcel_ds.addVertex(b.x, b.y, false);
	dcel_ds.addVertex(a.x, a.y, false);

	// Adding the first three points to make a triangle
	dcel_ds.addEdge(2, 1);
	dcel_ds.addEdge(1, 0);
	dcel_ds.addEdge(0, 2);

	for (let i = 3; i < points.length; ++i){
		console.log("Vertex " + i);
		//if (i == 564) break;

		dcel_ds.addVertex(points[i].x, points[i].y, true);
		tree_ds.addPoint(points[i], i, dcel_ds);
	}

	

	// Finished. Only thing left is to create the faces.
	var beforePruningTrigs = tree_ds.dfs(0);

	for (let tidx = 0; tidx < beforePruningTrigs.length; ++tidx){
		dcel_ds.addFace(beforePruningTrigs[tidx][0], beforePruningTrigs[tidx][1], beforePruningTrigs[tidx][2]);
	}

	// DCEL
	console.log(dcel_ds);


	// Boundary Pruning
		// Traverse the boundaries
	for (let i = 0; i < boundaries.length; ++i){

		if (boundaries[i].length == 1){
			// Remove all incident edges emanating from the vertex
			var edges = dcel_ds.vxVector[boundaries[i][0] + 3].edges;
			for (let e = 0; e < edges.length; ++e)
			{
				// Remove the face
				var face = edges[e].face;
				var node = Ternary.findANode(face.vA, face.vB, face.vC);
				node.visited[1] = true; // Dont count in the DFS
			}

			continue;
		}
		
		// Else
		var len = boundaries[i].length;

		for (let j = 0; j < len; ++j){
			// Take the previous and next
			var current = boundaries[i][j] + 3;
			var next    = boundaries[i][(j+1)%len] + 3;
			var prev    = boundaries[i][(j-1+len)%len] + 3;

			var edges = dcel_ds.vxVector[current].edges;
			
			var dX2 = dcel_ds.vxVector[next].x - dcel_ds.vxVector[current].x;
			var dY2 = dcel_ds.vxVector[next].y - dcel_ds.vxVector[current].y;

			var dX1 = - dcel_ds.vxVector[current].x + dcel_ds.vxVector[prev].x;
			var dY1 = - dcel_ds.vxVector[current].y + dcel_ds.vxVector[prev].y;

			var angle1 = (((Math.atan2(dY1, dX1) * 180) / Math.PI) + 360) % 360;
			var angle2 = (((Math.atan2(dY2, dX2) * 180) / Math.PI) + 360) % 360;

			var minAngle = Math.min(angle1, angle2);
			var maxAngle = Math.max(angle1, angle2);

			if (current == 520){
				console.log(minAngle);
				console.log(maxAngle);
				console.log(angle1);
				console.log(angle2);
			}

			for (let e = 0; e < edges.length; ++e){
				// Decide to eliminate or not the face that follows PREV -> CURR ---[edge]---> EDGE.NEXT.FROM
				var altAngle = (edges[e].angle + 360) % 360;

				if (current == 520 && edges[e].next.from == 521) console.log(altAngle);

				if (((altAngle > maxAngle + 0.00001 || altAngle < minAngle - 0.00001) && angle1 == maxAngle) || 
					((altAngle < maxAngle - 0.00001 && altAngle > minAngle + 0.00001) && angle2 == maxAngle)){
					// So, you have chosen death
					var face = edges[e].face;

					var node = Ternary.findANode(face.vA, face.vB, face.vC);
					node.visited[1] = true; // Dont count in the DFS
				}
			}
		}
	}

	var triangles = tree_ds.dfs(1);

	return [triangles, dcel_ds];
}
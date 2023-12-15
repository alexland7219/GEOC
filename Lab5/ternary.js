// Node of the ternary tree
class Node {

    constructor(a, b, c, idA, idB, idC){
        this.a = a;
        this.b = b;
        this.c = c;
        this.idA = idA;
        this.idB = idB;
        this.idC = idC;
    }

    sign(seg, pt){
        var area = (seg.to.x - seg.from.x) * (pt.y - seg.from.y) - (seg.to.y - seg.from.y) * (pt.x - seg.from.x);

        if (area > 0) return 1;
        else if (area == 0) return 0;
        else return -1;
    }
        
    pointInNode(p){
        var segments = [{from: this.a, to: this.b}, 
                        {from: this.b, to: this.c},
                        {from: this.c, to: this.a}];

        var areas = segments.map(seg => this.sign(seg, p));

        if ((areas[0] > 0 && areas[1] > 0 && areas[2] > 0) || (areas[0] < 0 && areas[1] < 0 && areas[2] < 0))
        {
          return {in: true, on: false};
        }
        else if (areas[0] == 0){
          if (areas[1] * areas[2] >= 0) return {in: false, on: true, freeVx: this.idC};
          else return {in: false, on: false};
        }
        else if (areas[1] == 0){
          if (areas[0] * areas[2] >= 0) return {in: false, on: true, freeVx: this.idA};
          else return {in: false, on: false};
        }
        else if (areas[2] == 0){
        if (areas[1] * areas[0] >= 0) return {in: false, on: true, freeVx: this.idB};
          else return {in: false, on: false};
      
        }
        else return {in: false, on: false};
      
    }

    determinant3x3(M){
        // Sarrus law
        pos = M[0][0] * M[1][1] * M[2][2] + M[0][1] * M[1][2] * M[2][0] + M[0][2] * M[1][0] * M[2][1];
        neg = M[0][2] * M[1][1] * M[2][0] + M[0][1] * M[1][0] * M[2][2] + M[0][0] * M[1][2] * M[2][1];
        
        return pos - neg;
    }
    
    testCCWorder(circle_points){
        var mx = [[circle_points[0].x, circle_points[0].y, 1],
                  [circle_points[1].x, circle_points[1].y, 1],
                  [circle_points[2].x, circle_points[2].y, 1]                
                ];
    
        return determinant3x3(mx) > 0;
    }
    
    pointInCircle(p) {
        var dax = this.a.x - p.x;
        var day = this.a.y - p.y;
        var dbx = this.b.x - p.x;
        var dby = this.b.y - p.y;
        var dcx = this.c.x - p.x;
        var dcy = this.c.y - p.y;

        var mx = [[dax, day, dax*dax + day*day],
                [dbx, dby, dbx*dbx + dby*dby],
                [dcx, dcy, dcx*dcx + dcy*dcy]];

        var det = determinant3x3(mx);
        var ccw = testCCWorder(circle_points);

        if (det == 0){
            return false; // On the circle
        }
        else if ((det > 0 && ccw) || (det < 0 && !ccw)) return true;
        else return false;
    }
}

// This class implements a ternary tree for fast triangle lookup
class Ternary {
    static mapToFind = new Map();

    constructor(a, b, c, idA, idB, idC, root){
        // a, b, c are the initial 3 vertices of the root triangle
        this.node = new Node(a, b, c, idA, idB, idC);
        // Virtual: Boolean that tells us whether it is a triangle that disappeared
        this.virtual = false;
        this.virtLeft = null;
        this.virtRight= null;
        // Children
        this.left = null;
        this.bottom = null;
        this.right = null;
        // root
        this.root = root;

        // Visited in the final DFS
        this.visited = false;

        Ternary.mapToFind.set(JSON.stringify([idA, idB, idC]), this);
    }

    static findANode(idA, idB, idC)
    {
        var x = Ternary.mapToFind.get(JSON.stringify([idA, idB, idC]));
        if (x == undefined) x = Ternary.mapToFind.get(JSON.stringify([idA, idC, idB]));
        if (x == undefined) x = Ternary.mapToFind.get(JSON.stringify([idB, idA, idC]));
        if (x == undefined) x = Ternary.mapToFind.get(JSON.stringify([idB, idC, idA]));
        if (x == undefined) x = Ternary.mapToFind.get(JSON.stringify([idC, idA, idB]));
        if (x == undefined) x = Ternary.mapToFind.get(JSON.stringify([idC, idB, idA]));

        return x;
    }

    swap(idA, idB, idP, dcel_ds)
    {
        // Swaps A, B, P (D) if it is not Delaunay and possibly recursively more
        var bflip = dcel_ds.swapTest(idA, idB, idP);

        if (bflip.swap)
        {
            var idD     = bflip.other;
            var nodeOne = Ternary.findANode(idA, idB, idP);
            if (nodeOne == undefined){
                console.log(Ternary.mapToFind);
                console.log(Ternary.mapToFind.get([1, 3, 4]));
                console.log("I was just trying to find node " + idA + ' ' + idB + " " + idP + " please");
                throw new Error("another fuckup");
            }         
            var nodeTwo = Ternary.findANode(idA, idB, idD);

            var leftNewTriangle  = new Ternary(dcel_ds.vxVector[idA], dcel_ds.vxVector[idP], dcel_ds.vxVector[idD], idA, idP, idD, this.root);
            var rightNewTriangle = new Ternary(dcel_ds.vxVector[idB], dcel_ds.vxVector[idP], dcel_ds.vxVector[idD], idB, idP, idD, this.root);

            nodeOne.virtual = true;
            nodeTwo.virtual = true;

            nodeOne.virtLeft = leftNewTriangle;
            nodeTwo.virtLeft = leftNewTriangle;
            nodeOne.virtRight= rightNewTriangle;
            nodeTwo.virtRight= rightNewTriangle;

            dcel_ds.removeEdge(idA, idB);
            dcel_ds.addEdge(idP, idD);

            // Now test for edges DA and DB
            console.log("recursion in swap");
            this.swap(idB, idD, idP, dcel_ds);
            this.swap(idA, idD, idP, dcel_ds);
        }

        console.log("We returned false so we outta here (swap)");
    }


    addPoint(p, id, dcel_ds){
        console.log("Add point");

        if (this.left == null && !this.virtual){

            var myTest = this.node.pointInNode(p);

            if (myTest.in){

                this.left = new Ternary(this.node.a, this.node.b, p, this.node.idA, this.node.idB, id, this.root);
                this.right = new Ternary(this.node.a, this.node.c, p, this.node.idA, this.node.idC, id, this.root);
                this.bottom = new Ternary(this.node.b, this.node.c, p, this.node.idB, this.node.idC, id, this.root);

                dcel_ds.addEdge(id, this.node.idA);
                dcel_ds.addEdge(id, this.node.idB);
                dcel_ds.addEdge(id, this.node.idC);

                console.log('adding point inside triangle ' + this.node.idA + " " + this.node.idB + " " + this.node.idC);
                
                console.log("Cheecking the main swap 1");
                this.swap(this.node.idA, this.node.idB, id, dcel_ds);
                console.log("Cheecking the main swap 2");
                this.swap(this.node.idB, this.node.idC, id, dcel_ds);
                console.log("Cheecking the main swap 3");
                this.swap(this.node.idC, this.node.idA, id, dcel_ds);

                console.log("Made the necessary swaps. Not exiting");

                return;
                //return [this.node.idA, this.node.idB, this.node.idC];
    
            } else {
                console.log("Degeneracy on addPoint with id " + id);
                throw new Error("FUCKING DEGENERAYE");
                // DEGENERATE CASE
                switch (myTest.freeVx){
                    case this.node.idA:
                        this.left = new Ternary(this.node.a, this.node.b, p, this.node.idA, this.node.idB, id, this.root);
                        this.right = new Ternary(this.node.a, this.node.c, p, this.node.idA, this.node.idC, id, this.root);
                
                        dcel_ds.splitEdge(this.node.idB, this.node.idC, id);
                        dcel_ds.addEdge(id, this.node.idA);

                        return;

                    case this.node.idB:
                        this.left = new Ternary(this.node.a, this.node.b, p, this.node.idA, this.node.idB, id, this.root);
                        this.right = new Ternary(this.node.b, this.node.c, p, this.node.idB, this.node.idC, id, this.root);

                        dcel_ds.splitEdge(this.node.idA, this.node.idC, id);
                        dcel_ds.addEdge(id, this.node.idB);

                        return;

                    default: // idC
                        this.left = new Ternary(this.node.a, this.node.c, p, this.node.idA, this.node.idC, id, this.root);
                        this.right = new Ternary(this.node.b, this.node.c, p, this.node.idB, this.node.idC, id, this.root);

                        dcel_ds.splitEdge(this.node.idA, this.node.idB, id);
                        dcel_ds.addEdge(id, this.node.idC);

                        return;
                }
            }

        } else if (!this.virtual) {
            // Determine if the point lies on a segment
            var leftTest = this.left.node.pointInNode(p);
            if (leftTest.in) return this.left.addPoint(p, id, dcel_ds);

            var rightTest= this.right.node.pointInNode(p);
            if (rightTest.in) return this.right.addPoint(p, id, dcel_ds);

            var bottomTest = (this.bottom == null ? null : this.bottom.node.pointInNode(p));
            if (bottomTest != null) if (bottomTest.in) return this.bottom.addPoint(p, id, dcel_ds);

            // Point lies on the edge of this triangle, or between two subdivisions

            if (leftTest.on) return this.left.addPoint(p, id, dcel_ds);
            else if (rightTest.on) return this.right.addPoint(p, id, dcel_ds);
            else if (bottomTest != null){
                if (bottomTest.on) return this.bottom.addPoint(p, id, dcel_ds);
            }

        } else {
            // Virtual node. We have to test in which of the two triangles lies
            var leftTest = this.virtLeft.node.pointInNode(p);
            if (leftTest.in) return this.virtLeft.addPoint(p, id, dcel_ds);

            var rightTest = this.virtRight.node.pointInNode(p);
            if (rightTest.in) return this.virtRight.addPoint(p, id, dcel_ds);
        }
    }

    // Returns a list of all triangles (triplets).
    dfs(){
        if (this.visited) return [];

        this.visited = true;

        if (!this.virtual && this.left == null){
            console.log("NOT Virtual and Leaf");

            return [[this.node.idA, this.node.idB, this.node.idC]];
        }
        else if (!this.virtual){
            console.log("Not virtual not leaf");
            var retList = [];

            retList = retList.concat(this.left.dfs());
            retList = retList.concat(this.right.dfs());
            if (this.bottom != null) retList = retList.concat(this.bottom.dfs());

            return retList;
        }
        else {
            console.log("virtual");
            // Virtual node
            var retList = [];

            retList = retList.concat(this.virtLeft.dfs());
            retList = retList.concat(this.virtRight.dfs());

            return retList;
        }
    }

}
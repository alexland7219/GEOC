// This class implements a DCEL
class DCEL {
    constructor() {
        this.vxVector = []; // Vector table
        this.egVector = []; // Half-edge table
        this.fcVector = []; // Face table
    }

    addVertex(x, y, isOrig = true){
        var v = new Vertex(x, y, isOrig);
        this.vxVector.push(v);
    }

    getNextEdge(v, angle, ccw = true){
        //console.log("Getting next edge continuing at vertex " + v + " from an angle of " + angle + " " + ccw);
        if (this.vxVector[v].edges == undefined || this.vxVector[v].edges.length == 0){
            return null;
        }

        if (ccw){
            var x = this.vxVector[v].edges.reduce((accEdge, newEdge) => (
                newEdge.angle == angle ? accEdge : (  // If the smallest angle is 0 (twin), really it's the last one
                (angle - newEdge.angle + 360) % 360 < (angle - accEdge.angle + 360) % 360 ? newEdge : accEdge)
            ));
            //console.log(x);
            return x;
        }
        else {
            var x = this.vxVector[v].edges.reduce((accEdge, newEdge) => (
                newEdge.angle == angle ? accEdge : (
                (angle - newEdge.angle + 360) % 360 > (angle - accEdge.angle + 360) % 360 ? newEdge : accEdge)
            ));
            //console.log(x.twin);
            return x.twin;
        }
    }

    addEdge(vA, vB){

        if (this.vxVector.length <= Math.max(vA, vB)){
            console.log("ERROR: Unknown " + Math.max(vA, vB) + " vertex.");
            return;
        }

        // Create half-edge instances
        // He1 goes from vA to vB. He2 does the inverse walk.
        var he1 = new HalfEdge(vA, null, null, null, null, 0);
        var he2 = new HalfEdge(vB, null, null, null, null, 0);

        this.egVector.push(he1); this.egVector.push(he2); 

        he1.twin = he2; he2.twin = he1;

        this.vxVector[vA].edges.push(he1);
        this.vxVector[vB].edges.push(he2);

        // Will also set the same angle for he2
        he1.computeAngle(this.vxVector[vB].x - this.vxVector[vA].x, this.vxVector[vB].y - this.vxVector[vA].y);

        he1.next = this.getNextEdge(vB, he2.angle, true);
        he2.next = this.getNextEdge(vA, he1.angle, true);
        he1.prev = this.getNextEdge(vA, he1.angle, false);
        he2.prev = this.getNextEdge(vB, he2.angle, false);

        he1.next.prev = he1;
        he2.next.prev = he2;
        he1.prev.next = he1;
        he2.prev.next = he2;

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
    
        return this.determinant3x3(mx) > 0;
    }
    
    inCircle(vA, vB, vC, vP) {
        var a = this.vxVector[vA];
        var b = this.vxVector[vB];
        var c = this.vxVector[vC];
        var p = this.vxVector[vP];

        var circle_points = [a, b, c];

        var dax = a.x - p.x;
        var day = a.y - p.y;
        var dbx = b.x - p.x;
        var dby = b.y - p.y;
        var dcx = c.x - p.x;
        var dcy = c.y - p.y;

        var mx = [[dax, day, dax*dax + day*day],
                [dbx, dby, dbx*dbx + dby*dby],
                [dcx, dcy, dcx*dcx + dcy*dcy]];

        var det = determinant3x3(mx);
        var ccw = testCCWorder(circle_points);

        if (det == 0){
            // On the circle
        }
        else if ((det > 0 && ccw) || (det < 0 && !ccw)) return true;
        else return false;
    }


    swapTest(p, edgeAB)
    {
        // Swap test
        // Will also swap recursively

        // First determine d, the opposing vertex of the edge A-B
        var a = edgeAB.from;
        var b = edgeAB.next.from;
        var d = edgeAB.next.next.from;

        if (d == vP) d = edgeAB.twin.next.next.from;

        if (this.inCircle(b, p, a, d))
        {
            // Flip edge AB

            this.swapTest(p, edgeAD);
            this.swapTest(p, edgeBD);
        }

    }

    addFace(idA, idB, idC){
        // New face
        var f = new Face(idA, idB, idC);
        this.fcVector.push(f);

        // Start a walk from vA to vB
        var e1 = this.vxVector[idA].edges.find((edge)=> edge.twin.from == idB);
        if (e1 != undefined)
        {
            var e2 = e1.next;
            var e3 = e2.next;

            if (e3.next == e1 && e3.from == idC){
                // Correct
                e1.face = f;
                e2.face = f;
                e3.face = f;

                f.edge = e1;
                return;
            }
        }   
        // Incorrect path. Try again
        e1 = this.vxVector[idB].edges.find((edge)=> edge.twin.from == idA);
        if (e1 != undefined){
            e2 = e1.next;
            e3 = e2.next;
    
            if (e3.next == e1 && e3.from == idC){
                // Correct
                e1.face = f;
                e2.face = f;
                e3.face = f;
    
                f.edge = e1;
                return;
            }    
        }

        // Degeneracy. Triangle has over 3 edges.
        // We have to search a ton of stuff.
        for (let ei = 0; ei < this.vxVector[idA].edges.length; ++ei){
            // Traverse
            var visitedEdges = [];
            var visitedB = false;
            var visitedC = false;

            var nextEdge = this.vxVector[idA].edges[ei];
            let i = 0;

            while (i < 1000000){
                visitedEdges.push(nextEdge);
                nextEdge = nextEdge.next;

                if (nextEdge.from == idB) visitedB = true;
                else if (nextEdge.from == idC) visitedC = true;
                else if (nextEdge.from == idA) break;

                ++i;
            }
        
            if (visitedB && visitedC){
                for (let ej = 0; ej < visitedEdges.length; ++ej){
                    visitedEdges[ej].face = f;
                    f.edge = this.vxVector[idA].edges[ei];
                }

                break;
            }
        }
    }

    splitEdge(vA, vB, newPt){
        // newPt must be new (not have any edges)
        var dX = this.vxVector[vB].x - this.vxVector[vA].x;
        var dY = this.vxVector[vB].y - this.vxVector[vA].y;

        //var he1 = this.egVector.find((edge) => edge.twin.from == vB && edge.from == vA);
        var he1 = this.vxVector[vA].edges.find((edge) => edge.twin.from == vB);
        var he2 = he1.twin;

        var he3 = new HalfEdge(newPt, null, null, null, null, 0);
        var he4 = new HalfEdge(newPt, null, null, null, null, 0);

        this.egVector.push(he3); this.egVector.push(he4);

        this.vxVector[newPt].edges.push(he4);
        this.vxVector[newPt].edges.push(he3);

        he1.next = he3;
        he2.next = he4;

        he3.angle = he1.angle;
        he4.angle = he2.angle;

        he1.twin = he4;
        he2.twin = he3;
        he3.twin = he2;
        he4.twin = he1;

        he3.prev = he1;
        he4.prev = he2;

        he3.next = this.getNextEdge(vB, he2.angle, true);
        he4.next = this.getNextEdge(vA, he1.angle, true);

        
    }

    removeEdge(vA, vB){

        var he1 = this.vxVector[vA].edges.find((edge) => edge.twin.from == vB);
        var he2 = he1.twin;

        var prevHe1 = he1.prev;
        var prevHe2 = he2.prev;
        var nextHe1 = he1.next;
        var nextHe2 = he2.next;

        // Removing
        this.vxVector[vA].removeEdge(he1);
        this.vxVector[vB].removeEdge(he2);

        this.egVector = this.egVector.filter(item => (item.angle != he1.angle || item.from != he1.from));
        this.egVector = this.egVector.filter(item => (item.angle != he2.angle || item.from != he2.from));

        prevHe1.next = this.getNextEdge(vA, prevHe1.twin.angle, true);
        prevHe2.next = this.getNextEdge(vB, prevHe2.twin.angle, true);
        nextHe1.prev = this.getNextEdge(vB, nextHe1.angle, false);
        nextHe2.prev = this.getNextEdge(vA, nextHe2.angle, false);
    }
}
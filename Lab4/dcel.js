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
}
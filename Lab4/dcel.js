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
        console.log("Getting next edge continuing at vertex " + v + " from an angle of " + angle);
        if (this.vxVector[v].edges == undefined || this.vxVector[v].edges.length == 0){
            return null;
        }

        if (ccw){
            var x = this.vxVector[v].edges.reduce((accEdge, newEdge) => (
                newEdge.angle == angle ? accEdge : (  // If the smallest angle is 0 (twin), really it's the last one
                (angle - newEdge.angle) % 360 < (angle - accEdge.angle) ? newEdge : accEdge)
            ));
            console.log(x);
            return x;
        }
        else {
            return this.vxVector[v].edges.reduce((accEdge, newEdge) => (
                newEdge.angle == angle ? accEdge : (
                (angle - newEdge.angle) % 360 > (angle - accEdge.angle) ? newEdge : accEdge)
            ));
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

        he1.next.prev = he1;

        he2.next = this.getNextEdge(vA, he1.angle, true);

        he2.next.prev = he2;

        he1.prev = this.getNextEdge(vB, he2.angle, false);

        he1.prev.next = he1;

        he2.prev = this.getNextEdge(vA, he1.angle, false);

        he2.prev.next = he2;
    }
}
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

        he1.next = this.vxVector[vB].edges.reduce((accEdge, newEdge) => (
            (newEdge.angle - he1.angle) % 360 < (accEdge.angle - he1.angle) % 360 ? newEdge : accEdge
        ));

        he1.next.prev = he1;

        he2.next = this.vxVector[vA].edges.reduce((accEdge, newEdge) => (
            (newEdge.angle - he2.angle) % 360 < (accEdge.angle - he2.angle) % 360 ? newEdge : accEdge
        ));    

        he2.next.prev = he2;

        he1.prev = he2.next;
        he2.prev = he1.next;
    }
}
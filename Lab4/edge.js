// Represents a half edge of the DCEL
class HalfEdge {
    constructor(from, twin, face, next, prev) {
        this.from = from; // Origin vertex
        this.twin = twin; // Twin of this half edge
        this.face = face; // Face on the right
        this.next = next; // Next half-edge
        this.prev = prev; // Previous half-edge
    }

    // Given slope of the edge computes the degrees
    computeAngle(dX, dY){
        this.angle = (Math.atan2(dY, dX) * 180) / Math.PI;
        this.twin.angle = (180 + this.angle) % 360;

        console.log("Edge with dx = " + dX + " and dy " + dY + " has angle " + this.angle + " and twin " + this.twin.angle);
    }
}
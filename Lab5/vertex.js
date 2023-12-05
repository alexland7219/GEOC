// Implements a Vertex in a DCEL
class Vertex {
    constructor(x, y, original = true){
        this.x = x;
        this.y = y;
        this.original = original;
        this.edges = []; // List of all half-edges emmanating from this vertex
    }

    addHalfEdge(idx){
        this.edges.push(idx);
    }

    removeHalfEdge(edge)
    {
        this.edges = this.edges.filter(item => (item.angle != edge.angle || item.from != edge.from));
    }

    getPos(){
        return {'x': this.x, 'y': this.y};
    }
}
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

    sign(p1, p2, p3){
        return (p1.x - p3.x) * (p2.y - p3.y) - (p2.x - p3.x) * (p1.y - p3.y);
    }

    pointInNode(p){
        var d1 = this.sign(p, this.a, this.b);
        var d2 = this.sign(p, this.b, this.c);
        var d3 = this.sign(p, this.c, this.a);

        var has_neg = (d1 < 0) || (d2 < 0) || (d3 < 0);
        var has_pos = (d1 > 0) || (d2 > 0) || (d3 > 0);
    
        return !(has_neg && has_pos);
    }
}

// This class implements a ternary tree for fast triangle lookup
class Ternary {
    constructor(a, b, c, idA, idB, idC){
        // a, b, c are the initial 3 vertices of the root triangle
        this.node = new Node(a, b, c, idA, idB, idC);
        // Children
        this.left = null;
        this.bottom = null;
        this.right = null;
    }

    addPoint(p, id){
        if (this.left == null){
            // Its a leaf
            this.left = new Ternary(this.node.a, this.node.b, p, this.node.idA, this.node.idB, id);
            this.right = new Ternary(this.node.a, this.node.c, p, this.node.idA, this.node.idC, id);
            this.bottom = new Ternary(this.node.b, this.node.c, p, this.node.idB, this.node.idC, id);

        } else {
            if (this.left.node.pointInNode(p)) this.left.addPoint(p, id);
            else if (this.right.node.pointInNode(p)) this.right.addPoint(p, id);
            else if (this.bottom.node.pointInNode(p)) this.bottom.addPoint(p, id);
            else {
                console.log("ERROR: Point is outside the scope");
            }
        }
    }

    dfs(){
        if (this.left == null){
            return [[this.node.idA, this.node.idB, this.node.idC]];
        }
        else {
            var retList = [];

            retList = retList.concat(this.left.dfs());
            retList = retList.concat(this.right.dfs());
            retList = retList.concat(this.bottom.dfs());

            return retList;
        }
    }

}
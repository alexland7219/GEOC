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

            var myTest = this.node.pointInNode(p);

            if (myTest.in){
                this.left = new Ternary(this.node.a, this.node.b, p, this.node.idA, this.node.idB, id);
                this.right = new Ternary(this.node.a, this.node.c, p, this.node.idA, this.node.idC, id);
                this.bottom = new Ternary(this.node.b, this.node.c, p, this.node.idB, this.node.idC, id);
    
                return [this.node.idA, this.node.idB, this.node.idC];
    
            } else {

                switch (myTest.freeVx){
                    case this.node.idA:
                        this.left = new Ternary(this.node.a, this.node.b, p, this.node.idA, this.node.idB, id);
                        this.right = new Ternary(this.node.a, this.node.c, p, this.node.idA, this.node.idC, id);

                        return [this.node.idA, this.node.idB, this.node.idC, null];

                    case this.node.idB:
                        this.left = new Ternary(this.node.a, this.node.b, p, this.node.idA, this.node.idB, id);
                        this.right = new Ternary(this.node.b, this.node.c, p, this.node.idB, this.node.idC, id);

                        return [this.node.idB, this.node.idA, this.node.idC, null];

                    default: // idC
                        this.left = new Ternary(this.node.a, this.node.c, p, this.node.idA, this.node.idC, id);
                        this.right = new Ternary(this.node.b, this.node.c, p, this.node.idB, this.node.idC, id);

                        return [this.node.idC, this.node.idA, this.node.idB, null];
                }
            }

        } else {
            // Determine if the point lies on a segment
            var leftTest = this.left.node.pointInNode(p);
            if (leftTest.in) return this.left.addPoint(p, id);

            var rightTest= this.right.node.pointInNode(p);
            if (rightTest.in) return this.right.addPoint(p, id);

            var bottomTest = (this.bottom == null ? null : this.bottom.node.pointInNode(p));
            if (bottomTest != null) if (bottomTest.in) return this.bottom.addPoint(p, id);

            // Point lies on the edge of this triangle, or between two subdivisions

            if (leftTest.on) return this.left.addPoint(p, id);
            else if (rightTest.on) return this.right.addPoint(p, id);
            else if (bottomTest != null){
                if (bottomTest.on) return this.bottom.addPoint(p, id);
            }

        }
    }

    // Returns a list of all triangles (triplets). Only leaves count
    dfs(){
        if (this.left == null){
            return [[this.node.idA, this.node.idB, this.node.idC]];
        }
        else {
            var retList = [];

            retList = retList.concat(this.left.dfs());
            retList = retList.concat(this.right.dfs());
            if (this.bottom != null) retList = retList.concat(this.bottom.dfs());

            return retList;
        }
    }

}
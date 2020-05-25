function vertex(x, y) {
    this.x = x;
    this.y = y;
}

function edge (v0, v1) {
    this.v0 = v0;
    this.v1 = v1;
}

function triangle (v0, v1, v2) {
    this.v0 = v0;
    this.v1 = v1;
    this.v2 = v2;

    function circumscribed_circle (center, radius) {
        this.center = center;
        this.radius = radius;
    }

    this.circumscribed_circle = () => {
        //from https://web.archive.org/web/20071030134248/http://www.exaflop.org/docs/cgafaq/cga1.html#Subject%201.01:%20How%20do%20I%20rotate%20a%202D%20point

        let A = this.v1.x - this.v0.x,
            B = this.v1.y - this.v0.y,
            C = this.v2.x - this.v0.x,
            D = this.v2.y - this.v0.y,
            E = A * (this.v0.x + this.v1.x) + B * (this.v0.y + this.v1.y),
            F = A * (this.v0.x + this.v2.x) + B * (this.v0.y + this.v2.y),
            G = 2 * (A * (this.v2.y - this.v1.y) - B * (this.v2.x - this.v1.x)),
            center, radius, dx, dy;

            if(Math.abs(G) < 0.01) {
                let min_x = Math.min(this.v0.x, this.v1.x, this.v2.x);
                let min_y = Math.min(this.v0.y, this.v1.y, this.v2.y)
                
                center = new vertex(((min_x + Math.max(this.v0.x, this.v1.x, this.v2.x)) / 2), ((min_y + Math.max(this.v0.y, this.v1.y, this.v2.y)) / 2));
                dx = center.x - min_x;
                dy = center.y - min_y;
            }
            else {
                center = new vertex((D * E - B * F) / G, (A * F - C * E) / G);
                dx = center.x - this.v0.x;
                dy = center.y - this.v0.y; 
            }
            radius = Math.sqrt(dx * dx + dy * dy);
            return new circumscribed_circle(center, radius);
    }

    this.isInCircumscribedCircle = (vertex) => {
        let distance = Math.hypot(this.circumscribed_circle.x - vertex.x, this.circumscribed_circle.y - vertex.y);

        if(distance > this.circumscribed_circle.radius) {
            return false;
        }
        else {
            return true;
        }
    } 

    this.triangleToEdges = () => {
        let edges = [];
        edges.push(new edge(this.v0, this.v1));
        edges.push(new edge(this.v0, this.v2));
        edges.push(new edge(this.v1, this.v2));
        return edges;
    }
}

function triangulate(vertexes) {

    if(vertexes.length > 2) {
        let vertexesx = [],
            vertexesy = [];
        vertexes.forEach(vertex => {
            vertexesx.push(vertex.x);
            vertexesy.push(vertex.y);
        })

        let min_x = Math.min(...vertexesx),
            min_y = Math.min(...vertexesy),
            max_x = Math.max(...vertexesx),
            max_y = Math.max(...vertexesy),
            dx = (max_x - min_x),
            dy = (max_y - min_y),
            v0 = new vertex(min_x - dy * Math.sqrt(3) / 3, min_y),
            v1 = new vertex(max_x + dy * Math.sqrt(3) / 3, min_y),
            v2 = new vertex((min_x + max_x) * 0.5, max_y + dx * Math.sqrt(3) * 0.5),
            super_triangle = new triangle(v0, v1, v2),
            triangles = [];

        triangles.push(super_triangle);

        vertexes.forEach(vertex => {
            triangles = addVertex(vertex, triangles);
        });

        for(i = triangles.length - 1; i >= 0; i--) {
            if((triangles[i].v0.x == super_triangle.v0.x && triangles[i].v0.y == super_triangle.v0.y) || (triangles[i].v0.x == super_triangle.v1.x && triangles[i].v0.y == super_triangle.v1.y) || (triangles[i].v0.x == super_triangle.v2.x && triangles[i].v0.y == super_triangle.v2.y) || (triangles[i].v1.x == super_triangle.v1.x && triangles[i].v1.y == super_triangle.v1.y) || (triangles[i].v1.x == super_triangle.v2.x && triangles[i].v1.y == super_triangle.v2.y) || (triangles[i].v2.x == super_triangle.v2.x && triangles[i].v2.y == super_triangle.v2.y)) {
                triangles.splice(i, 1);
            }
        }

        /*triangles.forEach(triangle => {
            if(triangle.v0 == super_triangle.v0 || triangle.v0 == super_triangle.v1 || triangle.v0 == super_triangle.v2 || triangle.v1 == super_triangle.v1 || triangle.v1 == super_triangle.v2 || triangle.v2 == super_triangle.v2) {
                triangles.splice(triangle);
            }
        })*/
        return triangles;
    }
    return null;
}

function addVertex(vertex, triangles) {
    function removeDoubleEdges(edges) {
        let buffer = new Set(),
            new_edges = [];
        edges.sort();

        for(i = 1; i<edges.length; i++) {
            if(edges[i] == edges[i-1]) {
                buffer.push(edges[i]);
                buffer.push(edges[i+1]);
            }
        }

        for(i = 0; i<edges.length; i++) {
            if(!buffer.has(i)) {
                new_edges.push(edges[i]);
            }
        }

        return new_edges;
    }
    
    let edges_buffer = [];

    for(i = triangles.length - 1; i >= 0; i--) {
        if (triangles[i].isInCircumscribedCircle(vertex)) {
            edges_buffer.push(...triangles[i].triangleToEdges());
            triangles.splice(i, 1);
        }
    }

    /*triangles.forEach(triangle => {
        if (triangle.isInCircumscribedCircle(vertex)) {
            edges_buffer.push(triangle.triangleToEdges());
            triangles.splice(triangle);
        }
    })*/
    
    edges_buffer = removeDoubleEdges(edges_buffer);

    edges_buffer.forEach(edge => {
        triangles.push(new triangle(vertex, edge.v0, edge.v1));
    })

    return triangles;
}
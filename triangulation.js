(function(){
    function vertex(x, y) {
        this.x = x;
        this.y = y;
    }

    function edge (v0, v1) {
        this.v0 = v0;
        this.v1 = v1;
    }

    function triagle (v0, v1, v2) {
        this.v0 = v0;
        this.v1 = v1;
        this.v2 = v2;

        function circumscribed_circle (center, radius) {
            this.center = center;
            this.radius = radius;
        }

        this.circumscribed_circle = getCircumscribedCircle();

        function getCircumscribedCircle() {
            //from https://web.archive.org/web/20071030134248/http://www.exaflop.org/docs/cgafaq/cga1.html#Subject%201.01:%20How%20do%20I%20rotate%20a%202D%20point

            let A = this.v1.x - this.v0.x;
                B = this.v1.y - this.v0.y;
                C = this.v2.x - this.v0.x;
                D = this.v2.y - this.v0.y;
                E = A * (this.v0.x + this.v1.x) + B * (this.v0.y + this.v1.y);
                F = A * (this.v0.x + this.v2.x) + B * (this.v0.y + this.v2.y);
                G = 2 * (A * (this.v2.y - this.v1.y) - B * (this.v2.x - this.v1.x));
                center;
                radius;
                dx;
                dy;

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
    }
})
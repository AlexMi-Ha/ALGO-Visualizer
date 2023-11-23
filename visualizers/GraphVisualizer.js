class Node {
    constructor(pos,size, value) {
        this.pos = pos;
        this.force = createVector(0,0);
        this.mass = (2* PI * size) / 1.5;
        this.f
        this.value = value;
    }

    update() {
        let force = this.force.copy();
        let vel = force.div(this.mass);
        this.pos.add(vel);
    }

    draw() {
        noStroke();
        fill(0,0,0,128);
        ellipse(this.pos.x, this.pos.y, this.mass, this.mass);
        fill(0);
        text(this.value, this.pos.x, this.pos.y);
    }
}

class GraphVisualizer extends Visualizer {
    gravityConstant = 1.1;
    forceConstant = 2000;
    physics = true;
    nodes = [];
    nodeCon = [];
    simulationStep = 0;

    constructor(logContainer) {
        super(logContainer);
        this.setup();
    }

    setup() {
        const rng = new Random();
        for(let i = 0; i < 25; ++i) {
            let x = rng.nextSeededRandom()*width;
            let y = rng.nextSeededRandom()*height;
            this.nodes.push(new Node(createVector(x,y), 4, Math.floor(rng.nextSeededRandom() * 10)));
        }
        // Binary heap-like construction to initially connect everything
        var cons = []; // cons for later
        cons[0] = [];
        for(let i = 2; i <= this.nodes.length; ++i) {
            this.nodeCon.push([
                i - 1,
                (i-1) >> 1
            ]);
            cons[i-1] = [(i-1) >> 1];
            cons[(i-1) >> 1].push(i-1);
        }

        // connect random nodes
        for(let i = 0; i < cons.length; ++i) {
            const rand = Math.floor(rng.nextSeededRandom() * cons.length);
            if(cons[i].includes(rand) || rng.nextSeededRandom() < .8) {
                continue;
            }

            cons[i].push(rand);
            cons[rand].push(i);
            this.nodeCon.push([i,rand]);
        }
    }

    show() {
        push();
        translate(width/2, height/2);
        this.nodeCon.forEach(con => {
            let node1 = this.nodes[con[0]]
            let node2 = this.nodes[con[1]]
            line(node1.pos.x, node1.pos.y, node2.pos.x, node2.pos.y);
        })
        if(this.physics) {
            this.applyForces();
        }
        let allStopped = true;
        this.nodes.forEach(node => {
            node.draw();
            if(this.physics) {
                node.update();
                if(node.force.mag() > 5 && this.simulationStep < 150) {
                    allStopped = false;
                }
            }
        })
        if(this.physics) {
            ++this.simulationStep;
            this.physics &&= !allStopped;
        }
        pop();
    }
    
    applyForces() {
        this.nodes.forEach(node => {
            let gravity = node.pos.copy().mult(-1).mult(this.gravityConstant);
            node.force = gravity;
        })

        for(let i = 0; i < this.nodes.length; ++i) {
            for(let j = i+1; j < this.nodes.length; ++j) {
                let pos = this.nodes[i].pos;
                let dir = this.nodes[j].pos.copy().sub(pos);
                let force = dir.div(Math.pow(dir.mag(),2));
                force.mult(this.forceConstant);
                this.nodes[j].force.add(force)
                this.nodes[i].force.sub(force);
            }
        }

        this.nodeCon.forEach(con => {
            let node1 = this.nodes[con[0]];
            let node2 = this.nodes[con[1]];
            const maxDist = 50;
            const dist = node1.pos.copy().sub(node2.pos);
            const diff= dist.mag() - maxDist;
            node1.force.sub(dist);
            node2.force.add(dist);
        })
    }
}
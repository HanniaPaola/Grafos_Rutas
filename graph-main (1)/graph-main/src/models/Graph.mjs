export default class Graph {
    #matrizAdyacencia = [];
    #map = new Map();
    #listaAdyacencia = new Map();

    constructor() {}

    addVertices(...vertices) {
        for (let value of vertices) {
            if (!this.#map.has(value)) {
                this.#map.set(value, this.#matrizAdyacencia.length);
                this.#matrizAdyacencia.push(new Array(this.#matrizAdyacencia.length).fill(0));
                for (let i = 0; i < this.#matrizAdyacencia.length - 1; i++) {
                    this.#matrizAdyacencia[i].push(0);
                }
                this.#listaAdyacencia.set(value, []);
            }
        }
    }

    addV(value) {
        this.addVertices(value);
    }

    addConexion(start, end, weight = 1) {
        if (this.#map.has(start) && this.#map.has(end)) {
            this.#matrizAdyacencia[this.#map.get(start)][this.#map.get(end)] = weight;
            this.#listaAdyacencia.get(start).push({ vertex: end, weight: weight });
            return true;
        }
        return false;
    }

    bfs(callback) {
        if (this.#map.size === 0) return;

        let queue = [];
        let visited = new Array(this.#matrizAdyacencia.length).fill(false);
        let entries = [...this.#map.entries()];

        let [firstVertex] = entries[0];
        queue.push(firstVertex[0]);
        visited[this.#map.get(firstVertex[0])] = true;

        while (queue.length > 0) {
            let vertex = queue.shift();
            callback(vertex);

            for (let neighbor of this.#listaAdyacencia.get(vertex)) {
                if (!visited[this.#map.get(neighbor.vertex)]) {
                    visited[this.#map.get(neighbor.vertex)] = true;
                    queue.push(neighbor.vertex);
                }
            }
        }
    }

    dfs(callback) {
        if (this.#map.size === 0) return;

        let stack = [];
        let visited = new Array(this.#matrizAdyacencia.length).fill(false);
        let entries = [...this.#map.entries()];

        let [firstVertex] = entries[0];
        stack.push(firstVertex[0]);
        visited[this.#map.get(firstVertex[0])] = false;

        while (stack.length > 0) {
            let vertex = stack.pop();

            if (!visited[this.#map.get(vertex)]) {
                visited[this.#map.get(vertex)] = true;
                callback(vertex);
                
                for (let neighbor of this.#listaAdyacencia.get(vertex).reverse()) {
                    if (!visited[this.#map.get(neighbor.vertex)]) {
                        stack.push(neighbor.vertex);
                    }
                }
            }
        }
    }

    dijkstra(start) {
        if (!this.#map.has(start)) return;

        let dist = new Array(this.#matrizAdyacencia.length).fill(Infinity);
        let prev = new Array(this.#matrizAdyacencia.length).fill(null);
        let pq = new Set(this.#map.keys());

        dist[this.#map.get(start)] = 0;

        while (pq.size > 0) {
            let u = [...pq].reduce((minVertex, vertex) => dist[this.#map.get(vertex)] < dist[this.#map.get(minVertex)] ? vertex : minVertex);
            pq.delete(u);

            for (let neighbor of this.#listaAdyacencia.get(u)) {
                let alt = dist[this.#map.get(u)] + neighbor.weight;
                if (alt < dist[this.#map.get(neighbor.vertex)]) {
                    dist[this.#map.get(neighbor.vertex)] = alt;
                    prev[this.#map.get(neighbor.vertex)] = u;
                }
            }
        }

        return { dist, prev };
    }

    getVertices() {
        return [...this.#map.entries()];
    }
}




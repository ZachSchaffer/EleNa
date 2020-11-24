import PriorityQueue from 'priorityqueue';
export const FEET_IN_LAT_DEGREE = 364000;
export const FEET_IN_LNG_DEGREE = 364434.53; // only for Amherst, MA
const MAX_DISTANCE_OR_ELEVATION = 1000000;

//This class runs the Djikstra algorithm on a grid of location objects passed from pathing service
export class Djikstra {
    constructor(grid, startPosition, endPosition, height, width, toggle, x) {
        this.grid = grid;
        this.startPosition = startPosition;
        this.endPosition = endPosition;
        this.toggle = toggle;
        this.x = x;
        this.width = width;
        this.height = height;
        this.createAdjacencyMatrix = this.createAdjacencyMatrix.bind(this);
        this.determinePath = this.determinePath.bind(this);
        this.distance = this.distance.bind(this);
        this.isAdjacent = this.isAdjacent.bind(this);
        this.getAdjacentPoints = this.getAdjacentPoints.bind(this);
        this.getPathDistance = this.getPathDistance.bind(this);
        this.determineShortestPathLength = this.determineShortestPathLength.bind(this);
        this.isStartPosition = this.isStartPosition.bind(this);
    }

    //find the distance in feet between 2 location objects
    //this only works for Amherst because the number of feet in lat/long degree is different elsewhere
    distance(start, end) {
        var latDif = Math.abs(start.getLatitude() - end.getLatitude());
        var lngDif = Math.abs(start.getLongitude() - end.getLongitude());
        var latFeet = latDif * FEET_IN_LAT_DEGREE;
        var lngFeet = lngDif * FEET_IN_LNG_DEGREE;
        return Math.sqrt(latFeet ** 2 + lngFeet ** 2);
    }


    // Checks if point (k, l) is adjacent to point (i, j)
    isAdjacent(k, l, i, j) {
        if (
            (k === i - 1 && l === j - 1) ||
            (k === i && l === j - 1) ||
            (k === i + 1 && l === j - 1) ||
            (k === i - 1 && l === j) ||
            (k === i - 1 && l === j + 1) ||
            (k === i && l === j + 1) ||
            (k === i + 1 && l === j + 1) ||
            (k === i + 1 && l === j)
        ) {
            return true;
        }
        return false;
    }

    // Builds an array of [row, col] points that are adjacent to i, j
    getAdjacentPoints(i, j) {
        let points = [];
        if (i-1 >= 0) {
            if (j-1 >= 0) {
                // top left corner valid
                points.push([i-1, j-1]);
            } 
            if (j+1 < this.grid[0].length) {
                // top right corner valid
                points.push([i-1, j+1]);
            } 
            // top middle valid
            points.push([i-1, j]);
        }
        if (i+1 < this.grid.length) {
            if (j-1 >= 0) {
                // bottom left corner valid
                points.push([i+1, j-1]);
            } 
            if (j+1 < this.grid[0].length) {
                // bottom right corner valid
                points.push([i+1, j+1]);
            } 
            // bottom middle valid
            points.push([i+1, j]);
        }
        if (j-1 >= 0) {
            points.push([i, j-1]);
        }
        if (j+1 < this.grid[0].length) {
            points.push([i, j+1]);
        }
        return points;
    }

    //create an adjacency matrix to be used by Djikstra where each cell is a list of adjacent positions
    createAdjacencyMatrix() {
        let adjMatrix = [];
        for (let i = 0; i < this.grid.length; i++) {
            adjMatrix.push([]);
            for (let j = 0; j < this.grid[i].length; j++) {

                // add neighboring locations
                adjMatrix[i].push([]);
                adjMatrix[i][j] = this.getAdjacentPoints(i, j);

            }
        }
        return adjMatrix;
    }

    // retrieves the path distance using the nodes list from the start position
    // with the starting distance valuen of 'startDistance'
    getPathDistance(nodes, startPosition, startDistance) {
        let distance = startDistance;
        let curr = startPosition;
        let next = nodes[startPosition[0]][startPosition[1]];

        // iterate till there are no more nodes on the path
        while (next !== null) {

            // adds the distance between the 'curr' position and the 'next' position
            distance += this.distance(this.grid[next[0]][next[1]], this.grid[curr[0]][curr[1]]);
            curr = next;
            next = nodes[next[0]][next[1]];
        }
        return distance;
    }

    // Checks if i, j is the start position
    isStartPosition(i, j) {
        return this.startPosition[0] === i && this.startPosition[1] === j;
    }

    // Runs traditional djikstras on the generated adjMatrix and grid to determine what the baseline
    // for the k% elevation algorithm should be
    determineShortestPathLength(adjMatrix) {
        let distances = []; // matrix of shortest distances to each node
        let pq = new PriorityQueue((this.height * this.width) ** 2);
        pq.enqueue(this.startPosition, 0);

        // populate distances matrix with all values as MAX_DISTANCE_OR_ELEVATION 
        // except 0 for the startPosition
        for (let i = 0 ; i < this.grid.length ; i ++) {
            distances.push([]);
            for (let j = 0 ; j < this.grid[i].length ; j++) {
                if (this.isStartPosition(i, j)) {
                    distances[i].push(0);
                } else {
                    distances[i].push(MAX_DISTANCE_OR_ELEVATION);
                }
                
            }
        }

        // run Djikstras
        while (!pq.isEmpty()) {
            let position = pq.dequeue();
            let curr = this.grid[position[0]][position[1]];

            // iterate over all neighbors
            adjMatrix[position[0]][position[1]].forEach(neighborPosition => {
                let neighbor = this.grid[neighborPosition[0]][neighborPosition[1]];

                // calculate new alternative distance
                let newDistance = distances[position[0]][position[1]] + this.distance(curr, neighbor);

                // if distance is shorter than current shortest distance
                if (newDistance < distances[neighborPosition[0]][neighborPosition[1]]) {
                    distances[neighborPosition[0]][neighborPosition[1]] = newDistance;
                    pq.enqueue(neighborPosition, distances[neighborPosition[0]][neighborPosition[1]]);
                }
            });
        }

        // return the distance to the end position from the start position
        return distances[this.endPosition[0]][this.endPosition[1]];
    }

    //run Djikstra to get shortest path with adjMatrix values
    //at each sep check to make sure distance within x%
    //if exceeds x%, set distance to that node to infinity in matrix and visited to true
    determinePath(adjMatrix) {

        //find the shortest distance and distance within x% of that
        // run Djikstras using just distances to find the shortest path
        let shortestDistance = this.determineShortestPathLength(adjMatrix);

        // calculate the buffer range to accept paths within
        let distancePlusX = shortestDistance * (1 + this.x / 100);
        let path = []; //the final path

        let prevNodes = []; //list of previous nodes, used to backtrack to retrieve the path
        let distances = []; //shortest distances to each node
        let pq = new PriorityQueue((this.height * this.width) ** 2);
        pq.enqueue(this.startPosition, 0);

        // populate distances matrix
        for (let i = 0 ; i < this.grid.length ; i ++) {
            distances.push([]);
            prevNodes.push([]);
            for (let j = 0 ; j < this.grid[i].length ; j++) {

                // put MAX_DISTANCE_OR_ELEVATION in every cell except for the startPosition
                // put 0 in the startPosition
                if (this.isStartPosition(i, j)) {
                    distances[i].push(0);
                } else {
                    distances[i].push(MAX_DISTANCE_OR_ELEVATION);
                }
                prevNodes[i].push(null);
                
            }
        }

        // end location object
        let endLocation = this.grid[this.endPosition[0]][this.endPosition[1]];

        // run Djikstras
        while (!pq.isEmpty()) {
            let position = pq.dequeue();
            let currElevation = this.grid[position[0]][position[1]].getElevation();

            // iterate through all of the location at 'position's neighbors
            adjMatrix[position[0]][position[1]].forEach(neighborPosition => {
                let neighbor = this.grid[neighborPosition[0]][neighborPosition[1]];
                let newElevation = distances[position[0]][position[1]];

                // add the elevation gain
                // divide 1/ gain if we want to maximize the elevation gain, don't divide otherwise
                // this.toggle denotes whether the elevation gain should be maximized
                if (neighbor.getElevation() > currElevation) {
                    newElevation += this.toggle ? 1/(neighbor.getElevation() - currElevation) : neighbor.getElevation() - currElevation;
                } else {
                    newElevation += this.toggle ? 1 : 0;
                }

                // calculates the distance from this neighbor to the end location
                let distanceToDestination = this.distance(neighbor, endLocation);

                // calculates the current distance on the path from the start location to the neighbor
                let currDistance = this.getPathDistance(prevNodes, position, this.distance(neighbor, this.grid[position[0]][position[1]]));

                // checks if we should continue down this path
                // only continue if the elevation is optimal and the path is within k%
                if (newElevation < distances[neighborPosition[0]][neighborPosition[1]] && currDistance + distanceToDestination < distancePlusX) {
                    distances[neighborPosition[0]][neighborPosition[1]] = newElevation;
                    prevNodes[neighborPosition[0]][neighborPosition[1]] = position;
                    pq.enqueue(neighborPosition, distances[neighborPosition[0]][neighborPosition[1]]);
                }
            });
        }

        // retrieve the path from the prevNodes list by backtracking up the position stream
        path.push(endLocation);
        let next = prevNodes[this.endPosition[0]][this.endPosition[1]];
        while (next !== null) {
            path.push(this.grid[next[0]][next[1]]);
            next = prevNodes[next[0]][next[1]];
        }
        console.log("the computed path is: ", path);
        return path;
    }
}
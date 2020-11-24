import PriorityQueue from 'priorityqueue';
export const FEET_IN_LAT_DEGREE = 364000;
export const FEET_IN_LNG_DEGREE = 364434.53; // only for Amherst, MA
export const MAX_ELEVATION = 10000;

//This class runs the Djikstra algorithm on a grid of location objects passed from pathing service
export class Djikstra {
    constructor(grid, startPosition, endPosition, height, width, toggle, x) {
        this.grid = grid;

        this.startPosition = startPosition;
        this.endPosition = endPosition;
        console.log(endPosition);
        // this.nodesList = nodesList;
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
        return points
    }

    //create an adjacency matrix of the elevation gains between neighboring nodes to be used to find the path
    createAdjacencyMatrix() {
        let adjMatrix = [];
        //calculate elevation gain between each pair of neighbors
        for (let i = 0; i < this.grid.length; i++) {
            adjMatrix.push([]);
            for (let j = 0; j < this.grid[i].length; j++) {
                // holds the current locations elevation in meters
                //let currElevation = this.grid[i][j].getElevation();

                // holds the elevation gains for this location
                //let elGains = [];

                // add neighboring locations
                adjMatrix[i].push([]);
                adjMatrix[i][j] = this.getAdjacentPoints(i, j);
                // this.getAdjacentPoints(i, j).forEach(point => {
                //     adjMatrix[i][j].push(this.grid[point[0]][point[1]]);
                // });
                // iterate through all grid locations
                // for (let k = 0; k < this.grid.length; k++) {
                //     for (let l = 0; l < this.grid[k].length; l++) {

                //         // Elevation gain from (i, j) to (k, 1)
                //         let elevationGain = 0;

                //         if (this.isAdjacent(k, l, i, j)) {
                //             //if second point is higher, there is elevation gain, otherwise it is 0
                //             let klElevation = this.grid[k][l].getElevation();
                //             if (klElevation > currElevation) { 
                //                 // if toggle is true then maximize elevation by doing 1/ gain
                //                 elevationGain = this.toggle ? 1/(klElevation - currElevation) : klElevation - currElevation;
                //             } else {
                //                 // if toggle is true then maximize elevation by setting to 1 otherwise 0
                //                 elevationGain = this.toggle ? 1 : 0;
                //             }
                //         }
                //         else {
                //             elevationGain = MAX_ELEVATION;
                //         }
                //         elGains.push(elevationGain);
                //     }
                //}
                //adjMatrix.push(elGains);

            }
        }

        // for (let j = 0; j < this.nodesList.length; j++) {
        //   let currNode = this.nodesList[j].elevation;
        //   let elevationDiff = [];
        //   let elevationGain = 0;
        //   for (let i = 0; i < this.nodesList.length; i++) {
        //     //check if points are neighbors by their location in the grid
        //     if (j === i - 1 || j === i + 1 || j === i + this.width || j === i + this.width - 1 || j === i + this.width + 1 || j === i - this.width || j === i - this.width - 1 || j === i - this.width + 1) {
        //       // Take the elevation change, flip the sign depending on whether
        //       // we're maximizing or minimizing
        //       if (this.toggle) {
        //         elevationGain = currNode - this.nodesList[i].elevation;
        //       } else {
        //         elevationGain = this.nodesList[i].elevation - currNode;
        //       }
        //     //   if (this.nodesList[i].elevation - currNode > 0) {
        //     //     elevationGain = this.nodesList[i].elevation - currNode;
        //     //   } else {
        //     //     elevationGain = 0;
        //     //   }
        //     }
        //     //if they are not neighbors, set edge weight to MAX_ELEVATION so we never traverse that edge
        //     else {
        //       elevationGain = MAX_ELEVATION;
        //     }
        //     elevationDiff.push(elevationGain);
        //   }
        //   adjMatrix.push(elevationDiff);
        // }
        //if we want to maximize instead of minimize, set elevation to 1/elevation
        // if (this.toggle) {
        //     for (let j = 0; j < this.nodesList.length; j++) {
        //         for (let i = 0; i < this.nodesList.length; i++) {
        //             if (adjMatrix[i][j] !== 0 && adjMatrix[i][j] !== MAX_ELEVATION) {
        //                 adjMatrix[i][j] = 1 / adjMatrix[i][j];
        //             }
        //         }
        //     }
        // }
        console.log(adjMatrix);
        return adjMatrix;
    }

    // retrieves the path distance
    getPathDistance(nodes, startNode, startDistance) {
        let distance = startDistance;
        let next = startNode
        while (next !== null) {
            distance += this.distance(next, nodes[next]);
            next = nodes[next];
        }
        return distance;
    }

    //run Djikstra to get shortest path with adjMatrix values
    //at each sep check to make sure distance within x%
    //if exceeds x%, set distance to that node to infinity in matrix and visited to true
    determinePath(adjMatrix) {
        //find the shortest distance and distance within x% of that
        console.log(this.grid);
        console.log(this.endPosition[0]);
        console.log(this.endPosition[1]);
        let startLocation = this.grid[this.startPosition[0]][this.startPosition[1]];
        let endLocation = this.grid[this.endPosition[0]][this.endPosition[1]];
        let shortestDistance = this.distance(
            startLocation,
            endLocation
        );
        let distancePlusX = shortestDistance * (1 + this.x / 100);
        let path = []; //the final path
        
        //let pathToNode = []; //track previous visited node to get to current node
        //push distances from start to all other nodes to begin with
        // for (let i = 0 ; i < this.grid.length ; i++) {
        //     for (let j = 0 ; j < this.grid[i].length ; j++) {
        //         pathToNode.push(null);
        //         distances.push({
        //             index: [i,j],
        //             node: this.grid[i][j],
        //             dist: adjMatrix[0][(i*j)+j],
        //             visited: (i===0 && j ===0) || this.grid[i][j].elevation === null,
        //         })
        //     }
        // }

        // for (let j = 0; j < this.nodesList.length; j++) {
        //     pathToNode.push(null);
        //     distances.push({
        //         num: j,
        //         node: this.nodesList[j],
        //         dist: adjMatrix[0][j],
        //         visited: j === 0 || this.nodesList[j].elevation === null,
        //     });
        // }
        // let currNode = 0; //node that we are at now
        // let pathSoFar = 0;  //distance travelled so far

        let prevNodes = [];
        let distances = []; //shortest distances to each node
        let pq = new PriorityQueue((this.height * this.width) ** 2);
        pq.enqueue(this.startPosition, 0);
        for (let i = 0 ; i < this.grid.length ; i ++) {
            distances.push([]);
            prevNodes.push([]);
            for (let j = 0 ; j < this.grid[i].length ; j++) {
                console.log("GRID ITERATION");
                if (this.startPosition[0] === i && this.startPosition[1] === j) {
                    console.log("SET START POSITION AS 0");
                    distances[i].push(0);
                } else {
                    distances[i].push(MAX_ELEVATION);
                }
                prevNodes[i].push(null);
                
            }
        }
        console.log("PRINTING OUT THE DISTANCES");
        console.log(distances);

        while (!pq.isEmpty()) {
            let position = pq.dequeue();
            let currElevation = this.grid[position[0]][position[1]].getElevation();
            adjMatrix[position[0]][position[1]].forEach(neighborPosition => {
                let neighbor = this.grid[neighborPosition[0]][neighborPosition[1]];
                let newElevation = distances[position[0]][position[1]];

                if (neighbor.getElevation() > currElevation) {
                    newElevation += this.toggle ? 1/(neighbor.getElevation() - currElevation) : neighbor.getElevation() - currElevation;
                } else {
                    newElevation += this.toggle ? 1 : 0;
                }
                console.log(newElevation);
                console.log(neighbor);
                // && this.getPathDistance(prevNodes, loc, this.distance(neighbor, loc)) < distancePlusX
                if (newElevation < distances[neighborPosition[0]][neighborPosition[1]] ) {
                    console.log("IN HERE");
                    distances[neighborPosition[0]][neighborPosition[1]] = newElevation;
                    prevNodes[neighborPosition[0]][neighborPosition[1]] = position;
                    pq.enqueue(neighborPosition, distances[neighborPosition[0]][neighborPosition[1]]);
                }
            });
        }
        console.log(distances);


        //while we havent found the target node
        // while (pathToNode[this.nodesList.length - 1] === null) {
        //     let minDistance = MAX_ELEVATION;
        //     let closestNode = null;
        //     //find the node with the smallest total distance
        //     for (let j = this.nodesList.length - 1; j >= 0; j--) {
        //         if (!distances[j].visited && distances[j].dist < minDistance) {
        //             minDistance = distances[j].dist;
        //             closestNode = distances[j].num;
        //         }
        //     }
        //     if (closestNode === null) {
        //         pathToNode[this.nodesList.length - 1] = currNode;
        //         break;
        //     }
        //     //update total distance travelled so far
        //     pathSoFar += this.distance(
        //         this.nodesList[currNode],
        //         this.nodesList[closestNode]
        //     );
        //     //if path is not already longer than shortest path + x%, visit that node
        //     //otherwise set node to visited, but do not make it the currNode
        //     if (pathSoFar < distancePlusX || closestNode === this.nodesList.length - 1) {
        //         pathToNode[closestNode] = currNode;
        //         currNode = closestNode;
        //         distances[currNode].visited = true;
        //         distances[currNode].dist = minDistance;
        //     } else {
        //         distances[closestNode].visited = true;
        //         distances[closestNode].dist = MAX_ELEVATION;
        //     }
        //     //update shortest paths if needed
        //     for (let j = 0; j < this.nodesList.length; j++) {
        //         if (
        //             distances[j].dist >
        //             distances[currNode].dist + adjMatrix[currNode][j]
        //         ) {
        //             //if path is not already too long
        //             if (pathSoFar < distancePlusX) {
        //                 distances[j].dist =
        //                     distances[currNode].dist + adjMatrix[currNode][j];
        //             }
        //         }
        //     }
        // }
        // console.log(pathToNode);
        path.push(endLocation);
        let next = prevNodes[this.endPosition[0]][this.endPosition[1]];
        while (next !== null) {
            path.push(this.grid[next[0]][next[1]]);
            next = prevNodes[next[0]][next[1]];
        }
        // //if we have found the target node, find the path to that node
        // if (pathToNode[this.nodesList.length - 1] !== null) {
        //     path.push(this.nodesList[this.nodesList.length - 1]);
        //     let next = pathToNode[this.nodesList.length - 1];
        //     while (next !== 0) {
        //         path.push(this.nodesList[next]);
        //         next = pathToNode[next];
        //     }
        //     path.push(this.nodesList[0]);
        // }
        console.log(path.reverse());
        return path.reverse();
    }
}
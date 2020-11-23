
export const FEET_IN_LAT_DEGREE = 364000;
export const FEET_IN_LNG_DEGREE = 364434.53; // only for Amherst, MA
export const MAX_ELEVATION = 10000;

//I am assuming that we will never visit the same node twice
export class Dijkstra {
    constructor(nodesList, toggle, x) {
      this.nodesList = nodesList;
      this.toggle = toggle;
      this.x = x;
      this.createAdjacencyMatrix = this.createAdjacencyMatrix.bind(this);
      this.determinePath = this.determinePath.bind(this);
      this.distance = this.distance.bind(this);
    }
    distance(start, end) {
      var latDif = Math.abs(start.getLatitude() - end.getLatitude());
      var lngDif = Math.abs(start.getLongitude() - end.getLongitude());
      var latFeet = latDif * FEET_IN_LAT_DEGREE;
      var lngFeet = lngDif * FEET_IN_LNG_DEGREE;
      return Math.sqrt(latFeet ** 2 + lngFeet ** 2); // Distance in miles
    }
    createAdjacencyMatrix() {
      let adjMatrix = [];
      //calculate elevation gain between each pair of points
      for (let j = 0; j < this.nodesList.length; j++) {
        let currNode = this.nodesList[j].elevation;
        let elevationDiff = [];
        let elevationGain = 0;
        for (let i = 0; i < this.nodesList.length; i++) {
          if (this.nodesList[i].elevation - currNode > 0) {
            elevationGain = this.nodesList[i].elevation - currNode;
          } else {
            elevationGain = 0;
          }
          elevationDiff.push(elevationGain);
        }
        adjMatrix.push(elevationDiff);
      }
      //if we want to maximize instead of minimize, set elevation to 1/elevation
      if (!this.toggle) {
        for (let j = 0; j < this.nodesList.length; j++) {
          for (let i = 0; i < this.nodesList.length; i++) {
            if (adjMatrix[i][j] !== 0) {
              adjMatrix[i][j] = 1 / adjMatrix[i][j];
            }
          }
        }
      }
      return adjMatrix;
    }
    //run dijkstra to get shortest path with adjMatrix values
    //at each step check to make sure distance within x%
    //if exceeds x%, set distance to that node to infinity in matrix and visited to true
    determinePath(adjMatrix) {
      // let pQueue = new PriorityQueue((a, b) => {
      //   if (a.dist < b.dist) {
      //     return -1;
      //   } else if (a.dist > b.dist) {
      //     return 1;
      //   } else {
      //     return 0;
      //   }
      // });
      console.log(this.toggle);
      console.log(this.x);
      let shortestDistance = this.distance(
        this.nodesList[0],
        this.nodesList[this.nodesList.length - 1]
      );
      let distancePlusX = shortestDistance * (1 + this.x / 100);
      let path = [];
      let distances = [];
      let pathToNode = [];
      for (let j = 0; j < this.nodesList.length; j++) {
        pathToNode.push(null);
        distances.push(null);
      }
      for (let j = 0; j < this.nodesList.length; j++) {
        distances[j] = {
          num: j,
          node: this.nodesList[j],
          dist: adjMatrix[0][j],
          visited: j === 0 || this.nodesList[j].elevation === null,
        };
      }
      let currNode = 0;
      let pathSoFar = 0;
      //while (pathToNode[this.nodesList.length - 1] === null) {
      for (let k = 0; k < 10; k++) {
        let minDistance = MAX_ELEVATION;
        let closestNode = null;
        for (let j = this.nodesList.length - 1; j >= 0; j--) {
          if (!distances[j].visited && distances[j].dist < minDistance) {
            minDistance = distances[j].dist;
            closestNode = distances[j].num;
          }
        }
        if (closestNode === null) {
          pathToNode[this.nodesList.length - 1] = currNode;
          break;
        }
  
        pathSoFar += this.distance(
          this.nodesList[currNode],
          this.nodesList[closestNode]
        );
        //if path is not already too long
        if (pathSoFar < distancePlusX || closestNode === this.nodesList.length - 1) {
          pathToNode[closestNode] = currNode;
          currNode = closestNode;
          distances[currNode].visited = true;
          distances[currNode].dist = minDistance;
        } else {
          distances[closestNode].visited = true;
          distances[closestNode].dist = MAX_ELEVATION;
        }
        //update shortest paths if needed
        for (let j = 0; j < this.nodesList.length; j++) {
          if (
            distances[j].dist >
            distances[currNode].dist + adjMatrix[currNode][j]
          ) {
            //if path is not already too long
            if (pathSoFar < distancePlusX) {
              distances[j].dist =
                distances[currNode].dist + adjMatrix[currNode][j];
            }
          }
        }
        if (k === 9 && pathToNode[this.nodesList.length - 1] === null) {
          pathToNode[this.nodesList.length - 1] = currNode;
        }
      }
  
      if (pathToNode[this.nodesList.length - 1] !== null) {
        path.push(this.nodesList[this.nodesList.length - 1]);
        let next = pathToNode[this.nodesList.length - 1];
        while (next !== 0) {
          path.push(this.nodesList[next]);
          next = pathToNode[next];
        }
        path.push(this.nodesList[0]);
      }
      //}
      let pathToReturn = [];
      for (let i = path.length - 1; i >= 0; i--) {
        pathToReturn.push(path[i]);
      }
      console.log(pathToReturn);
      return pathToReturn;
      // for (let j = 0; j < this.nodesList.length - 1; j++) {
      //   pQueue.push({
      //     node: this.nodesList[j],
      //     //set elevation to large number to simulate infinity
      //     dist: adjMatrix[currNode][j]
      //   });
      //}
      //console.log(pQueue.pop());
    }
  }
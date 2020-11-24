export const FEET_IN_LAT_DEGREE = 364000;
export const FEET_IN_LNG_DEGREE = 364434.53; // only for Amherst, MA
export const MAX_ELEVATION = 10000;

//This class runs the Dijkstra algorithm on a grid of location objects passed from pathing service
export class Dijkstra {
  constructor(nodesList, height, width, toggle, x) {
    this.nodesList = nodesList;
    this.toggle = toggle;
    this.x = x;
    this.width = width;
    this.height = height;
    this.createAdjacencyMatrix = this.createAdjacencyMatrix.bind(this);
    this.determinePath = this.determinePath.bind(this);
    this.distance = this.distance.bind(this);
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

  //create an adjacency matrix of the elevation gains between neighboring nodes to be used to find the path
  createAdjacencyMatrix() {
    let adjMatrix = [];
    //calculate elevation gain between each pair of neighbors
    for (let j = 0; j < this.nodesList.length; j++) {
      let currNode = this.nodesList[j].elevation;
      let elevationDiff = [];
      let elevationGain = 0;
      for (let i = 0; i < this.nodesList.length; i++) {
        //check if points are neighbors by their location in the grid
        if (j === i - 1 || j === i + 1 || j === i + this.width || j === i + this.width - 1 || j === i + this.width + 1 || j === i - this.width || j === i - this.width - 1 || j === i - this.width + 1) {
          //if second point is higher, there is elevation gain, otherwise it is 0
          if (this.nodesList[i].elevation - currNode > 0) {
            elevationGain = this.nodesList[i].elevation - currNode;
          } else {
            elevationGain = 0;
          }
        }
        //if they are not neighbors, set edge weight to MAX_ELEVATION so we never traverse that edge
        else {
          elevationGain = MAX_ELEVATION;
        }
        elevationDiff.push(elevationGain);
      }
      adjMatrix.push(elevationDiff);
    }
    //if we want to maximize instead of minimize, set elevation to 1/elevation
    if (this.toggle) {
      for (let j = 0; j < this.nodesList.length; j++) {
        for (let i = 0; i < this.nodesList.length; i++) {
          if (adjMatrix[i][j] !== 0 && adjMatrix[i][j] !== MAX_ELEVATION) {
            adjMatrix[i][j] = 1 / adjMatrix[i][j];
          }
        }
      }
    }
    console.log(adjMatrix);
    return adjMatrix;
  }

  //run dijkstra to get shortest path with adjMatrix values
  //at each step check to make sure distance within x%
  //if exceeds x%, set distance to that node to infinity in matrix and visited to true
  determinePath(adjMatrix) {
    //find the shortest distance and distance within x% of that
    let shortestDistance = this.distance(
      this.nodesList[0],
      this.nodesList[this.nodesList.length - 1]
    );
    let distancePlusX = shortestDistance * (1 + this.x / 100);
    let path = []; //the final path
    let distances = []; //shortest distances to each node
    let pathToNode = []; //track previous visited node to get to current node
    //push distances from start to all other nodes to begin with
    for (let j = 0; j < this.nodesList.length; j++) {
      pathToNode.push(null);
      distances.push({
        num: j,
        node: this.nodesList[j],
        dist: adjMatrix[0][j],
        visited: j === 0 || this.nodesList[j].elevation === null,
      });
    }
    let currNode = 0; //node that we are at now
    let pathSoFar = 0;  //distance travelled so far
    //while we havent found the target node
    while (pathToNode[this.nodesList.length - 1] === null) {
      let minDistance = MAX_ELEVATION;
      let closestNode = null;
      //find the node with the smallest total distance
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
      //update total distance travelled so far
      pathSoFar += this.distance(
        this.nodesList[currNode],
        this.nodesList[closestNode]
      );
      //if path is not already longer than shortest path + x%, visit that node
      //otherwise set node to visited, but do not make it the currNode
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
    }
    //if we have found the target node, find the path to that node
    if (pathToNode[this.nodesList.length - 1] !== null) {
      path.push(this.nodesList[this.nodesList.length - 1]);
      let next = pathToNode[this.nodesList.length - 1];
      while (next !== 0) {
        path.push(this.nodesList[next]);
        next = pathToNode[next];
      }
      path.push(this.nodesList[0]);
    } 
    console.log(path.reverse());
    return path.reverse();
  }
}
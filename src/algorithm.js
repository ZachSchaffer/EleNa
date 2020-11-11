class Algorithm {
    constructor(start, end) {
        this.start = start;
        this.end = end;
    }
    //calculate the shortest path between 2 points in miles
    shortestPath() {
        //temporary code from https://stackoverflow.com/questions/27928/calculate-distance-between-two-latitude-longitude-points-haversine-formula?page=1&tab=votes
        var lat1 = start.getLatitude();
        var lon1 = start.getLongitude();
        var lat2 = end.getLatitude();
        var lon2 = end.getLongitude();
        var R = 3958.8; // Radius of the earth in miles
        var dLat = (lat2 - lat1) * (Math.PI / 180);
        var dLon = (lon2 - lon1) * (Math.PI / 180);
        var a =
            Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos((Math.PI / 180) * lat1) *
                Math.cos((Math.PI / 180) * lat2) *
                Math.sin(dLon / 2) *
                Math.sin(dLon / 2);
        var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        var d = R * c; // Distance in miles
        return d;
    }
    //calculate the search area within K % of the shortest path
    getSearchArea() {}
    //create grid of location objects in the search area
    createGrid() {}
}

class Location {
    constructor(longitude, latitude, elevation) {
        this.longitude = longitude;
        this.latitude = latitude;
        this.elevation = elevation;
    }
    getLongitude() {
        return this.longitude;
    }
    getLatitude() {
        return this.latitude;
    }
    getElevation() {
        return this.elevation;
    }
    setElevation(elevation) {
        this.elevation = elevation;
    }
}

function distance(start, end) {
    var lat1 = start.getLatitude();
    var lon1 = start.getLongitude();
    var lat2 = end.getLatitude();
    var lon2 = end.getLongitude();
    var R = 3958.8; // Radius of the earth in miles
    var dLat = (lat2 - lat1) * (Math.PI / 180);
    var dLon = (lon2 - lon1) * (Math.PI / 180);
    var a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos((Math.PI / 180) * lat1) *
            Math.cos((Math.PI / 180) * lat2) *
            Math.sin(dLon / 2) *
            Math.sin(dLon / 2);
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    var d = R * c; // Distance in miles
    return d;
}

class Dijkstra {
    constructor(nodesList, elevation) {
        this.nodesList = nodesList;
        this.elevation = elevation;
    }
    createAdjacencyMatrix() {
        let adjMatrix = [];
        console.log(this.nodesList);
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
        if (!this.elevation) {
            for (let j = 0; j < this.nodesList.length; j++) {
                for (let i = 0; i < this.nodesList.length; i++) {
                    if (adjMatrix[i][j] === 0) {
                        adjMatrix[i][j] = 1 / adjMatrix[i][j];
                    }
                }
            }
        }
        return adjMatrix;
    }
    determinePath(adjMatrix) {
        console.log(adjMatrix);

        //run dijkstra to get shortest path with adjMatrix values
        //at each step check to make sure distance within k%
        //if exceeds k%, set all neighbors of current node to infinity in matrix
    }
}

let start = new Location(42.380368, -72.523143, 288.71);
let end = new Location(41, -71, 88);
let alg = new Algorithm(start, end);
alg.shortestPath();
distance(start, end);
let nodesList = [
    start,
    new Location(41.5, -72, 0),
    new Location(42, -71.5, 500),
    end,
];
let path = new Dijkstra(nodesList, true);
let matrix = path.createAdjacencyMatrix();
path.determinePath(matrix);
//console.log(distance);

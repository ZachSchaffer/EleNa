import PriorityQueue from 'priorityqueue';
import { getElevationURLMulti } from '../Functions/NetworkingFunctions';
import Location from './Location';

const FEET_IN_LAT_DEGREE = 364000;
const FEET_IN_LNG_DEGREE = 364434.53; // only for Amherst, MA

export default class PathingService {
    constructor(start, end, accuracy) {
        this.start = start;
        this.end = end;
        this.accuracy = accuracy;
        this.createGrid = this.createGrid.bind(this);
        this.shortestPath = this.shortestPath.bind(this);
    }
    //create grid of location objects in the search area
    createGrid() {
        // 1 degree of latitude is 69 miles or 364k feet

        var latDif = Math.abs(
            this.start.getLatitude() - this.end.getLatitude()
        );
        var lngDif = Math.abs(
            this.start.getLongitude() - this.end.getLongitude()
        );
        var numHorizontalPoints = (latDif * FEET_IN_LAT_DEGREE) / this.accuracy; // convert to feet then get a point every <accuracy> feet
        var numVerticalPoints = (lngDif * FEET_IN_LNG_DEGREE) / this.accuracy; // convert to feet then get a point every <accuracy> feet
        console.log(numHorizontalPoints);
        console.log(numVerticalPoints);
        //var latVariation = (latDif / FEET_IN_LAT_DEGREE) * this.accuracy;
        //var lngVariation = (lngDif / FEET_IN_LNG_DEGREE) * this.accuracy;
        var corners = this.getSearchArea(latDif, lngDif, 2);
        console.log(corners);

        var test = [
            [39.74012, -104.9849],
            [39.7995, -105.7237],
            [39.6404, -106.3736],
        ];
        var elevationApiURL = getElevationURLMulti(test);
        console.log(elevationApiURL);
    }

    //calculate the shortest path between 2 points in miles
    shortestPath() {
        //temporary code from https://stackoverflow.com/questions/27928/calculate-distance-between-two-latitude-longitude-points-haversine-formula?page=1&tab=votes
        console.log(this.start.getLongitude());
        var lat1 = this.start.getLatitude();
        var lon1 = this.start.getLongitude();
        var lat2 = this.end.getLatitude();
        var lon2 = this.end.getLongitude();
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

        // TODO heres your pqueue
        let pQueue = new PriorityQueue((a, b) => {
            // TODO change me to work with whatever you're using
            if (a < b) {
                return -1;
            } else if (a > b) {
                return 1;
            } else {
                return 0;
            }
        });

        pQueue.push(1);
        pQueue.push(2);

        console.log(pQueue.pop());

        return d;
    }

    //calculate the search area within K % of the shortest path
    getSearchArea(latDif, lngDif, k) {
        var lat1 = this.start.getLatitude();
        var lng1 = this.start.getLongitude();
        var lat2 = this.end.getLatitude();
        var lng2 = this.end.getLongitude();
        var latCushion = (latDif * k) / 100; // latitude cushion of k%
        var lngCushion = (lngDif * k) / 100; // longitude cushion of k%
        if (lat1 <= lat2 && lng1 >= lng2) {
            // start in top left
            return [
                [lat1 - latCushion, lng1 + lngCushion], // top left
                [lat2 + latCushion, lng1 + lngCushion], // top right
                [lat1 - latCushion, lng2 - lngCushion], // bottom left
                [lat2 + latCushion, lng2 - lngCushion], // bottom right
            ];
        } else if (lat1 <= lat2 && lng1 <= lng2) {
            // start in bottom left
            return [
                [lat1 - latCushion, lng2 + lngCushion], // top left
                [lat2 + latCushion, lng2 + lngCushion], // top right
                [lat1 - latCushion, lng1 - lngCushion], // bottom left
                [lat2 + latCushion, lng1 - lngCushion], // bottom right
            ];
        } else if (lat1 >= lat2 && lng1 >= lng2) {
            // start in top right
            return [
                [lat2 - latCushion, lng1 + lngCushion], // top left
                [lat1 + latCushion, lng1 + lngCushion], // top right
                [lat2 - latCushion, lng2 - lngCushion], // bottom left
                [lat1 + latCushion, lng2 - lngCushion], // bottom right
            ];
        }
        // lat1 >= lat2 && lng1 <= lng2
        // start in bottom right
        return [
            [lat2 - latCushion, lng2 + lngCushion], // top left
            [lat1 + latCushion, lng2 + lngCushion], // top right
            [lat2 - latCushion, lng1 - lngCushion], // bottom left
            [lat1 + latCushion, lng1 - lngCushion], // bottom right
        ];
    }

    //returns corners of search area
    //
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
let alg = new PathingService(start, end);
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

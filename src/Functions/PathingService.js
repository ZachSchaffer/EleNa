import PriorityQueue from 'priorityqueue';
import { getElevationURLMulti } from '../Functions/NetworkingFunctions';
import Location from './Location';
import axios from 'axios';

const FEET_IN_LAT_DEGREE = 364000;
const FEET_IN_LNG_DEGREE = 364434.53; // only for Amherst, MA

export default class PathingService {
  constructor(start, end) {
    this.start = start;
    this.end = end;
    this.createGrid = this.createGrid.bind(this);
    this.shortestPath = this.shortestPath.bind(this);
  }

  //create grid of location objects in the search area
  createGrid() {
    // 1 degree of latitude is 69 miles or 364k feet
    var grid = []; // grid to fill with Location objects

    // Retrieve the latitude and longitude differences
    var latDif = Math.abs(this.start.getLatitude() - this.end.getLatitude());
    var lngDif = Math.abs(this.start.getLongitude() - this.end.getLongitude());

    // calculates the accuracy
    // scales based on the flat distance between the two locations
    var accuracy = 100 / Math.sqrt(latDif ** 2 + lngDif ** 2);

    // calculate distance between points and retrieve corners of the area
    var latVariation = latDif / ((latDif * FEET_IN_LAT_DEGREE) / accuracy); // convert to feet then get a point every <accuracy> feet
    var lngVariation = lngDif / ((lngDif * FEET_IN_LNG_DEGREE) / accuracy); // convert to feet then get a point every <accuracy> feet
    var corners = this.getSearchArea(latDif, lngDif, 2);

    // fill latLngList with points within the area denoted by 'corners' equally spaced by
    // latVariation and lngVariation
    var latLngList = []; // stores  the latitude longitude points in the form [[lat1, lng1], [lat2, lng2], ...]
    var currLatValue = corners[3][0]; // starting latitude value (top boundary)
    var columns = 0; // number of columns in the area
    while (currLatValue >= corners[0][0]) {
      // iterate to the bottom boundary
      var currLngValue = corners[3][1]; // reset to the left boundary
      columns++;
      while (currLngValue <= corners[1][1]) {
        // iterate to the right boundary
        latLngList.push([currLatValue, currLngValue]);
        currLngValue += lngVariation;
      }
      currLatValue -= latVariation;
    }
    // calculate number of rows to include in the grid
    var rows = latLngList.length / columns;

    // get the api url
    var elevationApiURL = getElevationURLMulti(latLngList);

    // make API call with list of latitude/longitude points
    axios
      .get(elevationApiURL)
      .then((resp) => {
        console.log('Response received');
        console.log(resp);
        try {
          // fill the grid
          for (var i = 0; i < latLngList.length; i++) {
            // create the Location object with the latitude, longitude, and elevation data
            var loc = new Location(
              latLngList[i][0],
              latLngList[i][1],
              resp.data.elevationProfile[i].height
            );

            // get the row index
            var row = Math.floor(i / rows);
            if (row === grid.length) {
              grid.push([]);
            }

            // add the location to the grid
            grid[row].push(loc);
          }
          console.log(grid);
        } catch (error) {
          console.error(
            `Error: ${error}. Error extracting elevation. Ensure a valid address was input`
          );
        }
      })
      .catch((err) => {
        console.error(`Fetch failed with error ${err.message}`);
      });
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

    // TODO pass in grid
    let nodesList = [
      this.start,
      new Location(41.5, -72, 0),
      new Location(42, -71.5, 500),
      this.end,
    ];
    let path = new Dijkstra(nodesList, true);
    let matrix = path.createAdjacencyMatrix();
    path.determinePath(matrix);

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
      // start in bottom right
      return [
        [lat1 - latCushion, lng1 + lngCushion], // bottom right
        [lat2 + latCushion, lng1 + lngCushion], // top right
        [lat1 - latCushion, lng2 - lngCushion], // bottom left
        [lat2 + latCushion, lng2 - lngCushion], // top left
      ];
    } else if (lat1 <= lat2 && lng1 <= lng2) {
      // start in bottom left
      return [
        [lat1 - latCushion, lng2 + lngCushion], // bottom right
        [lat2 + latCushion, lng2 + lngCushion], // top right
        [lat1 - latCushion, lng1 - lngCushion], // bottom left
        [lat2 + latCushion, lng1 - lngCushion], // top left
      ];
    } else if (lat1 >= lat2 && lng1 >= lng2) {
      // start in top right
      return [
        [lat2 - latCushion, lng1 + lngCushion], // bottom right
        [lat1 + latCushion, lng1 + lngCushion], // top right
        [lat2 - latCushion, lng2 - lngCushion], // bottom left
        [lat1 + latCushion, lng2 - lngCushion], // top left
      ];
    }
    // lat1 >= lat2 && lng1 <= lng2
    // start in top left
    return [
      [lat2 - latCushion, lng2 + lngCushion], // bottom right
      [lat1 + latCushion, lng2 + lngCushion], // top right
      [lat2 - latCushion, lng1 - lngCushion], // bottom left
      [lat1 + latCushion, lng1 - lngCushion], // top left
    ];
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
    this.createAdjacencyMatrix = this.createAdjacencyMatrix.bind(this);
    this.determinePath = this.determinePath.bind(this);
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
    let pQueue = new PriorityQueue((a, b) => {
      if (a.dist < b.dist) {
        return -1;
      } else if (a.dist > b.dist) {
        return 1;
      } else {
        return 0;
      }
    });
    let start = {
      node: this.nodesList[0],
      dist: 0,
    };

    pQueue.push(start);
    for (let j = 0; j < this.nodesList.length - 1; j++) {
      pQueue.push({
        node: this.nodesList[j],
        //set elevation to large number to simulate infinity
        dist: 10000,
      });
    }
    console.log(pQueue.pop());
    console.log(pQueue.pop());
    //run dijkstra to get shortest path with adjMatrix values
    //at each step check to make sure distance within x%
    //if exceeds x%, set all neighbors of current node to infinity in matrix
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

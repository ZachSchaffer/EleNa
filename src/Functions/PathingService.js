//import PriorityQueue from 'priorityqueue';
import { getElevationURLAirMapMulti } from '../Functions/NetworkingFunctions';
import { Dijkstra, FEET_IN_LAT_DEGREE, FEET_IN_LNG_DEGREE} from './Dijkstra';
import Location from './Location';
import axios from 'axios';

export class PathingService {
  constructor(start, end, x, toggle) {
    this.start = start;
    this.end = end;
    this.x = x;
    this.toggle = toggle;
    this.createGrid = this.createGrid.bind(this);
    this.shortestPath = this.shortestPath.bind(this);
    this.getStartCorner = this.getStartCorner.bind(this);
  }

  setStartLocation(location) {
    this.start = location;
  }

  getStartLocation() {
    return this.start;
  }

  getEndLocation() {
    return this.end;
  }

  setToggle(toggle) {
    this.toggle = toggle;
  }

  setPercent(num) {
    this.x = num;
  }

  setEndLocation(location) {
    this.end = location;
  }

  //create grid of location objects in the search area
  async createGrid() {
    // 1 degree of latitude is 69 miles or 364k feet
    var grid = []; // grid to fill with Location objects

    // Retrieve the latitude and longitude differences
    var latDif = Math.abs(this.start.getLatitude() - this.end.getLatitude());
    var lngDif = Math.abs(this.start.getLongitude() - this.end.getLongitude());

    // calculates the accuracy
    // scales based on the flat distance between the two locations
    var accuracy = 27000 * Math.sqrt(latDif ** 2 + lngDif ** 2);

    // calculate distance between points and retrieve corners of the area
    var latVariation =
      latDif / Math.floor((latDif * FEET_IN_LAT_DEGREE) / accuracy); // convert to feet then get a point every <accuracy> feet
    var lngVariation =
      lngDif / Math.floor((lngDif * FEET_IN_LNG_DEGREE) / accuracy); // convert to feet then get a point every <accuracy> feet
    var corners = this.getSearchArea(latDif, lngDif, 0);

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
    //var rows = latLngPayload["locations"].length / columns;
    var rows = latLngList.length / columns;

    console.log(rows);
    console.log(columns);
    console.log(latLngList.length);

    // get the api url
    var elevationApiURL = getElevationURLAirMapMulti(latLngList);

    // make API call with list of latitude/longitude points
    await axios
      .get(elevationApiURL)
      .then((resp) => {
        //console.log('Response received');
        //console.log(resp);
        try {
          // fill the grid
          for (var i = 0; i < latLngList.length; i++) {
            // create the Location object with the latitude, longitude, and elevation data
            var loc = new Location(
              latLngList[i][0],
              latLngList[i][1],
              resp.data.data[i]
            );

            // get the row index
            var row = Math.floor(i / rows);
            if (row === grid.length) {
              grid.push([]);
            }

            // add the location to the grid
            grid[row].push(loc);
          }
          //console.log(grid);
        } catch (error) {
          console.error(
            `Error: ${error}. Error extracting elevation. Ensure a valid address was input`
          );
        }
      })
      .catch((err) => {
        console.error(`Fetch failed with error ${err.message}`);
      });
    return grid;
  }

  //calculate the path between 2 points
  async shortestPath() {
    let grid = await this.createGrid();
    let corner = this.getStartCorner();
    let width = grid[0].length;
    let height = grid.length;
    //turn grid into 1d array using a switch statement because the start node can be in different corners
    let flatGrid = [];
    switch (corner) {
      //bottom right
      case 0:
        for (let i = grid.length-1; i >=0; i++) {
          flatGrid = flatGrid.concat(grid[i].reverse());
        }
        break;
      //bottom left
      case 1:
        for (let i = grid.length-1; i >=0; i++) {
          flatGrid = flatGrid.concat(grid[i]);
        }
        break;
      //top right
      case 2:
        for (let i = 0; i < grid.length; i++) {
          flatGrid = flatGrid.concat(grid[i].reverse());
        }
        break;
      //top left
      default:
        for (let i = 0; i < grid.length; i++) {
          flatGrid = flatGrid.concat(grid[i]);
        }
    }
    console.log(flatGrid);
    let path = new Dijkstra(flatGrid, this.toggle, this.x);
    let matrix = path.createAdjacencyMatrix();
    return path.determinePath(matrix);
  }

  //calculate the search area within K % of the shortest path
  getSearchArea(latDif, lngDif, k) {
    var lat1 = this.start.getLatitude();
    var lng1 = this.start.getLongitude();
    var lat2 = this.end.getLatitude();
    var lng2 = this.end.getLongitude();
    var latCushion = (latDif * k) / 100; // latitude cushion of k%
    var lngCushion = (lngDif * k) / 100; // longitude cushion of k%
    var corner = this.getStartCorner();
    switch (corner) {
      case 0:
        // start in bottom right
        return [
          [lat1 - latCushion, lng1 + lngCushion], // bottom right
          [lat2 + latCushion, lng1 + lngCushion], // top right
          [lat1 - latCushion, lng2 - lngCushion], // bottom left
          [lat2 + latCushion, lng2 - lngCushion], // top left
        ];
      case 1:
        // start in bottom left
        return [
          [lat1 - latCushion, lng2 + lngCushion], // bottom right
          [lat2 + latCushion, lng2 + lngCushion], // top right
          [lat1 - latCushion, lng1 - lngCushion], // bottom left
          [lat2 + latCushion, lng1 - lngCushion], // top left
        ];
      case 2:
        // start in top right
        return [
          [lat2 - latCushion, lng1 + lngCushion], // bottom right
          [lat1 + latCushion, lng1 + lngCushion], // top right
          [lat2 - latCushion, lng2 - lngCushion], // bottom left
          [lat1 + latCushion, lng2 - lngCushion], // top left
        ];
      default:
        // start in top left
        return [
          [lat2 - latCushion, lng2 + lngCushion], // bottom right
          [lat1 + latCushion, lng2 + lngCushion], // top right
          [lat2 - latCushion, lng1 - lngCushion], // bottom left
          [lat1 + latCushion, lng1 - lngCushion], // top left
        ];
    }
  }
  // Returns integer representing which corner has the starting location
  getStartCorner() {
    var lat1 = this.start.getLatitude();
    var lng1 = this.start.getLongitude();
    var lat2 = this.end.getLatitude();
    var lng2 = this.end.getLongitude();
    if (lat1 <= lat2 && lng1 >= lng2) {
      return 0; // bottom right
    } else if (lat1 <= lat2 && lng1 <= lng2) {
      return 1; // bottom left
    } else if (lat1 >= lat2 && lng1 >= lng2) {
      return 2; // top right
    }
    // lat1 >= lat2 && lng1 <= lng2
    return 3; // top left
  }
}



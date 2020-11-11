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
}

let start = new Location(42.380368, -72.523143, 288.71);
let end = new Location(41, -71, 88);
let alg = new Algorithm(start, end);
alg.shortestPath();
//console.log(distance);

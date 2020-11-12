export default class Location {
    constructor(latitude, longitude, elevation) {
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

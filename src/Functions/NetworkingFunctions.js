export const getElevationURL = (lat, lng) => {
    return `http://open.mapquestapi.com/elevation/v1/profile?key=${process.env.REACT_APP_MAPQUEST_API_KEY}&unit=f&shapeFormat=raw&latLngCollection=${lat},${lng}`;
};

export const getGeoDataURL = (address) => {
    return `http://open.mapquestapi.com/geocoding/v1/address?key=${process.env.REACT_APP_MAPQUEST_API_KEY}&location=${address}`;
};

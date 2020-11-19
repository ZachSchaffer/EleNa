export const getElevationURL = (lat, lng) => {
  return `https://open.mapquestapi.com/elevation/v1/profile?key=${process.env.REACT_APP_MAPQUEST_API_KEY}&unit=f&shapeFormat=raw&latLngCollection=${lat},${lng}`;
};

export const getGeoDataURL = (address) => {
  return `https://open.mapquestapi.com/geocoding/v1/address?key=${process.env.REACT_APP_MAPQUEST_API_KEY}&location=${address}`;
};

// export const getElevationURLMulti = (pointList) => {
//   var latLngCollection = '';
//   pointList.forEach(function (pair) {
//     latLngCollection += ',' + pair[0].toString() + ',' + pair[1].toString();
//   });
//   return `http://open.mapquestapi.com/elevation/v1/profile?key=${
//     process.env.REACT_APP_MAPQUEST_API_KEY
//   }&unit=f&shapeFormat=raw&latLngCollection=${latLngCollection.substring(1)}`;
// };

export const getElevationURLAirMapMulti = (pointList) => {
  var latLngCollection = '';
  pointList.forEach(function (pair) {
    latLngCollection += ',' + pair[0].toString() + ',' + pair[1].toString();
  });
  return `https://api.airmap.com/elevation/v1/ele/?X-API-Key=${
    process.env.REACT_APP_AIRMAP_API_KEY
  }&points=${latLngCollection.substring(1)}`;
};

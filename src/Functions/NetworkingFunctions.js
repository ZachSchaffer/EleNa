import axios from 'axios';
import Location from './Location';

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

async function getLatAndLong(address) {
  let data = [];
  await axios
    .get(getGeoDataURL(address))
    .then((resp) => {
      console.log('Response received');
      console.log(resp);
      try {
        const longitude = resp.data.results[0].locations[0].displayLatLng.lng;
        const latitude = resp.data.results[0].locations[0].displayLatLng.lat;
        data = [latitude, longitude];
      } catch (error) {
        console.error(
          `Error: ${error}. Error extracting latitude/longitude. Ensure a valid address was input`
        );
      }
    })
    .catch((err) => {
      console.error(`Fetch failed with error ${err.message}`);
      this.setState({ fetchError: true, isLoading: false });
    });

  return data;
}

export async function handleFetchGeoData(address) {
  const data = await getLatAndLong(address);
  if (data === null) {
    return;
  }
  const lat = data[0];
  const lng = data[1];
  let location = null;

  await axios
    .get(getElevationURL(lat, lng))
    .then((resp) => {
      console.log('Response received');
      console.log(resp);
      try {
        const elevation = resp.data.elevationProfile[0].height;
        location = new Location(lat, lng, elevation);
      } catch (error) {
        console.error(
          `Error: ${error}. Error extracting elevation. Ensure a valid address was input`
        );
      }
    })
    .catch((err) => {
      console.error(`Fetch failed with error ${err.message}`);
    });

  return location;
}

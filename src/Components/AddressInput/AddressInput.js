import React from 'react';
import { Typography, FormControl, Input, InputLabel } from '@material-ui/core';
import axios from 'axios';
import PropTypes from 'prop-types';
import {
  getElevationURL,
  getGeoDataURL,
} from '../../Functions/NetworkingFunctions';
import Location from '../../Functions/Location';

class AddressInput extends React.Component {
  constructor(props) {
    super(props);
    this.handleFetchGeoData = this.handleFetchGeoData.bind(this);
    this.state = {
      address: '',
      fetchError: false,
      isLoading: true,
      location: null,
    };
  }

  // Re-calls handleFetchGeoData only when shouldFetch changes (this is updated in the parent by incrementing it on button click)
  componentDidUpdate(prevProps) {
    if (this.props.shouldFetch !== prevProps.shouldFetch) {
      this.handleFetchGeoData();
    }
  }

  // Fetches geo data based on an address, and then uses the latitude and longitude to fetch the elevation
  handleFetchGeoData() {
    this.setState({
      isLoading: true,
      fetchError: false,
      location: null,
    });
    axios
      .get(getGeoDataURL(this.state.address))
      .then((resp) => {
        console.log('Response received');
        console.log(resp);
        try {
          const longitude = resp.data.results[0].locations[0].displayLatLng.lng;
          const latitude = resp.data.results[0].locations[0].displayLatLng.lat;
          axios
            .get(getElevationURL(longitude, latitude))
            .then((resp) => {
              console.log('Response received');
              console.log(resp);
              try {
                const elevation = resp.data.elevationProfile[0].height;
                const location = new Location(latitude, longitude, elevation);
                this.setState({
                  isLoading: false,
                  location: location,
                });
                this.props.setLocation(location);
              } catch (error) {
                this.setState({
                  fetchError: true,
                  isLoading: false,
                });
                console.error(
                  `Error: ${error}. Error extracting elevation. Ensure a valid address was input`
                );
              }
            })
            .catch((err) => {
              console.error(`Fetch failed with error ${err.message}`);
              this.setState({
                fetchError: true,
                isLoading: false,
              });
            });
        } catch (error) {
          this.setState({ fetchError: true, isLoading: false });
          console.error(
            `Error: ${error}. Error extracting latitude/longitude. Ensure a valid address was input`
          );
        }
      })
      .catch((err) => {
        console.error(`Fetch failed with error ${err.message}`);
        this.setState({ fetchError: true, isLoading: false });
      });
  }

  render() {
    return (
      <div>
        <FormControl>
          <InputLabel>{this.props.addressLabel}</InputLabel>
          <Input
            aria-describedby={this.props.addressLabel}
            onChange={(e) => this.setState({ address: e.target.value })}
          />
        </FormControl>
        <br />
        <br />
        <Typography>
          Latitude:{' '}
          {this.state.fetchError || this.state.isLoading
            ? 'null'
            : this.state.location.getLatitude()}
        </Typography>
        <Typography>
          Longitude:{' '}
          {this.state.fetchError || this.state.isLoading
            ? 'null'
            : this.state.location.getLongitude()}
        </Typography>
        <Typography>
          Elevation:{' '}
          {this.state.fetchError || this.state.isLoading
            ? 'null'
            : `${this.state.location.getElevation()} ft`}
        </Typography>
      </div>
    );
  }
}

AddressInput.propTypes = {
  shouldFetch: PropTypes.number,
  setLocation: PropTypes.func,
  addressLabel: PropTypes.string,
};

export default AddressInput;

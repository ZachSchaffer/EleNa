import React from 'react';
import { Typography, FormControl, Input, InputLabel } from '@material-ui/core';
import axios from 'axios';
import PropTypes from 'prop-types';

class AddressInput extends React.Component {
    constructor(props) {
        super(props);
        this.handleFetchGeoData = this.handleFetchGeoData.bind(this);
        this.state = {
            address: '',
            fetchError: false,
            isLoading: true,
            latitude: null,
            longitude: null,
            elevation: null,
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
            latitude: null,
            longitude: null,
            elevation: null,
        });
        axios
            .get(
                `http://open.mapquestapi.com/geocoding/v1/address?key=${process.env.REACT_APP_MAPQUEST_API_KEY}&location=${this.state.address}`
            )
            .then((resp) => {
                console.log('Response received');
                console.log(resp);
                try {
                    this.setState({
                        longitude:
                            resp.data.results[0].locations[0].displayLatLng.lng,
                        latitude:
                            resp.data.results[0].locations[0].displayLatLng.lat,
                    });
                    axios
                        .get(
                            `http://open.mapquestapi.com/elevation/v1/profile?key=${process.env.REACT_APP_MAPQUEST_API_KEY}&unit=f&shapeFormat=raw&latLngCollection=${resp.data.results[0].locations[0].displayLatLng.lat},${resp.data.results[0].locations[0].displayLatLng.lng}`
                        )
                        .then((resp) => {
                            console.log('Response received');
                            console.log(resp);
                            try {
                                this.setState({
                                    elevation:
                                        resp.data.elevationProfile[0].height,
                                    isLoading: false,
                                });
                                this.props.setElevation(
                                    resp.data.elevationProfile[0].height
                                );
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
                            console.error(
                                `Fetch failed with error ${err.message}`
                            );
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
                        onChange={(e) =>
                            this.setState({ address: e.target.value })
                        }
                    />
                </FormControl>
                <br />
                <br />
                <Typography>
                    Latitude:{' '}
                    {this.state.fetchError || this.state.isLoading
                        ? 'null'
                        : this.state.latitude}
                </Typography>
                <Typography>
                    Longitude:{' '}
                    {this.state.fetchError || this.state.isLoading
                        ? 'null'
                        : this.state.longitude}
                </Typography>
                <Typography>
                    Elevation:{' '}
                    {this.state.fetchError || this.state.isLoading
                        ? 'null'
                        : `${this.state.elevation} ft`}
                </Typography>
            </div>
        );
    }
}

AddressInput.propTypes = {
    shouldFetch: PropTypes.number,
    setElevation: PropTypes.func,
    addressLabel: PropTypes.string,
};

export default AddressInput;

import React from 'react';
import {
    Typography,
    FormControl,
    Input,
    InputLabel,
    FormHelperText,
    Button,
} from '@material-ui/core';
import axios from 'axios';

class Home extends React.Component {
    constructor(props) {
        super(props);
        this.handleFetchGeoData = this.handleFetchGeoData.bind(this);
        this.state = {
            address: '',
            geoDataError: false,
            geoDataLoading: true,
            latitude: 'null',
            longitude: 'null',
        };
    }

    handleFetchGeoData() {
        this.setState({ geoDataLoading: true });
        this.setState({ geoDataError: false });
        axios
            .get(
                `http://open.mapquestapi.com/geocoding/v1/address?key=${process.env.REACT_APP_MAPQUEST_API_KEY}&location=${this.state.address}`
            )
            .then((resp) => {
                console.log('Response received');
                console.log(resp);
                try {
                    this.setState({
                        latitude:
                            resp.data.results[0].locations[0].displayLatLng.lat,
                    });
                    this.setState({
                        longitude:
                            resp.data.results[0].locations[0].displayLatLng.lng,
                    });
                } catch (error) {
                    this.setState({ geoDataError: true });
                    console.log(
                        'Error extracting latitude/longitude. Ensure a valid address was input'
                    );
                }
                this.setState({ geoDataLoading: false });
            })
            .catch((err) => {
                console.log(`Fetch failed with error ${err.message}`);
                this.setState({ geoDataError: true });
                this.setState({ geoDataLoading: false });
            });
    }

    render() {
        return (
            <div>
                <FormControl>
                    <InputLabel htmlFor="my-input">Address</InputLabel>
                    <Input
                        id="my-input"
                        aria-describedby="my-helper-text"
                        onChange={(e) =>
                            this.setState({ address: e.target.value })
                        }
                    />
                    <FormHelperText id="my-helper-text">
                        Input Address.
                    </FormHelperText>
                </FormControl>
                <Button onClick={this.handleFetchGeoData}>Get GeoData</Button>

                <Typography>
                    Latitude:{' '}
                    {this.state.geoDataError ? 'null' : this.state.latitude}
                </Typography>
                <Typography>
                    Longitude:{' '}
                    {this.state.geoDataError ? 'null' : this.state.longitude}
                </Typography>
            </div>
        );
    }
}

export default Home;

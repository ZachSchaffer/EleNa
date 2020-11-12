import React from 'react';
import { Button } from '@material-ui/core';
import AddressInput from './AddressInput';
import PathingService from '../Functions/PathingService';
import Location from '../Functions/Location';

class Home extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            shouldFetch: 0,
            startElevation: null,
            endElevation: null,
        };
        // TODO: this needs to be changed to take in the two location objects created by clicking the fetch data button
        var startLocation = new Location(42.340382, -72.496819, 5);
        var endLocation = new Location(42.35, -72.6, 2);
        var accuracy = 50;
        this.pathingService = new PathingService(
            startLocation,
            endLocation,
            accuracy
        );
    }

    setStartElevation(elevation) {
        this.setState({ startElevation: elevation });
    }
    setEndElevation(elevation) {
        this.setState({ endElevation: elevation });
    }

    computePath() {}

    render() {
        return (
            <div>
                <AddressInput
                    shouldFetch={this.state.shouldFetch}
                    setElevation={this.setStartElevation.bind(this)}
                    addressLabel="Starting Address"
                    inputID="Starting Input"
                />
                <br />
                <AddressInput
                    shouldFetch={this.state.shouldFetch}
                    setElevation={this.setEndElevation.bind(this)}
                    addressLabel="Ending Address"
                    inputID="Ending Input"
                />
                <br />
                <Button
                    onClick={() => {
                        this.setState({
                            shouldFetch: this.state.shouldFetch + 1,
                        });
                    }}
                    variant="contained"
                    color="primary"
                    aria-label="Fetch data for start and end address"
                >
                    Fetch Data
                </Button>
                <Button
                    onClick={this.pathingService.shortestPath}
                    variant="outlined"
                    color="primary"
                >
                    Test Dijkstra
                </Button>
                <Button
                    onClick={this.pathingService.createGrid}
                    variant="outlined"
                    color="primary"
                >
                    Test Create Grid
                </Button>
            </div>
        );
    }
}

export default Home;

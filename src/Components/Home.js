import React from 'react';
import { Button } from '@material-ui/core';
import AddressInput from './AddressInput';
import PathingService from '../Functions/PathingService';

class Home extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            shouldFetch: 0,
            startElevation: null,
            endElevation: null,
        };
        this.pathingService = new PathingService(0, 1);
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
                    onClick={() =>
                        this.setState({
                            shouldFetch: this.state.shouldFetch + 1,
                        })
                    }
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

import React from 'react';
import { Button } from '@material-ui/core';
import AddressInput from './AddressInput';

class Home extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            shouldFetch: 0,
            startElevation: null,
            endElevation: null,
        };
    }

    setStartElevation(elevation) {
        this.setState({ startElevation: elevation });
    }
    setEndElevation(elevation) {
        this.setState({ endElevation: elevation });
    }

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
            </div>
        );
    }
}

export default Home;

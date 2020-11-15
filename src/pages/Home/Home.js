import React from 'react';
import { Button, Typography, Grid } from '@material-ui/core';
import Map from '../../Components/MapView/MapView';
import AddressInput from '../../Components/AddressInput/AddressInput';
import PathingService from '../../Functions/PathingService';

class Home extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      shouldFetch: 0,
      startLocation: null,
      endLocation: null,
    };

    this.pathingService = new PathingService(null, null);
  }

  setStartLocation(location) {
    this.setState({ startLocation: location });
    this.pathingService.setStartLocation(location);
  }
  setEndLocation(location) {
    this.setState({ endLocation: location });
    this.pathingService.setEndLocation(location);
  }

  computePath() {}

  render() {
    return (
      <Grid container>
        <Grid item xs={3}>
          <AddressInput
            shouldFetch={this.state.shouldFetch}
            setLocation={this.setStartLocation.bind(this)}
            addressLabel="Starting Address"
            inputID="Starting Input"
          />
          <br />
          <AddressInput
            shouldFetch={this.state.shouldFetch}
            setLocation={this.setEndLocation.bind(this)}
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
            disabled={
              this.state.startLocation === null &&
              this.state.endLocation === null
            }
            onClick={this.pathingService.shortestPath}
            variant="outlined"
            color="primary"
          >
            Test Dijkstra
          </Button>
          <Button
            disabled={
              this.state.startLocation === null &&
              this.state.endLocation === null
            }
            onClick={this.pathingService.createGrid}
            variant="outlined"
            color="primary"
          >
            Test Create Grid
          </Button>
        </Grid>
        <Grid item xs={9}>
          <Map markers={[this.state.startLocation, this.state.endLocation]} />
        </Grid>
      </Grid>
    );
  }
}

export default Home;

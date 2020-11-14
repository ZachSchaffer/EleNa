import React from 'react';
import { Button, Typography } from '@material-ui/core';
import AddressInput from '../../Components/AddressInput/AddressInput';
import PathingService from '../../Functions/PathingService';
import Location from '../../Functions/Location';

class Home extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      shouldFetch: 0,
      startLocation: null,
      endLocation: null,
      pathingService: new PathingService(
        new Location(42.340382, -72.496819, 5),
        new Location(42.35, -72.6, 2)
      ),
    };
  }

  setStartLocation(location) {
    console.log('location', location);
    this.setState({ startLocation: location });
    this.state.pathingService.setStartLocation(location);
    console.log('new start', this.state.pathingService.getStartLocation());
  }
  setEndLocation(location) {
    console.log('location', location);
    this.setState({ endLocation: location });
    this.state.pathingService.setEndLocation(location);
    console.log('new end', this.state.pathingService.getEndLocation());
  }

  computePath() {}

  render() {
    return (
      <div>
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
          disabled={!this.state.pathingService.containsValidLocations()}
          onClick={this.state.pathingService.shortestPath}
          variant="outlined"
          color="primary"
        >
          Test Dijkstra
        </Button>
        <Button
          disabled={!this.state.pathingService.containsValidLocations()}
          onClick={this.state.pathingService.createGrid}
          variant="outlined"
          color="primary"
        >
          Test Create Grid
        </Button>
        <br />
        <Typography>
          Start latitude in pathing service:{' '}
          {this.state.pathingService.getStartLocation().getLatitude()} <br />{' '}
          End latitude in pathing service:{' '}
          {this.state.pathingService.getEndLocation().getLatitude()}
        </Typography>
      </div>
    );
  }
}

export default Home;

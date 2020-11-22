import React from 'react';
import { Button, CircularProgress, FormControl, InputLabel, Input, Typography, Switch } from '@material-ui/core';
import Map from '../../Components/MapView/MapView';
import { PathingService } from '../../Functions/PathingService';
import {
  handleFetchGeoData
} from '../../Functions/NetworkingFunctions';

class Home extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      componentIsLoading: false,
      startAddress: null,
      endAddress: null,
      accuracy: null,
      toggle: null,
      path: []
    };

    this.pathingService = new PathingService(null, null);
  }

  getElevationGain() {
    if (this.state.path === 0) {
      return '';
    }
    let gain = 0;
    let loss = 0;
    this.state.path && this.state.path.map((location, index) => {
      if (index !== 0) {
        let diff = this.state.path[index - 1].getElevation() - location.getElevation();
        if (diff > 0) {
          loss += Math.abs(diff);
        } else {
          gain += Math.abs(diff);
        }
      }
    });
    return <>
      <Typography>{`Incline: ${gain} feet`}</Typography>
      <br />
      <Typography>{`Decline: ${loss} feet`}</Typography></>;
  }

  async computePath() {
    this.setState({ componentIsLoading: true });
    const startLocation = await handleFetchGeoData(this.state.startAddress);
    const endLocation = await handleFetchGeoData(this.state.endAddress);
    console.log(startLocation, endLocation);
    if (!startLocation || !endLocation || (startLocation === endLocation)) {
      return;
    }
    this.pathingService.setStartLocation(startLocation);
    this.pathingService.setEndLocation(endLocation);
    this.pathingService.setToggle(this.state.toggle);
    this.pathingService.setPercent(this.state.accuracy);
    this.setState({ path: await this.pathingService.shortestPath() });
    this.setState({ componentIsLoading: false });
  }

  render() {

    return (
      <div>
        <div
          style={{
            width: '20vw',
            float: 'left',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <br />
          <br />
          <FormControl>
            <InputLabel>Starting Address</InputLabel>
            <Input
              multiline
              aria-describedby='starting-address'
              onChange={(e) => this.setState({ startAddress: e.target.value })}
            />
          </FormControl>
          <br />
          <br />
          <FormControl>
            <InputLabel>Ending Address</InputLabel>
            <Input
              multiline
              aria-describedby='ending-address'
              onChange={(e) => this.setState({ endAddress: e.target.value })}
            />
          </FormControl>
          <br />
          <br />
          <FormControl>
            <InputLabel>% Path Accuracy</InputLabel>
            <Input
              multiline
              aria-describedby='% Path Accuracy'
              onChange={(e) => this.setState({ accuracy: e.target.value })}
            />
          </FormControl>
          <br />
          <br />
          Toggle minimization
          <Switch
            onChange={(e) => this.setState({ toggle: e.target.checked })}
            name="checkedA"
            inputProps={{ 'aria-label': 'secondary checkbox' }}
          >
          </Switch>
          <br />
          <br />
          <Button
            onClick={() =>
              this.computePath()
            }
            disabled={(this.state.startAddress === this.state.endAddress) || !this.state.startAddress || !this.state.endAddress}
            variant="contained"
            color="primary"
            aria-label="Fetch data for start and end address"
          >
            Compute Path
          </Button>
          <br />
          <br />
          {this.getElevationGain()}
        </div>
        <div style={{
          float: 'right',
          width: '79vw',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center'
        }}>
          {!this.state.componentIsLoading ? (
            <Map markers={this.state.path} />
          ) : (
              <>
                <br />
                <br />
                <br />
                <CircularProgress align='center' color="inherit" size='10em' />
              </>
            )}
        </div>

      </div>
    );
  }
}

export default Home;

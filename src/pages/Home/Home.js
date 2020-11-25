import React from 'react';
import { Button, CircularProgress, FormControl, InputLabel, Input, Typography, Switch, FormHelperText } from '@material-ui/core';
import Map from '../../Components/MapView/MapView';
import { PathingService } from '../../Functions/PathingService';
import { handleFetchGeoData } from '../../Functions/NetworkingFunctions';
import TurnByTurn from '../TurnByTurn/TurnByTurn';

class Home extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      componentIsLoading: false,
      startAddress: null,
      endAddress: null,
      accuracy: 20,
      toggle: false,
      path: []
    };

    this.pathingService = new PathingService(null, null, 0, false);
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
      <Typography>{`Incline: ${gain} meters`}</Typography>
      <br />
      <Typography>{`Decline: ${loss} meters`}</Typography></>;
  }

  async computePath() {
    this.setState({ componentIsLoading: true });
    const startLocation = await handleFetchGeoData(this.state.startAddress);
    const endLocation = await handleFetchGeoData(this.state.endAddress);
    console.log("start: ", startLocation, "end: " , endLocation);
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
            width: '18vw',
            float: 'left',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            padding: '1vw',
          }}
        >
          <br />
          <br />
          <FormControl fullWidth>
            <InputLabel>Starting Address</InputLabel>
            <Input
              multiline
              aria-describedby="starting-address"
              onChange={(e) => this.setState({ startAddress: e.target.value })}
            />
          </FormControl>
          <br />
          <br />
          <FormControl fullWidth>
            <InputLabel>Ending Address</InputLabel>
            <Input
              multiline
              aria-describedby="ending-address"
              onChange={(e) => this.setState({ endAddress: e.target.value })}
            />
          </FormControl>
          <br />
          <br />
          <FormControl fullWidth>
            <InputLabel>% Away From Shortest Path</InputLabel>
            <Input
              type="number"
              value={this.state.accuracy}
              aria-describedby='% Path Accuracy'
              onChange={(e) => this.setState({ accuracy: e.target.value })}
            />
          </FormControl>
          {!(this.state.accuracy>=5 && this.state.accuracy<=100) && (
            <FormControl error fullWidth>
                <FormHelperText>
                    Please input a number between 5 and 100
                </FormHelperText>
            </FormControl>
          )}
          <br />
          <br />
          <Typography>{this.state.toggle ? 'Maximize Elevation' : 'Minimize Elevation'}</Typography>
          <Switch
            onChange={(e) => this.setState({ toggle: e.target.checked })}
            name="checkedA"
            inputProps={{ 'aria-label': 'secondary checkbox' }}
          ></Switch>
          Toggle Map / Turn By Turn
          <Switch
            disabled={!this.state.path.length || this.state.path.length===0}
            onChange={(e) => this.setState({ mapToggle: e.target.checked })}
            name="checkedA"
            inputProps={{ 'aria-label': 'secondary checkbox' }}
          ></Switch>
          <br />
          <br />
          <Button
            onClick={() => this.computePath()}
            disabled={!(this.state.accuracy>=5 && this.state.accuracy<=100) || (this.state.startAddress === this.state.endAddress) || !this.state.startAddress || !this.state.endAddress}
            variant="contained"
            color="primary"
            aria-label="Fetch data for start and end address"
          >
            Compute Path
          </Button>
          <br />
          <br />
          {this.getElevationGain()}
          <br />
          {this.state.path.length > 0 && <>
            <Typography>{`The elevation at the start is ${this.state.path[0].getElevation()} meters`}</Typography>
            <br />
            <Typography>{`The elevation at the end is ${this.state.path[this.state.path.length - 1].getElevation()} meters`}</Typography>
          </>}

        </div>
        <div style={{
          float: 'right',
          width: '80vw',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center'
        }}>
          {!this.state.componentIsLoading ? (
            !this.state.mapToggle ? (
              <Map markers={this.state.path} />
            ) : (
              <TurnByTurn path={this.state.path}/>
            )
          ) : (
            <>
              <br />
              <br />
              <br />
              <CircularProgress align="center" color="inherit" size="10em" />
            </>
          )}
        </div>
      </div>
    );
  }
}

export default Home;

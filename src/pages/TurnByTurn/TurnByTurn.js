import React from 'react';
import { Grid } from '@material-ui/core';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';

export default class TurnByTurn extends React.Component {
  constructor(props) {
    super();
    this.state = {
      path: props.path,
      currentIndex: 0,
    };
    this.getDirection = this.getDirection.bind(this);
    this.getDistance = this.getDistance.bind(this);
    this.nextDirection = this.nextDirection.bind(this);
  }

  nextDirection() {
    this.props.updateIndex && this.props.updateIndex(this.state.currentIndex+1);
    this.setState({ currentIndex: this.state.currentIndex + 1 });
  }

  getDirection() {
    let direction = '';
    let currentLoc = this.state.path[this.state.currentIndex];
    let nextLoc = this.state.path[this.state.currentIndex+1];
    if (currentLoc.getLatitude() < nextLoc.getLatitude()) {
      direction = direction + 'North';
    } else if (currentLoc.getLatitude() > nextLoc.getLatitude()) {
      direction = direction + 'South';
    } else {
      direction = direction + '';
    }
    if (currentLoc.getLongitude() < nextLoc.getLongitude()) {
      direction = direction + 'East';
    } else if (currentLoc.getLongitude() > nextLoc.getLongitude()) {
      direction = direction + 'West';
    } else {
      direction = direction + '';
    }
    return direction
  }
  
  getDistance() {
    const FEET_IN_LAT_DEGREE = 364000;
    const FEET_IN_LNG_DEGREE = 364434.53; // only for Amherst, MA
    var latDif = Math.abs(this.state.path[this.state.currentIndex].getLatitude() - this.state.path[this.state.currentIndex+1].getLatitude());
    var lngDif = Math.abs(this.state.path[this.state.currentIndex].getLongitude() - this.state.path[this.state.currentIndex+1].getLongitude());
    var latFeet = latDif * FEET_IN_LAT_DEGREE;
    var lngFeet = lngDif * FEET_IN_LNG_DEGREE;
    return (Math.sqrt(latFeet ** 2 + lngFeet ** 2) * 0.3048).toFixed(3); // Distance in miles
  }

  getElevation() {
    let currentLoc = this.state.path[this.state.currentIndex];
    let nextLoc = this.state.path[this.state.currentIndex+1];
    let elevation = '';
    try {
      elevation = nextLoc.getElevation() - currentLoc.getElevation();
    } catch (error) {
      console.error("error getting elevations");
    }
    return elevation ;
  }

  render() {
    return (
      <div style={{ marginTop: '2em' }}>
        <Grid
          container
          direction="column"
          justify="center"
          alignItems="center"
          spacing={2}
        >
          <Grid item>
            <Card style={{ minWidth: '20vw' }}>
              {this.state.currentIndex < this.state.path.length-1 ? (
                <div>
                  <CardContent>
                    <Typography color="textSecondary" gutterBottom>
                      Current Location:{' '}
                      {this.state.path[this.state.currentIndex]
                        .getLatitude()
                        .toFixed(5)}{' '}
                      °N{' '}
                      {
                        -this.state.path[this.state.currentIndex]
                          .getLongitude()
                          .toFixed(5)
                      }{' '}
                      °W
                    </Typography>
                    <hr />
                    <Typography color="textSecondary" gutterBottom>
                      Destination:{' '}
                      {this.state.path[this.state.path.length - 1]
                        .getLatitude()
                        .toFixed(5)}{' '}
                      °N{' '}
                      {
                        -this.state.path[this.state.path.length - 1]
                          .getLongitude()
                          .toFixed(5)
                      }{' '}
                      °W
                    </Typography>
                    <Typography variant="h5" component="p">
                      Turn {this.getDirection()}
                    </Typography>
                    <Typography variant="h5" component="p">
                      Travel {this.getDistance()} Meters
                    </Typography>
                    <Typography variant="h5" component="p">
                      Incline: {this.getElevation()} Meters
                    </Typography>
                  </CardContent>
                  <CardActions>
                    <Button size="small" onClick={this.nextDirection}>
                      Next Direction
                    </Button>
                  </CardActions>
                </div>
              ) : (
                <CardContent>
                  <Typography variant="h2">You have arrived!</Typography>
                </CardContent>
              )}
            </Card>
          </Grid>
        </Grid>
      </div>
    );
  }
}

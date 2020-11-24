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
      currentIndex: 1,
      prevIndex: 0,
    };
    this.getDirection = this.getDirection.bind(this);
    this.getDistance = this.getDistance.bind(this);
    this.nextDirection = this.nextDirection.bind(this);
  }

  nextDirection() {
    this.state.prevIndex = this.state.currentIndex;
    this.setState({ currentIndex: this.state.currentIndex + 1 });
  }

  getDirection() {
    let currentLoc = this.state.path[this.state.currentIndex];
    let prevLoc = this.state.path[this.state.prevIndex];
    if (currentLoc.getLongitude() < prevLoc.getLongitude()) {
      return 'West';
    } else if (currentLoc.getLongitude() > prevLoc.getLongitude()) {
      return 'East';
    } else {
      return '';
    }
  }

  getDistance() {
    let currentLoc = this.state.path[this.state.currentIndex];
    let prevLoc = this.state.path[this.state.prevIndex];
    return (
      Math.abs(currentLoc.getLongitude() - prevLoc.getLongitude()) * 111320
    ).toFixed(3);
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
              {this.state.currentIndex < this.state.path.length ? (
                <div>
                  <CardContent>
                    <Typography color="textSecondary" gutterBottom>
                      Current Location:{' '}
                      {this.state.path[this.state.currentIndex].getLatitude()}{' '}
                      °N{' '}
                      {-this.state.path[this.state.currentIndex].getLongitude()}{' '}
                      °W
                    </Typography>
                    <hr />
                    <Typography color="textSecondary" gutterBottom>
                      Destination: Boston, MA
                    </Typography>
                    <Typography variant="h5" component="p">
                      Turn {this.getDirection()}
                    </Typography>
                    <Typography variant="h5" component="p">
                      Travel {this.getDistance()} Meters
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

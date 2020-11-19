import React from 'react';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';

export default class DirectionCard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      currLat: this.props.currLat,
      currLong: this.props.currLong,
      destLat: this.props.destLat,
      destLong: this.props.destLong,
    };

    this.getDirection = this.getDirection.bind(this);
    this.getDistance = this.getDistance.bind(this);
  }

  getDirection() {
    return '6° East';
  }

  getDistance() {
    return '2 Miles';
  }

  render() {
    return (
      <Card style={{ minWidth: '20vw' }}>
        <CardContent>
          <Typography color="textSecondary" gutterBottom>
            Current Location: 30.438493° West 10° North
          </Typography>
          <hr />
          <Typography color="textSecondary" gutterBottom>
            Destination: Boston, MA
          </Typography>
          <Typography variant="h5" component="p">
            Turn {this.getDirection()}
          </Typography>
          <Typography variant="h5" component="p">
            Travel {this.getDistance()}
          </Typography>
        </CardContent>
        <CardActions>
          <Button size="small">Next Direction</Button>
        </CardActions>
      </Card>
    );
  }
}

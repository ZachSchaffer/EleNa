import React from 'react';
import { Button, Typography } from '@material-ui/core';

export default class Home extends React.Component {
  render() {
    return (
      <div>
        <Button variant="outlined" color="primary">
          Primary
        </Button>
        <Typography>Hello from Home.js</Typography>
      </div>
    );
  }
}

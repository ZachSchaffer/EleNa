import React, { Component } from 'react';
import { Button, Typography, Grid } from '@material-ui/core';
import Map from '../../Components/Map/Map'


export default class Home extends React.Component {


  render() {
    return (
      <Grid container>
        <Grid item xs={3}>
        <Button variant="outlined" color="primary">
          Primary
        </Button>
        <Typography>Hello from Home.js</Typography>

        </Grid>
      <Grid item xs={9}>
      <Map location={{
          address: '1600 Amphitheatre Parkway, Mountain View, california.',
          lat: 37.42216,
          lng: -122.08427,
        }} zoomLevel={17} />
      </Grid>
      </Grid>
    );
  }
}

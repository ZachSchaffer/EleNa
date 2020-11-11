import React, { Component } from 'react';
import { Button, Typography } from '@material-ui/core';
import GoogleMapReact from 'google-map-react';

 


export default class Home extends React.Component {

  static defaultProps = {
    center: {lat: 59.95, lng: 30.33},
    zoom: 11
  };

  render() {
    return (
      <div>
        <Button variant="outlined" color="primary">
          Primary
        </Button>
        <Typography>Hello from Home.js</Typography>

       {/* Important! Always set the container height explicitly */}
       <div>
        <GoogleMapReact
          style={{}}
          defaultCenter={this.props.center}
          defaultZoom={this.props.zoom}
          />
      </div>
      </div>
    );
  }
}

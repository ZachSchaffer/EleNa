import React, { Component } from 'react';
import ReactMapGL, { Marker, ScaleControl } from 'react-map-gl';
import RoomIcon from '@material-ui/icons/Room';
import { Typography } from '@material-ui/core';
import PropTypes from 'prop-types';
import PolylineOverlay from '../PolylineOverlay/PolylineOverlay';
//import Location from '../../Functions/Location';

class MapView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      viewport: {
        width: '80vw',
        height: '92vh',
        latitude: 42.380368,
        longitude: -72.523143,
        zoom: 12,
      },
    };
  }

  // TODO: play around with the numbers on this and increase color range
  getColor(start, end) {
    const diff = start - end;
    if (diff > 5) {
      return 'blue';
    } else if (diff > 0) {
      return 'green';
    } else if (diff > -3) {
      return 'yellow';
    } else if (diff>-6) {
      return 'orange';
    } else {
      return 'red';
    }
  }

  render() {
    const { viewport } = this.state;

    return (
      <ReactMapGL
        id="map"
        {...viewport}
        onViewportChange={(viewport) => this.setState({ viewport })}
        mapStyle={`https://api.maptiler.com/maps/streets/style.json?key=${process.env.REACT_APP_MAPTILLER_API_KEY}`}
        mapboxApiAccessToken={process.env.REACT_APP_MAPBOX_API_KEY}
      >
        <ScaleControl maxWidth={100} unit={'imperial'} />
        {this.props.markers.map(
          (marker, index) =>
            index !== 0 && (
              <PolylineOverlay
                color={this.getColor(
                  this.props.markers[index - 1].getElevation(),
                  this.props.markers[index].getElevation()
                )}
                key={index}
                points={[
                  [
                    this.props.markers[index - 1].getLongitude(),
                    this.props.markers[index - 1].getLatitude(),
                  ],
                  [
                    this.props.markers[index].getLongitude(),
                    this.props.markers[index].getLatitude(),
                  ],
                ]}
              />
            )
        )}

        {this.props.markers.map(
          (marker, index) =>
            (index === 0 || index === this.props.markers.length - 1) && (
              <Marker
                key={index}
                latitude={marker.getLatitude()}
                longitude={marker.getLongitude()}
                offsetTop={-32}
                offsetLeft={-18}
              >
                <>
                  <Typography>{index === 0 ? 'Start' : 'End'}</Typography>
                  <RoomIcon style={{ fontSize: '36px' }} color="error" />
                </>
              </Marker>
            )
        )}
      </ReactMapGL>
    );
  }
}
MapView.defaultProps = {
  markers: [
    /*new Location(42.396242, -72.512482, 357.61),
    new Location(43.396242, -74.512482, 500.61),
    new Location(46.396242, -74.512482, 490.61),
    new Location(45.396242, -76.512482, 357.61),*/
  ],
};

MapView.propTypes = {
  markers: PropTypes.array,
};

export default MapView;

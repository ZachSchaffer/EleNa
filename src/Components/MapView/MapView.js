import React, { Component } from 'react';
import ReactMapGL, { Marker } from 'react-map-gl';
import RoomIcon from '@material-ui/icons/Room';
import PropTypes from 'prop-types';

class MapView extends Component {
  constructor(props) {
    super(props);
    this.viewport = {
      width: '70vw',
      height: '80vh',
      latitude: 42.380368,
      longitude: -72.523143,
      zoom: 12,
    };
  }

  render() {
    return (
      <ReactMapGL
        {...this.viewport}
        onViewportChange={(viewport) => this.setState({ viewport })}
        mapStyle={`https://api.maptiler.com/maps/streets/style.json?key=${process.env.REACT_APP_MAPTILLER_API_KEY}`}
        mapboxApiAccessToken={process.env.REACT_APP_MAPBOX_API_KEY}
      >
        {this.props.markers.map(
          (marker) =>
            marker && (
              <Marker
                key={marker.getLatitude()}
                latitude={marker.getLatitude()}
                longitude={marker.getLongitude()}
                offsetLeft={-20}
                offsetTop={-10}
              >
                <RoomIcon color="error" />
              </Marker>
            )
        )}
      </ReactMapGL>
    );
  }
}

MapView.propTypes = {
  markers: PropTypes.array,
};

export default MapView;

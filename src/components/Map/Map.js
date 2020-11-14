import React from 'react'
import GoogleMapReact from 'google-map-react'
import './map.css'

const AnyReactComponent = ({ text }) => <div>{text}</div>;

export default class Home extends React.Component {
    render() {
        return(
            <div className="map">
                <h2 className="map-h2">Come Visit Us At Our Campus</h2>

                <div className="google-map">
                <GoogleMapReact
                    bootstrapURLKeys={{ key: '' }}
                    defaultCenter={this.props.location}
                    defaultZoom={this.props.zoomLevel}
                >
                    <AnyReactComponent
                    lat={this.props.lat}
                    lng={this.props.lng}
                    text={this.props.address}
                    />
                </GoogleMapReact>
                </div>
            </div>
        );
    }
}

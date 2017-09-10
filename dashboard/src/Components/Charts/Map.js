import React, { Component } from 'react';
import GoogleMapReact from 'google-map-react';

const GoogleAPIKey = "AIzaSyBA_pWtvqSQOCcYWyOe4pSjpprBFM-fLX0";

class Map extends Component{
  constructor(props) {
    super(props);
    this.onMarkerClick = this.onMarkerClick.bind(this);
    this.renderMarkers = this.renderMarkers.bind(this);
  }

  onMarkerClick(){

  }
  renderMarkers(map, maps){
    this.props.data.map((param,index)=>{
      let marker = new maps.Marker({
        position: {lat:param.latitude,lng:param.longtitude},
        map,
        title: param.label,
        id: index,
      });
    });
  }

  render(){
    return (
      <GoogleMapReact
          bootstrapURLKeys={{key:GoogleAPIKey}}
          defaultCenter={this.props.center}
          defaultZoom={this.props.zoom}
          onGoogleApiLoaded={({map, maps}) => this.renderMarkers(map, maps)}
          style={{width: '100%',height: '300px'}}>
      </GoogleMapReact>
    );
  }
}
Map.defaultProps = {
  center: {lat: 9.95, lng: 30.33},
  zoom: 1
};
var numbers = ["integer","real","numeric"];
Map.description = {
    name: "map",
    label: "Map",
    params: [
      {name:"latitude",type:numbers,description: "",optional: false},
      {name:"longtitude",type:numbers,description: "",optional: false},
    ]
};

export default Map;
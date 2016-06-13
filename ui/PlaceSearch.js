'use strict';
import React, {Component,} from 'react'
import {View} from 'react-native'
import GaodePlaceTip from "./GaodePlaceTip"
import GooglePlaceTip from "./GooglePlaceTip"
import Global from '../io/Global'

export default class PlaceSearch extends Component {
  constructor(props) {
      super(props);
      //this.homePlace = {description: 'Home', geometry: { location: { lat: -43.5347, lng: 172.604 } }};
      //this.workPlace = {description: 'Work', geometry: { location: { lat: -43.5235, lng: 172.586 } }};
  } 
  renderGaode() {
    return (
      <GaodePlaceTip
        placeholder='Search Place in GaoDe'
        minLength={2} // minimum length of text to search
        autoFocus={false}
        fetchDetails={false}
        onPress={(data, details = null) => { // 'details' is provided when fetchDetails = true
          //alert('data:'+JSON.stringify(data)+'\n\n details:'+JSON.stringify(details))
          if(typeof data.id === 'undefined') {
	    var latlng = details.geometry.location;
            this.props.onSelect({latitude:latlng.lat,longitude:latlng.lng, latitudeDelta:0.02,longitudeDelta:0.02,address:data.description});
	  }else{  //'lng,lat'
            this.props.onSelect({latitude:data.location.split(',')[1],longitude:data.location.split(',')[0], latitudeDelta:0.02,longitudeDelta:0.02,address:data.description});
	  }
        }}
        getDefaultValue={() => {
          return ''; // text input default value
        }}
	// available options: http://lbs.amap.com/api/webservice/reference/search
	// http://restapi.amap.com/v3/assistant/inputtips?key=308284158ecae3fe85cfcee5d1322d03keywords=
	//   key: '308284158ecae3fe85cfcee5d1322d03',
	//   types: 180101, // poi types: like 180101
	//   city: 010,     //beijing/010/110000
	//   citylimit:false, //only in this city
	//   children:1,
	//   page:1,
	//   offset:20,
	//   extensions:base, //[base,all]
	//   sig:
	//   output:json,   //[json,xml]
	//   callback:
	//
        query={{
          key: '308284158ecae3fe85cfcee5d1322d03',
        }}
	styles={{
          description: {
            fontWeight: 'bold',
          },
          predefinedPlacesDescription: {
            color: '#1faadb',
          },
        }}
        currentLocation={false} // Will add a 'Current location' button at the top of the predefined places list
        currentLocationLabel="My location"
        //nearbyPlacesAPI='GooglePlacesSearch' // Which API to use: GoogleReverseGeocoding or GooglePlacesSearch
        //predefinedPlaces={[this.homePlace, this.workPlace]}
        //predefinedPlacesAlwaysVisible={true}
      />
    );
  }
  renderGoogle() {
    return (
      <GooglePlaceTip
        placeholder='Search Place in Google'
        minLength={2} // minimum length of text to search
        autoFocus={false}
        fetchDetails={false}
        onPress={(data, details = null) => { // 'details' is provided when fetchDetails = true
          //alert('data:'+JSON.stringify(data)+'\n\n details:'+JSON.stringify(details))
          if(typeof data.id === 'undefined') {
            var latlng = details.geometry.location;
            this.props.onSelect({latitude:latlng.lat,longitude:latlng.lng, latitudeDelta:0.02,longitudeDelta:0.02,addr:data.description});
          }else{  //'lng,lat'
            this.props.onSelect({latitude:data.location.split(',')[1],longitude:data.location.split(',')[0], latitudeDelta:0.02,longitudeDelta:0.02,addr:data.description});
          }
        }}
        getDefaultValue={() => {
          return ''; // text input default value
        }}
        // available options: http://lbs.amap.com/api/webservice/reference/search
        // http://restapi.amap.com/v3/assistant/inputtips?key=308284158ecae3fe85cfcee5d1322d03keywords=
        //   key: '308284158ecae3fe85cfcee5d1322d03',
        //   types: 180101, // poi types: like 180101
        //   city: 010,     //beijing/010/110000
        //   citylimit:false, //only in this city
        //   children:1,
        //   page:1,
        //   offset:20,
        //   extensions:base, //[base,all]
        //   sig:
        //   output:json,   //[json,xml]
        //   callback:
        //
        query={{
          key: '308284158ecae3fe85cfcee5d1322d03',
        }}
        styles={{
          description: {
            fontWeight: 'bold',
          },
          predefinedPlacesDescription: {
            color: '#1faadb',
          },
        }}
        currentLocation={false} // Will add a 'Current location' button at the top of the predefined places list
        currentLocationLabel="My location"
        //nearbyPlacesAPI='GooglePlacesSearch' // Which API to use: GoogleReverseGeocoding or GooglePlacesSearch
        //predefinedPlaces={[this.homePlace, this.workPlace]}
        //predefinedPlacesAlwaysVisible={true}
      />
    );
  }

  renderSearchBar(){
      switch(Global.MAP) {
          case 'GoogleMap':
              return this.renderGoogle()
              break;
          case 'BaiduMap':
              return this.renderGaode()
              break;
          default:
              return null;
      }
  }
  render(){
      return (
	<View>
	  { this.renderSearchBar() }
	</View>
      )
  }
};

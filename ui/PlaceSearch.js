'use strict';
import React, {Component,} from 'react'
import {View,Platform} from 'react-native'
import GaodePlaceTip from "./GaodePlaceTip"
import BaiduPlaceTip from "./BaiduPlaceTip"
import GooglePlaceTip from "./GooglePlaceTip"
import Global from '../io/Global'

export default class PlaceSearch extends Component {
  constructor(props) {
      super(props);
      //this.homePlace = {description: 'Home', geometry: { location: { lat: -43.5347, lng: 172.604 } }};
      //this.workPlace = {description: 'Work', geometry: { location: { lat: -43.5235, lng: 172.586 } }};
  } 
  renderBaidu() {
    var mcode = 'com.share.2016';    //ios mcode
    var ak = 'Cyq8AKxGeAVNZSzV0Dk74dGpRsImpIHu';    //ios ak
    var rel_and_mcode = 'F9:F3:46:15:55:59:22:6A:FB:75:92:FF:23:B4:75:AF:20:E7:22:D6;com.share'
    var dev_and_mcode = '81:1E:3F:40:F6:F6:4F:68:D7:6E:79:BC:18:CA:AC:26:84:14:1C:F7;com.share'
    var demo_mcode = 'DA:4C:B6:A9:55:62:1D:AD:12:29:DD:7B:69:31:67:47:C5:B2:4E:E1;szj.com.ditu'
    if (Platform.OS === 'android') {
	ak='6MbvSM9MLCPIOYK4I05Ox0FGoggM5d9L';    //android ak
	//ak='VRMNc7QoiSM5ar5at5g3lRQD';          //android demo ak
        mcode=(__DEV__) ? dev_and_mcode : rel_and_mcode
    }

    return (
      <BaiduPlaceTip
        placeholder='Search Place in Baidu'
        minLength={2} // minimum length of text to search
        autoFocus={false}
        fetchDetails={false}
        onPress={(data, details = null) => { // 'details' is provided when fetchDetails = true
          alert('data:'+JSON.stringify(data)+'\n\n details:'+JSON.stringify(details))
          //if(typeof data.id === 'undefined') {
          //  var latlng = details.geometry.location;
          //  this.props.onSelect({latitude:latlng.lat,longitude:latlng.lng, latitudeDelta:0.02,longitudeDelta:0.02,address:data.description});
          //}else{  //'lng,lat'
            this.props.onSelect({latitude:data.location.lat,longitude:data.location.lng, latitudeDelta:0.02,longitudeDelta:0.02,address:data.description});
          //}
        }}
        getDefaultValue={() => {
          return ''; // text input default value
        }}
        // available options: http://lbsyun.baidu.com/index.php?title=webapi/place-suggestion-api
        // http://api.map.baidu.com/place/v2/suggestion?query=tiananmen&region=131&output=json&ak=xxxxxx
        //   ak: '6MbvSM9MLCPIOYK4I05Ox0FGoggM5d9L',
        //   region: 'beijing' 
        //   location: 'lat,lng'
        //   output: json/xml
        //   sn: user's priviledge signature
        //   timestamp: work with sn
        //
        query={{
          ak: ak,
          mcode: mcode,
	  //location: '0,0', //no location, no work
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
  renderGaode() {
    return (
      <GaodePlaceTip
        placeholder='Search Place in GaoDe'
        minLength={2} // minimum length of text to search
        autoFocus={false}
        fetchDetails={false}
        onPress={(data, details = null) => { // 'details' is provided when fetchDetails = true
          //alert('data:'+JSON.stringify(data)+'\n\n details:'+JSON.stringify(details))
          //if(typeof data.id === 'undefined') {
	  //  var latlng = details.geometry.location;
          //  this.props.onSelect({latitude:latlng.lat,longitude:latlng.lng, latitudeDelta:0.02,longitudeDelta:0.02,address:data.description});
	  //}else{  //'lng,lat'
            this.props.onSelect({latitude:data.location.split(',')[1],longitude:data.location.split(',')[0], latitudeDelta:0.02,longitudeDelta:0.02,address:data.description});
	  //}
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
        fetchDetails={true}
        onPress={(data, details = null) => { // 'details' is provided when fetchDetails = true
            //alert('data:'+JSON.stringify(data)+'\n\n details:'+JSON.stringify(details))
            var latlng = details.geometry.location;
            //alert('lat:'+latlng.lng+'\n lng:'+latlng.lng+'\n addr:'+data.description)
            this.props.onSelect({latitude:latlng.lat,longitude:latlng.lng, latitudeDelta:0.02,longitudeDelta:0.02,address:data.description});
        }}
        getDefaultValue={() => {
          return ''; // text input default value
        }}
        query={{
          key: 'AIzaSyApl-_heZUCRD6bJ5TltYPn4gcSCy1LY3A',
          language: 'en', // language of the results
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
              return this.renderBaidu()
              break;
          case 'GaodeMap':
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

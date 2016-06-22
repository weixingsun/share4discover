'use strict';
import React, {Component,} from 'react'
import GooglePlacesAutocomplete from "./GooglePlaceTip"

export default class GooglePlaces extends Component {
  constructor(props) {
      super(props);
      this.state = {
          selectedType: this.props.selectedType,
      };
      //this.homePlace = {description: 'Home', geometry: { location: { lat: -43.5347, lng: 172.604 } }};
      //this.workPlace = {description: 'Work', geometry: { location: { lat: -43.5235, lng: 172.586 } }};
  } 
  render() {
    return (
      <GooglePlacesAutocomplete
        placeholder='Search Place in Google'
        minLength={3} // minimum length of text to search
        autoFocus={false}
        fetchDetails={true}
        onPress={(data, details = null) => { // 'details' is provided when fetchDetails = true
          // data = details 
          //alert('data:'+JSON.stringify(data)+'\n\n details:'+JSON.stringify(details))
	  var latlng = details.geometry.location;
          this.props.onSelect({latitude:latlng.lat, longitude:latlng.lng, latitudeDelta:0.02,longitudeDelta:0.02, addr:data.description });
	  //ToastAndroid.show('details.geometry.location='+JSON.stringify(latlng), ToastAndroid.LONG); //SHORT
        }}
        getDefaultValue={() => {
          return ''; // text input default value
        }}
        // available options: https://developers.google.com/places/web-service/autocomplete
        //types: '(cities)', // default: 'geocode'
        query={{
          key: 'AIzaSyApl-_heZUCRD6bJ5TltYPn4gcSCy1LY3A',
          language: 'en'
        }}
        key = { 'AIzaSyApl-_heZUCRD6bJ5TltYPn4gcSCy1LY3A' }
	styles={{
          description: {
            fontWeight: 'bold',
          },
          predefinedPlacesDescription: {
            color: '#1faadb',
          },
        }}
        currentLocation={false} // Will add a 'Current location' button at the top of the predefined places list
        //currentLocationLabel="My location"
        nearbyPlacesAPI='GooglePlacesSearch' // Which API to use: GoogleReverseGeocoding or GooglePlacesSearch
        GoogleReverseGeocodingQuery={{
          // available options for GoogleReverseGeocoding API : https://developers.google.com/maps/documentation/geocoding/intro
        }}
        GooglePlacesSearchQuery={{
          // available options for GooglePlacesSearch API : https://developers.google.com/places/web-service/search
          rankby: 'distance',
          types: 'food',
        }}
        filterReverseGeocodingByTypes={['locality', 'administrative_area_level_3']} 
	// filter the reverse geocoding results by types - ['locality', 'administrative_area_level_3'] if you want to display only cities
        //predefinedPlaces={[this.homePlace, this.workPlace]}
        //predefinedPlacesAlwaysVisible={true}
      />
    );
  }
};

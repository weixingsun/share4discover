'use strict';
import React, {ToastAndroid,Component,} from 'react-native'
import {GooglePlacesAutocomplete} from "./GooglePlacesAutocomplete"

export default class GooglePlaces extends Component {
  constructor(props) {
      super(props);
      this.state = {
          selectedType: this.props.selectedType,
      };
      this.homePlace = {description: 'Home', geometry: { location: { lat: 48.8152937, lng: 2.4597668 } }};
      this.workPlace = {description: 'Work', geometry: { location: { lat: 48.8496818, lng: 2.2940881 } }};
  } 
  render() {
    return (
      <GooglePlacesAutocomplete
        placeholder='Search'
        minLength={3} // minimum length of text to search
        //autoFocus={false}
        autoFocus={true}
        fetchDetails={true}
        onPress={(data, details = null) => { // 'details' is provided when fetchDetails = true
          // data = details 
	  var latlng = details.geometry.location;
          this.props.onSelect({latitude:latlng.lat, longitude:latlng.lng, latitudeDelta:0.02,longitudeDelta:0.02 });
	  //ToastAndroid.show('details.geometry.location='+JSON.stringify(latlng), ToastAndroid.LONG); //SHORT
        }}
        getDefaultValue={() => {
          return ''; // text input default value
        }}
        query={{
          // available options: https://developers.google.com/places/web-service/autocomplete
          key: 'AIzaSyApl-_heZUCRD6bJ5TltYPn4gcSCy1LY3A',
          language: 'en', // language of the results
          //types: '(cities)', // default: 'geocode'
        }}
	styles={{
          description: {
            fontWeight: 'bold',
          },
          predefinedPlacesDescription: {
            color: '#1faadb',
          },
        }}
        currentLocation={true} // Will add a 'Current location' button at the top of the predefined places list
        currentLocationLabel="Current location"
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
        predefinedPlaces={[this.homePlace, this.workPlace]}
        predefinedPlacesAlwaysVisible={true}
      />
    );
  }
};

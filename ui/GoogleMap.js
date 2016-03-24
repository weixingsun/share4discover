'use strict';

var React = require('react-native');
var {View, Text, StyleSheet, ScrollView} = React;
import MapView from 'react-native-maps'
//import MapGL from 'react-native-mapbox-gl'
import Store from "../io/Store"
import Style from "./Style"
import PriceMarker from './PriceMarker'

var GoogleMap = React.createClass({
  onRegionChange(region) {
    this.setState({ region });
    Store.save('region', region);
  },
  onLongPress(event) {
    console.log(event.nativeEvent);
    //this.addCircle({id: ccid++, c:event.nativeEvent.coordinate,r:100,s:'#ff0000' });
    this.addMarker({id: this.state.mkid++, pos: event.nativeEvent.coordinate, s:'#0000ff' });
  },
  addMarker(marker){
    var {markers} = this.state;
    this.setState({
      markers:[
        ...markers,
        marker]
    });
  },
  addCircle(circle){
    var {circles} = this.state;
    this.setState({
      circles:[
        ...circles,
        circle]
    });
  },
  getInitialState() {
    return {
      region: {    //check on start up
        latitude: 0,
        longitude: 0,
        latitudeDelta: 10,
        longitudeDelta: 10,
      },
      mkid:0,
      markers: [],
      ccid:0,
      circles: [],
    };
  },
    render(){
        return (
            <MapView
              style={Style.absoluteContainer}
              showsUserLocation={true}
              onRegionChangeComplete={this.onRegionChange}
              initialRegion={this.props.region}
              //region={this.state.region}
              //mapType=standard,satellite,hybrid
              onLongPress={this.onLongPress} >
                 {this.state.markers.map(
                  marker => (
                    <MapView.Marker
                    key={marker.id}
                    coordinate={marker.pos}
                    pinColor={marker.s}
                    //title={marker.title}
                    //description={marker.description}
                    //onSelect={(e) => console.log('onSelect', e)}
                    >
                        <PriceMarker amount={99} color={marker.s} />
                    </MapView.Marker>
                  ))}
            </MapView>
        );
    }
});

var styles = {
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F5FCFF',
    },
    welcome: {
        fontSize: 20,
        textAlign: 'center',
        margin: 10,
    },
    instructions: {
        textAlign: 'center',
        color: '#333333',
        marginBottom: 5,
    },
    card: {
      flex: 1,
      borderWidth: 1,
      //backgroundColor: '#fff',
      borderColor: 'rgba(0,0,0,0.1)',
      margin: 5,
      //height: 150,
      //height: 600,
      padding: 15,
      shadowColor: '#ccc',
      shadowOffset: { width: 2, height: 2, },
      shadowOpacity: 0.5,
      shadowRadius: 3,
    },
    map: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 50,
    },
};

module.exports = GoogleMap;

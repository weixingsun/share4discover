'use strict';

import React,{View, Text, StyleSheet, ScrollView, Component, } from 'react-native'
import NavigationBar from 'react-native-navbar'
import MapView from 'react-native-maps'
import IIcon from 'react-native-vector-icons/Ionicons'
//import MapGL from 'react-native-mapbox-gl'
import Store from "../io/Store"
import Style from "./Style"
import PriceMarker from './PriceMarker'

export default class GoogleMap extends Component {
  constructor(props) {
      super(props);
      this.state = {
        region: {    //check on start up
          latitude: 0,
          longitude: 0,
          latitudeDelta: 10,
          longitudeDelta: 10,
        },
        mkid:0,
        markers: [], //this.props.markers!=null?this.props.markers:[],
        ccid:0,
        circles: [],
      };
      this.msg = this.props.msg;
      this.renderNavBar   = this.renderNavBar.bind(this);
      this.onRegionChange = this.onRegionChange.bind(this);
      this.back = this.back.bind(this);
  }
  componentWillMount(){
    var _this = this;
    if(this.msg!=null){
      this.addMarker({id: this.state.mkid++, pos: {latitude:parseFloat(this.msg.lat), longitude:parseFloat(this.msg.lng)}, s:'#0000ff' });
    }
  }
  back(){
    this.props.navigator.pop();
  }
  renderNavBar() {
      if(this.msg!=null){
        return (
          <NavigationBar style={Style.navbar} title={{title:this.msg.title,}}
            leftButton={
                <IIcon name={"ios-arrow-thin-left"} color={'#3B3938'} size={40} onPress={this.back} />
            }
          />);
      }
  }
  onRegionChange(region) {
    this.setState({ region:region });
    Store.save('region', region);
  }
  onLongPress(event) {
    console.log(event.nativeEvent);
    //this.addCircle({id: ccid++, c:event.nativeEvent.coordinate,r:100,s:'#ff0000' });
    this.addMarker({id: this.state.mkid++, pos: event.nativeEvent.coordinate, s:'#0000ff' });
  }
  addMarker(marker){
    var {markers} = this.state;
    this.setState({
      markers:[
        ...markers,
        marker]
    });
  }
  addCircle(circle){
    var {circles} = this.state;
    this.setState({
      circles:[
        ...circles,
        circle]
    });
  } 
    render(){
        return (
          <View style={{flex:1}}>
            <MapView
              style={Style.absoluteContainer}
              showsUserLocation={true}
              onRegionChangeComplete={this.onRegionChange}
              initialRegion={this.props.region}
              //region={this.state.region}
              //mapType=standard,satellite,hybrid
              //onLongPress={this.onLongPress} 
              >
                 {this.state.markers.map(
                  marker => (
                    <MapView.Marker
                    key={marker.id}
                    coordinate={marker.pos}
                    pinColor={marker.s}
                    //title={marker.title}
                    //description={marker.description}
                    //onSelect={(e) => console.log('onSelect', e)}
                    //    <PriceMarker amount={99} color={marker.s} />
                    >
                    </MapView.Marker>
                  ))}
            </MapView>
            { this.renderNavBar() }
          </View>
        );
    }
};

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

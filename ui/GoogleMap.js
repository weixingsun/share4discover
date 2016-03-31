'use strict';

import React,{View, Text, StyleSheet, ScrollView, Component, } from 'react-native'
import NavigationBar from 'react-native-navbar'
import MapView from 'react-native-maps'
import IIcon from 'react-native-vector-icons/Ionicons'
//import MapGL from 'react-native-mapbox-gl'
import Store from "../io/Store"
import Style from "./Style"
import PriceMarker from './PriceMarker'
import Overlay from './Overlay'
import SearchAddr from './SearchAddr'

export default class GoogleMap extends Component {
    constructor(props) {
      super(props);
      this.state = {
        center: {lat:0,lng:0},
        region: this.props.region,
        mkid:0,
        markers: [],
        ccid:0,
        circles: [],
        initialPosition: 'unknown',
        lastPosition: 'unknown',
        gps: true,
      };
      this.msg = this.props.msg;
      this.renderNavBar   = this.renderNavBar.bind(this);
      this.onRegionChange = this.onRegionChange.bind(this);
      this.back = this.back.bind(this);
      this.switchGps = this.switchGps.bind(this);
      this.search = this.search.bind(this);
      this.watchID = (null: ?number);
    }
    componentWillMount(){
      var _this = this;
      if(this.msg!=null){
        var lat=parseFloat(this.msg.lat);
        var lng=parseFloat(this.msg.lng);
        this.addMarker({id: this.incMarkerId(), pos: {latitude:lat, longitude:lng}, s:'#0000ff' });
        this.setState({region:{latitude:lat,longitude:lng, latitudeDelta:0.02,longitudeDelta:0.02}});
        //autofit to multiple waypoints
      }
    }
    componentDidMount() {
      navigator.geolocation.getCurrentPosition( 
        (position) => {
          var initialPosition = JSON.stringify(position); 
          this.setState({initialPosition}); 
          alert('initialPosition:'+initialPosition)
        }, 
        (error) => alert(error.message), 
        {enableHighAccuracy: true, timeout: 20000, maximumAge: 1000} 
      ); 
      this.turnOnGps();
      //alert('GpsWatchID:'+this.watchID);
    }
    componentWillUnmount() { 
      navigator.geolocation.clearWatch(this.watchID);
    }
    turnOnGps(){
      this.watchID = navigator.geolocation.watchPosition((position) => {
        var lastPosition = JSON.stringify(position);
        this.setState({lastPosition});
      });
      this.setState({gps:true});
    }
    turnOffGps(){
      navigator.geolocation.clearWatch(this.watchID);
      this.setState({gps:false});
    }
    switchGps(){
      if(this.state.gps) {
          this.turnOffGps();
          alert('Gps Off');
      }else{ 
          this.turnOnGps();
      }
    }
    back(){
      this.props.navigator.pop();
    }
    search(){
      this.props.navigator.push({
        component: SearchAddr,
        callback:(place)=>{
          //this.state.center=place;
          this.move(place); 
          this.addMarker({id: this.incMarkerId(), pos: place, s:'#0000ff' });
        }
      });
    }
    move(p){
      this.refs.map.animateToRegion(p);
    }
    renderNavBar() {
      if(this.msg!=null){
        return (
          <NavigationBar style={Style.navbar} title={{title:this.msg.title,}}
            leftButton={
                <IIcon name={"ios-arrow-thin-left"} color={'#3B3938'} size={40} onPress={this.back} />
            }
          />);
      }else{
        return (
          <NavigationBar style={Style.navbar}
            leftButton={
                <IIcon name={"ios-search"} color={'#3B3938'} size={40} onPress={this.search} />
            }
          />
        );
      }
    }
    renderDetailOverlay() {
      if(this.msg!=null){
        return ( <Overlay style={Style.detail} msg={this.msg}/>  );
      }
    }
    renderGpsIcon(){
      if(this.state.gps) 
          return (<IIcon style={Style.gpsIcon} name={"ios-navigate-outline"} color={'#222222'} size={40} onPress={this.switchGps} />);
      else 
          return (<IIcon style={Style.gpsIcon} name={"ios-navigate-outline"} color={'#CCCCCC'} size={40} onPress={this.switchGps} />);
    }
    onRegionChange(r) {
      this.setState({ region: r, });
      Store.save('region', r);
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
    incMarkerId(){
      this.setState({mkid:this.state.mkid+1});
      return this.state.mkid;
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
            { this.renderNavBar() }
            <MapView
              ref='map'
              style={Style.map}
              showsUserLocation={true}
              rotateEnabled={false}
              onRegionChangeComplete={this.onRegionChange}
              initialRegion={this.state.region}
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
            { this.renderGpsIcon() }
            { this.renderDetailOverlay() }
          </View>
        );
    }
};

'use strict';

import React,{View, Text, StyleSheet, ScrollView, Component, } from 'react-native'
import NavigationBar from 'react-native-navbar'
import MapView from 'react-native-maps'
import IIcon from 'react-native-vector-icons/Ionicons'
//import MapGL from 'react-native-mapbox-gl'
import Store from "../io/Store"
import Tool from "../io/Tool"
import JsonAPI from "../io/Net"
import Style from "./Style"
import PriceMarker from './PriceMarker'
import Overlay from './Overlay'
import SearchAddr from './SearchAddr'

export default class GoogleMap extends Component {
    constructor(props) {
      super(props);
      this.state = {
        filters: this.props.filters,
        center: {lat:0,lng:0},
        region: this.props.region,
        mkid:1,
        markers: [],
        ccid:0,
        circles: [],
        initialPosition: null,
        lastPosition: null,
        gps: false,
      };
      this.myPosMarker = null;
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
      Store.get('gps_position').then(function(value) {
          if(value!=null){
              _this.setState({initialPosition: value});
          }
      });
    }
    componentDidMount() {
      /*navigator.geolocation.getCurrentPosition((position) => {
          this.setState({lastPosition: position.coords}); 
        }, 
        (error) => alert(error.message), 
        {enableHighAccuracy: true, timeout: 3000, maximumAge: 1000} 
      );*/ 
      //this.turnOnGps();
    }
    componentWillUnmount() { 
      this.turnOffGps();
    }
    turnOnGps(){
      this.watchID = navigator.geolocation.watchPosition(
        (position) => {
          this.updateMyPos(position.coords);
        },
        (error) => console.log(error.message),
        {enableHighAccuracy: true, timeout: 30000, maximumAge: 1000, distanceFilter:30},
      );
      this.setState({gps:true});
    }
    turnOffGps(){
      navigator.geolocation.clearWatch(this.watchID);
      this.setState({gps:false});
    }
    switchGps(){
      if(this.state.gps) {
          this.turnOffGps();
      }else{ 
          this.turnOnGps();
      }
    }
    getRegion(lat,lng){
        return {latitude:lat, longitude:lng, latitudeDelta:this.state.region.latitudeDelta,longitudeDelta:this.state.region.longitudeDelta }
    }
    updateMyPos(position){
        this.myPosMarker = {id: 0, pos: position, s:'#0000ff' };
        Store.save('gps_position', position);
        this.moveOrNot(position);
        this.setState({lastPosition: position});
    }
    renderMyPosMarker(){
      if(this.myPosMarker===null) return null;
      else
      return (
        <MapView.Marker
        key={0}
        coordinate={this.myPosMarker.pos}
        //pinColor={'#0000ff'}
        //title={marker.title}
        //description={marker.description}
        //onSelect={(e) => console.log('onSelect', e)}
        //    <PriceMarker amount={99} color={marker.s} />
        >
            <IIcon name={"record"} color={'#3333ff'} size={16} />
        </MapView.Marker>
      );
    }
    renderPlaceMarkers(){
        return this.state.markers.map(
          marker => (
            <MapView.Marker
            key={marker.id}
            coordinate={marker.pos}
            pinColor={marker.s}
            //title={marker.title}
            //description={marker.description}
            //onSelect={(e) => console.log('onSelect', e)}
            //    <PriceMarker amount={99} color={marker.s} />
            />
        ));
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
    moveOrNot(position){
        //if(this.state.lastPosition!=null || this.state.initialPosition!=null) {
          //var oldpos = this.state.lastPosition==null?this.state.initialPosition:this.state.lastPosition;
          //if(Tool.distance(oldpos, position) > 5) {
          //this.move(this.getRegion(position.latitude,position.longitude));
          //}
        //}
        this.move(this.getRegion(position.latitude,position.longitude));
    }
    fetch(){
       var range = this.distance(this.state.region.latitudeDelta)
       this.reload(this.props.filters,this.state.region)
    }
    reload(filters,location) {
      var self = this;
      JsonAPI.rangeMsg(filters.type, location.latitude+','+location.longitude, filters.range).then((rows)=> {
          self.renderMarkers(rows)
      })
      .catch((e)=>{
        alert('Network Problem!')
      });
    }
    distance(latDelta){
       return Math.floor(111111 * latDelta); //110574
    }
    distanceComplex(lat1, lon1, lat2, lon2) {
      var R = 6371;
      var a = 0.5 - Math.cos((lat2 - lat1) * Math.PI / 180)/2 + 
         Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
         (1 - Math.cos((lon2 - lon1) * Math.PI / 180))/2;
      var m = R * 2 * Math.asin(Math.sqrt(a))*1000;
      return Math.floor(m);
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
          <NavigationBar style={Style.navbar} //title={{title:this.title}}
            leftButton={
                <IIcon name={"ios-search"} color={'#3B3938'} size={40} onPress={this.search} />
            }
            rightButton={
                <IIcon name={'ios-cloud-download-outline'} color={'#3B3938'} size={40} onPress={this.fetch.bind(this)} />
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
      //alert(JSON.stringify(event.nativeEvent.coordinate));
      //this.addCircle({id: ccid++, c:event.nativeEvent.coordinate,r:100,s:'#ff0000' });
      this.addMarker({id: this.state.mkid++, pos: event.nativeEvent.coordinate, s:'#0000ff' });
    }
    renderMarkers(rows){
       rows.map((row)=>{
         //row ={ lat,lng,type,title,content,ctime, }
         var point = {latitude:parseFloat(row.lat), longitude:parseFloat(row.lng)}
         this.addMarker({id: this.state.mkid++, pos: point, s:'#0000ff' });
       })
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
              //showsUserLocation={this.state.gps}
              rotateEnabled={false}
              showsScale={true}
              onRegionChangeComplete={this.onRegionChange}
              initialRegion={this.state.region}
              //region={this.state.region}
              //mapType=standard,satellite,hybrid
              onLongPress={this.onLongPress.bind(this)} 
              >
                 {this.renderMyPosMarker()}
                 {this.renderPlaceMarkers()}
            </MapView>
            { this.renderGpsIcon() }
            { this.renderDetailOverlay() }
          </View>
        );
    }
};

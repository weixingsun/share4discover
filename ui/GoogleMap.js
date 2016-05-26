'use strict';
import React, { Component } from 'react'
import {View, Text, StyleSheet, ScrollView, } from 'react-native'
import NavigationBar from 'react-native-navbar'
import MapView from 'react-native-maps'
import {Icon} from './Icon'
//import MapGL from 'react-native-mapbox-gl'
import Store from "../io/Store"
import Tool from "../io/Tool"
import JsonAPI from "../io/Net"
import Style from "./Style"
import PriceMarker from './PriceMarker'
import Overlay from './Overlay'
import SearchAddr from './SearchAddr'
import {checkPermission,requestPermission} from 'react-native-android-permissions';

export default class GoogleMap extends Component {
    constructor(props) {
      super(props);
      //this.fa_place_icon = {estate:'home',car:'car',taxi:'taxi',};
      this.icons = {estate:'ion-ios-home',car:'ion-ios-car',taxi:'fa-taxi',};
      this.state = {
        filters: this.props.filters,
        center: {lat:0,lng:0},
        region: this.props.region,
        mkid:1,
        markers: [],
        ccid:0,
        circles: [],
        //initialPosition: null,
        lastPosition: null,
        gps: this.props.gps,
      };
      this.permissions=['ACCESS_FINE_LOCATION','ACCESS_COARSE_LOCATION'];
      //this.myPosMarker = null;
      this.msg = this.props.msg;
      //this.renderNavBar   = this.renderNavBar.bind(this);
      this.watchID = (null: ?number);
    }
    singlePermission(name){
        requestPermission('android.permission.'+name).then((result) => {
          console.log(name+" Granted!", result);
          // now you can set the listenner to watch the user geo location
        }, (result) => {
          console.log(name+" Not Granted!");
          console.log(result);
        });
    }

    permission(){ 
        this.singlePermission('ACCESS_FINE_LOCATION')
        this.singlePermission('ACCESS_COARSE_LOCATION')
    }
    componentWillMount(){
        this.permission();
        //if(this.all_permissions_granted) alert()
      var _this = this;
      if(this.msg!=null){
        var lat=parseFloat(this.msg.lat);
        var lng=parseFloat(this.msg.lng);
        this.addMarker({id: this.incMarkerId(), pos: {latitude:lat, longitude:lng}, color:'blue', icon:this.icons[this.msg.type] });
        this.setState({region:{latitude:lat,longitude:lng, latitudeDelta:0.02,longitudeDelta:0.02}});
        //autofit to multiple waypoints
      }
      /*Store.get(Store.GPS_POS).then(function(value) {
          if(value!=null){
              _this.setState({initialPosition: value});
          }
      });*/
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
          //this.updateMyPos(position.coords);
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
    /*updateMyPos(position){
        this.myPosMarker = {id: 0, pos: position, s:'#0000ff' };
        Store.save(Store.GPS_POS, position);
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
            <Icon name={"circle"} color={'#3333ff'} size={16} />
        </MapView.Marker>
      );
    }*/
    renderPlaceMarkers(){
        return this.state.markers.map(
          marker => (
            <MapView.Marker
            key={marker.id}
            coordinate={marker.pos}
            //pinColor={marker.s}
            //title={marker.title}
            //description={marker.description}
            //onSelect={(e) => console.log('onSelect', e)}
            >
                <Icon size={26} color={marker.color} name={marker.icon} />
            </MapView.Marker>
        ));
    }
    back(){
      this.props.navigator.pop();
    }
    search(place){
        this.move(place); 
        this.addMarker({id: this.incMarkerId(), pos: place, s:'#0000ff' });
    }
    move(p){
      this.refs.map.animateToRegion(p);
    }
    between(n, n1,delta){
        return (n > n1-delta) && (n < n1+delta)
    }
    pointInBBox(position){
        var latIn=false,lngIn=false;
        //alert(JSON.stringify(position))
        if(this.between(position.latitude,  this.state.region.latitude,  this.state.region.latitudeDelta))
            latIn=true
        if(this.between(position.longitude, this.state.region.longitude, this.state.region.longitudeDelta))
            lngIn=true
        return latIn && lngIn;
    }
    moveOrNot(position){
        if(!this.pointInBBox(position))
        this.move(this.getRegion(position.latitude,position.longitude));
    }
    reload() {
      var self = this;
      var range = this.distance(this.state.region.latitudeDelta,this.state.region.longitudeDelta)
      JsonAPI.rangeMsg(this.props.filters.type, this.state.region, range).then((rows)=> {
          self.clearMarkers();
          self.renderMarkers(rows);
          //if(!self.comparefilters()) self.setState({filters:self.props.filters})
      })
      .catch((e)=>{
        alert('Network Problem!')
      });
    }
    distance(latDelta,lngDelta){
       return Math.floor(111111 * Math.min(latDelta,lngDelta)); //range circle in bbox
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
                <Icon name={"ion-ios-arrow-back"} color={'#3B3938'} size={40} onPress={this.back.bind(this)} />
            }
          />);
      }else{
        return (
          <NavigationBar style={Style.navbar} //title={{title:this.title}}
            leftButton={
                <Icon name={"ion-ios-search"} color={'#3B3938'} size={40} onPress={() => this.props.drawer.open()} />
            }
            rightButton={
                <Icon name={'ion-ios-cloud-download-outline'} color={'#3B3938'} size={40} onPress={this.reload.bind(this)} />
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
          return (<Icon style={Style.gpsIcon} name={"ion-ios-navigate-outline"} color={'#222222'} size={40} onPress={this.switchGps.bind(this)} />);
      else 
          return (<Icon style={Style.gpsIcon} name={"ion-ios-navigate-outline"} color={'#CCCCCC'} size={40} onPress={this.switchGps.bind(this)} />);
    }
    onRegionChange(r) {
      this.setState({ region: r, });
      Store.save('region', r);
    }
    onLongPress(event) {
      //alert(JSON.stringify(event.nativeEvent.coordinate));
      //this.addCircle({id: ccid++, c:event.nativeEvent.coordinate,r:100,s:'#ff0000' });
      //this.addMarker({id: this.state.mkid++, pos: event.nativeEvent.coordinate, s:'#0000ff' });
    }
    clearMarkers(){
      this.setState({
        mkid:1,
        markers: [],
      });
    }
    renderMarkers(rows){
       rows.map((row)=>{
         //row ={ lat,lng,type,title,content,ctime, }
         var point = {latitude:parseFloat(row.lat), longitude:parseFloat(row.lng)}
         this.addMarker({id: this.state.mkid++, pos: point, color:'blue', icon:this.icons[row.type] });
       })
    }
    addMarker(marker){
      var {markers} = this.state;
      this.setState({
        markers:[
          ...markers,
          marker]
      });
      //alert(this.state.markers.length)
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
    comparefilters(){
        //alert('first:'+this.firstLoad+'\nstate:'+JSON.stringify(this.state.filters)+'\nprops:'+JSON.stringify(this.props.filters))
        if(this.props.filters === this.state.filters) return true;
        else return false;
    }
    render(){
        //this.reload(this.props.filters,this.state.region)
        //alert('render()')
        return (
          <View style={{flex:1}}>
            { this.renderNavBar() }
            <MapView
              ref='map'
              style={Style.map}
              showsUserLocation={this.state.gps}
              rotateEnabled={false} //showsCompass={true}
              showsScale={true}
              onRegionChangeComplete={this.onRegionChange.bind(this)}
              initialRegion={this.state.region}
              //region={this.state.region}
              //mapType=standard,satellite,hybrid
              onLongPress={this.onLongPress.bind(this)} 
              >
                 {this.renderPlaceMarkers()}
            </MapView>
            { this.renderGpsIcon() }
            { this.renderDetailOverlay() }
          </View>
        );
    }
};
//{this.renderMyPosMarker()}

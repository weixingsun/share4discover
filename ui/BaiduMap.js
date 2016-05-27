'use strict';
import React, { Component } from 'react'
import { DeviceEventEmitter, View, Text, StyleSheet, ScrollView, } from 'react-native'
import NavigationBar from 'react-native-navbar'
import {Icon,getImageSource} from './Icon'
//import MapGL from 'react-native-mapbox-gl'
import Store from "../io/Store"
import Tool from "../io/Tool"
import Loading from "./Loading"
import JsonAPI from "../io/Net"
import Style from "./Style"
import PriceMarker from './PriceMarker'
import Overlay from './Overlay'
import SearchAddr from './SearchAddr'
import MapView from 'react-native-baidumap';
import KKLocation from 'react-native-baidumap/KKLocation';

export default class BaiduMap extends Component {
    constructor(props) {
      super(props);
      this.state = {
        filters: this.props.filters,
        //region: this.props.region,
        mkid:1,
        markers: [],
        polylines:[
                    {coordinates: [
                        {latitude: 39.832136, longitude: 116.34095},
                        {latitude: 39.832136, longitude: 116.42095},
                        {latitude: 39.902136, longitude: 116.42095},
                        {latitude: 39.902136, longitude: 116.44095}
                     ],
                     strokeColor: '#666666', lineWidth: 3
                    }
                ],
        ccid:0,
        circles: [],
        //initialPosition: null,
        //lastPosition: null,
        gps: this.props.gps,
        isLoading: true,
      };
      this.region = this.props.region
      this.userPosition = {}
      this.myPosMarker = null
      this.placeMarker = null
      this.msg = this.props.msg
      this.watchID = (null: ?number)
      //this.onRegionChange = this.onRegionChange.bind(this)
      //this.onMarkerClick = this.onMarkerClick.bind(this)
    }
    loadSettings(){
        var _this = this;
        getImageSource('ion-ios-circle-filled', 30, 'blue').then((source) => {
            this.setState({
                userIcon: source,
            });
        });
        /*Store.get(Store.GPS_POS).then(function(value) {
            if(value!=null){
                _this.setState({initialPosition: value});
            }
        });*/
        getImageSource('fa-map-marker', 40, 'blue').then((source) => {
            if(this.msg!=null){
                var lat=parseFloat(this.msg.lat);
                var lng=parseFloat(this.msg.lng);
                this.addMarker({ latitude:lat, longitude:lng, title:this.msg.title, subtile:this.msg.content, image:source });
                this.region = {latitude:lat,longitude:lng, latitudeDelta:0.02,longitudeDelta:0.02}
                //autofit to multiple waypoints
            }
            this.setState({isLoading:false, markerIcon: source,});
        });
    }
    componentWillMount(){
        var _this=this;
        this.loadSettings();
        DeviceEventEmitter.addListener('regionChange', function(event: Event){
            //alert('regionChange:'+JSON.stringify(event))
            _this.onRegionChange(event)
        });
        DeviceEventEmitter.addListener('markerClick', function(event: Event){
            //alert('markerClick:'+JSON.stringify(event))
            _this.onMarkerClick(event)
        });
    }
    componentDidMount() {
      /*navigator.geolocation.getCurrentPosition((position) => {
          this.setState({lastPosition: position.coords}); 
        }, 
        (error) => alert(error.message), 
        {enableHighAccuracy: true, timeout: 3000, maximumAge: 1000} 
      ); 
      if(this.state.markerIcon!=null){
        //this.refs["mapView"].zoomToLocs([[39.918541, 116.4835]]);
        KKLocation.getCurrentPosition((position) => {
          console.log("location get current position: ", position);
        }, (error) => {
          console.log("location get current position error: ", error);
        });
        this.watchID = KKLocation.watchPosition((position) => {
          console.log("watch position: ", position);
        });
      }*/
    }
    componentWillUnmount() { 
      this.turnOffGps();
      //DeviceEventEmitter.removeListener('regionChange', this.onRegionChange);
    }
    turnOnGps(){
      /*this.watchID = navigator.geolocation.watchPosition(
        (position) => {
          this.updateMyPos(position.coords);
        },
        (error) => console.log(error.message),
        {enableHighAccuracy: true, timeout: 30000, maximumAge: 1000, distanceFilter:30},
      );*/

        /*KKLocation.getCurrentPosition((position) => {
          console.log("location get current position: ", position);
        }, (error) => {
          console.log("location get current position error: ", error);
        });*/
        this.watchID = KKLocation.watchPosition(
            (position) => {
                //alert("watch position: "+ position);
                this.userPosition= position;
                //alert(JSON.stringify(position))
            },
            (error) => {
                //alert("watch position error: "+ error);
            },
            {enableHighAccuracy: true, timeout: 30000, maximumAge: 2000, distanceFilter:30},
        );
        this.setState({gps:true});
    }
    turnOffGps(){
      //navigator.geolocation.clearWatch(this.watchID);
      KKLocation.clearWatch(this.watchID);
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
        this.myPosMarker = { latitude:position.latitude, longitude:position.longitude, title: 'Me', subtitle: '', image: this.state.userIcon }
        Store.save(Store.GPS_POS, position);
        this.moveOrNot(position);
        //this.setState({lastPosition: position});
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
            <Icon name={"fa-circle"} color={'#3333ff'} size={16} />
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
    search(place){
        this.move(place); 
        //this.addMarker({ latitude:place.latitude, longitude:place.longitude, title: this.msg.title, subtile: this.msg.content, image: this.state.markerIcon })
        //this.addMarker({id: this.incMarkerId(), pos: place, s:'#0000ff' });
    }
    move(p){
      if(this.refs["mapView"]!==null)
      this.refs["mapView"].zoomToLocs([[p.latitude, p.longitude]]);
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
        //if(!this.pointInBBox(position))
        this.move(position);
    }
    download() {
      var self = this;
      //alert('type:'+this.props.filters.type+'\n'+JSON.stringify(this.state.region)+'\nrange:'+this.props.filters.range);
      JsonAPI.rangeMsg(this.props.filters.type, this.region, this.props.filters.range).then((rows)=> {
          //alert('range:'+range+', result.count='+rows.length )
          self.clearMarkers();
          self.renderMarkers(rows);
          //alert(JSON.stringify(this.props.filters));
          //if(!self.comparefilters()) self.setState({filters:self.props.filters})
      })
      .catch((e)=>{
        //alert('Network Problem!'+JSON.stringify(e))
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
                <Icon name={'ion-ios-cloud-download-outline'} color={'#3B3938'} size={40} onPress={this.download.bind(this)} />
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
      //alert(JSON.stringify(r))
      this.region = r
      Store.save('region', r);
    }
    onMarkerClick(e) {
        //alert(JSON.stringify(e))
        this.region = {latitude:e.latitude,longitude:e.longitude, latitudeDelta:0.02,longitudeDelta:0.02}
        this.setState({isLoading:false, });
        /*this.props.navigator.push({
            component: ,
            passProps: {navigator:this.props.navigator,},
        });*/
    }
    onLongPress(event) {
      //alert(JSON.stringify(event.nativeEvent.coordinate));
      //this.addCircle({id: ccid++, c:event.nativeEvent.coordinate,r:100,s:'#ff0000' });
      this.addMarker({ latitude:place.latitude, longitude:place.longitude, title: 'LongPress', subtitle: '', image: this.state.markerIcon })
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
         this.addMarker({latitude:parseFloat(row.lat), longitude:parseFloat(row.lng), title: row.title, subtile: row.content, image: this.state.markerIcon });
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
    comparefilters(){
        if(this.props.filters === this.state.filters) return true;
        else return false;
    }
    render(){
        if(this.state.isLoading) return <Loading /> // || this.state.markerIcon===null || this.state.initialPosition===null) 
        //var icon = require('./images/marker_g_64.png')
        return (
          <View style={{flex:1}}>
            { this.renderNavBar() }
            <MapView
                style={Style.map}
                ref="mapView"
                region={ this.region }
                showsUserLocation={true}
                rotateEnabled={false}
                pitchEnabled={false}
                showsCompass={true}
                userLocationViewParams={{accuracyCircleFillColor:'blue', accuracyCircleStrokeColor:'red', image:this.state.userIcon }}
                annotations={ this.state.markers }
                //    {latitude: 39.832136, longitude: 116.34095, title: "start", subtile: "hello", image: this.state.markerIcon},
                //    {latitude: 39.902136, longitude: 116.44095, title: "end",   subtile: "hello", image: this.state.markerIcon},
                //overlays={ this.state.polylines }
            />
            { this.renderGpsIcon() }
            { this.renderDetailOverlay() }
          </View>
        );
    }
};

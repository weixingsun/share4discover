'use strict';
import React, { Component } from 'react'
import { DeviceEventEmitter, View, Text, StyleSheet, ScrollView, } from 'react-native'
import NavigationBar from 'react-native-navbar'
import IIcon from 'react-native-vector-icons/Ionicons'
import FIcon from 'react-native-vector-icons/FontAwesome'
import OIcon from 'react-native-vector-icons/Octicons'
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
        region: this.props.region,
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
        initialPosition: null,
        lastPosition: null,
        gps: this.props.gps,
        isLoading: true,
      };
      this.myPosMarker = null;
      //this.markerIcon = null;
      this.msg = this.props.msg;
      //this.renderNavBar   = this.renderNavBar.bind(this);
      this.watchID = (null: ?number);
      //this.onRegionChange = this.onRegionChange.bind(this)
    }
    loadSettings(){
        var _this = this;
        IIcon.getImageSource('ios-circle-filled', 24, 'blue').then((source) => {
            this.setState({
                userIcon: source,
            });
        });
        Store.get('gps_position').then(function(value) {
            if(value!=null){
                _this.setState({initialPosition: value});
            }
        });
        FIcon.getImageSource('map-marker', 40, 'blue').then((source) => {
            this.setState({
                markerIcon: source,
                isLoading:false,
            });
            if(this.msg!=null){
                var lat=parseFloat(this.msg.lat);
                var lng=parseFloat(this.msg.lng);
                this.addMarker({ latitude:lat, longitude:lng, title: this.msg.title, subtile: this.msg.content, image: this.state.markerIcon });
                this.setState({region:{latitude:lat,longitude:lng, latitudeDelta:0.02,longitudeDelta:0.02}});
                //autofit to multiple waypoints
            }
        });
    }
    componentWillMount(){
        var _this=this;
        this.loadSettings();
        DeviceEventEmitter.addListener('regionChange', function(event: Event){
            //alert('regionChange:'+JSON.stringify(event))
            _this.onRegionChange(event)
        });
    }
    componentDidMount() {
      /*navigator.geolocation.getCurrentPosition((position) => {
          this.setState({lastPosition: position.coords}); 
        }, 
        (error) => alert(error.message), 
        {enableHighAccuracy: true, timeout: 3000, maximumAge: 1000} 
      );*/ 
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
      }
    }
    componentWillUnmount() { 
      this.turnOffGps();
      //DeviceEventEmitter.removeListener('regionChange', this.onRegionChange);
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
      //alert(JSON.stringify(this.props.filters));
      JsonAPI.rangeMsg(this.props.filters.type, this.state.region, this.props.filters.range).then((rows)=> {
          self.clearMarkers();
          self.renderMarkers(rows);
          //alert('range:'+range+', result.count='+rows.length)
          //alert(JSON.stringify(this.props.filters));
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
                <IIcon name={"ios-arrow-back"} color={'#3B3938'} size={40} onPress={this.back.bind(this)} />
            }
          />);
      }else{
        return (
          <NavigationBar style={Style.navbar} //title={{title:this.title}}
            leftButton={
                <IIcon name={"ios-search"} color={'#3B3938'} size={40} onPress={() => this.props.drawer.open()} />
            }
            rightButton={
                <IIcon name={'ios-cloud-download-outline'} color={'#3B3938'} size={40} onPress={this.download.bind(this)} />
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
          return (<IIcon style={Style.gpsIcon} name={"ios-navigate-outline"} color={'#222222'} size={40} onPress={this.switchGps.bind(this)} />);
      else 
          return (<IIcon style={Style.gpsIcon} name={"ios-navigate-outline"} color={'#CCCCCC'} size={40} onPress={this.switchGps.bind(this)} />);
    }
    onRegionChange(r) {
      //alert(JSON.stringify(r))
      //this.setState({ region: r, });
      Store.save('region', r);
    }
    onLongPress(event) {
      //alert(JSON.stringify(event.nativeEvent.coordinate));
      //this.addCircle({id: ccid++, c:event.nativeEvent.coordinate,r:100,s:'#ff0000' });
      this.addMarker({ latitude:place.latitude, longitude:place.longitude, title: 'LongPress', subtile: '', image: this.state.markerIcon })
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
        //alert('first:'+this.firstLoad+'\nstate:'+JSON.stringify(this.state.filters)+'\nprops:'+JSON.stringify(this.props.filters))
        if(this.props.filters === this.state.filters) return true;
        else return false;
    }
    render(){
        //var iconObj = <IIcon name={'ios-flag'} size={20} color={'#0000aa'} />
        //alert(JSON.stringify(Object.keys(iconObj)))  //[$$typeof, type, key, ref, props, _owner, _store]
        //alert(JSON.stringify(iconObj.props))  //{name,size,color}
        if(this.state.isLoading || this.state.markerIcon===null) { // || this.state.initialPosition===null) {
            //alert('isLoading:'+this.state.isLoading+'\nmarkerIcon:'+this.state.markerIcon)
            return <Loading />
        }
        //alert(JSON.stringify(this.state.markerIcon))    //{uri:'file:///data/data/com.share/cache/-vioav8_48@2x.png', scale:2}
        //var icon = require('./images/marker_g_64.png')  //1
        //if(this.state.region!==null) this.move(this.state.region)
        //alert(JSON.stringify(this.state.region))
        return (
          <View style={{flex:1}}>
            { this.renderNavBar() }
            <MapView
                style={Style.map}
                ref="mapView"
                region={ this.state.region }
                showsUserLocation={true}
                rotateEnabled={false}
                showsCompass={true}
                userLocationViewParams={{accuracyCircleFillColor: 'blue', image:this.state.userIcon }}  //require('./start_icon.png')
                annotations={ this.state.markers }
                //    {latitude: 39.832136, longitude: 116.34095, title: "start", subtile: "hello", image: this.state.markerIcon},
                //    {latitude: 39.902136, longitude: 116.44095, title: "end",   subtile: "hello", image: this.state.markerIcon},
                overlays={ this.state.polylines }
            />
            { this.renderGpsIcon() }
            { this.renderDetailOverlay() }
          </View>
        );
    }
};

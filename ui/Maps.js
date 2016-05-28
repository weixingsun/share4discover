'use strict';
import React, { Component } from 'react'
import {DeviceEventEmitter, View, Text, StyleSheet, ScrollView, Picker} from 'react-native'
import NavigationBar from 'react-native-navbar'
import GMapView from 'react-native-maps'
import BMapView from 'react-native-baidumap'
import {Icon,getImageSource} from './Icon'
//import MapGL from 'react-native-mapbox-gl'
import Store from "../io/Store"
import Tool from "../io/Tool"
import Global from "../io/Global"
import Net from "../io/Net"
import Style from "./Style"
import Main from "./Main"
import FormAddMsg from "./FormAddMsg"
import PriceMarker from './PriceMarker'
import Overlay from './Overlay'
import SearchAddr from './SearchAddr'
import {checkPermission,requestPermission} from 'react-native-android-permissions';

export default class Maps extends Component {
    constructor(props) {
      super(props);
      //this.fa_place_icon = {estate:'home',car:'car',taxi:'taxi',};
      this.icons = {estate:'ion-ios-home',car:'ion-ios-car',taxi:'fa-taxi',};
      this.bluePlaceIcon=null;
      this.grayPlaceIcon=null;
      this.markers = []
      this.region = this.props.region
      this.download = true
      this.state = {
        type:'car',
        ccid:0,
        circles: [],
        //initialPosition: null,
        lastPosition: null,
        gps: this.props.gps,
        reload:false
      };
      this.permissions=['ACCESS_FINE_LOCATION','ACCESS_COARSE_LOCATION'];
      this.msg = this.props.msg;
      this.watchID = (null: ?number);
    }
    loadIcon(name){
        var _this = this;
        getImageSource(name, 30, 'blue').then((source) => {
            this.bluePlaceIcon= source
        });
        getImageSource(name, 30, 'gray').then((source) => {
            this.grayPlaceIcon= source
        });
    }
    singlePermission(name){
        requestPermission('android.permission.'+name).then((result) => {
          //console.log(name+" Granted!", result);
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
          this.addMarker( this.msg );
          this.region={latitude:parseFloat(this.msg.lat),longitude:parseFloat(this.msg.lng), latitudeDelta:0.02,longitudeDelta:0.02, zoom:15}
          //autofit to multiple waypoints
        }
        /*Store.get(Store.GPS_POS).then(function(value) {
          if(value!=null){
              _this.setState({initialPosition: value});
          }
        });*/
        var _this=this;
        DeviceEventEmitter.addListener('regionChange', function(event: Event){
            //alert('regionChange:'+JSON.stringify(event))
            _this.onRegionChange(event)
        });
        DeviceEventEmitter.addListener('markerClick', function(event: Event){
            //alert('markerClick:'+JSON.stringify(event))
            _this.onMarkerClickBmap(event)
        });
        this.loadIcon(this.icons[this.state.type]);
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
        return {latitude:lat, longitude:lng, latitudeDelta:this.region.latitudeDelta,longitudeDelta:this.region.longitudeDelta,zoom:14 }
    }
    /*updateMyPos(position){
        this.myPosMarker = {id: 0, latlng: position, color:'#0000ff' };
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
        coordinate={this.myPosMarker.latlng}
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
    renderPlaceMarkersGmap(){
        return this.markers.map( this.markerGeneratorGmap.bind(this) );
    }
    markerGeneratorGmap(marker) {
        var self=this
        var placeIcon = this.bluePlaceIcon
        if(marker.ask === 'true') placeIcon = this.grayPlaceIcon
        var clickFunc = function(){
            self.props.navigator.push({
                component: Main,
                passProps: {
                    page: Store.mapTab,
                    msg:marker,
                    placeIcon:placeIcon,
                }
            });
        }
        if(this.msg!=null){
            clickFunc = null,
            placeIcon = this.props.placeIcon;
        }
        return (
              <GMapView.Marker
                  key={marker.ctime}
                  coordinate={{latitude:parseFloat(marker.lat), longitude:parseFloat(marker.lng)}}
                  image={ placeIcon }
                  onPress={ clickFunc }
              />
        )
    }
    back(){
      this.props.navigator.pop();
    }
    move(p){
      this.refs.gmap.animateToRegion(p);
    }
    between(n, n1,delta){
        return (n > n1-delta) && (n < n1+delta)
    }
    pointInBBox(position){
        var latIn=false,lngIn=false;
        //alert(JSON.stringify(position))
        if(this.between(position.latitude,  this.region.latitude,  this.region.latitudeDelta))
            latIn=true
        if(this.between(position.longitude, this.region.longitude, this.region.longitudeDelta))
            lngIn=true
        return latIn && lngIn;
    }
    moveOrNot(position){
        if(!this.pointInBBox(position))
        this.move(this.getRegion(position.latitude,position.longitude));
    }
    downloadMsg() {
      if(!this.download) return
      var self = this;
      var range = this.distance(this.region.latitudeDelta,this.region.longitudeDelta)
      alert('type:'+this.state.type+' ,range:'+range +' ,region:'+JSON.stringify(this.region))
      Net.rangeMsg(this.state.type, this.region, range).then((rows)=> {
          self.clearMarkers();
          self.loadMarkers(rows);
      })
      .catch((e)=>{
          //alert('Problem:'+JSON.stringify(e))
      });
      this.enableDownload(false)
    }
    distanceZoom(zoom){
        
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
              <View style={{flexDirection:'row'}}>
                <Icon name={this.icons[this.state.type]} color={'#3B3938'} size={36} onPress={() => this.props.drawer.open()} />
                <Picker
                    style={{width:40}}
                    selectedValue={this.state.type}
                    onValueChange={this.onTypeChange.bind(this, 'type')}
                    //prompt="Choose a Type"
                >
                       <Picker.Item label="Car" value="car" />
                       <Picker.Item label="Real Estate" value="estate" />
                </Picker>
              </View>
            }
            rightButton={
              <View style={{flexDirection:'row', alignItems:'center', justifyContent:'center'}}>
                <Icon name={'ion-ios-cloud-download-outline'} color={this.getDownloadIcon(this.download)} size={36} onPress={this.downloadMsg.bind(this)} />
                <View style={{width:40}} />
                <Icon name={'ion-ios-add'} size={50} onPress={() => this.props.navigator.push({component: FormAddMsg}) }/>
              </View>
            }
          />
        );
      }
    }
    onTypeChange(key: string, value: string) {
        const newState = {};
        newState[key] = value;
        this.setState(newState);
        this.loadIcon(this.icons[value])
        this.enableDownload(true)
        this.clearMarkers()
    }
    getDownloadIcon(flag){
        if(flag) return '#3B3938'
        else return '#dddddd'
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
      this.region= r;
      Store.save('region', r);
      this.enableDownload(true);
    }
    onMarkerClickBmap(e) {
        alert(JSON.stringify(e))

    }
    enableDownload(flag){
        this.download=flag
    }
    /*onLongPress(event) {
        this.addCircle({id: ccid++, c:event.nativeEvent.coordinate,r:100,s:'#ff0000' });
    }*/
    clearMarkers(){
        this.markers = []
        this.setState({ reload: true });
    }
    loadMarkers(rows){
       rows.map((row)=>{
         //row ={ lat,lng,type,title,content,ctime, }
         //row['id']=row.ctime
         if(row.ask === 'true') row['image']=this.grayPlaceIcon
         else row['image']=this.bluePlaceIcon
         row['latitude']=parseFloat(row.lat)
         row['longitude']=parseFloat(row.lng)
         //alert(JSON.stringify(row))
         this.addMarker( row );
       })
       this.setState({ reload: true });
    }
    addMarker(marker){
      this.markers = 
          [
           ...this.markers,
           marker]
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
        console.log('render()')
        return (
          <View style={{flex:1}}>
            { this.renderNavBar() }
            { this.renderMap() }
            { this.renderGpsIcon() }
            { this.renderDetailOverlay() }
          </View>
        );
    }
    renderMap(){
      switch(Global.MAP) {
          case 'GoogleMap':
              return this.renderGmap()
              break;
          case 'BaiduMap':
              return this.renderBmap()
              break;
          default:
              return null;
      }
    }
    renderGmap(){
      return (
            <GMapView
              ref='gmap'
              style={Style.map}
              showsUserLocation={this.state.gps}
              rotateEnabled={false} //showsCompass={true}
              showsScale={true}
              onRegionChangeComplete={this.onRegionChange.bind(this)}
              initialRegion={this.region}
              //region={this.state.region}
              //mapType=standard,satellite,hybrid
              //onLongPress={this.onLongPress.bind(this)}
              //onMarkerPress={(e)=> alert('Map.onMarkerPress')}
              >
                 {this.renderPlaceMarkersGmap()}
            </GMapView>
         );
    }
    renderBmap(){
      return (
            <BMapView
                style={Style.map}
                ref="bmap"
                region={ this.region }
                showsUserLocation={this.state.gps}
                rotateEnabled={false}
                pitchEnabled={false}
                showsCompass={true}
                //userLocationViewParams={{accuracyCircleFillColor:'blue', accuracyCircleStrokeColor:'red', image:this.state.userIcon }}
                annotations={ this.markers }
                //    {latitude: 39.832136, longitude: 116.34095, title: "start", subtile: "hello", image: this.state.markerIcon},
                //    {latitude: 39.902136, longitude: 116.44095, title: "end",   subtile: "hello", image: this.state.markerIcon},
                //overlays={ this.state.polylines }
            />

      );
    }
};
//{this.renderMyPosMarker()}

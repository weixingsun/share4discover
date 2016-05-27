'use strict';
import React, { Component } from 'react'
import {View, Text, StyleSheet, ScrollView, Picker} from 'react-native'
import NavigationBar from 'react-native-navbar'
import MapView from 'react-native-maps'
import {Icon,getImageSource} from './Icon'
//import MapGL from 'react-native-mapbox-gl'
import Store from "../io/Store"
import Tool from "../io/Tool"
import Global from "../io/Global"
import JsonAPI from "../io/Net"
import Style from "./Style"
import Main from "./Main"
import PriceMarker from './PriceMarker'
import Overlay from './Overlay'
import SearchAddr from './SearchAddr'
import {checkPermission,requestPermission} from 'react-native-android-permissions';

export default class GoogleMap extends Component {
    constructor(props) {
      super(props);
      //this.fa_place_icon = {estate:'home',car:'car',taxi:'taxi',};
      this.icons = {estate:'ion-ios-home',car:'ion-ios-car',taxi:'fa-taxi',};
      this.mkid=1;
      this.placeIcon=null;
      this.state = {
        type:'car',
        region: this.props.region,
        markers: [],
        ccid:0,
        circles: [],
        //initialPosition: null,
        lastPosition: null,
        gps: this.props.gps,
        downloadEnabled: true,
      };
      this.permissions=['ACCESS_FINE_LOCATION','ACCESS_COARSE_LOCATION'];
      this.msg = this.props.msg;
      this.watchID = (null: ?number);
    }
    loadIcon(name){
        var _this = this;
        getImageSource(name, 30, 'blue').then((source) => {
            _this.placeIcon= source
        });
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
    incMkid(){
        return this.mkid++
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
         this.msg['latitude'] = parseFloat(this.msg.lat)
         this.msg['longitude']= parseFloat(this.msg.lng)
         this.msg['id']       = this.incMkid()
         this.msg['color']    = 'blue'
         this.msg['icon']     = this.icons[this.msg.type]
        this.addMarker( this.msg );
        this.setState({region:{latitude:this.msg['latitude'],longitude:this.msg['longitude'], latitudeDelta:0.02,longitudeDelta:0.02}});
        //autofit to multiple waypoints
      }
      /*Store.get(Store.GPS_POS).then(function(value) {
          if(value!=null){
              _this.setState({initialPosition: value});
          }
      });*/
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
        return {latitude:lat, longitude:lng, latitudeDelta:this.state.region.latitudeDelta,longitudeDelta:this.state.region.longitudeDelta }
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
    renderPlaceMarkers(){
      /*if(this.msg==null && this.placeIcon==null){
            return this.state.markers.map(
              marker => (
                <MapView.Marker
                  key={marker.id}
                  coordinate={{latitude:marker.latitude, longitude:marker.longitude}}
                  //pinColor={marker.s}
                  //title={marker.title}       //description={marker.description}
                  onPress={(e) => { this.props.navigator.push({
                                        component: Main,
                                        passProps: {
                                            page: Store.mapTab,
                                            msg:marker,
                                        }
                                    }); 
                          }}
                >
                    <Icon size={26} color={marker.color} name={marker.icon} />
                </MapView.Marker>
              )
            );
      }else if(this.msg!=null && this.placeIcon==null){
        return this.state.markers.map(
            marker => (
              <MapView.Marker
                  key={marker.id}
                  coordinate={{latitude:marker.latitude, longitude:marker.longitude}}
              >
                    <Icon size={26} color={marker.color} name={marker.icon} />
                </MapView.Marker>
            )
        );
      }else */
      if(this.msg==null && this.placeIcon!=null){
        return this.state.markers.map(
            marker => (
              <MapView.Marker
                  key={marker.id}
                  coordinate={{latitude:marker.latitude, longitude:marker.longitude}}
                  image={this.placeIcon}
                  onPress={(e) => { this.props.navigator.push({
                                        component: Main,
                                        passProps: {
                                            page: Store.mapTab,
                                            msg:marker,
                                        }
                                    });
                          }}
              />
            )
        );
      }else 
      if(this.msg!=null && this.placeIcon!=null){
        return this.state.markers.map(
            marker => (
              <MapView.Marker
                  key={marker.id}
                  coordinate={{latitude:marker.latitude, longitude:marker.longitude}}
                  image={this.placeIcon}
              />
            )
        );
      }
    }
    back(){
      this.props.navigator.pop();
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
      JsonAPI.rangeMsg(this.state.type, this.state.region, range).then((rows)=> {
          self.clearMarkers();
          self.loadMarkers(rows);
      })
      .catch((e)=>{
        alert('Network Problem!')
      });
      this.enableDownload(false)
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
                <Icon name={this.icons[this.state.type]} color={'#3B3938'} size={40} onPress={() => this.props.drawer.open()} />
                <Picker
                    style={{width:40}}
                    selectedValue={this.state.type}
                    onValueChange={this.onTypeChange.bind(this, 'type')}
                    prompt="Choose a Type">
                       <Picker.Item label="Car" value="car" />
                       <Picker.Item label="Real Estate" value="estate" />
                </Picker>
              </View>
            }
            rightButton={
                <Icon name={'ion-ios-cloud-download-outline'} color={this.getDownloadIcon(this.state.downloadEnabled)} size={40} onPress={this.reload.bind(this)} />
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
      this.setState({ region: r, });
      Store.save('region', r);
      this.enableDownload(true);
    }
    enableDownload(flag){
        this.setState({downloadEnabled:flag})
    }
    /*onLongPress(event) {
        alert(JSON.stringify(event.nativeEvent.coordinate));
        this.addCircle({id: ccid++, c:event.nativeEvent.coordinate,r:100,s:'#ff0000' });
        this.addMarker({id: this.state.mkid++, latlng: event.nativeEvent.coordinate, s:'#0000ff' });
    }*/
    clearMarkers(){
        this.mkid=1;
        this.setState({
            markers: [],
        });
    }
    loadMarkers(rows){
       rows.map((row)=>{
         //row ={ lat,lng,type,title,content,ctime, }
         row['latitude'] = parseFloat(row.lat)
         row['longitude']= parseFloat(row.lng)
         row['id']       = this.incMkid()
         row['color']    = 'blue'
         row['icon']     = this.icons[row.type]
         this.addMarker( row );
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
              showsUserLocation={this.state.gps}
              rotateEnabled={false} //showsCompass={true}
              showsScale={true}
              onRegionChangeComplete={this.onRegionChange.bind(this)}
              initialRegion={this.state.region}
              //region={this.state.region}
              //mapType=standard,satellite,hybrid
              //onLongPress={this.onLongPress.bind(this)} 
              //onMarkerPress={(e)=> alert('Map.onMarkerPress')} 
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

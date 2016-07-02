'use strict';
import React, { Component } from 'react'
import {DeviceEventEmitter, Image, ListView, Picker, Platform, StyleSheet, ScrollView, Text, TouchableHighlight, View } from 'react-native'
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
import Detail from "./Detail"
import FormAddMsg from "./FormAddMsg"
import PriceMarker from './PriceMarker'
import Overlay from './Overlay'
import SearchAddr from './SearchAddr'
import Modal from 'react-native-root-modal';
import {checkPermission,requestPermission} from 'react-native-android-permissions';

export default class Maps extends Component {
    constructor(props) {
      super(props);
      this.ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
      this.markers = []
      this.region = this.props.region
      this.download = true
      this.state = {
	typeDataSource: this.ds.cloneWithRows(Object.keys(Global.TYPE_ICONS)),
        type:'car',
        ccid:0,
        circles: [],
        //initialPosition: null,
        //lastPosition: null,
        gps: this.props.gps,
        reload:false,
        showTypes:false,
	showPlaceSearch: false,
      };
      this.permissions=['ACCESS_FINE_LOCATION','ACCESS_COARSE_LOCATION'];
      this.msg = this.props.msg;
      this.watchID = (null: ?number);
    }
    loadIcons(name){
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
        if(Platform.OS === 'android' && Platform.Version > 22){
            this.singlePermission('ACCESS_FINE_LOCATION')
            this.singlePermission('ACCESS_COARSE_LOCATION')
        }
    }
    componentWillMount(){
        this.permission();
        if(this.msg!=null){
          this.addMarker( this.msg );
          this.region={latitude:parseFloat(this.msg.lat),longitude:parseFloat(this.msg.lng), latitudeDelta:0.02,longitudeDelta:0.02 }
          //autofit to multiple waypoints
        }
        this.loadIcons(Global.TYPE_ICONS[this.state.type]);
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
        return {latitude:lat, longitude:lng, latitudeDelta:this.region.latitudeDelta,longitudeDelta:this.region.longitudeDelta }
    }
    /*updateMyPos(position){
        this.myPosMarker = {id: 0, latlng: position, color:'#0000ff' };
        Store.save(Store.GPS_POS, position);
        this.moveOrNot(position);
        this.setState({lastPosition: position});
    }
    }*/
    renderPlaceMarkersGmap(){
        return this.markers.map( (marker) => {
            var self=this
            var color='blue'
            if(marker.ask === 'true') color='gray'  //placeIcon = this.grayPlaceIcon
            var clickFunc = function(){
                self.props.navigator.push({
                  component: Detail,
                  passProps: {
                    msg:marker,
		    mainlogin:this.props.mainlogin,
                  }
                });
            }
            //if(this.msg!=null){
            //    clickFunc = null
            //}
            return (
              <GMapView.Marker
                  key={marker.ctime}
                  coordinate={{latitude:parseFloat(marker.lat), longitude:parseFloat(marker.lng)}}
                  //image={ placeIcon }
                  onPress={ clickFunc }
              >
                  <Icon name={Global.TYPE_ICONS[this.state.type]} color={color} size={30} />
              </GMapView.Marker>
            )
        });
    }
    back(){
      this.props.navigator.pop();
    }
    move(p){
      this.refs.gmap.animateToRegion(p);
    }
    moveBmap(p){
      this.refs.bmap.animateTo(p);
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
      //alert('type:'+this.state.type+' ,range:'+range +' ,region:'+JSON.stringify(this.region))
      Net.rangeMsg(this.state.type, this.region, range).then((rows)=> {
          self.clearMarkers();
          self.loadMarkers(rows);
          //alert(rows.length)
      })
      .catch((e)=>{
          //alert('Problem:'+JSON.stringify(e))
      });
      this.enableDownload(false)
    }
    distance(latDelta,lngDelta){
       return Math.floor(111111 * Math.min(latDelta,lngDelta)/2); //range circle in bbox
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
                <Icon name={Global.TYPE_ICONS[this.state.type]} color={'#3B3938'} size={36} onPress={()=>this.setState({showTypes:!this.state.showTypes})} />
                <Icon name={'ion-ios-arrow-down'} color={'#3B3938'} size={16} onPress={()=>this.setState({showTypes:!this.state.showTypes})} />
                <Modal 
                    //style={{top:0,bottom:50,left:0,right:0,backgroundColor:'rgba(0, 0, 0, 0.2)',justifyContent:'center',transform: [{scale: this.state.scaleAnimation}]}}
                    visible={this.state.showTypes}
                    onPress={() => this.setState({showTypes:false})}
                >
                    {this.renderTypesModal()}
                </Modal>
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
    renderTypesModal(){
        return (
          <TouchableHighlight style={{ height:Style.DEVICE_HEIGHT*2/3, alignItems: 'center', justifyContent: 'center' }} >
            <ListView
                dataSource={ this.state.typeDataSource }
                renderRow={ this.renderTypeRow.bind(this) }
                renderSeparator={(sectionID, rowID) => <View key={`${sectionID}-${rowID}`} style={{height: 1,backgroundColor: '#CCCCCC'}} />}
            />
          </TouchableHighlight>
        );
    }
    renderTypeRow(row: string, sectionID: number, rowID: number){
      return (
      <TouchableHighlight style={{backgroundColor:'white'}} onPress={() => this._pressType(sectionID,rowID,row)}>
        <View>
          <View style={{flexDirection:'row',backgroundColor:'white', justifyContent:'center', padding:10, marginLeft:30,marginRight:30, alignItems:'center' }}>
            <Icon name={Global.TYPE_ICONS[row]} size={40} color={'gray'} />
            <View style={{width:Style.DEVICE_WIDTH/3}}>
              <Text style={{ fontSize:20,marginLeft:30 }}>
                { row }
              </Text>
            </View>
          </View>
        </View>
      </TouchableHighlight>
      )
    }
    _pressType(sid,rid,data){
        this.setState({type:data,showTypes:false})
        this.loadIcons(Global.TYPE_ICONS[data])
        this.enableDownload(true)
        this.clearMarkers()
    }
    onTypeChange(key: string, value: string) {
        const newState = {};
        newState[key] = value;
        this.setState(newState);
        this.loadIcons(Global.TYPE_ICONS[value])
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
      //alert(JSON.stringify(r))
    }
    onMarkerClickBmap(e) {
	var msg = {}
	if(Platform.OS === 'ios'){
          msg = JSON.parse(decodeURIComponent(e.id))
	}else if(Platform.OS === 'android'){
          msg = e.nativeEvent.annotation
	}
        this.props.navigator.push({
            component: Detail,
            passProps: {
              msg: msg,
	      mainlogin:this.props.mainlogin,
            }
        });
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
	 //row['leftCalloutView']=row.owner+':'+row.title
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
        console.log('Maps.render() this.region='+JSON.stringify(this.region))
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
      if(this.region.zoom == null || this.region.latitudeDelta == null) this.region = {latitude:39.9042,longitude:116.4074,latitudeDelta:0.2,longitudeDelta:0.2,zoom:16}
      return (
            <BMapView
                style={Style.map}
                ref="bmap"
                region={ this.region }
                showsUserLocation={this.state.gps}
                rotateEnabled={false}
                //pitchEnabled={false}
                showsCompass={true}
                //userLocationViewParams={{accuracyCircleFillColor:'blue', accuracyCircleStrokeColor:'red', image:this.state.userIcon }}
                annotations={ this.markers }
                //overlays={ this.state.polylines }
                onRegionChangeComplete={this.onRegionChange.bind(this)}
                onMarkerPress={this.onMarkerClickBmap.bind(this)}
            />

      );
    }
};

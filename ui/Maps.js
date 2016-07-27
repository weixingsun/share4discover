'use strict';
import React, { Component } from 'react'
import {AppState, Image, ListView, Picker, Platform, StyleSheet, ScrollView, Text, TouchableHighlight, TouchableOpacity, View } from 'react-native'
import NavigationBar from 'react-native-navbar'
import GMapView from 'react-native-maps'
import BMapView from 'react-native-baidumap'
import KKLocation from 'react-native-baidumap/KKLocation';
import UsbSerial from 'react-native-usbserial';
import {Icon,getImageSource} from './Icon'
//import MapGL from 'react-native-mapbox-gl'
import Store from "../io/Store"
import Tool from "../io/Tool"
import Global from "../io/Global"
import Net from "../io/Net"
import Style from "./Style"
import Main from "./Main"
import Detail from "./Detail"
import FormInfo from "./FormInfo"
import PriceMarker from './PriceMarker'
import Overlay from './Overlay'
import SearchAddr from './SearchAddr'
import Modal from 'react-native-root-modal';
import {checkPermission,requestPermission} from 'react-native-android-permissions';

//const serial = new UsbSerial();
export default class Maps extends Component {
    constructor(props) {
      super(props);
      this.ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
      this.pos = null;
      this.state = {
        typeDataSource: this.ds.cloneWithRows(Object.keys(Global.TYPE_ICONS)),
        type:'car',
        ccid:0,
        circles: [],
        //initialPosition: null,
        //lastPosition: null,
        region:this.props.region,
        download:true,
        gps: this.props.gps,
        reload:false,
        showTypes:false,
        showPlaceSearch: false,
        markers:[],
        grantedPermissions:{},
      };
      this.permissions=['ACCESS_FINE_LOCATION'] //,'ACCESS_COARSE_LOCATION'];
      this.msg = this.props.msg;
      this.watchID = (null: ?number);
      this.turnOffGps = this.turnOffGps.bind(this)
      this.turnOnGps = this.turnOnGps.bind(this)
    }
    loadIcons(name){
        var _this = this;
        getImageSource(name, 40, 'blue').then((source) => {
            this.bluePlaceIcon= source
        });
        getImageSource(name, 40, 'gray').then((source) => {
            this.grayPlaceIcon= source
        });
    }
    singlePermission(name){
        requestPermission('android.permission.'+name).then((result) => {
          //console.log(name+" Granted!", result);
          let perm = this.state.grantedPermissions;
          perm[name] = true
          this.setState({grantedPermissions:perm})
        }, (result) => {
          //alert('Please grant location permission in settings')
        });
    }
    permission(){ 
        if(Platform.OS === 'android' && Platform.Version > 22){
            this.singlePermission('ACCESS_FINE_LOCATION')
            //this.singlePermission('ACCESS_COARSE_LOCATION')
        }
    }
    _handleAppStateChange(state){  //active -- inactive -- background
	//if(state!=='active') this.turnOffGps();    //crash
	//else if(this.state.gps) this.turnOnGps();
    }
    /*checkUsbDevice(){
      //UsbSerial.open(9600);
      //UsbSerial.write('test');
      //UsbSerial.close();
      alert('checkUsbDevice')
      serial.listen(9600, '\n', (e)=>{
        alert('received:'+e.data)
      });
    }*/
    sendDataToUsbSerialDevice(data){
        UsbSerial.write(data);
    }
    componentWillMount(){
        this.permission();
        //this.checkUsbDevice();
        this.loadIcons(Global.TYPE_ICONS[this.state.type]);
	//AppState.addEventListener('change', this._handleAppStateChange);
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
      //AppState.removeEventListener('change', this._handleAppStateChange);
      //serial.close();
    }
    turnOnGps(){
      let self=this
      if(Global.MAP===Global.GoogleMap){
        this.watchID = navigator.geolocation.watchPosition((position) => {
            //{timestamp,{coords:{speed,heading,accuracy,longitude,latitude,altitude}}}
            self.pos=position.coords
            self.sendDataToUsbSerialDevice(JSON.stringify(self.pos));
          },
          (error) => console.log(error.message),
          {enableHighAccuracy: true, timeout: 30000, maximumAge: 1000, distanceFilter:30},
        );
      }else if(Global.MAP===Global.BaiduMap){
        this.watchID = KKLocation.watchPosition((position) => {
          //{timestamp,{coords:{heading,accuracy,longitude,latitude}}}  //no speed,altitude
          self.pos=position.coords
          self.sendDataToUsbSerialDevice(JSON.stringify(self.pos));
        });
      }
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
    }*/
    renderPlaceMarkersGmap(){
        return this.state.markers.map( (marker) => {
            var self=this
            var color='blue'
            if(marker.ask === 'true') color='gray'  //placeIcon = this.grayPlaceIcon
            let key = Global.getKeyFromMsg(marker)
            let T = marker.type.substring(0,1).toUpperCase()
            return (
              <GMapView.Marker
                  key={marker.ctime}
                  coordinate={{latitude:parseFloat(marker.lat), longitude:parseFloat(marker.lng)}}
                  //image={ placeIcon }
                  onPress={ ()=> this.showMsgByKey(key) }
              >
                  <Icon name={Global.TYPE_ICONS[this.state.type]} color={color} size={40} badge={{text:T,color:'gray'}} />
              </GMapView.Marker>
            )
        });
    }
    /*renderPlaceMarkersBmap(){
        return this.state.markers.map( (marker) => {
            var self=this
            var color='blue'
            if(marker.ask === 'true') color='gray'  //placeIcon = this.grayPlaceIcon
            let key = Global.getKeyFromMsg(marker)
            return (
              <BMapView.Marker
                  key={marker.ctime}
                  coordinate={{latitude:parseFloat(marker.lat), longitude:parseFloat(marker.lng)}}
                  //image={ placeIcon }
                  onPress={ ()=> this.showMsgByKey(key) }
              >
                  <Icon name={Global.TYPE_ICONS[this.state.type]} color={color} size={40} badge={{text:'R',color:'gray'}} />
              </BMapView.Marker>
            )
        });
    }*/
    back(){
      this.props.navigator.pop();
    }
    move(p){
      this.refs.gmap.animateToRegion(p);
    }
    moveToMe(){
      //bmap:{timestamp,{coords:{heading,accuracy,longitude,latitude}}}
      if(this.pos!=null)
        this.refs.bmap.zoomToLocs([[this.pos.latitude, this.pos.longitude]]);
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
        if(this.between(position.latitude,  this.state.region.latitude,  this.state.region.latitudeDelta))
            latIn=true
        if(this.between(position.longitude, this.state.region.longitude, this.state.region.longitudeDelta))
            lngIn=true
        return latIn && lngIn;
    }
    downloadMsg() {
      if(!this.state.download) return
      var self = this;
      var range = this.distance(this.state.region.latitudeDelta,this.state.region.longitudeDelta)
      //alert('type:'+this.state.type+' ,range:'+range +' ,region:'+JSON.stringify(this.state.region))
      Net.rangeMsg(this.state.type, this.state.region, range).then((rows)=> {
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
                <Icon name={"ion-ios-arrow-round-back"} color={'#3B3938'} size={44} onPress={this.back.bind(this)} />
            }
          />);
      }else{
        return (
          <NavigationBar style={Style.navbar} //title={{title:this.title}}
            leftButton={
              <View style={{flexDirection:'row'}}>
                <Icon name={Global.TYPE_ICONS[this.state.type]} color={'#3B3938'} size={40} onPress={()=>this.setState({showTypes:!this.state.showTypes})} />
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
                {this.renderGpsIcon()}
                <View style={{width:40}} />
                {this.renderDownloadIcon()}
                <View style={{width:40}} />
                {this.renderAddIcon()}
                <View style={{width:10}} />
              </View>
            }
          />
        );
      }
    }
    renderDownloadIcon(){
        let c = '#dddddd'
        if(this.state.download) c = '#3B3938'
        return <Icon name={'ion-ios-cloud-download-outline'} color={c} size={40} onPress={this.downloadMsg.bind(this)} />
    }
    renderGpsIcon(){
      let c = '#222222'
      if(!this.state.gps)
          c = '#CCCCCC'
      return (<Icon name={"ion-ios-navigate-outline"} color={c} size={40} onPress={this.switchGps.bind(this)} />);
    }
    renderAddIcon(){
      if(this.props.mainlogin==='') return <Icon name={'ion-ios-add'} size={50} color={'gray'} onPress={() => alert('Please login to publish') }/>
      else return <Icon name={'ion-ios-add'} size={50} color={'black'} onPress={() => this.props.navigator.push({component:FormInfo, passProps:{navigator:this.props.navigator} })}/>
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
    /*renderDetailOverlay() {
      if(this.msg!=null){
        return ( <Overlay style={Style.detail} msg={this.msg}/>  );
      }
    }*/
    onRegionChange(r) {
      this.setState({region: r});
      Store.save('region', r);
      this.enableDownload(true);
      //alert(JSON.stringify(r))
      //console.log('onRegionChange...................')
    }
    onMarkerClickBmap(e) {
	var msg = {}
	if(Platform.OS === 'ios'){
          msg = JSON.parse(decodeURIComponent(e.id))
	}else if(Platform.OS === 'android'){
          msg = e.nativeEvent.annotation
	}
        let key = Global.getKeyFromMsg(msg)
        this.showMsgByKey(key)
    }
    enableDownload(flag){
        this.setState({download:flag});
    }
    /*onLongPress(event) {
        this.addCircle({id: ccid++, c:event.nativeEvent.coordinate,r:100,s:'#ff0000' });
    }*/
    clearMarkers(){
        this.setState({ markers: [] });
    }
    loadMarkers(rows){
       var markers = rows.map((row)=>{
         //row ={ lat,lng,type,title,content,ctime, }
         if(row.ask === 'true') row['image']=this.grayPlaceIcon
         else row['image']=this.bluePlaceIcon
         //row['view'] = <Icon name={Global.TYPE_ICONS[this.state.type]} color={color} size={40} badge={{text:'R',color:'gray'}} />
         //row['view']   = <Icon name={'ion-ios-navigate-outline'} color={'#222222'} size={40} />
         row['latitude']=parseFloat(row.lat)
         row['longitude']=parseFloat(row.lng)
         return row;
       })
       this.setState({ markers: markers });
    }
    addCircle(circle){
      var {circles} = this.state;
      this.setState({
        circles:[
          ...circles,
          circle]
      });
    } 
    showMsgByKey(key){
      var self = this;
      Net.getMsg(key).then((json)=> {
          self.props.navigator.push({
              component: Detail,
              passProps: {
                  msg:json,
                  mainlogin:this.props.mainlogin,
              }
          });
      });
    }
    renderFocusIcon(){
      if(Global.MAP===Global.BaiduMap && this.state.gps){
        return (
          <View style={{flexDirection:'row'}}>
             <View style={{flex:1}}/>
             <TouchableOpacity 
                style={{backgroundColor:'white',width:40,height:40,alignItems:'center',justifyContent:'center',opacity:0.5}}
                onPress={this.moveToMe.bind(this)}
             >
               <Icon name={"ion-ios-locate-outline"} style={Style.gpsIcon} size={24} />
             </TouchableOpacity>
             <View style={{width:10}}/>
          </View>
        )
      }
    }
    render(){
        //console.log('Maps.render() region='+JSON.stringify(this.state.region))
	//alert('markers:'+JSON.stringify(this.state.markers))
        return (
          <View style={{flex:1}}>
            { this.renderNavBar() }
            { this.renderMap() }
            { this.renderFocusIcon() }
          </View>
        );
    }
    renderMap(){
      if(Platform.OS==='android' && Platform.Version > 22){
        let perm_nbr = Object.keys(this.state.grantedPermissions).length
        if(perm_nbr < this.permissions.length) return null
      }
      switch(Global.MAP) {
          case Global.GoogleMap:
              return this.renderGmap()
              break;
          case Global.BaiduMap:
              return this.renderBmap()
              break;
          default:
              return null;
      }
    }
    renderGmap(){
      let map_style = Style.map_android
      if(Platform.OS === 'ios') map_style=Style.map_ios
      return (
            <GMapView
              ref='gmap'
              style={map_style}
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
                 {this.renderPlaceMarkersGmap()}
            </GMapView>
         );
    }
    renderBmap(){
      //if(this.state.region.zoom == null || this.state.region.latitudeDelta == null) this.region = {latitude:39.9042,longitude:116.4074,latitudeDelta:0.2,longitudeDelta:0.2,zoom:16}
      //alert(JSON.stringify(this.state.markers))
      let map_style = Style.map_android
      if(Platform.OS === 'ios') map_style=Style.map_ios
      return (
            <BMapView
                style={map_style}
                ref="bmap"
                initialRegion={ this.state.region }
                showsUserLocation={this.state.gps}
                rotateEnabled={false}
                overlookEnabled={false}
                showsCompass={true}
                //userLocationViewParams={{accuracyCircleFillColor:'blue', accuracyCircleStrokeColor:'red', image:this.state.userIcon }}
                annotations={ this.state.markers }
                //overlays={ this.state.polylines }
                onRegionChangeComplete={this.onRegionChange.bind(this)}
                onMarkerPress={this.onMarkerClickBmap.bind(this)}
            />

      );
    }
};

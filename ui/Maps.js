'use strict';
import React, { Component } from 'react'
import {AppState, Image, ListView, NativeModules, Picker, Platform, StyleSheet, ScrollView, Text, TouchableHighlight, TouchableOpacity, View } from 'react-native'
import NavigationBar from 'react-native-navbar'
import GMapView from 'react-native-maps'
import BMapView from 'react-native-baidumap'
import KKLocation from 'react-native-baidumap/KKLocation';
//import UsbSerial from 'react-native-usbserial';
import {Icon,getImageSource} from './Icon'
//import MapGL from 'react-native-mapbox-gl'
import Store from "../io/Store"
import Tool from "../io/Tool"
import Global from "../io/Global"
import Net from "../io/Net"
import Style from "./Style"
import Main from "./Main"
import Detail from "./Detail"
import FormInfo from "./FormInfoVar"
import Modal from 'react-native-root-modal';
import I18n from 'react-native-i18n';
import Button from 'apsl-react-native-button'
import {checkPermission,requestPermission} from 'react-native-android-permissions';

export default class Maps extends Component {
    constructor(props) {
      super(props);
      this.ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
      this.pos = null;
      this.state = {
        typeDataSource: this.ds.cloneWithRows(Object.keys(Global.TYPE_ICONS)),
        catDataSource: this.ds.cloneWithRows(Object.keys(Global.CAT_COLORS)),
        type:'car',
        cat:'rent0',
        ccid:0,
        circles: [],
        region:this.props.region,
        gps: this.props.gps,
        reload:false,
        showTypes:false,
        showCats:false,
        showPlaceSearch: false,
        markers:[],
        grantedPermissions:{},
      };
      this.permissions=['ACCESS_FINE_LOCATION'] //,'ACCESS_COARSE_LOCATION']
      this.watchID = (null: ?number);
      this.turnOffGps = this.turnOffGps.bind(this)
      this.turnOnGps = this.turnOnGps.bind(this)
    }
    loadIcons(type,cat){
        if(Global.MAP===Global.GoogleMap) return
        let name=Global.TYPE_ICONS[type]
        let color=Global.CAT_COLORS[cat]
        //alert('type='+type+' name='+name+' cat='+cat+' color='+color)
        var self = this;
        getImageSource(name, 40, color).then((source) => {
            self.PlaceIcon= source
        });
    }
    singlePermission(name){
        requestPermission('android.permission.'+name).then((result) => {
          //alert('granted location permission')
          //console.log(name+" Granted!", result);
          let perm = this.state.grantedPermissions;
          perm[name] = true
          this.setState({grantedPermissions:perm})
        }, (deny) => {
          //alert('Denied location permission in settings')
        });
    }
    permission(){ 
        if(Platform.OS === 'android' && Platform.Version > 22){
            this.permissions.map((perm)=>{
                this.singlePermission(perm)
            })
            //this.singlePermission('ACCESS_FINE_LOCATION')
            //this.singlePermission('ACCESS_COARSE_LOCATION')
        }
    }
    //_handleAppStateChange(state){  //active -- inactive -- background
    //}
    /*checkUsbDevice(){
      //UsbSerial.open(9600);
      //UsbSerial.write('test');
      //UsbSerial.close();
      alert('checkUsbDevice')
      serial.listen(9600, '\n', (e)=>{
        alert('received:'+e.data)
      });
    }*/
    //sendDataToUsbSerialDevice(data){
    //    UsbSerial.write(data);
    //}
    componentWillMount(){
        this.permission();
        //this.checkUsbDevice();
        this.loadIcons(this.state.type,this.state.cat);
	//AppState.addEventListener('change', this._handleAppStateChange);
        I18n.locale = NativeModules.RNI18n.locale
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
            //self.sendDataToUsbSerialDevice(JSON.stringify(self.pos));
          },
          (error) => console.log(error.message),
          {enableHighAccuracy: false, timeout: 10000, maximumAge: 1000, distanceFilter:50},
        );
      }else if(Global.MAP===Global.BaiduMap){
        this.watchID = KKLocation.watchPosition((position) => {
          //{timestamp,{coords:{heading,accuracy,longitude,latitude}}}  //no speed,altitude
          self.pos=position.coords
          //self.sendDataToUsbSerialDevice(JSON.stringify(self.pos));
        });
      }
      this.setState({gps:true});
    }
    turnOffGps(){
        this.setState({gps:false});
        if(this.watchID==null){
            return
        }
        if(Global.MAP===Global.GoogleMap)
            navigator.geolocation.clearWatch(this.watchID);
        else
            KKLocation.clearWatch(this.watchID)
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
            var color=Global.CAT_COLORS[marker.cat]
            let key = Global.getKeyFromMsg(marker)
            let T = marker.type.substring(0,1).toUpperCase()
            //badge={{text:T,color:_color}}
            return (
              <GMapView.Marker
                  key={marker.ctime}
                  coordinate={{latitude:parseFloat(marker.lat), longitude:parseFloat(marker.lng)}}
                  //image={ placeIcon }
                  onPress={ ()=> this.showMsgByKey(key) }
              >
                  <Icon name={Global.TYPE_ICONS[this.state.type]} color={color} size={40} />
              </GMapView.Marker>
            )
        });
    }
    /*renderPlaceMarkersBmap(){
        return this.state.markers.map( (marker) => {
            var self=this
            var color='blue'
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
      this.turnOffGps()
      this.props.navigator.pop();
    }
    move(p){
      this.refs.gmap.animateToRegion(p);
    }
    moveToMe(){
      //bmap:{timestamp,{coords:{heading,accuracy,longitude,latitude}}}
      if(this.pos!=null){
          if(Global.MAP===Global.GoogleMap){
              let p = {
                  ...this.state.region,
                  latitude:this.pos.latitude,
                  longitude:this.pos.longitude,
              }
              this.refs.gmap.animateToRegion(p);
          }else this.refs.bmap.zoomToLocs([[this.pos.latitude, this.pos.longitude]]);
      }
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
    downloadMsg(type,cat) {
      var self = this;
      var range = this.distance(this.state.region.latitudeDelta,this.state.region.longitudeDelta)
      //alert('type:'+this.state.type+' ,range:'+range +' ,region:'+JSON.stringify(this.state.region))
      Net.rangeMsg(type, this.state.region, range).then((rows)=> {
          //alert(rows.length)
          if(self.state.markers.length>0) self.setState({ markers:[] });
          var markers = rows.map((row)=>{
            //row ={ lat,lng,type,title,content,ctime, }
            //row['view'] = <Icon name={Global.TYPE_ICONS[this.state.type]} color={color} size={40} badge={{text:'R',color:'gray'}} />
            //row['view']   = <Icon name={'ion-ios-navigate-outline'} color={'#222222'} size={40} />
            row['image']=self.PlaceIcon
            row['latitude']=parseFloat(row.lat)
            row['longitude']=parseFloat(row.lng)
            return row;
         })
         this.setState({ markers: markers });
      })
      .catch((e)=>{
          //alert('Problem:'+JSON.stringify(e))
      });
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
        let iconType = Global.TYPE_ICONS[this.state.type]
        //let iconCat  = Global.CAT_COLORS[this.state.cat]
        let color = Global.CAT_COLORS[this.state.cat]
/*
                <View style={{width:40}} />
                <Icon name={iconCat} color={color} size={40} onPress={()=>this.setState({showCats:!this.state.showCats})} />
                <Icon name={'ion-ios-arrow-down'} color={color} size={16} onPress={()=>this.setState({showCats:!this.state.showCats})} />
                <Modal
                    visible={this.state.showCats}
                    onPress={() => this.setState({showCats:false})}
                >
                    {this.renderCatsModal()}
                </Modal>
*/
        return (
          <NavigationBar style={Style.navbar} //title={{title:this.title}}
            leftButton={
              <View style={{flexDirection:'row',justifyContent:'center'}}>
                <Icon name={iconType} color={color} size={40} onPress={()=>this.setState({showTypes:!this.state.showTypes})} />
                <Icon name={'ion-ios-arrow-down'} color={color} size={16} onPress={()=>this.setState({showTypes:!this.state.showTypes})} />
                <View style={{width:40}} />
                <View style={{marginBottom:4}} >
                    <View style={{height:10}} />
                    <Button 
                        style={{height:30,borderColor:'white',backgroundColor:color}} 
                        textStyle={{fontSize: 13,color:'white'}} 
                        onPress={()=>this.setState({showCats:!this.state.showCats})}>
                          {' '+I18n.t(this.state.cat)+' '}
                    </Button>
                </View>
                <Icon name={'ion-ios-arrow-down'} color={color} size={16} onPress={()=>this.setState({showCats:!this.state.showCats})} />
                <Modal
                    visible={this.state.showTypes||this.state.showCats}
                    onPress={() => {
                        if(this.state.showTypes) this.setState({showTypes:false})
                        if(this.state.showCats) this.setState({showCats:false})
                    }}
                >
                    {this.renderModal()}
                </Modal>
              </View>
            }
            rightButton={
              <View style={{flexDirection:'row', alignItems:'center', justifyContent:'center'}}>
                {this.renderGpsIcon()}
                <View style={{width:40}} />
                {this.renderAddIcon()}
                <View style={{width:10}} />
              </View>
            }
          />
        );
    }
    renderGpsIcon(){
      let c = Style.font_colors.disabled
      if(!this.state.gps)
          c = Style.font_colors.enabled
      return (<Icon name={"ion-ios-compass-outline"} color={c} size={40} onPress={this.switchGps.bind(this)} />);
    }
    renderAddIcon(){
      if(Global.mainlogin==='') return <Icon name={'ion-ios-add'} size={50} color={'gray'} onPress={() => alert('Please login to publish') }/>
      else return <Icon name={'ion-ios-add'} size={50} color={Style.font_colors.enabled} onPress={() => this.props.navigator.push({component:FormInfo, passProps:{navigator:this.props.navigator} })}/>
    }
    renderModal(){
        if(this.state.showTypes) return this.renderTypesModal()
        else if(this.state.showCats) return this.renderCatsModal()
    }
    renderTypesModal(){
        return (
          <TouchableHighlight style={{ height:Style.DEVICE_HEIGHT*2/3, alignItems: 'center', justifyContent: 'center' }} >
            <ListView
                dataSource={ this.state.typeDataSource }
                renderRow={ this.renderTypeRow.bind(this) }
                renderSeparator={(sectionID, rowID) => <View key={`${sectionID}-${rowID}`} style={{height: 1,backgroundColor:Style.font_colors.enabled }} />}
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
                { I18n.t(row) }
              </Text>
            </View>
          </View>
        </View>
      </TouchableHighlight>
      )
    }
    _pressType(sid,rid,type){
        this.loadIcons(type,this.state.cat)
        this.setState({type:type,showTypes:false,markers:[]})
        this.downloadMsg(type,this.state.cat)
    }
    renderCatsModal(){
        return (
          <TouchableHighlight style={{ height:Style.DEVICE_HEIGHT*1/3, alignItems: 'center', justifyContent: 'center' }} >
            <ListView
                dataSource={ this.state.catDataSource }
                renderRow={ this.renderCatRow.bind(this) }
                renderSeparator={(sectionID, rowID) => <View key={`${sectionID}-${rowID}`} style={{height: 1,backgroundColor:Style.font_colors.enabled }} />}
            />
          </TouchableHighlight>
        );
    }
    renderCatRow(row: string, sectionID: number, rowID: number){
      //alignItems: 'center'
      return (
      <TouchableHighlight style={{backgroundColor:'white'}} onPress={() => this._pressCat(sectionID,rowID,row)}>
        <View>
          <View style={{flexDirection:'row',backgroundColor:'white', justifyContent:'center', padding:15, alignItems:'center' }}>
            <View style={{width:200,marginLeft:70,}}>
              <Text style={{ fontSize:20,}}>
                { I18n.t(row) }
              </Text>
            </View>
          </View>
        </View>
      </TouchableHighlight>
      )
    }
    _pressCat(sid,rid,cat){
        this.loadIcons(this.state.type,cat)
        this.setState({cat:cat,showCats:false,markers:[]})
        this.downloadMsg(this.state.type,cat)
    }
    onRegionChange(r) {
      this.setState({region: r});
      Store.save('region', r);
      this.downloadMsg(this.state.type,this.state.cat);
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
              }
          });
      });
    }
    renderFocusIcon(){
      let con1 = Global.MAP===Global.BaiduMap && this.state.gps
      let con2 = Platform.OS === 'ios' && Global.MAP===Global.GoogleMap && this.state.gps
      if(con1 || con2){
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
        if(perm_nbr < this.permissions.length) return null //<Loading />
      }
      //alert('Global.MAP_TRAFFIC='+Global.MAP_TRAFFIC+'\nGlobal.MAP='+Global.MAP+'\nGlobal.MAP_TYPE='+Global.MAP_TYPE)
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
      let map_traffic = Global.MAP_TRAFFIC=='false'?false:true
      //alert('map_traffic='+map_traffic)
      return (
            <GMapView
              ref='gmap'
              style={map_style}
              showsUserLocation={this.state.gps}
              rotateEnabled={false} //showsCompass={true}
              showsScale={true}
              onRegionChangeComplete={this.onRegionChange.bind(this)}
              initialRegion={this.state.region}
              mapType={Global.MAP_TYPE} //{standard,satellite}
              showsTraffic={map_traffic}
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
      let map_traffic = Global.MAP_TRAFFIC=='false'?false:true
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
                mapType={Global.MAP_TYPE} //{standard,satellite}
                trafficEnabled={map_traffic}
            />

      );
    }
};

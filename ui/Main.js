import React, { Component } from 'react'
import {ToastAndroid,BackAndroid, InteractionManager, Platform, Text, View, Navigator, } from 'react-native'
//import TimerMixin from 'react-timer-mixin';
import Tabs from 'react-native-tabs'
import Drawer from 'react-native-drawer'
import OneSignal from 'react-native-onesignal';
import {Icon} from './Icon'
import EventEmitter from 'EventEmitter'
import Store from "../io/Store"
import Net from "../io/Net"
import Global from "../io/Global"
import Style       from "./Style"
import Loading     from "./Loading"
import Maps from "./Maps"

import ControlPanel from "./ControlPanel"
import APIList   from "./APIList"
import SettingsList   from "./SettingsList"
import NotifyList from './NotifyList'
import FriendList from './FriendList'

export default class Main extends Component {
  constructor(props) {
    super(props);
    this.types = ['car','taxi','estate']
    this.state = {
      page:this.props.page!=null?this.props.page: Store.msgTab,
      badge:'',
      refresh:false,
      mails:[],
      //isLoading:true,
      region: {
        latitude: 39.9042,
        longitude: 116.4074,
        latitudeDelta: 1,
        longitudeDelta: 1,
        zoom: 16,
      },
      //drawerPanEnabled:false,
      gps:false,
      
    }; 
    //this.changeFilter=this.changeFilter.bind(this)
    this.watchID = (null: ?number);
    this.onBackAndroid=this.onBackAndroid.bind(this)
  }
  funk = () => {
      //auto binding function
  }
  componentWillUnmount() {
      this.turnOffGps();
      if(Platform.OS === 'android') {
          BackAndroid.removeEventListener('hardwareBackPress', this.onBackAndroid);
      }
      clearInterval(this.timer)
  }
  componentDidMount() {
      //InteractionManager.runAfterInteractions(() => {
      //    this.setState({isLoading: false});
      //});
      this.timer = setInterval(()=>this.timerFunction(),60000)
  }
  componentWillMount(){
      var _this = this;
      if(Platform.OS === 'android'){
          BackAndroid.addEventListener('hardwareBackPress', this.onBackAndroid);
      }
      this.checkSettingsChange();
      this.notification();
  }
  onBackAndroid(){
      var routers = this.props.navigator.getCurrentRoutes();
      if (routers.length > 1) {
          this.props.navigator.pop();
          return true;
      }
      if (this.lastBackPressed && this.lastBackPressed + 2000 >= Date.now()) {
          return false;
      }
      this.lastBackPressed = Date.now();
      ToastAndroid.show('Double press to exit!',ToastAndroid.SHORT);
      return true;
  }
  notification(){
      OneSignal.configure({
          onIdsAvailable: function(device) {
            let userid = 'UserId = '+ device.userId;
            let token  = 'PushToken = '+ device.pushToken;
            //alert('onesignal.notification:\n'+userid+'\n'+token)
          },
      onNotificationOpened: function(message, data, isActive) {
          console.log('MESSAGE: ', message);
          console.log('DATA: ', data);
          console.log('ISACTIVE: ', isActive);
      // Do whatever you want with the objects here
      // _navigator.to('main.post', data.title, { // If applicable
      //  article: {
      //    title: data.title,
      //    link: data.url,
      //    action: data.actionSelected
      //  }
      // });
      }
  });
  }
  checkLogin(type){
      //var self = this
      Store.get(type).then(function(user){  //{type,email}
          if(user != null && Global.logins[user.type]==null) {
              Global.logins[user.type]=user.email;
              Global.mainlogin = Global.getMainLogin(Global.logins)
              Global[type]=user
              //if(Global.mainlogin!=self.state.mainlogin){
              //    self.setState({mainlogin:Global.mainlogin }) 
              //}
          }else if(user == null && Global.logins !== ''){
              let look_type = type.substring(5)
              delete Global.logins[look_type]
              Global.mainlogin = Global.getMainLogin(Global.logins)
              Global[type]=null
              //if(Global.mainlogin!=self.state.mainlogin){
              //    self.setState({ mainlogin:Global.mainlogin })
              //}
          }
      });
  }
  checkMapSettings(){
      var _this = this;
      Store.get('region').then((region_value) => {
        if(region_value !=null && region_value.latitude !=null){
          if(region_value.zoom == null){
              region_value['zoom'] = 14
          }
          if(region_value.latitudeDelta == null){
              region_value['latitudeDelta'] = 0.01
              region_value['longitudeDelta'] = 0.01
          }
          if(this.state.region.latitude != region_value.latitude)
              _this.setState({ region:region_value,  });
        }
      });
      //Store.get('user').then((user_value) => {
      //  _this.setState({ user:user_value });
      //});
      if(Global.MAP == null)
      Store.get_string(Store.SETTINGS_MAP).then((map_value) => {
        if(map_value != null){
            _this.map = map_value;
        }else{
            _this.map = 'BaiduMap'
        }
        Global.MAP = _this.map
      });
  }
  timerFunction(){
      this.loadNotifyByLogin()
  }
  loadNotifyByLogin(){
      if(Global.mainlogin.length>0) this.loadNotify('@'+Global.mainlogin);
  }
  isJsonString(str) {
      try {
        JSON.parse(str);
      } catch (e) {
        return false;
      }
      return true;
  }
  loadNotify(key) {
    //alert('loadNotify('+key+') length:'+key.length)
    var self = this;
    Net.getNotify(key).then((rows)=> {
      if( typeof rows === 'string' && !self.isJsonString(rows) ){
        //alert('Main.loadNotify:'+rows)
      }else{
        //alert('Main.loadNotify:valid json')
        if(rows==null) { return }
        else{
          var arr = self.Kv2Json(rows)
          var unread = self.getUnread(arr)
          var badgeText = ''+unread.length;
          self.setState({
            mails:arr,
            badge:badgeText,
            refresh:true,
            //mainlogin:key,
          });
        }
      }
    })
    /*.catch((e)=>{
        alert('Network Problem!'+JSON.stringify(e))
    });*/
  }
  //key='car:lat,lng:ctime#rtime'  value='r1|fb:email|content'
  Kv2Json(kv){
      var arr = []
      if(kv == null) return arr;
      var keys = Object.keys(kv)  //.reverse()
      keys.map((key)=>{
          var key_arr = key.split(':')
          var type   = key_arr[0]
          var latlng = key_arr[1]
          var times   = key_arr[2]
          var ctime   = times.split('#')[0]
          var rtime   = times.split('#')[1]
          var value_arr = kv[key].split('|')
          var rtype = value_arr[0].substring(0,1);    //r
          var status = value_arr[0].substring(1)      //1
          var user = value_arr[1]
          var content = value_arr[2]
          var obj = {type:type, rtype:rtype, latlng:latlng, ctime:ctime, rtime:rtime, status:status, user:user, content:content }
          //alert('key='+key+'\nvalue='+kv[key])      //key='car:lat,lng:ctime#rtime'  value='r1|fb:email|content'
          //alert(JSON.stringify(obj))
          arr.push( obj )
      })
      arr.sort(function(a,b){
          return parseInt(b.rtime)-parseInt(a.rtime)
      })
      return arr;
  }
  getUnread(arr){
      return arr.filter((json)=>{
          return (json.status==='1')
      })
  }
  goBack(){
    this.props.navigator.pop();
  }
  turnOffGps(){
      navigator.geolocation.clearWatch(this.watchID);
      this.setState({gps:false});
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
  pages(){
    if(this.state.page ===Store.msgTab){
      return <NotifyList navigator={this.props.navigator} mainlogin={Global.mainlogin} mails={this.state.mails} />
    } else if(this.state.page ===Store.userTab){
      return <FriendList navigator={this.props.navigator} />
    } else if(this.state.page ===Store.mapTab){
      return <Maps navigator={this.props.navigator} region={this.state.region} gps={this.state.gps} mainlogin={Global.mainlogin} />
    } else if(this.state.page ===Store.confTab){
      return <SettingsList navigator={this.props.navigator} logins={Global.logins}/>
    }
  }
  checkSettingsChange(){
      this.checkLogin('user_fb')
      this.checkLogin('user_gg')
      this.checkMapSettings()
      if(Global.mainlogin.length===0) this.setState({mails:[]})
  }
  gotoPage(name){
      this.checkSettingsChange()
      this.setState({ page: name });
  }
  getSelectedColor(id){
    if(id === this.state.page) return 'blue';
  }
  render() {
    //if(this.state.isLoading) return <Loading />
    //<Drawer type={"overlay"} tapToClose={true} ref={(ref) => this.drawer = ref} openDrawerOffset={0.3} acceptPan={this.state.drawerPanEnabled}
    //    content={<ControlPanel list={this.types} filters={this.state.filters} onClose={(value) => this.changeFilter(value)} />}
    //>
    //alert('main.render() mails='+ JSON.stringify(this.state.mails))
    if(Global.logins !== '' && !this.state.refresh) this.loadNotifyByLogin()
    return (
        <View style={{flex:1}}>
          {this.pages()}
          <Tabs selected={this.state.page} style={Style.navBar} selectedStyle={{color:'blue'}}
                onSelect={(e)=> this.gotoPage(e.props.name)} >
            <Icon size={40} color={this.getSelectedColor(Store.msgTab)} name={Store.msgTab}  badge={{text:this.state.badge, color:'red'}} />
            <Icon size={40} color={this.getSelectedColor(Store.userTab)} name={Store.userTab} />
            <Icon size={40} color={this.getSelectedColor(Store.mapTab)} name={Store.mapTab}  />
            <Icon size={40} color={this.getSelectedColor(Store.confTab)} name={Store.confTab} />
          </Tabs>
        </View>
    );
  }
}

import React, { Component } from 'react'
import {DeviceEventEmitter,Linking,ToastAndroid,BackAndroid, InteractionManager, Platform, Text, View, Navigator, } from 'react-native'
//import TimerMixin from 'react-timer-mixin';
import Tabs from 'react-native-tabs'
//import Drawer from 'react-native-drawer'
//import UsbSerial from 'react-native-usbserial';
import {Icon} from './Icon'
import Store from "../io/Store"
import Net from "../io/Net"
import Global from "../io/Global"
import Style from "./Style"
import Loading from "./Loading"
import Maps from "./Maps"

import ControlPanel from "./ControlPanel"
import APIList   from "./APIList"
import SettingsList   from "./SettingsList"
import NotifyList from './NotifyList'
import MyList from './MyList'
import Help from './Help'
import Detail from './Detail'
import Note from './Note'
import {checkPermission,requestPermission} from 'react-native-android-permissions';

export default class Main extends Component {
  constructor(props) {
    super(props);
    this.types = ['car','taxi','estate']
    this.state = {
      page:this.props.page!=null?this.props.page: Store.msgTab,
      badge:'',
      refresh:false,
      mails:[],
      region: null,
      gps:false,
      
    }; 
    this.openShareInfo=this.openShareInfo.bind(this)
    this.openLogic=this.openLogic.bind(this)
    this.openPage=this.openPage.bind(this)
    this.watchID = (null: ?number);
    this.onBackAndroid=this.onBackAndroid.bind(this)
  }
  funk = () => {
      //auto binding function
  }
  componentWillUnmount() {
      if(Platform.OS === 'android') {
          BackAndroid.removeEventListener('hardwareBackPress', this.onBackAndroid);
      }
      //clearInterval(this.timer)
      //this.event_notify.remove()
      Linking.removeEventListener('url', this.openLogic);
  }
  componentDidMount() {
      //InteractionManager.runAfterInteractions(() => {
      //    this.setState({isLoading: false});
      //});
      this.ExtUrl()
      //checkPermission()
      //this.event_notify = DeviceEventEmitter.addListener('refresh:Main.Notify',(evt)=>setTimeout(()=>this.loadNotifyByLogin(),400));
  }
  componentWillMount(){
      var _this = this;
      if(Platform.OS === 'android'){
          BackAndroid.addEventListener('hardwareBackPress', this.onBackAndroid);
      }
      this.checkSettingsChange();
  }
  openPage(page,data){
      this.props.navigator.push({
          component: page,
          passProps: {
              msg:data,
          }
      });
  }
  openShareInfo(key){
      var self = this;
      Net.getMsg(key).then((json)=> {
        if(json!=null){
          //alert(JSON.stringify(json))
          self.openPage(Detail,json)
        }else
          alert('The information does not exist.')
      });
  }
  openNotification(str){
      if(Platform.OS === 'ios') 
          str = str.replace(/%25/g,'%').replace(/%23/g,'#') //replaceAll('%26','&')
      //console.log('openNotification:'+str)
      let strJson = decodeURI(str)
      let note = JSON.parse(strJson)
      this.openPage(Note,note)
  }
  openLogic(URL){
      let url = typeof URL === 'string'?URL:URL.url
      if(url.indexOf('/i/')>-1) {
          let key = url.split('/i/')[1]
          if(key.length>0){
              if(key.indexOf('#')>-1) key=key.split('#')[0]
              this.openShareInfo(key)
          }
      }else if(url.indexOf('/c/')>-1){
          let str = url.split('/c/')[1]
          this.openNotification(str)
      }
  }
  ExtUrl(){
      let self=this
    ///if(Platform.OS === 'ios'){
      Linking.addEventListener('url', this.openLogic);  //for handling url when app running in background
    //}else if(Platform.OS === 'android'){  //for android, AndroidManifest.xml launchMode=standard
      Linking.getInitialURL().then((url)=>{  //for cold start
          if(url) self.openLogic(url)
      }).catch(err=>alert('err:'+err))
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
      /*onNotificationOpened: function(message, data, isActive) {
            if(data.custom){
              //self.openPage(Note,data)
              self.sendCustomNoteURL(data)
            }else if (data.tag_notification) {
              self.sendShareReadURL(data.tag_notification)
            }else if (data.p2p_notification && data.p2p_notification.key) {
              //self.openShareInfo(data.p2p_notification.key.split('#')[0])
              self.sendShareReadReplyURL(data.p2p_notification)
            }*/
  }
  sendCustomNoteURL(note){ //{custom:1,title,content}
      let str64=encodeURI(JSON.stringify(note))
      let url='share://shareplus.co.nf/c/'+str64;
      //alert('url='+str64)
      //url = 'intent://shareplus.co.nf/i/'+data.p2p_notification.key+'#Intent;scheme=share;package=com.share;end'
      Linking.openURL(url);
  }
  sendShareReadURL(key){
      let url='share://shareplus.co.nf/i/'+key;
      Linking.openURL(url);
  }
  sendShareReadReplyURL(reply){
      let replyKey= reply.key //car:lat,lng:ctime#rtime
      let replyValue= reply.value //{t:'r1',l:'fb:email',c:'content'}
      //this.readMsg(replyKey,replyValue);
      let msgKey= replyKey.split('#')[0] //car:lat,lng:ctime
      //console.log('title='+JSON.stringify(message)+'\tdata='+JSON.stringify(data))
      let url='share://shareplus.co.nf/i/'+msgKey;
      //url = 'intent://shareplus.co.nf/i/'+data.p2p_notification.key+'#Intent;scheme=share;package=com.share;end'
      Linking.openURL(url);
  }
  checkLogin(type){
      //var self = this
      //alert('type='+type+' last2='+type.split('_')[1])
      Store.get(type).then((user)=>{  //{type,email}
          let last2 = type.split('_')[1]
          if(user != null && Global.logins[user.type]==null) {
              Global.logins[user.type]=user.email;
              Global.mainlogin = Global.getMainLogin()
              Global.userObjects[last2]=user
              //if(Global.mainlogin!=self.state.mainlogin){
              //    self.setState({mainlogin:Global.mainlogin }) 
              //}
          }else if(user == null && Global.logins !== ''){
              let look_type = type.substring(5)
              delete Global.logins[look_type]
              Global.mainlogin = Global.getMainLogin()
              Global[type]=null
              //if(Global.mainlogin!=self.state.mainlogin){
              //    self.setState({ mainlogin:Global.mainlogin })
              //}
          }
      });
      Store.get(Store.SETTINGS_LOGINS).then((login_settings)=>{    //{fb:none,wb:post}
          if(login_settings) Global.SETTINGS_LOGINS=login_settings
          else Global.SETTINGS_LOGINS={fb:Global.none,wb:Global.none}  //wx:Global.none,
          
      })
  }
  checkFirstTime(){
      let self=this
      Store.get_string(Global.SHOW_ADS).then(function(user){
          if(user == null){
             Store.save_string(Global.SHOW_ADS,'no');
             self.props.navigator.push({component:Help, passProps:{navigator:self.props.navigator} })
          }
      })
  }
  checkMapSettings(){
      var _this = this;
      Store.get('region').then((region_value) => {
        if(region_value !=null && region_value.latitude !=null){
          if(region_value.zoom == null){
              region_value['zoom'] = 16
          }
          if(region_value.latitudeDelta == null){
              region_value['latitudeDelta'] = 0.02
              region_value['longitudeDelta'] = 0.02
          }
          if(!this.state.region){
              //alert('fs faster than net ')
              _this.setState({ region:region_value });
          }
        }
      });
      //Store.get('user').then((user_value) => {
      //  _this.setState({ user:user_value });
      //});
      if(!this.state.region) Net.getLocation().then((gps)=>{
         let inchina = gps.country_code.toUpperCase() == 'CN'
         if(inchina)  Global.MAP = Global.BaiduMap;
         else Global.MAP = Global.GoogleMap;
         let loc={
             latitude:gps.latitude,
             longitude:gps.longitude,
             latitudeDelta:0.05,
             longitudeDelta:0.05,
             zoom:16,
         }
         if(!this.state.region && gps.latitude) _this.setState({ region:loc });
      });
      if(Global.MAP == null)
      Store.get_string(Store.SETTINGS_MAP).then((map_value) => {
        if(map_value != null){
            Global.MAP = map_value
        }else{
            Global.MAP = Global.GoogleMap
        }
      });
      Store.get_string(Store.SETTINGS_MAP_TYPE).then((map_type) => {
        if(map_type != null){
            Global.MAP_TYPE = map_type
        }else{
            Global.MAP_TYPE = Global.MAP_TYPE_NORMAL
        }
      });
      Store.get_string(Store.SETTINGS_MAP_TRAFFIC).then((map_traffic) => {
        if(map_traffic != null){
            Global.MAP_TRAFFIC = map_traffic
        }else{
            Global.MAP_TRAFFIC = Global.MAP_TRAFFIC_FALSE
        }
      });
  }
  //loadNotifyByLogin(){
  //    if(Global.mainlogin.length>0) this.loadNotify(Global.getNotifyKey());
  //}
  isJsonString(str) {
      try {
        JSON.parse(str);
      } catch (e) {
        return false;
      }
      return true;
  }
  /*loadNotify(key) {
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
    .catch((e)=>{
        alert('Network Problem!'+JSON.stringify(e))
    });
  }*/
  //key='car:lat,lng:ctime#rtime'  value='r1|fb:email|content'
  //key='car:lat,lng:ctime#rtime'  value={t:'r1', l:'fb:email', c:'content'}
  /*Kv2Json(kv){
      var arr = []
      if(kv == null) return arr;
      var keys = Object.keys(kv)  //.reverse()
      keys.map((key)=>{
          //alert('key='+key+'\nvalue='+kv[key])      //key='car:lat,lng:ctime#rtime'  value='r1|fb:email|content'
          var key_arr  = key.split(':')
          var type_cat_arr = key_arr[0].split('_')
          var type    = type_cat_arr[0]
          var cat     = type_cat_arr[1]
          var latlng  = key_arr[1]
          var times   = key_arr[2]
          var ctime   = times.split('#')[0]
          var rtime   = times.split('#')[1]
          if(kv[key].substring(0,1)==='{') {
            var value_obj = JSON.parse(kv[key])
            var rtype = value_obj.t.substring(0,1);    //r
            var status = value_obj.t.substring(1)      //1
            var user = value_obj.l
            var content = value_obj.c
            var obj = {type:type,cat:cat, rtype:rtype, latlng:latlng, ctime:ctime, rtime:rtime, status:status, user:user, content:content }
            //alert(JSON.stringify(obj))
            arr.push( obj )
          }
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
  }*/
  goBack(){
    this.props.navigator.pop();
  }
  pages(){
    if(this.state.page ===Store.msgTab){
      return <NotifyList navigator={this.props.navigator} mails={this.state.mails} />
    } else if(this.state.page ===Store.userTab){
      return <MyList     navigator={this.props.navigator} />
    } else if(this.state.page ===Store.mapTab){
      return <Maps navigator={this.props.navigator} region={this.state.region} gps={this.state.gps} />
    } else if(this.state.page ===Store.confTab){
      return <SettingsList navigator={this.props.navigator} logins={Global.logins}/>
    }
  }
  checkSettingsChange(){
      this.checkLogin('user_fb')
      this.checkLogin('user_wb')
      //this.checkLogin('user_gg')
      //this.checkLogin('user_wx')
      this.checkMapSettings()
      this.checkFirstTime()
      if(Global.mainlogin.length===0) this.setState({mails:[]})
  }
  gotoPage(name){
      this.checkSettingsChange()
      this.setState({ page: name });
  }
  getSelectedColor(id){
    if(id === this.state.page){
        //alert('id='+id+' page='+this.state.page +' color='+Style.highlight_color)
        return Style.highlight_color;
    }
  }
  render() {
    //if(this.state.isLoading) return <Loading />
    //<Drawer type={"overlay"} tapToClose={true} ref={(ref) => this.drawer = ref} openDrawerOffset={0.3} acceptPan={this.state.drawerPanEnabled}
    //    content={<ControlPanel list={this.types} filters={this.state.filters} onClose={(value) => this.changeFilter(value)} />}
    //>
    //alert('main.render() mails='+ JSON.stringify(this.state.mails))
    //if(Global.logins !== '' && !this.state.refresh) this.loadNotifyByLogin()
    return (
        <View style={{flex:1}}>
          {this.pages()}
          <Tabs selected={this.state.page} style={Style.bottomBar}
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

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
import KKLocation from 'react-native-baidumap/KKLocation';

export default class Main extends Component {
  constructor(props) {
    super(props);
    this.state = {
      page:this.props.page!=null?this.props.page: Store.msgTab,
      badge:'',
      refresh:false,
      mails:[],
      //region: null,
      gps:false,
    }; 
    this.openShare=this.openShare.bind(this)
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
      //Store.deleteShared(Store.PUSH_CLICKED);
      //checkPermission()
      //this.event_notify = DeviceEventEmitter.addListener('refresh:Main.Notify',(evt)=>setTimeout(()=>this.loadNotifyByLogin(),400));
  }
  componentWillMount(){
      if(Platform.OS === 'android'){
          BackAndroid.addEventListener('hardwareBackPress', this.onBackAndroid);
      }
      this.checkSettingsChange();
      let self=this
      Store.getShared(Store.PUSH_CLICKED, (value)=>{
          console.log('Main.willMount() getShare()')
          if(value!=null || value!=""){
              //alert("push_clicked type="+(typeof value)+" : "+value);
              //self.setState({open:'push'})
              let json = JSON.parse(value)
              //alert('push_clicked:'+json.custom.i)
              self.openPush(json)
              Store.deleteShared(Store.PUSH_CLICKED);
          }else{
              //self.setState({open:'normal'})
          }
      });
  }
  openShare(key){
      let self=this
      Net.getMsg(key).then((json)=> {
        if(json!=null){
            //alert(JSON.stringify(json))
            self.openPage(Detail,json)
        }else alert('The information does not exist.')
      });
  }
  openPush(data){
      if(data&&data.custom&&data.custom.i){  //data.custom.t={p2p,tag}
          this.openShare(data.custom.i)
      }else if (data&&data.custom&&data.custom.note){
          this.openPage(Note,data)
      }
  }
  openPage(page,data){
      this.props.navigator.push({
          component: page,
          passProps: {
              msg:data,
          }
      });
  }
  openNotification(str){
      if(Platform.OS === 'ios') 
          str = str.replace(/%25/g,'%').replace(/%23/g,'#') //replaceAll('%26','&')
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
              this.openShare(key)
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
              //self.openShare(data.p2p_notification.key.split('#')[0])
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
          //if(user!=null)alert('type='+type+' json='+JSON.stringify(user))
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
      if(!Global.region)
        /*Store.get('region').then((region_value) => {
          if(region_value !=null && region_value.latitude !=null){
            if(region_value.zoom == null){
              region_value['zoom'] = 16
            }
            if(region_value.latitudeDelta == null){
              region_value['latitudeDelta'] = 0.02
              region_value['longitudeDelta'] = 0.02
            }
            if(!Global.region){
              Global.region=region_value
            }
          }else{  //  first start
        */
          //{timestamp,{coords:{heading,accuracy,longitude,latitude}}}  //no speed,altitude
          KKLocation.getCurrentPosition((position) => {
            //console.log("location get current position: ", position);
            Global.region={
              latitude:  position.coords.latitude,
              longitude: position.coords.longitude,
              latitudeDelta:0.05,
              longitudeDelta:0.05,
              zoom:16,
            }
          }, (error) => { console.log("location get current position error: ", error) },
          {enableHighAccuracy: false, timeout: 10000, maximumAge: 1000, distanceFilter:100});
      //}})
      if(Global.MAP == null){
        Store.get_string(Store.SETTINGS_MAP).then((map_value) => {
          if(map_value != null){
            Global.MAP = map_value
          }else{
            Net.getBDLocation().then((gps)=>{
              if(gps.status==0 && gps.address){
                let cc = gps.address.split('|')[0].toLowerCase()
                Global.MAP = Global.BaiduMap;
              }else{
                Global.MAP = Global.GoogleMap;
              }
            });
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
  }
  goBack(){
    this.props.navigator.pop();
  }
  pages(){
    if(this.state.page ===Store.msgTab){
      return <NotifyList navigator={this.props.navigator} mails={this.state.mails} />
    } else if(this.state.page ===Store.userTab){
      return <MyList     navigator={this.props.navigator} />
    } else if(this.state.page ===Store.mapTab){
      return <Maps navigator={this.props.navigator} region={Global.region} gps={this.state.gps} />
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

'use strict';
import React, { Component } from 'react'
import {Dimensions, NativeModules, View, Text, StyleSheet, ScrollView, TouchableOpacity, } from 'react-native'
import LoginGG from './LoginGG'
import LoginFB from './LoginFB'
import LoginWX from './LoginWX'
import LoginWB from './LoginWB'
import Style from './Style'
import APIList from './APIList'
import UsbList from './UsbList'
import Settings from './Settings'
//import MapSettings from './MapSettings'
import Store from '../io/Store'
import Global from '../io/Global'
import NavigationBar from 'react-native-navbar'
import CodePush from "react-native-code-push"
import {Icon} from './Icon'
import I18n from 'react-native-i18n';

export default class SettingsList extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
          user_fb:Global.user_fb,
          user_gg:Global.user_gg,
          user_wx:Global.user_wx,
          user_wb:Global.user_wb,
      };
      this.login_fb  = this.login_fb.bind(this);
      this.logout_fb = this.logout_fb.bind(this);
      this.login_gg  = this.login_gg.bind(this);
      this.logout_gg = this.logout_gg.bind(this);
      this.login_wx  = this.login_wx.bind(this);
      this.logout_wx = this.logout_wx.bind(this);
      this.login_wb  = this.login_wb.bind(this);
      this.logout_wb = this.logout_wb.bind(this);
      //this.lang = NativeModules.RNI18n.locale //.replace('_', '-').toLowerCase()
    }
    componentWillMount(){
        //alert(
        //  'fb:'+JSON.stringify(Global.user_fb) +
        //  '\n\ngg:'+JSON.stringify(Global.user_gg) +
        //  '\n\nwx:'+JSON.stringify(Global.user_wx) +
        //  '\n\nwb:'+JSON.stringify(Global.user_wb)
        //)
        //I18n.locale = I18n.locale    //en-US, not compatible with json key format
        I18n.locale = NativeModules.RNI18n.locale  //en_US
    }
    componentDidMount(){
        CodePush.notifyApplicationReady();
    }
    checkUpdate(){
        CodePush.checkForUpdate().then( (update) =>{
            if( !update ){
		alert('This is the latest version')
            }else {
                var dev_key = 'ZplJqL1U5atxj36CLDKSEzzVmCGq4yG-vGnJ-'
                var prd_key = 'eP-AeP1uJtwuy_QVdGZrpj3F2mA04yG-vGnJ-'
                let CODEPUSH_KEY = (__DEV__) ? dev_key: prd_key;
		CodePush.sync({ 
                    updateDialog: true, 
		    installMode: CodePush.InstallMode.IMMEDIATE,
		    deploymentKey: CODEPUSH_KEY,
		});
		//CodePush.sync()
            }
        });
    }
    about(){
        //CodePush.getCurrentPackage().then((update) => {
           // If the current app "session" represents the first time
           // this update has run, and it had a description provided
           // with it upon release, let's show it to the end user
           // console.log("current app version:"+JSON.stringify(update));
           //if (update.isFirstRun && update.description) {
           //    // Display a "what's new?" modal
           //}
        //});
    }

    componentDidMount(){
        CodePush.notifyApplicationReady();
    }
    login_gg(user){
        this.setState({user_gg:user});
        Global.user_gg = user
        Global.logins.gg = user.email
        Global.mainlogin = Global.getMainLogin(Global.logins)
    }
    logout_gg(user){
        this.setState({user_gg:null});
        Global.user_gg = null
        delete Global.logins.gg
        Global.mainlogin = Global.getMainLogin(Global.logins)
    }
    login_fb(user){
        this.setState({user_fb:user});
        Global.user_fb = user
        Global.logins.fb = user.email
        Global.mainlogin = Global.getMainLogin(Global.logins)
    }
    logout_fb(user){
        this.setState({user_fb:null});
        Global.user_fb = null
        delete Global.logins.fb
        Global.mainlogin = Global.getMainLogin(Global.logins)
    }
    login_wx(user){
        this.setState({user_wx:user});
        Global.user_wx = user
        Global.logins.wx = user.email
        Global.mainlogin = Global.getMainLogin(Global.logins)
    }
    logout_wx(user){
        this.setState({user_wx:null});
        Global.user_wx = null
        delete Global.logins.wx
        Global.mainlogin = Global.getMainLogin(Global.logins)
    }
    login_wb(user){
        this.setState({user_wb:user});
        Global.user_wb = user
        Global.logins.wb = user.email
        Global.mainlogin = Global.getMainLogin(Global.logins)
    }
    logout_wb(user){
        this.setState({user_wb:null});
        Global.user_wx = null
        delete Global.logins.wb
        Global.mainlogin = Global.getMainLogin(Global.logins)
    }
    render(){
        var DEVICE_WIDTH = Dimensions.get('window').width
	//alert('w:'+DEVICE_WIDTH)
        return (
          <View style={Style.main}>
              <NavigationBar style={Style.navbar} title={{title:'Share',}} />
              <ScrollView
                  //automaticallyAdjustContentInsets={false}
                  //scrollEventThrottle={200}
              >
                  <TouchableOpacity style={Style.left_card} onPress={()=> this.checkUpdate()} >
                      <View style={{width:DEVICE_WIDTH/3}} />
                      <View style={{width:DEVICE_WIDTH/8,alignItems:'center',}}>
                          <Icon name={'ion-ios-arrow-up'} size={35}/>
                      </View>
                      <Text>{I18n.t('update')}</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={Style.left_card} onPress={()=> this.about()}>
                      <View style={{width:DEVICE_WIDTH/3}} />
                      <View style={{width:DEVICE_WIDTH/8,alignItems:'center',}}>
                          <Icon name={'fa-info-circle'} size={30}/>
                      </View>
                      <Text>{I18n.t('about')}</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={Style.left_card} onPress={()=> this.props.navigator.push({
                      component: Settings,
                      passProps: {navigator:this.props.navigator,},
                  })}>
                      <View style={{width:DEVICE_WIDTH/3}} />
                      <View style={{width:DEVICE_WIDTH/8,alignItems:'center',}}>
                          <Icon name={'ion-ios-cog-outline'} size={35}/>
                      </View>
                      <Text>{I18n.t('settings')}</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={Style.left_card} onPress={()=> this.props.navigator.push({
                      component: APIList,
                      passProps: {navigator:this.props.navigator,},
                  })}>
                      <View style={{width:DEVICE_WIDTH/3}} />
                      <View style={{width:DEVICE_WIDTH/8,alignItems:'center',}}>
                          <Icon name={'fa-plug'} size={30}/>
                      </View>
                      <Text>{I18n.t('plugin')}</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={Style.left_card} onPress={()=> this.props.navigator.push({
                      component: UsbList,
                      passProps: {navigator:this.props.navigator,},
                  })}>
                      <View style={{width:DEVICE_WIDTH/3}} />
                      <View style={{width:DEVICE_WIDTH/8,alignItems:'center',}}>
                          <Icon name={'fa-usb'} size={30}/>
                      </View>
                      <Text>{I18n.t('usb')}</Text>
                  </TouchableOpacity>
                  <View style={Style.left_card}>
                    <LoginGG user={this.state.user_gg} login={this.login_gg} logout={this.logout_gg} />
                  </View>
                  <View style={Style.left_card}>
                    <LoginFB user={this.state.user_fb} login={this.login_fb} logout={this.logout_fb} />
                  </View>
                  <View style={Style.left_card}>
                    <LoginWX user={this.state.user_wx} login={this.login_wx} logout={this.logout_wx} />
                  </View>
                  <View style={Style.left_card}>
                    <LoginWB user={this.state.user_wb} login={this.login_wb} logout={this.logout_wb} />
                  </View>
              </ScrollView>
          </View>
        );
    }
}

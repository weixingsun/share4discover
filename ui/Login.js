'use strict';
import React, { Component } from 'react'
import {Dimensions, NativeModules, View, Text, Platform, StyleSheet, ScrollView, TouchableOpacity, } from 'react-native'
//import LoginGG from './LoginGG'
import LoginFB from './LoginFB'
import LoginWX from './LoginWX'
import LoginWB from './LoginWB'
import Net from '../io/Net'
import Style from './Style'
import LoginSettings from './LoginSettings'
import Store from '../io/Store'
import Global from '../io/Global'
import NavigationBar from 'react-native-navbar'
import {Icon} from './Icon'
import I18n from 'react-native-i18n';

export default class SettingsList extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
          user_fb:Global.userObjects.fb,
          //user_gg:Global.userObjects.gg,
          user_wx:Global.userObjects.wx,
          user_wb:Global.userObjects.wb,
      };
      this.login_fb  = this.login_fb.bind(this);
      this.logout_fb = this.logout_fb.bind(this);
      //this.login_gg  = this.login_gg.bind(this);
      //this.logout_gg = this.logout_gg.bind(this);
      this.login_wx  = this.login_wx.bind(this);
      this.logout_wx = this.logout_wx.bind(this);
      this.login_wb  = this.login_wb.bind(this);
      this.logout_wb = this.logout_wb.bind(this);
    }
    componentWillMount(){
        //I18n.locale = NativeModules.RNI18n.locale  //en_US
    }
    componentDidMount(){
    }
    login_fb(user){
        this.setState({user_fb:user});
        Global.userObjects.fb = user
        Global.mainlogin = Global.getMainLogin()
        Net.loginUser(user)
    }
    logout_fb(user){
        this.setState({user_fb:null});
        delete Global.userObjects.fb
        Global.mainlogin = Global.getMainLogin()
    }
    login_wx(user){
        this.setState({user_wx:user});
        Global.userObjects.wx = user
        Global.mainlogin = Global.getMainLogin()
        Net.loginUser(user)
    }
    logout_wx(user){
        this.setState({user_wx:null});
        delete Global.userObjects.wx
        Global.mainlogin = Global.getMainLogin()
    }
    login_wb(user){
        this.setState({user_wb:user});
        Global.userObjects.wb = user
        Global.mainlogin = Global.getMainLogin()
        Net.loginUser(user)
    }
    logout_wb(user){
        this.setState({user_wb:null});
        delete Global.userObjects.fb
        Global.mainlogin = Global.getMainLogin()
    }
    renderFB(){
        if(Global.MAP === Global.GoogleMap)
        return <LoginFB user={this.state.user_fb} login={this.login_fb} logout={this.logout_fb} />
    }
    renderWB(){
        if(Platform.OS==='android')  //disabled until ios version published
        return <LoginFB user={this.state.user_fb} login={this.login_fb} logout={this.logout_fb} />
    }
    render(){
        var DEVICE_WIDTH = Dimensions.get('window').width
	//alert('w:'+DEVICE_WIDTH)
        return (
          <View style={Style.main}>
              <NavigationBar 
                  style={Style.navbar} 
                  title={{title:I18n.t('login'),tintColor:Style.font_colors.enabled}} //,tintColor:Style.font_colors.enabled}} 
                  leftButton={
                      <TouchableOpacity style={{width:50,height:50}} onPress={() => this.props.navigator.pop()}>
                          <Icon name={"ion-ios-arrow-round-back"} color={Style.font_colors.enabled} size={40} />
                      </TouchableOpacity>
                  }
              />
              <ScrollView
                  //automaticallyAdjustContentInsets={false}
                  //scrollEventThrottle={200}
              >
                  <TouchableOpacity style={Style.left_card_grey} onPress={()=> this.props.navigator.push({
                      component: LoginSettings,
                      passProps: {navigator:this.props.navigator,},
                  })}>
                      <View style={{width:10}} />
                      <View style={{width:30}}><Icon name={'ion-ios-paper-plane-outline'} size={22}/></View>
                      <View style={{width:10}} />
                      <View style={{flex:1}}><Text>{I18n.t('post')+' '+I18n.t('settings')}</Text></View>
                      <Icon name={'ion-ios-arrow-forward'} size={20} color={'#e5e5e5'}/>
                      <View style={{width:10}} />
                  </TouchableOpacity>
                  {this.renderFB()}
                  {this.renderWB()}
              </ScrollView>
          </View>
        );
    }
}

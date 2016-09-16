'use strict';
import React, { Component } from 'react'
import {Dimensions, NativeModules, View, Text, StyleSheet, ScrollView, TouchableOpacity, } from 'react-native'
import Login from './Login'
//import LoginSettings from './LoginSettings'
import Net from '../io/Net'
import Style from './Style'
//import APIList from './APIList'
import FeedList from './FeedList'
import UsbList from './UsbList'
import BleList from './BleList'
import MapSettings from './MapSettings'
import Help from './Help'
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
      };
      //this.lang = NativeModules.RNI18n.locale //.replace('_', '-').toLowerCase()
    }
    componentWillMount(){
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
    help(){
        this.props.navigator.push({
            component: Help,
            passProps: {navigator:this.props.navigator,},
        })
    }
    renderFeed(){
        if(Global.mainlogin=='fb:weixing.sun@gmail.com'){
            var DEVICE_WIDTH = Dimensions.get('window').width
            return (
                  <TouchableOpacity style={Style.left_card} onPress={()=> this.props.navigator.push({
                      component: FeedList,
                      passProps: {navigator:this.props.navigator,},
                  })}>
                      <View style={{width:DEVICE_WIDTH/3}} />
                      <View style={{width:DEVICE_WIDTH/8,alignItems:'center',}}>
                          <Icon name={'fa-plug'} size={30}/>
                      </View>
                      <Text>{I18n.t('plugin')}</Text>
                  </TouchableOpacity>
            )
        }
    }
    renderUSB(){
        if(Global.mainlogin=='fb:weixing.sun@gmail.com'){
            var DEVICE_WIDTH = Dimensions.get('window').width
            return (
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
            )
        }
    }
    renderBLE(){
        if(Global.mainlogin=='fb:weixing.sun@gmail.com'){
            var DEVICE_WIDTH = Dimensions.get('window').width
            return (
                <TouchableOpacity style={Style.left_card} onPress={()=> this.props.navigator.push({
                    component: BleList,
                    passProps: {navigator:this.props.navigator,},
                })}>
                    <View style={{width:DEVICE_WIDTH/3}} />
                    <View style={{width:DEVICE_WIDTH/8,alignItems:'center',}}>
                        <Icon name={'fa-bluetooth'} size={30}/>
                    </View>
                    <Text>{I18n.t('ble')}</Text>
                </TouchableOpacity>
            )
        }
    }
    renderLogin(){
        var DEVICE_WIDTH = Dimensions.get('window').width
        let login_color = Global.mainlogin.length>0?'blue':'grey'
        return (
                <TouchableOpacity style={Style.left_card} onPress={()=> this.props.navigator.push({
                    component: Login,
                    passProps: {navigator:this.props.navigator,},
                })}>
                    <View style={{width:DEVICE_WIDTH/3}} />
                    <View style={{width:DEVICE_WIDTH/8,alignItems:'center',}}>
                        <Icon name={'fa-user'} size={30} color={login_color}/>
                    </View>
                    <Text>{I18n.t('login')}</Text>
                </TouchableOpacity>
            )
    }
    render(){
        var DEVICE_WIDTH = Dimensions.get('window').width
	//alert('w:'+DEVICE_WIDTH)
        return (
          <View style={Style.main}>
              <NavigationBar style={Style.navbar} title={{title:I18n.t('settings'),tintColor:Style.font_colors.enabled}} />
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
                  <TouchableOpacity style={Style.left_card} onPress={()=> this.help()}>
                      <View style={{width:DEVICE_WIDTH/3}} />
                      <View style={{width:DEVICE_WIDTH/8,alignItems:'center',}}>
                          <Icon name={'fa-question-circle'} size={30}/>
                      </View>
                      <Text>{I18n.t('help')}</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={Style.left_card} onPress={()=> this.about()}>
                      <View style={{width:DEVICE_WIDTH/3}} />
                      <View style={{width:DEVICE_WIDTH/8,alignItems:'center',}}>
                          <Icon name={'fa-info-circle'} size={30}/>
                      </View>
                      <Text>{I18n.t('about')}</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={Style.left_card} onPress={()=> this.props.navigator.push({
                      component: MapSettings,
                      passProps: {navigator:this.props.navigator,},
                  })}>
                      <View style={{width:DEVICE_WIDTH/3}} />
                      <View style={{width:DEVICE_WIDTH/8,alignItems:'center',}}>
                          <Icon name={'ion-ios-map'} size={35}/>
                      </View>
                      <Text>{I18n.t('map')+' '+I18n.t('settings')}</Text>
                  </TouchableOpacity>
                  {this.renderFeed()}
                  {this.renderUSB()}
                  {this.renderBLE()}
                  {this.renderLogin()}
              </ScrollView>
          </View>
        );
    }
}

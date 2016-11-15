'use strict';
import React, { Component } from 'react'
import {Dimensions, NativeModules, View, Text, StyleSheet, ScrollView, TouchableOpacity, } from 'react-native'
import Login from './Login'
//import LoginSettings from './LoginSettings'
import Net from '../io/Net'
import Style from './Style'
import ListJson from './ListJson'
import PushList from './PushList'
//import FeedList from './FeedList'
//import UsbList from './UsbList'
//import BleList from './BleList'
import MapSettings from './MapSettings'
import About from './About'
import Help from './Help'
import Store from '../io/Store'
import Global from '../io/Global'
import NavigationBar from 'react-native-navbar'
//import CodePush from "react-native-code-push"
import {Icon} from './Icon'
import I18n from 'react-native-i18n';
import Button from 'apsl-react-native-button'

export default class SettingsList extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
      };
    }
    componentWillMount(){
        //I18n.locale = NativeModules.RNI18n.locale  //en_US,zh_CN,fr_FR
    }
    componentDidMount(){
        //CodePush.notifyApplicationReady();
    }
    checkUpdate(){
        /*CodePush.checkForUpdate().then( (update) =>{
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
        })*/
    }
    about(){
        this.props.navigator.push({
            component: About,
            passProps: {navigator:this.props.navigator,},
        })
    }
    help(){
        this.props.navigator.push({
            component: Help,
            passProps: {navigator:this.props.navigator,},
        })
    }
    renderFeed(){
        //if(Global.mainlogin=='fb:weixing.sun@gmail.com'){
        var DEVICE_WIDTH = Dimensions.get('window').width
        return (
                  <TouchableOpacity style={Style.left_card} onPress={()=> this.props.navigator.push({
                      component: FeedList,
                      passProps: {navigator:this.props.navigator,},
                  })}>
                      <View style={{width:DEVICE_WIDTH/3}} />
                      <View style={{width:DEVICE_WIDTH/8,alignItems:'center',}}>
                          <Icon name={'fa-rss-square'} size={30}/>
                      </View>
                      <Text>{I18n.t('feed')+' '+I18n.t('settings')}</Text>
                  </TouchableOpacity>
        )
        //}
    }
    renderPush(){
        //if(Global.mainlogin=='fb:weixing.sun@gmail.com'){
        var DEVICE_WIDTH = Dimensions.get('window').width
        return (
                  <TouchableOpacity style={Style.left_card} onPress={()=> this.props.navigator.push({
                      component: PushList,
                      passProps: {navigator:this.props.navigator,},
                  })}>
                      <View style={{width:10}} />
                      <View style={{width:30}}><Icon name={'fa-bell'} size={20}/></View>
                      <View style={{width:10}} />
                      <View style={{flex:1}}><Text>{I18n.t('push')+' '+I18n.t('settings')}</Text></View>
                      <Icon name={'ion-ios-arrow-forward'} size={20} color={'#e5e5e5'}/>
                      <View style={{width:10}} />
                  </TouchableOpacity>
        )
        //}
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
        let login_color = Global.mainlogin.length>0?Style.highlight_color:'grey'
        return (
                <TouchableOpacity style={Style.left_card} onPress={()=> this.props.navigator.push({
                    component: Login,
                    passProps: {navigator:this.props.navigator,},
                })}>
                      <View style={{width:10}} />
                      <View style={{width:30}}><Icon name={'fa-user'} size={20} color={login_color}/></View>
                      <View style={{width:10}} />
                      <View style={{flex:1}}><Text>{I18n.t('login')+' '+I18n.t('settings')}</Text></View>
                      <Icon name={'ion-ios-arrow-forward'} size={20} color={'#e5e5e5'}/>
                      <View style={{width:10}} />
                  </TouchableOpacity>
            )
    }
    renderUpdate(){
        return null
        var DEVICE_WIDTH = Dimensions.get('window').width
        if(Global.mainlogin=='fb:weixing.sun@gmail.com'){
        return (
            <TouchableOpacity style={Style.left_card} onPress={()=> this.checkUpdate()} >
                <View style={{width:DEVICE_WIDTH/3}} />
                <View style={{width:DEVICE_WIDTH/8,alignItems:'center',}}>
                    <Icon name={'ion-ios-arrow-up'} size={35}/>
                </View>
                <Text>{I18n.t('update')}</Text>
            </TouchableOpacity>
        )
        }
    }
    renderAddIcon(){
      return <Button style={{height:41,width:50,borderColor:Style.highlight_color}} />
    }
    render(){
        var DEVICE_WIDTH = Dimensions.get('window').width
	//alert('w:'+DEVICE_WIDTH)
        return (
          <View style={Style.main}>
              <NavigationBar 
                  style={Style.navbar} 
                  title={{title:I18n.t('settings'),
                  tintColor:Style.font_colors.enabled}}
                  rightButton={
                      <View style={{flexDirection:'row', alignItems:'center', justifyContent:'center'}}>
                          {this.renderAddIcon()}
                      </View>
                  }
              />
              <ScrollView
                  //automaticallyAdjustContentInsets={false}
                  //scrollEventThrottle={200}
              >
                  {this.renderUpdate()}
                  <TouchableOpacity style={Style.left_card} onPress={()=> this.help()}>
                      <View style={{width:10}} />
                      <View style={{width:30}}><Icon name={'fa-question-circle'} size={20}/></View>
                      <View style={{width:10}} />
                      <View style={{flex:1}}><Text>{I18n.t('help')}</Text></View>
                      <Icon name={'ion-ios-arrow-forward'} size={20} color={'#e5e5e5'}/>
                      <View style={{width:10}} />
                  </TouchableOpacity>
                  <TouchableOpacity style={Style.left_card} onPress={()=> this.about()}>
                      <View style={{width:10}} />
                      <View style={{width:30}}><Icon name={'fa-info-circle'} size={20}/></View>
                      <View style={{width:10}} />
                      <View style={{flex:1}}><Text>{I18n.t('about')}</Text></View>
                      <Icon name={'ion-ios-arrow-forward'} size={20} color={'#e5e5e5'}/>
                      <View style={{width:10}} />
                  </TouchableOpacity>
                  <TouchableOpacity style={Style.left_card} onPress={()=> this.props.navigator.push({
                      component: MapSettings,
                      passProps: {navigator:this.props.navigator,},
                  })}>
                      <View style={{width:10}} />
                      <View style={{width:30}}><Icon name={'fa-globe'} size={20}/></View>
                      <View style={{width:10}} />
                      <View style={{flex:1}}><Text>{I18n.t('map')+' '+I18n.t('settings')}</Text></View>
                      <Icon name={'ion-ios-arrow-forward'} size={20} color={'#e5e5e5'}/>
                      <View style={{width:10}} />
                  </TouchableOpacity>
                  {this.renderLogin()}
                  {this.renderPush()}
              </ScrollView>
          </View>
        );
        //{this.renderUSB()}
        //{this.renderBLE()}
    }
}

'use strict';
import React, { Component } from 'react'
import {View, Text, StyleSheet, ScrollView, TouchableOpacity, } from 'react-native'
import LoginGG from './LoginGG'
import LoginFB from './LoginFB'
import LoginWX from './LoginWX'
import LoginWB from './LoginWB'
import Style from './Style'
import APIList from './APIList'
import Settings from './Settings'
//import MapSettings from './MapSettings'
import Store from '../io/Store'
import NavigationBar from 'react-native-navbar'
import CodePush from "react-native-code-push"
import {Icon} from './Icon'

export default class SettingsList extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
          user_fb:null,
          user_gg:null,
          user_wx:null,
          user_wb:null,
      };
      this.login_fb  = this.login_fb.bind(this);
      this.logout_fb = this.logout_fb.bind(this);
      this.login_gg  = this.login_gg.bind(this);
      this.logout_gg = this.logout_gg.bind(this);
      this.login_wx  = this.login_wx.bind(this);
      this.logout_wx = this.logout_wx.bind(this);
      this.login_wb  = this.login_wb.bind(this);
      this.logout_wb = this.logout_wb.bind(this);
    }
    componentWillMount(){
        this.getUserDB();
    }
    getUserDB() {
        Store.get('user_fb').then((value) => {
            this.setState({ user_fb:value });
           //console.log('getFBUserDB:'+JSON.stringify(value));
        });
        Store.get('user_gg').then((value) => {
            this.setState({ user_gg:value });
           //console.log('getGGUserDB:'+JSON.stringify(value));
        });
        Store.get('user_wx').then((value) => {
            this.setState({ user_wx:value });
           //console.log('getWXUserDB:'+JSON.stringify(value));
        });
    }
    checkUpdate(){
      //CodePush.sync()
        CodePush.checkForUpdate().then( (update) =>{
            if( !update ){
                console.log("app is latest version:"+JSON.stringify(update));
            }else {
                console.log("there is an update:"+JSON.stringify(update));
                //CodePush.sync({ updateDialog: true, installMode: CodePush.InstallMode.IMMEDIATE });
            }
        });
    }
    about(){
        CodePush.getCurrentPackage().then((update) => {
           // If the current app "session" represents the first time
           // this update has run, and it had a description provided
           // with it upon release, let's show it to the end user
           console.log("current app version:"+JSON.stringify(update));
           if (update.isFirstRun && update.description) {
               // Display a "what's new?" modal
           }
        });
    }

    componentDidMount(){
        CodePush.notifyApplicationReady();
    }
    login_gg(user){
        this.setState({user_gg:user});
    }
    logout_gg(user){
        this.setState({user_gg:null});
    }
    login_fb(user){
        this.setState({user_fb:user});
    }
    logout_fb(user){
        this.setState({user_fb:null});
    }
    login_wx(user){
        this.setState({user_wx:user});
    }
    logout_wx(user){
        this.setState({user_wx:null});
    }
    login_wb(user){
        this.setState({user_wb:user});
    }
    logout_wb(user){
        this.setState({user_wb:null});
    }
    render(){
        return (
          <View>
              <NavigationBar style={Style.navbar} title={{title:'Share',}} />
              <View style={Style.map}>
                <ScrollView style={Style.scrollview}>
                  <TouchableOpacity style={Style.left_card} onPress={()=> this.checkUpdate()} >
                      <View style={{width:Style.DEVICE_WIDTH/3}} />
                      <View style={{width:Style.DEVICE_WIDTH/8,alignItems:'center',}}>
                          <Icon name={'ion-ios-arrow-up'} size={35}/>
                      </View>
                    <Text>Update</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={Style.left_card} onPress={()=> this.about()}>
                      <View style={{width:Style.DEVICE_WIDTH/3}} />
                      <View style={{width:Style.DEVICE_WIDTH/8,alignItems:'center',}}>
                          <Icon name={'fa-info-circle'} size={30}/>
                      </View>
                    <Text>About</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={Style.left_card} onPress={()=> this.props.navigator.push({
                      component: Settings,
                      passProps: {navigator:this.props.navigator,},
                  })}>
                      <View style={{width:Style.DEVICE_WIDTH/3}} />
                      <View style={{width:Style.DEVICE_WIDTH/8,alignItems:'center',}}>
                          <Icon name={'ion-ios-cog-outline'} size={35}/>
                      </View>
                      <Text>Settings</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={Style.left_card} onPress={()=> this.props.navigator.push({
                      component: APIList,
                      passProps: {navigator:this.props.navigator,},
                  })}>
                      <View style={{width:Style.DEVICE_WIDTH/3}} />
                      <View style={{width:Style.DEVICE_WIDTH/8,alignItems:'center',}}>
                          <Icon name={'fa-plug'} size={30}/>
                      </View>
                      <Text>API List</Text>
                  </TouchableOpacity>
                  <View style={Style.left_card}>
                    <LoginGG user={this.state.user_gg} login={this.login_gg} logout={this.logout_gg} />
                  </View>
                  <View style={Style.left_card}>
                    <LoginFB user={this.state.user_fb} login={this.login_fb} logout={this.logout_fb} />
                  </View>
              </ScrollView>
            </View>
          </View>
        );
    }
}
/*
                  <View style={Style.left_card}>
                    <LoginWX user={this.state.user_wx} login={this.login_wx} logout={this.logout_wx} />
                  </View>
                  <View style={Style.left_card}>
                    <LoginWB user={this.state.user_wb} login={this.login_wb} logout={this.logout_wb} />
                  </View>
*/

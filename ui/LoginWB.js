'use strict';
import React, { Component } from 'react'
import {Alert, Platform,StyleSheet, Text, View, TouchableHighlight, Image, NativeModules } from 'react-native'
import {Icon} from './Icon'
import Style from "./Style"
import Store from "../io/Store"
import * as WeiboAPI from 'react-native-weibo'
import I18n from 'react-native-i18n';
import {checkPermission,requestPermission} from 'react-native-android-permissions';

var Login = React.createClass({
    getInitialState(){
        return {grantedPermissions:{} };
    },
    componentDidMount() {
        this.permission();
    },
    singlePermission(name){
        requestPermission('android.permission.'+name).then((result) => {
          //console.log(name+" Granted!", result);
          let perm = this.state.grantedPermissions;
          perm[name] = true
          this.setState({grantedPermissions:perm})
        }, (result) => {
          //alert('Please grant location permission in settings')
        });
    },
    permission(){
        if(Platform.OS === 'android' && Platform.Version > 22){
            this.singlePermission('READ_PHONE_STATE')
            //this.singlePermission('ACCESS_COARSE_LOCATION')
        }
    },
  renderLoginButton() {
    if(this.props.user !== null){
        return <Icon name={'fa-weibo'} size={30} color="#dd4b39" onPress={this._signOut} />
    }else{
        return <Icon name={'fa-weibo'} size={30} color="#dddddd" onPress={this._signIn} />
    }
  },
  renderLoginName() {
    var name = I18n.t('login')+' '+I18n.t('wb');
    if(this.props.user !== null ){
       name=this.props.user.name;
    }
    return <View key='user_wb'><Text>{name}</Text></View>
  },
  saveUserDB(data) {
    //console.log('saveUserDB:'+JSON.stringify(data));
    Store.save('user_wb', data);
  },
  logout(){
    Store.delete('user_wb');
    this.props.logout()
  },
  deleteUserDB() {
    Store.delete('user_wb');
  },
  _signIn() {
    //READ_PHONE_STATE
    WeiboAPI.login().then((data) => {
      console.log('loginWB:'+JSON.stringify(data));
      //this.setState({user: {id:data.id, name:data.name, email:data.email, type:'gg', token:data.serverAuthCode}});
      var user = {id:data.id, name:data.name, email:data.email, type:'wb', token:data.serverAuthCode}
      this.saveUserDB(user);
      this.props.login(user);
    }).catch((err) => {
      console.log('WRONG SIGNIN', err);
    }).done();
  },
  _signOut() {
    Alert.alert(
        "Logout",
        "Do you want to logout from Weibo?",
        [
          {text:"Cancel", onPress:()=>console.log("")},
          {text:"OK", onPress:()=>{
              //this.logout()
          }},
        ]
    );
  },
  render(){
    return (
        <View style={{flexDirection:'row', alignItems: 'center',}}>
          <View style={{width:Style.DEVICE_WIDTH/3}} />
          <View style={{width:Style.DEVICE_WIDTH/8,alignItems:'center',}}>
              {this.renderLoginButton()}
          </View>
          {this.renderLoginName()}
        </View>
    );
  }
});

module.exports = Login;

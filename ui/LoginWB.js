'use strict';
import React, { Component } from 'react'
import {Alert, Platform, StyleSheet, Text, View, TouchableHighlight, TouchableOpacity, Image, NativeModules } from 'react-native'
import {Icon} from './Icon'
import Style from "./Style"
import Store from "../io/Store"
import * as WeiboAPI from 'react-native-weibo'
import I18n from 'react-native-i18n';

var Login = React.createClass({
    getInitialState(){
        return {}
    },
    componentDidMount() {
        //this.permission();
    },
  renderLoginButton() {
    if(this.props.user != null){
        return <Icon name={'fa-weibo'} size={22} color="#dd4b39" onPress={this._signOut} />
    }else{
        return <Icon name={'fa-weibo'} size={22} color="#dddddd" onPress={this._signIn} />
    }
  },
  renderLoginName() {
    var onPress=this._signIn
    var name = I18n.t('login')+' '+I18n.t('wb');
    if(this.props.user != null ){
       name=this.props.user.name;
       onPress=this._signOut
    }
    return <View key='user_wb'><Text onPress={onPress}>{name}</Text></View>
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
  showUser(uid,token){
      var _this = this;
      let api = 'https://api.weibo.com/users/show.json?access_token='+token+'&uid='+uid
      let email_api = 'https://api.weibo.com/account/profile/email.json?access_token='+token+'&uid='+uid
      fetch(api)
        .then((response) => response.json())
        .then((responseData) => {
            //console.log(responseData)
            var _user={
              id : responseData.id,
              name : responseData.name,
              email: responseData.id,     //email
              gender: responseData.gender,
              type: 'wb',
              token: token,
              //expire: data.credentials.tokenExpirationDate,
            };
            //alert(JSON.stringify(_user))
            _this.setState({ user : _user });
            _this.saveUserDB(_user);
            _this.props.login(_user);
        }).done();
  },
  _signIn() {
    let self=this
    let appKey = 964503517
    if(Platform.OS==='ios') appKey=177728027
    let config = {scope:'all',redirectURI:'http://www.weibo.com',appid:appKey}
    WeiboAPI.login(config).then((data) => {
      //alert('loginWB:'+JSON.stringify(data)); //{type,errCode,refreshToken,userID,expirationDate,accessToken}
      //var user = {id:data.id, name:data.name, email:data.email, type:'wb', token:data.serverAuthCode}
      self.showUser(data.userID,data.accessToken);
    }).catch((err) => {
      console.log('WeiboAPI.login() err:', err);
    }).done();
  },
  _signOut() {
    Alert.alert(
        "Logout",
        "Do you want to logout from Weibo?",
        [
          {text:"Cancel", onPress:()=>console.log("")},
          {text:"OK", onPress:()=>{
              this.logout()
          }},
        ]
    );
  },
  _share(txt){//
    let data = {type:'text', text:txt}
    WeiboAPI.share(data)
  },
  render(){
    return (
        <TouchableOpacity style={Style.left_card} onPress={this.onPress}>
            <View style={{width:10}} />
            <View style={{width:30}}>{this.renderLoginButton()}</View>
            <View style={{width:10}} />
            <View style={{flex:1}}>{this.renderLoginName()}</View>
            <Icon name={'ion-ios-arrow-forward'} size={20} color={'#e5e5e5'}/>
            <View style={{width:10}} />
        </TouchableOpacity>
    );
  }
});

module.exports = Login;

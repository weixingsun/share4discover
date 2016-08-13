'use strict';
import React, { Component } from 'react'
import {Alert, Platform,StyleSheet, Text, View, TouchableHighlight, Image, NativeModules } from 'react-native'
import {Icon} from './Icon'
import Style from "./Style"
import Store from "../io/Store"
import * as WeiboAPI from 'react-native-weibo'
//UsersAPI
import I18n from 'react-native-i18n';
import {checkPermission,requestPermission} from 'react-native-android-permissions';

var Login = React.createClass({
    getInitialState(){
        return {grantedPermissions:{} };
    },
    componentDidMount() {
        //this.permission();
    },
    /*singlePermission(name){
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
    },*/
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
    //let config = {scope:'all',redirectURI:'https://api.weibo.com/oauth2/default.html'}
    WeiboAPI.login().then((data) => {
      //alert('loginWB:'+JSON.stringify(data)); //{type,errCode,refreshToken,userID,expirationDate,accessToken}
      //var user = {id:data.id, name:data.name, email:data.email, type:'wb', token:data.serverAuthCode}
      self.showUser(data.userID,data.accessToken);
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
              this.logout()
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

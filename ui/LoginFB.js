'use strict';
import React, { Component } from 'react'
import {Alert, StyleSheet, Text, View, TouchableHighlight, Image, NativeModules } from 'react-native'
import FBSDK,{LoginManager,AccessToken,ShareApi} from 'react-native-fbsdk'
import I18n from 'react-native-i18n'
import {Icon} from './Icon'
import Style from "./Style"
import Store from "../io/Store"
import Global from '../io/Global'

var Login = React.createClass({
  getInitialState: function(){
    return {
      user: this.props.user,
      gray: '#dddddd',
      blue: '#425bb4',
    };
  },
  onPress: function(){
    this.state.user? this.handleLogout():this.handleLogin()
  },
  handleLogin: function(){
    var _this = this;
    if(Global.SETTINGS_LOGINS.fb===Global.none){
        LoginManager.logInWithReadPermissions(['public_profile']).then(  //'email', 'user_friends', 'public_profile'
          function(result) {
            if (result.isCancelled) {
            } else {
              let token = AccessToken.getCurrentAccessToken()
              //alert('Login success token='+token+' with permissions:'+result.grantedPermissions.toString())
              AccessToken.getCurrentAccessToken().then(
                data => {
                  //alert(JSON.stringify(data)) //{accessToken,permissions,declinedPermissions,applicationID,accessTokenSource,userID,expirationTime,lastRefreshTime}
                  _this.setState({ user : data});
                  _this._facebookSignIn(data);
                }
              );
            }
          },
          function(error) {
            alert('Login fail with error: ' + error);
          }
        );
    }else{
      //alert('post')
      LoginManager.logInWithPublishPermissions(['publish_actions']).then(
        function(result) {
          if (result.isCancelled) {
            //alert('Login cancelled');
          } else {
            let token = AccessToken.getCurrentAccessToken()
            //alert('Login success token='+token+' with permissions:'+result.grantedPermissions.toString())
            AccessToken.getCurrentAccessToken().then(
              data => {
                  //alert(JSON.stringify(data)) //{accessToken,permissions,declinedPermissions,applicationID,accessTokenSource,userID,expirationTime,lastRefreshTime}
                  _this.setState({ user : data});
                  _this._facebookSignIn(data);
              }
            );
          }
        },
        function(error) {
          alert('Login fail with error: ' + error);
        }
      );
    }
  },
  handleLogout: function(){
    this.logout()
  },
  renderLoginButton(){
    var color = this.state.user? this.state.blue : this.state.gray ;
    return  (
        <Icon name={'fa-facebook-official'} size={35} color={color} onPress={this.onPress} />
      );
  },
  renderLoginName() {
    //console.log('renderFacebook:name:'+JSON.stringify(this.props.user));
    var name = I18n.t('login')+' '+I18n.t('fb');
    if(this.props.user != null ){ //&& this.props.user.type === 'fb'){
         name = this.props.user.name;
    }
    return (<View key='user_fb'><Text onPress={this.onPress}>{name}</Text></View>);
  },
  saveUserDB(data) {
    //console.log('saveUserDB:'+JSON.stringify(data));
    Store.save('user_fb', data);
  },
  logout(){
    Alert.alert(
        I18n.t('logout'),
        I18n.t('ask_logout')+I18n.t('fb')+'?',
        [
          {text:I18n.t('cancel'), onPress:()=>console.log("")},
          {text:I18n.t('ok'), onPress:()=>{
              Store.delete('user_fb');
              LoginManager.logOut();
              this.setState({ user : null});
              this.props.logout()
          }},
        ]
    );
  },
  deleteUserDB() {
    Store.delete('user_fb');
  },
  _facebookSignIn(data) {
    /*if(data.hasOwnProperty('profile')){ //Android get all info in 1 time
        //alert('android:'+JSON.stringify(data))
        var profile = data.profile
        var token = data.profile.token
        var expire = data.profile.tokenExpirationDate
        if(typeof data.profile === "string"){
            profile = JSON.parse(data.profile);
            token = profile.token
            expire = profile.tokenExpirationDate
            if(token == null){
                token = data.credentials.token
                expire= data.credentials.tokenExpirationDate
            }
        }
        var _user={
            id: profile.id,
            name: profile.name,
            email: profile.email,
            gender: profile.gender,
            type: 'fb',
            token: token,
            expire: expire,
        };
        this.setState({ user: _user, });
        this.saveUserDB(this.state.user);
        this.props.login(_user)
        console.log('facebook_user:'+JSON.stringify(_user)); //this.state.user
    }else{*/
      //data={accessToken,permissions,declinedPermissions,applicationID,accessTokenSource,userID,expirationTime,lastRefreshTime}
      var _this = this;
      var api = `https://graph.facebook.com/${data.userID}?fields=name,email,gender,locale&access_token=${data.accessToken}`;
      fetch(api)
        .then((response) => response.json())
        .then((responseData) => {
            console.log(responseData)
            
            var _user={
              id : responseData.id,
              name : responseData.name,
              email: responseData.email,
              gender: responseData.gender,
              type: 'fb',
              token: data.accessToken,
	      expire: data.expirationTime.toString(),
            };
            _this.setState({ user : _user });
            _this.saveUserDB(_user);
            _this.props.login(_user);
        }).done();
  },
  render(){
    return (
        <View style={{flexDirection:'row',alignItems: 'center',}}>
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

'use strict';
import React, { Component } from 'react'
import {Alert, StyleSheet, Text, View, TouchableHighlight, Image, NativeModules } from 'react-native'
import FBSDK,{LoginManager,AccessToken,ShareApi} from 'react-native-fbsdk'
import I18n from 'react-native-i18n'
import {Icon} from './Icon'
import Style from "./Style"
import Store from "../io/Store"
import Global from '../io/Global'
//import LoginFBOfficial from './LoginFBOfficial'
//import LoginFBNonOfficial from './LoginFBNonOfficial'

var Login = React.createClass({
  renderLoginButton(){
    var _this=this;
    return  (
        <LoginFBOfficial style={{ marginBottom: 10, }}
          onPress={function(){
            //console.log("FBLoginMock clicked.");
          }}
          onLogin={function(data){
            console.log("FBLoginMock logged in!");
            _this._facebookSignIn(data);
          }}
          onLogout={function(){
            console.log("FBLoginMock logged out.");
            _this.logout();
          }}
	  user={this.props.user}
        />
      );
  },
/*
      <FBLogin
          buttonView={<FBLoginView user={this.props.user} />}
          permissions={["email","user_friends"]}
          loginBehavior={NativeModules.FBLoginManager.LoginBehaviors.Native}
          //loginBehavior={NativeModules.FBLoginManager.LoginBehaviors.Web}
          onLogin={function(data){
              _this._facebookSignIn(data);
          }}
          onLoginFound={function(data){
              console.log('FB:onLoginFound:'+JSON.stringify(data));
              //_this.setState({user: null });
          }}
          onLoginNotFound={function(data){
              //console.log('FB:onLoginNotFound:'+JSON.stringify(data));
              //_this.setState({user: null });
          }}
          onLogout={function(data){
              _this.logout();
          }}
          onCancel={function(e){console.log(e)}}
          onPermissionsMissing={function(e){
              console.log("onPermissionsMissing:")
              console.log(e)
          }}
      />
*/
  renderLoginName() {
    //console.log('renderFacebook:name:'+JSON.stringify(this.props.user));
    var name = I18n.t('login')+' '+I18n.t('fb');
    if(this.props.user != null ){ //&& this.props.user.type === 'fb'){
         name = this.props.user.name;
    }
    return (<View key='user_fb'><Text>{name}</Text></View>);
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

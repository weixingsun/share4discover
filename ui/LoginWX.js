'use strict';
import React, { Component } from 'react'
import {Alert, StyleSheet, Text, View, TouchableHighlight, Image, NativeModules } from 'react-native'
import {Icon} from './Icon'
import FBLogin from 'react-native-facebook-login'
import {GoogleSignin, GoogleSigninButton} from 'react-native-google-signin'
import Style from "./Style"
import Store from "../io/Store"
import FBLoginView from "./FBLoginView"
import I18n from 'react-native-i18n';

var Login = React.createClass({
  renderLoginButton() {
    if(this.props.user !== null){
        return <Icon name={'fa-weixin'} size={30} color="#4ddb39" onPress={this._googleSignOut} />
    }else{
        //return (<GoogleSigninButton style={{width: 44, height: 44}} size={GoogleSigninButton.Size.Icon} color={GoogleSigninButton.Color.Dark} onPress={this._googleSignIn}/> );
        return <Icon name={'fa-weixin'} size={30} color="#dddddd" onPress={this._googleSignIn} />
    }
  },
  renderLoginName() {
    //console.log('LoginGG.renderLoginName:'+JSON.stringify(this.props.user));
    var name = I18n.t('login')+' '+I18n.t('wx');
    if(this.props.user !== null ){
       name=this.props.user.name;
    }
    return <View key='user_wx'><Text>{name}</Text></View>
  },
  saveUserDB(data) {
    //console.log('saveUserDB:'+JSON.stringify(data));
    Store.save('user_wx', data);
  },
  logout(){
    Store.delete('user_wx');
    this.props.logout()
  },
  deleteUserDB() {
    Store.delete('user_wx');
  },
  _googleSignIn() {
    GoogleSignin.signIn().then((data) => {
      console.log('loginWX:'+JSON.stringify(data));
      //this.setState({user: {id:data.id, name:data.name, email:data.email, type:'gg', token:data.serverAuthCode}});
      var user = {id:data.id, name:data.name, email:data.email, type:'wx', token:data.serverAuthCode}
      this.saveUserDB(user);
      this.props.login(user);
    }).catch((err) => {
      console.log('WRONG SIGNIN', err);
    }).done();
  },
  _googleSignOut() {
    Alert.alert(
        "Logout",
        "Do you want to logout from Google?",
        [
          {text:"Cancel", onPress:()=>console.log("")},
          {text:"OK", onPress:()=>{
              GoogleSignin.revokeAccess().then(() => GoogleSignin.signOut()).then(() => {
                this.logout()
              }).done();
          }},
        ]
    );
  },
  componentDidMount() {
    //https://developers.google.com/identity/protocols/googlescopes
    var deb_ios_id = '840928054415-qc4abj1mu0l2k6e86n30of3gktig10id.apps.googleusercontent.com';
    var deb_web_id = '840928054415-nbk5fsk6n3sfrl3urj5bmpobhsq3ff42.apps.googleusercontent.com';
    var rel_ios_id = '562005031552-0c7t5d6m39g0pu50pibll1bdkr5aag9r.apps.googleusercontent.com';
    var rel_web_id = '562005031552-0090s2j3muc1mkelqmokg2is1oqahajj.apps.googleusercontent.com';
    var ios_id=rel_ios_id;
    var web_id=rel_web_id;
    if (__DEV__) {
        web_id=deb_web_id;
        ios_id=deb_ios_id;
    }
    GoogleSignin.configure({
      scopes: ['https://www.googleapis.com/auth/plus.login','https://www.googleapis.com/auth/calendar'],
      iosClientId: ios_id,
      //webClientId: '840928054415-nbk5fsk6n3sfrl3urj5bmpobhsq3ff42.apps.googleusercontent.com',  //stone-botany-480
      webClientId: web_id,
      //AndroidClientId: '562005031552-0c7t5d6m39g0pu50pibll1bdkr5aag9r.apps.googleusercontent.com',
      offlineAccess: false,
    });

    /*GoogleSignin.currentUserAsync().then((data) => {
      console.log('gg user:'+data);
      if(data !== null){
        //if(this.state.user === null)
          this.setState({user: {id:data.id, name:data.name, email:data.email, type:'gg', token:data.serverAuthCode} });
      }
    }).done();*/
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

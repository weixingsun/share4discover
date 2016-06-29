'use strict';
import React, { Component } from 'react'
import {Alert, StyleSheet, Text, View, TouchableHighlight, Image, NativeModules } from 'react-native'
import {Icon} from './Icon'
import Style from "./Style"
import Store from "../io/Store"
import * as WeiboAPI from 'react-native-weibo'

var Login = React.createClass({
  renderLoginButton() {
    if(this.props.user !== null){
        return <Icon name={'fa-weibo'} size={30} color="#dd4b39" onPress={this._signOut} />
    }else{
        return <Icon name={'fa-weibo'} size={30} color="#dddddd" onPress={this._signIn} />
    }
  },
  renderLoginName() {
    var name = 'Login in Weibo';
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
  componentDidMount() {
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

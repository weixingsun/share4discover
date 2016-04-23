'use strict';
import React, {Alert, StyleSheet, Text, View, TouchableHighlight, Image, NativeModules } from 'react-native'
//import FIcon from 'react-native-vector-icons/FontAwesome'
import IIcon from 'react-native-vector-icons/Ionicons'
import FBLogin from 'react-native-facebook-login'
import {GoogleSignin, GoogleSigninButton} from 'react-native-google-signin'
import Style from "./Style"
import Store from "../io/Store"
import FBLoginView from "./FBLoginView"

var Login = React.createClass({
  renderLoginButton(){
    var _this=this;
    return  (
              <FBLogin
                buttonView={<FBLoginView user={this.props.user} />}
                permissions={["email","user_friends"]}
                loginBehavior={NativeModules.FBLoginManager.LoginBehaviors.Native}
                //loginBehavior={NativeModules.FBLoginManager.LoginBehaviors.Web}
                onLogin={function(data){
                  _this._facebookSignIn(data);
                }}
                onLoginFound={function(data){
                  console.log('FB:onLoginFound:');
                  console.log(data);
                  //_this.setState({user: null });
                }}
                onLoginNotFound={function(data){
                  console.log('FB:onLoginNotFound:');
                  console.log(data);
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
      );
  },
  renderLoginName() {
    console.log('renderFacebook:name:'+JSON.stringify(this.props.user));
    var name = 'Login in Facebook'
    if(this.props.user !== null ){ //&& this.props.user.type === 'fb'){
         name = this.props.user.name;
    }
    return (<View key='user_fb'><Text>{name}</Text></View>);
  },
  saveUserDB(data) {
    //console.log('saveUserDB:'+JSON.stringify(data));
    Store.save('user_fb', data);
  },
  logout(){
    Store.delete('user_fb');
    this.props.logout()
  },
  deleteUserDB() {
    Store.delete('user_fb');
  },
  _facebookSignIn(data) {
    console.log('facebook login:')
    console.log(data)
    if(data.hasOwnProperty('profile')){ //Android get all info in 1 time
        var _user={
            id: data.profile.id,
            name: data.profile.name,
            email: data.profile.email,
            gender: data.profile.gender,
            type: 'fb',
            token: data.token,
        };
        this.setState({ user: _user, });
        this.saveUserDB(this.state.user);
        this.props.login(_user)
        //console.log('facebook_user:'+JSON.stringify(this.state.user));
    }else{      //iOS need fetch manually
      var _this = this;
      var api = `https://graph.facebook.com/v2.3/${data.credentials.userId}?fields=name,email,gender,locale&access_token=${data.credentials.token}`;
      fetch(api)
        .then((response) => response.json())
        .then((responseData) => {
          //console.log(responseData)
            var _user={
              id : responseData.id,
              name : responseData.name,
              email: responseData.email,
              gender: responseData.gender,
              type: 'fb',
              token: data.credentials.token,
            };
            _this.setState({ user : _user });
            _this.saveUserDB(_user);
            _this.props.login(_user);
        }).done();
    }
  },
  render(){
    return (
        <View style={{flexDirection:'row',}}>
        {this.renderLoginButton()}
        {this.renderLoginName()}
        </View>
    );
  }
});

module.exports = Login;

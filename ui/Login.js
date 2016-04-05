'use strict';
import React, {Alert, StyleSheet, Text, View, TouchableHighlight, Image, NativeModules } from 'react-native'
import Button from 'react-native-button'
//import FIcon from 'react-native-vector-icons/FontAwesome'
import IIcon from 'react-native-vector-icons/Ionicons'
import FBLogin from 'react-native-facebook-login'
import {GoogleSignin, GoogleSigninButton} from 'react-native-google-signin'
import Style from "./Style"
import Store from "../io/Store"
import FBLoginView from "./FBLoginView"

var Login = React.createClass({
  renderLoginGoogle() {
    //console.log('renderLoginGoogle:user='+JSON.stringify(this.state.user));
    if(this.state.user !== null && this.state.user.type ==='fb'){
        /*return (<View style={{justifyContent: 'center',}} key='fbuser'>
                  <Text>{this.state.user.name}</Text>
                </View>);*/
        return <Text>{this.state.user.name}</Text>
    }else if(this.state.user !== null && this.state.user.type ==='gg'){
        //console.log('renderGoogle:gg:'+JSON.stringify(this.state.user));
        return <IIcon.Button name={'social-google-outline'} size={20} backgroundColor="#dd4b39" onPress={this._googleSignOut} />
        //return <FIcon name={'google-plus-square'} size={20} backgroundColor="#dd4b39" onPress={this._googleSignOut} />
    }else{
        /*return ( <GoogleSigninButton style={{width: 44, height: 44}} size={GoogleSigninButton.Size.Icon} color={GoogleSigninButton.Color.Dark} onPress={this._googleSignIn}/> );*/
        return <IIcon.Button name={'social-google-outline'} size={20} backgroundColor="#dd4b39" onPress={this._googleSignIn} />
    }
  },
  renderLoginFacebook() {
    //console.log('renderFacebook:button:'+JSON.stringify(this.state.user));
    var _this = this;
    if(this.state.user !== null && this.state.user.type !== 'fb'){
      return (<View key='user'><Text>{this.state.user.name}</Text></View>);
    }else{
      return (
              <FBLogin
                buttonView={<FBLoginView />}
                permissions={["email","user_friends"]}
                loginBehavior={NativeModules.FBLoginManager.LoginBehaviors.Native}
                //loginBehavior={NativeModules.FBLoginManager.LoginBehaviors.Web}
                onLogin={function(data){
                  _this._facebookSignIn(data);
                }}
                //onLoginFound={function(data){
                  //console.log('FB:onLoginFound:');
                  //console.log(data);
                  //_this.setState({user: null });
                //}}
                onLogout={function(data){
                  _this.deleteUserDB();
                }}
                onCancel={function(e){console.log(e)}}
                onPermissionsMissing={function(e){
                  console.log("onPermissionsMissing:")
                  console.log(e)
                }}
              />
      );
    }
  },

  getUserDB() {
    Store.get('user').then((value) => {
      this.setState({ user:value });
      //console.log('getUserDB:'+JSON.stringify(value));
    });
  },
  saveUserDB(data) {
    //console.log('saveUserDB:'+JSON.stringify(data));
    Store.save('user', data);
  },
  deleteUserDB() {
    Store.delete('user');
    this.setState({ user:null });
  },

  _facebookSignIn(data) {
    //console.log(data)
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
        }).done();
    }
  },

  _googleSignIn() {
    GoogleSignin.signIn().then((data) => {
      //console.log(data);
      this.setState({user: {id:data.id, name:data.name, email:data.email, type:'gg', token:data.serverAuthCode}});
      this.saveUserDB(this.state.user);
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
                this.deleteUserDB();
              }).done();
          }},
        ]
    );
  },

  componentDidMount() {
    GoogleSignin.configure({
      scopes: ['https://www.googleapis.com/auth/calendar'],
      iosClientId: '840928054415-qc4abj1mu0l2k6e86n30of3gktig10id.apps.googleusercontent.com',  //oauth_client:1
      webClientId: '840928054415-nbk5fsk6n3sfrl3urj5bmpobhsq3ff42.apps.googleusercontent.com',  //oauth_client:3
      offlineAccess: false,
    });

    /*GoogleSignin.currentUserAsync().then((data) => {
      console.log('gg user:'+data);
      if(data !== null){
        //if(this.state.user === null)
          this.setState({user: {id:data.id, name:data.name, email:data.email, type:'gg', token:data.serverAuthCode} });
      }
    }).done();*/
    this.getUserDB();
  },
  getInitialState() {
    return {
      user: null
    };
  },

  render(){
    return (
            <View style={{flexDirection:'row',justifyContent: 'center',}}>
                { this.renderLoginGoogle() }
                <View style={{width:60}} />
                { this.renderLoginFacebook() }
            </View>
    );
  }
});

module.exports = Login;

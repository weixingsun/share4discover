'use strict';
var React = require('react-native');
var { StyleSheet, Text, View, TouchableHighlight, Image } = React;
import Button from 'react-native-button'
import FBLogin from 'react-native-facebook-login'
import {GoogleSignin, GoogleSigninButton} from 'react-native-google-signin'
import Style from "./Style"
import Store from "../io/Store"

var Login = React.createClass({
  renderLoginGoogle() {
    if(this.state.user !== null && this.state.user.type ==='fb'){
        //console.log('renderGoogle:fb:'+JSON.stringify(this.state.user));
        return (<View key='fbuser'>
                  <Text style={styles.username}>{this.state.user.name}</Text>
                </View>);
    }else if(this.state.user !== null && this.state.user.type ==='gg'){
        //console.log('renderGoogle:gg:'+JSON.stringify(this.state.user));
        return (<View key='gguser'>
                  <Button onPress={this._googleSignOut} style={{fontSize: 18, }} containerStyle={{borderRadius:5, backgroundColor: '#AA5555'}}>
                    Logout from Google
                  </Button>
                </View>);
    }else{
        //console.log('renderGoogle:else:'+JSON.stringify(this.state.user));
        return (
              <GoogleSigninButton
                  style={styles.login_button}
                  size={GoogleSigninButton.Size.Standard}
                  color={GoogleSigninButton.Color.Light}
                  onPress={this._googleSignIn}/>
      );
    }
  },
  renderLoginFacebook() {
    var _this = this;
    if(this.state.user !== null && this.state.user.type !== 'fb'){
      //console.log('renderFacebook:name:'+JSON.stringify(this.state.user));
      return (<View key='user'><Text style={styles.username}>{this.state.user.name}</Text></View>);
    }else{
      //console.log('renderFacebook:button:'+JSON.stringify(this.state.user));
      return (
              <FBLogin
                onLogin={function(data){
                  //console.log('FBLogin.onLogin:');
                  _this._facebookSignIn(data);
                }}
                onLoginFound={function(data){
                  console.log('FB:onLoginFound:'+data);
                  //_this.setState({user: null });
                }}
                onLogout={function(data){
                  //console.log('FB:onLogout:');
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
        this.saveUserDB(_user);
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
    GoogleSignin.revokeAccess().then(() => GoogleSignin.signOut()).then(() => {
      this.deleteUserDB();
    }).done();
  },

  componentDidMount() {
    GoogleSignin.configure({
      scopes: ['https://www.googleapis.com/auth/calendar'],
      //webClientId: '840928054415-qc4abj1mu0l2k6e86n30of3gktig10id.apps.googleusercontent.com',  //oauth_client:1
      iosClientId: '840928054415-qc4abj1mu0l2k6e86n30of3gktig10id.apps.googleusercontent.com',  //oauth_client:1
      webClientId: '840928054415-nbk5fsk6n3sfrl3urj5bmpobhsq3ff42.apps.googleusercontent.com',  //oauth_client:3
      offlineAccess: true
    });

    GoogleSignin.currentUserAsync().then((data) => {
      //console.log('componentDidMount():Check Google Login:', data);
      if(data !== null){
        if(this.state.user === null)
          this.setState({user: {id:data.id, name:data.name, email:data.email, type:'gg', token:data.serverAuthCode} });
      }
    }).done();
  },
  getInitialState() {
    return {
      user: null
    };
  },

  render(){
    return (
        <View style={styles.card}>
            <View style={styles.flex_box}>
                { this.renderLoginGoogle() }
            </View>
            <View style={styles.flex_box}>
                { this.renderLoginFacebook() }
            </View>
        </View>
    );
  }
});

var styles = {
  container: {
    flex: 1,
    backgroundColor: '#FFF',
  },
  navBar: {
    height: 60,
    padding: 6,
    backgroundColor: '#CCC'
  },
  row: {
    padding: 2,
    height: 68,
  },
  thumbnail: {
    width: 64,
    height: 64,
  },
  login_button: {
    alignItems: 'center',
    width: Style.LOGIN_BUTTON_WIDTH,
    height: Style.LOGIN_BUTTON_HEIGHT,
  },
};

module.exports = Login;

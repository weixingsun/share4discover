'use strict';
var React = require('react');
var ReactNative = require('react-native');
import {Icon} from './Icon'
//var {FBLoginManager} = require('react-native-facebook-login');
import FBSDK,{LoginManager,AccessToken,ShareApi} from 'react-native-fbsdk'
import Global from '../io/Global'

var {
  StyleSheet,
  Text,
  Image,
  View,
  TouchableHighlight,
  NativeModules,
} = ReactNative;

var FBLoginMock = React.createClass({
  propTypes: {
    user: React.PropTypes.shape({
        type:   React.PropTypes.string,  //.isRequired,
        id:     React.PropTypes.string,  //.isRequired,
        name:   React.PropTypes.string,
        email:  React.PropTypes.string,
        gender: React.PropTypes.string,
        token:  React.PropTypes.string,
        expire: React.PropTypes.number,
    }),
    style: View.propTypes.style,
    onPress: React.PropTypes.func,
    onLogin: React.PropTypes.func,
    onLogout: React.PropTypes.func,
  },

  getInitialState: function(){
    //if(FBLoginManager == null) FBLoginManager=NativeModules.FBLoginManager
    return {
      user: null,
      gray: '#dddddd',
      blue: '#425bb4',
    };
  },

  handleLogin: function(){
    var _this = this;
    /*FBLoginManager.loginWithPermissions(["email","user_friends"],function(error, data){
      if (!error) {
        _this.setState({ user : data});
        _this.props.onLogin && _this.props.onLogin(data);
      } else {
        console.log(error, data);
      }
    })*/
    if(Global.SETTINGS_LOGINS.fb=='read'){
        //alert('read')
        LoginManager.logInWithReadPermissions(['public_profile']).then(  //'email', 'user_friends', 'public_profile'
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
                  _this.props.onLogin && _this.props.onLogin(data);
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
                  _this.props.onLogin && _this.props.onLogin(data);
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
    var _this = this;
    /*FBLoginManager.logout(function(error, data){
      if (!error) {
        _this.setState({ user : null});
        _this.props.onLogout && _this.props.onLogout();
      } else {
        console.log(error, data);
      }
    })*/
    LoginManager.logOut();
    this.setState({ user : null});
    this.props.onLogout && _this.props.onLogout();
  },

  onPress: function(){
    this.props.user
      ? this.handleLogout()
      : this.handleLogin();

    this.props.onPress && this.props.onPress();
  },

  componentWillMount: function(){
//    var _this = this;
//    FBLoginManager.getCredentials(function(error, data){
//      if (!error) {
//        _this.setState({ user : data})
//      }
//    });
  },

  render: function() {
    //alert(JSON.stringify(this.props.user))
    var color = this.props.user? this.state.blue : this.state.gray ;
    //color = this.state.user!==null ? this.state.blue : this.state.gray ;
    return (
        <Icon name={'fa-facebook-official'} size={35} color={color} onPress={this.onPress} />
    );
  }
});
//<Image style={styles.FBLogo} source={require('./images/FB-f-Logo__white_144.png')} />
//<Text style={[styles.FBLoginButtonText, this.state.user ? styles.FBLoginButtonTextLoggedIn : styles.FBLoginButtonTextLoggedOut]} numberOfLines={1}>{text}</Text>

var styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  FBLoginButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',

    height: 30,
    width: 45,
    paddingLeft: 2,

    backgroundColor: 'rgb(66,93,174)',
    borderRadius: 3,
    borderWidth: 1,
    borderColor: 'rgb(66,93,174)',

    shadowColor: "#000000",
    shadowOpacity: 0.8,
    shadowRadius: 2,
    shadowOffset: {
      height: 1,
      width: 0
    },
  },
  FBLoginButtonText: {
    color: 'white',
    fontWeight: '600',
    fontFamily: 'Helvetica neue',
    fontSize: 14.2,
  },
  FBLoginButtonTextLoggedIn: {
    marginLeft: 5,
  },
  FBLoginButtonTextLoggedOut: {
    marginLeft: 18,
  },
  FBLogo: {
    position: 'absolute',
    height: 14,
    width: 14,

    left: 7,
    top: 7,
  },
});

module.exports = FBLoginMock;

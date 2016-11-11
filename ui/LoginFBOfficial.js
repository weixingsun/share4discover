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
        expire: React.PropTypes.string,
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
  },

  render: function() {
    //alert(JSON.stringify(this.props.user))
    var color = this.props.user? this.state.blue : this.state.gray ;
    return (
        <Icon name={'fa-facebook-official'} size={35} color={color} onPress={this.onPress} />
    );
  }
});

var styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

module.exports = FBLoginMock;

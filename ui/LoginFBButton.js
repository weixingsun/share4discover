'use strict';
var React = require('react');
var ReactNative = require('react-native');
import {Icon} from './Icon'
var {FBLoginManager} = require('react-native-facebook-login');

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
    style: View.propTypes.style,
    onPress: React.PropTypes.func,
    onLogin: React.PropTypes.func,
    onLogout: React.PropTypes.func,
  },

  getInitialState: function(){
    //if(FBLoginManager == null) FBLoginManager=NativeModules.FBLoginManager
    return {
      user: null,
    };
  },

  handleLogin: function(){
    //alert(Object.keys(FBLoginManager))
    var _this = this;
    FBLoginManager.loginWithPermissions(["email","user_friends"],function(error, data){
      if (!error) {
        _this.setState({ user : data});
        _this.props.onLogin && _this.props.onLogin(data);
      } else {
        console.log(error, data);
      }
    });
  },

  handleLogout: function(){
    var _this = this;
    FBLoginManager.logout(function(error, data){
      if (!error) {
        _this.setState({ user : null});
        _this.props.onLogout && _this.props.onLogout();
      } else {
        console.log(error, data);
      }
    });
  },

  onPress: function(){
    this.state.user
      ? this.handleLogout()
      : this.handleLogin();

    this.props.onPress && this.props.onPress();
  },

  componentWillMount: function(){
    var _this = this;
    FBLoginManager.getCredentials(function(error, data){
      if (!error) {
        _this.setState({ user : data})
      }
    });
  },

  render: function() {
    var color = this.state.user ? "#425bb4" : "#dddddd" ;
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

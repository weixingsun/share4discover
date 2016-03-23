import React, {AppRegistry, Component, Navigator, StyleSheet, Text, View, Dimensions, Platform, } from 'react-native'
var SCREEN_WIDTH = Dimensions.get('window').width;
var BaseConfig = Navigator.SceneConfigs.FloatFromRight;
//import {Actions, Scene, Router} from 'react-native-router-flux';
import Register from './ui/Register'
import Error from './ui/Error'
import Main from './ui/Main'
import Detail from './ui/Detail'

var Nav = React.createClass ({
      //} else if (route.id === 2) {
      //  return <Detail navigator={navigator} {...route.passProps} />
      //<route.component route={route} navigator={navigator} {...route.passProps} />
    _renderScene(route, navigator) {
      return (
        <route.component route={route} navigator={navigator} {...route.passProps} />
      );
    },
    _configureScene(route) {
        return CustomSceneConfig;
    },
    render(){
        return (
            <Navigator 
              initialRoute={{component:Main}} 
              renderScene={this._renderScene} 
              configureScene={this._configureScene}
            />
        );
    },
});
var CustomLeftToRightGesture = Object.assign({}, BaseConfig.gestures.pop, {
  // Make it snap back really quickly after canceling pop
  snapVelocity: 8,
  // Make it so we can drag anywhere on the screen
  edgeHitWidth: SCREEN_WIDTH,
});

var CustomSceneConfig = Object.assign({}, BaseConfig, {
  // A very tighly wound spring will make this transition fast
  springTension: 100,
  springFriction: 1,
  // Use our custom gesture defined above
  gestures: {
//    pop: CustomLeftToRightGesture,
  }
});
module.exports = Nav;

import React, {Component} from 'react'
import {AppRegistry, DeviceEventEmitter, Navigator, StyleSheet, Text, View, Dimensions, Platform, } from 'react-native'
//var BaseConfig = Navigator.SceneConfigs.FloatFromRight;
//import NavigationBar from 'react-native-navbar';
//import Register from './ui/Register'
//import Error from './ui/Error'
import Main from './ui/Main'
//import Drawer from './ui/Drawer'
//import Detail from './ui/Detail'
//import Filter from './ui/Filter'
//import CodePush from "react-native-code-push"
var __navigator = null
export default class Nav extends Component {
    
    static openPage(page,data){
        __navigator.push({
          component: page,
          passProps: {
              msg:data,
          }
        });
    }
    constructor(props) {
      super(props);
      this.state = {};
    }
    componentDidMount() {
        //CodePush.sync();
        //this.event = DeviceEventEmitter.addListener('refresh:'+this.className,(evt)=>this.refresh());
    }
    _renderScene(route, navigator) {
      __navigator=navigator
      if(route.giftedForm == true) return route.renderScene(navigator)
      return <route.component route={route} navigator={navigator} {...route.passProps} />
    }
    _configureScene(route) {
      if(route.giftedForm) 
          return route.configureScene();
      if(route.type == 'Modal')
          return Navigator.SceneConfigs.FloatFromBottom
      return Navigator.SceneConfigs.PushFromRight 
        //return CustomSceneConfig;
    }
    render(){
        return (
            <Navigator 
              initialRoute={{component: Main}} 
              renderScene={this._renderScene} 
              //configureScene={this._configureScene}
            />
        );
    }
}
/*var CustomLeftToRightGesture = Object.assign({}, BaseConfig.gestures.pop, {
  // Make it snap back really quickly after canceling pop
  snapVelocity: 8,
  // Make it so we can drag anywhere on the screen
  edgeHitWidth: Dimensions.get('window').width,
});

var CustomSceneConfig = Object.assign({}, BaseConfig, {
  // A very tighly wound spring will make this transition fast
  springTension: 100,
  springFriction: 1,
  // Use our custom gesture defined above
  gestures: {
//    pop: CustomLeftToRightGesture,
  }
});*/
/*
import {Actions, Scene, Router} from 'react-native-router-flux';
class App extends React.Component {
    render(){
        return <Router>
            <Scene key="root">
                <Scene key="main" component={Main} title={"Main"} initial={true} />
                <Scene key="detail" component={Detail} title={"Detail"} />
                <Scene key="filter" component={Filter}/>
            </Scene>
        </Router>
    }
}*/

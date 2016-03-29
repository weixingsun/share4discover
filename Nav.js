import React, {AppRegistry, Component, Navigator, StyleSheet, Text, View, Dimensions, Platform, } from 'react-native'
var BaseConfig = Navigator.SceneConfigs.FloatFromRight;
import NavigationBar from 'react-native-navbar';
//import Register from './ui/Register'
import Error from './ui/Error'
import Main from './ui/Main'
import Detail from './ui/Detail'
//import Filter from './ui/Filter'
import Filter from './ui/Filter'

export default class Nav extends Component {
      //if (route.id === 2) {
    _renderScene(route, navigator) {
       //   return <Main navigator={navigator} {...route.passProps} />
       //   return <Detail navigator={navigator} {...route.passProps} />
       //   return <Filter navigator={navigator} {...route.passProps} />
      return <route.component route={route} navigator={navigator} {...route.passProps} />
    }
    /*
    _configureScene(route) {
      if(route.type == 'Modal') {
        return Navigator.SceneConfigs.FloatFromBottom
      }
      return Navigator.SceneConfigs.PushFromRight 
        //return CustomSceneConfig;
    },*/
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

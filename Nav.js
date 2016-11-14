import React, {Component} from 'react'
import {
    AppRegistry, 
    DeviceEventEmitter, 
    Navigator, 
    Platform, 
    StyleSheet,
    Text, 
    View, 
    Dimensions, 
} from 'react-native'
import Main from './ui/Main'
import Net from './io/Net'
import Store from './io/Store'
import Note from './ui/Note'
import Detail from './ui/Detail'
import Push from './io/Push'
import SharedPreferences from 'react-native-shared-preferences'
//var BaseConfig = Navigator.SceneConfigs.FloatFromRight;
var __navigator = null
export default class Nav extends Component {
    //p2p = {alertBody:'click to view more',title:'hello'}
    onPushReceived(data){
        //alert('onPushReceived:'+JSON.stringify(data))
        console.log('RNBaiduPush:onPushOpened:',data)
        //Store.append(Store.P2P_PUSH_LIST,data)
        //DeviceEventEmitter.emit('refresh:PushList',0);
    }
    onMsgReceived(data){
        //alert('onMsgReceived:'+JSON.stringify(data))
        console.log('RNBaiduPush:onMsgReceived:',data)
        //Store.append(Store.P2P_PUSH_LIST,data)
        //DeviceEventEmitter.emit('refresh:PushList',0);
    }
    constructor(props) {
      super(props);
      this.state = {};
    }
    componentDidMount() {
        //CodePush.sync();
        /*Push.instance.penetrateEvent((msg)=>{
          this.onMsgReceived(msg)
        });
        Push.instance.pushEvent((msg)=>{
          this.onPushReceived(msg)
        })*/
    }
    componentWillMount() {
        Push.init()
        Push.instance.penetrateEvent((msg)=>{
          this.onMsgReceived(msg)
        });
        Push.instance.pushEvent((msg)=>{
          this.onPushReceived(msg)
        });
    }
    componentWillUnmount() {
        //Push.logout()
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

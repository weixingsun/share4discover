'use strict';
import React, {Component} from 'react';
import {StyleSheet, Text, View, WebView} from 'react-native';
import NavigationBar from 'react-native-navbar'
import Style from './Style'
import {Icon} from './Icon'
import Global from '../io/Global'
//import TimerMixin from 'react-timer-mixin'
 
export default class Web extends Component {
    constructor(props){
        super (props)
        this.state = {
            url:            this.props.url,
            title:         'Loading',
            backEnabled:    false,
            forwardEnabled: false,
            loading:        true,
            timerEnabled:   false,
        }
        this.WEB='web';
        this.reload = this.reload.bind(this);
        this.setTimer = this.setTimer.bind(this);
        this.enableTimer = this.enableTimer.bind(this);
        this.onNavigationStateChange=this.onNavigationStateChange.bind(this);
    }
    componentDidMount() {
      this.timer = setInterval(() => {
        //console.log('I am a background timer!');
        //alert('i am not annoying');
      }, 60000);
    }
    componentWillUnmount() {
      clearInterval(this.timer);
    }
    setTimer(seconds, func){
      var self = this;
      this.timer = setInterval(() => {
        //console.log('I am a background timer!');
        //self.reload();
        func();
      }, seconds);
    }
    dummy(){ }
    enableTimer(){
      if(this.state.timerEnabled){ 
          clearInterval(this.timer);
          this.setState({timerEnabled:false});
          this.setTimer(8000,this.dummy);
      }else{
          clearInterval(this.timer);
          this.setState({timerEnabled:true});
          this.setTimer(8000,this.reload);
      }
    }
/*
setInterval <> clearInterval
setTimeout <> clearTimeout
setImmediate <> clearImmediate
requestAnimationFrame <> cancelAnimationFrame
*/
////////////////////////////////////////////////////////
    getColor(enable){
        if(enable) return '#3B3938';
        else return '#D3D3D3';
    }
    reload() {
        this.refs[this.WEB].reload();
    }
    back(){
        this.refs[this.WEB].goBack();
    }
    forward(){
        this.refs[this.WEB].goForward();
    }
    onNavigationStateChange(navState){
        //alert(typeof navState.canGoBack);
        this.setState({
            backEnabled:    navState.canGoBack,
            forwardEnabled: navState.canGoForward,
            url:            navState.url,
            title:         navState.title,
            loading:        navState.loading,
        });
    }
    render(){
      let title = Global.trimTitle(this.state.title)
      return (
        <View style={{flex:1}}>
          <NavigationBar style={Style.navbar} title={{title: title}}
            leftButton={
                <View style={{flexDirection:'row',}}>
                <Icon name={"ion-ios-arrow-round-back"} color={'#333333'} size={50} onPress={() => this.props.navigator.pop() } />
                </View>
            }
            rightButton={
                <View style={{flexDirection:'row',}}>
                <Icon name={"ion-ios-arrow-dropleft-outline"} color={this.getColor(this.state.backEnabled)} size={30} onPress={() => this.back() } />
                  <View style={{width:20}} />
                <Icon name={"ion-ios-arrow-dropright-outline"} color={this.getColor(this.state.forwardEnabled)} size={30} onPress={() => this.forward() } />
                  <View style={{width:10}} />
                </View>
            }
          />
          <WebView 
            //style={Style.web} 
            ref={this.WEB}
            source={{uri:this.props.url}}
            //scalesPageToFit={true}
            //automaticallyAdjustContentInsets={false}
            //decelerationRate="normal"
            //st5artInLoadingState={true}
            domStorageEnabled={true}
            javaScriptEnabled={false}
            onNavigationStateChange={this.onNavigationStateChange}
            onShouldStartLoadWithRequest={()=>{return true}}
            >
          </WebView>
        </View>
      );
    }
};
//injectedJavaScript={'alert("test")'}

'use strict';
import React, {Component} from 'react';
import {StyleSheet, Text, View, WebView} from 'react-native';
import NavigationBar from 'react-native-navbar'
import Style from './Style'
import {Icon} from './Icon'
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
    getLength(str){
        if (str == null) return 0;  
        if (typeof str != "string") str += "";
        return str.replace(/[^\x00-\xff]/g,"[]").length;
    }
    subString(str,n){
        var r = /[^\x00-\xff]/g;
        if(str.replace(r, "[]").length <= n) return str;
        // n = n - 3;
        var m = Math.floor(n/2);    
        for(var i=m; i<str.length; i++) {
            if(str.substr(0, i).replace(r, "[]").length>=n) return str.substr(0, i) ;
        } 
        return str;
    }
    render(){
      let len = (this.getLength(this.state.title))
      let limit = 30
      let title = len>limit?this.subString(this.state.title,limit)+'...':this.state.title
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

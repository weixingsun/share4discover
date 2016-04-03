'use strict';
import React, {Component, StyleSheet, Text, View, WebView} from 'react-native';
import NavigationBar from 'react-native-navbar'
import Style from './Style'
import IIcon from 'react-native-vector-icons/Ionicons'
//var DEFAULT_URL = 'http://www.lcode.org';
 
export default class Web extends Component {
    constructor(props){
        super (props)
        this.state = {
        }
        this.WEB='web';
    }
    back(){
        this.refs[this.WEB].goBack();
    }
    forward(){
        this.refs[this.WEB].goForward();
    }
    render(){
      return (
        <View style={{flex:1}}>
          <NavigationBar style={Style.navbar} title={{title: this.props.url,}}
            leftButton={
                <IIcon name={"close"} color={'#3B3938'} size={30} onPress={() => this.props.navigator.pop() } />
            }
            rightButton={
                <View style={{flexDirection:'row',}}>
                <IIcon name={"arrow-left-a"} color={'#3B3938'} size={30} onPress={() => this.back() } />
                  <View style={{width:50}} />
                <IIcon name={"arrow-right-a"} color={'#3B3938'} size={30} onPress={() => this.forward() } />
                </View>
            }
          />
          <WebView 
            //style={Style.web} 
            ref={this.WEB}
            source={{uri:this.props.url}}
            scalesPageToFit={true}
            //automaticallyAdjustContentInsets={false}
            //decelerationRate="normal"
            //st5artInLoadingState={true}
            //domStorageEnabled={true}
            //javaScriptEnabled={true}
            >
          </WebView>
        </View>
      );
    }
};

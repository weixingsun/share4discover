'use strict';
import React, {View, Text, StyleSheet, ScrollView, TouchableOpacity, } from 'react-native'
import Login from './Login'
import Style from './Style'
import Web from './Web'
import ListWeb from './ListWeb'
import ListJson from './ListJson'
import NavigationBar from 'react-native-navbar'

export default class Settings extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
      };
      this.openWebList = this.openWebList.bind(this);
      this.openRssList = this.openRssList.bind(this);
      this.openJsonList = this.openJsonList.bind(this);
      this.openJsonList2 = this.openJsonList2.bind(this);
      this.openStockList = this.openStockList.bind(this);
    }
    openWebList(){
        this.props.navigator.push({
            component: ListWeb,
            //passProps: {url:'https://kyfw.12306.cn/otn/leftTicket/init',},
            passProps: {navigator:this.props.navigator,},
        });
    }
    openRssList(){
        this.props.navigator.push({
            component: ListWeb,
            passProps: {navigator:this.props.navigator,},
        });
    }
    openJsonList(){
        this.props.navigator.push({
            component: ListJson,
            passProps: {
                navigator:this.props.navigator,
                API_NAME:'exchange',
            },
        });
    }
    openJsonList2(){
        this.props.navigator.push({
            component: ListJson,
            passProps: {
                navigator:this.props.navigator,
                API_NAME:'exchange2',
            },
        });
    }
    openStockList(){
        this.props.navigator.push({
            component: ListJson,
            passProps: {
                navigator:this.props.navigator,
                API_NAME:'exchange',
            },
        });
    }
//<ScrollView style={{flex:1}}>
    render(){
        return (
        <View>
          <NavigationBar style={Style.navbar} title={{title:'Share',}} />
          <View style={Style.map}>
                  <View style={Style.card}>
                    <Text>About</Text>
                  </View>
                  <View style={Style.card}>
                    <Text>Settings</Text>
                  </View>
                  <View style={Style.card}>
                    <Login />
                  </View>
          </View>
        </View>
        );
    }
}

'use strict';
import React, {View, Text, StyleSheet, ScrollView, TouchableOpacity, } from 'react-native'
import Button from 'react-native-button'
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
            component: ListJson,
            //passProps: {url:'https://kyfw.12306.cn/otn/leftTicket/init',},
            passProps: {navigator:this.props.navigator,},
        });
    }
    openJsonList(){
        this.props.navigator.push({
            component: ListJson,
            //passProps: {url:'https://kyfw.12306.cn/otn/leftTicket/init',},
            passProps: {navigator:this.props.navigator,},
        });
    }
    openStockList(){
        this.props.navigator.push({
            component: ListJson,
            //passProps: {url:'https://kyfw.12306.cn/otn/leftTicket/init',},
            passProps: {navigator:this.props.navigator,},
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
                  <TouchableOpacity style={Style.card} onPress={this.openWebList} >
                    <Text style={{fontWeight: 'bold'}}>My Web List</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={Style.card} onPress={this.openRssList} >
                    <Text style={{fontWeight: 'bold'}}>My RSS List</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={Style.card} onPress={this.openJsonList} >
                    <Text style={{fontWeight: 'bold'}}>My Json List: Oil/Exchange</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={Style.card} onPress={this.openStockList} >
                    <Text style={{fontWeight: 'bold'}}>My Stock List </Text>
                  </TouchableOpacity>
          </View>
        </View>
        );
    }
}

'use strict';
import React, {View, Text, StyleSheet, ScrollView} from 'react-native'
import Button from 'react-native-button'
import Login from './Login'
import Style from './Style'
import Web from './Web'
import WatchList from './WatchList'
import NavigationBar from 'react-native-navbar'

export default class Settings extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
      };
      this.openURL = this.openURL.bind(this);
      this.openList = this.openList.bind(this);
    }
    openURL(_url){
        this.props.navigator.push({
            component: Web,
            //passProps: {url:'https://kyfw.12306.cn/otn/leftTicket/init',},
            //passProps: {url:'http://forex.wiapi.hexun.com/gb/forex/quotelist?&code=FOREXUSDCNY,FOREXNZDCNY,&column=priceweight,code,name,price,updownrate,updown,open,lastclose,high,low,buyprice,sellprice,datetime',},
            //passProps: {url:'http://news.163.com'},
            passProps: {url:'http://news.163.com'},
        });
    }
    openList(){
        this.props.navigator.push({
            component: WatchList,
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
                  <View style={Style.card}>
                    <Button onPress={this.openURL}>163 News</Button>
                  </View>
                  <View style={Style.card}>
                    <Button onPress={this.openList}>My Watch List</Button>
                  </View>
          </View>
        </View>
        );
    }
}

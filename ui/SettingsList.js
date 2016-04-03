'use strict';
import React, {View, Text, StyleSheet, ScrollView} from 'react-native'
import Button from 'react-native-button'
import Login from './Login'
import Style from './Style'
import Web from './Web'
import NavigationBar from 'react-native-navbar'

export default class Settings extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
      };
      this.openURL = this.openURL.bind(this);
    }
    openURL(){
        this.props.navigator.push({
            component: Web,
            passProps: {url:'http://m.baidu.com',},
        });
    }
    render(){
        return (
        <View>
          <NavigationBar style={Style.navbar} title={{title:'Share',}} />
          <View style={Style.map}>
            <View style={Style.card}>
              <Login />
            </View>
            <View style={Style.card}>
              <Button >Register</Button>
            </View>
            <View style={Style.card}>
              <Text>What is Hot</Text>
            </View>
            <View style={Style.card}>
              <Text>Settings</Text>
            </View>
            <View style={Style.card}>
              <Text>Help</Text>
            </View>
            <View style={Style.card}>
              <Text>About</Text>
            </View>
            <View style={Style.card}>
              <Button onPress={this.openURL}>open a web viewer</Button>
            </View>
          </View>
        </View>
        );
    }
}

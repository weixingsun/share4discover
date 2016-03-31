'use strict';
import React, {View, Text, StyleSheet, ScrollView} from 'react-native'
import Button from 'react-native-button'
import Login from './Login'
import Style from './Style'
import NavigationBar from 'react-native-navbar'

export default class Settings extends React.Component {
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
          </View>
        </View>
        );
    }
}

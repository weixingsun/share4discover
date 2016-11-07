'use strict';
import React, {Component} from 'react'
import {Image,ListView, View, Text, StyleSheet, ScrollView, TouchableOpacity,NativeModules,Linking } from 'react-native'
import {Icon} from './Icon'
import Style from './Style'
import NavigationBar from 'react-native-navbar'
import I18n from 'react-native-i18n';
import DeviceInfo from 'react-native-device-info'

export default class ToS extends React.Component {
    constructor(props) {
      super(props);
      this.ds = new ListView.DataSource({
          rowHasChanged: (row1, row2) => row1 !== row2,
          sectionHeaderHasChanged: (s1, s2) => s1 !== s2,
      });
      this.state = {
      };
      //I18n.locale = NativeModules.RNI18n.locale
      //this.openWebList = this.openWebList.bind(this);
    }
    componentWillMount() {}
    renderSection(){
        return (
            <View style={{backgroundColor:'#ddeeff'}} >
              <View style={{flexDirection:'row'}}>
                  <Text style={{justifyContent: 'center',alignItems:'center',fontSize:16,fontWeight:'bold',color:'black'}}> 1. {I18n.t('tos_special')} </Text>
              </View>
            </View>
        )
    }
    renderLast(){
        return (
            <View style={{flex:1,justifyContent: 'center',alignItems:'center'}}>
                <Text style={{justifyContent:'center'}} > </Text>
                <Text style={{justifyContent:'center'}} >Copyright @2016 {I18n.t('shareplus')}</Text>
                <Text style={{justifyContent:'center'}} > </Text>
            </View>
        )
    }
    render(){
      let titleName = I18n.t('tos')
      return (
      <View>
          <NavigationBar style={Style.navbar} title={{title:titleName,}} 
              leftButton={
                 <View style={{flexDirection:'row',}}>
                    <Icon name={"ion-ios-arrow-round-back"} color={'#333333'} size={40} onPress={() => this.props.navigator.pop() } />
                 </View>
              }
          />
          {this.renderSection()}
          {this.renderLast()}
      </View>
      );
    }
}
var styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
    },
    scrollViewContainer: {
        flex: 1,
        flexDirection: 'column',
        padding: 15,
    },
    listViewContainer: {
        flex: 1,
        flexDirection: 'column',
    },
    buttonContainer: {
        flex: 1,
        flexDirection: 'column',
        padding: 15,
        backgroundColor: "#EEE",
    },
    header: {
        flex: 0,
        flexDirection: "row",
        justifyContent: "space-between",
        padding: 6,
        backgroundColor: "#387ef5",
    },
});

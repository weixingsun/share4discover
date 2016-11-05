'use strict';
import React, {Component} from 'react'
import {Image,ListView, View, Text, StyleSheet, ScrollView, TouchableOpacity,NativeModules,Linking } from 'react-native'
import {Icon} from './Icon'
import Style from './Style'
import ToS from './ToS'
import Push from '../io/Push'
import NavigationBar from 'react-native-navbar'
import I18n from 'react-native-i18n';
import DeviceInfo from 'react-native-device-info'

export default class USBList extends React.Component {
    constructor(props) {
      super(props);
      this.ds = new ListView.DataSource({
          rowHasChanged: (row1, row2) => row1 !== row2,
          sectionHeaderHasChanged: (s1, s2) => s1 !== s2,
      });
      this.state = {
          //onesignal_id:'',
          uid:'',
      };
      //I18n.locale = NativeModules.RNI18n.locale
      //this.openJsonAPI = this.openJsonAPI.bind(this);
      //this.openWebList = this.openWebList.bind(this);
    }
    componentWillMount() {
        //Push.getS1Id()
    }
    goToS(){
        this.props.navigator.push({
            component: ToS,
            passProps: {navigator:this.props.navigator,},
        })
    }
    renderOnesignal(){
        return (
            <View style={Style.detail_card} >
              <View style={{flexDirection:'row'}}>
                  <Text style={{width:60,justifyContent: 'center',alignItems:'center',fontSize:16,fontWeight:'bold',color:'black'}}> {I18n.t('s1id')}: </Text>
                  <Text style={{marginLeft:10,justifyContent: 'center'}}>{ Push.s1uid }</Text>
              </View>
            </View>
        )
    }
    renderPush(){
        return (
            <View style={Style.detail_card} >
              <View style={{flexDirection:'row'}}>
                  <Text style={{width:60,justifyContent: 'center',alignItems:'center',fontSize:16,fontWeight:'bold',color:'black'}}> {I18n.t('uid')}: </Text>
                  <Text style={{marginLeft:10,justifyContent: 'center'}}>{ Push.uid }</Text>
              </View>
            </View>
        )
    }
    renderHomepage(){
        return (
            <View style={Style.detail_card} >
              <View style={{flexDirection:'row'}}>
                  <Text style={{width:60,justifyContent: 'center',alignItems:'center',fontSize:16,fontWeight:'bold',color:'black'}}> {I18n.t('home')}: </Text>
                  <Text style={{marginLeft:10,justifyContent: 'center'}} onPress={()=>Linking.openURL('http://shareplus.co.nf')}>http://shareplus.co.nf</Text>
              </View>
            </View>
        )
    }
    renderIcon(){
        return (
            <View style={{flex:1,height:200,justifyContent: 'center',alignItems:'center'}}>
                <Text style={{justifyContent:'center'}} > </Text>
                <Text style={{justifyContent:'center'}} > </Text>
                <Image 
                    style={{width: 100, height: 100}}
                    source={require('../img/icon.png')}
                />
                <Text style={{justifyContent:'center'}} >{I18n.t('shareplus')} {DeviceInfo.getVersion()}</Text>
                <Text style={{justifyContent:'center'}} > </Text>
                <Text style={{justifyContent:'center'}} > </Text>
            </View>
        )
    }
    renderCopyright(){
        return (
            <View style={{flex:1,height:200,justifyContent: 'center',alignItems:'center'}}>
                <Text style={{justifyContent:'center'}} > </Text>
                <Text style={{justifyContent:'center'}} > </Text>
                <Text style={{color:'blue',textDecorationLine:'underline',textDecorationStyle:'solid',justifyContent:'center'}} onPress={() => this.goToS()} >{I18n.t('tos')}</Text>
                <Text style={{justifyContent:'center'}} > </Text>
                <Text style={{justifyContent:'center'}} >Copyright @2016 {I18n.t('shareplus')}</Text>
                <Text style={{justifyContent:'center'}} > </Text>
            </View>
        )
    }
    render(){
      let titleName = I18n.t('about')+' '+I18n.t('shareplus')
      return (
      <View>
          <NavigationBar style={Style.navbar} title={{title:titleName,}} 
              leftButton={
                 <View style={{flexDirection:'row',}}>
                    <Icon name={"ion-ios-arrow-round-back"} color={'#333333'} size={40} onPress={() => this.props.navigator.pop() } />
                 </View>
              }
          />
          {this.renderIcon()}
          {this.renderHomepage()}
          {this.renderPush()}
          {this.renderCopyright()}
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

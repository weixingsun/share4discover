'use strict';
import React, { Component } from 'react'
import NavigationBar from 'react-native-navbar';
import {ListView, Text, View, TouchableHighlight, Image, } from 'react-native';
import Net from "../io/Net"
import Global from "../io/Global"
import Store from "../io/Store"
import {Icon} from './Icon'
import Filter from "./Filter"
import Style from "./Style"
import Main from "./Main"
import Detail from "./Detail"
import FormAddMsg from './FormAddMsg'

export default class NotifyList extends Component {
  constructor(props) {
      super(props);
      this.ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
  }
  getMsg(key){
      var self = this;
      Net.getMsg(key).then((json)=> {
          self.props.navigator.push({
              component: Detail,
              passProps: {
                  msg:json,
		  mainlogin:this.props.mainlogin,
              }
          });
      });
  }
  _onPress(rowData) {
      this.getMsg(rowData.type+':'+rowData.latlng)
  }
  _renderRowView(rowData) {
    var time = new Date(parseInt(rowData.time)).toLocaleString()
    return (
      <TouchableHighlight style={Style.notify_row} underlayColor='#c8c7cc' 
            onPress={()=>this._onPress(rowData)} >
          <View >
              <View style={{flexDirection: 'row', justifyContent:'center', height:58 }}>
	        <View style={{marginLeft:15,marginRight:6,justifyContent:'center'}}>
                  <Icon 
		    style={{marginLeft:15,marginRight:6}}
		    size={40}
		    //color={this.props.msg.ask=='false'?'blue':'gray'}
		    color={'gray'}
		    name={Global.TYPE_ICONS[rowData.type]}
		  />
	        </View>
	        <View style={{marginLeft:10,flex:1,justifyContent:'center'}}>
                    <Text>{rowData.content}</Text>
		</View>
		<View style={{marginRight:10,justifyContent:'center'}}>
                    <Text>{time}</Text>
		</View>
              </View>
              <View style={Style.separator} />
          </View>
      </TouchableHighlight>
    );
  }
  render() {
    let ds = this.ds.cloneWithRows(this.props.mails)
    return (
      <View style={Style.absoluteContainer}>
        <NavigationBar style={Style.navbar} title={{title:'',}} 
            //leftButton={
            //    <Icon name={'ion-ios-search'} size={40} onPress={() => this.props.drawer.open()}/>
            //}
            //rightButton={
            //    <Icon name={'ion-ios-add'} size={50} onPress={() => this.props.navigator.push({component: FormAddMsg}) }/>
            //} 
	/>
        <ListView 
            dataSource={ds} 
            renderRow={this._renderRowView.bind(this)} 
            enableEmptySections={true} />
      </View>
    );
  }
}

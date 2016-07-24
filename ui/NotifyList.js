'use strict';
import React, { Component } from 'react'
import {NativeModules, ListView, Text, View, TouchableHighlight, Image, } from 'react-native';
import I18n from 'react-native-i18n';
import NavigationBar from 'react-native-navbar';
import Swipeout from 'react-native-swipeout';
import Net from "../io/Net"
import Global from "../io/Global"
import Store from "../io/Store"
import {Icon} from './Icon'
import Filter from "./Filter"
import Style from "./Style"
import Main from "./Main"
import Detail from "./Detail"
import FormInfo from './FormInfo'

export default class NotifyList extends Component {
  constructor(props) {
      super(props);
      this.lang = NativeModules.RNI18n.locale.replace('_', '-').toLowerCase()  //zh_CN  -> zh-cn
      this.ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
  }
  componentWillMount(){
      //alert(NativeModules.RNI18n.locale)
  }
  getMsg(key){
      var self = this;
      Net.getMsg(key).then((json)=> {
          if(json!=null)
          self.props.navigator.push({
              component: Detail,
              passProps: {
                  msg:json,
		  mainlogin:this.props.mainlogin,
              }
          });
          else
            alert('This share has been deleted.')
      });
  }
  readMsg(reply){
      //key='car:lat,lng:ctime#rtime'  value='r1|fb:email|content'
      var key = Global.getKeyFromReply(reply)
      var notify_value={key:'#'+this.props.mainlogin, field:key+'#'+reply.rtime, value:'r0|'+this.props.mainlogin+'|'+reply.content}
      Net.putMsg(notify_value)
  }
  _onPress(rowData) {
      if(rowData.status==='1')this.readMsg(rowData)
      this.getMsg(Global.getKeyFromReply(rowData))
  }
  _renderSwipeoutRow(rowData){
    let rightButton = [{
          text:'Delete',
          backgroundColor:'#ff6f00',
          onPress:()=>{
            let json = {key:'@'+rowData.user,field:Global.getKeyFromReply(rowData)+'#'+rowData.rtime}
            alert(JSON.stringify(json))
            Net.delHash(json);
          }
        }]
    return (
      <Swipeout
        //left={rowData.left}
        right={rightButton}
        rowID={rowData.rtime}
        //sectionID={sectionID}
        autoClose={true}
        //backgroundColor={rowData.backgroundColor}
        //close={!rowData.active}
        //onOpen={(sectionID, rowID) => this._handleSwipeout(sectionID, rowID) }
        //scroll={event => this._allowScroll(event)}
      >
          {this._renderRowView(rowData)}
      </Swipeout>
    )
  }
  _renderRowView(rowData) {
    var time = Global.getDateTimeFormat(parseInt(rowData.rtime),this.lang)
    var bold = rowData.status==='1'? {fontWeight:'bold',color:'black'}: {}
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
                    <Text style={ bold }>{rowData.content}</Text>
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
  renderActionIcon(){
    //alert(this.props.mainlogin)
    /*if(this.props.mainlogin==='') 
      return (
            <View style={{flexDirection:'row',}}>
                <Icon name={'ion-ios-add'} size={50} color={'gray'} />
                <View style={{width:20}} />
            </View>
      )
    else{
      return (
            <View style={{flexDirection:'row',}}>
                <Icon name={'ion-ios-add'} size={50} color={'black'} 
                    onPress={() => this.props.navigator.push({ component: FormInfo, passProps: {navigator:this.props.navigator} })}
                />
                <View style={{width:20}} />
            </View>
      )
    }*/
  }
  render() {
    let ds=this.ds.cloneWithRows([])
    if(this.props.mails!=='') ds = this.ds.cloneWithRows(this.props.mails)
    return (
      <View style={Style.absoluteContainer}>
        <NavigationBar style={Style.navbar} title={{title:'My Messages',}} 
            //leftButton={}
            //rightButton= {this.renderActionIcon()}
	/>
        <ListView 
            dataSource={ds} 
            //renderRow={this._renderRowView.bind(this)} 
            renderRow={this._renderSwipeoutRow.bind(this)} 
            enableEmptySections={true} />
      </View>
    );
  }
}

'use strict';
import React, { Component } from 'react'
import NavigationBar from 'react-native-navbar';
import {DeviceEventEmitter,ListView, NetInfo, Text, View, TouchableHighlight, Image, StyleSheet } from 'react-native';
import Net from "../io/Net"
import Global from "../io/Global"
import {Icon} from './Icon'
import Style from "./Style"
import Main from "./Main"
import Detail from "./Detail"
import FormInfo from "./FormInfoVar"
import I18n from 'react-native-i18n';

export default class MyList extends Component {
  constructor(props) {
      super(props);
      this.ds= new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
      this.state = {
          myMsgList:[],
      };
      this.updateOnUI=true
  }
  componentWillMount() {
      this.load()
  }
  componentDidMount() {
      DeviceEventEmitter.removeAllListeners('refresh:MyList')
      this.event = DeviceEventEmitter.addListener('refresh:MyList',(evt)=>setTimeout(()=>this.load(),400));
  }
  componentWillUnmount() {
      this.updateOnUI=false
      DeviceEventEmitter.removeAllListeners('refresh:MyList')
  }
  load(){
      let list = []
      let self = this
      if(Global.mainlogin.length>0) {
          Net.getMyMsgs('*'+Global.mainlogin).then((rows)=>{
              //alert(JSON.stringify(rows))
              if(self.updateOnUI){
                  let notnull = rows.filter((row)=>{return row!=null})
                  self.setState({myMsgList:notnull})
              }
          }).catch((e)=>{
              alert('Network Problem!')
          });
      }
  }
  _onPress(rowData) {
      this.props.navigator.push({
          component: Detail,
          passProps: {
              msg:rowData,
              mainlogin:Global.mainlogin,
          }
      });
  }
  _renderRowView(rowData) {
    if(rowData!=null){
      //console.log(rowData)
      if(rowData==null) return
      return (
      <TouchableHighlight underlayColor='#c8c7cc' 
            onPress={()=>this._onPress(rowData)} >
          <View>
              <View style={{flexDirection: 'row',height:58}}>
                <View style={{marginLeft:15,marginRight:6,justifyContent:'center'}}>
                  <Icon name={Global.TYPE_ICONS[rowData.type]} size={40} />
                </View>
                <View style={{justifyContent: 'center',height:56}}>
                    <Text style={{fontSize:16,marginLeft:10}}>{rowData.title}</Text>
                </View>
              </View>
              <View style={Style.separator} />
          </View>
      </TouchableHighlight>
      );
    }
  }
  renderAddIcon(){
      if(Global.mainlogin==='') 
          return (
              <Icon name={'ion-ios-add'} size={50} color={Style.font_colors.disabled} 
                    onPress={() => alert('Please login to publish your share') }/>
          )
      else return (
               <Icon name={'ion-ios-add'} size={50} color={Style.font_colors.enabled} 
                     onPress={() => this.props.navigator.push({component:FormInfo, passProps:{navigator:this.props.navigator} })}/>
           )
  }
  render() {
    let title = I18n.t('my')+' '+I18n.t('share')
    return (
      <View>
        <NavigationBar style={Style.navbar} title={{title:title,tintColor:Style.font_colors.enabled}} 
            //leftButton={}
            rightButton={
                <View style={{flexDirection:'row', alignItems:'center', justifyContent:'center'}}>
                    {this.renderAddIcon()}
                    <View style={{width:10}} />
                </View>
            }
        />
        <ListView style={styles.listContainer}
            dataSource={this.ds.cloneWithRows(this.state.myMsgList)} 
            renderRow={this._renderRowView.bind(this)} 
            enableEmptySections={true} />
      </View>
    );
  }
}
var styles = StyleSheet.create({
    listContainer: {
        flex: 1,
        flexDirection: 'column',
        height:Style.DEVICE_HEIGHT-Style.NAVBAR_HEIGHT-Style.BOTTOM_BAR_HEIGHT-20,
    },
})

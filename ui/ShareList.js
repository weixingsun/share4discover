'use strict';
import React, { Component } from 'react'
import NavigationBar from 'react-native-navbar';
import {DeviceEventEmitter,ListView, NetInfo, Text, View, TouchableHighlight, TouchableOpacity, Image, StyleSheet } from 'react-native';
import Net from "../io/Net"
import Global from "../io/Global"
import {Icon} from './Icon'
import Style from "./Style"
import Detail from "./Detail"
import FormInfo from "./FormInfoVar"
import I18n from 'react-native-i18n';
import Menu, { MenuContext, MenuOptions, MenuOption, MenuTrigger } from 'react-native-popup-menu'

export default class ShareList extends Component {
  constructor(props) {
      super(props);
      this.ds= new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
      this.state = {
          share_list:this.props.share_list,
          order:'order_dist_asc',
      };
      this.updateOnUI=true
  }
  componentWillMount() {
      this.reorder(this.state.order,this.state.share_list)
  }
  componentDidMount() {
      //DeviceEventEmitter.removeAllListeners('refresh:ShareList')
      //this.event = DeviceEventEmitter.addListener('refresh:ShareList',(evt)=>setTimeout(()=>this.load(),500));
  }
  componentWillUnmount() {
      this.updateOnUI=false
      //DeviceEventEmitter.removeAllListeners('refresh:ShareList')
  }
  /*load(){
      let list = []
      let self = this
      if(Global.mainlogin.length>0) {
          Net.getMyMsgs('*'+Global.mainlogin).then((rows)=>{
              //alert(JSON.stringify(rows))
              if(self.updateOnUI && rows){
                  let notnull = rows.filter((row)=>{return row!=null})
                  self.setState({share_list:notnull})
              }
          }).catch((e)=>{
              alert('Network Problem! '+JSON.stringify(e))
          });
      }
  }*/
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
      //alert(JSON.stringify(rowData))
      if(rowData==null) return
      let address1 = rowData.address.split(',')[0]
      let time1 = Global.getDateTimeFormat(rowData.ctime)
      let name  = Global.getInfoMainLoginName(rowData.owner)
      let dist = Global.distanceName( rowData.lat, rowData.lng, Global.region.latitude, Global.region.longitude )
      return (
      <TouchableHighlight underlayColor='#c8c7cc' 
            onPress={()=>this._onPress(rowData)} >
          <View>
              <View style={{flexDirection: 'row',height:58}}>
                <View style={{justifyContent:'center',width:50,alignItems:'center'}}>
                  <Icon name={Global.TYPE_ICONS[rowData.type]} size={30} color={Style.CAT_COLORS[rowData.cat]} />
                </View>
                <View style={{flex:1,justifyContent:'center',marginTop:10,marginBottom:10}}>
                  <View style={{flex:1,justifyContent:'flex-end'}}>
                    <Text style={{fontSize:12,marginLeft:1}}>{name}</Text>
                  </View>
                  <View style={{flex:2,justifyContent:'center'}}>
                    <Text style={{fontSize:16,marginLeft:1}}>{rowData.title}</Text>
                  </View>
                </View>
                <View style={{flex:1,justifyContent:'center',marginTop:10,marginBottom:10}}>
                  <View style={{flex:1,justifyContent:'flex-end',alignItems:'flex-end'}}>
                    <Text style={{fontSize:10,marginRight:8}}>{time1}</Text>
                  </View>
                  <View style={{flex:2,justifyContent:'center',alignItems:'flex-end'}}>
                    <Text style={{fontSize:10,marginRight:8}}>{dist}</Text>
                  </View>
                </View>
              </View>
              <View style={Style.separator} />
          </View>
      </TouchableHighlight>
      );
    }
  }
  renderMoreOption(value,name,icon){
      return (
          <MenuOption value={value} style={{backgroundColor:Style.highlight_color}}>
              <View style={{flexDirection:'row',height:40}}>
                  <View style={{width:30,justifyContent:'center'}}>
                      <Icon name={icon} color={'#ffffff'} size={16} />
                  </View>
                  <View style={{justifyContent:'center'}}>
                      <Text style={{color:Style.font_colors.enabled}}> {name} </Text>
                  </View>
              </View>
          </MenuOption>
      )
  }
  renderMore(){
      return (
          <View style={{ padding: 1, flexDirection: 'row', backgroundColor:Style.highlight_color }}>
            <Menu style={{backgroundColor:Style.highlight_color}} onSelect={(value) => this.chooseMore(value) }>
              <MenuTrigger>
                <Icon name={'ion-ios-more'} color={'#ffffff'} size={40} style={{paddingLeft:15,paddingRight:15,flexDirection:'row',justifyContent:'center'}} />
              </MenuTrigger>
              <MenuOptions>
                {this.renderMoreOption('new_share', I18n.t('create')+' '+I18n.t('share'),  'fa-pencil-square')}
                    <View style={Style.separator} />
                {this.renderMoreOption('delete_all',I18n.t('delete_all'),'fa-trash')}
              </MenuOptions>
            </Menu>
          </View>
      )
  }
  getOrderIcon(order){
      if(order==='order_dist_asc') return 'fa-location-arrow'
      else if(order==='order_time_asc') return 'fa-clock-o'
  }
  renderOrderMore(){
      //<Button style={{height:41,width:50,borderColor:Style.highlight_color}}>
      //alert('icon='+this.state.order)
      return (
          <View style={{ padding: 1, flexDirection: 'row', backgroundColor:Style.highlight_color }}>
            <Menu style={{backgroundColor:Style.highlight_color}} onSelect={(value) => this.chooseOrderMore(value) }>
              <MenuTrigger>
                <Icon name={'fa-sort-amount-asc'} color={'#ffffff'} size={20} style={{paddingLeft:1,paddingRight:15,flexDirection:'row',justifyContent:'center'}} />
              </MenuTrigger>
              <MenuOptions>
                {this.renderMoreOption('order_dist_asc', I18n.t('order_dist_asc'),this.getOrderIcon('order_dist_asc'))}
                    <View style={Style.separator} />
                {this.renderMoreOption('order_time_asc', I18n.t('order_time_asc'),this.getOrderIcon('order_time_asc'))}
              </MenuOptions>
            </Menu>
          </View>
      )
  }
  chooseOrderMore(option){
      let arr = this.reorder(option,this.state.share_list)
      this.setState({
           order:option,
           push_list:arr,
      })
  }
  //Global.distance( lat, lng, Global.region.latitude, Global.region.longitude )
  getDist(a){
      return Global.distance( a.lat, a.lng, Global.region.latitude, Global.region.longitude )
  }
  reorder(order,arr){
      //let json = arr?arr:this.state.share_list
      return arr.sort((a,b)=>{
          if(order==='order_dist_asc')      return this.getDist(a) - this.getDist(b)
          else if(order==='order_time_asc') return b.ctime - a.ctime
      })
      /*this.setState({
          order:order,
          push_list:json,
      })*/
  }
  renderOrderActions(){
      return (
          <View style={{flexDirection:'row',}}>
              <Icon name={this.getOrderIcon(this.state.order)} color={'#ffffff'} size={10} />
              {this.renderOrderMore()}
              <View style={{width:1}} />
          </View>
      )
  }
  render() {
    let title = '' //I18n.t('my')+' '+I18n.t('share')
    return (
      <MenuContext style={{ flex: 1 }} ref={"menu_my"}>
        <NavigationBar style={Style.navbar} title={{title:title,tintColor:Style.font_colors.enabled}} 
            leftButton={
                <TouchableOpacity style={{width:50,height:50}} onPress={() => this.props.navigator.pop()}>
                    <Icon name={"ion-ios-arrow-round-back"} color={Style.font_colors.enabled} size={40} />
                </TouchableOpacity>
            }
            rightButton={this.renderOrderActions()}
        />
        <ListView style={styles.listContainer}
            dataSource={this.ds.cloneWithRows(this.state.share_list)} 
            renderRow={this._renderRowView.bind(this)} 
            enableEmptySections={true} />
      </MenuContext>
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

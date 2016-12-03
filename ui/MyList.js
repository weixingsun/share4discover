'use strict';
import React, { Component } from 'react'
import NavigationBar from 'react-native-navbar';
import {DeviceEventEmitter,ListView, NetInfo, Text, View, TouchableHighlight, TouchableOpacity, Image, StyleSheet } from 'react-native';
import Net from "../io/Net"
import Global from "../io/Global"
import {Icon} from './Icon'
import Style from "./Style"
import Main from "./Main"
import Detail from "./Detail"
import FormInfo from "./FormInfoVar"
import I18n from 'react-native-i18n';
import Menu, { MenuContext, MenuOptions, MenuOption, MenuTrigger } from 'react-native-popup-menu'

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
      this.event = DeviceEventEmitter.addListener('refresh:MyList',(evt)=>setTimeout(()=>this.load(),500));
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
              if(self.updateOnUI && rows){
                  let notnull = rows.filter((row)=>{return row!=null})
                  self.setState({myMsgList:notnull})
              }
          }).catch((e)=>{
              alert('Network Problem! '+JSON.stringify(e))
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
      let address1 = rowData.address.split(',')[0]
      let time1 = Global.getDateTimeFormat(rowData.ctime)
      return (
      <TouchableHighlight underlayColor='#c8c7cc' 
            onPress={()=>this._onPress(rowData)} >
          <View>
              <View style={{flexDirection: 'row',height:58}}>
                <View style={{justifyContent:'center',width:50,alignItems:'center'}}>
                  <Icon name={Global.TYPE_ICONS[rowData.type]} size={30} color={Style.CAT_COLORS[rowData.cat]} />
                </View>
                <View style={{flex:1,justifyContent:'center'}}>
                  <View style={{flex:1,justifyContent:'flex-end'}}>
                    <Text style={{fontSize:10,marginLeft:1}}>{address1}</Text>
                  </View>
                  <View style={{flex:2,justifyContent:'center'}}>
                    <Text style={{fontSize:16,marginLeft:1}}>{rowData.title}</Text>
                  </View>
                </View>
                <View style={{justifyContent:'center'}}>
                  <Text style={{fontSize:10,marginRight:8}}>{time1}</Text>
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
      //<Button style={{height:41,width:50,borderColor:Style.highlight_color}}>
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
  chooseMore(value){
      if(value==='new_share'){ // login_first
        if(Global.mainlogin==='') {
          alert(I18n.t('login_first'))
        }else{
          this.props.navigator.push({component:FormInfo, passProps:{navigator:this.props.navigator} })
        }
      }else{
        alert(I18n.t('delete_1by1'))
      }
  }
  renderActions(){
      return (
          <View style={{flexDirection:'row',}}>
              {this.renderMore()}
              <View style={{width:1}} />
          </View>
      )
  }
  render() {
    let title = I18n.t('my')+' '+I18n.t('share')
    return (
      <MenuContext style={{ flex: 1 }} ref={"menu_my"}>
        <NavigationBar style={Style.navbar} title={{title:title,tintColor:Style.font_colors.enabled}} 
            //leftButton={}
            rightButton={this.renderMore()}
        />
        <ListView style={styles.listContainer}
            dataSource={this.ds.cloneWithRows(this.state.myMsgList)} 
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

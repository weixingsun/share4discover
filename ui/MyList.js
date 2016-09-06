'use strict';
import React, { Component } from 'react'
import NavigationBar from 'react-native-navbar';
import {ListView, NetInfo, Text, View, TouchableHighlight, Image, } from 'react-native';
import Net from "../io/Net"
import Global from "../io/Global"
import {Icon} from './Icon'
import Style from "./Style"
import Main from "./Main"
import Detail from "./Detail"
import FormInfo from "./FormInfo"
//import Drawer from 'react-native-drawer'
//import ControlPanel from './ControlPanel'

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
      this.requestMyMsgs()
  }
  componentDidMount() {
  }
  componentWillUnmount() {
      this.updateOnUI=false
  }
  requestMyMsgs(){
      let list = []
      let self = this
      if(Global.mainlogin.length>0) {
          Net.getMyMsgs('*'+Global.mainlogin).then((rows)=>{
              //alert(JSON.stringify(rows))
              if(this.updateOnUI)
                  self.setState({myMsgList:rows})
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
  renderFeedIcon(){
      if(Global.mainlogin!=='')
          return (
              <Icon name={'ion-ios-folder-outline'} size={40} color={Style.font_colors.enabled}
                  onPress={() => this.feed()}/>
          )
  }
  feed(){
      let _this = this;
      let api_url = Global.getFeedApi()
      //alert(api_url)
      fetch(api_url)
        //.then((response) => response.json())
        .then((responseData) => {
            console.log(responseData)
        })
        .catch((err)=>{alert(err)})
        .done();
  }
  render() {
    //{this.renderFeedIcon()}
    return (
      <View style={Style.absoluteContainer}>
        <NavigationBar style={Style.navbar} title={{title:'My Shares',tintColor:Style.font_colors.enabled}} 
            //leftButton={}
            rightButton={
                <View style={{flexDirection:'row', alignItems:'center', justifyContent:'center'}}>
                    {this.renderAddIcon()}
                    <View style={{width:10}} />
                </View>
            }
        />
        <ListView 
            dataSource={this.ds.cloneWithRows(this.state.myMsgList)} 
            renderRow={this._renderRowView.bind(this)} 
            enableEmptySections={true} />
      </View>
    );
  }
}

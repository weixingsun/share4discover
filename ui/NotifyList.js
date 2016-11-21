'use strict';
import React, { Component } from 'react'
import { 
  Alert, 
  DeviceEventEmitter, 
  NativeModules, 
  ListView, 
  Text, 
  View, 
  TouchableHighlight, 
  Platform,
  Image, 
  StyleSheet 
} from 'react-native';
import I18n from 'react-native-i18n';
import NavigationBar from 'react-native-navbar';
import Swipeout from 'react-native-swipeout';
import Net from "../io/Net"
import Global from "../io/Global"
import Store from "../io/Store"
import {Icon} from './Icon'
import Style from "./Style"
import Main from "./Main"
import Detail from "./Detail"
import FormInfo from './FormInfoVar'
//import RssReader from './RssReader';
//import YqlReader from './YqlReader';
//import SGListView from 'react-native-sglistview';
import Button from 'apsl-react-native-button'
import Menu, { MenuContext, MenuOptions, MenuOption, MenuTrigger } from 'react-native-popup-menu'

export default class NotifyList extends Component {
  constructor(props) {
      super(props);
      this.ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
      this.all_notes=[]
      this.state={
          push_list:[],
          type:Store.LOCAL,
      }
      this.share_types = Object.keys(Global.TYPE_ICONS)
      this.updateOnUI=true
  }
  componentWillMount(){
      this.load()
  }
  componentWillUnmount(){
      this.updateOnUI=false
      this.event_notify.remove()
  }
  componentDidMount(){
      this.event_notify = DeviceEventEmitter.addListener('refresh:PushList',(evt)=>setTimeout(()=>this.load(),400))
  }
  load(type){
      if(!type) type=this.state.type
      var self=this;
      //alert(JSON.parse('[,{"a":1}]'))
      Store.getShared(Store.PUSH_LIST+":"+type, function(value){
          //{title:'title',desc:'click to view more',custom:'{\"k1\":\"v1\",\"k2\":\"v2\"}'}
          //alert('value='+value)
          if(self.updateOnUI && value!=null){
              console.log('Store.getShared() key='+Store.PUSH_LIST+":"+type+' json='+value)
              try{
                let json = JSON.parse(value)
                self.setState({
                  type:type,
                  push_list:json,
                })
              }catch(e){
                alert('invalid data, please delete all msg')
                self.setState({
                  type:type,
                  push_list:[],
                })
              }
          }else if(self.updateOnUI) self.setState({ type:type, push_list:[] })
      })
  }
  sort(arr){
      let total ={}
      arr.map((item)=>{
          let obj = JSON.parse(item)
          if(total[obj.type]) total[obj.type].push(item)
          else total[obj.type] = [item]
      })
      //alert(JSON.stringify(total))
      var keys = Object.keys(total);
      keys.sort();
      let s_arr = []
      keys.map((key)=>{
          s_arr = s_arr.concat(total[key])
      })
      //alert(JSON.stringify(s_arr))
      return s_arr;
  }
  sort_dict(dict){
      var keys = Object.keys(dict);
      keys.sort();
      let s_dict = {}
      for (var i=0; i<keys.length; i++) {
          s_dict[keys[i]] = dict[ keys[i] ]
      }
      return s_dict;
  }
  openPush(json){
      //alert('openPush: '+JSON.stringify(json))
      if(Platform.OS==='ios'){
          //alert('json='+JSON.stringify(json))
          if(json.t===Global.push_p2p||json.t===Global.push_tag){
              if(!json.read)this.readPush(json.t,json.r)
              this.getMsg(json.i)
          }
      }else{
          if(json.custom_content){ //local=msg
              if(json.custom_content.i) this.getMsg(json.custom_content.i)
          }else if(json.custom) { // p2p+tag=push Global.push_p2p Global.push_tag
              if(!json.read&&json.custom.t&&json.custom.r) this.readPush(json.custom.t,json.custom.r)
              this.getMsg(json.custom.i)
          }
      }
  }
  getMsg(key){
      var self = this;
      Net.getMsg(key).then((json)=> {
          if(json!=null)
          self.props.navigator.push({
              component: Detail,
              passProps: {
                  msg:json,
              }
          });
          else
            alert('This share has been deleted.')
      });
  }
  readPush(type,id){
      Store.readPushShared(Store.PUSH_LIST+":"+type,{r:id})
      DeviceEventEmitter.emit('refresh:PushList',0);
  }
  _onPress(rowData) {
      //alert('_onPress: '+JSON.stringify(rowData))
      if(!rowData.read)this.readMsg(rowData.id)
      this.getMsg(Global.getKeyFromReply(rowData))
  }
  onDeleteReply(rowData){
      let json = {key:'@'+rowData.user,field:Global.getKeyFromReply(rowData)+'#'+rowData.rtime}
      Alert.alert(
          "Delete",
          "Do you want to delete this message ? ",
          [
              {text:"Cancel" },
              {text:"OK", onPress:()=>{
                  Net.delHash(json);
                  DeviceEventEmitter.emit('refresh:Main.Notify',0);
              }},
          ]
      );
  }
    removeArrayElement(arr, kv) {
        let k=Object.keys(kv)[0]
        for(var i = arr.length; i--;) {
            //alert('key='+k+'\nvalue='+kv[k]+'\n in array:'+(typeof arr[i])+' '+JSON.stringify(arr[i][k]))
            var item = arr[i][k]
            if(arr[i].custom) item=arr[i].custom[k]
            else if(arr[i].custom_content) item=arr[i].custom_content[k]
            if(item === kv[k]) arr.splice(i, 1);
        }
    }
    deletePush(type,id){
        Store.deletePushShared(type,{r:id})
        let list = this.state.push_list //.filter(function(item){ return item.id != id})
        this.removeArrayElement(list,{r:id})
        //alert(this.push_list.length+' '+JSON.stringify(this.push_list))
        this.setState({push_list:list});
    }
    deleteAllPush(){
        Store.deleteShared(Store.PUSH_LIST+":"+this.state.type)
        this.setState({push_list: []})
    }
    deletePushAlert(data){
        let self=this
        let json = typeof data==='object'?data:JSON.parse(data)
        let id=json.r
        if(Platform.OS==='android'){
            if(json.custom&&json.custom.r) id=json.custom.r
            else if(json.custom_content&&json.custom_content.r) id=json.custom_content.r
        }
        let type=json.t
        if(Platform.OS==='android'){
           if(json.custom_content&&json.custom_content.t) type=json.custom_content.t
            else if(json.custom_content&&json.custom_content.t) id=json.custom_content.t
        }
        Alert.alert(
            "Delete",
            "Do you want to delete this push message ? ",
            [
                {text:"Cancel" },
                {text:"OK", onPress:()=>self.deletePush(type,id) },
            ]
        );
    }
    deleteAllPushAlert(){
        Alert.alert(
            "Delete",
            "Do you want to delete all these messages ? ",
            [
                {text:"Cancel" },
                {text:"OK", onPress:()=>this.deleteAllPush() },
            ]
        );
    }
  _renderSwipeoutRow(rowData){
    let rightButton = [{
          text:'Delete',
          backgroundColor:'#ff6f00',
          onPress:()=>this.onDeleteReply(rowData),
        }]
    if(this.share_types.indexOf(rowData.type)<0)
        rightButton = [{
          text:'Delete',
          backgroundColor:'#ff0000',
          onPress:()=>this.deletePushAlert(rowData),
        }]
    return (
      <Swipeout
        //left={rowData.left}
        right={rightButton}
        rowID={rowData.rtime}
        //sectionID={sectionID}
        autoClose={true}
        backgroundColor={'white'}
        //close={!rowData.active}
        //onOpen={(sectionID, rowID) => this._handleSwipeout(sectionID, rowID) }
        //scroll={event => this._allowScroll(event)}
      >
          {this._renderRowView(rowData)}
      </Swipeout>
    )
  }
  _renderShareRowView(rowData) {
    var time = Global.getDateTimeFormat(parseInt(rowData.rtime))
    var bold = rowData.status==='1'? {fontSize:16,fontWeight:'bold',color:'black'}: {fontSize:16}
    return (
      <TouchableHighlight underlayColor='#c8c7cc' onPress={()=>this._onPress(rowData)} >
          <View >
              <View style={{flexDirection: 'row', justifyContent:'center', height:58 }}>
	        <View style={{marginLeft:15,marginRight:6,justifyContent:'center'}}>
                  <Icon 
		    style={{marginLeft:15,marginRight:6}}
		    size={40}
		    color={Style.CAT_COLORS[rowData.cat]}
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
    _renderPushRowView(data) {
        let bold = {fontSize:16,fontWeight:'bold',color:'#666666'}
        let normal={fontSize:16}
        let title='',text_style=bold,name='',time='',key='',json=data
        if(Platform.OS==='ios'){
            //alert('_renderPushRowView()'+JSON.stringify(data))
            if(typeof data==='string') json = JSON.parse(data)
            if(json.i&&json.aps.alert){
              text_style= json.read?normal:bold
              key = json.i
              title = Global.trimTitle(json.aps.alert)
              time = Global.getDateTimeFormat(json.r)
              name = json.n
            }else return
        }else if(Platform.OS==='android'){
            if(json.title&&json.custom&&json.custom.i){ //p2p
              title = Global.trimTitle(json.title)
              text_style= json.custom.read?normal:bold
              key = json.custom.i
              time = Global.getDateTimeFormat(json.custom.r)
              name = json.custom.n
            }else if(json.title&&json.custom_content&&json.custom_content.i){ //local
              title = Global.trimTitle(json.title)
              text_style= normal
              key = json.custom_content.i
              time = Global.getDateTimeFormat(json.custom_content.r)
              name = json.custom_content.n
            }else return
        }
        let type = key.split('_')[0]
        let cat = key.split('_')[1].split(':')[0]
        return (
      <TouchableHighlight underlayColor='#c8c7cc' onPress={()=>this.openPush(json)} >
          <View>
              <View style={{flexDirection: 'row', justifyContent:'center', height:58}}>
                <View style={{marginLeft:15,justifyContent:'center',width:50}}>
                  <Icon
                    //style={{marginLeft:15,marginRight:6}}
                    size={40}
		    color={Style.CAT_COLORS[cat]}
                    name={Global.TYPE_ICONS[type]}
                  />
                </View>
                <View style={{flex:1}}>
                    <View style={{flexDirection:'row',justifyContent:'center',height:16,marginTop:6 }}>
                        <View style={{marginLeft:10}}>
                          <Text>{name}</Text>
                        </View>
                        <View style={{flex:1}}/>
                        <View style={{marginRight:10}}>
                          <Text>{time}</Text>
                        </View>
                    </View>
                    <View style={{flexDirection:'row', justifyContent:'center' }}>
                        <View style={{marginLeft:10,flex:1,justifyContent:'center'}}>
                          <Text style={ text_style }>{title}</Text>
                        </View>
                    </View>
                </View>
              </View>
              <View style={Style.separator} />
          </View>
      </TouchableHighlight>
        );
    }
  renderActionIcon(){
      //<Icon name={'ion-md-trash'} color={'#ffffff'} size={35} onPress={()=>this.deleteAllPushAlert()} />
      return (
             <View style={{flexDirection:'row',}}>
                 {this.renderMore()}
                 <View style={{width:10}} />
             </View>
      )
  }
  renderMoreOption(value,name,icon){
      return (
          <MenuOption value={value} style={{backgroundColor:Style.highlight_color}}>
              <View style={{flexDirection:'row',height:40}}>
                  <View style={{width:30,justifyContent:'center'}}>
                      <Icon name={icon} color={'#ffffff'} size={26} />
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
                {this.renderMoreOption(Store.LOCAL, I18n.t('push_local'),'fa-street-view')}
                    <View style={Style.separator} />
                {this.renderMoreOption(Store.P2P,   I18n.t('push_p2p'),  'fa-comment')}
                    <View style={Style.separator} />
                {this.renderMoreOption(Store.TAG,   I18n.t('push_tag'),'fa-bell')}
                    <View style={Style.separator} />
                {this.renderMoreOption('delete_all',   I18n.t('delete_all'),'fa-trash')}
              </MenuOptions>
            </Menu>
          </View>
      )
  }
  chooseMore(option){
      if(option==='delete_all') this.deleteAllPushAlert()
      else this.load(option)
  }
  _renderRowView(data){
      //let feed_types = ['rss','yql','web','share']
      if(this.share_types.indexOf(data.type)<0){
          return this._renderPushRowView(data)
      }else{
          return this._renderShareRowView(data)
      }
  }
  getTitleName(type){
      if(type===Store.LOCAL) return I18n.t('push_local')
      else if(type===Store.P2P) return I18n.t('push_p2p')
      else if(type===Store.TAG) return I18n.t('push_tag')
  }
  render() {
    //this.all_notes = this.props.mails.concat(this.state.push_list)
    this.all_notes = this.state.push_list
    let ds=this.ds.cloneWithRows(this.all_notes)
    let title = this.getTitleName(this.state.type)
    //alert('title:'+title+' type='+this.state.type+' ')
    return (
        <MenuContext style={{ flex: 1 }} ref={"MenuContext"}>
          <NavigationBar style={Style.navbar} title={{title:title,tintColor:Style.font_colors.enabled}} 
            //leftButton={}
            rightButton= {this.renderActionIcon()}
	  />
          <ListView
              enableEmptySections={true}
              ref={'listview'}
              //pageSize={10}
              //initialListSize={10}
              //stickyHeaderIndices={[]}
              //onEndReachedThreshold={1}
              //scrollRenderAheadDistance={1}
              style={styles.listContainer}
              dataSource={ds}
              renderRow={this._renderSwipeoutRow.bind(this)}
              //renderHeader={this._renderHeader.bind(this)}
              //renderSectionHeader = {this._renderSectionHeader.bind(this)}
              automaticallyAdjustContentInsets={false}
          />
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

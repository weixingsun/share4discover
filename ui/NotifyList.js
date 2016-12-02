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
      this.order_dist_asc='order_dist_asc'
      this.order_time_asc='order_time_asc'
      this.state={
          order:this.order_time_asc,
          push_list:[],
          type:Store.LOCAL,
      }
      //this.share_types = Object.keys(Global.TYPE_ICONS)
      this.updateOnUI=true
  }
  componentWillMount(){
      //this.load()
  }
  componentWillUnmount(){
      this.updateOnUI=false
      DeviceEventEmitter.removeAllListeners('refresh:NotifyList')
  }
  componentDidMount(){
      DeviceEventEmitter.removeAllListeners('refresh:NotifyList')
      DeviceEventEmitter.addListener('refresh:NotifyList',(evt)=>setTimeout(()=>this.load(),500))
      //this.load()
      DeviceEventEmitter.emit('refresh:NotifyList',0);
  }
  load(type){
      if(!type) type=this.state.type
      var self=this;
      //alert(JSON.parse('[,{"a":1}]'))
      let key = Store.PUSH_LIST+":"+type
      Store.getShared(key, function(value){
          //{title:'title',desc:'click to view more',custom:'{\"k1\":\"v1\",\"k2\":\"v2\"}'}
          if(self.updateOnUI && value!=null){
              //console.log('NotifyList.getShared() key='+Store.PUSH_LIST+":"+type+' json='+value)
              try{
                let arr = JSON.parse(value)
                let json= arr.map((item)=>{
                    if(typeof item ==='string') return JSON.parse(item)
                    else return item
                })
                let new_arr = self.reorder(self.state.order,json)
                //console.log('load() value='+value.length)
                self.setState({ 
                    type:type,
                    order:self.order_time_asc,
                    push_list:new_arr,
                })
              }catch(e){
                //let v2 = value.replace(/\\n/g,'').replace(/\\\"/g,"'")
                //let v3 = v2.substr(1,v2.length-2)
                //let str_arr = v3.split(',')
                //console.log('load() exception value='+value.length)
                /*self.setState({
                  type:type,
                  //push_list:[],
                })*/
              }
          }else if(self.updateOnUI){
              //console.log('load() null value='+value.length)
              self.setState({ type:type, push_list:[] })
          }
      })
  }
  getKey(data){  //car_buy:lat,lng:ctime
      let json = typeof data==='string'?JSON.parse(data):data
      let key = json.i
      if(json.custom) key=json.custom.i
      else if(json.custom_content) key=json.custom_content.i
      return key
  }
  getTime(data){
      let key = this.getKey(data)
      let ctime   = key.split(':')[2]
      return parseFloat(ctime)
  }
  getDist(data){
      let key = this.getKey(data)
      let ll   = key.split(':')[1]
      let lat  = ll.split(',')[0], lng = ll.split(',')[1]
      //console.log('Global.region='+Global.region)
      return Global.distance( lat, lng, Global.region.latitude, Global.region.longitude )
  }
  reorder(order,arr){
      if(json && json.length<1) return
      let json = arr?arr:this.state.push_list
      let self=this
      //console.log('unsort_arr='+JSON.stringify(json))
      return json.sort(function(a,b){
          //console.log('inloop order='+order+' dist_order='+self.order_dist_asc+' time_order='+self.order_time_asc)
          if(order===self.order_dist_asc)      return self.getDist(a) - self.getDist(b)
          else if(order===self.order_time_asc) return self.getTime(b) - self.getTime(a)
      })
      //console.log('reorder_arr='+JSON.stringify(json))
      /*this.setState({
          order:order,
          push_list:json,
      })*/
  }
  openPush(json){
      //alert('openPush: '+JSON.stringify(json))
      if(Platform.OS==='ios'){
          //alert('json='+JSON.stringify(json))
          if(json.t===Global.push_p2p||json.t===Global.push_tag){
              if(!json.read)this.readPush(json.t,json.i)
              this.getMsg(json.i)
          }else if(json.t===Global.push_local){
              this.getMsg(json.i)
          }
      }else{
          if(json.custom_content){ //local=msg
              if(json.custom_content.i) this.getMsg(json.custom_content.i)
          }else if(json.custom) { // p2p+tag=push Global.push_p2p Global.push_tag
              if(!json.read&&json.custom.t&&json.custom.r) this.readPush(json.custom.t,json.custom.i)
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
            alert(I18n.t('share_not_exist'))
      });
  }
  readPush(type,id){
      Store.readPushShared(Store.PUSH_LIST+":"+type,{i:id})
      DeviceEventEmitter.emit('refresh:PushList',0);
  }
  _onPress(rowData) {
      //alert('_onPress: '+JSON.stringify(rowData))
      if(!rowData.read)this.readMsg(rowData.id)
      this.getMsg(Global.getKeyFromReply(rowData))
  }
    removeArrayElement(arr, kv) {
        let k=Object.keys(kv)[0]
        for(var i = arr.length; i--;) {
            //alert('key='+k+'\nvalue='+kv[k]+'\n in array:'+(typeof arr[i])+' '+JSON.stringify(arr[i][k]))
            let obj = typeof arr[i]==='string'?JSON.parse(arr[i]):arr[i]
            var item = obj[k]
            if(obj.custom) item=obj.custom[k]
            else if(obj.custom_content) item=obj.custom_content[k]
            if(item === kv[k]) arr.splice(i, 1);
        }
    }
    deletePush(type,id){
        Store.deletePushShared(type,{i:id})
        let list = this.state.push_list //.filter(function(item){ return item.id != id})
        this.removeArrayElement(list,{i:id})
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
        let id=json.i,type=json.t
        if(Platform.OS==='android'){
            if(json.custom&&json.custom.i){
              id=json.custom.i
              type=json.custom.t
            }else if(json.custom_content&&json.custom_content.i){
              id=json.custom_content.i
              type=json.custom_content.t
            }
        }
        //console.log('type='+type+' id='+id+' \ndata='+JSON.stringify(data))
        Alert.alert(
            I18n.t("delete"),
            I18n.t("confirm_delete"),
            [
                {text:I18n.t("no") },
                {text:I18n.t("yes"), onPress:()=>self.deletePush(type,id) },
            ]
        );
    }
    deleteAllPushAlert(){
        Alert.alert(
            I18n.t("delete"),
            I18n.t("delete_all"),
            [
                {text:I18n.t("no") },
                {text:I18n.t("yes"), onPress:()=>this.deleteAllPush() },
            ]
        );
    }
  _renderSwipeoutRow(rowData){
    let rightButton = [{
          text:I18n.t("delete"),
          backgroundColor:'#ff0000',
          onPress:()=>this.deletePushAlert(rowData),
        }]
    return (
      <Swipeout
        //left={rowData.left}
        right={rightButton}
        //rowID={rowData.rtime}
        //sectionID={sectionID}
        autoClose={true}
        backgroundColor={'white'}
        //close={!rowData.active}
        //onOpen={(sectionID, rowID) => this._handleSwipeout(sectionID, rowID) }
        //scroll={event => this._allowScroll(event)}
      >
          {this._renderPushRowView(rowData)}
      </Swipeout>
    )
  }
    _renderPushRowView(data) {
        let bold = {fontSize:16,fontWeight:'bold',color:'#666666'}
        let normal={fontSize:16}
        let title='',text_style=bold,name='',time='',key='',json=data
        if(Platform.OS==='ios'){
            if(typeof data==='string') json = JSON.parse(data)
            if(json.i&&json.aps.alert){
              text_style= json.read?normal:bold
              if(json.t===Global.push_local) text_style=normal
              key = json.i
              title = Global.trimTitle(json.aps.alert)
              time = Global.getDateTimeFormat(Global.getTimeInKey(key))
              name = json.n
            }else return
            //console.log('_renderPushRowView() data='+JSON.stringify(json))
        }else if(Platform.OS==='android'){
            if(json.title&&json.custom&&json.custom.i){ //p2p
              title = Global.trimTitle(json.title)
              text_style= json.custom.read?normal:bold
              key = json.custom.i
              time = Global.getDateTimeFormat(Global.getTimeInKey(key))
              name = json.custom.n
            }else if(json.title&&json.custom_content&&json.custom_content.i){ //local
              title = Global.trimTitle(json.title)
              text_style= normal
              key = json.custom_content.i
              time = Global.getDateTimeFormat(Global.getTimeInKey(key))
              name = json.custom_content.n
            }else return
        }
        let ll   = key.split(':')[1]
        let lat  = ll.split(',')[0], lng = ll.split(',')[1]
        let dist = Global.distanceName( lat, lng, Global.region.latitude, Global.region.longitude )
        let type = key.split('_')[0]
        let cat = key.split('_')[1].split(':')[0]
        //alert('_renderPushRowView()\nkey='+key)
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
                          <Text style={{fontSize:11}}>{time}</Text>
                        </View>
                    </View>
                    <View style={{flexDirection:'row', justifyContent:'center',marginTop:6 }}>
                        <View style={{marginLeft:10,flex:1,justifyContent:'center'}}>
                          <Text style={ text_style }>{title}</Text>
                        </View>
                        <View style={{marginRight:10}}>
                          <Text style={{fontSize:11}}>{dist}</Text>
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
                 <View style={{width:1}} />
             </View>
      )
  }
  renderOrderIcon(){
      return (
             <View style={{flexDirection:'row',}}>
                 <View style={{width:10}} />
                 <Icon name={this.getOrderIcon(this.state.order)} color={'#ffffff'} size={10} />
                 {this.renderOrderMore()}
             </View>
      )
  }
  getOrderIcon(order){
      if(order===this.order_dist_asc) return 'fa-location-arrow'
      else if(order===this.order_time_asc) return 'fa-clock-o'
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
                {this.renderMoreOption(this.order_dist_asc, I18n.t(this.order_dist_asc),this.getOrderIcon(this.order_dist_asc))}
                    <View style={Style.separator} />
                {this.renderMoreOption(this.order_time_asc, I18n.t(this.order_time_asc),this.getOrderIcon(this.order_time_asc))}
              </MenuOptions>
            </Menu>
          </View>
      )
  }
  chooseOrderMore(option){
      let arr = this.reorder(option)
      this.setState({
           type:this.state.type,
           order:option,
           push_list:arr,
      })
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
      //if(this.share_types.indexOf(data.type)<0){
          return this._renderPushRowView(data)
      //}else{
      //    return this._renderShareRowView(data)
      //}
  }
  getTitleName(type){
      if(type===Store.LOCAL) return I18n.t('push_local')
      else if(type===Store.P2P) return I18n.t('push_p2p')
      else if(type===Store.TAG) return I18n.t('push_tag')
  }
  render() {
    //this.all_notes = this.props.mails.concat(this.state.push_list)
    //let ds=this.ds.cloneWithRows(this.state.push_list)
    let title = this.getTitleName(this.state.type)
    //alert('title:'+title+' type='+this.state.type+' ')
    return (
        <MenuContext style={{ flex: 1 }} ref={"MenuContext"}>
          <NavigationBar style={Style.navbar} title={{title:title,tintColor:Style.font_colors.enabled}} 
            leftButton={this.renderOrderIcon()}
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
              dataSource={this.ds.cloneWithRows(this.state.push_list)}
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

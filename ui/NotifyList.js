'use strict';
import React, { Component } from 'react'
import { Alert, DeviceEventEmitter, NativeModules, ListView, Text, View, TouchableHighlight, Image, StyleSheet } from 'react-native';
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
import RssReader from './RssReader';
import YqlReader from './YqlReader';
import FormFeed from './FormFeed';
import SGListView from 'react-native-sglistview';
import Button from 'apsl-react-native-button'

export default class NotifyList extends Component {
  constructor(props) {
      super(props);
      this.ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
      this.all_notes=[]
      this.state={
          feed_list:[],
      }
      this.share_types = Object.keys(Global.TYPE_ICONS)
  }
  componentWillMount(){
      this.load()
  }
  load(){
      var _this=this;
      Store.get(Store.FEED_LIST).then(function(list){
          if(list){
              let sorted = _this.sort(list)
              //alert(JSON.stringify(sorted))
              _this.setState({feed_list: sorted})
              //_this.setState({dataSource: _this.ds.cloneWithRows(list)});
          }
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
  openFeed(json){
      if(json.type==='rss'){
          this.props.navigator.push({
              component: RssReader,
              passProps: {navigator:this.props.navigator,url:json.url},
          });
      }else if(json.type==='yql'){
          this.props.navigator.push({
              component: YqlReader,
              passProps: {navigator:this.props.navigator,json:json},
          });
      }else if(json.type==='web'){
          this.props.navigator.push({
              component: WebReader,
              passProps: {navigator:this.props.navigator,url:json.url},
          });
      }else if(json.type==='share'){
          this.props.navigator.push({
              component: ShareReader,
              passProps: {navigator:this.props.navigator,url:json.url},
          });
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
  readMsg(reply){
      //key='car:lat,lng:ctime#rtime'  value='r1|fb:email|content'
      var key = Global.getKeyFromReply(reply)
      let v = {t:'r0',l:reply.user,c:reply.content}
      var notify_value={key:Global.getNotifyKey(), field:key+'#'+reply.rtime, value:JSON.stringify(v)}
      Net.putHash(notify_value)
      //alert(JSON.stringify(notify_value))
  }
  _onPress(rowData) {
      if(rowData.status==='1')this.readMsg(rowData)
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
    EditFeed(data){
        this.props.navigator.push({
            component: FormFeed,
            passProps: {navigator:this.props.navigator,feed:data,} //refresh:this.load},
        })
    }
    deleteFeed(data){
        Store.deleteFeed(data)
        this.feed_list = this.feed_list.filter(function(name){ return name != data})
        this.setState({dataSource: this.ds.cloneWithRows(this.feed_list)});
    }
    deleteFeedAlert(data){
        let self=this
        Alert.alert(
            "Delete",
            "Do you want to delete this row ? ",
            [
                {text:"Cancel" },
                {text:"OK", onPress:()=>self.deleteFeed(data) },
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
          text:'Modify',
          backgroundColor:'#ff6f00',
          onPress:()=>this.EditFeed(rowData),
        },{
          text:'Delete',
          backgroundColor:'#ff0000',
          onPress:()=>this.deleteFeedAlert(rowData),
        },]
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
  _renderShareRowView(rowData) {
    var time = Global.getDateTimeFormat(parseInt(rowData.rtime))
    var bold = rowData.status==='1'? {fontSize:16,fontWeight:'bold',color:'black'}: {fontSize:16}
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
    _renderFeedRowView(data) {
        let json = JSON.parse(data)
        if(!json.name) return
        let number = ''
        let bold = {fontSize:16,fontWeight:'bold',color:'black'}
        let type = json.type
        let name = Global.trimTitle(json.name)
        return (
      <TouchableHighlight style={Style.notify_row} underlayColor='#c8c7cc'
            onPress={()=>this.openFeed(json)} >
          <View >
              <View style={{flexDirection: 'row', justifyContent:'center', height:58 }}>
                <View style={{marginLeft:15,marginRight:6,justifyContent:'center'}}>
                  <Icon
                    style={{marginLeft:15,marginRight:6}}
                    size={20}
                    //color={this.props.msg.ask=='false'?'blue':'gray'}
                    color={'gray'}
                    name={Global.FEED_ICONS[type]}
                  />
                </View>
                <View style={{marginLeft:10,flex:1,justifyContent:'center'}}>
                    <Text style={ bold }>{name}</Text>
                </View>
                <View style={{marginRight:10,justifyContent:'center'}}>
                    <Text>{number}</Text>
                </View>
              </View>
              <View style={Style.separator} />
          </View>
      </TouchableHighlight>
        );
    }
  renderActionIcon(){
      return <Button style={{height:41,width:50,borderColor:'#5080ff'}} />
  }
  _renderRowView(data){
      //let feed_types = ['rss','yql','web','share']
      if(this.share_types.indexOf(data.type)<0){
          return this._renderFeedRowView(data)
      }else{
          return this._renderShareRowView(data)
      }
  }
  render() {
    //let ds=this.ds.cloneWithRows(this.all_notes)
    this.all_notes = this.props.mails.concat(this.state.feed_list)
    //alert(JSON.stringify(this.all_notes))
    let ds=this.ds.cloneWithRows(this.all_notes)
    //if(this.props.mails!=='') ds = this.ds.cloneWithRows(this.props.mails)
    let title = I18n.t('my')+' '+I18n.t('msgs')
    return (
      <View>
        <NavigationBar style={Style.navbar} title={{title:title,tintColor:Style.font_colors.enabled}} 
            //leftButton={}
            rightButton= {this.renderActionIcon()}
	/>
          <SGListView
              enableEmptySections={true}
              ref={'listview'}
              pageSize={10}
              initialListSize={10}
              stickyHeaderIndices={[]}
              onEndReachedThreshold={1}
              scrollRenderAheadDistance={1}
              style={styles.listContainer}
              dataSource={ds}
              renderRow={this._renderSwipeoutRow.bind(this)}
              //renderHeader={this._renderHeader.bind(this)}
              //renderSectionHeader = {this._renderSectionHeader.bind(this)}
              automaticallyAdjustContentInsets={false}
          />
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

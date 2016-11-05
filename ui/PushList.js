'use strict';
import React, {Component} from 'react'
import {Alert, DeviceEventEmitter, ListView, View, Text, StyleSheet, ScrollView, TouchableOpacity, TouchableHighlight } from 'react-native'
import {Icon} from './Icon'
import Store from '../io/Store'
import Global from '../io/Global'
import Push from '../io/Push';
import Style from './Style'
import NavigationBar from 'react-native-navbar'
//import {parseString} from 'xml2js'
import Swipeout from 'react-native-swipeout';
import FormPush from './FormPush';
import I18n from 'react-native-i18n';

export default class PushList extends React.Component {
    constructor(props) {
      super(props);
      //this.className = 'FeedList'
      this.ds = new ListView.DataSource({
          rowHasChanged: (row1, row2) => row1 !== row2,
          sectionHeaderHasChanged: (s1, s2) => s1 !== s2,
      });
      this.tag_list = []
      this.state = {
          tag_list: [],
      };
      //this.load=this.load.bind(this)
    }
    componentDidMount(){
        DeviceEventEmitter.removeAllListeners('refresh:PushList')
        this.event = DeviceEventEmitter.addListener('refresh:PushList',(evt)=>setTimeout(()=>this.load(),500));
    }
    componentWillUnmount(){
        //this.event.remove();
        DeviceEventEmitter.removeAllListeners('refresh:PushList')
    }
    componentWillMount(){
        this.load();
    }
    load(){
        var self=this;
        Push.listTags((event)=>{
            if(event && event.tags && typeof event.tags ==='object') {
                self.setState({tag_list:event.tags})
            }
        })
    }
    sort(arr){
        let total ={}
        arr.map((item)=>{
          let obj = JSON.parse(item)
          if(total[obj.source]) total[obj.source].push(item)
          else total[obj.source] = [item]
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
    addPush(){
        //http://ctrlq.org/rss/
        this.props.navigator.push({
            component: FormPush,
            passProps: {navigator:this.props.navigator, } //refresh:this.load},
        })
    }
    openPush(json){
    }
    EditPush(json){
        //let json = Global.getJsonFromTagName(data)
        this.props.navigator.push({
            component: FormPush,
            passProps: {navigator:this.props.navigator,push:json,} //refresh:this.load},
        })
    }
    deleteAllTagsAlert(){
        if(this.state.tag_list.length===0) alert('No Push Listener')
        else{
            let total = ''
            this.state.tag_list.map((key)=>{
                let names = key.split('_')
                if(names.length>4){
                    let name = I18n.t(names[3]) +' '+ I18n.t(names[4])
                    total+= ' --> '+name+'\n'
                }
            })
            let self=this
            Alert.alert(
                "Delete",
                "Do you want to delete following push listeners? \n"+total,
                [
                    {text:"Cancel" },
                    {text:"OK", onPress:()=>{
                        self.deleteAllTags()
                    }},
                ]
            );
        }
    }
    deleteAllTags(){
        //alert('clearAllTags() '+JSON.stringify(json))
        this.state.tag_list.map((tag)=>{
            Push.instance.delTag(tag,()=>{})
        })
        this.setState({ tag_list:[] })
    }
    deleteTagAlert(data){
        let self=this
        Alert.alert(
            "Delete",
            "Do you want to delete this row ? ",
            [
                {text:"Cancel" },
                {text:"OK", onPress:()=>{
                    self.delTag(data)
                }},
            ]
        );
    }
    delTag(tag){
        Push.instance.delTag(tag,()=>{})
        let list = this.state.tag_list.filter(function(name){ return name != tag})
        this.setState({tag_list: list});
    }
    _renderSwipeoutRow(rowData){
      let json = Global.getJsonFromTagName(rowData)
      let rightButton = [{
          text:'Modify',
          backgroundColor:'#ff6f00',
          onPress:()=>this.EditPush(json),
        },{
          text:'Delete',
          backgroundColor:'#ff0000',
          onPress:()=>this.deleteTagAlert(rowData),
        },]
      let leftButton = []
        //leftButton = [{
        //    text:'sendNotificationTag',
        //    backgroundColor:'#0000ff',
        //    onPress:()=>this.sendNotificationTag(json),
        //  }
        //]
      return (
      <Swipeout
        left={leftButton}
        right={rightButton}
        rowID={rowData}
        //sectionID={sectionID}
        autoClose={true}
        //backgroundColor={rowData.backgroundColor}
        //close={!rowData.active}
        //onOpen={(sectionID, rowID) => this._handleSwipeout(sectionID, rowID) }
        //scroll={event => this._allowScroll(event)}
      >
          {this._renderRow(json)}
      </Swipeout>
      )
    }
    _renderRow(json) {
        //let json = JSON.parse(data)
        //if(!json.name) return
        let number = ''
        let bold = {fontSize:16,fontWeight:'bold',color:'black'}
        //let source = json.source?json.source:json.type
        let name = I18n.t(json.type) +' '+ I18n.t(json.cat)
        return (
      <TouchableHighlight style={Style.notify_row} underlayColor='#c8c7cc'
            onPress={()=>this.openPush(json)} >
          <View >
              <View style={{flexDirection: 'row', justifyContent:'center', height:58 }}>
                <View style={{marginLeft:15,marginRight:6,justifyContent:'center'}}>
                  <Icon
                    style={{marginLeft:15,marginRight:6}}
                    size={30}
                    //color={this.props.msg.ask=='false'?'blue':'gray'}
                    color={'gray'}
                    name={Global.TYPE_ICONS[json.type]}
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
    render(){
      let title1=I18n.t('push')+' '+I18n.t('list')
      return (
      <View>
          <NavigationBar style={Style.navbar} title={{title:title1,}} 
              leftButton={
                 <View style={{flexDirection:'row',}}>
                    <Icon name={"ion-ios-arrow-round-back"} color={'#333333'} size={40} onPress={() => this.props.navigator.pop() } />
                 </View>
              }
              rightButton={
                 <View style={{flexDirection:'row',}}>
                    <Icon name={'ion-ios-trash-outline'} color={'#333333'} size={36} onPress={()=>this.deleteAllTagsAlert()} />
                    <View style={{width:30}} />
                    <Icon name={'ion-ios-add'} color={'#333333'} size={45} onPress={()=>this.addPush()} />
                    <View style={{width:10}} />
                 </View>
              }
          />
          <ListView
              enableEmptySections={true}      //annoying warning
              style={styles.listViewContainer}
              dataSource={this.ds.cloneWithRows(this.state.tag_list)}
              renderRow={this._renderSwipeoutRow.bind(this)}
              //renderHeader={this._renderHeader.bind(this)}
              //renderSectionHeader = {this._renderSectionHeader.bind(this)}
              automaticallyAdjustContentInsets={false}
              initialListSize={9}
          />
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
        height:Style.DEVICE_HEIGHT-Style.NAVBAR_HEIGHT-Style.BOTTOM_BAR_HEIGHT-20,
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

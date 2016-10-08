'use strict';
import React, {Component} from 'react'
import {Alert, DeviceEventEmitter, ListView, View, Text, StyleSheet, ScrollView, TouchableOpacity, TouchableHighlight } from 'react-native'
import {Icon} from './Icon'
import Store from '../io/Store'
import Global from '../io/Global'
import Style from './Style'
import Loading from './Loading'
import NavigationBar from 'react-native-navbar'
//import {parseString} from 'xml2js'
import Swipeout from 'react-native-swipeout';
import RssReader from './RssReader';
import YqlReader from './YqlReader';
import FormFeed from './FormFeed';

export default class FeedList extends React.Component {
    constructor(props) {
      super(props);
      //this.className = 'FeedList'
      this.ds = new ListView.DataSource({
          rowHasChanged: (row1, row2) => row1 !== row2,
          sectionHeaderHasChanged: (s1, s2) => s1 !== s2,
      });
      this.feed_list = []
      this.state = {
          dataSource:this.ds.cloneWithRows(this.feed_list),
      };
      //this.load=this.load.bind(this)
    }
    componentDidMount(){
        this.event = DeviceEventEmitter.addListener('refresh:FeedList',(evt)=>setTimeout(()=>this.load(),500));
    }
    componentWillUnmount(){
        this.event.remove();
    }
    componentWillMount(){
        this.load();
    }
    emptyDB(){
        let self=this
        Alert.alert(
            "Delete",
            "Do you want to delete all rows ? ",
            [
                {text:"Cancel" },
                {text:"OK", onPress:()=>Store.emptyFeedList() },
            ]
        );
    }
    load(){
        var _this=this;
        //Store.delete(Store.FEED_LIST)
        Store.get(Store.FEED_LIST).then(function(list){
            if(list){
                _this.feed_list = _this.sort(list)
                _this.setState({dataSource: _this.ds.cloneWithRows(_this.feed_list)});
            //}else{
            //  Store.insertFeedData();
            }
        })
        //Store.insertFeedData();
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
    addRss(){
        //http://ctrlq.org/rss/
        this.props.navigator.push({
            component: FormFeed,
            passProps: {navigator:this.props.navigator, } //refresh:this.load},
        })
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
    openJsonAPI(name){
        this.props.navigator.push({
            component: ListJson,
            passProps: {
                navigator:this.props.navigator,
                API_NAME:name,
            },
        });
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
        rowID={rowData}
        //sectionID={sectionID}
        autoClose={true}
        //backgroundColor={rowData.backgroundColor}
        //close={!rowData.active}
        //onOpen={(sectionID, rowID) => this._handleSwipeout(sectionID, rowID) }
        //scroll={event => this._allowScroll(event)}
      >
          {this._renderRow(rowData)}
      </Swipeout>
      )
    }
    _renderRow(data) {
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
    render(){
      //if(this.api_list.length===0) return <Loading />
      //alert(JSON.stringify(this.api_list))
      return (
      <View>
          <NavigationBar style={Style.navbar} title={{title:'Feed List',}} 
              leftButton={
                 <View style={{flexDirection:'row',}}>
                    <Icon name={"ion-ios-arrow-round-back"} color={'#333333'} size={40} onPress={() => this.props.navigator.pop() } />
                 </View>
              }
              rightButton={
                 <View style={{flexDirection:'row',}}>
                    <Icon name={'ion-ios-trash-outline'} color={'#333333'} size={40} onPress={()=>this.emptyDB()} />
                    <View style={{width:20}} />
                    <Icon name={'ion-ios-add'} color={'#333333'} size={45} onPress={()=>this.addRss()} />
                    <View style={{width:10}} />
                 </View>
              }
          />
          <ListView
              enableEmptySections={true}      //annoying warning
              style={styles.listViewContainer}
              dataSource={this.state.dataSource}
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

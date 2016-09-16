'use strict';
import React, {Component} from 'react'
import {Alert, ListView, View, Text, StyleSheet, ScrollView, TouchableOpacity, TouchableHighlight } from 'react-native'
import {Icon} from './Icon'
import Store from '../io/Store'
import Global from '../io/Global'
import Style from './Style'
import Loading from './Loading'
import NavigationBar from 'react-native-navbar'
import {parseString} from 'xml2js'
import Swipeout from 'react-native-swipeout';
import RssReader from './RssReader';
import FormFeed from './FormFeed';

export default class FeedList extends React.Component {
    constructor(props) {
      super(props);
      this.ds = new ListView.DataSource({
          rowHasChanged: (row1, row2) => row1 !== row2,
          sectionHeaderHasChanged: (s1, s2) => s1 !== s2,
      });
      this.feed_list = []
      this.state = {
          dataSource:this.ds.cloneWithRows(this.feed_list),
      };
    }
    componentWillMount(){
        this.load();
        //this.props.event.addListener('feedlist:reload', this.load);
    }
    //componentWillUpdate(){
    //    this.load();
    //}
    load(){
        var _this=this;
        //Store.delete(Store.FEED_LIST)
        Store.get(Store.FEED_LIST).then(function(list){
            if(list){
                _this.feed_list = list
                _this.setState({dataSource: _this.ds.cloneWithRows(list)});
            }else{
                Store.insertFeedData();
            }
        })
        //Store.insertFeedData();
    }
    addRss(){
        //http://ctrlq.org/rss/
        this.props.navigator.push({
            component: FormFeed,
            passProps: {navigator:this.props.navigator, } //refresh:this.load},
        })
    }
    openRss(data){
        let url = data.split('|')[1]
        this.props.navigator.push({
            component: RssReader,
            passProps: {navigator:this.props.navigator,url:url},
        });
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
        //alert(JSON.stringify(data))
        let array = data.split('|')
        let type = array[0]
        let url = array[1]
        let name = array.length===3?array[2]:url
        let number = ''
        let bold = {fontSize:16,fontWeight:'bold',color:'black'}
        return (
      <TouchableHighlight style={Style.notify_row} underlayColor='#c8c7cc'
            onPress={()=>this.openRss(data)} >
          <View >
              <View style={{flexDirection: 'row', justifyContent:'center', height:58 }}>
                <View style={{marginLeft:15,marginRight:6,justifyContent:'center'}}>
                  <Icon
                    style={{marginLeft:15,marginRight:6}}
                    size={30}
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
//<View style={{width:50}} />
//<Icon name={'plus'} size={30} onPress={()=>this.props.navigator.push({component: FormAddJson})} />

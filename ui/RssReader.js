'use strict';
import React, {Component} from 'react'
import {Alert, Image, ListView, NativeModules, View, Text, StyleSheet, ScrollView, TouchableOpacity, TouchableHighlight } from 'react-native'
import {Icon} from './Icon'
import Store from '../io/Store'
import Global from '../io/Global'
import Style from './Style'
import Loading from './Loading'
import NavigationBar from 'react-native-navbar'
import {parseString} from 'xml2js'
import xml2js from 'xml2js'
import xpath from 'xml2js-xpath'
import Swipeout from 'react-native-swipeout';
import SGListView from 'react-native-sglistview';
import Web from './Web'

export default class FeedReader extends React.Component {
    constructor(props) {
      super(props);
      this.ds = new ListView.DataSource({
          rowHasChanged: (row1, row2) => row1 !== row2,
          sectionHeaderHasChanged: (s1, s2) => s1 !== s2,
      });
      //this.lang = NativeModules.RNI18n.locale.replace('_', '-').toLowerCase()
      this.items = []
      this.state = {
          dataSource:this.ds.cloneWithRows(this.items),
          title: '',
          list_height: Style.DEVICE_HEIGHT-Style.NAVBAR_HEIGHT-20,
      };
      
    }
    //_onLayout = event => this.props.appLayout(event.nativeEvent.layout);
        //this.setState({list_height:event.nativeEvent.layout.height-Style.NAVBAR_HEIGHT-20})
    componentWillMount(){
        //Store.insertExampleData();
        this.load();
    }
    load(){
        var _this=this;
        fetch(this.props.url).then(function(result){
            //alert(JSON.stringify(result._bodyText))
            if (result.status===200){ //alert(result._bodyText)
                xml2js.parseString(result._bodyText, function(err,json){
                    _this.feed_list = xpath.find(json, "//item");
                    let title1 = xpath.find(json, "/rss/channel/title")[0];
                    //console.log('title1:'+title1)
                    _this.setState({
                        dataSource: _this.ds.cloneWithRows(_this.feed_list),
                        title: title1==null?'':title1,
                    });
                })
            }
        })
    }
    addRss(){
        //Store.insertFeed('rss','http://news.ifeng.com/rss/index.xml');
    }
    openRss(data){
        this.props.navigator.push({
            component: Web,
            passProps: {navigator:this.props.navigator,url:data.link[0]},
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
    _renderSwipeoutRow(rowData){
      let rightButton = [{
          text:'Delete',
          backgroundColor:'#ff6f00',
          onPress:()=>{
            //let json = {key:'@'+rowData.user,field:Global.getKeyFromReply(rowData)+'#'+rowData.rtime}
            Alert.alert(
              "Delete",
              "Do you want to delete this row ? ",
              [
                {text:"Cancel" },
                {text:"OK", onPress:()=>{
                    Store.delete(rowData)
                }},
              ]
            );
            //alert(JSON.stringify(json))
          }
        }]
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
    renderImage(data){
        let img = data['media:thumbnail']
        if (img!=null)
            return (
                <Image
                    style={{marginLeft:15,marginRight:6,width:60,height:60}}
                    source={{uri:img.url }}
                />
           )
    }
    _renderRow(data) {
        /*
                <View style={{marginLeft:15,marginRight:6,justifyContent:'center'}}>
                   {this.renderImage(data)}
                </View>
        */
        let bold = {fontSize:16,fontWeight:'bold',color:'black'}
        let time = Global.rssDateStr2date(data.pubDate)
        return (
      <TouchableHighlight style={Style.notify_row} underlayColor='#c8c7cc'
            onPress={()=>this.openRss(data)} >
          <View >
              <View style={{flexDirection: 'row', justifyContent:'center', height:58 }}>
                <View style={{marginLeft:10,flex:1,justifyContent:'center'}}>
                    <Text style={ bold }>{data.title}</Text>
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
    render(){
      //if(this.api_list.length===0) return <Loading />
      //alert(JSON.stringify(this.state.list_height))
      //onLayout={this._onLayout}
      return (
      <View>
          <NavigationBar style={Style.navbar} title={{title:this.state.title}}
              leftButton={
                 <View style={{flexDirection:'row',}}>
                    <Icon name={"ion-ios-arrow-round-back"} color={'#333333'} size={40} onPress={() => this.props.navigator.pop() } />
                 </View>
              }
              rightButton={
                 <View style={{flexDirection:'row',}}>
                    <Icon name={'ion-ios-refresh-outline'} color={'#333333'} size={45} onPress={()=>this.load()} />
                    <View style={{width:10}} />
                 </View>
              }
          />
          <SGListView
              enableEmptySections={true}
              ref={'listview'}
              pageSize={10}
              initialListSize={10}
              stickyHeaderIndices={[]}
              onEndReachedThreshold={1}
              scrollRenderAheadDistance={1}
              style={styles.listViewContainer}
              /*{
                  flex: 1,
                  flexDirection: 'column',
                  height:this.state.list_height,
              }}*/
              dataSource={this.state.dataSource}
              renderRow={this._renderRow.bind(this)}
              //renderHeader={this._renderHeader.bind(this)}
              //renderSectionHeader = {this._renderSectionHeader.bind(this)}
              automaticallyAdjustContentInsets={false}
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
        height:Style.DEVICE_HEIGHT-Style.NAVBAR_HEIGHT-20,
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

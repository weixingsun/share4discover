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
import jsonpath from '../io/jsonpath'
import Swipeout from 'react-native-swipeout';
import SGListView from 'react-native-sglistview';
import Web from './Web'
import ForceView from './ForceView'

export default class YqlReader extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
          title: this.props.json.name,
          data: [],
          view_height: Style.DEVICE_HEIGHT-Style.NAVBAR_HEIGHT-20,
      };
      this.path='$.query.results'
    }
    componentWillMount(){
        this.load();
    }
    //select * from yahoo.finance.xchange where pair in ("USDCNY","USDNZD")
    load(){
        var _this=this;
        var prefixUrl = 'http://query.yahooapis.com/v1/public/yql?q=';
        var suffixUrl = '&format=json&env=store://datatables.org/alltableswithkeys';
        //var suffixUrl = '&format=xml&env=store://datatables.org/alltableswithkeys';
        var url = prefixUrl+encodeURI(this.props.json.yql)+suffixUrl;
        fetch(url).then(function(result){
            //alert(JSON.stringify(result._bodyText))
            if (result.status===200){ //alert(JSON.stringify(result))
                /*xml2js.parseString(result._bodyText, function(err,json){
                    let results = xpath.find(json, "/query/results")[0];
                    let keys = Object.keys(results)
                    //_this.feed_list = results[keys[0]]
                    //alert(JSON.stringify(_this.feed_list))
                    _this.setState({
                        data: results[keys[0]],
                    });
                })*/
                //var list = jsonpath({json: result.json(), path: _this.path});//responseData.query.results.rate
                _this.setState({
                    data: JSON.parse(result._bodyText).query.results
                });
            }
        })
    }
    open(data){
        //this.props.navigator.push({
        //    component: Web,
        //    passProps: {navigator:this.props.navigator,url:data.link[0]},
        //});
        alert(JSON.stringify(data))
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
        //let time = Global.rssDateStr2date(data.)
        let keys = Object.keys(data)
        let values = keys.map((key)=>{return data[key]})
        //alert('keys='+JSON.stringify(keys)+'\nvalues='+JSON.stringify(values))
        return (
      <TouchableHighlight style={Style.notify_row} underlayColor='#c8c7cc'
            onPress={()=>this.open(data)} >
          <View >
              <View style={{flexDirection: 'row', justifyContent:'center', height:58 }}>
                {this.renderRowValues(values)}
              </View>
              <View style={Style.separator} />
          </View>
      </TouchableHighlight>
        );
    }
    renderRowValues(values){
        return values.map((value,id)=>this.renderRowCell(id,value))
    }
    renderRowCell(id,value){
        let bold = {fontSize:16,fontWeight:'bold',color:'black'}
        let text = typeof value ==='string'?value:JSON.stringify(value)
        return (
                <View key={id} style={{alignItems:'center',justifyContent:'center'}}>
                    <Text style={ bold }>{text}</Text>
                </View>)
    }
    render(){
      //if(this.api_list.length===0) return <Loading />
      //alert(JSON.stringify(this.state.data))
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
          <ForceView data={this.state.data} />
      </View>
      );
    }
}
/*
          <SGListView
              enableEmptySections={true}
              ref={'listview'}
              pageSize={10}
              initialListSize={10}
              stickyHeaderIndices={[]}
              onEndReachedThreshold={1}
              scrollRenderAheadDistance={1}
              style={styles.listViewContainer}
              dataSource={this.state.dataSource}
              renderRow={this._renderRow.bind(this)}
              //renderHeader={this._renderHeader.bind(this)}
              //renderSectionHeader = {this._renderSectionHeader.bind(this)}
              automaticallyAdjustContentInsets={false}
          />
*/
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

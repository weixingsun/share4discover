'use strict'
import React, {Component} from 'react';
import {Alert, ScrollView, Text, Image, StyleSheet, TouchableOpacity, View, ListView,} from 'react-native';
import jsonpath from '../io/jsonpath'
import Store from '../io/Store'
import Style from './Style'
import AddJson from './AddJson'
import FormEditJson from './FormEditJson'
import NavigationBar from 'react-native-navbar'
import IIcon from 'react-native-vector-icons/Ionicons'
import FIcon from 'react-native-vector-icons/FontAwesome'

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

//title:'My Exchange Rates Watch List'
//xchange: 'select * from yahoo.finance.xchange where pair in (' + items + ')'
//weather: 'select * from weather.forecast where (location = 94089)'
//stock:   'select * from yahoo.finance.quote where symbol in (' + items + ')'
//path:    '$.query.results.rate[*]'   //'$.query.results.rate'
//field:   'Name,Rate,Date,Time,Ask,Bid'   //default all
//timer:   3

//API_NAME: exchange
//value: {"list":"USDCNY,USDAUD", "yql":"select * from yahoo.finance.xchange where pair in ", "path":"$.query.results.rate", "title":"My Exchange Rates Watch List"}
export default class ListJson extends React.Component{
    constructor(props){
        super(props);
        this.ds = new ListView.DataSource({
            rowHasChanged: (row1, row2) => row1 !== row2,
            sectionHeaderHasChanged: (s1, s2) => s1 !== s2,
        });
        //this.foods = [ 'USDCNY','USDNZD','USDAUD' ];
        this.foods = [];
        this.fields = []; // 'Name,Rate,Date,Time,Ask,Bid'
        this.yql = '';
        this.path = null;
        this.subpath = null;
        this.title = '';
        this.column_width = 0;
        this.filter = null;
        this.state = {
            editable: false,
            timerEnabled: false,
            dataSource: this.ds.cloneWithRows(this.foods),
        };
        this.seq=0,
        this.reload=this.reload.bind(this);
        this._renderRow=this._renderRow.bind(this);
        this.parser=this.getYQLjsonpath.bind(this);
        this.switchEdit=this.switchEdit.bind(this);
        this.getLockIcon=this.getLockIcon.bind(this);
    }
    componentWillMount() {
        var _this=this;
        //Store.save('exchange_yql', {"list":"USDCNY,USDAUD", "yql":"select * from yahoo.finance.xchange where pair in ", "path":"$.query.results.rate", "title":"My Exchange Rates Watch List"});
        //Store.save('exchange_yql', {"filter":"USDCNY,USDNZD", "yql":'select * from yahoo.finance.xchange where pair in ("USDCNY","USDNZD")', "path":"$.query.results.rate", "title":"My Exchange Rates YQL API"});
        //Store.save('exchange_url',{"filter":"USD/CNY,USD/NZD", "url":"http://finance.yahoo.com/webservice/v1/symbols/allcurrencies/quote?format=json&view=basic", "path":"$.list.resources","subpath":"$.resource.fields", "title":"My Exchange Rates URL API"});
        //Store.insertExampleData();
        Store.get(this.props.API_NAME).then((value) => {
          if(value !=null){
              _this.foods= value.filter.split(',')
              if(value.yql != null){
                 _this.yql= value.yql
                 _this.parser=_this.getYQLjsonpath.bind(_this);
              }else{
                 _this.url= value.url
                 _this.parser=_this.getURLjsonpath.bind(_this);
              }
              _this.path= value.path
              _this.subpath= value.subpath
              _this.filter= value.filter
              _this.title= value.title
              _this.reload();
          }
        });
    }
    componentDidMount() {
        this.reload();
        this.timer = setInterval(() => {
          //console.log('I am a background timer!');
        }, 60000);
    }
    componentWillUnmount() {
        clearInterval(this.timer);
    }
    setTimer(seconds, func){
        this.timer = setInterval(() => {
            func();
        }, seconds);
    }
    dummy(){ }
    enableTimer(){
      if(this.state.timerEnabled){
          clearInterval(this.timer);
          this.setState({timerEnabled:false});
          this.setTimer(5000,this.dummy);
      }else{
          clearInterval(this.timer);
          this.setState({timerEnabled:true});
          this.setTimer(5000,this.reload);
      }
    }
    getColor(enable){
        if(enable) return '#3B3938';
        else return '#D3D3D3';
    }
    //['USDCNY','USDNZD']
    arrayToStr(array){
        var str_items = '';
        for (var i in array) {
          str_items += '"'+array[i]+'",';
        }
        return str_items.slice(0, -1);
    }
    getYQLjsonpath(array){
        if(this.yql==null) return;
        //var items = this.arrayToStr(array);
        //var sql = this.yql+' (' + items + ')';
        var prefixUrl = 'http://query.yahooapis.com/v1/public/yql?q=';
        var suffixUrl = '&format=json&env=store://datatables.org/alltableswithkeys';
        var URL = prefixUrl+encodeURI(this.yql)+suffixUrl;
        fetch(URL).then((response) => response.json()).then((responseData) => {
            var rates = JSONPath({json: responseData, path: this.path});//responseData.query.results.rate
            var list = rates[0];
            if(typeof list[0] == 'undefined'){   //check if it is a leaf, caused by some APIs drop [] with a single record
              list = rates;
            }
            this.fields =Object.keys(list[0]);
            this.column_width = Style.CARD_WIDTH / this.fields.length;
            this.setState({
                dataSource: this.state.dataSource.cloneWithRows(list),
            });
        })
        .catch((error) => {
          //alert('Network Error: '+error.description)
        })
        .done();
    }
    filterLoop(list, selectedList){
        var selects = selectedList.split(',')
        var filterList = []
        //Object.keys(obj).forEach(function(key) {
        for (var i = 0; i < list.length; i++) {
            var item = JSONPath({json: list[i], path: this.subpath})[0];
            for (var j = 0; j < selects.length; j++) {
                if(JSON.stringify(item).indexOf( selects[j]) >-1)  filterList.push(item);
            }
        }
        //alert(" filterList:"+ JSON.stringify(filterList));
        return filterList;
    }
    getURLjsonpath(array){
        if(this.url==null) return;
        var items = this.arrayToStr(array);
        fetch(this.url).then((response) => response.json()).then((responseData) => {
            var rates = JSONPath({json: responseData, path: this.path});//$.list.results.rate
            var list = rates[0];
            var item;
            if(this.subpath==null) item=list[0]
            else if(typeof list[0] == 'undefined') list = rates; //check if it is a leaf, caused by some APIs drop [] with a single record
            else item = JSONPath({json: list[0], path: this.subpath})[0];
            //alert('item:'+JSON.stringify(item));
            this.fields =Object.keys(item);
            this.column_width = Style.CARD_WIDTH / this.fields.length;
            var list2 = this.filterLoop(list, this.filter)
            this.setState({
                dataSource: this.state.dataSource.cloneWithRows(list2),
                //dataSource: this.state.dataSource.cloneWithRowsAndSections(list),
            });
        })
        .catch((error) => {
        //  alert('Network Error: '+error.description)
        })
        .done();
    }
    //shouldComponentUpdate(nextProps,nextState){
    //    return (nextState.count !==this.state.editable);
    //}
    switchEdit(){
        if(this.state.editable){
          this.setState({editable: false})
          this.reload();
        }else{
          this.setState({editable: true})
        }
    }
    incSeq(){
        if(this.seq==this.foods.length-1){
          this.seq=0;
        }else{
          this.seq++;
        }
    }
    deleteItem(seq,name){
        Alert.alert(
          "Delete",
          "Do you want to delete "+name+" ?",
          [
            {text:"Cancel", },
            {text:"OK", onPress:()=>{
              this.foods.splice(seq,1);
              this.reload();
            }},
          ]
        );
    }
    getLockIcon(){
        if(!this.state.editable) return 'ios-locked-outline'
        return 'ios-unlocked-outline'
    }
    reload(){
        if(this.foods.length>0){
          this.parser(this.foods);
        }
    }
    _renderDeleteButton(id,name){
        if(this.state.editable)
            return <IIcon name="minus-circled" size={30} color="#C00" onPress={()=>this.deleteItem(id,name)} />
        else return null;
    }
    _renderRow(data, sectionID, rowID) {
        this.incSeq();
        var item; 
        if(this.filter != null) item= data
        else item= JSONPath({json: data, path: this.subpath})[0];
        let Arr = this.fields.map((k, n) => {
            return <View key={n} style={{ height:Style.CARD_ITEM_HEIGHT, width:this.column_width, alignItems:'center', justifyContent: 'center', }}>
                     <Text>{ JSONPath({path: '$.'+k, json: item}) }</Text>
                   </View>
        })
	return (
          <View style={Style.card}>
            <TouchableOpacity style={{flex:1}} /*onPress={()=>{
                                                 this.props.navigator.push({
                                                     component: Web,
                                                     passProps: {url:'http://'+data.url},
                                                 });
                                               }}*/
            >
              <View style={{flexDirection:'row'}}>
                { Arr }
              </View>
            </TouchableOpacity>
            {this._renderDeleteButton(this.seq-1,data.Name)}
          </View>
        );
    }
    _renderHeader() {
        let Arr = this.fields.map((k, n) => {
            return <View key={n} style={{ height:Style.LIST_HEADER_HEIGHT, width:this.column_width, alignItems:'center', justifyContent: 'center', }}>
                     <Text>{ k }</Text>
                   </View>
        })
	return (
            <View style={styles.header}>
              <View style={{flexDirection:'row'}}>
                { Arr }
              </View>
            </View>
        );
    }
    _renderSectionHeader(sectionData, sectionID) {
      return (
        <View style={styles.header}>
          <Text style={styles.sectionText}>{sectionID}</Text>
        </View>
      )
    }
    render() {
        return(
        <View style={{flex:1}}>
          <NavigationBar style={Style.navbar} title={{title: 'Edit API Configuration'}}
             leftButton={
                <View style={{flexDirection:'row',}}>
                  <IIcon name={"ios-arrow-back"} color={'#333333'} size={30} onPress={() => this.props.navigator.pop() } />
                  <View style={{width:50}} />
                  <IIcon name={"ios-timer-outline"} color={this.getColor(this.state.timerEnabled)} size={30} onPress={() => this.enableTimer() } />
                </View>
             }
             rightButton={
               <View style={{flexDirection:'row',}}>
                  <FIcon name={"edit"} color={'#333333'} size={30} onPress={() => this.props.navigator.push({component: FormEditJson, passProps: {name: this.props.API_NAME} }) } />
                </View>
             }
          />
          <View style={styles.container}>
            <ListView
                enableEmptySections={true}      //annoying warning
                style={styles.listViewContainer}
                dataSource={this.state.dataSource}
                renderRow={this._renderRow.bind(this)}
                renderHeader={this._renderHeader.bind(this)}
                //renderSectionHeader = {this._renderSectionHeader.bind(this)}
                automaticallyAdjustContentInsets={false}
                initialListSize={9}
            />
          </View>
        </View>
        )
    }
};
//<IIcon name={this.getLockIcon()} size={30} onPress={() => this.switchEdit()} />

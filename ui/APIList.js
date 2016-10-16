'use strict';
import React, {Component} from 'react'
import {ListView, View, Text, StyleSheet, ScrollView, TouchableOpacity, } from 'react-native'
import {Icon} from './Icon'
import Store from '../io/Store'
import Style from './Style'
import Loading from './Loading'
import ListJson from './ListJson'
import FormAddJson from './FormAddJson'
import NavigationBar from 'react-native-navbar'

export default class APIList extends React.Component {
    constructor(props) {
      super(props);
      this.api_list = [];
      //this.seq=0;
      this.ds = new ListView.DataSource({
          rowHasChanged: (row1, row2) => row1 !== row2,
          sectionHeaderHasChanged: (s1, s2) => s1 !== s2,
      });
      this.state = {
          editable:false,
          dataSource:this.ds.cloneWithRows(this.api_list),
      };
      this.switchEditMode = this.switchEditMode.bind(this);
      //this.openJsonAPI = this.openJsonAPI.bind(this);
      //this.openWebList = this.openWebList.bind(this);
    }
    componentWillMount(){
        //Store.insertExampleData();
        this.load();
    }
    load(){
        var _this=this;
        Store.get(Store.API_LIST).then(function(list){
            //alert(JSON.stringify(list))
            if(list==null){ 
                Store.insertExampleData();
            }
            _this.setState({dataSource: _this.ds.cloneWithRows(list)});
            _this.api_list = list;
        })
    }
    openWebList(){
        this.props.navigator.push({
            component: ListWeb,
            //passProps: {url:'https://kyfw.12306.cn/otn/leftTicket/init',},
            passProps: {navigator:this.props.navigator,},
        });
    }
    openRssList(){
        this.props.navigator.push({
            component: ListWeb,
            passProps: {navigator:this.props.navigator,},
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
    openAPI(name){
        if(name.indexOf('api:json')>-1){
            this.openJsonAPI(name);
        }
    }
    getLockIcon(){
        if(!this.state.editable) return 'ion-ios-lock-outline'
        return 'ion-ios-unlock-outline'
    }
    switchEditMode(){
        if(this.state.editable) this.setState({editable:false})
        else this.setState({editable:true})
    }
    /*incSeq(){
        if(this.seq==this.api_list.length-1){
          this.seq=0;
        }else{
          this.seq++;
        }
    }*/
    arrayDelete(old_array,name_delete){
        var new_array = [];
        old_array.map((name)=>{
            if(name !== name_delete){
                new_array.push(name)
            }
        })
        return new_array;
    }
    deleteItem(id,name){
        Store.deleteApi(name)
        var new_list = this.arrayDelete(this.api_list,name) 
        this.api_list = new_list;
        this.setState({dataSource: this.ds.cloneWithRows(this.api_list)});
    }
    copyItem(id,name){
        Store.copyApi(name)
        var new_name = name+'-'+this.api_list.length;
        this.api_list.push(new_name)
        //console.log('copyItem():'+new_name)
        this.setState({dataSource: this.ds.cloneWithRows(this.api_list)});
    }
    _renderDeleteButton(id,name){
        if(this.state.editable)
            return <Icon style={{marginRight:15}} name="ion-ios-remove-circle" size={30} color="#C00" onPress={()=>this.deleteItem(id,name)} />
        else return null;
    }
    _renderCopyButton(id,name){
        if(this.state.editable)
            return <Icon style={{marginRight:25}} name="ion-ios-copy-outline" size={30} color="#C00" onPress={()=>this.copyItem(id,name)} />
        else return null;
    }
    _renderRow(data, sectionID, rowID) {
        //this.incSeq();
        return (
          <View style={Style.card}>
            <TouchableOpacity style={{flex:1}} onPress={()=> this.openAPI(data) } >
              <View style={{flexDirection:'row'}}>
                  <Text>{ data }</Text>
              </View>
            </TouchableOpacity>
            {this._renderCopyButton(this.seq,data)}
            {this._renderDeleteButton(this.seq,data)}
          </View>
        );
    }
    render(){
      //if(this.api_list.length===0) return <Loading />
      //alert(JSON.stringify(this.api_list))
      return (
      <View>
          <NavigationBar style={Style.navbar} title={{title:'My API List',}} 
              leftButton={
                 <View style={{flexDirection:'row',}}>
                    <Icon name={"ion-ios-arrow-back"} color={'#333333'} size={30} onPress={() => this.props.navigator.pop() } />
                 </View>
              }
              rightButton={
                 <View style={{flexDirection:'row',}}>
                    <Icon name={this.getLockIcon()} color={'#333333'} size={40} onPress={()=>this.switchEditMode()} />
                 </View>
              }
          />
          <ListView
              enableEmptySections={true}      //annoying warning
              style={styles.listViewContainer}
              dataSource={this.state.dataSource}
              renderRow={this._renderRow.bind(this)}
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

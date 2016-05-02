'use strict';
import React, {ListView, View, Text, StyleSheet, ScrollView, TouchableOpacity, } from 'react-native'
import Icon from 'react-native-vector-icons/Ionicons'
import Store from '../io/Store'
import Style from './Style'
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
          disabled:true,
          dataSource:this.ds.cloneWithRows(this.api_list),
      };
      this.switchEditMode = this.switchEditMode.bind(this);
      //this.openRssList = this.openRssList.bind(this);
      this.openJsonAPI = this.openJsonAPI.bind(this);
      //this.openJsonList2 = this.openJsonList2.bind(this);
      //this.openStockList = this.openStockList.bind(this);
    }
    componentWillMount(){
        this.load();
    }
    load(){
        var _this=this;
        Store.get(Store.API_LIST).then(function(list){
            if(list==null) return;
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
        if(this.state.disabled) return 'ios-locked-outline'
        return 'ios-unlocked-outline'
    }
    switchEditMode(){
        if(this.state.disabled) this.setState({disabled:false})
        else this.setState({disabled:true})
    }
    //incSeq(){
    //    if(this.seq==this.api_list.length-1){
    //      this.seq=0;
    //    }else{
    //      this.seq++;
    //    }
    //}
    _renderRow(data, sectionID, rowID) {
        //this.incSeq();
        return (
          <View style={Style.card}>
            <TouchableOpacity style={{flex:1}} onPress={()=> this.openAPI(data) } >
              <View style={{flexDirection:'row'}}>
                  <Text>{ data }</Text>
              </View>
            </TouchableOpacity>
          </View>
        );
        //{this._renderDeleteButton(this.seq-1,data.Name)}
    }
    render(){
      return (
      <View>
          <NavigationBar style={Style.navbar} title={{title:'My API List',}} 
              leftButton={
                 <View style={{flexDirection:'row',}}>
                    <Icon name={"close"} color={'#333333'} size={30} onPress={() => this.props.navigator.pop() } />
                 </View>
              }
              rightButton={
                 <View style={{flexDirection:'row',}}>
                    <Icon name={this.getLockIcon()} color={'#333333'} size={30} onPress={()=>this.switchEditMode()} />
                    <View style={{width:50}} />
                    <Icon name={'plus'} size={30} onPress={()=>this.props.navigator.push({component: FormAddJson})} />
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

'use strict';
import React, {View, Text, StyleSheet, ScrollView, TouchableOpacity, } from 'react-native'
import Icon from 'react-native-vector-icons/Ionicons'
import Store from '../io/Store'
import Style from './Style'
import ListJson from './ListJson'
import FormAddJson from './FormAddJson'
import NavigationBar from 'react-native-navbar'

export default class APIList extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
          disabled:true,
          api_list:null,
      };
      this.switchEditMode = this.switchEditMode.bind(this);
      //this.openRssList = this.openRssList.bind(this);
      //this.openJsonList = this.openJsonList.bind(this);
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
            _this.setState({api_list:list});
            //console.log('load:'+JSON.stringify(list));
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
    openYQLJsonAPI(){
        this.props.navigator.push({
            component: ListJson,
            passProps: {
                navigator:this.props.navigator,
                API_NAME:'exchange_yql',
            },
        });
    }
    openURLJsonAPI(){
        this.props.navigator.push({
            component: ListJson,
            passProps: {
                navigator:this.props.navigator,
                API_NAME:'exchange_url',
            },
        });
    }
    openStockList(){
        this.props.navigator.push({
            component: ListJson,
            passProps: {
                navigator:this.props.navigator,
                API_NAME:'exchange_url',
            },
        });
    }
    getLockIcon(){
        if(this.state.disabled) return 'ios-locked-outline'
        return 'ios-unlocked-outline'
    }
    switchEditMode(){
        if(this.state.disabled) this.setState({disabled:false})
        else this.setState({disabled:true})
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
          <View style={Style.map}>
                  <TouchableOpacity style={Style.card} onPress={this.openWebList} >
                    <Text style={{fontWeight: 'bold'}}>My Web List</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={Style.card} onPress={this.openRssList} >
                    <Text style={{fontWeight: 'bold'}}>My RSS List</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={Style.card} onPress={this.openYQLJsonAPI.bind(this)} >
                    <Text style={{fontWeight: 'bold'}}>My Exchange YQL API</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={Style.card} onPress={this.openURLJsonAPI.bind(this)} >
                    <Text style={{fontWeight: 'bold'}}>My Exchange URL API</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={Style.card} onPress={this.openStockList} >
                    <Text style={{fontWeight: 'bold'}}>My Stock List </Text>
                  </TouchableOpacity>
          </View>
        </View>
        );
    }
}

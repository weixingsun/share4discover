'use strict';
import React, { Component } from 'react'
import NavigationBar from 'react-native-navbar';
import {ListView, NetInfo, Text, View, TouchableHighlight, Image, } from 'react-native';
import Net from "../io/Net"
import Global from "../io/Global"
import Store from "../io/Store"
import {Icon} from './Icon'
import Filter from "./Filter"
import Style from "./Style"
import Main from "./Main"
import FormAddMsg from './FormAddMsg'

export default class NotifyList extends Component {
  constructor(props) {
      super(props);
      this.ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
      this.state = {
          filters: this.props.filters,
          accessToken: false,
          refresh: false,
	  dataSource: this.ds.cloneWithRows([]),
      };
      this.logins='';
  }
  componentWillMount() {
      this.checkLogin('user_fb')
      this.checkLogin('user_gg')
      //this.mainlogin = Global.getMainLogin(this.logins)
      //this.loadNotify(this.mainlogin);
  }
  loadNotifyByLogin(){
      this.mainlogin = Global.getMainLogin(this.logins)
      //alert('mainlogin:'+this.mainlogin+'\nlogins:'+this.logins)
      this.loadNotify(this.mainlogin);
      //this.setState({refresh:true})
  }
  comparefilters(){
    if(this.props.filters === this.state.filters) return true;
    else return false;
  }
  checkLogin(type){
      var self = this
      Store.get(type).then(function(user){  //{type,email}
          if(user != null){
              self.logins = self.logins===''? user.type+':'+user.email:self.logins+','+user.type+':'+user.email
	      self.setState({refresh:false})
          }
      });
  }
  /**
   * refreshing
   * @param {number} page Requested page to fetch
   * @param {function} callback Should pass the rows
   * @param {object} options Inform if first load
   */
  loadNotify(key) {
    var self = this;
    Net.getNotify(key).then((rows)=> {
      var keys = Object.keys(rows)
      var arr = []
      keys.map((key)=>{      //key='car:lat,lng:time'  value='1|fb:email|content'
	  var key_arr = key.split(':')
	  var type   = key_arr[0]
	  var latlng = key_arr[1]
	  var time   = key_arr[2]
	  var value_arr = rows[key].split('|')
	  var status = value_arr[0]
	  var user = value_arr[1]
	  var content = value_arr[2]
	  var obj = {type:type, latlng:latlng, time:time, status:status, user:user, content:content }
          arr.push( obj )
      })
      self.setState({ 
	      dataSource: self.ds.cloneWithRows(arr), 
	      refresh:true,
      });
    })
    /*.catch((e)=>{
        alert('Network Problem!')
    });
    */
  }
  _onPress(rowData) {
    alert(JSON.stringify(rowData))
    /*this.props.navigator.push({
        component: Detail,
        passProps: { 
            msg:rowData,
        }
    });*/
  }
  _renderRowView(rowData) {
    var time = new Date(parseInt(rowData.time)).toLocaleString()
    return (
      <TouchableHighlight style={Style.row} underlayColor='#c8c7cc' 
            onPress={()=>this._onPress(rowData)} >
          <View >
              <View style={{flexDirection: 'row', height: 48, justifyContent:'center' }}>
                <Icon 
		    style={{marginLeft:15,marginRight:6}}
		    size={40}
		    //color={this.props.msg.ask=='false'?'blue':'gray'}
		    color={'gray'}
		    name={Global.TYPE_ICONS[rowData.type]}
		/>
	        <View style={{marginLeft:10,flex:1,justifyContent:'center'}}>
                    <Text>{rowData.content}</Text>
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
  render() {
    if(this.logins !== '' && !this.state.refresh) this.loadNotifyByLogin()
    return (
      <View style={Style.absoluteContainer}>
        <NavigationBar style={Style.navbar} title={{title:'',}} 
            leftButton={
                <Icon name={'ion-ios-search'} size={40} onPress={() => this.props.drawer.open()}/>
            }
            //rightButton={
            //    <Icon name={'ion-ios-add'} size={50} onPress={() => this.props.navigator.push({component: FormAddMsg}) }/>
            //} 
	/>
        <ListView 
            dataSource={this.state.dataSource} 
            renderRow={this._renderRowView.bind(this)} 
            enableEmptySections={true} />
      </View>
    );
  }
}

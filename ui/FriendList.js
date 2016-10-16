'use strict';
import React, { Component } from 'react'
import NavigationBar from 'react-native-navbar';
import {ListView, NetInfo, Text, View, TouchableHighlight, Image, } from 'react-native';
import Net from "../io/Net"
import Global from "../io/Global"
import {Icon} from './Icon'
import Filter from "./Filter"
import Style from "./Style"
import Main from "./Main"
//import Drawer from 'react-native-drawer'
//import ControlPanel from './ControlPanel'

export default class ShareList extends Component {
  constructor(props) {
      super(props);
      this.ds= new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
      this.state = {
          filters: this.props.filters,
          accessToken: false,
          isConnected: false,
          dataSource:this.ds.cloneWithRows([]),
      };
      //this.dataSource= this.ds.cloneWithRows([]);
      //this.firstLoad=true
  }
  //componentWillReceiveProps (nextProps) {
    //if(JSON.stringify(nextProps.filters) !==JSON.stringify(this.state.filters)){
      //this.setState({filters: nextProps.filters})
      //this._forceRefresh()
      //alert('this.props='+JSON.stringify(this.props.filters)+'\nnextProps='+JSON.stringify(nextProps.filters)+'\nthis.state='+JSON.stringify(this.state.filters))
    //}
    //this.loadData(nextProps.filters);
  //}
  /*shouldComponentUpdate(nextProps, nextState) {
    var b = this.isConnected
    return b;
  }*/
  componentWillMount() {
      //this.requestFBfriends()
  }
  componentDidMount() {
  //  this.setState({firstLoad:false,})
  //}
  //componentWillUnmount() {
    //NetInfo.isConnected.removeEventListener('change', this.handleConnectivityChange );
  }
  requestFBfriends(){
      if(Global.logins.fb != null){  //login with fb
          let fb_url = 'https://graph.facebook.com/me/friends?access_token='+Global.user_fb.token;
          //let fb_url = 'https://graph.facebook.com/me/invitable_friends?limit=5000&access_token='+Global.user_fb.token;
          //let fb_url = 'https://graph.facebook.com/me/taggable_friends?limit=5000&access_token='+Global.user_fb.token;
          //let fb_url = 'https://graph.facebook.com/me/invitable_friends?limit=50&access_token='+Global.user_fb.token;
          let self=this;
          Net._get(fb_url).then((json)=> {
              //self.setState({dataSource:self.ds.cloneWithRows(json.data)})
          })
      }
  }
  componentDidUpdate(prevProps, prevState){
     this.firstLoad=false
  }
  _onPress(rowData) {
    alert('rowData='+rowData);
  }
  _renderRowView(rowData) {
    var URL = 'http://nzmessengers.co.nz/nz/full/'+rowData.type+'_'+rowData.thumbnail+'.png';
    return (
      <TouchableHighlight style={Style.row} underlayColor='#c8c7cc' 
            onPress={()=>this._onPress(rowData)} >
          <View style={{height: 66}}>
              <View style={{flexDirection: 'row', height: 66}}>
                <Image source={{uri: URL}} style={Style.rowThumbnail} resizeMode={'contain'} />
                <View style={Style.rowTitleView}>
                    <Text style={Style.rowTitleText}>{rowData.title}</Text>
                </View>
              </View>
              <View style={Style.separator} />
          </View>
      </TouchableHighlight>
    );
  }
  render() {
    return (
      <View style={Style.absoluteContainer}>
        <NavigationBar style={Style.navbar} title={{title:'My shares',}} 
            leftButton={
                <Icon name={'ion-ios-search'} size={40} onPress={()=>{} }/>
            }
            rightButton={
                <Icon name={'ion-ios-add'} size={48} onPress={()=>{}}/>
            } />
        <ListView 
            dataSource={this.state.dataSource} 
            renderRow={this._renderRowView.bind(this)} 
            enableEmptySections={true} />
      </View>
    );
  }
}

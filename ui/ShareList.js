'use strict';
import NavigationBar from 'react-native-navbar';
import React, {Component, ListView, NetInfo, Text, View, TouchableHighlight, Image, } from 'react-native';
import JsonAPI from "../io/Net"
const IIcon = require('react-native-vector-icons/Ionicons');
//const FIcon = require('react-native-vector-icons/FontAwesome');
import Filter from "./Filter"
import Style from "./Style"
import Main from "./Main"
//import Drawer from 'react-native-drawer'
//import ControlPanel from './ControlPanel'

export default class ShareList extends Component {
  constructor(props) {
      super(props);
      this.state = {
          filters: this.props.filters,
          accessToken: false,
          isConnected: false,
      };
      this.ds= new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
      this.dataSource= this.ds.cloneWithRows([]);
      this.firstLoad=true
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

  //componentWillMount() {
    //NetInfo.isConnected.addEventListener('change', this.handleConnectivityChange)
    //NetInfo.isConnected.fetch().done((data) => {
    //  this.isConnected= data
    //})
  //}
  //componentDidMount() {
  //  this.setState({firstLoad:false,})
  //}
  //componentWillUnmount() {
    //NetInfo.isConnected.removeEventListener('change', this.handleConnectivityChange );
  //}
  //handleConnectivityChange(change) {
    //this.setState({isConnected: change});
  //}
  componentDidUpdate(prevProps, prevState){
     this.firstLoad=false
  }
  comparefilters(){
    //alert('first:'+this.firstLoad+'\nstate:'+JSON.stringify(this.state.filters)+'\nprops:'+JSON.stringify(this.props.filters))
    if(this.props.filters === this.state.filters) return true;
    else return false;
  }
  /**
   * refreshing
   * @param {number} page Requested page to fetch
   * @param {function} callback Should pass the rows
   * @param {object} options Inform if first load
   */
  reload(filters) {
    var self = this;
    //alert('_onFetch'+JSON.stringify(this.state.filters))
    //alert(this.isConnected)
    JsonAPI.rangeMsg(filters.type,'-43.52,172.62',filters.range).then((rows)=> {
      //console.log(this.state.type+'rows:\n'+JSON.stringify(rows));
      self.dataSource= self.ds.cloneWithRows(rows);
      if(!self.comparefilters() || self.firstLoad) self.setState({filters:self.props.filters})
    })
    .catch((e)=>{
      //_this.isConnected = false
      //_this.setState({dataSource:})
      alert('Network Problem!')
    });
    //JsonAPI.getMsgTypes().then((rows)=> {
    //  this.setState({types:rows});
    //});
  }
  
  /**
   * When a row is touched
   * @param {object} rowData Row data
   */
  _onPress(rowData) {
    //alert('rowData='+rowData);
    this.props.navigator.push({
        component: Main,
        passProps: { 
            page:'ios-world', 
            msg:rowData,
        }
    });
  }
  /**
   * Render a row  // customize this function for prettier view for each row.
   * @param {object} rowData Row data
   */
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
  /*setHeaderViewStyle(){
    if(this.state.typeHeaderHeight===50 ) {
        this.setState({typeHeaderHeight: Style.CARD_HEIGHT, typeIconStyle: styles.rotate270 })
    }else{
        //if(this.refs.picker.isPickerShow) this.refs.picker.hide();
        this.setState({typeHeaderHeight: 50, typeIconStyle: styles.normal, })
    }
  }

  getDynamicStyle(){
    return {
      height: this.state.typeHeaderHeight,
      width: this.state.typeHeaderWidth,
      backgroundColor: 'rgba(200, 200, 200, 0.8)',
    };
  }*/
  render() {
    //alert(JSON.stringify(this.props.filters))
    this.reload(this.props.filters)
    return (
      <View style={Style.absoluteContainer}>
        <NavigationBar style={Style.navbar} title={{title:'',}} 
            leftButton={
                <IIcon name={'navicon'} size={40} onPress={() => this.props.drawer.open()}/>
            }
            rightButton={
                <IIcon name={'plus'} size={33} onPress={() => alert('new!')}/>
            } />
        <ListView 
            dataSource={this.dataSource} 
            renderRow={this._renderRowView.bind(this)} 
            enableEmptySections={true} />
      </View>
    );
  }
}

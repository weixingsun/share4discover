'use strict';
//import GiftedListView from 'react-native-gifted-listview';
import NavigationBar from 'react-native-navbar';
import React, {ListView, StyleSheet, Text, View, TouchableHighlight, Image, TouchableOpacity, Dimensions, Component } from 'react-native';
import JsonAPI from "../io/Net"
//const IIcon = require('react-native-vector-icons/Ionicons');
const FIcon = require('react-native-vector-icons/FontAwesome');
//import ListPopover from './ListPopover'
import Filter from "./Filter"
import Style from "./Style"
//import Detail from "./Detail"
import Main from "./Main"
//import Drawer from 'react-native-drawer'
//import ControlPanel from './ControlPanel'

export default class ShareList extends Component {
  constructor(props) {
      super(props);
      this.ds= new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2}),
      this.state = {
          dataSource: this.ds.cloneWithRows([]),
          filters: this.props.filters,
      };
  }
  //componentWillReceiveProps (nextProps) {
    //if(JSON.stringify(nextProps.filters) !==JSON.stringify(this.state.filters)){
      //this.setState({filters: nextProps.filters})
    //  this._forceRefresh()
      //alert('this.props='+JSON.stringify(this.props.filters)+'\nnextProps='+JSON.stringify(nextProps.filters)+'\nthis.state='+JSON.stringify(this.state.filters))
    //}
    //this.loadData(nextProps.filters);
  //}
  /*shouldComponentUpdate(nextProps, nextState) {
    var b = JSON.stringify(nextProps.filters) !==JSON.stringify(this.state.filters)
    return b;
  }*/

  componentWillMount() {
  }
  /**
   * refreshing
   * @param {number} page Requested page to fetch
   * @param {function} callback Should pass the rows
   * @param {object} options Inform if first load
   */
  reload(filters) {
    var _this = this;
    //alert('_onFetch'+JSON.stringify(this.state.filters))
    JsonAPI.rangeMsg(filters.type,'-43.52,172.62',filters.range).then((rows)=> {
      //console.log(this.state.type+'rows:\n'+JSON.stringify(rows));
      _this.setState({ dataSource: _this.ds.cloneWithRows(rows)});
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
                <FIcon name={'filter'} size={30} onPress={() => this.props.drawer.open()}/>
            }
            rightButton={
                <FIcon name={'plus'} size={30} onPress={() => alert('new!')}/>
            } />
        <ListView 
            dataSource={this.state.dataSource} 
            renderRow={this._renderRowView.bind(this)} 
            enableEmptySections={true} />
      </View>
    );
  }
}

'use strict';
import GiftedListView from 'react-native-gifted-listview';
import NavigationBar from 'react-native-navbar';
import React, { StyleSheet, Text, View, TouchableHighlight, Image, TouchableOpacity, Dimensions, Component } from 'react-native';
import JsonAPI from "../io/Net"
//const IIcon = require('react-native-vector-icons/Ionicons');
const FIcon = require('react-native-vector-icons/FontAwesome');
//import ListPopover from './ListPopover'
import Filter from "./Filter"
import Style from "./Style"
//import Detail from "./Detail"
import Main from "./Main"
import Drawer from 'react-native-drawer'
import ControlPanel from './ControlPanel'

export default class ShareList extends Component {
  constructor(props) {
      super(props);
      this.state = {
          filters: this.props.filters,
      };
  }
  componentWillMount() {
  }
  /**
   * refreshing
   * @param {number} page Requested page to fetch
   * @param {function} callback Should pass the rows
   * @param {object} options Inform if first load
   */
  _onFetch(page = 1, callback, options) {
    JsonAPI.rangeMsg(this.state.filters.type,'-43.52,172.62',this.state.filters.range).then((rows)=> {
      //console.log(this.state.type+'rows:\n'+JSON.stringify(rows));
      callback(rows, {allLoaded: true} );
    });
    JsonAPI.getMsgTypes().then((rows)=> {
      this.setState({types:rows});
    });
    /*
    setTimeout(() => {
      var rows = ['row '+((page - 1) * 3 + 1), 'row '+((page - 1) * 3 + 2), 'row '+((page - 1) * 3 + 3)];
      if (page === 10) {
        callback(rows, {
          allLoaded: true, // the end of the list is reached
        });        
      } else {
        callback(rows);
      }
    }, 1000);*/
  }
  
  /**
   * When a row is touched
   * @param {object} rowData Row data
   */
  _onPress(rowData) {
    //alert('rowData='+rowData);
    this.props.navigator.push({
        //component: Detail,
        //passProps: {
        //    data: rowData,
        //}
        component: Main,
        passProps: { 
            page:'ios-world', 
            msg:rowData,
        }
    });
  }
  _forceRefresh(){
    this.refs.list._refresh(null, {external: true});
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
    alert('render:'+JSON.stringify(this.state.filters))
    return (
      <View style={Style.absoluteContainer}>
        <NavigationBar style={Style.navbar} title={{title:'',}} 
            leftButton={
                <FIcon name={'filter'} size={30} onPress={() => this.props.drawer.open()}/>
            }
            rightButton={
                <FIcon name={'plus'} size={30} onPress={() => alert('new!')}/>
            } />
        <GiftedListView
	  ref='list'
          rowView={this._renderRowView.bind(this)}
          onFetch={this._onFetch.bind(this)}
          firstLoader={true}
          pagination={true}
          refreshable={true}
          withSections={false}
          enableEmptySections={true}      //annoying warnings
        />
      </View>
    );
  }
}

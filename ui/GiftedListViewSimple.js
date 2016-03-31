'use strict';
import GiftedListView from 'react-native-gifted-listview';
import NavigationBar from 'react-native-navbar';
import React, { StyleSheet, Text, View, TouchableHighlight, Image, TouchableOpacity, Dimensions, Component } from 'react-native';
import Rest from "../io/RestAPI"
var RestAPI = new Rest();
//const IIcon = require('react-native-vector-icons/Ionicons');
const FIcon = require('react-native-vector-icons/FontAwesome');
//import ListPopover from './ListPopover'
import Filter from "./Filter"
import Style from "./Style"
//import Detail from "./Detail"
import Main from "./Main"

export default class List extends Component {
  constructor(props) {
      super(props);
      this.state = {
          type: "car",
      };
  }
  /**
   * refreshing
   * @param {number} page Requested page to fetch
   * @param {function} callback Should pass the rows
   * @param {object} options Inform if first load
   */
  _onFetch(page = 1, callback, options) {
    RestAPI.rangeMsg(this.state.type,'-43.52,172.62',5000).then((rows)=> {
      //console.log(this.state.type+'rows:\n'+JSON.stringify(rows));
      callback(rows, {allLoaded: true} );
    });
    RestAPI.getMsgTypes().then((rows)=> {
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
  changeType(type){
    this.setState({
      type: type,
    });
    //console.log('type changed to:'+type);
    this._forceRefresh();
  }
  /**
   * Render a row  // customize this function for prettier view for each row.
   * @param {object} rowData Row data
   */
  _renderRowView(rowData) {
    var URL = 'http://nzmessengers.co.nz/nz/full/'+rowData.type+'_'+rowData.thumbnail+'.png';
    return (
      <TouchableHighlight style={styles.row} underlayColor='#c8c7cc' 
            onPress={()=>this._onPress(rowData)} >
          <View style={{height: 66}}>
              <View style={{flexDirection: 'row', height: 66}}>
                <Image source={{uri: URL}} style={styles.thumbnail} resizeMode={'contain'} />
                <View style={styles.rowTitleView}>
                    <Text style={styles.rowTitleText}>{rowData.title}</Text>
                </View>
              </View>
              <View style={Style.listseparator} />
          </View>
      </TouchableHighlight>
    );
  }
  showPopover() {
    this.setState({isVisible: true});
    this.setHeaderViewStyle();
  }
  closePopover() {
    this.setState({isVisible: false});
    //this._forceRefresh();
  }
  setItem(item) {
    this.setHeaderViewStyle();
    this.setState({type: item});
    this._forceRefresh();
  }
  setHeaderViewStyle(){
    if(this.state.typeHeaderHeight===50 ) {
        this.setState({typeHeaderHeight: Style.CARD_HEIGHT, typeIconStyle: styles.rotate270 })
        //this.refs.picker.show()
    }else{
        //if(this.refs.picker.isPickerShow) this.refs.picker.hide();
        this.setState({typeHeaderHeight: 50, typeIconStyle: styles.normal, })
        //this.refs.picker.hide()
    }
  }
  getDynamicStyle(){
    return {
      height: this.state.typeHeaderHeight,
      width: this.state.typeHeaderWidth,
      backgroundColor: 'rgba(200, 200, 200, 0.8)',
    };
  }
  render() {
    const rightButtonConfig = {
      title: 'Forward',
      handler: () => this.props.navigator.push({
        component: Filter,
      }),
    };
    // //onPress={() => alert('Charmandeeeer!')}/>}
    return (
      <View style={Style.absoluteContainer}>
        <NavigationBar style={Style.navbar} title={{title:'',}} 
            leftButton={
                <FIcon name={'filter'} size={30} onPress={() => this.props.navigator.push({ component: Filter,passProps: {types:this.state.types,selectedType:this.state.type}, callback:(type)=>{this.state.type=type;this.changeType(type); } }) }/>
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
        />
      </View>
    );
  }
}

var styles = {
  row: {
    backgroundColor: 'rgba(255, 255, 255, 1.0)',
    padding: 2,
    height: 68,
    //flex: 1,
    justifyContent: 'center',
    //alignItems: 'center'
  },
  thumbnail: {
    width: 66,
    height: 66, 
  },
  rowTitleView:{
    height: 66,
    //marginBottom: 10,
    justifyContent: 'center',
    //flex:1,
  },
  rowTitleText:{
    fontSize:20,
    marginLeft:10,
    //fontWeight:'bold',
    //marginBottom:10,
  },
  rotate270: {
    transform: [{ rotate: '270deg' }]
  },
  normal:{

  },
};

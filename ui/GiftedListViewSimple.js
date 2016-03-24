'use strict';
import GiftedListView from 'react-native-gifted-listview';
import NavigationBar from 'react-native-navbar';
import React, { StyleSheet, Text, View, TouchableHighlight, Image, TouchableOpacity, Dimensions, Component } from 'react-native';
import RestAPI from "../io/RestAPI"
var NetAPI = new RestAPI();
const IIcon = require('react-native-vector-icons/Ionicons');
const FIcon = require('react-native-vector-icons/FontAwesome');
//import ListPopover from './ListPopover'
import Filter from "./Filter"
import Style from "./Style"
import Detail from "./Detail"

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
    NetAPI.rangeMsg(this.state.type,'-43.52,172.62',5000).then((rows)=> {
      //console.log(this.state.type+'rows:\n'+JSON.stringify(rows));
      callback(rows, {allLoaded: true} );
    });
    NetAPI.getMsgTypes().then((rows)=> {
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
    this.props.navigator.push({
        component: Detail,
        //type:'Normal',
        passProps: {
            data: rowData,
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
      <TouchableHighlight style={styles.row} underlayColor='#c8c7cc' 
            onPress={()=>{this._onPress(rowData)}} >
          <View style={{flexDirection: 'row', height: 66}}>
            <Image source={{uri: URL}} style={styles.thumbnail} resizeMode={'contain'} />
            <View style={styles.rowTitleView}>
                <Text style={styles.rowTitleText}>{rowData.title}</Text>
            </View>
          </View>
      </TouchableHighlight>
    );
  }
  /*getInitialState() {
    return {
      navigator: this.props.navigator,
      types: ['car'],
      type: "car",
      isVisible: false,
      typeHeaderHeight: 50,
      typeHeaderWidth: Style.DEVICE_WIDTH,
      typeIconStyle: styles.normal,
    };
  }*/
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
                <FIcon name={'filter'} size={30} onPress={() => this.props.navigator.push({ component: Filter, }) }/>
            }
            rightButton={
                <IIcon name={'plus'} size={30} onPress={() => alert('new!')}/>
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
  container: {
    //flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 1.0)',
    height: Style.CARD_HEIGHT,
    //alignItems: 'center',
    //justifyContent: 'center',
  },
  navBar: {
    height: 66,
    padding: 2,
    backgroundColor: 'rgba(255, 255, 255, 1.0)',
    //flex:1,
    //flexDirection:'row',
  },
  row: {
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
  typeTitleView:{
    height: 50,
    justifyContent: 'center',
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

module.exports = List;

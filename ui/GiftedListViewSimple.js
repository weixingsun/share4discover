'use strict';
var React = require('react-native');
import GiftedListView from './GiftedListView';
var { StyleSheet, Text, View, TouchableHighlight, Image, TouchableOpacity, Dimensions } = React;
import RestAPI from "../io/RestAPI"
var NetAPI = new RestAPI();
import Picker from 'react-native-picker';
const Icon = require('react-native-vector-icons/FontAwesome');
//var { Option, Select } = require('react-native-selectit');
var {Actions} = require('react-native-router-flux');
//import Selectme from "./Selectme"
//const height = Dimensions.get('window').height;
import Style from "./Style"

var List = React.createClass({
  /**
   * refreshing
   * @param {number} page Requested page to fetch
   * @param {function} callback Should pass the rows
   * @param {object} options Inform if first load
   */
  _onFetch(page = 1, callback, options) {
    //console.log('page='+page+',callback='+JSON.stringify(callback)+',options='+JSON.stringify(options));
    NetAPI.rangeMsg(this.state.type,'-43.52,172.62',5000).then((rows)=> {
      //console.log('remote redis rows:'+JSON.stringify(rows));
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
  },
  
  /**
   * When a row is touched
   * @param {object} rowData Row data
   */
  _onPress(rowData) {
    console.log(rowData+' pressed');
  },
  _forceRefresh(){
    this.refs.list._refresh(null, {external: true});
  },
  /**
   * Render a row  // customize this function for prettier view for each row.
   * @param {object} rowData Row data
   */
  _renderRowView(rowData) {
    //var URL = 'http://nzmessengers.co.nz/nz/thumbnail/'+rowData.type+'_'+rowData.thumbnail+'_64_64.png';
    var URL = 'http://nzmessengers.co.nz/nz/full/'+rowData.type+'_'+rowData.thumbnail+'.jpg';
    console.log(URL);
    return (
      <TouchableHighlight style={styles.row} underlayColor='#c8c7cc' onPress={() => this._onPress(rowData)} >
          <View style={{flexDirection: 'row', height: 66}}>
            <Image source={{uri: URL}} style={styles.thumbnail} resizeMode={'contain'} />
            <View style={styles.rowTitleView}>
                <Text style={styles.rowTitleText}>{rowData.title}</Text>
            </View>
          </View>
      </TouchableHighlight>
    );
  },
  getInitialState: function() {
    return {
      types: ['car'],
      type: "car",
      typeHeaderHeight: 50,
      typeHeaderWidth: Style.DEVICE_WIDTH,
      typeIconStyle: styles.normal,
    };
  },
    _onTypeChange(_type){
        this.setState({type: _type })
        this.setHeaderViewStyle();
        this._forceRefresh();
    },
    openFilter(){
        console.log('openFilter');
        //Actions.selectType();
        this.setHeaderViewStyle();
    },
    setHeaderViewStyle(){
        if(this.state.typeHeaderHeight===50 ) {
            this.setState({typeHeaderHeight: Style.CARD_HEIGHT, typeIconStyle: styles.rotate270 })
            this.refs.picker.toggle()
        }else{
            if(this.refs.picker.isPickerShow) this.refs.picker.hide();
            this.setState({typeHeaderHeight: 50, typeIconStyle: styles.normal, })
            //this.refs.picker.toggle()
        }
    },
    getDynamicStyle(){
      return {
        height: this.state.typeHeaderHeight,
        width: this.state.typeHeaderWidth,
        backgroundColor: 'rgba(200, 200, 200, 0.8)',
      };
    },
  render() {
    return (
      <View style={styles.container}>
        <View style={this.getDynamicStyle()} >
          <View style={{flexDirection:'row', padding: 6}}>
            <Icon name={'filter'} size={40} color='#444' onPress={this.openFilter} style={this.state.typeIconStyle} />
            <View style={styles.typeTitleView}>
                <Text style={styles.rowTitleText}>{this.state.type}</Text>
            </View>
          </View>
          <Picker
            ref="picker"
            style={{ height: 300 }}
            showDuration={300}
            showMask={false}
            pickerData={this.state.types}
            selectedValue={this.state.type}//default to be selected value
            //pickerElevation={99}
            pickerBtnText={'Choose'}
            //pickerTitleStyle={{height:44,}}
            onPickerCancel={this.setHeaderViewStyle}//default to be selected value
            onPickerDone={this._onTypeChange}//when confirm your choice
          />
	</View>
        <GiftedListView
	  ref='list'
          rowView={this._renderRowView}
          onFetch={this._onFetch}
          firstLoader={true} // display a loader for the first fetching
          pagination={true} // enable infinite scrolling using touch to load more
          refreshable={true} // enable pull-to-refresh for iOS and touch-to-refresh for Android
          withSections={false} // enable sections
        />
      </View>
    );
  }
});

var styles = {
  container: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 1.0)',
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

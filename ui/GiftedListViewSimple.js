'use strict';
var React = require('react-native');
var ListPopover = require('react-native-list-popover');
import GiftedListView from './GiftedListView';
var { StyleSheet, Text, View, TouchableHighlight, Image } = React;
import RestAPI from "../io/RestAPI"
var NetAPI = new RestAPI();

var List = React.createClass({
  /**
   * refreshing
   * @param {number} page Requested page to fetch
   * @param {function} callback Should pass the rows
   * @param {object} options Inform if first load
   */
  _onFetch(page = 1, callback, options) {
    //console.log('page='+page+',callback='+JSON.stringify(callback)+',options='+JSON.stringify(options));
    NetAPI.rangeMsg('car','-43.52,172.62',5000).then((rows)=> {
      //console.log('remote redis rows:'+JSON.stringify(rows));
      callback(rows, {allLoaded: true} );
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
      <TouchableHighlight 
        style={styles.row} 
        underlayColor='#c8c7cc'
        onPress={() => this._onPress(rowData)} >
          <View style={{flexDirection: 'row'}}>
            <Image source={{uri: URL}} style={styles.thumbnail} resizeMode={'contain'} />
            <Text>{rowData.title}</Text>
          </View>
      </TouchableHighlight>
    );
  },
  
  render() {
    return (
      <View style={styles.container}>
        <View
	  style={styles.navBar}
	  underlayColor='#c8c7cc'
	  onPress={this._forceRefresh}
	>
	  <Text>Press to Refresh</Text>
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
    backgroundColor: '#FFF',
  },
  navBar: {
    height: 60,
    padding: 6,
    backgroundColor: '#CCC'
  },
  row: {
    padding: 2,
    height: 68,
  },
  thumbnail: {
    width: 64,
    height: 64, 
  },
};

module.exports = List;

'use strict';

var React = require('react-native');
//var GiftedListView = require('react-native-gifted-listview');
import GiftedListView from './GiftedListView';
var { StyleSheet, Text, View, TouchableHighlight } = React;
var Example = React.createClass({
  
  /**
   * refreshing
   * @param {number} page Requested page to fetch
   * @param {function} callback Should pass the rows
   * @param {object} options Inform if first load
   */
  _onFetch(page = 1, callback, options) {
    //console.log('page='+page+',callback='+JSON.stringify(callback)+',options='+JSON.stringify(options));
    setTimeout(() => {
      var rows = ['row '+((page - 1) * 3 + 1), 'row '+((page - 1) * 3 + 2), 'row '+((page - 1) * 3 + 3)];
      if (page === 10) {
        callback(rows, {
          allLoaded: true, // the end of the list is reached
        });        
      } else {
        callback(rows);
      }
    }, 1000); // simulating network fetching
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
   * Render a row
   * @param {object} rowData Row data
   */
  _renderRowView(rowData) {
    return (
      <TouchableHighlight 
        style={styles.row} 
        underlayColor='#c8c7cc'
        onPress={() => this._onPress(rowData)}
      >  
        <Text>{rowData}</Text>
      </TouchableHighlight>
    );
  },
  
  render() {
    return (
      <View style={styles.container}>
        <TouchableHighlight
	  style={styles.navBar}
	  underlayColor='#c8c7cc'
	  onPress={this._forceRefresh}
	>
	  <Text>Press to Refresh</Text>
	</TouchableHighlight>
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
    height: 50,
    padding: 10,
    backgroundColor: '#CCC'
  },
  row: {
    padding: 10,
    height: 44,
  },
};

module.exports = Example;

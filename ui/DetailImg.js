'use strict';

import React from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  Dimensions,
  Image,
  TouchableHighlight,
  TouchableOpacity,
  TouchableNativeFeedback,
} from 'react-native';

import Swiper from 'react-native-swiper'
import ViewPager from 'react-native-viewpager';
//var ViewPager = require('./ViewPager');
var deviceWidth = Dimensions.get('window').width;

var TopScreen = React.createClass({
  getInitialState: function() {
    var dataSource = new ViewPager.DataSource({
      pageHasChanged: (p1, p2) => p1 !== p2,
    });
    let IMGS = this.props.msg.pics.split(',')
    let key = this.props.msg.type+':'+this.props.msg.lat+','+this.props.msg.lng+':'+this.props.msg.ctime
    return {
      dataSource: dataSource.cloneWithPages(IMGS),
      host: 'http://nzmessengers.co.nz/service/info/'+key+'/'
    };
  },

  render: function() {
    return (
      <ViewPager
        style={this.props.style}
        dataSource={this.state.dataSource}
        renderPage={this._renderPage}
        isLoop={true}
        //autoPlay={true}
        onPress={()=>alert('click')}
      />
    );
  },

//<TouchableOpacity onPress={()=>this._onPressButton(pageID)} background={TouchableNativeFeedback.SelectableBackground()}>
//<TouchableHighlight onPress={()=>this._onPressButton(pageID)}>
  _renderPage: function(
    data: Object,
    pageID: number | string,) {
    return (
          <Image
              source={{uri: this.state.host+data}}
              //resizeMode={'cover'}
              style={styles.page} />
    );
  },
  _onPressButton:function(id){
    alert("id:"+id)
  },
});

var styles = StyleSheet.create({
  page: {
    width: deviceWidth,
    //opacity:0,
  },
});

module.exports = TopScreen;

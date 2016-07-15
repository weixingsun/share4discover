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
//import ViewPager from 'react-native-viewpager';
import Global from '../io/Global'
var {H, W} = Dimensions.get('window');

var TopScreen = React.createClass({
  getInitialState: function() {
    let key = Global.getKeyFromMsg(this.props.msg)
    //alert(Global.host_image_info+key+'\n'+this.props.msg.pics+'\ntype:'+typeof this.props.msg.pics)
    let IMGS = this.props.msg.pics.split(',')
    return {
      image_names:IMGS,
      host: Global.host_image_info+key+'/',
    };
  },
  renderPages(){
      return (
          this.state.image_names.map((name,id)=>{
              return (
                  <View key={id} style={styles.slide} title={<Text numberOfLines={1}>{name}</Text>}>
                    <Image resizeMode={'contain'} style={styles.image} source={{uri: this.state.host+name}} />
                  </View>
              )
          })
      )
  },
  render() {
    //loop={true}
    return (
      <View>
        <Swiper style={styles.wrapper} height={300}
          //onMomentumScrollEnd={function(e, state, context){console.log('index:', state.index)}}
          dot={<View style={{backgroundColor:'rgba(0,0,0,.2)', width: 5, height: 5,borderRadius: 4, marginLeft: 3, marginRight: 3, marginTop: 3, marginBottom: 3,}} />}
          activeDot={<View style={{backgroundColor: '#000', width: 8, height: 8, borderRadius: 4, marginLeft: 3, marginRight: 3, marginTop: 3, marginBottom: 3,}} />}
          paginationStyle={{
            bottom: 3, left: null, right: 10,
          }} >
          { this.renderPages() }
        </Swiper>
      </View>
    )
  },
/*
  _onPressButton:function(id){
    alert("id:"+id)
  },
*/
});

var styles = StyleSheet.create({
  wrapper: {
  },

  slide: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'transparent'
  },
  page: {
    width: W,
    //opacity:0,
  },
  image: {
    flex: 1
  },
});

module.exports = TopScreen;

'use strict';

import React from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  Dimensions,
  //Image,
  TouchableHighlight,
  TouchableOpacity,
  TouchableNativeFeedback,
  TouchableWithoutFeedback,
} from 'react-native';

import Image from 'react-native-image-progress';
//import Progress from 'react-native-progress';
import ProgressBar from 'react-native-progress/Bar';
import Swiper from 'react-native-swiper'
//import ViewPager from 'react-native-viewpager';
import Global from '../io/Global'
var {H, W} = Dimensions.get('window');

var TopScreen = React.createClass({
  getInitialState: function() {
    //let key = Global.getKeyFromMsg(this.props.msg)
    let key = this.props.msg.ctime
    //alert(Global.host_image_info+key+'\n'+this.props.msg.pics+'\ntype:'+typeof this.props.msg.pics)
    let IMGS = this.props.msg.pics.split(',')
    return {
      index:0,
      image_names:IMGS,
      host: Global.host_image_info+key+'/',
    };
  },
  handlePressIn(e){
      this.setState({
          StartTime:e.nativeEvent.timeStamp,
          X:e.nativeEvent.pageX,
          Y:e.nativeEvent.pageY,
      })
  },
  handlePressOut(e){
      let end = e.nativeEvent.timeStamp
      let time = end - this.state.StartTime
      let moveX = Math.abs(e.nativeEvent.pageX-this.state.X)
      let moveY = Math.abs(e.nativeEvent.pageY-this.state.Y)
      let move = moveX+moveY;
      //alert('time:'+time+' move:'+move)  //time<80000000 move<40
      if(move<40) {
          //alert('index:'+this.state.index+' file:'+this.state.image_names[this.state.index]+' time:'+time+' move:'+move)
          this.openPicModal();
      }
  },
  renderPages(){
      return (
          this.state.image_names.map((name,id)=>{
              return (
                <TouchableWithoutFeedback key={id} onPressIn={this.handlePressIn}  onPressOut={this.handlePressOut} >
                  <View style={styles.slide} title={<Text numberOfLines={1}>{name}</Text>}>
                    <Image 
                        resizeMode={'contain'}
                        style={styles.image}
                        source={{uri: this.state.host+name}} 
                        indicator={ProgressBar}
                    />
                  </View>
                </TouchableWithoutFeedback>
              )
          })
      )
  },
  openPicModal() {
    if(this.props.openModal) this.props.openModal();
  },
  render() {
    //loop={true}
    return (
      <View>
        <Swiper style={styles.wrapper} height={300} //loop={true}
          onMomentumScrollEnd={(e, state, context)=>{ this.setState({ index:state.index}); this.props.onChange(this.state.image_names[state.index]) }}
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
  modal: {
    //flex:1,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    left:     0,
    top:      0,
  },
});

module.exports = TopScreen;

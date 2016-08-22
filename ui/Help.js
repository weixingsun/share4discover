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

//import Carousel from 'react-native-carousel'
import Image from 'react-native-image-progress';
//import Progress from 'react-native-progress';
import ProgressBar from 'react-native-progress/Bar';
import Swiper from 'react-native-swiper'
import Button from 'apsl-react-native-button'
//import ViewPager from 'react-native-viewpager';
import Global from '../io/Global'
var {H, W} = Dimensions.get('window');

var TopScreen = React.createClass({
  getInitialState: function() {
    let IMGS = ['iphone6_v_help1.png','iphone6_v_help2.png','iphone6_v_help3.png','iphone6_v_help4.png']
    return {
      index:0,
      image_names:IMGS,
      host: Global.host_image_help+'/',
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
      if(move<10) {
          //alert('index:'+this.state.index+' file:'+this.state.image_names[this.state.index]+' time:'+time+' move:'+move)
          this.openPicModal();
      }
  },
  renderPages(){
      //<TouchableWithoutFeedback key={id}> // onPressIn={this.handlePressIn}  onPressOut={this.handlePressOut} >
      return (
          this.state.image_names.map((name,id)=>{
              let text = 'Skip'
              if(id>2) text = 'Start'
              return (
                    <Image key={id}
                        resizeMode={'contain'}  //cover,contain,repeat
                        style={styles.image}
                        source={{uri: this.state.host+name}} 
                        indicator={ProgressBar}
                    >
                        <Button
                            style={{
                                backgroundColor:'#3498db',borderColor:'#2980b9',
                                width:80,height:40,bottom:30,right:10,
                                position: 'absolute',
                            }}
                            onPress={()=>this.props.navigator.pop()}
                        >{text}</Button>
                    </Image>
              )
          })
      )
  },
  render() {
    return (
      <View>
        <Swiper style={styles.wrapper} loop={false}
          dot={<View style={{backgroundColor:'rgba(0,0,0,.2)', width: 10, height: 10,borderRadius: 4, marginLeft: 3, marginRight: 3, marginTop: 3, marginBottom: 3,}} />}
          activeDot={<View style={{backgroundColor: '#000', width: 12, height: 12, borderRadius: 4, marginLeft: 3, marginRight: 3, marginTop: 3, marginBottom: 3,}} />}
          paginationStyle={{
            bottom: 30, //left: null, right: 10,
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

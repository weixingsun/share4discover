import React from "react";
import Dimensions from "Dimensions";

const x = Dimensions.get('window').width;
const y = Dimensions.get('window').height;

const ratioX = x<375 ?(x<320?0.75:0.875):1;
const ratioY = y<568 ?(y<480?0.75:0.875):1;

const base_unit = 16;
const unit = base_unit *ratioX;
const HEADER_HEIGHT = 80;

function em(value){
  return unit * value;
}

module.exports = {
  //General
  DEVICE_WIDTH:x,
  QUARTER_DEVICE_WIDTH:x/4,
  SIX_DEVICE_WIDTH:x/6,
  DEVICE_HEIGHT:y,
  QUARTER_DEVICE_HEIGHT:y/4,
  RATIO_X:ratioX,
  RATIO_Y:ratioY,
  UNIT:em(1),
  PADDING: em(1.25),
  
  //Card
  CARD_WIDTH: x-em(1.25)*2,
  CARD_HEIGHT: (y-em(1.25)*2-HEADER_HEIGHT),
  CARD_ITEM_HEIGHT: 50,
  LIST_HEADER_HEIGHT: 40,
  CARD_PADDING_TOP: em(1.875)+30,
  CARD_PADDING_X: em(1.875),
  CARD_PADDING_Y: em(1.25),

  SEARCH_WIDTH: x-100,

  //Login Button
  LOGIN_BUTTON_WIDTH: x-40,
  LOGIN_BUTTON_HEIGHT: 40,
  
  //Font
  FONT_SIZE: em(1),
  FONT_SIZE_SMALLER: em(0.75),
  FONT_SIZE_SMALL: em(0.875),
  FONT_SIZE_TITLE: em(1.25),
  
  map:{
      position: 'absolute',
      top: 66,
      left: 0,
      right: 0,
      bottom: 50,
  },
  scrollview:{
      flex:1,
  },
  navbar: {
      flex:1,
      backgroundColor: '#ebeef0',
      paddingLeft:12,
      paddingRight:12,
      paddingTop:8,
      paddingBottom:6,
      flexDirection:'row',
      alignItems: 'center',
      //justifyContent: 'center',
      height: 66,
  },
  drawerBar:{
      paddingRight:12,
      paddingTop:8,
  },
  mainbar:{
      backgroundColor: '#ebeef0',
      paddingBottom:10,
      paddingTop:10,
      flexDirection:'row'
  },
  navButton:{
      width: 50,
      alignItems: 'center',
  },
  navTitle:{
      color:'#000000',
      textAlign:'center',
      //fontWeight:'bold',
      flex:1,
      alignItems: 'center',
      fontSize:30,
  },
  detail:{
      position: 'absolute',
      backgroundColor: '#ebeee0',
      //height: 100,
      paddingLeft:12,
      paddingRight:12,
      top: 66,
      left: 0,
      right: 0,
      bottom: y/4*3-66,
  },
  gpsIcon:{
      position: 'absolute',
      width: 50,
      height: 50,
      paddingLeft:12,
      paddingTop:10,
      top: 76,
      left: 10,
  },
  separator: {
    height: 1,
    backgroundColor: '#CCCCCC',
  },
  loginButton:{
    width:  40,
    height: 40,
  },
  card:{
      height: 50,
      justifyContent: 'center',
      alignItems: 'center',
      borderWidth: 1,
      backgroundColor: '#fff',
      borderColor: 'rgba(0,0,0,0.1)',
      margin: 5,
      //padding: 15,
      shadowColor: '#ccc',
      shadowOffset: { width: 2, height: 2, },
      shadowOpacity: 0.5,
      shadowRadius: 3,
      flexDirection:'row',
  },
  left_card:{
      height: 50,
      //justifyContent: 'center',
      alignItems: 'center',
      borderWidth: 1,
      backgroundColor: '#fff',
      borderColor: 'rgba(0,0,0,0.1)',
      margin: 5,
      //padding: 15,
      shadowColor: '#ccc',
      shadowOffset: { width: 2, height: 2, },
      shadowOpacity: 0.5,
      shadowRadius: 3,
      flexDirection:'row',
  },
  slim_card:{
      height: 35,
      justifyContent: 'center',
      alignItems: 'center',
      borderWidth: 1,
      backgroundColor: '#fff',
      borderColor: 'rgba(0,0,0,0.1)',
      margin: 1,
      //marginLeft: 10, //item move to right
      //padding: 15,
      shadowColor: '#ccc',
      shadowOffset: { width: 2, height: 2, },
      shadowOpacity: 0.5,
      shadowRadius: 3,
      flexDirection:'row',
  },
  row: {
    backgroundColor: 'rgba(255, 255, 255, 1.0)',
    padding: 2,
    height: 68,
    //flex: 1,
    justifyContent: 'center',
    //alignItems: 'center'
  },
  rowThumbnail: {
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
  slimRow: {
    flexDirection: 'row',
    padding: 12,
    marginLeft: 1,
    marginRight: 2,
    height: 44,
    borderWidth: 1,
    borderColor: '#AAAAAA',
  },
  selectedRow:{
    flexDirection: 'row',
    padding: 12,
    marginLeft: 1,
    marginRight: 2,
    height: 44,
    backgroundColor: '#AAAAAA',
  },
  textInDark: {
    color:'white',
  },
};

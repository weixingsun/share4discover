import React from "react";
import Dimensions from "Dimensions";

var x = Dimensions.get('window').width;
var y = Dimensions.get('window').height;

const ratioX = x<375 ?(x<320?0.75:0.875):1;
const ratioY = y<568 ?(y<480?0.75:0.875):1;

const base_unit = 16;
const unit = base_unit *ratioX;
const HEADER_HEIGHT = 80;

function em(value){
  return unit * value;
}

module.exports = {
  setLayout: function(layout){
    this.DEVICE_WIDTH=layout.width
    this.DEVICE_HEIGHT=layout.height
  },
  //General
  DEVICE_WIDTH:Dimensions.get('window').width,
  DEVICE_HEIGHT:Dimensions.get('window').height,
  RATIO_X:ratioX,
  RATIO_Y:ratioY,
  UNIT:em(1),
  PADDING: em(1.25),
  NAVBAR_HEIGHT:66,
  BOTTOM_BAR_HEIGHT:50,
  THUMB_HEIGHT:150,
  
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
  main:{
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 50,
  },  
  map_ios:{
      position: 'absolute',
      top: 75,
      left: 0,
      right: 0,
      bottom: 50,
  },
  map_android:{
      position: 'absolute',
      top: 60,
      left: 0,
      right: 0,
      bottom: 50,
  },
  listContainer:{
      flex:1,
      height:this.DEVICE_HEIGHT-this.NAVBAR_HEIGHT-this.BOTTOM_BAR_HEIGHT-20,
  },
  scrollview:{
      flex:1,
  },
  CAT_COLORS:{
      buy:  '#599987',
      sell: '#3a84cc',
      rent0:'#e84a5f',
      rent1:'#2a363b',
      //service:'#000000',
  },
  //font_colors:{disabled:'#777777',enabled:'#dddddd'},
  font_colors:{disabled:'#ffffff',enabled:'#ffffff'},
  //highlight_color: '#598987',
  highlight_color: '#3a84cc',
  normal_color: '#d3d6d9',
  navbar: {
      flex:1,
      //backgroundColor: '#ebeef0',
      //backgroundColor: '#5080ff',
      //backgroundColor: '#8899aa',
      backgroundColor: '#3a84cc',
      paddingLeft:12,
      paddingRight:12,
      paddingTop:6,
      paddingBottom:6,
      flexDirection:'row',
      alignItems: 'center',
      //justifyContent: 'center',
      height: 66,
  },
  bottomBar:{
      backgroundColor: '#ebeef0',
      paddingBottom:10,
      paddingTop:10,
      flexDirection:'row',
      //borderTopWidth:0.3,
      //height:this.BOTTOM_BAR_HEIGHT,
  },
  /*drawerBar:{
      paddingRight:12,
      paddingTop:8,
  },*/
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
      top: this.NAVBAR_HEIGHT,
      left: 0,
      right: 0,
      bottom: y/4*3-this.NAVBAR_HEIGHT,
  },
  gpsIcon:{
      position: 'absolute',
      width: 50,
      height: 50,
      //paddingRight:12,
      //paddingTop:10,
      top: 76,
      left: 20,
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
  left_card_grey:{
      height: 50,
      //justifyContent: 'center',
      alignItems: 'center',
      borderWidth: 1,
      backgroundColor: '#eee',
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
  notify_row: {
    backgroundColor: 'rgba(255, 255, 255, 1.0)',
    padding: 2,
    height: 58,
    //flex: 1,
    justifyContent: 'center',
    //alignItems: 'center'
  },
  rowThumbnail: {
    width: 55,
    height: 55,
  },
  rowTitleView:{
    height: 56,
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
  /////////////////////////// detail page layout /////////////////
  slideSection:{
    //
  },
  detail_card: {
      justifyContent: 'center',
      //alignItems: 'center',
      borderWidth: 1,
      backgroundColor: '#fff',
      borderColor: 'rgba(0,0,0,0.1)',
      marginTop: 5,
      shadowColor: '#ccc',
      //shadowOffset: { width: 2, height: 2, },
      shadowOpacity: 0.5,
      shadowRadius: 3,
      //flexDirection:'row',
      padding: 15,
      //paddingTop:5,
      //paddingBottom:5,
  },
  typeIcon:{
    //
  },
  titleText:{
    //
  },
  ctime:{
  },
  address:{
  },
  ownerSection:{
  },
  contentSection:{
  },
  closeZoomButton:{
     backgroundColor: '#ccc',
     borderRadius: 5,
     padding: 10,
     position: 'absolute',
     right: 10,
     top: 10,
     backgroundColor: 'red',
  },
  modalZoom:{
     position: 'absolute',
     //padding:10,
     //width:x,
     //height:y,
  },
  close: {
    alignItems: 'flex-end',
    justifyContent: 'flex-start',
  },
};

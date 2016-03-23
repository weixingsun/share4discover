'use strict';

var React = require('react-native');
var {View, ListView, Text, StyleSheet, Dimensions, TouchableHighlight} = React;
import Button from 'react-native-button';
//var Actions = require('react-native-router-flux').Actions;
import MapView from 'react-native-maps';
var Style = require('./Style');
const h = Dimensions.get('window').height;
const w = Dimensions.get('window').width;
const Icon = require('react-native-vector-icons/Ionicons');

var Detail = React.createClass( {
    
    goBack() {
        this.props.navigator.pop();
    },
    getInitialState() {
      var msg = this.props.data;
      var lat,lng = 0;
      if(msg!=null){ 
        lat=parseFloat(msg.lat);
        lng = parseFloat(msg.lng);
      }
      return {
          msg: this.props.data,
          region: {    //check on start up
            latitude: lat,
            longitude: lng,
            latitudeDelta: 0.02,
            longitudeDelta: 0.02,
          },
      };
    },
    renderMsgBody(){
        var p = this.props.data;
        for (var key in p) {
          if (p.hasOwnProperty(key)) {
             //(key + " -> " + p[key]);
          }
        }
    },
    render(){
        return (
        <View style={styles.mainContainer}>
            <View style={styles.navbar}>
                 <TouchableHighlight style={styles.navButton} onPress={this.goBack}>
                     <Icon name="ios-arrow-thin-left" color='#3B3938' size={40}/>
                 </TouchableHighlight>
                 <Text style={styles.toolbarTitleText}>{this.state.msg.title}</Text>
                 <TouchableHighlight style={styles.navButton} onPress={this.goBack}>
                     <Icon name="ios-upload-outline" color='#3B3938' size={40}/>
                 </TouchableHighlight>
            </View>
            <View style={styles.content}>
               <View style={styles.card}>
                  <View style={{flex:1,}}>
                    <Text style={styles.toolbarTitleText} >{this.state.content}</Text>
                  </View>
                  <View style={{flex:5}}>
                    <Text>Message content: {JSON.stringify(this.props.data)}</Text>
                  </View>
               </View>
               <View style={styles.map}>
                  <MapView
                    style={styles.map}
                    //initialRegion={this.state.region}
                    region={this.state.region}
                    //mapType=standard,satellite,hybrid
                  />
               </View>
            </View>
        </View>
        );
    }
});
var styles = StyleSheet.create({
    container: {
        flex: 1,
        //position: absolute, top: 0, bottom: 0, left: 0, right: 0
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(240,240,240,0.9)',
        //flexDirection: 'row', 
        padding: 30,
    },
    mainContainer:{
        flex:1                  //Step 1
    },
    content:{
        backgroundColor:'#ebeef0',
        flex:1                //Step 2
    },
    navbar: {
        backgroundColor: Style.NavBarColor,
        paddingTop:30,
        paddingBottom:10,
        flexDirection:'row'    //Step 1
    },
    navButton:{
        width: 50,            //Step 2
    },
    //toolbarTitleView:{
    //    flex:1,
    //    alignItems: 'center',
    //},
    toolbarTitleText:{
        color:'#fff',
        textAlign:'center',
        fontWeight:'bold',
        flex:1,
        alignItems: 'center',
        fontSize:20,
    },
    card: {
      flex: 1,
      //borderWidth: 1,
      //backgroundColor: '#fff',
      //borderColor: 'rgba(0,0,0,0.5)',
      //margin: 5,
      //padding: 50,
      shadowColor: '#ccc',
      //shadowOffset: { width: 2, height: 2, },
      //shadowOpacity: 0.5,
      //shadowRadius: 3,
    },
    row:{
      flexDirection: 'row',
      height: 50,
    },
    map:{
      flex: 1,
      //borderWidth: 1,
      borderColor: 'rgba(0,0,0,0.5)',
      //margin: 5,
      shadowColor: '#ccc',
      //shadowOffset: { width: 2, height: 2, },
      //shadowOpacity: 0.5,
      //shadowRadius: 3,
      width: w-40,
    },
    
});

module.exports = Detail;

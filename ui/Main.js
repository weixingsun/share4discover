import React, {StyleSheet, Text, View, ScrollView, Dimensions, ToastAndroid, Navigator, TouchableOpacity, } from 'react-native'
import ScrollableTabView, { DefaultTabBar, ScrollableTabBar, } from 'react-native-scrollable-tab-view'
//import {Router, Route, Schema, Animations, TabBar} from 'react-native-router-flux'
import {Actions} from 'react-native-router-flux'
import Icon from 'react-native-vector-icons/Ionicons'
import EventEmitter from 'EventEmitter'
import Store from "../io/Store"

import PriceMarker from './PriceMarker'
import TabBarFrame from './TabBar'
import Style from "./Style"
import Loading from "./Loading"
import SettingsList from "./SettingsList"
import GoogleMap from "./GoogleMap"
import GooglePlace from "./GooglePlace"
import GiftedListView from './GiftedListViewSimple'
//import GiftedListView from './GiftedListViewAdvanced';
var mkid = 0,ccid = 0;

const Main = React.createClass({
  getInitialState() {
    return {
      isLoading:true,
      region: {    //check on start up
        latitude: 0,
        longitude: 0,
        latitudeDelta: 10,
        longitudeDelta: 10,
      },
      user: null,  //check on start up
      markers: [],
      circles: [],
    };
  },
  componentWillMount(){
    var _this = this;
    Store.get('region').then((region_value) => {
      _this.setState({ region:region_value });
      Store.get('user').then((user_value) => {
        _this.setState({ user:user_value });
        _this.setState({ isLoading:false, });
      });
      //console.log('isLoading:'+this.state.isLoading+'\n'+JSON.stringify(value));
    });
  },
  render() {
    if(this.state.isLoading) return <Loading />
    var _this = this;
    //console.log('rendering '+JSON.stringify(this.state.region));
    return <View style={styles.container}>
      <ScrollableTabView initialPage={0} renderTabBar={() => <TabBarFrame />}>
        <View tabLabel="ios-paper" style={styles.tabView}>
            <GiftedListView />
        </View>
        <ScrollView tabLabel="person-stalker" style={styles.tabView}>
          <View style={styles.card}>
            <Text>Friends</Text>
          </View>
        </ScrollView>
        <ScrollView tabLabel="ios-chatboxes" style={styles.tabView}>
          <View style={styles.card}>
            <Text>Messenger</Text>
          </View>
        </ScrollView>
        <View tabLabel="ios-world" style={styles.tabView}>
          <View style={styles.card_map}>
	    <GoogleMap region={this.state.region}/>
	    <GooglePlace style={styles.search} />
          </View>
        </View>
        <SettingsList tabLabel="navicon-round" style={styles.tabView} />
      </ScrollableTabView>
    </View>
  },
})
// Using tabBarPosition='overlayTop' or 'overlayBottom' lets the content show through a
// semitransparent tab bar. Note that if you build a custom tab bar component, its outer container
// must consume a 'style' prop (e.g. <View style={this.props.style}) to support this feature.

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 30,
  },
  tabView: {
    flex: 1,
    padding: 10,
    backgroundColor: 'rgba(0,0,0,0.01)',
  },
  username:{
    textAlign: 'center',
    justifyContent: 'center',
    fontSize: 18, 
    fontWeight: 'bold', 
  },
  card: {
    flex: 1,
    borderWidth: 1,
    flexDirection:'row',
    //backgroundColor: '#fff',
    borderColor: 'rgba(0,0,0,0.1)',
    margin: 5,
    padding: 15,
    paddingTop:15,
    paddingBottom:15,
    shadowColor: '#ccc',
    shadowOffset: { width: 2, height: 2, },
    shadowOpacity: 0.5,
    shadowRadius: 3,
  },
  flex_box: {
    flex: 1,
  },
  icon: {
    width: 300,
    height: 300,
    alignSelf: 'center',
  },
  card_map:{
    flex: 1,
    //width: Style.CARD_WIDTH,
    height: Style.CARD_HEIGHT,
    padding: Style.CARD_PADDING_X,
    paddingTop: Style.CARD_PADDING_X,
    paddingLeft: Style.CARD_PADDING_X,
    paddingRight: Style.CARD_PADDING_X,
    paddingBottom: Style.CARD_PADDING_X,
  },
  map: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  search:{
    position: 'absolute',
    alignItems: 'center',
  },
});

module.exports = Main;

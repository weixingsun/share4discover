import React, {StyleSheet, Text, View, ScrollView, Dimensions, ToastAndroid, Navigator } from 'react-native'
import ScrollableTabView, { DefaultTabBar, ScrollableTabBar, } from 'react-native-scrollable-tab-view'
//import {Router, Route, Schema, Animations, TabBar} from 'react-native-router-flux'
import {Actions} from 'react-native-router-flux'
import Icon from 'react-native-vector-icons/Ionicons'
import MapView from 'react-native-maps'
import EventEmitter from 'EventEmitter'
import Button from 'react-native-button'
import Rest from "../io/Rest"
import Store from "../io/Store"

import PriceMarker from './PriceMarker'
import TabBarFrame from './TabBar'
import Style from "./Style"
import Launch from "./Launch"
import SettingsList from "./SettingsList"
import GooglePlace from "./GooglePlace"
import GiftedListView from './GiftedListViewSimple'
//import GiftedListView from './GiftedListViewAdvanced';
var mkid = 0,ccid = 0;

const Main = React.createClass({
  onRegionChange(region) {
    this.setState({ region });
    Store.save('region', region);
  },
  onLongPress(event) {
    console.log(event.nativeEvent);
    //this.addCircle({id: ccid++, c:event.nativeEvent.coordinate,r:100,s:'#ff0000' });
    this.addMarker({id: mkid++, pos: event.nativeEvent.coordinate, s:'#0000ff' });
  },
  addMarker(marker){
    var {markers} = this.state;
    this.setState({
      markers:[
        ...markers,
        marker]
    });
  },
  addCircle(circle){
    var {circles} = this.state;
    this.setState({
      circles:[
        ...circles,
        circle]
    });
  },
  getInitialState() {
    return {
      isLoading:true,
      region: {
        latitude: 0,
        longitude: 0,
        latitudeDelta: 10,
        longitudeDelta: 10,
      },
      markers: [],
      circles: [],
    };
  }, 
  componentWillMount(){
    Store.get('region').then((value) => {
      this.setState({
        isLoading:false,
      });
      this.setState({ region:value });
      //console.log('isLoading:'+this.state.isLoading+'\n'+JSON.stringify(value));
    });
  },

  render() {
    if(this.state.isLoading) return <View><Text>Loading...</Text></View>;
    //console.log('rendering '+JSON.stringify(this.state.region));
    return <View style={styles.container}>
      <ScrollableTabView initialPage={0} renderTabBar={() => <TabBarFrame />}>
        <ScrollView tabLabel="ios-paper" style={styles.tabView}>
            <GiftedListView />
        </ScrollView>
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
        <ScrollView tabLabel="ios-world" style={styles.tabView}>
          <View style={styles.card_map}>
	    <MapView
              style={styles.map}
	      showsUserLocation={true}
              onRegionChangeComplete={this.onRegionChange}
              //region={this.state.region}
              initialRegion={this.state.region}
	      //mapType=standard,satellite,hybrid
	      onLongPress={this.onLongPress} >
                 {this.state.markers.map(
                  marker => (
                    <MapView.Marker
                    key={marker.id}
                    coordinate={marker.pos}
                    pinColor={marker.s}
		    //title={marker.title}
		    //description={marker.description}
		    //onSelect={(e) => console.log('onSelect', e)}
                    >
			<PriceMarker amount={99} color={marker.s} />
		    </MapView.Marker>
                  ))} 
            </MapView>
	    <GooglePlace style={styles.search} />
          </View>
        </ScrollView>
        <ScrollView tabLabel="navicon-round" style={styles.tabView}>
	  <View style={styles.card}>
            <Button onPress={()=>Actions.login({data:"Custom data", title:'Custom title' })}>Login</Button>
          </View>
          <View style={styles.card}>
	    <Button onPress={Actions.register}>Register</Button>
          </View>
          <View style={styles.card}>
            <Text>What is Hot</Text>
          </View>
          <View style={styles.card}>
            <Text>Settings</Text>
          </View>
          <View style={styles.card}>
            <Text>Help</Text>
          </View>
          <View style={styles.card}>
            <Text>About</Text>
          </View>
        </ScrollView>
      </ScrollableTabView>
    </View>;
  },
});
//<Route name="signup"  component={Signup} title="Signup" />
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
  card: {
    flex: 1,
    borderWidth: 1,
    //backgroundColor: '#fff',
    borderColor: 'rgba(0,0,0,0.1)',
    margin: 5,
    //height: 150,
    //height: 600,
    padding: 15,
    shadowColor: '#ccc',
    shadowOffset: { width: 2, height: 2, },
    shadowOpacity: 0.5,
    shadowRadius: 3,
  },
  icon: {
    width: 300,
    height: 300,
    alignSelf: 'center',
  },
  card_map:{
    flex: 1,
    flexDirection:'column',
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
    alignItems: 'center',
  },
});

module.exports = Main;

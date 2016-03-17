import React, {StyleSheet, Text, View, ScrollView, Dimensions, ToastAndroid, Navigator, TouchableOpacity, } from 'react-native'
import ScrollableTabView, { DefaultTabBar, ScrollableTabBar, } from 'react-native-scrollable-tab-view'
//import {Router, Route, Schema, Animations, TabBar} from 'react-native-router-flux'
import {Actions} from 'react-native-router-flux'
import Icon from 'react-native-vector-icons/Ionicons'
import MapView from 'react-native-maps'
//import MapGL from 'react-native-mapbox-gl'
import FBLogin from 'react-native-facebook-login'
import {GoogleSignin, GoogleSigninButton} from 'react-native-google-signin'
import EventEmitter from 'EventEmitter'
import Button from 'react-native-button'
//import Rest from "../io/Rest"
import Store from "../io/Store"

import PriceMarker from './PriceMarker'
import TabBarFrame from './TabBar'
import Style from "./Style"
import Loading from "./Loading"
import Launch from "./Launch"
import SettingsList from "./SettingsList"
import GooglePlace from "./GooglePlace"
import GiftedListView from './GiftedListViewSimple'
//import GiftedListView from './GiftedListViewAdvanced';
var mkid = 0,ccid = 0;

const Main = React.createClass({
  renderLoginGoogle() {
    if(this.state.user !== null && this.state.user.type ==='fb'){
        //console.log('renderGoogle:fb:'+JSON.stringify(this.state.user));
        return (<View key='fbuser'>
	          <Text style={styles.username}>{this.state.user.name}</Text>
                </View>);
    }else if(this.state.user !== null && this.state.user.type ==='gg'){
        //console.log('renderGoogle:gg:'+JSON.stringify(this.state.user));
        return (<View key='gguser'>
                  <Button onPress={this._googleSignOut} style={{fontSize: 18, }} containerStyle={{borderRadius:5, backgroundColor: '#AA5555'}}>
                    Logout from Google
                  </Button>
	        </View>);
    }else{
        //console.log('renderGoogle:else:'+JSON.stringify(this.state.user));
        return (
              <GoogleSigninButton
                  style={{width: 150, height: 48}}
                  size={GoogleSigninButton.Size.Standard}
                  color={GoogleSigninButton.Color.Dark}
                  onPress={this._googleSignIn}/>
      );
    }
  },
  renderLoginFacebook() {
    var _this = this;
    if(this.state.user !== null && this.state.user.type !== 'fb'){
      //console.log('renderFacebook:name:'+JSON.stringify(this.state.user));
      return (<View key='user'><Text style={styles.username}>{this.state.user.name}</Text></View>);
    }else{
      //console.log('renderFacebook:button:'+JSON.stringify(this.state.user));
      return (
              <FBLogin
                onLogin={function(data){
                  //console.log('FBLogin.onLogin:');
                  _this._facebookSignIn(data);
                }}
                onLoginFound={function(data){
                  console.log('FB:onLoginFound:'+data);
                  //_this.setState({user: null });
                }}
                onLogout={function(data){
                  //console.log('FB:onLogout:');
                  _this.deleteUserDB();
                }}
                onCancel={function(e){console.log(e)}}
                onPermissionsMissing={function(e){
                  console.log("onPermissionsMissing:")
                  console.log(e)
                }}
              />
      );
    }
  },
  getUserDB() {
    Store.get('user').then((value) => {
      this.setState({ user:value });
      //console.log('getUserDB:'+JSON.stringify(value));
    });
  },
  saveUserDB(data) {
    //console.log('saveUserDB:'+JSON.stringify(data));
    Store.save('user', data);
  },
  deleteUserDB() {
    Store.delete('user');
    this.setState({ user:null });
  },
  _facebookSignIn(data) {
    //console.log(data)
    if(data.hasOwnProperty('profile')){	//Android get all info in 1 time
        var _user={
            id: data.profile.id,
            name: data.profile.name,
            email: data.profile.email,
            gender: data.profile.gender,
            type: 'fb',
            token: data.token,
        };
        this.setState({ user: _user, });
        this.saveUserDB(_user);
    }else{	//iOS need fetch manually
      var _this = this;
      var api = `https://graph.facebook.com/v2.3/${data.credentials.userId}?fields=name,email,gender,locale&access_token=${data.credentials.token}`;
      fetch(api)
        .then((response) => response.json())
        .then((responseData) => {
	  //console.log(responseData)
            var _user={
              id : responseData.id,
              name : responseData.name,
              email: responseData.email,
              gender: responseData.gender,
              type: 'fb',
              token: data.credentials.token,
            };
            _this.setState({ user : _user });
            _this.saveUserDB(_user);
        }).done();
    }
  },
  _googleSignIn() {
    GoogleSignin.signIn().then((data) => {
      //console.log(data);
      this.setState({user: {id:data.id, name:data.name, email:data.email, type:'gg', token:data.serverAuthCode}});
      this.saveUserDB(this.state.user);
    }).catch((err) => {
      console.log('WRONG SIGNIN', err);
    }).done();
  },

  _googleSignOut() {
    GoogleSignin.revokeAccess().then(() => GoogleSignin.signOut()).then(() => {
      this.deleteUserDB();
    }).done();
  },
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
  componentDidMount() {
    GoogleSignin.configure({
      scopes: ['https://www.googleapis.com/auth/calendar'],
      //webClientId: '840928054415-qc4abj1mu0l2k6e86n30of3gktig10id.apps.googleusercontent.com',  //oauth_client:1
      iosClientId: '840928054415-qc4abj1mu0l2k6e86n30of3gktig10id.apps.googleusercontent.com',  //oauth_client:1
      webClientId: '840928054415-nbk5fsk6n3sfrl3urj5bmpobhsq3ff42.apps.googleusercontent.com',  //oauth_client:3
      offlineAccess: true
    });

    GoogleSignin.currentUserAsync().then((data) => {
      //console.log('componentDidMount():Check Google Login:', data);
      if(this.state.user === null) this.setState({user: {id:data.id, name:data.name, email:data.email, type:'gg', token:data.serverAuthCode} });
    }).done();
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
	    <View style={styles.flex_box}>
		{ this.renderLoginGoogle() }
	    </View>
	    <View style={styles.flex_box}>
		{ this.renderLoginFacebook() }
	    </View>
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
    </View>
  },
})
//<Button onPress={()=>Actions.login({data:"Custom data", title:'Custom title' })}>Login</Button>
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
    alignItems: 'center',
  },
});

module.exports = Main;

import React, { Component } from 'react'
import {ToastAndroid,BackAndroid, InteractionManager, Platform, Text, View, Navigator, } from 'react-native'
import Tabs from 'react-native-tabs'
import Drawer from 'react-native-drawer'
import {Icon} from './Icon'
import EventEmitter from 'EventEmitter'
import Store from "../io/Store"
import Global from "../io/Global"
import Style       from "./Style"
import Loading     from "./Loading"
import Maps from "./Maps"

import ControlPanel from "./ControlPanel"
import APIList   from "./APIList"
import SettingsList   from "./SettingsList"
import ShareList from './ShareList'
import FriendList from './FriendList'


export default class Main extends Component {
  //static contextTypes = {
  //  drawer: PropTypes.object.isRequired,
  //};
  constructor(props) {
    super(props);
    this.types = ['car','taxi','estate']

    this.state = {
      page:this.props.page!=null?this.props.page: Store.msgTab,
      //isLoading:true,
      selectedMsg:this.props.msg,
      //user: null,
      markers: [],
      circles: [],
      region: {
        latitude: 39.9042,
        longitude: 116.4074,
        latitudeDelta: 1,
        longitudeDelta: 1,
        zoom: 16,
      },
      filters: {type:"car",range:2000,position:{latitude:0,longitude:0,latitudeDelta:10,longitudeDelta:10}},
      drawerPanEnabled:false,
      gps:false,
    }; 
    this.changeFilter=this.changeFilter.bind(this)
    this.watchID = (null: ?number);
    this.onBackAndroid=this.onBackAndroid.bind(this)
  }
  componentWillUnmount() {
      this.turnOffGps();
      if(Platform.OS === 'android') {
          BackAndroid.removeEventListener('hardwareBackPress', this.onBackAndroid);
      }
  }
  componentDidMount() {
      //InteractionManager.runAfterInteractions(() => {
      //    this.setState({isLoading: false});
      //});
  }
  componentWillMount(){
      var _this = this;
      Store.get('region').then((region_value) => {
        if(region_value !=null && region_value.latitude !=null){
          if(region_value.zoom == null){
              region_value['zoom'] = 14
          }
          if(region_value.latitudeDelta == null){
              region_value['latitudeDelta'] = 0.01
              region_value['longitudeDelta'] = 0.01
          }
          _this.setState({ region:region_value,  });
        }
      });
      //Store.get('user').then((user_value) => {
      //  _this.setState({ user:user_value });
      //});
      if(Global.MAP == null)
      Store.get_string(Store.SETTINGS_MAP).then((map_value) => {
        if(map_value != null){
            _this.map = map_value;
        }else{
            _this.map = 'BaiduMap'
        }
        Global.MAP = _this.map
      });
      if(Platform.OS === 'android'){
          BackAndroid.addEventListener('hardwareBackPress', this.onBackAndroid);
      }
  }
  onBackAndroid(){
      var routers = this.props.navigator.getCurrentRoutes();
      if (routers.length > 1) {
          this.props.navigator.pop();
          return true;
      }
      if (this.lastBackPressed && this.lastBackPressed + 2000 >= Date.now()) {
          return false;
      }
      this.lastBackPressed = Date.now();
      ToastAndroid.show('Double press to exit!',ToastAndroid.SHORT);
      return true;
  }
  componentWillUpdate() {
      /*var _this = this;
      Store.get_string(Store.SETTINGS_MAP).then((map_value) => {
        if(map_value == null) _this.map = "BaiduMap";
        else _this.map = map_value;
      });*/
  }
  goBack(){
    this.props.navigator.pop();
  }
  turnOffGps(){
      navigator.geolocation.clearWatch(this.watchID);
      this.setState({gps:false});
  }
  turnOnGps(){
      this.watchID = navigator.geolocation.watchPosition(
        (position) => {
          this.updateMyPos(position.coords);
        },
        (error) => console.log(error.message),
        {enableHighAccuracy: true, timeout: 30000, maximumAge: 1000, distanceFilter:30},
      );
      this.setState({gps:true});
  }
  pages(){
    if(this.state.page ===Store.msgTab){
      return <ShareList navigator={this.props.navigator} filters={this.state.filters} drawer={this.drawer}/>
    } else if(this.state.page ===Store.userTab){
      return <FriendList navigator={this.props.navigator} />
    //} else if(this.state.page ===Store.emailTab){
    //  return <Text>Messengers</Text>
    } else if(this.state.page ===Store.mapTab){
      return <Maps navigator={this.props.navigator} region={this.state.region} msg={this.state.selectedMsg} placeIcon={this.props.placeIcon} gps={this.state.gps} />
    } else if(this.state.page ===Store.confTab){
      return <SettingsList navigator={this.props.navigator}/>
    }
  }
//FontAwesome: cubes  th  th-large  
  gotoPage(name){ //ios-world
    var drawerEnabled=false
    if(name===Store.msgTab || name===Store.mapTab) drawerEnabled=true;
    this.setState({ page: name, drawerPanEnabled:drawerEnabled });
  }
  changeFilter(filter){
    this.drawer.close();
    this.setState({
      filters: filter,
    });
    //this.reload();
    //alert(JSON.stringify(filter))
  }
  render() {
    //if(this.state.isLoading) return <Loading />
    /*<Drawer tapToClose={true} //type="overlay"
        ref={(ref) => this.drawer = ref}
        styles={{
                 main: {shadowColor: "#000000", shadowOpacity: 0.8, shadowRadius: 3,},
               }}
        tweenHandler={(ratio)=> ({main:{opacity:(2-ratio)/2}})}
        openDrawerOffset={0.3}
        //openDrawerThreshold={this.state.openDrawerThreshold}
        //content={<ControlPanel list={this.types} filters={this.state.filters} onClose={(value) => this.changeFilter(value);} />} 
    >*/
    return (
    <Drawer type={"overlay"} tapToClose={true} ref={(ref) => this.drawer = ref} openDrawerOffset={0.3} acceptPan={this.state.drawerPanEnabled}
        content={<ControlPanel list={this.types} filters={this.state.filters} onClose={(value) => this.changeFilter(value)} />}
    >
        <View style={{flex:1}}>
          {this.pages()}
          <Tabs selected={this.state.page} style={Style.navBar}
              selectedStyle={{color:'blue'}} onSelect={(e)=> this.gotoPage(e.props.name)}>
            <Icon size={40} name={Store.msgTab}      />
            <Icon size={40} name={Store.userTab}  />
            <Icon size={40} name={Store.mapTab}      />
            <Icon size={40} name={Store.confTab} />
          </Tabs>
        </View>
    </Drawer>
    );
  }
}
//<Icon size={40} name={Store.emailTab}    />

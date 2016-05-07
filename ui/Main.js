import React, { Component } from 'react'
import {InteractionManager, Text, View, Navigator, } from 'react-native'
import Tabs from 'react-native-tabs'
import Drawer from 'react-native-drawer'
import Icon from 'react-native-vector-icons/Ionicons'
import FIcon from 'react-native-vector-icons/FontAwesome'
import EventEmitter from 'EventEmitter'
import Store from "../io/Store"

import TabBarFrame from './TabBar'
import Style       from "./Style"
import Loading     from "./Loading"
import GoogleMap   from "./GoogleMap"
import BaiduMap from "./BaiduMap"
import ControlPanel from "./ControlPanel"
import APIList   from "./APIList"
import SettingsList   from "./SettingsList"
import ShareList from './ShareList'

export default class Main extends Component {
  //static contextTypes = {
  //  drawer: PropTypes.object.isRequired,
  //};
  constructor(props) {
    super(props);
    this.types = ['car','taxi']
    this.state = {
      //page:this.props.page!=null?this.props.page:'ios-chatboxes',
      page:this.props.page!=null?this.props.page:'navicon-round',
      isLoading:true,
      selectedMsg:this.props.msg,
      user: null,
      markers: [],
      circles: [],
      region: {
        latitude: 0,
        longitude: 0,
        latitudeDelta: 10,
        longitudeDelta: 10,
      },
      filters: {type:"car",range:2000,position:{latitude:0,longitude:0,latitudeDelta:10,longitudeDelta:10}},
      drawerPanEnabled:false,
      gps:false,
      map:'GoogleMap',
    }; 
    this.changeFilter=this.changeFilter.bind(this)
    this.watchID = (null: ?number);
  }
  componentWillUnmount() {
      this.turnOffGps();
  }
  componentDidMount() {
      InteractionManager.runAfterInteractions(() => {
          this.setState({isLoading: false});
      });
  }
  componentWillMount(){
      var _this = this;
      Store.get('region').then((region_value) => {
        if(region_value !=null){
          _this.setState({ region:region_value,  });
        }
      });
      Store.get('user').then((user_value) => {
        _this.setState({ user:user_value });
      });
      //Store.get_string(Store.SETTINGS_MAP).then((map_value) => {
      //  _this.map = map_value;
      //});
  }
  componentWillUpdate() {
      var _this = this;
      Store.get_string(Store.SETTINGS_MAP).then((map_value) => {
        _this.map = map_value;
      });
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
  renderMap(){
      switch(this.map) {
          case 'GoogleMap':
              return <GoogleMap navigator={this.props.navigator} region={this.state.region} msg={this.state.selectedMsg} filters={this.state.filters} drawer={this.drawer} gps={this.state.gps} />
              break;
          case 'BaiduMap':
              return <BaiduMap navigator={this.props.navigator} region={this.state.region} msg={this.state.selectedMsg} filters={this.state.filters} drawer={this.drawer} gps={this.state.gps} />
              break;
          default:
              return null;
      }
  }
  pages(){
    if(this.state.page ==='ios-chatboxes'){
      return <ShareList navigator={this.props.navigator} filters={this.state.filters} drawer={this.drawer}/>
    } else if(this.state.page ==='android-contacts'){
      return <Text>Friends</Text>
    } else if(this.state.page ==='email'){
      return <Text>Messengers</Text>
    } else if(this.state.page ==='ios-world'){
      return this.renderMap();
    } else if(this.state.page ==='navicon-round'){
      return <SettingsList navigator={this.props.navigator}/>
    }
  }
//FontAwesome: cubes  th  th-large  
  gotoPage(name){ //ios-world
    var drawerEnabled=false
    if(name==='ios-chatboxes' || name==='ios-world') drawerEnabled=true;
    this.setState({ page: name, drawerPanEnabled:drawerEnabled });
  }
  changeFilter(filter){
    this.drawer.close();
    this.setState({
      filters: filter,
    });
    //this.reload();
  }
  render() {
    if(this.state.isLoading) return <Loading />
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
          <Tabs selected={this.state.page} style={Style.mainbar}
              selectedStyle={{color:'blue'}} onSelect={(e)=> this.gotoPage(e.props.name)}>
            <Icon name="ios-chatboxes" size={40} />
            <Icon name="android-contacts" size={40} />
            <Icon name="email" size={40} />
            <Icon name="ios-world" size={40} />
            <Icon name="navicon-round" size={40} />
          </Tabs>
          {this.pages()}
        </View>
    </Drawer>
    );
  }
}

import React, {StyleSheet, Text, View, ScrollView, Dimensions, ToastAndroid, Navigator, TouchableOpacity,Component,  } from 'react-native'
var Tabs = require('react-native-tabs');
import Icon from 'react-native-vector-icons/Ionicons'
import EventEmitter from 'EventEmitter'
import Store from "../io/Store"

import TabBarFrame from './TabBar'
import Style       from "./Style"
import Loading     from "./Loading"
import GoogleMap   from "./GoogleMap"
//import GooglePlace from "./GooglePlace"
import SettingsList   from "./SettingsList"
import GiftedListView from './GiftedListViewSimple'

export default class Main extends Component {
  constructor(props) {
    super(props);
    this.state = {
      page:'ios-chatboxes',
      isLoading:true,
      user: null,
      markers: [],
      circles: [],
      region: {
        latitude: 0,
        longitude: 0,
        latitudeDelta: 10,
        longitudeDelta: 10,
      },
    }; 
  }
  componentWillMount(){
    var _this = this;
    Store.get('region').then((region_value) => {
      _this.setState({ region:region_value });
      Store.get('user').then((user_value) => {
        _this.setState({ user:user_value });
        _this.setState({ isLoading:false, });
      });
    });
  }
  pages(){
    if(this.state.page ==='ios-chatboxes'){
      return <GiftedListView navigator={this.props.navigator}/>
    } else if(this.state.page ==='ios-people'){
      return <Text>Friends</Text>
    } else if(this.state.page ==='email'){
      return <Text>Messengers</Text>
    } else if(this.state.page ==='ios-world'){
      return <GoogleMap region={this.state.region} />
    } else if(this.state.page ==='navicon-round'){
      return <SettingsList />
    }
  }
  gotoPage(name){
    this.setState({ page: name });
  }
  render() {
    if(this.state.isLoading) return <Loading />
    return <View style={styles.container}>
        <Tabs selected={this.state.page} style={Style.mainbar}
              selectedStyle={{color:'blue'}} onSelect={el=>this.setState({page:el.props.name})}>
            <Icon name="ios-chatboxes" size={40} />
            <Icon name="ios-people" size={40} />
            <Icon name="email" size={40} />
            <Icon name="ios-world" size={40} />
            <Icon name="navicon-round" size={40} />
        </Tabs>
        {this.pages()}
    </View>
  }
}
//<GooglePlace style={styles.search} />
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  search:{
    position: 'absolute',
    alignItems: 'center',
  },
});

//module.exports = Main;

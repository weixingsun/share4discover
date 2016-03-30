'use strict';
import React, {ListView,Component,View,Text,TouchableHighlight,StyleSheet,ScrollView,ActivityIndicatorIOS,SwitchIOS,} from 'react-native'
import NavigationBar from 'react-native-navbar'
import IIcon from 'react-native-vector-icons/Ionicons'
import FIcon from 'react-native-vector-icons/FontAwesome'
import Style from './Style'
import GooglePlace from './GooglePlace'
//import { Cell, CustomCell, Section, TableView, } from 'react-native-tableview-simple'

export default class SearchAddr extends Component {
  constructor(props) {
      super(props);
      this.state = {
        selectedPlace:'na',
      };
      this.onSelect = this.onSelect.bind(this);
  }
  onSelect(place){
      this.setState({
        selectedPlace: place,
      });
  }
  componentDidMount() {
    this.setState({
    });
  }
  render() {
    return (
      <View>
        <NavigationBar style={Style.navbar} title={{title:'Type to Search',}}
            leftButton={
                <IIcon name={"ios-arrow-thin-left"} color={'#3B3938'} size={40} onPress={() => this.props.navigator.pop() } />
            }
            rightButton={
                <TouchableHighlight onPress={() =>{ this.props.route.callback(this.state.selectedPlace); this.props.navigator.pop() }}>
                  <Text size={24}>Apply</Text>
                </TouchableHighlight>
            }
        />
        <GooglePlace onSelect={this.onSelect}/>
      </View>
    );
  }
};
const styles = StyleSheet.create({
  stage: {
    backgroundColor: '#EFEFF4',
    paddingTop: 20,
    paddingBottom: 20,
    height:Style.DEVICE_HEIGHT-150-60,
  },
  appContainer:{
    flex: 1
  },
  titleView:{
    backgroundColor: '#48afdb',
    paddingTop: 30,
    paddingBottom: 10,
    flexDirection: 'row'
  },
  titleText:{
    color: '#fff',
    textAlign: 'center',
    fontWeight: 'bold',
    flex: 1,
    fontSize: 20,
  },
  inputcontainer: {
    marginTop: 5,
    padding: 10,
    flexDirection: 'row'
  },
  button: {
    height: 36,
    flex: 2,
    flexDirection: 'row',
    backgroundColor: '#48afdb',
    justifyContent: 'center',
    color: '#FFFFFF',
    borderRadius: 4,
  },
  btnText: {
    fontSize: 18,
    color: '#fff',
    marginTop: 6,
  },
  input: {
    height: 36,
    padding: 4,
    marginRight: 5,
    flex: 4,
    fontSize: 18,
    borderWidth: 1,
    borderColor: '#48afdb',
    borderRadius: 4,
    color: '#48BBEC'
  },
  row: {
    flexDirection: 'row',
    padding: 12,
    height: 44
  },
  selectedRow:{
    flexDirection: 'row',
    padding: 12,
    height: 44,
    backgroundColor: '#AAAAAA'
  },
  separator: {
    height: 1,
    backgroundColor: '#CCCCCC',
  },
  todoText: {
    flex: 1,
  },
});

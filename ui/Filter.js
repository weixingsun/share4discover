'use strict';
import React, {Component} from 'react'
import {ListView,View,Text,TouchableHighlight,StyleSheet,ScrollView,ActivityIndicatorIOS,SwitchIOS,} from 'react-native'
import NavigationBar from 'react-native-navbar'
import {Icon} from './Icon'
import Style from './Style'

export default class Filter extends Component {
  constructor(props) {
      super(props);
      this.state = {
          selectedType: this.props.selectedType,
          typeSource: new ListView.DataSource({rowHasChanged: (row1, row2) => row1 !== row2})
      };
      this.types = this.props.types;
  }
  setSelectedType(type){
    this.setState({
      selectedType : type
    });
  }
  componentDidMount() {
    console.log('types:'+this.types);
    console.log('selectedType:'+this.state.selectedType);
    this.setState({
      typeSource: this.state.typeSource.cloneWithRows(this.types)
    });
  }
  renderRow(rowData) {
    //console.log('rowData:'+rowData);
    return (
    <TouchableHighlight
      underlayColor='#dddddd'
      onPress={() => this.setSelectedType(rowData)}>
      <View>
        <View style={[ rowData===this.state.selectedType? styles.selectedRow :  styles.row]}>
          <Text style={styles.todoText}>{rowData}</Text>
        </View>
        <View style={styles.separator} />
      </View>
    </TouchableHighlight>
    );
  }
  render() {
    //console.log('types:'+this.types);
    return (
      <View>
        <NavigationBar style={Style.navbar} title={{title:'Choose a Type',}}
            leftButton={
                <Icon name={"ion-ios-arrow-back"} color={'#3B3938'} size={40} onPress={() => this.props.navigator.pop() } />
            }
            rightButton={
                <TouchableHighlight onPress={() =>{ this.props.route.callback(this.state.selectedType); this.props.navigator.pop() }}>
                  <Text size={24}>Apply</Text>
                </TouchableHighlight>
            }
        />
        <ListView
          dataSource={this.state.typeSource}
          renderRow={this.renderRow.bind(this)} />
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

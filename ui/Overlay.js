'use strict';
import React, {Component} from 'react'
import {ListView,View,Text,TouchableHighlight,StyleSheet,ScrollView,ActivityIndicatorIOS,SwitchIOS,} from 'react-native'
import {Icon} from './Icon'
import Style from './Style'

export default class Overlay extends Component {
  constructor(props) {
      super(props);
      this.state = {
          dataSource: new ListView.DataSource({rowHasChanged: (row1, row2) => row1 !== row2})
      };
      this.msg = this.props.msg;
  }
  componentDidMount() {
    var arr = this.getMsgArray(this.msg);
    this.setState({
      dataSource: this.state.dataSource.cloneWithRows(arr)
    });
  }
  isNumeric(n) {
      return !isNaN(parseInt(n)) && isFinite(n);
  }
  getMsgArray(data){
      var arr = [];
      for (var key in data) {
        if (data.hasOwnProperty(key) && this.filterKeys(key, data)) {
           var name = data[key]
           if(this.isNumeric(data[key]) && data[key]>100000000000){
               name=new Date(parseInt(data[key]))  //.toLocaleString
               //console.log(data[key])
           }else{
               name = name.replace(/[\r\n]\s*/g, ' ');
           }
           arr.push(key + ":" + name);
        }
      }
      return arr;
  }
  filterKeys(key,json){
      var b1 = (json[key]+"").length>0;
      var b2 = key !== 'thumbnail'
      var b3 = key !== 'lat'
      var b4 = key !== 'lng'
      var b5 = key !== 'title'
      var b6 = key !== 'image'
      var b7 = key !== 'longitude'
      var b8 = key !== 'latitude'
      var b9 = key !== 'ask'
      return b1 && b2 && b3 && b4 && b5 && b6 && b7 && b8 ;
  }
  press(data){
    console.log(data)
  }
  renderRow(rowData) {
    return (
    <TouchableHighlight
      underlayColor='#dddddd'
      onPress={() => this.press(rowData)}>
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
        <ListView
          style={this.props.style}
          dataSource={this.state.dataSource}
          renderRow={this.renderRow.bind(this)} />
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

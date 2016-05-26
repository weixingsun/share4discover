import React, { Component,PropTypes } from 'react'
import {ListView, Picker, ScrollView, StyleSheet, Text, TouchableHighlight, TouchableOpacity, View,} from 'react-native'
import {Icon} from './Icon'
import Slider from 'react-native-slider'
import Style from './Style'
import GooglePlace from './GooglePlace'

export default class ControlPanel extends Component {
  static propTypes = {
    onClose: PropTypes.func.isRequired,
    list: PropTypes.array.isRequired,
    filters: PropTypes.object.isRequired,
  }
  constructor(props) {
      super(props);
      this.radius=10000;
      this.state = {
          filters: this.props.filters,
          typeSource: new ListView.DataSource({rowHasChanged: (row1, row2) => row1 !== row2}),
      };
  }
  componentDidMount() {
    //console.log('types:'+this.props.types);
    this.setState({
      typeSource: this.state.typeSource.cloneWithRows(this.props.list)
    });
  }
  changeType(_type){
    this.setState({
      filters: {type: _type,range:this.state.filters.range, position:this.state.filters.position},
    });
  }
  changeRange(_range){
    this.setState({
      filters: {type: this.state.filters.type, range:_range*this.radius, position:this.state.filters.position},
    });
  }
  /*renderTypeRow(rowData) {
    //console.log('rowData:'+rowData);  //<View style={Style.separator} />
    return (
    <TouchableHighlight
      underlayColor='#dddddd'
      onPress={() => this.changeType(rowData)}>
        <View style={[ rowData===this.state.filters.type? Style.selectedRow: Style.slimRow]}>
          <Text style={{flex:1,color:'white',}}>{rowData}</Text>
        </View>
    </TouchableHighlight>
    );
  }*/
  changePlace(place){
    //alert(JSON.stringify(place))
    this.setState({ 
        filters: {type: this.state.filters.type,range:this.state.filters.range, position:place },
    })
  }
  render() {
    return (
      <ScrollView style={{flex:1,backgroundColor:'black',}}>
        <View style={{flex:1,flexDirection:'row',backgroundColor:'#333',height:66,alignItems:'center',justifyContent:'center',}}>
          <View style={{height:66,justifyContent:'center',alignItems:'center',flex:1,}}>
              <Text style={{color:'white',fontSize:20}}>Search Conditions</Text>
          </View>
          <Icon name={'ion-md-refresh'} size={40} color={"white"} style={{marginRight:30,}} onPress={()=>this.props.onClose(this.state.filters)} />
        </View>
        <View style={{flex:1,flexDirection:'row',height:20,justifyContent:'center',}}>
            <Text style={{color:'white',marginLeft:5}}>Range</Text>
            <View style={{flex:1}} />
            <Text style={{color:'white',marginRight:10}}>{(this.state.filters.range/1000).toFixed(1)} km</Text>
        </View>
        <Slider 
            trackStyle={iosStyles.track}
            thumbStyle={iosStyles.thumb}
            minimumTrackTintColor='#1073ff'
            maximumTrackTintColor='#b7b7b7'
            value={this.state.filters.range/this.radius} onValueChange={(value) => this.changeRange(value)} />
        <View style={{flex:1,flexDirection:'row',height:20,justifyContent:'center',}}>
            <Text style={{color:'white',marginLeft:5,}}>Types</Text>
            <View style={{flex:1}} />
        </View>
        <Picker style={{color:'white',backgroundColor:'gray',borderWidth:1}} selectedValue={this.state.filters.type} onValueChange={(value)=> { this.changeType(value)}}>
            {this.props.list.map(function(item,n){
                return <Picker.Item key={item} label={item} value={item} />;
            })}
        </Picker>
        <View style={{flex:1,flexDirection:'row',height:20,justifyContent:'center',}}>
            <Text style={{color:'white',marginLeft:5,}}>Where</Text>
            <View style={{flex:1}} />
        </View>
        <View style={{flex:1,flexDirection:'row',justifyContent:'center',}}>
            <GooglePlace style={{flex:1}} onSelect={this.changePlace.bind(this)}/>
        </View>
      </ScrollView>
    )
  }
}
/*
<Icon name={'map-marker'} size={35} color={'#1faadb'} style={{marginLeft:10,marginRight:12,marginBottom:5}} />
        <ListView
          dataSource={this.state.typeSource}
          renderRow={this.renderTypeRow.bind(this)} />
            <FIcon name={'map-marker'} size={35} color={'#1faadb'} style={{marginLeft:10,marginRight:12,marginTop:5,marginBottom:5}} />
*/
var iosStyles = {
  track: {
    height: 2,
    borderRadius: 1,
  },
  thumb: {
    width: 30,
    height: 30,
    borderRadius: 30 / 2,
    backgroundColor: 'white',
    shadowColor: 'black',
    shadowOffset: {width: 0, height: 2},
    shadowRadius: 2,
    shadowOpacity: 0.35,
  }
}

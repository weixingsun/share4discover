import React, { Component, ListView, PropTypes, ScrollView, StyleSheet, Text, TouchableHighlight, TouchableOpacity, View,} from 'react-native'
import Style from './Style'
import FIcon from 'react-native-vector-icons/FontAwesome'
import Slider from 'react-native-slider'

export default class ControlPanel extends Component {
  static propTypes = {
    onClose: PropTypes.func.isRequired,
    list: PropTypes.array.isRequired,
    filters: PropTypes.object.isRequired,
  }
  constructor(props) {
      super(props);
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
      filters: {type: _type,range:this.state.filters.range},
    });
  }
  changeRange(_range){
    this.setState({
      filters: {type: this.state.filters.type,range:_range*5000},
    });
  }
  renderTypeRow(rowData) {
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
  }
  render() {
    return (
      <ScrollView style={{flex:1,backgroundColor:'black',}}>
        <View style={{flex:1,flexDirection:'row',backgroundColor:'#333',height:66,alignItems:'center',justifyContent:'center',}}>
          <View style={{height:66,justifyContent:'center',alignItems:'center',flex:1,}}>
              <Text style={{color:'white',fontSize:24}}>Filtering Conditions</Text>
          </View>
          <FIcon name={'refresh'} size={30} style={{color:'white',marginRight:30,}} onPress={()=>this.props.onClose(this.state.filters)} />
        </View>
        <View style={{flex:1,flexDirection:'row',}}>
            <Text style={{color:'white',marginLeft:5}}>Range</Text>
            <View style={{flex:1}} />
            <Text style={{color:'white',marginRight:10}}>{Math.floor(this.state.filters.range)}</Text>
        </View>
        <Slider value={this.state.filters.range/5000} onValueChange={(value) => this.changeRange(value)} />
        <Text style={{color:'white',marginLeft:5,}}>Types</Text>
        <ListView
          dataSource={this.state.typeSource}
          renderRow={this.renderTypeRow.bind(this)} />
      </ScrollView>
    )
  }
}

'use strict';

var React = require('react-native');
var {View, ListView, Text, StyleSheet, Dimensions, TouchableHighlight, TouchableOpacity} = React;
import MapView from 'react-native-maps';
import Style from './Style'
import NavBar from './NavBar'
const h = Dimensions.get('window').height;
const w = Dimensions.get('window').width;
const Icon = require('react-native-vector-icons/Ionicons');
var ds = new ListView.DataSource({rowHasChanged: (r1,r2)=>(r1!==r2)});
var Detail = React.createClass( {
    
    getInitialState() {
      var msg = this.props.data;
      var lat,lng = 0;
      if(msg!=null){ 
        lat=parseFloat(msg.lat);
        lng = parseFloat(msg.lng);
      }
      var list = this.getMsgArray(msg);
      //waypoints=[{latlng:{lat:-43.52, lng:172.62}, title:'' }]
      var waypoints=[{id:0,latlng:{latitude:lat, longitude:lng}, title:msg.title}]
      if(msg.hasOwnProperty('waypoints')) waypoints=msg.waypoints;
      return {
          mkid:0,
          markers:waypoints,
          msg: msg,
          msgList: list,
          dataSource: ds.cloneWithRows(list),
          region: {    //check on start up
            latitude: lat,
            longitude: lng,
            latitudeDelta: 0.02,
            longitudeDelta: 0.02,
          },
      };
    },
    getMsgArray(data){
        var arr = [];
        //var p = this.props.data;
        for (var key in data) {
          if (data.hasOwnProperty(key) && this.filterKeys(key, data)) {
             arr.push(key + ":" + data[key]);
          }
        }
        return arr;
    },
    filterKeys(key,json){
        var b1 = (json[key]+"").length>0;
        var b2 = key !== 'thumbnail'
        var b3 = key !== 'lat'
        var b4 = key !== 'lng'
        var b5 = key !== 'title'
        return b1 && b2 && b3 && b4 && b5;
    },
    handleContentClick(data){
      console.log(data)
    },
    renderRow(rowData) {
      var separator = <View style={styles.separator}/>;
      if (rowData === this.state.msgList[0]) separator = null;
      var row = <Text style={styles.rowText}>{rowData}</Text>

      return (
        <View>
          {separator}
          <TouchableOpacity onPress={() => this.handleContentClick(rowData)}>
          {row}
          </TouchableOpacity>
        </View>
      );
    },
    renderList() {
      var maxHeight = {};
      if (this.state.msgList.length > 12) {
        maxHeight = {height: SCREEN_HEIGHT * 3/4};
      }
      return (
        <ListView
        style={maxHeight}
        dataSource={this.state.dataSource}
        renderRow={(rowData) => this.renderRow(rowData)}
        automaticallyAdjustContentInsets={false}
        />
      );
    },
    render(){
        return (
        <View style={styles.mainContainer}>
            <NavBar navigator={this.props.navigator} title={this.state.msg.title} left={'back'}/>
            <View style={styles.content}>
               <View style={styles.card}>
                  <View style={{flex:1,}}>
                    <Text style={styles.toolbarTitleText} >{this.state.content}</Text>
                  </View>
                  <View style={{flex:5}}>
                    {this.renderList()}
                  </View>
               </View>
               <View style={styles.map}>
                  <MapView
                    style={styles.map}
                    //initialRegion={this.state.region}
                    region={this.state.region}
                    //mapType=standard,satellite,hybrid
                  >
                     {this.state.markers.map(marker => (
                        <MapView.Marker key={marker.id}
                          coordinate={marker.latlng}
                          title={marker.title}
                          description={marker.description}
                        />
                     ))}
                  </MapView>
               </View>
            </View>
        </View>
        );
    }
});
var styles = StyleSheet.create({
    container: {
        flex: 1,
        //position: absolute, top: 0, bottom: 0, left: 0, right: 0
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(240,240,240,0.9)',
        //flexDirection: 'row', 
        padding: 30,
    },
    mainContainer:{
        flex:1 
    },
    content:{
        backgroundColor:'#ebeef0',
        flex:1
    },
    card: {
      flex: 1,
      //borderWidth: 1,
      //backgroundColor: '#fff',
      //borderColor: 'rgba(0,0,0,0.5)',
      margin: 20,
      //padding: 50,
      shadowColor: '#ccc',
      //shadowOffset: { width: 2, height: 2, },
      //shadowOpacity: 0.5,
      //shadowRadius: 3,
    },
    row:{
      flexDirection: 'row',
      height: 50,
    },
    rowText:{
      fontSize: 24,
    },
    map:{
      flex: 2,
      //borderWidth: 1,
      borderColor: 'rgba(0,0,0,0.5)',
      margin: 10,
      shadowColor: '#ccc',
      //shadowOffset: { width: 2, height: 2, },
      //shadowOpacity: 0.5,
      //shadowRadius: 3,
      //width: w-40,
    },
    
});

module.exports = Detail;

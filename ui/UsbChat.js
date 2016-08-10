'use strict';
import React, {Component} from 'react'
import {ListView, View, Text,TextInput, StyleSheet, ScrollView, TouchableOpacity, } from 'react-native'
import {Icon} from './Icon'
import Style from './Style'
import Global from '../io/Global'
import NavigationBar from 'react-native-navbar'
import UsbSerial from 'react-native-usbserial';
import Button from 'apsl-react-native-button'
import KKLocation from 'react-native-baidumap/KKLocation';

export default class APIList extends React.Component {
    constructor(props) {
      super(props);
      this.ds = new ListView.DataSource({
          rowHasChanged: (row1, row2) => row1 !== row2,
          sectionHeaderHasChanged: (s1, s2) => s1 !== s2,
      });
      this.state = {
          to:'000000',
          from:'000100',
          msgList:[],
          gps:true,
          pos:{},
      };
      //speed,heading,accuracy,longitude,latitude
    }
    turnOnGps(){
      let self=this
      if(Global.MAP===Global.GoogleMap){
        this.watchID = navigator.geolocation.watchPosition((position) => {
            //{timestamp,{coords:{speed,heading,accuracy,longitude,latitude,altitude}}}
            self.setState({pos:position.coords})
            //self.sendDataToUsbSerialDevice(JSON.stringify(self.pos));
          },
          (error) => console.log(error.message),
          {enableHighAccuracy: true, timeout: 30000, maximumAge: 1000, distanceFilter:30},
        );
      }else if(Global.MAP===Global.BaiduMap){
        this.watchID = KKLocation.watchPosition((position) => {
            //{timestamp,{coords:{heading,accuracy,longitude,latitude}}}  //no speed,altitude
            self.setState({pos:position.coords})
            //self.sendDataToUsbSerialDevice(JSON.stringify(self.pos));
        });
      }
      this.setState({gps:true});
    }
    turnOffGps(){
      navigator.geolocation.clearWatch(this.watchID);
      this.setState({gps:false});
    }
    switchGps(){
      if(this.state.gps) {
          this.turnOffGps();
      }else{
          this.turnOnGps();
      }
    }
    componentWillMount(){
        UsbSerial.listen(this.props.usb.device, 9600, '}', (e)=>{ //0x means send in hex format: p2p mode
            if(e.read){
                let arr = this.state.msgList
                let newMsg = {send:0,data:e.read}
                arr.push(newMsg)
                this.setState({msgList:arr})
            }else if(e.attached){
                //alert(JSON.stringify(e.attached))
            }
        });
        this.turnOnGps();
    }
    componentWillUnmount(){
        UsbSerial.close();
        this.turnOffGps();
    }
    sendDataToUsb(data){
        UsbSerial.write(this.state.to, this.state.from, '{'+data+'}');
        let arr = this.state.msgList
        let newMsg = {send:1,to:this.state.to,data:data}
        arr.push(newMsg)
        this.setState({msgList:arr,text:''})
    }
    sendMsg(){
        if(this.state.text.length>0){
            this.sendDataToUsb(this.state.text)
        }
    }
    sendGps(){
        let latlng = this.state.pos.latitude.toFixed(6)+','+this.state.pos.longitude.toFixed(6)
        UsbSerial.write(this.state.to, this.state.from, '{'+latlng+'}');
    }
    rowLeftBlankView(json){
        if(json.send==1)
            return <View style={{flex:1}}/>
    }
    rowRightBlankView(json){
        if(json.send==0)
            return <View style={{flex:1}}/>
    }
    _renderRow(data, sectionID, rowID) {
        let bgColor = data.send==1?'#ef553a':'#32ED42'
        return (
          <View style={{height: 44,flexDirection:'row'}} >
              {this.rowLeftBlankView(data)}
              <View style={{
                  padding: 6,
                  height: 40,
                  borderWidth: 1,
                  borderColor: '#AAAAAA',
                  backgroundColor: bgColor,
                  borderRadius:10,
                  }}>
                  <Text style={{fontSize:18,color:'white'}}>{data.data}</Text>
              </View>
              {this.rowRightBlankView(data)}
          </View>
        );
    }
    //{this._renderDeleteButton(this.seq,data)}
    render(){
      //if(this.api_list.length===0) return <Loading />
      //alert(JSON.stringify(this.api_list))
      let gps_color = this.state.pos.latitude?'black':'gray'
      return (
      <View>
          <NavigationBar style={Style.navbar} title={{title:this.props.usb.vendor+': '+this.props.usb.product,}} 
              leftButton={
                 <View style={{flexDirection:'row',}}>
                    <Icon name={"ion-ios-arrow-round-back"} color={'#333333'} size={40} onPress={() => this.props.navigator.pop() } />
                 </View>
              }
          />
          <ListView
              enableEmptySections={true}      //annoying warning
              style={styles.listViewContainer}
              dataSource={ this.ds.cloneWithRows(this.state.msgList) }
              renderRow={this._renderRow.bind(this)}
              //renderHeader={this._renderHeader.bind(this)}
              //renderSectionHeader = {this._renderSectionHeader.bind(this)}
              automaticallyAdjustContentInsets={false}
              initialListSize={9}
          />
          <View style={{padding:10,backgroundColor:'#d3d3d3',flexDirection:'row',height:Style.NAVBAR_HEIGHT+14}}>
              <TextInput 
                  style={{flex:1,height:Style.NAVBAR_HEIGHT-20}}
                  onChange={(event) => {
                      this.setState({
                           text: event.nativeEvent.text,
                      });
                  }}
                  value={this.state.text}
              />
              <Button 
                  style={{backgroundColor:'#3498db',borderColor:'#2980b9',width:80,height:Style.NAVBAR_HEIGHT-30}}
                  onPress={()=>this.sendMsg()}
              >Send</Button>
              <Button
                  style={{backgroundColor:'#3498db',borderColor:'#2980b9',width:80,height:Style.NAVBAR_HEIGHT-30}}
                  onPress={()=>this.sendGps()}
              >
                  <Icon name={"ion-ios-navigate-outline"} color={gps_color} size={30} />
              </Button>
          </View>
      </View>
      );
    }
}
var styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
    },
    scrollViewContainer: {
        flex: 1,
        flexDirection: 'column',
        padding: 15,
    },
    listViewContainer: {
        //flex: 1,
        height:Style.DEVICE_HEIGHT-Style.NAVBAR_HEIGHT-Style.NAVBAR_HEIGHT-14,
        flexDirection: 'column',
    },
    buttonContainer: {
        flex: 1,
        flexDirection: 'column',
        padding: 15,
        backgroundColor: "#EEE",
    },
    header: {
        flex: 0,
        flexDirection: "row",
        justifyContent: "space-between",
        padding: 6,
        backgroundColor: "#387ef5",
    },
});

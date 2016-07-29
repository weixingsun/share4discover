'use strict';
import React, {Component} from 'react'
import {ListView, View, Text,TextInput, StyleSheet, ScrollView, TouchableOpacity, } from 'react-native'
import {Icon} from './Icon'
import Style from './Style'
import NavigationBar from 'react-native-navbar'
import UsbSerial from 'react-native-usbserial';
import Button from 'apsl-react-native-button'

export default class APIList extends React.Component {
    constructor(props) {
      super(props);
      this.ds = new ListView.DataSource({
          rowHasChanged: (row1, row2) => row1 !== row2,
          sectionHeaderHasChanged: (s1, s2) => s1 !== s2,
      });
      this.state = {
          msgList:[],
      };
    }
    componentWillMount(){
        UsbSerial.listen(this.props.usb.device, 9600, '\n', (e)=>{
            if(e.read){
                let arr = this.state.msgList
                let newMsg = {send:0,data:e.read}
                arr.push(newMsg)
                this.setState({msgList:arr})
            }else if(e.attached){
                //alert(JSON.stringify(e.attached))
            }
        });
    }
    componentWillUnmount(){
        UsbSerial.close();
    }
    sendMsgToUsb(){
        if(this.state.text.length>0)
            UsbSerial.write(this.state.text);
        let arr = this.state.msgList
        let newMsg = {send:1,data:this.state.text}
        arr.push(newMsg)
        this.setState({msgList:arr,text:''})
    }
    _renderRow(data, sectionID, rowID) {
        let alignTo = 'flex-start'
        if(data.send==1) alignTo = 'flex-end'
        return (
          <View style={{
              alignItems:alignTo,
              flexDirection: 'row',
              padding: 12,
              height: 44,
              borderWidth: 1,
              borderColor: '#AAAAAA',
              }}>
                  <Text>{ JSON.stringify(data) }</Text>
          </View>
        );
    }
    //{this._renderDeleteButton(this.seq,data)}
    render(){
      //if(this.api_list.length===0) return <Loading />
      //alert(JSON.stringify(this.api_list))
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
                  onPress={()=>this.sendMsgToUsb()}
              >Send</Button>
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
//<View style={{width:50}} />
//<Icon name={'plus'} size={30} onPress={()=>this.props.navigator.push({component: FormAddJson})} />

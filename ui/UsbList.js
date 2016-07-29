'use strict';
import React, {Component} from 'react'
import {ListView, View, Text, StyleSheet, ScrollView, TouchableOpacity, } from 'react-native'
import {Icon} from './Icon'
import Style from './Style'
import UsbChat from './UsbChat'
import NavigationBar from 'react-native-navbar'
import UsbSerial from 'react-native-usbserial';

export default class USBList extends React.Component {
    constructor(props) {
      super(props);
      this.ds = new ListView.DataSource({
          rowHasChanged: (row1, row2) => row1 !== row2,
          sectionHeaderHasChanged: (s1, s2) => s1 !== s2,
      });
      this.state = {
          //dataSource:this.ds.cloneWithRows(this.api_list),
          dataSource:this.ds.cloneWithRows([]),
      };
      //this.openJsonAPI = this.openJsonAPI.bind(this);
      //this.openWebList = this.openWebList.bind(this);
    }
    componentWillMount(){
        //Store.insertExampleData();
        let self=this;
        UsbSerial.listDevices().then((list)=>{
            self.setState({
                dataSource:self.ds.cloneWithRows(list),
            });
        })
        UsbSerial.monitor((e)=>{
            //alert(typeof e.attached)
            if(e.attached != null) 
                this.setState({
                    dataSource:this.ds.cloneWithRows(e.attached),
                });
        })
    }
    openChatWindow(device){
        this.props.navigator.push({
            component: UsbChat,
            //passProps: {url:'https://kyfw.12306.cn/otn/leftTicket/init',},
            passProps: {navigator:this.props.navigator, usb:device},
        });
    }
    _renderRow(data, sectionID, rowID) {
        //this.incSeq();
        //UsbSerial  {device,serialNumber,product,vendor,productId,vendorId}
        return (
          <View style={Style.card}>
            <TouchableOpacity style={{flex:1}} onPress={()=> 
                   this.openChatWindow(data) 
            } >
              <View style={{flexDirection:'row'}}>
                  <Text>{ data.vendor + ': ' + data.product }</Text>
              </View>
            </TouchableOpacity>
          </View>
        );
    }
    //{this._renderDeleteButton(this.seq,data)}
    render(){
      //if(this.api_list.length===0) return <Loading />
      //alert(JSON.stringify(this.api_list))
      return (
      <View>
          <NavigationBar style={Style.navbar} title={{title:'My USB Devices',}} 
              leftButton={
                 <View style={{flexDirection:'row',}}>
                    <Icon name={"ion-ios-arrow-round-back"} color={'#333333'} size={40} onPress={() => this.props.navigator.pop() } />
                 </View>
              }
          />
          <ListView
              enableEmptySections={true}      //annoying warning
              style={styles.listViewContainer}
              dataSource={this.state.dataSource}
              renderRow={this._renderRow.bind(this)}
              //renderHeader={this._renderHeader.bind(this)}
              //renderSectionHeader = {this._renderSectionHeader.bind(this)}
              automaticallyAdjustContentInsets={false}
              initialListSize={9}
          />
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
        flex: 1,
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

'use strict';
import React, {Component} from 'react'
import {ActivityIndicator,NativeAppEventEmitter, Platform, ListView, View, Text, TextInput, StyleSheet, ScrollView, TouchableOpacity, TouchableHighlight } from 'react-native'
import {Icon} from './Icon'
import Style from './Style'
import BleChat from './BleChat'
import NavigationBar from 'react-native-navbar'
import BleManager from 'react-native-ble-manager';
import {checkPermission,requestPermission} from 'react-native-android-permissions';
import Modal from 'react-native-root-modal'
import Button from 'apsl-react-native-button'
//import { Buffer } = from 'buffer'
//let data = new Buffer(advertising.data)

export default class BLEList extends React.Component {
    constructor(props) {
      super(props);
      this.ds = new ListView.DataSource({
          rowHasChanged: (row1, row2) => row1 !== row2,
          sectionHeaderHasChanged: (s1, s2) => s1 !== s2,
      });
      this.state = {
          //dataSource:this.ds.cloneWithRows(this.api_list),
          devList:[],
          grantedPermissions:{},
          scanning:false,
      };
      //this.dataSource = this.ds.cloneWithRows(this.state.devList),
      this.permissions= ['BLUETOOTH','BLUETOOTH_ADMIN','ACCESS_FINE_LOCATION']
    }
    singlePermission(name){
        requestPermission('android.permission.'+name).then((result) => {
          //console.log(name+" Granted!", result);
          let perm = this.state.grantedPermissions;
          perm[name] = true
          this.setState({grantedPermissions:perm})
        }, (result) => {
          //alert('Please grant location permission in settings')
        });
    }
    permission(){
        if(Platform.OS === 'android' && Platform.Version > 22){
            this.permissions.map((perm)=>{
                this.singlePermission(perm)
            })
            //this.singlePermission('ACCESS_FINE_LOCATION')
            //this.singlePermission('ACCESS_COARSE_LOCATION')
        }
    }
    componentWillMount(){
        let self=this;
        this.permission()
        this.bleStopScan = NativeAppEventEmitter.addListener(
            'BleManagerStopScan',
            () => {
                //alert('BleManagerStopScan')
                self.setState({scanning:false})
            }
        );
        this.bleNewPeripheral = NativeAppEventEmitter.addListener(
            'BleManagerDiscoverPeripheral',
            (args) => {
                // {rssi,id,name}   id=mac, name: optional
                //alert(JSON.stringify(args))
                self.setState({devList:[...self.state.devList,args]})
            }
        );
    }
    componentWillUnmount(){
        this.bleStopScan.remove()
        this.bleNewPeripheral.remove()
        BleManager.stop()
    }
    openChatWindow(device){
        /*this.props.navigator.push({
            component: BleChat,
            //passProps: {url:'https://kyfw.12306.cn/otn/leftTicket/init',},
            passProps: {navigator:this.props.navigator, ble:device},
        });*/
        alert(JSON.stringify(device))
    }
    _renderRow(data, sectionID, rowID) {
        return (
          <View style={Style.card}>
            <TouchableOpacity style={{flex:1}} onPress={()=> 
                   this.openChatWindow(data) 
            } >
              <View style={{flexDirection:'row'}}>
                  <Text>{ 'rssi:'+data.rssi + ' id:' + data.id }</Text>
              </View>
            </TouchableOpacity>
          </View>
        );
    }
    scan(){
        BleManager.scan([]) //, true);
        this.setState({
            devList:[],
            scanning:true,
        })
    }
    stop(){
        BleManager.stop()
        this.setState({
            scanning:false,
        })
    }
    renderScanIcon(){
        if(this.state.scanning) 
            return <TouchableOpacity onPress={()=>this.stop()}>
                       <ActivityIndicator 
                           animating={this.state.scanning} 
                           style={{alignItems:'center',justifyContent:'center',height: 50}} 
                           size="small" 
                       />
                   </TouchableOpacity>
        else return <Icon 
                       name={"ion-ios-barcode-outline"} 
                       color={'#333333'} 
                       size={40} 
                       onPress={() => this.scan() } 
                    />
    }
    connectDevice(MAC){
        BleManager.connect(MAC)
        .then(()=>{
            alert('connected:'+MAC)
        })
        /*.catch((error) => {
            alert('error:'+MAC+'\n'+JSON.stringify(error))
        });*/
        this.setState({showAddForm:false});
    }
    renderAddForm(){
      let MAC = 'B8:27:EB:31:C6:79'
      return (
        <Modal
            style={{ top:0,bottom:0,right:0,left:0, backgroundColor:'rgba(0, 0, 0, 0.2)' }}
            //transform: [{scale: this.state.scaleAnimation}]
            visible={this.state.showAddForm}
            onPress={() => this.setState({showAddForm:false})}
        >
            <TouchableHighlight style={{ height:Style.DEVICE_HEIGHT*2/3, alignItems: 'center', justifyContent: 'center' }} onPress={() => this.setState({showAddForm:false})}>
              <View style={{flexDirection:'row',height:50}}>
                <TextInput
                  value={MAC}
                  style={{marginLeft:40,height:40,width:200,color:'white',fontSize:20}}
                />
                <Button 
                    style={{marginRight:40,width:80,height:40,backgroundColor:'#3498db',borderColor:'#2980b9'}} 
                    textStyle={{fontSize:20,color:'white'}}
                    onPress={()=>this.connectDevice(MAC)}
                >Connect</Button>
              </View>
            </TouchableHighlight>
        </Modal>
      )
    }
    render(){
      //if(this.api_list.length===0) return <Loading />
      //alert(JSON.stringify(this.api_list))
      //<Icon name={'ion-ios-add'} size={50} onPress={()=>this.setState({showAddForm:true})}/>
      return (
      <View>
          <NavigationBar style={Style.navbar} title={{title:'My Bluetooth Devices',}} 
              leftButton={
                 <View style={{flexDirection:'row',}}>
                    <Icon name={"ion-ios-arrow-round-back"} color={'#333333'} size={40} onPress={() => this.props.navigator.pop() } />
                 </View>
              }
              rightButton={
                 <View style={{flexDirection:'row',}}>
                     {this.renderScanIcon()}
                     <View style={{width:20}}/>
                 </View>
              }
          />
          <ListView
              enableEmptySections={true}      //annoying warning
              style={styles.listViewContainer}
              dataSource={this.ds.cloneWithRows(this.state.devList)}
              renderRow={this._renderRow.bind(this)}
              //renderHeader={this._renderHeader.bind(this)}
              //renderSectionHeader = {this._renderSectionHeader.bind(this)}
              automaticallyAdjustContentInsets={false}
              initialListSize={9}
          />
          {this.renderAddForm()}
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
        height:Style.DEVICE_HEIGHT-Style.NAVBAR_HEIGHT-24,
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

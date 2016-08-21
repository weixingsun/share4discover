'use strict';
import React, {Component} from 'react'
import {ActivityIndicator,DeviceEventEmitter,NativeAppEventEmitter, Platform, ListView, View, Text, TextInput, StyleSheet, ScrollView, TouchableOpacity, TouchableHighlight } from 'react-native'
import {Icon} from './Icon'
import Style from './Style'
import BleChat from './BleChat'
import NavigationBar from 'react-native-navbar'
import BleManager from 'react-native-ble-manager';
//import Beacons from 'react-native-beacon'
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
      this.permissions= ['BLUETOOTH','BLUETOOTH_ADMIN'] //ACCESS_COARSE_LOCATION
      this.uuid = 'd7db32aa-ff2d-58ca-a4f6-e7988b8637c6'
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
    //sortJsonArrayByProperty(results, 'attributes.OBJECTID');
    //sortJsonArrayByProperty(results, 'attributes.OBJECTID', -1);
    sortJsonArrayByProperty(objArray, prop, direction){
        if (arguments.length<2) throw new Error("sortJsonArrayByProp requires 2 arguments");
        var direct = arguments.length>2 ? arguments[2] : 1; //Default to ascending

        if (objArray && objArray.constructor===Array){
            var propPath = (prop.constructor===Array) ? prop : prop.split(".");
            objArray.sort(function(a,b){
                for (var p in propPath){
                    if (a[propPath[p]] && b[propPath[p]]){
                        a = a[propPath[p]];
                        b = b[propPath[p]];
                    }
                }
                // convert numeric strings to integers
                a = a.match(/^\d+$/) ? +a : a;
                b = b.match(/^\d+$/) ? +b : b;
                return ( (a < b) ? -1*direct : ((a > b) ? 1*direct : 0) );
            });
        }
    }
    isInArray(arr,obj,key){
        let arr2 = arr.filter( function(o){
            return o[key] == obj[key]
        })
        return arr2.length >0?true:false
    }
    replaceDev(arr,obj,key){
        return arr.map(function(item,i) { 
                   //console.log('old_value='+item[key] +', new_value'+ obj[key])
                   return item[key] == obj[key] ? obj : item; 
               });
    }
    componentWillMount(){
        let self=this;
        this.permission()
        this.bleStopScan = NativeAppEventEmitter.addListener(
            'BleManagerStopScan',
            () => {
                self.setState({scanning:false})
            }
        );
        this.bleNewPeripheral = NativeAppEventEmitter.addListener(
            'BleManagerDiscoverPeripheral',
            (dev) => {
                // {rssi,id,name}   id=mac, name: optional
                let devList = self.state.devList
                let newDevList = []
                if(self.isInArray(devList,dev,'id')){
                    newDevList = self.replaceDev(devList,dev,'id')
                }else{
                    newDevList = [...self.state.devList,dev]
                }
                let sortedList = newDevList.sort(self.dynamicSort('-rssi')) // '-rssi'
                self.setState({devList: sortedList})
            }
        );
    }
    dynamicSort(property) {
        var sortOrder = 1;
        if(property[0] === "-") {
            sortOrder = -1;
            property = property.substr(1);
        }
        return function (a,b) {
            var result = (a[property] < b[property]) ? -1 : (a[property] > b[property]) ? 1 : 0;
            return result * sortOrder;
        }
    }
    rssiToDistance(rssi){
        //10^((ABS(RSSI(dbm))-A)/(10*n))
        let p = (Math.abs(rssi)-59)/20
        return Math.pow(10,p).toFixed(1)
    }
    componentDidMount() {
        /*Beacons.setForegroundScanPeriod(5000)
        Beacons.setBackgroundScanPeriod(5000)
        Beacons.setBackgroundBetweenScanPeriod(2000)
        this.beaconsDidRange = DeviceEventEmitter.addListener('beaconsDidRange',(data) => {
            this.setState({devList:data.beacons})
            //alert('data.beacons.size'+data.beacons.length)
        });
        this.regionDidEnter = DeviceEventEmitter.addListener('regionDidEnter', (region) => {
            console.log('Entered new beacons region!', region) // Result of monitoring
            alert('regionDidEnter')
        })
        this.regionDidExit  = DeviceEventEmitter.addListener('regionDidExit', (region) => {
            console.log('Exited beacons region!', region) // Result of monitoring
            alert('regionDidExit')
        })*/
    }
    componentWillUnmount(){
        this.bleStopScan.remove()
        this.bleNewPeripheral.remove()
        BleManager.stop()
        clearInterval(this.broadcastTimer)
        /*
        this.beaconsDidRange = null;
        this.regionDidEnter = null;
        this.regionDidExit = null;
        */
    }
    openChatWindow(device){
        /*this.props.navigator.push({
            component: BleChat,
            //passProps: {url:'https://kyfw.12306.cn/otn/leftTicket/init',},
            passProps: {navigator:this.props.navigator, ble:device},
        });*/
        alert(JSON.stringify(device))
    }
    renderServiceIcon(serviceArrayJson){
        //if(serviceArrayJson && serviceArrayJson.length>0)
        if(serviceArrayJson && serviceArrayJson.uuid)
            return <View style={{flexDirection:'row'}}>
                       <Icon name={'ion-ios-cog'} size={40} onPress={()=>{this.openChatWindow(serviceArrayJson)}} />
                       <View style={{width:10}} />
                   </View>
    }
    renderMfgIcon(mfgJson){
        if(mfgJson && mfgJson.data)
            return <View style={{flexDirection:'row'}}>
                       <Icon name={'ion-ios-home'} size={40} onPress={()=>{this.openChatWindow(mfgJson)}} />
                       <View style={{width:10}} />
                   </View>
    }
    renderRawIcon(data){
            return <View style={{flexDirection:'row'}}>
                       <Icon name={'ion-ios-information-circle-outline'} size={40} onPress={()=>{this.openChatWindow(data)}} />
                       <View style={{width:10}} />
                   </View>
    }
    _renderRow(data, sectionID, rowID) {
        let name = data.name==null?'Unamed':data.name
        let rssi = data.rssi>0?data.rssi-128:data.rssi
        return (
          <View style={Style.card}>
            <TouchableOpacity style={{flex:1}} onPress={()=> {} }>
                <View style={{marginLeft:15,flexDirection:'row'}}>
                    <View style={{}}>
                        <Text style={{fontSize:20,}}>{ name }</Text>
                        <View style={{flexDirection:'row'}}>
                            <Text style={{fontSize:10,color:'black',width:40}}>{ this.rssiToDistance(rssi) }m</Text>
                            <View style={{width:10}} />
                            <Text style={{fontSize:10,}}>{ rssi }</Text>
                        </View>
                    </View>
                    <View style={{flex:1}} />
                    <View style={{flexDirection:'row'}}>
                        {this.renderServiceIcon(data.services)}
                        {this.renderMfgIcon(data.mfg)}
                        {this.renderRawIcon(data)}
                        <View style={{width:10}} />
                    </View>
                </View>
            </TouchableOpacity>
          </View>
        );
    }
    scan(){
        /*
        Beacons.scanIBeacons();
        Beacons.scanEstimotes()
        Beacons.startRangingBeaconsInRegion('REGION1',this.uuid)
        Beacons.startMonitoringForRegion('REGION1',this.uuid)
        .then(() => console.log(`Beacons ranging started succesfully!`))
        .catch(error => alert(`Beacons ranging not started, error: ${error}`))
        */
        BleManager.scan([])
        this.setState({
            devList:[],
            scanning:true,
        })
    }
    stop(){
        /*
        Beacons.stopScanIBeacons();
        Beacons.stopScanEstimotes();
        Beacons.stopRangingBeaconsInRegion(this.uuid)
        Beacons.stopMonitoringForRegion(this.uuid)
        .then(() => console.log(`Beacons ranging stopped succesfully!`))
        .catch(error => alert(`Beacons ranging not stopped, error: ${error}`))
        */
        BleManager.stop()
        this.setState({
            scanning:false,
        })
    }
    renderScanIcon(){
        if(this.state.scanning) 
            /*return <TouchableOpacity onPress={()=>this.stop()}>
                       <ActivityIndicator animating={this.state.scanning} size="small"
                           style={{alignItems:'center',justifyContent:'center',height: 50}} />
                   </TouchableOpacity>*/
            return <Icon name={"fa-wifi"} color={'#dd3333'} size={35} onPress={() => this.stop() } />
        else return <Icon name={"fa-wifi"} color={'#333333'} size={35} onPress={() => this.scan() } />
    }
    broadcast(){
        let self=this
        let id = 'CDB7950D-73F1-4D4D-8E47-C090502DBD63'
        let data ='data'
        BleManager.broadcast(id,data)
        .then(()=>{
            //self.switchBroadcast()
        })
        .catch((error) => {
            self.stopBroadcast()
            alert('broadcast.failed, maybe advertising not supported for your device') //JSON.stringify(error)
        });
    }
    stopBroadcast(){
        clearInterval(this.broadcastTimer)
        this.setState({broadcasting:false})
    }
    startBroadcast(){
        this.setState({broadcasting:true})
        this.broadcastTimer = setInterval(()=>this.broadcast(),1000)
    }
    renderBroadcastIcon(){
        if(this.state.broadcasting){
            return <Icon name={'fa-heartbeat'} color={'#dd3333'} size={35} onPress={()=>this.stopBroadcast()} />
        }else{
            return <Icon name={'fa-heartbeat'} color={'#aaaaaa'} size={35} onPress={()=>this.startBroadcast()} />
        }
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
          <NavigationBar style={Style.navbar} title={{title:'BLE Devices',}} 
              leftButton={
                 <View style={{flexDirection:'row',}}>
                    <Icon name={"ion-ios-arrow-round-back"} color={'#333333'} size={40} onPress={() => this.props.navigator.pop() } />
                 </View>
              }
              rightButton={
                 <View style={{flexDirection:'row',}}>
                     {this.renderScanIcon()}
                     <View style={{width:10}}/>
                     {this.renderBroadcastIcon()}
                     <View style={{width:10}}/>
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

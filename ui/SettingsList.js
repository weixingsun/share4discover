'use strict';
import React, {View, Text, StyleSheet, ScrollView, TouchableOpacity, } from 'react-native'
import Login from './Login9'
import Style from './Style'
import NavigationBar from 'react-native-navbar'
import CodePush from "react-native-code-push"

export default class Settings extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
          types:[],
          users:[],
      };
      //this.openWebList = this.openWebList.bind(this);
      //this.openRssList = this.openRssList.bind(this);
      //this.openJsonList = this.openJsonList.bind(this);
      //this.openJsonList2 = this.openJsonList2.bind(this);
      //this.openStockList = this.openStockList.bind(this);
    }
    checkUpdate(){
      //CodePush.sync()
        CodePush.checkForUpdate().then( (update) =>{
            if( !update ){
                console.log("app is latest version:"+JSON.stringify(update));
            }else {
                console.log("there is an update:"+JSON.stringify(update));
                //CodePush.sync({ updateDialog: true, installMode: CodePush.InstallMode.IMMEDIATE });
            }
        });
    }
    about(){
        CodePush.getCurrentPackage().then((update) => {
           // If the current app "session" represents the first time
           // this update has run, and it had a description provided
           // with it upon release, let's show it to the end user
           console.log("current app version:"+JSON.stringify(update));
           if (update.isFirstRun && update.description) {
               // Display a "what's new?" modal
           }
        });
    }
    componentDidMount(){
        CodePush.notifyApplicationReady();
    }
    login(type,user){
        this.setState({types:new_types, users:new_users});
    }
    //componentDidMount() {
    //    CodePush.sync();
    //}
//<ScrollView style={{flex:1}}>
    render(){
        return (
        <View>
          <NavigationBar style={Style.navbar} title={{title:'Share',}} />
          <View style={Style.map}>
                  <TouchableOpacity style={Style.card} onPress={()=> this.checkUpdate()} >
                    <Text>Check for Update</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={Style.card} onPress={()=> this.about()}>
                    <Text>About</Text>
                  </TouchableOpacity>
                  <View style={Style.card}>
                    <Text>Settings</Text>
                  </View>
                  <View style={Style.card}>
                    <Login type={'google'} login={this.login} />
                  </View>
                  <View style={Style.card}>
                    <Login type={'facebook'} login={this.login} />
                  </View>
          </View>
        </View>
        );
    }
}

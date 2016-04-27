'use strict';
import React, {View, Text, StyleSheet, ScrollView, TouchableOpacity, } from 'react-native'
import LoginGG from './LoginGG'
import LoginFB from './LoginFB'
import Style from './Style'
import APIList from './APIList'
import PlaceSettings from './PlaceSettings'
import Store from '../io/Store'
import NavigationBar from 'react-native-navbar'
import CodePush from "react-native-code-push"

export default class SettingsList extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
          user_fb:null,
          user_gg:null,
      };
      this.login_fb = this.login_fb.bind(this);
      this.logout_fb = this.logout_fb.bind(this);
      this.login_gg = this.login_gg.bind(this);
      this.logout_gg = this.logout_gg.bind(this);
    }
    componentWillMount(){
        this.getUserDB();
    }
    getUserDB() {
        Store.get('user_fb').then((value) => {
            this.setState({ user_fb:value });
           //console.log('getUserDB:'+JSON.stringify(value));
        });
        Store.get('user_gg').then((value) => {
            this.setState({ user_gg:value });
           //console.log('getUserDB:'+JSON.stringify(value));
        });
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
    login_gg(user){
        this.setState({user_gg:user});
    }
    logout_gg(user){
        this.setState({user_gg:null});
    }
    login_fb(user){
        this.setState({user_fb:user});
    }
    logout_fb(user){
        this.setState({user_fb:null});
    }
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
                  <TouchableOpacity style={Style.card} onPress={()=> this.props.navigator.push({
                    component: PlaceSettings,
                    passProps: {navigator:this.props.navigator,},
                  })}>
                    <Text>Places Settings</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={Style.card} onPress={()=> this.props.navigator.push({
                    component: APIList,
                    passProps: {navigator:this.props.navigator,},
                  })}>
                    <Text>API List</Text>
                  </TouchableOpacity>
                  <View style={Style.card}>
                    <LoginGG user={this.state.user_gg} login={this.login_gg} logout={this.logout_gg} />
                  </View>
                  <View style={Style.card}>
                    <LoginFB user={this.state.user_fb} login={this.login_fb} logout={this.logout_fb} />
                  </View>
          </View>
        </View>
        );
    }
}
//<FIcon name="plug" size={30} />

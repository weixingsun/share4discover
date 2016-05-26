import React, {Component} from 'react'
import {Alert, View, Text, StyleSheet} from 'react-native'
import {Icon} from './Icon'

export default class FBLoginView extends Component {
  static contextTypes = {
    isLoggedIn: React.PropTypes.bool,
    login: React.PropTypes.func,
    logout: React.PropTypes.func,
    props: React.PropTypes.object
    };

    constructor(props) {
        super(props);
    }
    getColor(){
        if(this.props.user != null){
            return "#dddddd"
        }else{
            return "#425bb4"
        }
    }
    render(){
        return (
            <Icon onPress={() => {
                if(!this.context.isLoggedIn){
                  this.context.login()
                }else{
                  Alert.alert(
                      'Logout', 
                      'Do you want to logout from Facebook?',
                      [
                         {text: 'Cancel', onPress: () => console.log('Cancelled')},
                         {text: 'OK', onPress: () => this.context.logout() },
                      ]
                  );
                  //this.context.logout()
                }
              }}
              //color={"#000000"}
              backgroundColor={this.getColor()}
              name={"fa-facebook-square"}
              size={35} 
              //borderRadius={10}
            />
      )
    }
}

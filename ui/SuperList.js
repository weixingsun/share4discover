'use strict';
import React, {View, Text, StyleSheet, ScrollView} from 'react-native'
import Button from 'react-native-button'
import WatchList from './WatchList'
import Style from './Style'
import NavigationBar from 'react-native-navbar'
import IIcon from 'react-native-vector-icons/Ionicons'

export default class Settings extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        editEnabled: true,
      };
    }
    switchEdit(){
        if(this.state.editEnabled){
          this.setState({editEnabled: false})
        }else{
          this.setState({editEnabled: true})
        }
    }
    renderWatchList(){
        return <WatchList editable={this.state.editEnabled}/>
    }
    render(){
        //alert('editable:'+this.state.editEnabled);
        return (
        <View style={{flex:1}}>
          <NavigationBar style={Style.navbar} title={{title:'My Watch List',}}
             leftButton={
               <IIcon name={"ios-arrow-thin-left"} color={'#3B3938'} size={40} onPress={() => this.props.navigator.pop() } />
             }
             rightButton={
               <IIcon name={"ios-gear"} color={'#3B3938'} size={40} onPress={() => this.switchEdit() } />
             }
          />
          {this.renderWatchList()}
        </View>
        );
    }
}

'use strict';

import React, {Component} from 'react';
import {View,Text,TouchableHighlight,} from 'react-native';
import Style from './Style'
import Filter from './Filter'
const IIcon = require('react-native-vector-icons/Ionicons');
const FIcon = require('react-native-vector-icons/FontAwesome');

//<NavBar navigator={nav} title={msg.title} />
var NavBar = React.createClass ({

    getInitialState() {
        return ({
            types:['car'],
        });
    },
    goFilter(){
          //component: Filter,
        this.props.navigator.push({
          id: 3,
          type: "Normal",
          passProps: {
            list: 'car',
          },
        }); 
    },
    goBack() {
        this.props.navigator.pop();
    },
    renderFilter(){
        return (
            <TouchableHighlight style={Style.navButton} onPress={this.goFilter}>
                <FIcon name="filter" color='#3B3938' size={40}/>
            </TouchableHighlight>
        );
    },
    renderBack(){
        return (
            <TouchableHighlight style={Style.navButton} onPress={this.goBack}>
                <IIcon name="ios-arrow-back" color='#3B3938' size={40}/>
            </TouchableHighlight>
        );
    },
    renderLeftIcon(){
        if(this.props.left === 'filter') return this.renderFilter();
        else if(this.props.left === 'back') return this.renderBack();
    },
    render() {
        return (
        <View style={Style.navbar}>
             {this.renderLeftIcon()}
             <Text style={Style.navTitle}>{this.props.title}</Text>
             <TouchableHighlight style={Style.navButton} onPress={this.goBack}>
                 <IIcon name="ios-upload-outline" color='#3B3938' size={40}/>
             </TouchableHighlight>
        </View>
        );
    },
});

module.exports = NavBar;

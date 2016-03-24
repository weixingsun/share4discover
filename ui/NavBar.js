'use strict';

import React, {Component,View,Text,TouchableHighlight,} from 'react-native';
import Style from './Style'
const IIcon = require('react-native-vector-icons/Ionicons');
const FIcon = require('react-native-vector-icons/FontAwesome');

//<NavBar navigator={nav} title={msg.title} />
var NavBar = React.createClass ({

    getInitialState() {
        return ({
            
        });
    },
    goFilter(){
        //this.props.navigator.push('filter');
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
                <IIcon name="ios-arrow-thin-left" color='#3B3938' size={40}/>
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

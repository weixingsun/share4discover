import React, { Component } from 'react'
import {Animated, StyleSheet,Text,View,Easing } from 'react-native'
import IIcon from 'react-native-vector-icons/Ionicons'
import FIcon from 'react-native-vector-icons/FontAwesome'

class Icon extends Component {
    constructor(props) {
        super(props);
        this.state = {
            spinValue: new Animated.Value(0)
        };
    }
    componentDidMount () {
        this.spin()
    }
    spin(){
        this.state.spinValue.setValue(0); 
        Animated.timing(
            this.state.spinValue,
            {
              toValue: 1,
              duration: 4000,
              easing: Easing.linear
            }
        ).start(() => this.spin())
    }
    /*getImageSource(name,size,color){
      //  if(name.startsWith('ion')) return IIcon.getImageSource(name.substring(4),size,color)
      //  if(name.startsWith('fa')) return FIcon.getImageSource(name.substring(3),size,color)
    }*/
    renderIcon(){
        let name = this.props.name
        if(this.props.name == null) //throw new Error('Icon: Invalid Chars');
            name = 'fa-circle-thin'
	var margin = this.props.badge? {marginRight:10}:{};
	//console.log("Icon["+this.props.name+"]color="+this.props.color+",margin="+JSON.stringify(margin))
        if(name.substring(0,3) ==='ion')
            return <IIcon name={name.substring(4)} size={this.props.size} color={this.props.color} onPress={this.props.onPress} style={this.props.style,margin} />
        if(name.substring(0,2)==='fa')
            return <FIcon name={name.substring(3)} size={this.props.size} color={this.props.color} onPress={this.props.onPress} style={this.props.style,margin} />
    }
    renderBadge(){
	if(!this.props.badge || this.props.badge.text==='' || this.props.badge.text==='0'){
            return null;
	}else{
          var styles={
            position:'absolute',
            top:1,
            right:1,
            width:this.props.size/2,
            height:this.props.size/2,
            borderRadius:this.props.size/2,
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: this.props.badge.color,
          };
          return (
            <View style={styles}>
                <Text style={{color:'#FFFFFF'}}>{this.props.badge.text}</Text>
            </View>
          );
	}
    }
    renderSpinIcon(){
        if(!this.props.spin) return this.renderIcon()
        else{
            const getStartValue = () => '0deg'
            const getEndValue = () => '360deg'
            const spin = this.state.spinValue.interpolate({
               inputRange: [0, 1],
               outputRange: [getStartValue(), getEndValue()]
            })
            return (
              <Animated.View style={{justifyContent:'center',alignItems:'center',transform: [{rotate: spin}]}}>
                {this.renderIcon()}
              </Animated.View>
            )
        }
    }
    render(){
        const getStartValue = () => '0deg'
        const getEndValue = () => '360deg'
        const spin = this.state.spinValue.interpolate({
           inputRange: [0, 1],
           outputRange: [getStartValue(), getEndValue()]
        })
	return (
          <View>
            {this.renderSpinIcon()}
            {this.renderBadge()}
          </View>
	);
    }
}

function getImageSource(name,size,color){
    if(name.substring(0,3)==='ion') return IIcon.getImageSource(name.substring(4),size,color)
    if(name.substring(0,2)==='fa')  return FIcon.getImageSource(name.substring(3),size,color)
}
var styles = StyleSheet.create({
  badge: {
    position:'absolute',
    top:1,
    right:1,
    width:20,
    height:20,
    borderRadius:15,
    alignItems: 'center',
    justifyContent: 'center',
    //backgroundColor: '#FF0000'
  },
});
module.exports = {
    Icon: Icon,
    getImageSource: getImageSource, 
}

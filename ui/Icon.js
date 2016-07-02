import React, { Component } from 'react'
import { StyleSheet,Text,View } from 'react-native'
import IIcon from 'react-native-vector-icons/Ionicons'
import FIcon from 'react-native-vector-icons/FontAwesome'

class Icon extends Component {
    constructor(props) {
        super(props);
    }
    /*getImageSource(name,size,color){
      //  if(name.startsWith('ion')) return IIcon.getImageSource(name.substring(4),size,color)
      //  if(name.startsWith('fa')) return FIcon.getImageSource(name.substring(3),size,color)
    }*/
    renderIcon(){
        if(this.props.name == null) throw new Error('Icon: Invalid Chars');
        if(this.props.name.substring(0,3) ==='ion')
            return <IIcon name={this.props.name.substring(4)} size={this.props.size} color={this.props.color} onPress={this.props.onPress} style={this.props.style} />
        if(this.props.name.substring(0,2)==='fa')
            return <FIcon name={this.props.name.substring(3)} size={this.props.size} color={this.props.color} onPress={this.props.onPress} style={this.props.style} />
    }
    renderBadge(){
        if(this.props.badge)
        return (
            <View style={[styles.badge, (this.props.IconBadgeStyle ? this.props.IconBadgeStyle : {})]}>
                <Text style={{color:'#FFFFFF'}}>{this.props.badge}</Text>
            </View>
        );
	else return null;
    }
    render(){
	return (
          <View>
            {this.renderIcon()}
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
    backgroundColor: '#FF0000'
  },
});
module.exports = {
    Icon: Icon,
    getImageSource: getImageSource, 
}

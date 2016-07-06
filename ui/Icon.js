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
	var margin = this.props.badge? {marginRight:10}:{};
	//console.log("Icon["+this.props.name+"]color="+this.props.color+",margin="+JSON.stringify(margin))
        if(this.props.name.substring(0,3) ==='ion')
            return <IIcon name={this.props.name.substring(4)} size={this.props.size} color={this.props.color} onPress={this.props.onPress} style={this.props.style,margin} />
        if(this.props.name.substring(0,2)==='fa')
            return <FIcon name={this.props.name.substring(3)} size={this.props.size} color={this.props.color} onPress={this.props.onPress} style={this.props.style,margin} />
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
    //backgroundColor: '#FF0000'
  },
});
module.exports = {
    Icon: Icon,
    getImageSource: getImageSource, 
}

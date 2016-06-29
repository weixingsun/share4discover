import React, { Component } from 'react'
import IIcon from 'react-native-vector-icons/Ionicons'
import FIcon from 'react-native-vector-icons/FontAwesome'

class Icon extends Component {
    constructor(props) {
        super(props);
        this.state = {
          name: this.props.name,
        };
    }
    /*getImageSource(name,size,color){
      //  if(name.startsWith('ion')) return IIcon.getImageSource(name.substring(4),size,color)
      //  if(name.startsWith('fa')) return FIcon.getImageSource(name.substring(3),size,color)
    }*/
    render(){
        if(this.props.name.substring(0,3) ==='ion')
            return <IIcon name={this.props.name.substring(4)} size={this.props.size} color={this.props.color} onPress={this.props.onPress} style={this.props.style} />
        if(this.props.name.substring(0,2)==='fa')
            return <FIcon name={this.props.name.substring(3)} size={this.props.size} color={this.props.color} onPress={this.props.onPress} style={this.props.style} />
    }
}

function getImageSource(name,size,color){
    if(name.substring(0,3)==='ion') return IIcon.getImageSource(name.substring(4),size,color)
    if(name.substring(0,2)==='fa')  return FIcon.getImageSource(name.substring(3),size,color)
}
module.exports = {
    Icon: Icon,
    getImageSource: getImageSource, 
}

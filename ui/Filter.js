'use strict';
import React, {Component,View,Text,TouchableHighlight,} from 'react-native';
import Style from './Style'
import NavBar from './NavBar'

export default class Filter extends Component {
  constructor(props) {
      super(props);
      this.state = {
          types: ['car'],
      };
  }

  render() {
    return (
      <View >
            <NavBar navigator={this.props.navigator} title={'Choose a Type'} left={'back'}/>
      </View>
    );
  }
}


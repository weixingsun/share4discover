'use strict';

import React, {Component} from 'react'
import { View, Text,} from 'react-native'

export default class Welcome extends Component {
  render() {
    return (
      <View style={{flex: 1, backgroundColor: '#246dd5', alignItems: 'center', justifyContent: 'center'}}>
        <Text style={{color: 'white', fontSize: 40,}}>Open Share Fun</Text>
      </View>
    );
  }
}

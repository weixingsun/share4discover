'use strict';

var React = require('react-native');
var {
  Component,
  View,
  Text,
} = React;

class Welcome extends Component {
  render() {
    return (
      <View style={{flex: 1, backgroundColor: '#246dd5', alignItems: 'center', justifyContent: 'center'}}>
        <Text style={{color: 'white', fontSize: 40,}}>Open Share Fun</Text>
      </View>
    );
  }
}

module.exports = Welcome;

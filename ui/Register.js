import React, { AppRegistry, Component, View, Text, StyleSheet, TouchableHighlight,  } from 'react-native'
import {GiftedForm, GiftedFormManager} from 'react-native-gifted-form'
class Form extends Component {

  render() {
    return (
      <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
        <TouchableHighlight>
          <Text style={{color: 'red', fontSize: 24}}>下一页</Text>
        </TouchableHighlight>
      </View>
    )
  }
}

var styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});

module.exports = Form;


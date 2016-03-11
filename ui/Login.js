import FBLogin from 'react-native-facebook-login'
import React,{View,StyleSheet }   from 'react-native'

var Login = React.createClass({
  render: function() {
    return (
	<View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
      <FBLogin />
	</View>
    );
  }
});

module.exports = Login;

var styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});

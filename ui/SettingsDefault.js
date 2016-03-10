'use strict';

var React = require('react-native');
var {View, Text, StyleSheet} = React;
var Button = require('react-native-button');
var Actions = require('react-native-router-flux').Actions;

class Register extends React.Component {
    render(){
        return (
	<View>
            <View style={styles.container}>
                <Text>Register page</Text>
                <Button onPress={Actions.home}>Replace screen</Button>
                <Button onPress={Actions.pop}>Back</Button>
            </View>
	<View style={styles.card}>
	  <Text>Login</Text>
	</View>
	<View style={styles.card}>
	  <Text>Favorites</Text>
	</View>
	<View style={styles.card}>
	  <Text>What is Hot</Text>
	</View>
	<View style={styles.card}>
	  <Text>Settings</Text>
	</View>
	<View style={styles.card}>
	  <Text>Help</Text>
	</View>
	<View style={styles.card}>
	  <Text>About</Text>
	</View>
	</View>
        );
    }
}

var styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F5FCFF',
    },
    welcome: {
        fontSize: 20,
        textAlign: 'center',
        margin: 10,
    },
    instructions: {
        textAlign: 'center',
        color: '#333333',
        marginBottom: 5,
    },
    card: {
      flex: 1,
      borderWidth: 1,
      //backgroundColor: '#fff',
      borderColor: 'rgba(0,0,0,0.1)',
      margin: 5,
      //height: 150,
      //height: 600,
      padding: 15,
      shadowColor: '#ccc',
      shadowOffset: { width: 2, height: 2, },
      shadowOpacity: 0.5,
      shadowRadius: 3,
    },
});

module.exports = Register;

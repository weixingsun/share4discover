var React = require('react-native');
var {View, Text, StyleSheet} = React;
var Icon = require('react-native-vector-icons/Ionicons');

/**
  Example FBLoginView class
  Please note:
  - this is not meant to be a full example but highlights what you have access to
  - If you use a touchable component, you will need to set the onPress event like below
**/
class FBLoginView extends React.Component {
  static contextTypes = {
    isLoggedIn: React.PropTypes.bool,
    login: React.PropTypes.func,
    logout: React.PropTypes.func,
    props: React.PropTypes.object
    };

  constructor(props) {
      super(props);
    }

    render(){
        return (
            <Icon.Button onPress={() => {
                if(!this.context.isLoggedIn){
                  this.context.login()
                }else{
                  this.context.logout()
                }
              }}
              //color={"#000000"}
              backgroundColor={"#425bb4"}
              name={"social-facebook-outline"}
              size={20} 
              //borderRadius={10}
            />
      )
    }
}
module.exports = FBLoginView;

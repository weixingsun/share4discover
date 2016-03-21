import React, {AppRegistry, Component, Navigator, StyleSheet, Text, View} from 'react-native'
import {Router, Route, Schema, } from 'react-native-router-flux'

import Register from './ui/Register'
import Error from './ui/Error'
import Main from './ui/Main'

class Nav extends Component {
    render() {
        return (
            <Router hideNavBar={true} >
                <Schema name="default" sceneConfig={Navigator.SceneConfigs.FloatFromBottom}/>
                <Schema name="modal" sceneConfig={Navigator.SceneConfigs.FloatFromRight}/>

                <Route name="main"     component={Main}     title="main"     hideNavBar={true}  hideTabBar={true} initial={true} wrapRouter={true} />
                <Route name="register" component={Register} title="Register" hideNavBar={false} />
                <Route name="error"    component={Error}    title="Error"    hideNavBar={false} type="modal"/>
            </Router>
        );
    }
}

module.exports = Nav;

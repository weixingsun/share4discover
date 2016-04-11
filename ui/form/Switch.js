/**
 * Created by Kevin on 16/1/8.
 */
'use strict'

import React,{Switch, StyleSheet, PropTypes,Component} from 'react-native';


class SwitchComponent extends Component {
    constructor(props) {
        super(props);
        this.state = {
            value: this.props.value
        }
    }

    _onChangeText(value){
        this.setState({value: value});
        this.props.onChange(value, this);
    }

    getValue(){
        return this.state.value
    }

    render() {
        return (
            <Switch value={this.state.value}
                       style={this.props.style}
                       onValueChange={(value) => this._onChangeText(value)}
                       disabled={this.props.disabled}
            />
        );
    }
}

SwitchComponent.defaultProps = {
    disabled: false,
    onChange:()=>{}
}

SwitchComponent.propTypes = {
    value: PropTypes.bool,
    style: Switch.propTypes.style,
    disabled: PropTypes.bool,
    onChange: PropTypes.func
}

export default SwitchComponent;
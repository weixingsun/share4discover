/**
 * Created by Kevin on 16/1/8.
 */
'use strict'

import React,{TextInput, StyleSheet, PropTypes,Component,Platform} from 'react-native';


class Input extends Component {
    constructor(props) {
        super(props);
        this.state={
            value: this.props.value
        }
    }

    _onChangeText(value){
        this.setState({value: value});
        this.props.onChange(value, this);
    }

    getValue(){
        return (this.props.type === "number" ? Number(this.state.value) : this.state.value);
    }

    render() {
        //console.log("Input:"+this.state.value)
        //console.log("Input:"+this.props.value)  //refresh value need this 
        return (
            <TextInput defaultValue={String(this.props.value)} //value={String(this.props.value)}
                       style={[this.props.style, (this.props.editable ? null : styles.disabled)]}
                       onChangeText={(value) => this._onChangeText(value)}
                       editable={this.props.editable}
                       textAlign={Platform.OS === 'android' ? "end" : "right"}
                       //underlineColorAndroid="transparent"
                       keyboardType={(this.props.type === "number" ? "numeric" : "default")}
                       secureTextEntry={this.props.type === "password"}
                       placeholder={this.props.placeholder}
                       multiline={this.props.multiline}
            />
        );
    }
}

Input.defaultProps = {
    type: "string",
    editable: true,
    onChange:()=>{}
}

Input.propTypes = {
    type: PropTypes.oneOf(['string', 'number', 'password']),
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    style: TextInput.propTypes.style,
    editable: PropTypes.bool,
    placeholder: PropTypes.string,
    onChange: PropTypes.func
}

const styles = StyleSheet.create({
    disabled: {
        //color: '#aaa'
    }
})

export default Input;

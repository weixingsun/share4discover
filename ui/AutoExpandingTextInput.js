import React from 'react'
import {
  TextInput,
  StyleSheet,
} from 'react-native';
export default class AutoExpandingTextInput extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      text: this.props.value,
      height: 0,
    }
    this.setText = this.setText.bind(this);
  }
  setText(text){
    this.setState({text:text});
  }
  componentWillReceiveProps(nextProps) {
    //alert('nextProps='+JSON.stringify(nextProps))
    //if(nextProps.value && nextProps.value)
    this.setText(nextProps.value)
  }
  render() {
    return (
      <TextInput
        ref={textInput => (this._textInput = textInput)}
        {...this.props}
        multiline={true}
        onContentSizeChange={ (event) => {
          this.setState({
            height: event.nativeEvent.contentSize.height
          });
        }}
        onChangeText={(text) => {
          this.setState({text});
        }}
        style={[
          styles.default,
          {height: Math.max(35, this.state.height)}
        ]}
        value={this.state.text}
      />
    );
  }
}


var styles = StyleSheet.create({
  default: {
    height: 26,
    borderWidth: 0.5,
    borderColor: '#0f0f0f',
    flex: 1,
    fontSize: 13,
    padding: 4,
  },
})

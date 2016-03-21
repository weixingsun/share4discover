import React, {
  Component,
  AppRegistry,
  Text,
  View,
} from 'react-native';

import DropDown, {
  Select,
  Option,
  OptionList,
} from 'react-native-selectme';

class Selectme extends Component {
  constructor(props) {
    super(props);

    this.state = {
      canada: ''
    };
  }

  _getOptionList() {
    return this.refs['OPTIONLIST'];
  }


  _canada(province) {

  this.setState({
      ...this.state,
      canada: province
    });
    this.setState({type:province})
  }

  //<Option value = {{id : "alberta"}}>Alberta</Option>
  //<Option>British Columbia</Option>
  render() {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Select
            width={250}
            ref="SELECT1"
            optionListRef={this._getOptionList.bind(this)}
            defaultValue="Select a Province in Canada ..."
            onSelect={this._canada.bind(this)}>
            <Option>Car</Option>
            <Option>Girl</Option>
          </Select>

          <Text>Selected Canada's province: {this.state.canada}</Text>

          <OptionList ref="OPTIONLIST"/>
      </View>
    );
  }
}

module.exports = Selectme;

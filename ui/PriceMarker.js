import React, {Component} from 'react'
import {StyleSheet, View, Text,} from 'react-native'

var PriceMarker = React.createClass({
  getDefaultProps() {
    return {
      fontSize: 13,
    };
  },
  render() {
    return (
      <View style={styles.container}>
        <View style={styles.bubble}>
          <Text style={styles.dollar}>$</Text>
          <Text style={[styles.amount, { fontSize: this.props.fontSize }]}>{this.props.amount}</Text>
        </View>
        <View style={styles.arrowBorder} />
        <View style={styles.arrow} />
      </View>
    );
  },
});

var styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    alignSelf: 'flex-start',
  },
  bubble: {
    flex: 0,
    flexDirection: 'row',
    alignSelf: 'flex-start',
    backgroundColor: '#5A5FFF',
    padding: 2,
    borderRadius: 3,
    borderColor: '#D23F44',
    borderWidth: 0.5,
  },
  dollar: {
    color: '#FFFFFF',
    fontSize: 10,
  },
  amount: {
    color: '#FFFFFF',
    fontSize: 13,
  },
  arrow: {
    backgroundColor: 'transparent',
    borderWidth: 4,
    borderColor: 'transparent',
    borderTopColor: '#FF5A5F',
    alignSelf: 'center',
    marginTop: -9,
  },
  arrowBorder: {
    backgroundColor: 'transparent',
    borderWidth: 4,
    borderColor: 'transparent',
    borderTopColor: '#D23F44',
    alignSelf: 'center',
    marginTop: -0.5,
  },
});

module.exports = PriceMarker;

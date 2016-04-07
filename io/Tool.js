//import React,{ AsyncStorage } from 'react-native'

var Tool = {
    distance(position1, position2){
      var lat1=position1.latitude, lon1=position1.longitude;
      var lat2=position2.latitude, lon2=position2.longitude;
      var R = 6371;
      var a = 0.5 - Math.cos((lat2 - lat1) * Math.PI / 180)/2 + 
        Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
        (1 - Math.cos((lon2 - lon1) * Math.PI / 180))/2;
      var m = R * 2 * Math.asin(Math.sqrt(a))*1000;
      //return m.toFixed(0);
      return Math.floor(m);
    },
    getKM(m){
      return Math.floor(m/1000);
    },
};

module.exports = Tool;

//import React,{ NetInfo } from 'react-native'

var Net = {
    HOST:'http://45.32.83.93',
    async netCmd(url, data) {
      try {
        let response = await fetch(url, data);
        let responseJson = await response.json();
        return responseJson;
      } catch(error) {
        console.error(error);
      }
    },
    _get(url) {
      return this.netCmd(url,{method:'get'});
    },
    _del(url) {
      return this.netCmd(url,{method:'delete'});
    },
    _post(url, data) {
      return this.netCmd(url,{
          method:'post',
          headers: { 'Accept': 'application/json', 'Content-Type': 'application/json', },
          body: JSON.stringify(data)
      });
    },
    getMsgTypes(){
      var url = HOST+'/api/msg_types';
      return this._get(url);
    },
    rangeMsg(type,pos,dist){
      var url = this.HOST+'/api/msgs/'+type+'&'+pos+'&'+dist;
      return this._get(url);
    },
    getMsg(key){
      var url = this.HOST+'/api/msg/'+key;
      return this._get(url);
    },
    setMsg(json){
      var url = this.HOST+'/api/msg/';
      return this._post(url, json);
    },
    delMsg(key){
      var url = this.HOST+'/api/msg/'+key;
      return this._del(url);
    },
};

module.exports = Net;

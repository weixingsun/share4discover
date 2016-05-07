import React from "react"
//import {View} from "react-native"
export default class RestAPI extends React.Component {
    constructor(props){
      super(props);
      this.state = { };
      this.header = {};
      this.host = 'http://45.32.83.93';
    }
    //token=null;
    async netCmd(url, data) {
      try { 
        let response = await fetch(url, data); 
        let responseJson = await response.json(); 
        return responseJson;
      } catch(error) {
        console.error(error); 
      }
    }
/*{
  method: 'POST', 
  headers: { 'Accept': 'application/json', 'Content-Type': 'application/json', }, 
  body: JSON.stringify({ id: 1, }) 
}*/
    _get(url) {
      return this.netCmd(url,{method:'get'});
    }
    _del(url) {
      return this.netCmd(url,{method:'delete'});
    }
    _post(url, data) {
      return this.netCmd(url,{
               method:'post', 
               headers: { 'Accept': 'application/json', 'Content-Type': 'application/json', },
               body: JSON.stringify(data)
             });
    }
    rangeMsg(type,pos,dist){
      var url = 'http://45.32.83.93/api/msgs/'+type+'&'+pos+'&'+dist;
      return this._get(url);
    }

    getMsg(key){
      var url = 'http://45.32.83.93/api/msg/'+key;
      return this._get(url);
    }
    getMsgTypes(){
      var url = 'http://45.32.83.93/api/msg_types';
      return this._get(url);
    }
    setMsg(json){
      var url = 'http://45.32.83.93/api/msg/';
      return this._post(url, json);
    }
    delMsg(key){
      var url = 'http://45.32.83.93/api/msg/'+key;
      return this._del(url);
    }
}

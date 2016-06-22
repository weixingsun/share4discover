//import React,{ NetInfo } from 'react-native'
/*
#https
wget https://dl.eff.org/certbot-auto
chmod a+x certbot-auto
./certbot-auto  //install dependencies
./certbot-auto certonly  //text ui
#./certbot-auto renew --dry-run  //manually
./certbot-auto renew --quiet --no-self-upgrade  //cron
*/
var Net = {
    MSG_TYPES:{
        'car':'Car',
        'estate':'Real Estate',
        'help':'Help',
    },
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
    _put(url,data) {
        return this.netCmd(url,{
            method:'put',
            headers: { 'Accept': 'application/json', 'Content-Type': 'application/json', },
            body: JSON.stringify(data)
        });
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
      var strLatlng = pos.latitude+','+pos.longitude
      var url = this.HOST+'/api/msgs/'+type+'&'+strLatlng+'&'+dist;
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
    putMsg(json){
      var url = this.HOST+'/api/msg/';
      return this._put(url, json);
    },
    delMsg(key){
      var url = this.HOST+'/api/msg/'+key;
      return this._del(url);
    },
};

module.exports = Net;

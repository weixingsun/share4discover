import Global from './Global'
/*
#https
wget https://dl.eff.org/certbot-auto
chmod a+x certbot-auto
./certbot-auto  //install dependencies
./certbot-auto certonly  //text ui
#./certbot-auto renew --dry-run  //manually
./certbot-auto renew --quiet --no-self-upgrade  //cron
*/
function isJsonString(str) {
    try {
        JSON.parse(str);
    } catch (e) {
        return false;
    }
    return true;
}

var Net = {
    HOST:Global.HOST,
    USER_HOST:Global.USER_HOST,
    async netCmd(url, data) {
      try {
        let response = await fetch(url, data);
        let responseJson = await response.json();
        return responseJson;
      } catch(err) {
        //console.error(err);
        alert('Network Problem')
      }
    },
    _get(url) {
      return this.netCmd(url,{method:'get'});
    },
    _del(url) {
      return this.netCmd(url,{method:'delete'});
    },
    _del_body(url,data) {
      return this.netCmd(url,{
            method:'delete',
            headers: { 'Accept': 'application/json', 'Content-Type': 'application/json', },
            body: JSON.stringify(data)
        });
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
    getObjByKey(key){
        var url = HOST+'api/key/'+key;  // not #
        return this._get(url);
    },
    getMsgTypes(){
      var url = HOST+'api/msg_types';
      return this._get(url);
    },
    rangeMsg(type,cat,pos,dist){
      var strLatlng = pos.latitude+','+pos.longitude
      var url = this.HOST+'api/msgs/'+type+'_'+cat+'&'+strLatlng+'&'+dist;
      return this._get(url);
    },
    getMsg(key){
      var url = this.HOST+'api/msg/'+key;
      return this._get(url);
    },
    getMyMsgs(key){    //*fb:email
      var url = this.HOST+'api/mymsg/'+key;
      return this._get(url);
    },
    getNotify(key){    //@fb:email
      var url = this.HOST+'api/notify/'+key;
      return this._get(url);
    },
    setMsg(json){
      var url = this.HOST+'api/msg/';
      return this._post(url, json);
    },
    setMyMsg(json){
      var url = this.HOST+'api/msg/';
      return this._post(url, json);
    },
    putHash(json){
      var url = this.HOST+'api/msg/';
      return this._put(url, json);
    },
    delMsg(key){
      var url = this.HOST+'api/msg/'+key;
      return this._del(url);
    },
    getHKeys(key){
      var url = this.HOST+'api/hash/'+key;
      //alert('Net.getHKeys() url='+url)
      return this._get(url);
    },
    //putHash(url,json){
    //  return this._put(url,json);
    //},
    delHash(data){
      var url = this.HOST+'api/hashkey';
      return this._del_body(url,data);
    },
    renameHashKey(json){  //{key,oldfield,newfield}
      var url = this.HOST+'api/hash/rename';
      return this._put(url,json);
    },
    loginUser(json){
      var url = this.USER_HOST;
      return this._post(url, json);
    },
    chooseMapFromNetwork(){
      this._get(Global.IP2LOC_HOST).then((result)=>{
        let inchina = result.country_code.toUpperCase() == 'CN'
        if(inchina)  Global.MAP = Global.BaiduMap;
        else Global.MAP = Global.GoogleMap;
      })
    },
    getLatlngFromNetwork(){
      this._get(Global.IP2LOC_HOST).then((result)=>{
        //let inchina = result.country_code.toUpperCase() == 'CN'
        alert(JSON.stringify(result))
      })
    },
};

module.exports = Net;

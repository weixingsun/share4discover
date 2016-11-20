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
        alert('Network Problem err='+JSON.stringify(err))
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
    //getLocation(){
    //  return this._get(Global.IP2LOC_HOST)
    //},
    getBDLocation(){
      let url=Global.BD_IP2LOC_HOST+'&ak='+Global.and_ak+'&mcode='+Global.rel_and_mcode
      return this._get(url)
    },
    getGGLocation(){
      let url=Global.GG_IP2LOC_HOST+'latlng='+Global.region.latitude+','+Global.region.longitude //-43.500935,%20172.395744'
      return this._get(url)
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
    getLocation(func){
        let self=this
        this.getBDLocation().then((gps)=>{
            //alert(JSON.stringify(gps))
            if(gps.status==0 && gps.content.address_detail.city_code){
              let loc = {
                  city:gps.content.address_detail.city,
                  city_id:gps.content.address_detail.city_code,
                  country:gps.address.split('|')[0].toLowerCase(),
              }
              func(loc)
            }else{
              Net.getGGLocation().then((gps)=>{
                let arr = gps.results[0].address_components
                var city1='',city2='',province1='',country=''
                arr.map((c)=>{
                  if(c.types[0]==='locality'){
                    city1=c.short_name.replace(' ','-').toLowerCase()
                    city2=c.long_name
                  }
                  //if(c.types[0]==='administrative_area_level_1') province1=c.short_name.toLowerCase()
                  if(c.types[0]==='country') country=c.short_name.toLowerCase()
                })
                //alert('city1='+city1+' city2='+city2+' country='+country)
                if(city1 && city2 && country){
                    let loc = {
                      city:city2,
                      city_id:city1,
                      country:country,
                    }
                    func(loc)
                }
              })
            }
        })
    },
};

module.exports = Net;

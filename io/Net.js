import Global from './Global'
import I18n from 'react-native-i18n'
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
      let url=Global.BD_GEOCODE_HOST+'location='+Global.region.latitude+','+Global.region.longitude+'&ak='+Global.and_ak+'&mcode='+Global.rel_and_mcode
      //let url=Global.BD_IP2LOC_HOST+'location=38.867475,121.529632&ak='+Global.and_ak+'&mcode='+Global.rel_and_mcode
      //console.log('url='+url)
      return this._get(url)
    },
    getGGLocation(){
      let url=Global.GG_GEOCODE_HOST+'latlng='+Global.region.latitude+','+Global.region.longitude //-43.500935,%20172.395744'
      //let url=Global.GG_IP2LOC_HOST+'latlng=-43.658666,172.225800' //-43.500935,%20172.395744'
      return this._get(url)
    },
    chooseMapFromNetwork(){
      this._get(Global.IP2LOC_HOST).then((result)=>{
        let inchina = result.country_code.toUpperCase() == 'CN'
        if(inchina)  Global.MAP = Global.BaiduMap;
        else Global.MAP = Global.GoogleMap;
      })
    },
    getLocationFromNetwork(func){
		let self=this
	  let url = Global.BD_IP2LOC_HOST+'&ak='+Global.and_ak+'&mcode='+Global.rel_and_mcode
      this._get(url).then((result)=>{
        //let inchina = result.country_code.toUpperCase() == 'CN'
        //alert('Net.getLocationFromNetwork()'+JSON.stringify(result))
		//console.log('Net.getLocation.getBDLocation() '+JSON.stringify(gps))
		if(result.status==0) {func(result)}
		else{
			let url2 = Global.FREE_IP2LOC_HOST
			self._get(url).then((result)=>{
				//alert('Net.getLocationFromFreeHost()'+JSON.stringify(result))
				if(result.status==0) {func(result)}
			})
		}
      })
    },
    getLocation(func){
        let self=this
        this.getBDLocation().then((gps)=>{
            //alert(JSON.stringify(gps))
            if(gps.status==0 &&gps.result && gps.result.addressComponent && gps.result.addressComponent.country_code==0){
              console.log('Net.getLocation.getBDLocation() '+JSON.stringify(gps))
              let loc = {
                  //district:gps.content.address_detail.district,
                  //district_id:gps.content.address_detail.district,
                  //city:gps.content.address_detail.city,
                  //city_id:gps.content.address_detail.city_code,
                  //country:gps.address.split('|')[0].toLowerCase(),
                  district:   gps.result.addressComponent.district,
                  district_id:gps.result.addressComponent.adcode,
                  city:       gps.result.addressComponent.city,
                  city_id:    gps.result.cityCode,
                  country:    'cn',
              }
              func(loc)
            }else{
              Net.getGGLocation().then((gps)=>{
                let arr = gps.results[0].address_components
                var city1='',city2='',district1='',district2,province1='',country=''
                //alert(JSON.stringify(arr))
                arr.map((c)=>{
                  if(c.types[0]==='locality'){
                    city1=c.short_name.replace(' ','-').toLowerCase()
                    city2=c.long_name
                  }else if(c.types.indexOf('sublocality')>0){
                    district1=c.short_name.replace(' ','-').toLowerCase()
                    district2=c.short_name
                  }else if(c.types[0]==='country'){
                    country=c.short_name.toLowerCase()
                  }
                  //else if(c.types[0]==='administrative_area_level_1') province1=c.short_name.toLowerCase()
                })
                if(district1=='') district1='all',district2=I18n.t('all') //for small towns
                //alert('city1='+city1+' city2='+city2+' country='+country)
                if(city1 && city2 && country){
                    let loc = {
                      district:district2,
                      district_id:district1,
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

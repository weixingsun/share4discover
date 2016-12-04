import moment from 'moment';
import Lang from './Lang';
import I18n from 'react-native-i18n'
//const deviceLocale = I18n.locale
import ChinaCity from '../data/china_city.json'
import ChinaDistrict from '../data/china_district.json'

function loadLang(lang){
  switch(lang) {
      case 'cn':
      case 'zh-cn':
      case 'zh_CN':
      case 'zh-CN':
         require('moment/locale/zh-cn');
         break;
      case 'en':
      case 'en-US':
      case 'en_US':
      case 'en-GB':
      case 'en_GB':
         require('moment/locale/en-gb');
         break;
      default:
         //require('moment/locale/en');
  }
  //require('moment/locale/zh-cn')
}
module.exports = {
    permissions: {
      location:false,
      camera:false,
      photo:false,
      event:false,
    },
    ios_ak:   'WAqWASmCo1GO6uA2AWkjs868PVDRaQOO',
    and_ak:   '6MbvSM9MLCPIOYK4I05Ox0FGoggM5d9L',
    ios_sk:   'X4WIxOH4ybCzNZ6xdSG69kQ5eGzkDs2S',
    and_sk:   '2GvcaUXXlWvMIOSWSSbaEnGo8lxg49Vy',
    ios_mcode:'open.shareplus',
    rel_and_mcode: 'F9:F3:46:15:55:59:22:6A:FB:75:92:FF:23:B4:75:AF:20:E7:22:D6;com.share',
    dev_and_mcode: '81:1E:3F:40:F6:F6:4F:68:D7:6E:79:BC:18:CA:AC:26:84:14:1C:F7;com.share',
    demo_mcode: 'DA:4C:B6:A9:55:62:1D:AD:12:29:DD:7B:69:31:67:47:C5:B2:4E:E1;szj.com.ditu',
    ggkey:'AIzaSyApl-_heZUCRD6bJ5TltYPn4gcSCy1LY3A',

    GoogleMap:'gg',
    BaiduMap: 'baidu',
    GaodeMap: 'gaode',
    MAP_TYPE_NORMAL:   'standard',
    MAP_TYPE_SATELLITE:'satellite',
    MAP_TRAFFIC_TRUE: 'yes',
    MAP_TRAFFIC_FALSE: 'no',
    HOST: 'http://nzmessengers.co.nz/service/node.php?path=',
    USER_HOST: 'http://nzmessengers.co.nz/service/user.php',
    host_image: 'http://nzmessengers.co.nz/service/',
    empty_image: 'http://nzmessengers.co.nz/service/empty.png',
    host_image_info: 'http://nzmessengers.co.nz/service/info/',
    host_image_help: 'http://nzmessengers.co.nz/service/help/',
    //app_url_pre: 'share://nzmessengers.co.nz/info/',
    //http_url_pre: 'http://shareplus.co.nf/url.php?key=',
    FREE_IP2LOC_HOST: 'http://freegeoip.net/json',
    BD_IP2LOC_HOST: 'http://api.map.baidu.com/location/ip?coor=bd09ll',
    BD_IP2LOC_HOST_ADV: 'http://api.map.baidu.com/highacciploc/v1?qterm=pc&coord=bd09ll', //qcip=1.1.1.1
    //BD_IP2LOC_HOST2: 'http://api.map.baidu.com/location/ip?ip=101.30.35.44',
    BD_GEOCODE_HOST: 'http://api.map.baidu.com/geocoder/v2/?output=json&', //location=39.983424,116.322987
    GG_GEOCODE_HOST: 'http://maps.googleapis.com/maps/api/geocode/json?', //latlng=-43.500935,%20172.395744
    post:'post',
    none:'none',
    push_local:'local',
    push_p2p:'p2p',
    push_tag:'tag',
    mainlogin: '',
    login_names:{},
    //logins: {},
    SETTINGS_LOGINS: {},
    ALL_MSGS: '$allmsgs',
    SHOW_ADS: 'ShowAds',
    userObjects:{},
    user_fb:null,
    user_gg:null,
    user_wb:null,
    user_wx:null,
    KEY: '',
    URL: '',
    COLOR: {
      ORANGE: '#C50',
      DARKBLUE: '#0F3274',
      LIGHTBLUE: '#6EA8DA',
      DARKGRAY: '#999',
    },
    no_rent_types: ['ticket','service'],
    rent_cats: ['rent0','rent1','service'],
    sec_types_no_rent: [
            {value:'buy',icon:'ion-ios-log-in'},
            {value:'sell',icon:'ion-ios-log-out'},
            {value:'service',icon:'ion-ios-planet'}],
    sec_types_all: [
            {value:'buy',icon:'ion-ios-log-in'},
            {value:'sell',icon:'ion-ios-log-out'},
            {value:'rent0',icon:'ion-ios-log-in'},
            {value:'rent1',icon:'ion-ios-log-out'},
            {value:'service',icon:'ion-ios-planet'}],
    TYPE_ICONS: {
      all:   'ion-ios-cube',
      house: 'ion-ios-home',
      car:   'ion-ios-car',
      tool:  'ion-ios-construct',
      game:  'ion-ios-game-controller-b',
      phone: 'ion-ios-phone-portrait',
      computer:'ion-ios-laptop',
      camera:'ion-ios-camera',
      ticket:'ion-md-pricetags',  //ion-ios-pricetags
      service:'ion-ios-key',  //  'ion-ios-thumbs-up',  //ion-ios-happy
      //book:  'ion-ios-book',
      //medkit:'ion-ios-medkit',
      //media: 'ion-ios-musical-notes',
      //ticket:'ion-md-pricetags',  //ion-ios-pricetags
      //help:  'ion-ios-help-buoy',
      //study: 'ion-ios-school',
      //plants:'ion-ios-pizza',
      //human: 'ion-ios-person',
      //mail:  'ion-ios-mail',
      //food:  'ion-ios-pizza',
      //music: 'ion-ios-musical-notes',
    },
    TYPE_IMAGES: {
      all:   '',
      house: '',
      car:   '',
      tool:  '',
      game:  '',
      phone: '',
      computer:'',
      camera:'',
      ticket:'',
      service:'',
    },
    SNS_ICONS:{
      fb:'fa-facebook-square',
      gg:'fa-google-plus-square',
      wx:'fa-weixin',
      wb:'fa-weibo',
      tel:'fa-phone-square',
    },
    FEED_ICONS:{
      rss:'fa-rss',
      yql:'fa-yahoo',
      web:'fa-internet-explorer',
      share:'fa-bell',
    },
    getTimeInKey(key){
      if(key) return key.split(':')[2]
      else    return ""
    },
    getCityNameFromId(id){
        if(/^\d+$/.test(id)){
            return ChinaCity[id]
        }else{
            //alert('id='+id+' bj code=131,name='+ChinaCity[131])
            return id.replace('-',' ').firstUpperCase()
        }
    },
    getDistrictNameFromId(id){
        if(/^\d+$/.test(id)){
            return ChinaDistrict[id]
        }else{
            //alert('id='+id+' bj code=131,name='+ChinaCity[131])
            return id.replace('-',' ').firstUpperCase()
        }
    },
    getTagNameFromJson(msg) {
      return 'l_'+msg.country+'_'+msg.city_id+'_'+msg.district_id+'_'+msg.type+'_'+msg.cat
    },
    getLocalTagNameFromJson(msg) {
      return 'l_'+msg.country+'_'+msg.city_id
    },
    getDistrictTagNameFromJson(msg) {
      return 'l_'+msg.country+'_'+msg.city_id+'_'+msg.district_id
    },
    getJsonFromTagName(name) {
        let names = name.split('_')
        if(names.length>3) return {
            country:names[1],
            city_id:names[2],
            district_id:names[3],
            type:names[4],
            cat:names[5],
          }
        else return {
            country:names[1],
            city_id:names[2],
            district_id:names[3],
          }
    },
    getLoginStr(){
        let arrKey = Object.keys(this.userObjects)
        let str = ''
        arrKey.map((k)=>{
            str += ','+k+':'+this.userObjects[k].id+':'+this.userObjects[k].name
        })
        return str.substring(1);
    },
    getLogins(ownersStr){
        let arr = ownersStr.split(',')
        let obj = {}
        arr.map((userStr)=>{   //fb:email
            let type = userStr.split(':')[0]
            let email = userStr.split(':')[1]
            obj[type]=email
        })
        return obj;
    },
    getInfoMainLoginName(ownersStr){
        let arr = ownersStr.split(',')  //let name = userStr.split(':')[2]
        let main = ''
        arr.map((userStr)=>{
            if(userStr.indexOf('fb:')) main = userStr
            else if(userStr.indexOf('wx:')) main = userStr
            else if(userStr.indexOf('wb:')) main = userStr
            else if(userStr.indexOf('gg:')) main = userStr
        })
        let arr1 = main.split(':')
        return arr1.length===3?arr1[2]:arr1[1]
    },
    getInfoMainLogin(logins){
        if(Object.keys(logins).length===0){
            return '';
        }else{
            if(logins.fb)  return 'fb:'+logins.fb
            if(logins.wx)  return 'wx:'+logins.wx
            if(logins.gg)  return 'gg:'+logins.gg
            if(logins.wb)  return 'wb:'+logins.wb
        }
    },
    getMainLogin(){
        //fb > wx > gg > wb
        //{fb:email,wx:email,gg:email,wb:email}
        //console.log('Global.getMainLogin() logins='+JSON.stringify(this.logins)+' userObjects='+JSON.stringify(this.userObjects))
        if(Object.keys(this.userObjects).length===0){
            return '';
        }else{
            if(this.userObjects.fb)  return 'fb:'+this.userObjects.fb.id
            if(this.userObjects.wx)  return 'wx:'+this.userObjects.wx.id
            if(this.userObjects.wb)  return 'wb:'+this.userObjects.wb.id
        }
    },
    getMainLoginType(){
            if(this.userObjects.fb)  return 'fb'
            if(this.userObjects.wx)  return 'wx'
            if(this.userObjects.wb)  return 'wb'
    },
    getMainLoginName(){
            if(this.userObjects.fb)  return this.userObjects.fb.name
            if(this.userObjects.wx)  return this.userObjects.wx.name
            if(this.userObjects.wb)  return this.userObjects.wb.name
    },
    getNotifyKey(){
        return '@'+this.mainlogin
    },
    getKeyFromMsg(msg){
        return msg.type+'_'+msg.cat+':'+msg.lat+','+msg.lng+':'+msg.ctime
    },
    getKeyFromReply(reply){
        return reply.type+'_'+reply.cat+':'+reply.latlng+':'+reply.ctime
    },
    getDateTimeFormat(datetimeInt){
        let now = Math.round(+new Date()/1000) //+new Date();   //date.getTimezoneOffset() / 60
	//let datetimeStr = new Date(datetimeInt).toISOString().replace(/T/, ' ').replace(/\..+/, '')
        //moment.locale(lang);
        loadLang(I18n.locale.replace('_', '-').toLowerCase())
        let momentDate = moment(datetimeInt*1000) //.format("YYYY-MM-DD hh:MM:ss");
        if(now-datetimeInt<86400){        //1 day
            return momentDate.fromNow()
	}else{
	    return momentDate.format('YYYY-MM-DD')
	}
    },
    getTimeFull(timeInt){
        let time1 = moment(timeInt*1000)
        return time1.format('YYYY-MM-DD HH:mm') //ss
    },
    str2date(str){
        return moment(str)
    },
    rssDateStr2date(str){
        //let date=moment(str).valueOf()
        let dateInt = Date.parse(str);
        //loadLang(lang)
        loadLang(I18n.locale.replace('_', '-').toLowerCase())
        let momentDate = moment(dateInt)
        let now = +new Date();
        if(now-dateInt<86400000){        //1 day
            return momentDate.fromNow()
        }else{
            return momentDate.format('YYYY-MM-DD')
        }
    },
    getLang(){
        return moment.locale()
    },
    getFeedApi(){
        if(this.userObjects.fb){
            return `https://graph.facebook.com/me/feed&access_token=${this.userObjects.fb.token}`
        }else if(this.userObjects.gg) return '';
        else if(this.userObjects.wb) return '';
    },
    //share://nzmessengers.co.nz/info/car:41.767338,123.422675:1469942725304
    getSnsUrl(key,sns){
        //let http_url1='http://shareplus.co.nf/url.php?key='
        let http_url1='http://nzmessengers.co.nz/service/url.php?key='
        //return 'http://shareplus.co.nf/i/'+key//+'&sns='+sns
        return http_url1+encodeURIComponent(key)+'&sns='+sns
        //return 'http://shareplus.co.nf/i/'+encodeURIComponent(key)//+'&sns='+sns
    },
    trimTitle(title){
        let limit = 30
        let len = (this.getLength(title))
        let title1 = len>limit?this.subString(title,limit)+'...':title
        return title1.trim();
    },
    getLength(str){
        if (str == null) return 0;
        if (typeof str != "string") str += "";
        return str.replace(/[^\x00-\xff]/g,"[]").length;
    },
    subString(str,n){
        var r = /[^\x00-\xff]/g;
        if(str.replace(r, "[]").length <= n) return str;
        // n = n - 3;
        var m = Math.floor(n/2);
        for(var i=m; i<str.length; i++) {
            if(str.substr(0, i).replace(r, "[]").length>=n) return str.substr(0, i) ;
        }
        return str;
    },
    distanceDelta(latDelta,lngDelta){
       return Math.floor(111111 * Math.min(latDelta,lngDelta)/2); //range circle in bbox
    },
    distance(lat1, lon1, lat2, lon2) {
      var R = 6371;
      var a = 0.5 - Math.cos((lat2 - lat1) * Math.PI / 180)/2 +
         Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
         (1 - Math.cos((lon2 - lon1) * Math.PI / 180))/2;
      var m = R * 2 * Math.asin(Math.sqrt(a))*1000;
      return Math.floor(m);
    },
    distanceName(lat1, lon1, lat2, lon2){
      let dist = this.distance(lat1, lon1, lat2, lon2)
      if(dist>1000) return (dist/1000).toFixed(1)+'km'
      else return dist+'m'
    },
    mercatorTolonlat(mercator){
      var lonlat={x:0,y:0};
      var x = mercator.x/20037508.34*180;
      var y = mercator.y/20037508.34*180;
      y= 180/Math.PI*(2*Math.atan(Math.exp(y*Math.PI/180))-Math.PI/2);
      lonlat.x = x;
      lonlat.y = y;
      return lonlat;
    },
    lonlatTomercator(lonlat) {
      var mercator={x:0,y:0};
      var x = lonlat.x *20037508.34/180;
      var y = Math.log(Math.tan((90+lonlat.y)*Math.PI/360))/(Math.PI/180);
      y = y *20037508.34/180;
      mercator.x = x;
      mercator.y = y;
      return mercator ;
    },
};

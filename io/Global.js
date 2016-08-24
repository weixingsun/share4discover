import moment from 'moment';
import Lang from './Lang';

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
    GoogleMap:'GoogleMap',
    BaiduMap:'BaiduMap',
    GaodeMap:'GaodeMap',
    MAP_TYPE_NORMAL:'standard',
    MAP_TYPE_SATELLITE:'satellite',
    host_image: 'http://nzmessengers.co.nz/service/',
    empty_image: 'http://nzmessengers.co.nz/service/empty.png',
    host_image_info: 'http://nzmessengers.co.nz/service/info/',
    host_image_help: 'http://nzmessengers.co.nz/service/help/',
    IP2LOC_HOST: 'http://freegeoip.net/json',
    mainlogin: '',
    logins: {},
    ALL_MSGS: '$allmsgs',
    SHOW_ADS: 'ShowAds',
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
    TYPE_ICONS: {
      house: 'ion-ios-home',
      car:   'ion-ios-car',
      mail:  'ion-ios-mail',
      human: 'ion-ios-person',
      ticket:'ion-ios-pricetags',
      book:  'ion-ios-book',
      tool:  'ion-ios-construct',
      food:  'ion-ios-pizza',
      help:  'ion-ios-help-buoy',
      medkit:'ion-ios-medkit',
      game:  'ion-ios-game-controller-b',
      phone: 'ion-ios-phone-portrait',
      pc:    'ion-ios-laptop',
      school:'ion-ios-school',
      music: 'ion-ios-musical-notes',
    },
    SNS_ICONS:{
      fb:'fa-facebook-square',
      gg:'fa-google-plus-square',
      wx:'fa-weixin',
      wb:'fa-weibo',
      tel:'ion-ios-call-outline',
    },
    getLoginStr(loginObj){
        let arrKey = Object.keys(loginObj)
        let str = ''
        arrKey.map((k)=>{
            str += ','+k+':'+loginObj[k]
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
    getMainLogin(logins){
        //fb > wx > gg > wb
        //{fb:email,wx:email,gg:email,wb:email}
        if(Object.keys(logins).length===0){
            return '';
        }else{
            if(logins.fb)  return 'fb:'+logins.fb
            if(logins.wx)  return 'wx:'+logins.wx
            if(logins.gg)  return 'gg:'+logins.gg
            if(logins.wb)  return 'wb:'+logins.wb
        }
    },
    getNotifyKey(){
        return '@'+this.mainlogin
    },
    getKeyFromMsg(msg){
        return msg.type.toLowerCase()+':'+msg.lat+','+msg.lng+':'+msg.ctime
    },
    getKeyFromReply(reply){
        return reply.type+':'+reply.latlng+':'+reply.ctime
    },
    getDateTimeFormat(datetimeInt,lang){
        let now = +new Date();   //date.getTimezoneOffset() / 60
	//let datetimeStr = new Date(datetimeInt).toISOString().replace(/T/, ' ').replace(/\..+/, '')
        //let lang = LocalizedStrings.getLanguage()
        //moment.locale(lang);
        loadLang(lang)
        let momentDate = moment(datetimeInt) //.format("YYYY-MM-DD hh:MM:ss");
        if(now-datetimeInt<86400000){        //1 day
            return momentDate.fromNow()
	}else{
	    return momentDate.format('YYYY-MM-DD')
	}
    },
    loadLocale(lang){
        loadLang(lang)
    },
    getLang(){
        //return LocalizedStrings.getLanguage()
        return moment.locale()
    },
};

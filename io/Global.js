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
    //app_url_pre: 'share://nzmessengers.co.nz/info/',
    http_url_pre: 'http://shareplus.co.nf/url.php?key=',
    //http_url_pre: 'http://nzmessengers.co.nz/share/url.php?key=',
    IP2LOC_HOST: 'http://freegeoip.net/json',
    
    mainlogin: '',
    login_names:{},
    logins: {},
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
    getLoginStr(){
        //alert(JSON.stringify(this.logins))
        let arrKey = Object.keys(this.logins)
        let str = ''
        arrKey.map((k)=>{
            str += ','+k+':'+this.logins[k]+':'+this.userObjects[k].name
            //console.log('Global.getLoginStr()'+k+':'+this.logins[k]+':'+JSON.stringify(this.userObjects[k]))
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
    getMainLogin(){
        //fb > wx > gg > wb
        //{fb:email,wx:email,gg:email,wb:email}
        if(Object.keys(this.logins).length===0){
            return '';
        }else{
            if(this.logins.fb)  return 'fb:'+this.logins.fb
            if(this.logins.wx)  return 'wx:'+this.logins.wx
            if(this.logins.gg)  return 'gg:'+this.logins.gg
            if(this.logins.wb)  return 'wb:'+this.logins.wb
        }
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
    getMainLoginName(){
            if(this.logins.fb)  return this.user_fb.name
            if(this.logins.wx)  return this.user_wx.name
            if(this.logins.gg)  return this.user_gg.name
            if(this.logins.wb)  return this.user_wb.name
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
    getFeedApi(){
        if(this.logins.fb){
            return `https://graph.facebook.com/me/feed&access_token=${this.userObjects.fb.token}`
        }else if(this.logins.gg) return '';
        else if(this.logins.wb) return '';
    },
    //share://nzmessengers.co.nz/info/car:41.767338,123.422675:1469942725304
    getSnsUrl(key){
        //let first = 'intent://shareplus.co.nf/i/'+key
        //let second = '#Intent;scheme=share;package=com.share;S.browser_fallback_url='+this.http_url_pre+key+';end'
        return this.http_url_pre+encodeURIComponent(key)
        //return this.app_url_pre+key
    },
};

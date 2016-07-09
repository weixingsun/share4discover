import moment from 'moment';
import I18n from 'react-native-i18n';

I18n.fallbacks = true;
I18n.translations = {
  en: {
    hi: 'Hi',
    update: 'Update',
    about: 'About',
    settings: 'Settings',
    plugin: 'Plugin',
    login: 'Login',
    logout: 'Logout',
    ask_logout: 'Do you want to logout from ',
    gg: 'Google',
    fb: 'Facebook',
    wx: 'Weixin',
    wb: 'Weibo',
    ok: 'OK',
    cancel: 'Cancel',
  },
  zh_CN: {
    hi: '你好',
    update: '更新',
    about: '关于',
    settings: '设置',
    plugin: '插件',
    login: '登陆',
    logout: '退出',
    ask_logout: '确认退出',
    gg: '谷歌',
    fb: '脸书',
    wx: '微信',
    wb: '微博',
    ok: '确定',
    cancel: '取消',
  },
  fr: {
    hi: 'Bonjour',
    update: 'Update',
    about: 'About',
    settings: 'Settings',
    plugin: 'Plugin',
    login: 'Login',
    logout: 'Logout',
    ask_logout: 'Do you want to logout from ',
    gg: 'Google',
    fb: 'Facebook',
    wx: 'Weixin',
    wb: 'Weibo',
    ok: 'OK',
    cancel: 'Cancel',
  },
}
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
         require('moment/locale/en');
         break;
      default:
         //require('moment/locale/en');
  }
  require('moment/locale/zh-cn')
}
module.exports = {
    KEY: '',
    URL: '',
    COLOR: {
      ORANGE: '#C50',
      DARKBLUE: '#0F3274',
      LIGHTBLUE: '#6EA8DA',
      DARKGRAY: '#999',
    },
    TYPE_ICONS: {
      estate:'ion-ios-home',
      car:'ion-ios-car',
      book:'ion-ios-book',
      help:'ion-ios-help-buoy',
      tool:'ion-md-hammer',
      food:'ion-md-pizza',
      medkit:'ion-md-medkit'
    },
    SNS_ICONS:{
      fb:'fa-facebook-square',
      gg:'fa-google-plus-square',
      wx:'fa-weixin',
      wb:'fa-weibo',
      tel:'ion-ios-call-outline',
    },
    getMainLogin(logins){
        //fb > wx > gg > wb
        var arr = logins.split(',')
        if(arr.length===0){
            return '';
        //}else if(arr.length===1){
        //    return logins;
        }else{
            var fb = arr.filter((user)=>{
                return (user.substring(0,2)==='fb')
            })
            if(fb!=null) return fb;
            var wx = arr.filter((user)=>{
                return (user.substring(0,2)==='wx')
            })
            if(wx!=null) return wx;
            var gg = arr.filter((user)=>{
                return (user.substring(0,2)==='gg')
            })
            if(gg!=null) return gg;
            var wb = arr.filter((user)=>{
                return (user.substring(0,2)==='wb')
            })
            if(wb!=null) return wb;
        }
    },
    getKeyFromMsg(msg){
        return msg.type+':'+msg.lat+','+msg.lng+':'+msg.ctime
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

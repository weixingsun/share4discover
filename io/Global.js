var moment = require('moment');

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
    getDateTimeFormat(datetimeInt){
        let now = +new Date();   //date.getTimezoneOffset() / 60
	//let datetimeStr = new Date(datetimeInt).toISOString().replace(/T/, ' ').replace(/\..+/, '')
	let momentDate = moment(datetimeInt) //.format("YYYY-MM-DD hh:MM:ss");
	if(now-datetimeInt<86400000){        //1 day
            return momentDate.fromNow()
	}else{
	    return momentDate.format('YYYY-MM-DD')
	}
    },
};

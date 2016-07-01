module.exports = {
    CALL:'ion-ios-call-outline',
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
      taxi:'ion-md-car',
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
};

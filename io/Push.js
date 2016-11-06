import React, {Component} from 'react'
import {AppRegistry, DeviceEventEmitter, Navigator, StyleSheet, Text, View, Dimensions, Platform, } from 'react-native'
//import * as XG from 'react-native-tencent-xg';
import Remote from './PushBaiduRemote';
//import OneSignal from 'react-native-onesignal';
import BaiduPush from 'react-native-bdpush'
import querystring from 'query-string';
import Global from './Global'
const md5 = require('./md5');

module.exports = {
    events:[],
    uid:'',
    instance:null,
    getS1Id(){
        let self=this
        OneSignal.configure({
            onIdsAvailable: (device)=> {  //userId,pushToken
                self.uid=device.userId
            }
        });
    },
    login(){
        //if(id) XG.setCredential(id, key)
        //XG.setCredential(2100240971, 'A3TG58G18CAT')
        //XG.register('OpenShare');
    },
    logout(){
        //XG.unregister()
        //this.events.filter(h => !!h).forEach(holder => holder.remove());
    },
    init(){
        this.instance = new BaiduPush((evt)=> {
          if(typeof evt === 'object'){
            this.uid=evt.channel_id
            //alert('channel_id='+this.uid)
            //this.instance.setTag("tag1",(state)=>{
            //    alert(" tag设置:"+JSON.stringify(state));
            //});
            //this.postOne(this.uid,'title0','desc0',{a:1,b:2})
            //删除tag
            // this.bdpush.delTag("hello",(state)=>{
            //   if(state == 0){
            //     console.log("tag删除成功");
            //   }else{
            //     console.log("tag删除失败");
            //   }
            // });

            //停止推送
            // this.bdpush.unbindChannelWithCompleteHandler((state)=>{
            //     if(state == 0){
            //         console.log("停止推送成功");
            //     }else{
            //         console.log("停止推送失败");
            //     }
            // });

            //重新开启推送
            // this.bdpush.bindChannelWithCompleteHandler((state)=>{
            //   if(state == 0){
            //     console.log("重新开启推送成功");
            //   }else{
            //     console.log("重新开启推送失败");
            //   }
            // });
          }else{
            alert((typeof evt)+ JSON.stringify(evt));
          }
        });
    },
    permission(){
        XG.checkPermissions().then(permission => {
            alert('permission '+JSON.stringify(permission))
        })
    },
    fullEncodeURIComponent(str) {
      var rv = encodeURIComponent(str).replace(/[!'()*~]/g, function(c) {
        return '%' + c.charCodeAt(0).toString(16).toUpperCase();
      });
      return rv.replace(/\%20/g,'+');
    },
    //postOne(self.xguid,'hello','click to view more',{t:'r',i:'car_sell:lat,lng:ctime',f:Push.xguid,r:now})
    postOne(uid,title,data,kv){
        let method= 'POST' 
        let url  = "http://api.tuisong.baidu.com/rest/3.0/push/single_device";
        let apikey = Platform.OS==='ios'?Global.ios_ak:Global.and_ak
        let secret_key = Platform.OS==='ios'?Global.ios_sk:Global.and_sk
        let timestamp = Math.round(Date.now() / 1000);
        let channel_id = uid
        let msg_type = 1 //1:push, 0:msg
        let msg = {
            title: title,
            description: data,
            custom_content: kv,
        }
        let paramStr="",bodyStr="",param={apikey:apikey,timestamp:timestamp,channel_id:channel_id,msg_type:1,msg:msg}
        let keys = Object.keys(param).sort();
        keys.forEach(function (key) {
            let temp = ''
            if( typeof param[key] === 'object' ) temp = key + "=" + JSON.stringify(param[key]);
            else temp = key + "=" + param[key];
            paramStr+=temp
            bodyStr+=temp+'&'
        })
        //bodyStr = bodyStr.slice(0, bodyStr.length - 1);
        let rawkey = method + url + paramStr + secret_key
        let basekey = this.fullEncodeURIComponent( rawkey )
        let sign = md5(basekey)
        bodyStr+="sign="+sign
        fetch(
          url, {
            method: 'POST',
            headers: {
              "Content-type": "application/x-www-form-urlencoded;charset=utf-8",
              "User-Agent": 'BCCS_SDK/3.0 (Darwin; Darwin Kernel Version 14.0.0: Fri Sep 19 00:26:44 PDT 2014; root:xnu-2782.1.97~2/RELEASE_X86_64; x86_64) PHP/5.6.3 (Baidu Push Server SDK V3.0.0 and so on..) cli/Unknown ZEND/2.6.0',
            },
            body: bodyStr //querystring.stringify(param)
          }
        ).then(res => console.log('body='+bodyStr+'\n\nparamStr='+paramStr+'\n\nreturn: '+JSON.stringify(res.text())))
        //.catch(err => alert(JSON.stringify(err)))
    },
    //postAll('broadcast_title','broadcast_data')
    postAll(title,data){
        //OneSignal.postNotification(title, data, uid);
        Remote.broadcast(title, data);
    },
    //postTag({'listen:car_sell','listen:car_rent0'},'OR','tags_title','click to view more',{t:'r',i:'car_sell:lat,lng:ctime',f:Push.xguid,r:now})
    postTags(tags,op,title,data,kv){  //onesignal in server side
        //OneSignal.postNotification(title, data, tag);
        Remote.pushtags(tags,op,title,data,kv)
    },
    setTag(tag){
        XG.setTag(tag)
    },
    listTags(evt) {
        this.instance.listTags(evt);
    },
    delTag(tag){
        XG.delTag(tag)
    },
    delAllTags(){},
    getBadge(){
        XG.getApplicationIconBadgeNumber().then(badgeNum => {
            //alert(badgeNum)
        })
    },
}

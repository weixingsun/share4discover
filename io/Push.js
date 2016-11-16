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
    bd_header:{
        "Content-type": "application/x-www-form-urlencoded;charset=utf-8",
        "User-Agent": 'BCCS_SDK/3.0 (Darwin; Darwin Kernel Version 14.0.0: Fri Sep 19 00:26:44 PDT 2014; root:xnu-2782.1.97~2/RELEASE_X86_64; x86_64) PHP/5.6.3 (Baidu Push Server SDK V3.0.0 and so on..) cli/Unknown ZEND/2.6.0',
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
            //alert('init() channel_id='+evt.channel_id)
            //this.postOne(this.uid,'title0','desc0',{a:1,b:2})

            //this.instance.setTag("tag1",(state)=>{
            //    alert(" tag设置:"+JSON.stringify(state));
            //});
            //删除tag
            // this.bdpush.delTag("hello",(state)=>{
            //     console.log("tag删除成功"); //state==0
            // });

            //停止推送
            // this.bdpush.unbindChannelWithCompleteHandler((state)=>{
            //     console.log("停止推送成功"); //state==0
            // });

            //重新开启推送
            // this.bdpush.bindChannelWithCompleteHandler((state)=>{
            //     console.log("重新开启推送成功"); //state==0
            // });
          }else{
            alert('bdpush.init() evt='+ evt);
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
    merge_into(obj,obj_to_merge){
        for (var key in obj_to_merge) { obj[key] = obj_to_merge[key]; }
    },
    //postOne(self.uid,'hello','click to view more',{t:'r',i:'car_sell:lat,lng:ctime',f:Push.uid,r:now})
    postOne(uid,title,data,kv,os){
        let method= 'POST' 
        let url  = "http://api.tuisong.baidu.com/rest/3.0/push/single_device";
        let apikey     = (os==='ios'||os==='idev')?Global.ios_ak:Global.and_ak
        let secret_key = (os==='ios'||os==='idev')?Global.ios_sk:Global.and_sk
        let timestamp = Math.round(Date.now() / 1000);
        let channel_id = uid
        let msg_type = 1 //1:push, 0:msg
        //let deploy_status = (os==='idev')?1:2 //1:dev, 2:prod (target === ios)
        let msg = {
            title: title,
            description: data,
            custom_content: kv,
        }
        let paramStr="",bodyStr="",param={apikey:apikey,timestamp:timestamp,channel_id:channel_id,msg_type:1,msg:msg}
        if(os==='ios'||os==='idev'){
          msg = {
            aps:{
              alert:title,
              sound:'default',
            }
          }
          for (var key in kv) { msg[key] = kv[key] }
          let deploy_status=(os==='idev')?1:2
          param={apikey:apikey,timestamp:timestamp,channel_id:channel_id,msg_type:1,msg:msg,deploy_status:deploy_status}
        }
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
            headers: this.bd_header,
            body: bodyStr //querystring.stringify(param)
          }
        ).then(res => console.log('body='+bodyStr+'\n\nparamStr='+paramStr+'\n\nreturn: '+JSON.stringify(res.text())))
        //.catch(err => alert(JSON.stringify(err)))
    },
    postAll(title,data){
        //OneSignal.postNotification(title, data, uid);
        Remote.broadcast(title, data);
    },
    //postTag({'listen_cn_beijing_car_sell'},'tags_title','click to view more',{t:'tag',i:'car_sell:lat,lng:ctime',f:Push.xguid,r:now})
    postTags(tag,title,data,kv,os){
        //OneSignal.postNotification(title, data, tag);
        let method= 'POST'
        let url  = "http://api.tuisong.baidu.com/rest/3.0/push/tags";
        let apikey     = (os==='ios'||os==='idev')?Global.ios_ak:Global.and_ak
        let secret_key = (os==='ios'||os==='idev')?Global.ios_sk:Global.and_sk
        let timestamp = Math.round(Date.now() / 1000);
        let msg_type = 1 //1:push, 0:msg
        //let deploy_status = (os==='idev')?1:2 //1:dev, 2:prod (target === ios)
        let msg = {
            title: title,
            description: data,
            custom_content: kv,
        }
        let paramStr="",bodyStr="",param={apikey:apikey,timestamp:timestamp,tag:tag,type:1,msg_type:1,msg:msg}
        if(os==='ios'||os==='idev'){
          msg = {
            aps:{
              alert:title,
              sound:'default',
            }
          }
          for (var key in kv) { msg[key] = kv[key] }
          let deploy_status=(os==='idev')?1:2
          param={apikey:apikey,timestamp:timestamp,tag:tag,type:1,msg_type:1,msg:msg,deploy_status:deploy_status}
        }
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
            headers: this.bd_header,
            body: bodyStr //querystring.stringify(param)
          }
        ).then(res => console.log('body='+bodyStr+'\n\nparamStr='+paramStr+'\n\nreturn: '+JSON.stringify(res.text())))
        //.catch(err => alert(JSON.stringify(err)))    
    },
    setTag(tag){
        this.instance.setTag(tag)
    },
    listTags(evt) {
        this.instance.listTags(evt);
    },
    delTag(tag){
        this.instance.delTag(tag)
    },
}

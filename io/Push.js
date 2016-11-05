import React, {Component} from 'react'
import {AppRegistry, DeviceEventEmitter, Navigator, StyleSheet, Text, View, Dimensions, Platform, } from 'react-native'
//import * as XG from 'react-native-tencent-xg';
//import Remote from './PushXGRemote';
//import OneSignal from 'react-native-onesignal';
import BaiduPush from 'react-native-bdpush'

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
    //postOne(self.xguid,'hello','click to view more',{t:'r',i:'car_sell:lat,lng:ctime',f:Push.xguid,r:now})
    postOne(uid,title,data,kv){
        //OneSignal.postNotification(title, data, uid);
        Remote.pushp2p(uid, title, data, kv);
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

import React, {Component} from 'react'
import {AppRegistry, DeviceEventEmitter, Navigator, StyleSheet, Text, View, Dimensions, Platform, } from 'react-native'
import * as XG from 'react-native-tencent-xg';
import Remote from './PushXGRemote';
import OneSignal from 'react-native-onesignal';
//export default class Push {
//vendor:'xg',1signal,baidu,
/*
xg_format:{
  alertBody: 'The content you sent',
  title: 'title on Android',
  badget: 5,
  userInfo: {
    customThing: 'something custom'
  },
  xgCustomKey: 'xgCustomValue',
  fireDate: set when you send local notification. Such as Date.now() + 5000
}
*/
module.exports = {
    events:[],
    vendor:'',
    xguid:'',
    s1uid:'',
    getS1Id(){
        let self=this
        OneSignal.configure({
            onIdsAvailable: (device)=> {  //userId,pushToken
                self.s1uid=device.userId
            }
        });
    },
    loginXG(){
        //if(id) XG.setCredential(id, key)
        XG.setCredential(2100240971, 'A3TG58G18CAT')
        XG.register('OpenShare');
    },
    logoutXG(){
        XG.unregister()
        this.events.filter(h => !!h).forEach(holder => holder.remove());
    },
    listenXG(onPush){
        let self=this
        //console.log(XG.allEvents());
        var errorHolder = XG.addEventListener('error', err => {
          alert('event listener error:'+JSON.stringify(err))
        });
        if (!errorHolder) throw new Error('Fail to register listener of error');
        if(__DEV__) XG.enableDebug(true);
        var registerHolder = XG.addEventListener('register', devToken => {
            self.xguid=devToken
            //let url = 'share://shareplus.co.nf/i/car_sell:-43.524177,172.584926:1477797667'
            //self.postTag({'listen:car_sell','listen:car_rent0'},'OR','tag_title','tag_data')
        });
        var remoteHolder = XG.addEventListener('notification', xgInstance => {
            //alert('notification '+ JSON.stringify(xgInstance))
            if(onPush) onPush(xgInstance)
        });
        if (!remoteHolder) throw new Error('Fail to add event to handle remote notification');
        var localHolder = XG.addEventListener('localNotification', xgInstance => {
            alert('localNotification '+ JSON.stringify(xgInstance))
        });
        //if (!localHolder) throw new Error('Fail to add event to local notification');
        this.events = [
          registerHolder,
          errorHolder,
          remoteHolder,
          localHolder
        ]
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
    getAllTags() {
        Remote.getalltags(this.xguid)
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

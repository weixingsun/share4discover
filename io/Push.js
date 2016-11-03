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
        var errorHolder = XG.addEventListener('error', err => {
          alert('error '+JSON.stringify(err))
        });
        if (!errorHolder) throw new Error('Fail to register listener of error');
        //errorHolder.remove();
        XG.enableDebug(true);
        //console.log(XG.allEvents());
        var registerHolder = XG.addEventListener('register', devToken => {
            self.xguid=devToken
            //self.postTag({'listen:car_sell','listen:car_rent0'},'OR','p2p_title','p2p_data')
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
    //self.postOne(self.xguid,'p2p_title','p2p_data')
    postOne(uid,title,data){
        //OneSignal.postNotification(title, data, uid);
        Remote.push(uid, title, data);
    },
    //self.postAll('broadcast_title','broadcast_data')
    postAll(title,data){
        //OneSignal.postNotification(title, data, uid);
        Remote.broadcast(title, data);
    },
    //self.postTag({'listen:car_sell','listen:car_rent0'},'OR','p2p_title','p2p_data')
    postTag(tag,op,title,data){  //onesignal in server side
        //OneSignal.postNotification(title, data, tag);
        Remote.tags(tags,op,title,data)
    },
    setTag(tag){
        XG.setTag(tag)
    },
    getTag(tag){
        //XG.getTag(tag)
    },
    getAllTags() {},
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

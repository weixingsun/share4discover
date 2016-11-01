import React,{AppRegistry} from 'react-native'
import OneSignal from 'react-native-onesignal';
import Nav from './Nav'
import Net from './io/Net'
import Note from './ui/Note'
import Detail from './ui/Detail'
function openShare(key){
    Net.getMsg(key).then((json)=> {
        if(json!=null){
            //alert(JSON.stringify(json))
            Nav.openPage(Detail,json)
        }else alert('The information does not exist.')
    });
}
OneSignal.enableInAppAlertNotification(true);
OneSignal.configure({
    //onIdsAvailable: function(device) {
        //let userid = 'UserId = '+ device.userId;
        //let token  = 'PushToken = '+ device.pushToken;
        //alert('onesignal.notification:\n'+userid+'\n'+token)
    //},
    onNotificationOpened: function(message, data, isActive) {
        //alert('onesignal:'+JSON.stringify(data))
        if(data.custom){
            Nav.openPage(Note,data)
            //self.sendCustomNoteURL(data)
        }else if (data.tag_notification){
            let key = data.tag_notification
            openShare(key)
        }else if (data.p2p_notification && data.p2p_notification.key) {
            let key = data.p2p_notification.key.split('#')[0]
            openShare(key)
        }
    }
});
AppRegistry.registerComponent('SharePlus', () => Nav);

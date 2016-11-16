import { 
  AsyncStorage,
  Platform,
} from 'react-native';
import SharedPreferences from 'react-native-shared-preferences'
//import UserDefaults from 'react-native-user-defaults'

var deviceStorage = {
        API_LIST:  "api_list",
        FEED_LIST: "feed_list",
        PUSH_CLICKED: "push_clicked",
        //PUSH_RECEIVED: "pushes_received",
        LOCAL_PUSH_LIST: "push_list:local",
        P2P_PUSH_LIST: "push_list:p2p",
        TAG_PUSH_LIST: "push_list:tag",
        MAP_LIST:  "map_list",
        PLACE_LIST:"place_list",
        SETTINGS:  "settings",
        GPS_POS:   "gps:position",
        SETTINGS_MAP:        "settings_map",
        SETTINGS_MAP_TYPE:   "settings_map_type",
        SETTINGS_MAP_TRAFFIC:"settings_map_traffic",
        SETTINGS_LOGINS:     "settings_login",
        
        msgTab:  'ion-md-chatboxes',
        userTab: 'ion-ios-person',
        emailTab:'ion-ios-mail',
        mapTab:  'ion-ios-globe',
        confTab: 'ion-md-settings',

        getShared(key,cbk){
          if(Platform.OS==='android') SharedPreferences.getItem(key, (value)=>cbk(value))
          else if(Platform.OS==='ios') this.get(key).then((value=>cbk(value)))
          //else if(Platform.OS==='ios') UserDefaults.get(key).then(value=>cbk(value))
        },
        setShared(key,value){
          if(Platform.OS==='android') SharedPreferences.setItem(key, value)
          //else if(Platform.OS==='ios') UserDefaults.set(key, value)
        },
        deleteShared(key){
          if(Platform.OS==='android') SharedPreferences.deleteItem(key)
          //else if(Platform.OS==='ios') UserDefaults.remove(key)
        },
        clearShared(){
          if(Platform.OS==='android') SharedPreferences.clear()
          //else if(Platform.OS==='ios') UserDefaults.empty()
        },
        readPushShared(type,kv) {
            let self = this
            let fskey = type==='p2p'?this.P2P_PUSH_LIST:this.TAG_PUSH_LIST
            this.getShared(fskey,function(str){
                let array = JSON.parse(str)
                self.addArrayElementShared(array,kv,{read:1})
                self.setShared(fskey,JSON.stringify(array));
                //alert('rm:'+id+'\nlist='+JSON.stringify(array))
            })
        },
        addArrayElementShared(arr, kv, obj) {
            if(Platform.OS==='android'){
                let k=Object.keys(kv)[0]
                for(var i = arr.length; i--;) {
                    if(arr[i].custom[k] === kv[k]) {
                        //alert('key='+k+'\nvalue='+kv[k]+'\n in custom:'+JSON.stringify(arr[i].custom[k]))
                        let k1=Object.keys(obj)[0]
                        arr[i].custom[k1]=obj[k1]
                    }
                }
                //alert('arr='+JSON.stringify(arr))
            }else{}
        },
        deletePushShared(type,kv) {
            let self = this
            let fskey = type==='p2p'?this.P2P_PUSH_LIST:this.TAG_PUSH_LIST
            this.getShared(fskey,function(str){
                let array = JSON.parse(str)
                self.deleteArrayElementShared(array,kv)
                self.setShared(fskey,JSON.stringify(array));
                //alert('rm:'+id+'\nlist='+JSON.stringify(array))
            })
        },
        deleteArrayElementShared(arr,kv){
            let k=Object.keys(kv)[0]
            for(var i = arr.length; i--;) {
                //alert('key='+k+'\nvalue='+kv[k]+'\n in array:'+(typeof arr[i])+' '+JSON.stringify(arr[i][k]))
                if(arr[i][k] === kv[k] || arr[i].custom[k] === kv[k]) {
                    //alert('removing item:'+JSON.stringify(kv))
                    arr.splice(i, 1);
                }
            }
        },
	get: function(key) {
		return AsyncStorage.getItem(key).then(function(value) {
			return JSON.parse(value);
		});
	},
	save: function(key, value) {
		AsyncStorage.setItem(key, JSON.stringify(value));
	},

	update: function(key, value) {
		AsyncStorage.removeItem(key);
		AsyncStorage.setItem(key, JSON.stringify(value));
	},

	delete: function(key) {
		return AsyncStorage.removeItem(key);
	},
	save_string: function(key, value) {
		AsyncStorage.setItem(key, value);
	},
	get_string: function(key) {
		return AsyncStorage.getItem(key).then(function(value) {
			return value;
		});
	},
        append:function(key,value){
                let self=this
                //AsyncStorage.removeItem(key)
                AsyncStorage.getItem(key).then(function(old_value) {
                    let array=[]
                    if(old_value!=null) array = JSON.parse(old_value)
                    array.push(value)
                    AsyncStorage.setItem(key, JSON.stringify(array));
                })
        },
        deleteAllPush: function(){
                this.delete(this.P2P_PUSH_LIST)
        },
        insertPush: function(obj){
                let strObj = JSON.stringify(obj)
                let self = this
                this.get(this.P2P_PUSH_LIST).then(function(json){
                    let list = []
                    if(json) list = json
                    self.removeArrayElement(list,strObj)
                    list.push(strObj)
                    self.save(self.P2P_PUSH_LIST,list);
                })
        },
        deletePush: function(kv){  //push reply
                let self = this
                this.get(this.P2P_PUSH_LIST).then(function(array){
                    if(array){
                        self.removeArrayElement(array,kv)
                        self.save(self.P2P_PUSH_LIST,array);
                        //alert('rm:'+id+'\nlist='+JSON.stringify(array))
                    }
                })
        },
        removeArrayElement: function(arr, kv) {
                let k=Object.keys(kv)[0]
                for(var i = arr.length; i--;) {
                    //alert('key='+k+'\nvalue='+kv[k]+'\n in array:'+(typeof arr[i])+' '+JSON.stringify(arr[i][k]))
                    if(arr[i][k] === kv[k]) {
                        //alert('removing item:'+JSON.stringify(kv))
                        arr.splice(i, 1);
                    }
                }
        },
        addArrayElement: function(arr, kv, obj) {
                let k=Object.keys(kv)[0]
                for(var i = arr.length; i--;) {
                    //alert('key='+k+'\nvalue='+kv[k]+'\n in array:'+(typeof arr[i])+' '+JSON.stringify(arr[i][k]))
                    if(arr[i][k] === kv[k]) {
                        let k1=Object.keys(obj)[0]
                        arr[i][k1]=obj[k1]
                    }
                }
        },
        readPush: function(kv) {
                let self = this
                this.get(this.P2P_PUSH_LIST).then(function(array){
                    self.addArrayElement(array,kv,{read:1})
                    self.save(self.P2P_PUSH_LIST,array);
                    //alert('rm:'+id+'\nlist='+JSON.stringify(array))
                })
        },
        emptyFeedList: function(){
                this.delete(this.FEED_LIST)
        },
        deleteFeed: function(data){
                let self = this
                this.get(this.FEED_LIST).then(function(array){
                    if(array){
                        self.removeArrayElement(array,data)
                        self.save(self.FEED_LIST,array);
                    }
                })
        },
        insertFeed: function(obj){
                let strObj = JSON.stringify(obj)
                let self = this
                this.get(this.FEED_LIST).then(function(json){
                    let list = []
                    if(json) list = json
                    self.removeArrayElement(list,strObj)
                    list.push(strObj)
                    self.save(self.FEED_LIST,list);
                })
        },
};

module.exports = deviceStorage;

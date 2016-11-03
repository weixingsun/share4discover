import { AsyncStorage } from 'react-native';

var deviceStorage = {
        API_LIST:  "api_list",
        FEED_LIST: "feed_list",
        PUSH_LIST: "push_list",
        P2P_PUSH_LIST: "push_list:r",
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

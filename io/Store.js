import { AsyncStorage } from 'react-native';

var deviceStorage = {
        API_LIST:  "api_list",
        FEED_LIST: "feed_list",
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
        insertFeedData: function() {
                //this.insertFeed('rss|http://rss.sina.com.cn/news/china/focus15.xml');
                //this.insertFeed('rss|http://rss.cnn.com/rss/edition.rss');
                //this.insertFeed('rss|http://feeds.bbci.co.uk/news/rss.xml');
                let array = ['rss|http://rss.cnn.com/rss/edition.rss','rss|http://feeds.bbci.co.uk/news/rss.xml','rss|http://rss.sina.com.cn/news/china/focus15.xml']
                this.save(this.FEED_LIST,array)
        },
        removeArrayElement: function(arr, item) {
                for(var i = arr.length; i--;) {
                    if(arr[i] === item) {
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

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
        deleteFeed: function(data){
                let self = this
                this.get(this.FEED_LIST).then(function(array){
                    if(array){
                        self.removeArrayElement(array,data)
                        self.save(self.FEED_LIST,array);
                    }
                })
        },
        insertFeed: function(data){
                let self = this
                this.get(this.FEED_LIST).then(function(json){
                    let list = []
                    if(json) list = json
                    //self.deleteFeed(data)
                    list.push(data) // type|url|name
                    self.save(self.FEED_LIST,list);
                })
        },
	insertExampleData: function() {
                var api_json_yql_exchange = 'api:json:yql:exchange';
                var api_json_url_exchange = 'api:json:url:exchange';
                var api_json_yql_stock    = 'api:json:yql:stock';
		
		AsyncStorage.setItem(api_json_yql_exchange, JSON.stringify({
			name:api_json_yql_exchange, 
			filter:"USDCNY,USDNZD", 
			yql:'select * from yahoo.finance.xchange where pair in ("USDCNY","USDNZD")', 
			path:"$.query.results.rate", 
			title:"Exchange Rates YQL API"
		}));
		AsyncStorage.setItem(api_json_url_exchange, JSON.stringify({
			name:api_json_url_exchange, 
			filter:'USD/CNY,USD/NZD',
			url:'http://finance.yahoo.com/webservice/v1/symbols/allcurrencies/quote?format=json&view=basic',
			path:"$.list.resources", 
			subpath:"$.resource.fields",
			title:"Exchange Rates URL API"
		}));
		AsyncStorage.setItem('api_list', JSON.stringify( [api_json_yql_exchange, api_json_url_exchange] ));

		AsyncStorage.setItem("place_list", JSON.stringify(["Home:0,0","Work:0,0"]) );
		AsyncStorage.setItem("settings:map","GoogleMap")
	},
	//name: 'api:url:exchange' 'api:yql:exchange'
	//json: {title: filter: url: yql: path: subpath}
	insertApi: function(name,json){
		AsyncStorage.setItem(name, JSON.stringify(json));
		AsyncStorage.getItem('api_list').then(function(list) {
			var names = [name];
			if(list!==null && list.indexOf(name)<0){
				names = JSON.parse(list)
				names.push(name);
			}else if(list!==null && list.indexOf(name)>-1){
				names = JSON.parse(list)
			}
			AsyncStorage.setItem('api_list', JSON.stringify( names ));
		});
	},
        copyApi: function(name){
		var new_name = '';
		var num = 0;
		AsyncStorage.getItem('api_list').then(function(list) {
			var names = JSON.parse(list)
			num = names.length;
			new_name = name+'-'+num;
			names.push(new_name);
			AsyncStorage.setItem('api_list', JSON.stringify( names ));
			//console.log('new api_list:'+JSON.stringify( names ))
		});
		AsyncStorage.getItem(name).then(function(value) {
			var new_value = JSON.parse(value)
			new_value['name']=new_name;
			AsyncStorage.setItem(new_name,JSON.stringify(new_value));
			//console.log('new name:'+new_name+'  value:'+JSON.stringify(new_value))
		});
	},
	deleteApi: function(api_name){
		AsyncStorage.removeItem(api_name);
		AsyncStorage.getItem('api_list').then(function(list) {
			var old_names = JSON.parse(list);
			var new_names = [];
			old_names.map((name)=>{
				if(name !== api_name){
					new_names.push(name)
				}
			})
			AsyncStorage.setItem('api_list', JSON.stringify( new_names ));
		});
	},
};

module.exports = deviceStorage;

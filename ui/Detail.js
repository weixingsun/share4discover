//'use strict'; //ERROR: Attempted to assign to readonly property
import React, { Component } from 'react';
import {Alert, Dimensions, Picker, StyleSheet,View, ScrollView,Text,TouchableOpacity,TouchableHighlight } from 'react-native';
import {Icon} from './Icon'
import t from 'tcomb-form-native'
var Form = t.form.Form;
import NavigationBar from 'react-native-navbar';
import Style from './Style';
import Store from '../io/Store';
import Global from '../io/Global';
import Net from '../io/Net'
import DetailImg from './DetailImg';
var {height, width} = Dimensions.get('window');
Date.prototype.yyyymmddhhmmss = function() {
   var yyyy = this.getFullYear();
   var mm = this.getMonth() < 9 ? "0" + (this.getMonth() + 1) : (this.getMonth() + 1); // getMonth() is zero-based
   var dd  = this.getDate() < 10 ? "0" + this.getDate() : this.getDate();
   var hh = this.getHours() < 10 ? "0" + this.getHours() : this.getHours();
   var min = this.getMinutes() < 10 ? "0" + this.getMinutes() : this.getMinutes();
   var ss = this.getSeconds() < 10 ? "0" + this.getSeconds() : this.getSeconds();
   return "".concat(yyyy).concat(mm).concat(dd).concat(hh).concat(min).concat(ss);
};

export default class Detail extends Component {
    constructor(props) {
        super(props);
        this.old_value = {};
        this.state={ 
            content_height: 40,
        }
        this.type= {
            title: t.String,
            address: t.String,
            type: t.String,
            owner: t.String,
            ask: t.String,
            lat: t.Number,
            lng: t.Number,
            ctime: t.Number,
            content: t.String,
            reply: t.String,
        }
        //this.onChangeNative=this.onChangeNative.bind(this)
    }
    onReply () {
        //var value = this.refs.form.getValue();
        //value['pics']=[]                             ////////ctime undefined
	var key = this.props.msg.type+':'+this.props.msg.lat+','+this.props.msg.lng
	var value={key:key, field:'reply', value:'reply in app'}
        var _this = this;
        Alert.alert(
            "Reply",
            "Do you want to reply this information ? ",
            [
                {text:"Cancel", },
                {text:"OK", onPress:()=>{
                    Net.putMsg(value)
                    _this.props.navigator.pop();
                }},
            ]
        );
    }
    componentWillMount(){
        //alert(Date.now())
        //alert(JSON.stringify(this.props.msg))
        //this.checkLoginUser();
    }
    checkLoginUser(){
        var self = this
        Store.get('user_fb').then(function(fb){
            if(fb == null){
                Store.get('user_gg').then(function(gg){
                    if(gg == null) {
                        alert('Please login to publish information.')
                    }else{
                        var name = gg.type+':'+gg.email
                        self.setState({
                            value: {owner:name,address:'',latlng:''},
                        });
                    }
                });
            }else{
                var name = fb.type+':'+fb.email
                self.setState({
                    value: {owner:name,address:'',latlng:''},
                });
            }
        });
    }
    render(){
        var _ctime = new Date(parseInt(this.props.msg.ctime));
        return (
            <View style={{flex:1}}>
                <NavigationBar style={Style.navbar} title={{title: '',}}
                   leftButton={
                     <View style={{flexDirection:'row',}}>
                       <Icon name={"ion-ios-arrow-back"} color={'#333333'} size={30} onPress={() => this.props.navigator.pop() } />
                     </View>
                   }
                   rightButton={
                     <View style={{flexDirection:'row',}}>
                        <Icon 
			    name={'ion-ios-mail-outline'} //ion-ios-checkmark-circle green
			    color={'red'} 
			    size={40} 
			    onPress={this.onReply.bind(this) } />
                     </View>
                   }
                />
                <View style={{flex:8,backgroundColor: 'gray',}}>
                  <ScrollView
                    automaticallyAdjustContentInsets={false}
                    scrollEventThrottle={200}
                    style={{flex:8}}
		  >
                    <View style={{height:height/3}} onPress={()=>alert('open')}>
		        <DetailImg />
		    </View>
                    <View style={Style.title_card} >
                        <Icon 
			    style={{marginLeft:20,marginRight:1}} 
			    size={44} 
			    color={this.props.msg.ask=='false'?'blue':'gray'} 
			    name={Global.TYPE_ICONS[this.props.msg.type]} 
			/>
			<View style={{flex:1,marginLeft:30}}>
                            <Text style={{fontWeight:'bold', fontSize:20,}}>{this.props.msg.title}</Text>
                            <Text>Publish Time: {_ctime.toLocaleString()}</Text>
                            <Text>Address     : {this.props.msg.address}</Text>
			</View>
                    </View>
                    <TouchableOpacity style={Style.contact_card} >
                      <View style={{width:Style.DEVICE_WIDTH/3}} />
                      <View style={{width:Style.DEVICE_WIDTH/8,alignItems:'center',}}>
                          <Icon name={'ion-ios-arrow-up'} size={35}/>
                      </View>
                      <Text>Contact</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={Style.detail_card} >
                      <View style={{width:Style.DEVICE_WIDTH/3}} />
                      <View style={{width:Style.DEVICE_WIDTH/8,alignItems:'center',}}>
                          <Icon name={'ion-ios-arrow-up'} size={35}/>
                      </View>
                      <Text>Details</Text>
                    </TouchableOpacity>
                  </ScrollView>
		</View>
            </View>
        );
    }
}

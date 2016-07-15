//'use strict'; //ERROR: Attempted to assign to readonly property
import React, { Component } from 'react';
import {Alert, Dimensions,NativeModules,Picker,StyleSheet,View,ScrollView,Text,TextInput,TouchableOpacity,TouchableHighlight } from 'react-native';
import {Icon} from './Icon'
import NavigationBar from 'react-native-navbar';
import Style from './Style';
import Store from '../io/Store';
import Global from '../io/Global';
import Net from '../io/Net'
import DetailImg from './DetailImg';
import FormInfo from "./FormInfo"
var {height, width} = Dimensions.get('window');

export default class Detail extends Component {
    constructor(props) {
        super(props);
        this.lang = NativeModules.RNI18n.locale.replace('_', '-').toLowerCase()
        this.state={ 
            reply: '',
            reply_height: 35,
            isMyMsg:false,
        }
    }
    //key='car:lat,lng:ctime#time'  value='r1|fb:email|content'
    onReply() {
        if(this.state.reply.length<5) {
            alert('Please reply with more characters.')
            return;
        }
        var key = Global.getKeyFromMsg(this.props.msg)
	var time = +new Date();
        var value={key:key, field:'#'+time, value:this.props.mainlogin+'|'+this.state.reply}
        let loginsObj = Global.getLogins(this.props.msg.owner)
        var notify_value={key:'#'+Global.getMainLogin(loginsObj), field:key+'#'+time, value:'r1|'+this.props.mainlogin+'|'+this.state.reply}
        var _this = this;
        Alert.alert(
            "Reply",
            "Do you want to reply this information ? ",
            //"Do you want to reply this information ? \nnotify_value="+JSON.stringify(notify_value),
            [
                {text:"Cancel", },
                {text:"OK", onPress:()=>{
                    Net.putMsg(value)
                    Net.putMsg(notify_value)
                    _this.props.navigator.pop();
                }},
            ]
        );
    }
    onClose() {
        var key = Global.getKeyFromMsg(this.props.msg)
	var time = +new Date();
        var value={key:key, field:'close', value:this.props.mainlogin+'|'+time}
        let loginsObj = Global.getLogins(this.props.msg.owner)
	var notify_value={key:'#'+Global.getMainLogin(loginsObj), field:key+'#'+time, value:'c1|'+this.props.mainlogin+'|'}
        var _this = this;
        Alert.alert(
            "Complete",
            "Do you want to complete this request ? ",
            [
                {text:"Cancel", },
                {text:"OK", onPress:()=>{
                    Net.putMsg(value)
                    //Net.putMsg(notify_value)
                    _this.props.navigator.pop();
                }},
            ]
        );
    }
    onDelete() {
	var _this = this;
        var key = Global.getKeyFromMsg(this.props.msg)
        Alert.alert(
            "Delete",
            "Do you want to delete this information ? ",
            [
                {text:"Cancel", },
                {text:"OK", onPress:()=>{
                    Net.delMsg(key)
                    _this.props.navigator.pop();
                }},
            ]
        );
    }
    onEdit(){
        this.props.navigator.push({component: FormInfo, passProps: { msg:this.props.msg, navigator:this.props.navigator } })
    }
    onZoomPics(msg){
        this.props.navigator.push({component: DetailImg, passProps: { msg:this.props.msg, navigator:this.props.navigator } })
    }
    componentWillMount(){
        //alert(JSON.stringify(this.props.msg))
	this.checkMyMsg(this.props.msg)
    }
    checkMyMsg(msg){
        this.checkSns(this.props.mainlogin, msg.owner)
    }
    checkSns(mainlogin,owner){
        var self = this
        if(owner.indexOf(mainlogin) > -1)
            self.setState({isMyMsg:true})
    }
    getSNSIcon(type){
        return Global.SNS_ICONS[type]  //this.props.msg.owner.split(':')[0]
    }
    showActionIcons(){
        if(!this.state.isMyMsg){
	  return (
            <View style={{flexDirection:'row',}}>
              <Icon
                name={'ion-ios-expand'}
                color={'aqua'}
                size={40}
                onPress={this.onZoomPics.bind(this) } />
              <View style={{width:50}} />
              <Icon
                name={'ion-ios-mail-outline'}
                color={'orange'}
                size={40}
                onPress={this.onReply.bind(this) } />
            </View>
          )
        }else{
          return (
            <View style={{flexDirection:'row',}}>
              <Icon
                name={'ion-ios-expand'}
                color={'aqua'}
                size={40}
                onPress={this.onZoomPics.bind(this) } />
              <View style={{width:50}} />
              <Icon
                name={'ion-ios-mail-outline'}
                color={'orange'}
                size={40}
                onPress={this.onReply.bind(this) } />
              <View style={{width:50}} />
              <Icon
                name={'ion-ios-create-outline'}
                color={'blue'}
                size={40}
                onPress={this.onEdit.bind(this) } />
	      <View style={{width:50}} />
              <Icon
                name={'ion-ios-trash-outline'}
                color={'red'}
                size={40}
                onPress={this.onDelete.bind(this) } />
              <View style={{width:50}} />
              <Icon
                name={'ion-ios-checkmark-circle-outline'}
                color={'green'}
                size={40}
                onPress={this.onClose.bind(this) } />
            </View>
          )
        }
    }
    showSlides(){
        if(this.props.msg.pics != null) {
            return (
              <View style={{height:height/2}} >
                <DetailImg msg={this.props.msg} />
              </View>
            )
        }
    }
    showOwners(){
	var owners = this.props.msg.owner.split(',')
        owners.push('tel:'+this.props.msg.phone)
        return (
            owners.map( (owner) => {
		var sns_type = owner.split(':')[0]
		var sns_user = owner.split(':')[1]
	        //console.log('----------showOwners():type:'+sns_type+', user:'+sns_user)
                return (
                    <View style={{flexDirection:'row',marginLeft:20}} key={owner} >
                        <Icon
                            style={{marginLeft:23,marginRight:6}}
                            size={24}
                            color={'blue'}
                            name={Global.SNS_ICONS[sns_type]}
                        />
                        <Text style={{marginLeft:20}}>{sns_user}</Text>
                    </View>
                )
            })
        );
    }
    showReplys(){
        //id:#rtime  key='car:lat,lng:ctime#time'  value='r1|fb:email|content'
        var keys = Object.keys(this.props.msg)
	var replys = keys.filter((key) => {
	    return (key.substring(0,1)==='#')
	}).sort()
	return (
	  replys.map((key)=>{
              var str = this.props.msg[key];
              let owner = str.split('|')[0]
              let reply = str.split('|')[1]
              let time  = parseInt(key.substring(1))    //Global.getDateTimeFormat(Int)
              let sns_type = owner.split(':')[0]
	      let sns_user = owner.split(':')[1]
	      if(sns_type==null || sns_type==''){
                return (
                    <Text key={key} style={{flex:1,marginLeft:30}}>{ 'Invalid Characters' }</Text>
                )
	      }else{
	        return (
	          <View style={{flexDirection:'row'}} key={key} >
                    <Icon
                        style={{marginLeft:30,marginRight:6}}
                        size={24}
                        color={'blue'}
                        name={Global.SNS_ICONS[sns_type]}
                    />
                    <Text style={{flex:1,marginLeft:1}}>  { sns_user + ':  '+ reply } </Text>
                    <Text style={{marginRight:5,color:'gray'}}>{ Global.getDateTimeFormat(time,this.lang)}</Text>
                  </View>
	        )
              }
          })
	)
    }
    render(){
	var _ctime = Global.getDateTimeFormat(parseInt(this.props.msg.ctime),this.lang)
        //((TelephonyManager) getSystemService(TELEPHONY_SERVICE)).getLine1Number();

        return (
            <View style={{flex:1}}>
                <NavigationBar style={Style.navbar} title={{title: '',}}
                   leftButton={
                     <View style={{flexDirection:'row',}}>
                       <Icon name={"ion-ios-arrow-round-back"} color={'#333333'} size={40} onPress={() => this.props.navigator.pop() } />
                     </View>
                   }
                   rightButton={ this.showActionIcons() }
                />
                <View style={{flex:8,backgroundColor: '#DDDDDD',}}>
                    <ScrollView
                      automaticallyAdjustContentInsets={false}
                      scrollEventThrottle={200}
                      style={{flex:8}}
                    >
                      {this.showSlides()}
                      <View style={Style.detail_card} >
                        <View style={{flexDirection:'row',marginLeft:20}} >
                          <Icon
                            style={{marginLeft:15,marginRight:15}}
                            size={44}
                            color={this.props.msg.ask=='false'?'blue':'gray'}
                            name={Global.TYPE_ICONS[this.props.msg.type]}
                          />
                          <View style={{flex:1,marginLeft:20}}>
                            <Text style={{fontWeight:'bold', fontSize:20,}}>{this.props.msg.title}</Text>
                            <Text>Time   : {_ctime}</Text>
                            <Text>Address: {this.props.msg.address}</Text>
                          </View>
                        </View>
                      </View>
                      <View style={Style.detail_card} >
			{ this.showOwners() }
                      </View>
                      <View style={Style.detail_card} >
                        <Text style={{marginLeft:21}}><Text style={{fontWeight:'bold'}}>Publish Time:  </Text> {_ctime} </Text>
			<Text style={{marginLeft:21}}><Text style={{fontWeight:'bold'}}>Asking :  </Text>  {this.props.msg.ask}</Text>
			<Text style={{marginLeft:21}}><Text style={{fontWeight:'bold'}}>Price :  </Text>  {this.props.msg.price}</Text>
                        <Text style={{marginLeft:21}}><Text style={{fontWeight:'bold'}}>Details:</Text></Text>
			<Text style={{marginLeft:21}}>{this.props.msg.content}</Text>
                      </View>
                      <View style={Style.detail_card} >
                        <Text style={{marginLeft:21,fontWeight:'bold'}}>Replys :  </Text>
			{this.showReplys()}
                      </View>
                      <View style={Style.detail_card} >
		        <Text style={{marginLeft:21,fontWeight:'bold'}}>Your Reply:  </Text>
			<TextInput 
			    style={{marginLeft:20,height:this.state.reply_height}} 
			    multiline={true} 
			    value={this.state.reply}
		            onChange={(event) => {
		                this.setState({
		                    reply: event.nativeEvent.text,
                                    reply_height: event.nativeEvent.contentSize.height,
	                        });
                            }}
		        />
                      </View>
                    </ScrollView>
		</View>
            </View>
        );
    }
}

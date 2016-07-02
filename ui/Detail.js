//'use strict'; //ERROR: Attempted to assign to readonly property
import React, { Component } from 'react';
import {Alert, Dimensions, Picker, StyleSheet,View, ScrollView,Text,TextInput,TouchableOpacity,TouchableHighlight } from 'react-native';
import {Icon} from './Icon'
import t from 'tcomb-form-native'
var Form = t.form.Form;
import NavigationBar from 'react-native-navbar';
import Style from './Style';
import Store from '../io/Store';
import Global from '../io/Global';
import Net from '../io/Net'
import DetailImg from './DetailImg';
import FormEditMsg from "./FormEditMsg"
var {height, width} = Dimensions.get('window');

export default class Detail extends Component {
    constructor(props) {
        super(props);
        this.state={ 
            reply: '',
            reply_height: 35,
            isMyMsg:false,
        }
    }
    onReply() {
        var key = Global.getKeyFromMsg(this.props.msg)
	var time = +new Date();
        var value={key:key, field:'#'+time, value:this.props.mainlogin+'|'+this.state.reply}
        var notify_value={key:'#'+Global.getMainLogin(this.props.msg.owner), field:key+':'+time, value:'1|'+this.props.mainlogin+'|'+this.state.reply}
        var _this = this;
        Alert.alert(
            "Reply",
            "Do you want to reply this information ? ",
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
        var value={key:key, field:'close', value:this.props.mainlogin}
        var _this = this;
        Alert.alert(
            "Complete",
            "Do you want to complete this request ? ",
            [
                {text:"Cancel", },
                {text:"OK", onPress:()=>{
                    Net.putMsg(value)
                    //Net.emailOwner(value)
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
        this.props.navigator.push({component: FormEditMsg, passProps: { msg:this.props.msg } })
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
              <View style={{height:height/3}} >
                <DetailImg />
              </View>
            )
        }
    }
    showOwners(){
	var owners = this.props.msg.owner.split(',')
        return (
            owners.map( (owner) => {
		var sns_type = owner.split(':')[0]
		var sns_user = owner.split(':')[1]
	        //console.log('----------showOwners():type:'+sns_type+', user:'+sns_user)
                return (
                    <View style={{flexDirection:'row'}} key={owner} >
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
        var keys = Object.keys(this.props.msg)
	var replys = keys.filter((key) => {
	    return (key.substring(0,1)==='#')
	})
	//fb:email|reply
	return (
	  replys.map((key)=>{
              var str = this.props.msg[key];
              let owner = str.split('|')[0]
              let reply = str.split('|')[1]
              let time  = new Date(parseInt(key.substring(1)))    //toLocaleString()
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
                    <Text style={{marginRight:5,color:'gray'}}>{time.toLocaleString()}</Text>
                  </View>
	        )
              }
          })
	)
    }
    render(){
        var _ctime = new Date(parseInt(this.props.msg.ctime));
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
                      <View style={Style.title_card} >
                        <Icon
                            style={{marginLeft:15,marginRight:6}}
                            size={44}
                            color={this.props.msg.ask=='false'?'blue':'gray'}
                            name={Global.TYPE_ICONS[this.props.msg.type]}
                        />
                        <View style={{flex:1,marginLeft:10}}>
                            <Text style={{fontWeight:'bold', fontSize:20,}}>{this.props.msg.title}</Text>
                            <Text>Time   : {_ctime.toLocaleString()}</Text>
                            <Text>Address: {this.props.msg.address}</Text>
                        </View>
                      </View>
                      <View style={Style.detail_card} >
			{ this.showOwners() }
                        <View style={{flexDirection:'row'}}>
                          <Icon
                            style={{marginLeft:23,marginRight:6}}
                            size={24}
                            color={'green'}
                            name={Global.CALL}
                          />
                          <Text style={{marginLeft:21}}>{this.props.msg.phone}</Text>
                        </View>
                      </View>
                      <View style={Style.detail_card} >
                        <Text style={{marginLeft:21}}><Text style={{fontWeight:'bold'}}>Publish Time:  </Text>  {_ctime.toLocaleString()}</Text>
			<Text style={{marginLeft:21}}><Text style={{fontWeight:'bold'}}>Asking :  </Text>  {this.props.msg.ask}</Text>
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

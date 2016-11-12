//'use strict'; //ERROR: Attempted to assign to readonly property
import React, { Component } from 'react';
import {Alert, DeviceEventEmitter, Dimensions,Image,NativeModules,Picker,StyleSheet,View,ScrollView,Text,TextInput,TouchableOpacity,TouchableHighlight,TouchableWithoutFeedback } from 'react-native';
import {Icon,getImageSource} from './Icon'
import NavigationBar from 'react-native-navbar';
import Modal from 'react-native-root-modal'
import Button from 'apsl-react-native-button'
import I18n from 'react-native-i18n';
import Gallery from 'react-native-gallery';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view'
//import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scrollview'
import Store  from '../io/Store';
import Global from '../io/Global';
import Push   from '../io/Push';
import Net    from '../io/Net'
import Style     from './Style';
import DetailImg from './DetailImg';
import FormInfo  from "./FormInfoVar"
var {height, width} = Dimensions.get('window');

export default class Detail extends Component {
    constructor(props) {
        super(props);
        this.images = []
        this.isLogin = (Global.mainlogin.length>0)
        this.isMyMsg = this.checkSns(Global.mainlogin)
        this.state={ 
            reply: '',
            reply_height: 35,
            //image_modal_name:this.images[0],
            show_pic_modal:false,
            push_to:this.props.msg.uid,
        }
        this.key = Global.getKeyFromMsg(this.props.msg)
        this.openZoom=this.openZoom.bind(this)
        this.closeZoom=this.closeZoom.bind(this)
    }
    componentWillMount(){
        let self = this;
        if(typeof this.props.msg.pics ==='object'){
            this.images = this.props.msg.pics
            //alert(JSON.stringify(this.props.msg))
        }else if(typeof this.props.msg.pics ==='string'){
            if(this.props.msg.pics!=='') this.images = this.props.msg.pics.split(',')
            //alert(JSON.stringify(this.props.msg))
        }
        //I18n.locale = NativeModules.RNI18n.locale
    }
    talkTo(user_name,user_push_id){
        this.setState({
            reply:'@'+user_name+': ',
            push_to:user_push_id,
        })
    }
    getTalkIcon(){
        return 'ion-ios-text-outline'
        //if(this.state.push_to===from) icon='ion-ios-text'
        //alert('from='+from+' push_to='+this.state.push_to)
    }
    //#mainlogin = {'car:lat,lng:ctime#time' : 'r1|fb:email|content'}
    p2p(now){
        //if(this.props.msg.s1uid) OneSignal.postNotification(title, data, this.props.msg.s1uid);
        if(this.props.msg.uid) {
            Push.postOne(
                this.state.push_to,
                this.state.reply,     //title
                I18n.t('click_more'), //content
                {t:Global.push_p2p,i:this.key,f:Push.uid,r:now},
                this.props.msg.os,
            )
        }
    }
    onReply() {
        if(this.state.reply.length<5) {
            alert('Please reply with more characters.')
            return;
        }
        //var key = Global.getKeyFromMsg(this.props.msg)
	var time = Math.round(+new Date()/1000) //+new Date();
        let msgReplyValue={
            l:{
              type:Global.getMainLoginType(),
              name:Global.getMainLoginName()
            },
            c:this.state.reply,
            f:Push.uid
        }
        var value={key:this.key, field:'#'+time, value:JSON.stringify(msgReplyValue)}
        //let loginsObj = Global.getLogins(this.props.msg.owner)
        //let replyValue={t:'r1', l:Global.mainlogin,c:this.state.reply}
        //var notify_value={key:'@'+Global.getInfoMainLogin(loginsObj), field:this.key+'#'+time, value:JSON.stringify(replyValue)}
        var _this = this;
        Alert.alert(
            "Reply",
            "Do you want to reply this information ? ",
            //"Do you want to reply this information ? \nnotify_value="+JSON.stringify(notify_value),
            [
                {text:"Cancel", },
                {text:"OK", onPress:()=>{
                    Net.putHash(value)
                    //Net.putHash(notify_value)
                    _this.p2p(time)
                    _this.props.navigator.pop();
                }},
            ]
        );
    }
    onClose() {
        //var key = Global.getKeyFromMsg(this.props.msg)
	var time = Math.round(+new Date()/1000) //+new Date();
        var value={key:this.key, field:'close', value:Global.mainlogin+'|'+time}
        let loginsObj = Global.getLogins(this.props.msg.owner)
	var notify_value={key:'@'+Global.getInfoMainLogin(loginsObj), field:this.key+'#'+time, value:'c1|'+Global.mainlogin+'|'}
        var _this = this;
        Alert.alert(
            "Complete",
            "Do you want to complete this request ? ",
            [
                {text:"Cancel", },
                {text:"OK", onPress:()=>{
                    Net.putHash(value)
                    //Net.putHash(notify_value)
                    _this.props.navigator.pop();
                }},
            ]
        );
    }
    onDelete() {
	var _this = this;
        //var key = Global.getKeyFromMsg(this.props.msg)
        let myjson = {key:'*'+Global.mainlogin,field:this.key}
        Alert.alert(
            "Delete",
            "Do you want to delete this information ? ",
            [
                {text:"Cancel", },
                {text:"OK", onPress:()=>{
                    Net.delMsg(_this.key)
                    Net.delHash(myjson);
                    DeviceEventEmitter.emit('refresh:MyList',0);
                    _this.props.navigator.pop();
                }},
            ]
        );
    }
    onEdit(){
        this.props.navigator.push({component: FormInfo, passProps: { msg:this.props.msg, navigator:this.props.navigator } })
    }
    openZoom(){
        this.setState({show_pic_modal:true})
    }
    closeZoom(){
        this.setState({show_pic_modal:false})
        
    }
    checkSns(mainlogin){
        let owner = this.props.msg.owner
        if(owner.indexOf(mainlogin) > -1 && mainlogin.length>0)
          return true
        else
          return false
    }
    getSNSIcon(type){
        return Global.SNS_ICONS[type]  //this.props.msg.owner.split(':')[0]
    }
    showActionIcons(){
        if(this.isMyMsg){
          return (
            <View style={{flexDirection:'row',}}>
              <Icon
                name={'ion-ios-create-outline'}
                color={Style.font_colors.enabled}
                size={40}
                onPress={this.onEdit.bind(this) } />
	      <View style={{width:40}} />
              <Icon
                name={'ion-ios-trash-outline'}
                color={Style.font_colors.enabled}
                size={40}
                onPress={this.onDelete.bind(this) } />
              <View style={{width:10}} />
            </View>
          )
/*
              <View style={{width:40}} />
              <Icon
                name={'ion-ios-checkmark-circle-outline'}
                color={'green'}
                size={40}
                onPress={this.onClose.bind(this) } />
*/
        }
    }
    showSlides(){
        if(this.images.length>0) {
            //alert(JSON.stringify(this.images))
            return (
                <DetailImg 
                    msg={this.props.msg}
                    style={{backgroundColor:'transparent',height:height/2}} 
                    openModal={this.openZoom} 
                    //onChange={(currName)=>{
                        //this.setState({image_modal_name:currName})
                    //}} 
                />
            )
        }
    }
    showOwners(){
	var owners = this.props.msg.owner.split(',')
        owners.push('tel:'+this.props.msg.phone)
        return (
          <View style={Style.detail_card} >
            {owners.map( (owner) => {
		var sns_type = owner.split(':')[0]
		var sns_user = owner.split(':')[1]
		var sns_name = owner.split(':')[2]
	        //console.log('----------showOwners():type:'+sns_type+', user:'+sns_user)  <View style={{width:30,alignItems:'center'}}>
                return (
                    <View style={{flexDirection:'row',marginLeft:10}} key={owner} >
                        <View style={{width:30,alignItems:'center'}}>
                          <Icon
                            style={{marginLeft:10,marginRight:6}}
                            size={24}
                            color={'blue'}
                            name={Global.SNS_ICONS[sns_type]}
                          />
                        </View>
                        <Text style={{marginLeft:20}}>{sns_name==null?sns_user:sns_name}</Text>
                    </View>
                )
            }) }
          </View>
        );
    }
    renderReplyItems(){
        //id:#rtime  key='car:lat,lng:ctime#time'  value='{l:Global.mainlogin,c:this.state.reply}'
        var keys = Object.keys(this.props.msg)
	var replys = keys.filter((key) => {
	    return (key.substring(0,1)==='#')
	}).sort()
	return (
	  replys.map((key)=>{
	    //if(sns_type==null || sns_type==''){
            if(this.props.msg[key].substring(0,1)!=='{'){
              return <Text key={key} style={{flex:1,marginLeft:30}}>{ 'Invalid Characters' }</Text>
            }else{
              let replyObj = JSON.parse(this.props.msg[key])
              //alert(JSON.stringify(replyObj))
              let owner = replyObj.l
              let reply = replyObj.c
              let time  = parseInt(key.substring(1)) //#time -> time
              let sns_type = owner.type
	      let sns_user = owner.name
	      let from = replyObj.f
	      return (
	        <View style={{marginLeft:20,flexDirection:'row',flex:1}} key={key}>
                    <Icon
                        style={{marginLeft:6}}
                        size={20}
                        color={'blue'}
                        name={Global.SNS_ICONS[sns_type]}
                    />
                    <View style={{marginLeft:10,flex:1,flexDirection:'row'}}>
  	              <View style={{flex:1}}>
                        <Text>{ sns_user }</Text>
                        <View style={{flex:1}} />
                        <Text>{ Global.getDateTimeFormat(time)+': '+reply }</Text>
                      </View>
                      <View >
                        <Icon name={this.getTalkIcon()} size={40} onPress={()=>this.talkTo(sns_user,from)}/>
                      </View>
                    </View>
                </View>
	        )
              //}
            }
          })
	)
    }
    renderReplySection(){
        if(this.isLogin)
            return (
                <View style={Style.detail_card} >
                    <Text style={{marginLeft:21,fontWeight:'bold'}}>{I18n.t('replies')} :  </Text>
                    {this.renderReplyItems()}
                </View>
            )
    }
    renderModal(){
      //let uri = Global.host_image_info+this.props.msg.ctime+'/'+this.state.image_modal_name;
      let pre = Global.host_image_info+this.props.msg.ctime+'/'
      let images = this.images.map((item)=>{
          return pre+item
      })
      //alert(JSON.stringify(images))
      return (
        <Modal 
            style={{ top:0,bottom:0,right:0,left:0, backgroundColor:'rgba(0, 0, 0, 0.7)' }} 
            //transform: [{scale: this.state.scaleAnimation}]
            visible={this.state.show_pic_modal}
        >
            <View>
            <Gallery
                style={{flex:1,backgroundColor:'black',width: Style.DEVICE_WIDTH, height: Style.DEVICE_HEIGHT}}
                images={ images }
                onSingleTapConfirmed={this.closeZoom}
            />
            </View>
        </Modal>
      )
    }
    renderReplyInput(){
        if(this.isLogin)
            return (
                <View style={Style.detail_card} >
                    <View style={{flexDirection:'row'}}>
                        <Text style={{marginLeft:21,fontWeight:'bold'}}>{I18n.t('my_reply')}:  </Text>
                        <View style={{flex:1}} />
                        <Button style={{marginRight:20,width:50,height:26,backgroundColor:'#3498db',borderColor:'#2980b9'}} textStyle={{fontSize:12}} onPress={this.onReply.bind(this)}>{I18n.t('reply')}</Button>
                    </View>
                        <TextInput
                            style={{marginLeft:20,height:this.state.reply_height}}
                            multiline={true}
                            value={this.state.reply}
                            onChange={(event) => {
                                if(event.nativeEvent.text.length<1) push_to=this.props.msg.uid
                                else push_to=this.state.push_to
                                this.setState({
                                    reply: event.nativeEvent.text,
                                    reply_height: event.nativeEvent.contentSize.height,
                                    push_to:push_to,
                                });
                                if(event.nativeEvent.text.length<1) push_to=this.props.msg.uid
                            }}
                        />
                    </View>
            )
    }
    renderMisc(){
        let self=this
        // pics {type,cat,title,ctime,address,lat,lng}  {owner,phone} {#...}
        let array = ['pics','type','cat','title','ctime','owner','phone','content', 'address','lat','lng','dest','time','dest_lat','dest_lng','uid','country','city','os']
        var keys = Object.keys(this.props.msg)
        var misc = keys.filter((key) => {
            return (key.substring(0,1)!=='#' && array.indexOf(key)<0)
        }).sort()
        //alert(JSON.stringify(misc))
        return (
            <View style={Style.detail_card} >
                {misc.map((key)=>{
                    return <Text style={{marginLeft:21}} key={key}><Text style={{fontWeight:'bold'}}>{I18n.t(key)}:  </Text>{this.props.msg[key]}</Text>
                })}
                <Text style={{marginLeft:21}}><Text style={{fontWeight:'bold'}}>{I18n.t('content')}:</Text></Text>
                <Text style={{marginLeft:21}}>{this.props.msg.content}</Text>
            </View>
        )
    }
    renderTitle(){
        var _ctime = Global.getDateTimeFormat(parseInt(this.props.msg.ctime))
        let typeIcon = Global.TYPE_ICONS[this.props.msg.type]
        let asking = 'rent0,buy'.indexOf(this.props.msg.cat)>0
        let destView = null
        if(this.props.msg.dest) destView=<Text>{I18n.t('dest')} : {this.props.msg.dest}</Text>
        let destTimeView = null
        if(this.props.msg.time) destTimeView=<Text>{I18n.t('time')} : {this.props.msg.time}</Text>
        return (
            <View style={Style.detail_card} >
                <View style={{flexDirection:'row',marginLeft:20}} >
                    <Icon
                        style={{marginLeft:15,marginRight:15}}
                        size={44}
                        color={asking?'gray':'blue'}
                        name={typeIcon}
                    />
                    <View style={{flex:1,marginLeft:20}}>
                        <Text style={{fontWeight:'bold', fontSize:20,}}>{this.props.msg.title}</Text>
                        <Text>{I18n.t('cat')} : {this.props.msg.cat?I18n.t(this.props.msg.cat):''}</Text>
                        <Text>{I18n.t('ctime')} : {_ctime}</Text>
                        <Text>{I18n.t('address')} : {this.props.msg.address}</Text>
                        {destTimeView}
                        {destView}
                    </View>
                </View>
            </View>
       )
    }
    render(){
        //((TelephonyManager) getSystemService(TELEPHONY_SERVICE)).getLine1Number();
        return (
            <View style={{flex:1}}>
                <NavigationBar style={Style.navbar} title={{title: '',}}
                   leftButton={
                     <View style={{flexDirection:'row',}}>
                       <Icon name={"ion-ios-arrow-round-back"} color={Style.font_colors.enabled} size={40} onPress={() => this.props.navigator.pop() } />
                     </View>
                   }
                   rightButton={ this.showActionIcons() }
                />
                <View style={{flex:8,backgroundColor: '#eeeeee',}}>
                    <KeyboardAwareScrollView
                      automaticallyAdjustContentInsets={false}
                      scrollEventThrottle={200}
                      style={{flex:8}}
                    >
                      {this.showSlides()}
                      {this.renderModal()}
                      {this.renderTitle()}
                      {this.showOwners()}
                      {this.renderMisc()}
                      {this.renderReplySection()}
                      {this.renderReplyInput()}
                    </KeyboardAwareScrollView>
		</View>
            </View>
        );
    }
}

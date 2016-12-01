//'use strict'; //ERROR: Attempted to assign to readonly property
import React, { Component } from 'react';
import {Alert, DeviceEventEmitter, Dimensions,Image,Linking,NativeModules,Picker,Platform,StyleSheet,View,ScrollView,Text,TextInput,TouchableOpacity,TouchableHighlight,TouchableWithoutFeedback } from 'react-native';
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
import Menu, { MenuContext, MenuOptions, MenuOption, MenuTrigger } from 'react-native-popup-menu'
var {height, width} = Dimensions.get('window');

export default class Detail extends Component {
    constructor(props) {
        super(props);
        this.images = []
        this.state={ 
            reply: '',
            reply_height: 35,
            //image_modal_name:this.images[0],
            show_pic_modal:false,
            push_to:this.props.msg.uid,
            push_to_len:0,
            push_to_os:this.props.msg.os,
            highlight_color:Style.CAT_COLORS[this.props.msg.cat],
            msg:this.props.msg,
        }
        this.key = Global.getKeyFromMsg(this.state.msg)
        this.openZoom=this.openZoom.bind(this)
        this.closeZoom=this.closeZoom.bind(this)
        this.isLogin = (Global.mainlogin.length>0)
        this.isMyMsg = this.checkSns(Global.mainlogin)
    }
    componentWillMount(){
        let self = this;
        if(typeof this.state.msg.pics ==='object'){
            this.images = this.state.msg.pics
            //alert(JSON.stringify(this.state.msg))
        }else if(typeof this.state.msg.pics ==='string'){
            if(this.state.msg.pics!=='') this.images = this.state.msg.pics.split(',')
            //alert(JSON.stringify(this.state.msg))
        }
        DeviceEventEmitter.removeAllListeners('refresh:Detail')
        DeviceEventEmitter.addListener('refresh:Detail',(evt)=>setTimeout(()=>this.load(),500));
    }
    componentWillUnmount(){
        DeviceEventEmitter.removeAllListeners('refresh:Detail')
    }
    load(){
        let self=this
        Net.getMsg(this.key).then((json)=> {
          if(json!=null){
            //alert(JSON.stringify(json))
            self.setState({ msg:json })
         }else alert('Please reopen this share.')
        });
    }
    talkTo(user_name,user_push_id,user_push_os){
        this.setState({
            reply:'@'+user_name+': ',
            push_to:user_push_id,
            push_to_os:user_push_os,
            push_to_len:user_name.length+2,
        })
    }
    getTalkIcon(){
        return 'ion-ios-text-outline'
        //if(this.state.push_to===from) icon='ion-ios-text'
        //alert('from='+from+' push_to='+this.state.push_to)
    }
    //#mainlogin = {'car:lat,lng:ctime#time' : 'r1|fb:email|content'}
    p2p(now){
        //if(this.state.msg.s1uid) OneSignal.postNotification(title, data, this.state.msg.s1uid);
        if(this.state.msg.uid) {
            let name = Global.getMainLoginName()
            Push.postOne(
                this.state.push_to,
                this.state.reply,     //title
                I18n.t('click_more'), //content
                {t:Global.push_p2p,i:this.key,f:Push.uid,n:name,r:now},
                this.state.push_to_os,
            )
        }
    }
    onReply() {
        if(this.state.reply.length<5) {
            alert(I18n.t('more_char'))
            return;
        }
        //var key = Global.getKeyFromMsg(this.state.msg)
	var time = Math.round(+new Date()/1000) //+new Date();
        let os=''
        if(Platform.OS==='ios') os = (__DEV__)?'idev':'ios'
        let msgReplyValue={
            l:{
              type:Global.getMainLoginType(),
              name:Global.getMainLoginName()
            },
            c:this.state.reply,
            f:Push.uid,
            os:os,
        }
        var value={key:this.key, field:'#'+time, value:JSON.stringify(msgReplyValue)}
        //console.log(JSON.stringify(msgReplyValue))
        //let loginsObj = Global.getLogins(this.state.msg.owner)
        //let replyValue={t:'r1', l:Global.mainlogin,c:this.state.reply}
        //var notify_value={key:'@'+Global.getInfoMainLogin(loginsObj), field:this.key+'#'+time, value:JSON.stringify(replyValue)}
        var _this = this;
        Alert.alert(
            I18n.t("reply"),
            I18n.t("confirm_reply"),
            //"Do you want to reply this information ? \nnotify_value="+JSON.stringify(notify_value),
            [
                {text:I18n.t("no"), },
                {text:I18n.t('yes'), onPress:()=>{
                    Net.putHash(value)
                    //Net.putHash(notify_value)
                    _this.p2p(time)
                    //_this.props.navigator.pop();
                    DeviceEventEmitter.emit('refresh:Detail',0);
                }},
            ]
        );
    }
    onDelete() {
	var _this = this;
        //var key = Global.getKeyFromMsg(this.state.msg)
        let myjson = {key:'*'+Global.mainlogin,field:this.key}
        Alert.alert(
            I18n.t("delete"),
            I18n.t("confirm_delete"),
            [
                {text:I18n.t("no"), },
                {text:I18n.t("yes"), onPress:()=>{
                    Net.delMsg(_this.key)
                    Net.delHash(myjson);
                    DeviceEventEmitter.emit('refresh:MyList',0);
                    _this.props.navigator.pop();
                }},
            ]
        );
    }
    onEdit(){
        this.props.navigator.push({component: FormInfo, passProps: { msg:this.state.msg, navigator:this.props.navigator } })
    }
    openZoom(){
        this.setState({show_pic_modal:true})
    }
    closeZoom(){
        this.setState({show_pic_modal:false})
    }
    checkSns(mainlogin){
        let owner = this.state.msg.owner
        if(owner.indexOf(mainlogin) > -1 && mainlogin.length>0)
          return true
        else
          return false
    }
    getSNSIcon(type){
        return Global.SNS_ICONS[type]  //this.state.msg.owner.split(':')[0]
    }
    renderMoreOption(value,name,icon){
      return (
          <MenuOption value={value} style={{backgroundColor:this.state.highlight_color}}>
              <View style={{flexDirection:'row',height:40}}>
                  <View style={{width:30,justifyContent:'center'}}>
                      <Icon name={icon} color={'#ffffff'} size={26} />
                  </View>
                  <View style={{justifyContent:'center'}}>
                      <Text style={{color:Style.font_colors.enabled}}> {name} </Text>
                  </View>
              </View>
          </MenuOption>
      )
    }
    showActionIcons(){
      if(this.isMyMsg) return (
          <View style={{ padding: 1, flexDirection: 'row', backgroundColor:this.state.highlight_color }}>
            <Menu onSelect={(value) => this.chooseMore(value) }>
              <MenuTrigger>
                <Icon name={'ion-ios-more'} color={'#ffffff'} size={36} style={{paddingLeft:15,paddingRight:15,flexDirection:'row',justifyContent:'center'}} />
              </MenuTrigger>
              <MenuOptions>
                {this.renderMoreOption('edit',  I18n.t('edit_share'),  'fa-pencil-square')}
                    <View style={Style.separator} />
                {this.renderMoreOption('delete',I18n.t('delete_share'),'fa-trash')}
                    <View style={Style.separator} />
                {this.renderMoreOption('reply', I18n.t('reply'), 'fa-comment')}
              </MenuOptions>
            </Menu>
          </View>
      )
    }
    chooseMore(option){
      if(option==='delete') this.onDelete()
      else if(option==='edit') this.onEdit()
    }
    showSlides(){
        if(this.images.length>0) {
            //alert(JSON.stringify(this.images))
            return (
                <DetailImg 
                    msg={this.state.msg}
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
	var owners = this.state.msg.owner.split(',')
        owners.push('tel:'+this.state.msg.phone)
        return (
        <View style={Style.detail_card} >
          <View style={{flex:1,flexDirection:'row'}}>
            <View style={{width:200}}>
            {owners.map( (owner) => {
		var sns_type = owner.split(':')[0]
		var sns_user = owner.split(':')[1]
		var sns_name = owner.split(':')[2]
	        //console.log('----------showOwners():type:'+sns_type+', user:'+sns_user)  <View style={{width:30,alignItems:'center'}}>
                return (
                    <View style={{flexDirection:'row'}} key={owner} >
                        <View style={{marginLeft:6,alignItems:'center'}}>
                          <Icon
                            //style={{marginLeft:10,marginRight:6}}
                            size={16}
                            color={this.state.highlight_color}
                            name={Global.SNS_ICONS[sns_type]}
                          />
                        </View>
                        <Text style={{marginLeft:8}}>{sns_name==null?sns_user:sns_name}</Text>
                    </View>
                )
            }) }
            </View>
            <View style={{flex:1}}/>
            {this.renderPhoneIcon()}
            <View style={{width:20}}/>
          </View>
        </View>
        );
    }
    renderPhoneIcon(){
        if(this.state.msg.phone){
          let tel = 'tel:'+this.state.msg.phone
          return (
            <View style={{height:80,flexDirection:'row',justifyContent:'center',alignItems:'center'}}>
            <TouchableOpacity style={{width:60,height:60}} onPress={() => this.callPhone(tel)}>
              <Icon name={'ion-ios-call'} size={50} color={this.state.highlight_color} />
            </TouchableOpacity>
            </View>
          )
        }
    }
    callPhone(url){
        Linking.canOpenURL(url).then(supported => {
          if (supported) {
            Alert.alert(
              I18n.t("call"),
              I18n.t("confirm_call"),
              //"Do you want to reply this information ? \nnotify_value="+JSON.stringify(notify_value),
              [
                {text:I18n.t("no"), },
                {text:I18n.t("yes"), onPress:()=>{
                    Linking.openURL(url);
                }},
              ]
            );
          } else { 
            alert(I18n.t('unsupport')+':' + url);
          }
        });
    }
    renderReplyItems(){
        //id:#rtime  key='car:lat,lng:ctime#time'  value='{l:Global.mainlogin,c:this.state.reply}'
        var keys = Object.keys(this.state.msg)
	var replys = keys.filter((key) => {
	    return (key.substring(0,1)==='#')
	}).sort()
	return (
	  replys.map((key)=>{
	    //if(sns_type==null || sns_type==''){
            if(this.state.msg[key].substring(0,1)!=='{'){
              return <Text key={key} style={{flex:1,marginLeft:30}}>{ 'Invalid Characters' }</Text>
            }else{
              let replyObj = JSON.parse(this.state.msg[key])
              //alert(JSON.stringify(replyObj))
              let owner = replyObj.l
              let reply = replyObj.c
              let time  = parseInt(key.substring(1)) //#time -> time
              let sns_type = owner.type
	      let sns_user = owner.name
	      let from = replyObj.f
	      let from_os = replyObj.os
	      return (
	        <View style={{marginLeft:6,flexDirection:'row',flex:1}} key={key}>
                    <Icon
                        style={{margin:2}}
                        size={16}
                        color={this.state.highlight_color}
                        name={Global.SNS_ICONS[sns_type]}
                    />
                    <View style={{marginLeft:10,flex:1,flexDirection:'row'}}>
  	              <View style={{flex:1}}>
                        <View style={{justifyContent:'center'}}>
                          <Text>{ sns_user }</Text>
                        </View>
                        <View style={{justifyContent:'center'}}>
                          <Text>{ Global.getDateTimeFormat(time)+': '+reply }</Text>
                        </View>
                      </View>
                      <Icon name={this.getTalkIcon()} size={40} color={this.state.highlight_color} onPress={()=>this.talkTo(sns_user,from,from_os)}/>
                    </View>
                </View>
	        )
            }
          })
	)
    }
    renderReplySection(){
        if(this.isLogin)
            return (
                <View style={Style.detail_card} >
                    <Text style={{marginLeft:6,marginBottom:8,fontWeight:'bold'}}>{I18n.t('replies')} :  </Text>
                    {this.renderReplyItems()}
                </View>
            )
    }
    renderModal(){
      //let uri = Global.host_image_info+this.state.msg.ctime+'/'+this.state.image_modal_name;
      let pre = Global.host_image_info+this.state.msg.ctime+'/'
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
                        <Text style={{marginLeft:8,fontWeight:'bold'}}>{I18n.t('my_reply')}:  </Text>
                        <View style={{flex:1}} />
                        <Button style={{marginRight:6,width:50,height:30,backgroundColor:this.state.highlight_color,borderColor:this.state.highlight_color}} textStyle={{fontSize:12}} onPress={this.onReply.bind(this)}>{I18n.t('reply')}</Button>
                    </View>
                        <TextInput
                            //ref={(input) => this.myReply = input}
                            style={{marginLeft:4,height:this.state.reply_height}}
                            multiline={true}
                            value={this.state.reply}
                            onChange={(event) => {
                                if(event.nativeEvent.text.length<1) push_to=this.state.msg.uid
                                else push_to=this.state.push_to
                                if(event.nativeEvent.text.length<this.state.push_to_len) {
                                    //alert('text.len='+event.nativeEvent.text.length+' push_to_len='+this.state.push_to_len)
                                    //this.myReply.setNativeProps({text: ''})
                                    this.setState({
                                      reply: '',
                                      reply_height: event.nativeEvent.contentSize.height,
                                      push_to:push_to,
                                    });
                                }else{
                                    this.setState({
                                      reply: event.nativeEvent.text,
                                      reply_height: event.nativeEvent.contentSize.height,
                                      push_to:push_to,
                                    });
                                }
                            }}
                        />
                    </View>
            )
    }
    renderMisc(){
        let self=this
        // pics {type,cat,title,ctime,address,lat,lng}  {owner,phone} {#...}
        let array = ['pics','type','cat','title','ctime','owner','phone','content', 'address','lat','lng','dest','time','dest_lat','dest_lng','uid','country','city','os','city_id']
        var keys = Object.keys(this.state.msg)
        var misc = keys.filter((key) => {
            return (key.substring(0,1)!=='#' && array.indexOf(key)<0)
        }).sort()
        //alert(JSON.stringify(misc))
        return (
            <View style={Style.detail_card} >
                {misc.map((key)=>{
                    return <Text style={{marginLeft:8}} key={key}><Text style={{fontWeight:'bold'}}>{I18n.t(key)}:  </Text>{this.state.msg[key]}</Text>
                })}
                <Text style={{marginLeft:8}}><Text style={{fontWeight:'bold'}}>{I18n.t('content')}:</Text></Text>
                <Text style={{marginLeft:8}}>{this.state.msg.content}</Text>
            </View>
        )
    }
    renderTitle(){
        var _ctime = Global.getDateTimeFormat(parseInt(this.state.msg.ctime))
        let typeIcon = Global.TYPE_ICONS[this.state.msg.type]
        let asking = 'rent0,buy'.indexOf(this.state.msg.cat)>0
        let destView = null
        if(this.state.msg.dest) destView=<Text>{I18n.t('dest')} : {this.state.msg.dest}</Text>
        let destTimeView = null
        if(this.state.msg.time) destTimeView=<Text>{I18n.t('time')} : {this.state.msg.time}</Text>
        return (
            <View style={Style.detail_card} >
                <View style={{flexDirection:'row'}} >
                    <Icon
                        style={{marginLeft:6,marginRight:10,justifyContent:'center'}}
                        size={44}
                        color={this.state.highlight_color}
                        name={typeIcon}
                    />
                    <View style={{flex:1,marginLeft:10}}>
                        <Text style={{fontWeight:'bold', fontSize:20,}}>{this.state.msg.title}</Text>
                        <Text>{I18n.t('cat')} : {this.state.msg.cat?I18n.t(this.state.msg.cat):''}</Text>
                        <Text>{I18n.t('ctime')} : {_ctime}</Text>
                        <Text>{I18n.t('address')} : {this.state.msg.address}</Text>
                        {destTimeView}
                        {destView}
                    </View>
                </View>
            </View>
       )
    }
    render(){
        return (
            <MenuContext style={{ flex: 1 }} ref={"menu_detail"}>
                <NavigationBar style={{
                      flex:1,
                      paddingLeft:12,
                      paddingRight:12,
                      paddingTop:8,
                      paddingBottom:6,
                      flexDirection:'row',
                      alignItems: 'center',
                      //justifyContent: 'center',
                      height: Style.NAVBAR_HEIGHT,
                      backgroundColor:this.state.highlight_color,
                   }} title={{title: '',}}
                   leftButton={
                      <TouchableOpacity style={{width:50,height:50}} onPress={() => this.props.navigator.pop()}>
                        <Icon name={"ion-ios-arrow-round-back"} color={Style.font_colors.enabled} size={40} />
                      </TouchableOpacity>
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
            </MenuContext>
        );
    }
}

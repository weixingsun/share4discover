//'use strict'; //ERROR: Attempted to assign to readonly property
import React, { Component } from 'react';
import {Alert, DeviceEventEmitter, Dimensions,Image,NativeModules,Picker,StyleSheet,View,ScrollView,Text,TextInput,TouchableOpacity,TouchableHighlight,TouchableWithoutFeedback } from 'react-native';
import {Icon,getImageSource} from './Icon'
import NavigationBar from 'react-native-navbar';
import Modal from 'react-native-root-modal'
import Button from 'apsl-react-native-button'
//import {ImageCrop} from 'react-native-image-cropper'
import PhotoView from 'react-native-photo-view';
//import ZoomableImage from './ZoomableImage2';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view'
//import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scrollview'
import Style from './Style';
import Store from '../io/Store';
import Global from '../io/Global';
import Net from '../io/Net'
import DetailImg from './DetailImg';
import FormInfo from "./FormInfoVar"
import I18n from 'react-native-i18n';
import OneSignal from 'react-native-onesignal';
var {height, width} = Dimensions.get('window');

export default class Detail extends Component {
    constructor(props) {
        super(props);
        this.lang = NativeModules.RNI18n.locale.replace('_', '-').toLowerCase()
        this.images = []
        this.isLogin = (Global.mainlogin.length>0)
        this.isMyMsg = this.checkSns(Global.mainlogin, this.props.msg.owner)
        this.close_image = null;
        this.state={ 
            reply: '',
            reply_height: 35,
            image_modal_name:this.images[0],
            show_pic_modal:false,
        }
        this.key = Global.getKeyFromMsg(this.props.msg)
        this.openZoom=this.openZoom.bind(this)
        this.closeZoom=this.closeZoom.bind(this)
    }
    componentWillMount(){
        let self = this;
        getImageSource('ion-ios-close', 40, 'white').then((source) => {
            self.close_image=source
        });
        if(typeof this.props.msg.pics ==='object'){
            this.images = this.props.msg.pics
            //alert(JSON.stringify(this.props.msg))
        }else if(typeof this.props.msg.pics ==='string'){
            if(this.props.msg.pics!=='') this.images = this.props.msg.pics.split(',')
            //alert(JSON.stringify(this.props.msg))
        }
        I18n.locale = NativeModules.RNI18n.locale
    }
    //#mainlogin = {'car:lat,lng:ctime#time' : 'r1|fb:email|content'}
    s1Note(msg,notify){
        if(this.props.msg.s1uid){
            let contents = {'en':msg.title+': '+notify.value}
            let data = {key:notify.field,value:notify.value}
            OneSignal.postNotification(contents, data, this.props.msg.s1uid);
            //OneSignal.Configure
            //onNotificationOpened: function(message, data, isActive) {
            //  if (data.p2p_notification) {
            //    for (var num in data.p2p_notification) {
            //    // console.log(data.p2p_notification[num]);
            //    }
            //  }
            //}
        }
    }
    onReply() {
        if(this.state.reply.length<5) {
            alert('Please reply with more characters.')
            return;
        }
        //var key = Global.getKeyFromMsg(this.props.msg)
	var time = +new Date();
        let msgReplyValue={l:Global.mainlogin,c:this.state.reply}
        var value={key:this.key, field:'#'+time, value:JSON.stringify(msgReplyValue)}
        let loginsObj = Global.getLogins(this.props.msg.owner)
        let replyValue={t:'r1', l:Global.mainlogin,c:this.state.reply}
        var notify_value={key:'@'+Global.getInfoMainLogin(loginsObj), field:this.key+'#'+time, value:JSON.stringify(replyValue)}
        var _this = this;
        Alert.alert(
            "Reply",
            "Do you want to reply this information ? ",
            //"Do you want to reply this information ? \nnotify_value="+JSON.stringify(notify_value),
            [
                {text:"Cancel", },
                {text:"OK", onPress:()=>{
                    Net.putHash(value)
                    Net.putHash(notify_value)
                    _this.s1Note(_this.props.msg,notify_value)
                    _this.props.navigator.pop();
                }},
            ]
        );
    }
    onClose() {
        //var key = Global.getKeyFromMsg(this.props.msg)
	var time = +new Date();
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
    checkSns(mainlogin,owner){
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
                color={'blue'}
                size={40}
                onPress={this.onEdit.bind(this) } />
	      <View style={{width:40}} />
              <Icon
                name={'ion-ios-trash-outline'}
                color={'red'}
                size={40}
                onPress={this.onDelete.bind(this) } />
              <View style={{width:40}} />
              <Icon
                name={'ion-ios-checkmark-circle-outline'}
                color={'green'}
                size={40}
                onPress={this.onClose.bind(this) } />
              <View style={{width:10}} />
            </View>
          )
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
                    onChange={(currName)=>{
                        //alert('pic:'+currName)
                        this.setState({image_modal_name:currName})
                    }} />
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
              //var str = this.props.msg[key];
              let replyObj = JSON.parse(this.props.msg[key])
              let owner = replyObj.l
              let reply = replyObj.c
              let time  = parseInt(key.substring(1)) //#time -> time
              let sns_type = owner.split(':')[0]
	      let sns_user = owner.split(':')[1]
	      if(sns_type==null || sns_type==''){
                return (
                    <Text key={key} style={{flex:1,marginLeft:30}}>{ 'Invalid Characters' }</Text>
                )
	      }else{
	        return (
	        <View style={{marginLeft:30}} key={key}>
	          <View style={{flexDirection:'row',marginLeft:30}}>
                    <Icon
                        //style={{marginRight:6}}
                        size={20}
                        color={'blue'}
                        name={Global.SNS_ICONS[sns_type]}
                    />
                    <Text style={{flex:1,marginLeft:1}}>{ sns_user }</Text>
                    <Text style={{marginRight:5,color:'gray'}}>{ Global.getDateTimeFormat(time)}</Text>
                  </View>
                  <View style={{flexDirection:'row',marginLeft:30}}>
                    <Text style={{flex:1,marginLeft:10}}>  { reply } </Text>
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
                    <Text style={{marginLeft:21,fontWeight:'bold'}}>{I18n.t('replies')} :  </Text>
                    {this.renderReplyItems()}
                </View>
            )
    }
    /*renderModal(){
      //let key = Global.getKeyFromMsg(this.props.msg);
      let uri = Global.host_image_info+this.props.msg.ctime+'/'+this.state.image_modal_name;
      return (
        <Modal 
            //style={{ top:0,bottom:0,right:0,left:0, backgroundColor:'rgba(0, 0, 0, 0.7)' }} 
            //transform: [{scale: this.state.scaleAnimation}]
            visible={this.state.show_pic_modal}
        >
            <View>
                <ImageCrop ref={'cropper'}
                    image={uri}
                    cropHeight={Style.DEVICE_HEIGHT}
                    cropWidth={Style.DEVICE_WIDTH}
                    zoom={0} maxZoom={80} minZoom={0}
                    panToMove={true} pinchToZoom={true}
                    //onClose={this.closeZoom}
                />
                <TouchableHighlight
                    onPress={this.closeZoom}
                    style={{ 
                             width:40,height:40,position:'absolute', top:15,right:5,
                             alignItems:'center',justifyContent:'center', backgroundColor: 'black' 
                    }}
                >
                        <Image style={{width:20,height:20,margin:5}} source={this.close_image} />
                </TouchableHighlight>
            </View>
        </Modal>
      )
    }
                <ZoomableImage
                  source={{uri: uri}}
                  //minimumZoomScale={0.5}
                  //maximumZoomScale={3}
                  //androidScaleType="center"
                  //onLoad={() => alert("Image loaded!")}
                  //onTap={this.closeZoom}
                  imageWidth={Style.DEVICE_WIDTH}
                  imageHeight={Style.DEVICE_HEIGHT}
                />
*/
    renderModal(){
      //let key = Global.getKeyFromMsg(this.props.msg);
      let uri = Global.host_image_info+this.props.msg.ctime+'/'+this.state.image_modal_name;
      return (
        <Modal 
            style={{ top:0,bottom:0,right:0,left:0, backgroundColor:'rgba(0, 0, 0, 0.7)' }} 
            //transform: [{scale: this.state.scaleAnimation}]
            visible={this.state.show_pic_modal}
        >
            <View>
                <PhotoView
                  source={{uri: uri}}
                  minimumZoomScale={0.5}
                  maximumZoomScale={3}
                  androidScaleType="center"
                  //onLoad={() => alert("Image loaded!")}
                  onTap={this.closeZoom}
                  style={{width: Style.DEVICE_WIDTH, height: Style.DEVICE_HEIGHT}}
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
                                this.setState({
                                    reply: event.nativeEvent.text,
                                    reply_height: event.nativeEvent.contentSize.height,
                                });
                            }}
                        />
                    </View>
            )
    }
    renderMisc(){
        let self=this
        // pics {type,cat,title,ctime,address,lat,lng}  {owner,phone} {#...}
        let array = ['pics','type','cat','title','ctime','owner','phone','content', 'address','lat','lng','dest','time','dest_lat','dest_lng','catTitle','typeTitle','s1uid']
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
                        <Text>{I18n.t('cat')} : {this.props.msg.cat?I18n.t(this.props.msg.cat)+I18n.t(this.props.msg.type):''}</Text>
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
                       <Icon name={"ion-ios-arrow-round-back"} color={'#333333'} size={40} onPress={() => this.props.navigator.pop() } />
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

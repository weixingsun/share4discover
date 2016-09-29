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
//import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view'
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scrollview'
import Style from './Style';
import Store from '../io/Store';
import Global from '../io/Global';
import Net from '../io/Net'
import DetailImg from './DetailImg';
import FormInfo from "./FormInfoVar"
var {height, width} = Dimensions.get('window');

export default class Detail extends Component {
    constructor(props) {
        super(props);
        //this.lang = NativeModules.RNI18n.locale.replace('_', '-').toLowerCase()
        this.images = this.props.msg.pics?this.props.msg.pics.split(','):[]
        this.isLogin = (Global.mainlogin.length>0)
        this.isMyMsg = this.checkSns(Global.mainlogin, this.props.msg.owner)
        this.close_image = null;
        this.state={ 
            reply: '',
            reply_height: 35,
            image_modal_name:this.images[0],
            show_pic_modal:false,
        }
        this.openZoom=this.openZoom.bind(this)
        this.closeZoom=this.closeZoom.bind(this)
    }
    //#mainlogin = {'car:lat,lng:ctime#time' : 'r1|fb:email|content'}
    onReply() {
        if(this.state.reply.length<5) {
            alert('Please reply with more characters.')
            return;
        }
        var key = Global.getKeyFromMsg(this.props.msg)
	var time = +new Date();
        var value={key:key, field:'#'+time, value:Global.mainlogin+'|'+this.state.reply}
        let loginsObj = Global.getLogins(this.props.msg.owner)
        var notify_value={key:'@'+Global.getInfoMainLogin(loginsObj), field:key+'#'+time, value:'r1|'+Global.mainlogin+'|'+this.state.reply}
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
                    _this.props.navigator.pop();
                }},
            ]
        );
    }
    onClose() {
        var key = Global.getKeyFromMsg(this.props.msg)
	var time = +new Date();
        var value={key:key, field:'close', value:Global.mainlogin+'|'+time}
        let loginsObj = Global.getLogins(this.props.msg.owner)
	var notify_value={key:'@'+Global.getInfoMainLogin(loginsObj), field:key+'#'+time, value:'c1|'+Global.mainlogin+'|'}
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
        var key = Global.getKeyFromMsg(this.props.msg)
        let myjson = {key:'*'+Global.mainlogin,field:key}
        Alert.alert(
            "Delete",
            "Do you want to delete this information ? ",
            [
                {text:"Cancel", },
                {text:"OK", onPress:()=>{
                    Net.delMsg(key)
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
    componentWillMount(){
        let self = this;
        getImageSource('ion-ios-close', 40, 'white').then((source) => {
            self.close_image=source
        });
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
        if(this.props.msg.pics != null) {
            let cond1 = (typeof this.props.msg.pics === 'string' && this.props.msg.pics.length>0)
            let cond2 = (typeof this.props.msg.pics === 'object' && this.props.msg.pics[0]!=null && this.props.msg.pics[0].length>0)
            if(cond1 || cond2)
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
            owners.map( (owner) => {
		var sns_type = owner.split(':')[0]
		var sns_user = owner.split(':')[1]
		var sns_name = owner.split(':')[2]
	        //console.log('----------showOwners():type:'+sns_type+', user:'+sns_user)
                return (
                    <View style={{flexDirection:'row',marginLeft:20}} key={owner} >
                        <Icon
                            style={{marginLeft:23,marginRight:6}}
                            size={24}
                            color={'blue'}
                            name={Global.SNS_ICONS[sns_type]}
                        />
                        <Text style={{marginLeft:20}}>{sns_name==null?sns_user:sns_name}</Text>
                    </View>
                )
            })
        );
    }
    renderReplyItems(){
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
              let time  = parseInt(key.substring(1))
              let sns_type = owner.split(':')[0]
	      let sns_user = owner.split(':')[1]
	      if(sns_type==null || sns_type==''){
                return (
                    <Text key={key} style={{flex:1,marginLeft:30}}>{ 'Invalid Characters' }</Text>
                )
	      }else{
	        return (
	          <View style={{flexDirection:'row',marginLeft:30}} key={key} >
                    <Icon
                        //style={{marginRight:6}}
                        size={24}
                        color={'blue'}
                        name={Global.SNS_ICONS[sns_type]}
                    />
                    <Text style={{flex:1,marginLeft:1}}>  { sns_user + ':  '+ reply } </Text>
                    <Text style={{marginRight:5,color:'gray'}}>{ Global.getDateTimeFormat(time)}</Text>
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
                    <Text style={{marginLeft:21,fontWeight:'bold'}}>Replys :  </Text>
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
                        <Text style={{marginLeft:21,fontWeight:'bold'}}>Your Reply:  </Text>
                        <View style={{flex:1}} />
                        <Button style={{marginRight:20,width:50,height:26,backgroundColor:'#3498db',borderColor:'#2980b9'}} textStyle={{fontSize:12}} onPress={this.onReply.bind(this)}>Reply</Button>
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
    render(){
	var _ctime = Global.getDateTimeFormat(parseInt(this.props.msg.ctime))
        //((TelephonyManager) getSystemService(TELEPHONY_SERVICE)).getLine1Number();
        let typeIcon = Global.TYPE_ICONS[this.props.msg.type]
        return (
            <View style={{flex:1}}>
                {this.renderModal()}
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
                      <View style={Style.detail_card} >
                        <View style={{flexDirection:'row',marginLeft:20}} >
                          <Icon
                            style={{marginLeft:15,marginRight:15}}
                            size={44}
                            color={this.props.msg.ask=='false'?'blue':'gray'}
                            name={typeIcon}
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
                      {this.renderReplySection()}
                      {this.renderReplyInput()}
                    </KeyboardAwareScrollView>
		</View>
            </View>
        );
    }
}

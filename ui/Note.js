//'use strict'; //ERROR: Attempted to assign to readonly property
import React, { Component } from 'react';
import {Alert, DeviceEventEmitter, Dimensions,Image,NativeModules,Picker,StyleSheet,View,ScrollView,Text,TextInput,TouchableOpacity,TouchableHighlight,TouchableWithoutFeedback } from 'react-native';
import {Icon,getImageSource} from './Icon'
import NavigationBar from 'react-native-navbar';
import Modal from 'react-native-root-modal'
import Button from 'apsl-react-native-button'
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view'
//import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scrollview'
import Gallery from 'react-native-gallery';
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
        //this.lang = NativeModules.RNI18n.locale.replace('_', '-').toLowerCase()
        this.images = []
        this.state={ 
            show_pic_modal:false,
        }
        this.openZoom=this.openZoom.bind(this)
        this.closeZoom=this.closeZoom.bind(this)
    }
    componentWillMount(){
        let self = this;
        if(typeof this.props.msg.pics ==='object'){
            this.images = this.props.msg.pics
        }else if(typeof this.props.msg.pics ==='string'){
            if(this.props.msg.pics!=='') this.images = this.props.msg.pics.split(',')
            //alert(JSON.stringify(this.props.msg))
        }
        I18n.locale = NativeModules.RNI18n.locale
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
                    //Net.delMsg(_this.key)
                    //Net.delHash(myjson);
                    //DeviceEventEmitter.emit('refresh:MyList',0);
                    _this.props.navigator.pop();
                }},
            ]
        );
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
                name={'ion-ios-trash-outline'}
                color={'red'}
                size={40}
                onPress={this.onDelete.bind(this) } />
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
    renderModal(){
      let pre = Global.host_image_info+this.props.msg.ctime+'/'
      let images = this.images.map((item)=>{
          return pre+item
      })
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
    renderTitle(){
        //var _ctime = Global.getDateTimeFormat(parseInt(this.props.msg.ctime))
        let typeIcon = 'fa-bell-o'
        return (
            <View style={Style.detail_card} >
                <View style={{flexDirection:'row',marginLeft:20}} >
                    <Icon
                        style={{marginLeft:15,marginRight:15}}
                        size={44}
                        color={'blue'}
                        name={typeIcon}
                    />
                    <View style={{flex:1,marginLeft:20}}>
                        <Text style={{fontWeight:'bold', fontSize:20,}}>{this.props.msg.title}</Text>
                        <Text >{I18n.t('time')} : {this.props.msg.time}</Text>
                        <Text >{I18n.t('host')} : {this.props.msg.host}</Text>
                        <Text >{I18n.t('condition')} : {this.props.msg.condition}</Text>
                    </View>
                </View>
            </View>
       )
    }
    renderMisc(){
        let self=this
        //let array = ['custom','pics','title','time','value','host','condition']
        let array = ['custom','pics','title','time','value','host','condition']
        var keys = Object.keys(this.props.msg)
        var misc = keys.filter((key) => {
            return (array.indexOf(key)<0)
        }).sort()
        //var keys = Object.keys(this.props.msg)
        //alert(JSON.stringify(misc))
        return (
            <View style={Style.detail_card} >
                {misc.map((key)=>{
                    return <Text style={{marginLeft:21}} key={key}><Text style={{fontWeight:'bold'}}>{I18n.t(key)}:  </Text>{this.props.msg[key]}</Text>
                })}
                <Text style={{marginLeft:21}}><Text style={{fontWeight:'bold'}}>{I18n.t('content')}:</Text></Text>
                <Text style={{marginLeft:21}}>{this.props.msg.value}</Text>
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
                      {this.renderTitle()}
                      {this.renderMisc()}
                    </KeyboardAwareScrollView>
		</View>
            </View>
        );
        //{this.renderModal()}
    }
}

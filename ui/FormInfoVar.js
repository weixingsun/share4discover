//'use strict'; //ERROR: Attempted to assign to readonlly property
import React, { Component } from 'react';
import {ActivityIndicator, Alert, DeviceEventEmitter,Picker, PixelRatio, Platform, KeyboardAvoidingView, ScrollView, StyleSheet, Text, TouchableHighlight, TouchableOpacity, View } from 'react-native';
import {Icon,getImageSource} from './Icon'
import { GiftedForm, GiftedFormManager } from 'react-native-gifted-form'
import NavigationBar from 'react-native-navbar';
import KKLocation from 'react-native-baidumap/KKLocation';
import Style from './Style';
import Store from '../io/Store';
import Global from '../io/Global';
import Net from '../io/Net'
import Push from '../io/Push'
//import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view'
//import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scrollview'
import PlaceSearch from './PlaceSearch'
import ImagePicker from 'react-native-image-picker'
import Image from 'react-native-image-progress';
import ProgressBar from 'react-native-progress/Bar';
import * as WeiboAPI from 'react-native-weibo';
import I18n from 'react-native-i18n';
import Attachments from './Attachments';
const Permissions = require('react-native-permissions');
 
export default class FormInfoVar extends Component {
    constructor(props) {
        super(props);
        this.ctime = Math.round(+new Date()/1000)
        //this.permissions=['ACCESS_FINE_LOCATION','CAMERA','WRITE_EXTERNAL_STORAGE']
        this.state={ 
            form:{},
            //grantedPermissions:{},
            pos:{latitude:'',longitude:''},
        };
        this.updatePics=this.updatePics.bind(this)
        this.hidden_fields={}
        this.formName='infoForm'
        this.lasttype=''
        this.lastcat=''
        this.time_format='YYYY-MM-DD HH:mm'
        //this.rent_cats = ['rent0','rent1','service']
        //this.sec_types_no_rent = [
        //    {value:'buy',icon:'ion-ios-log-in'},
        //    {value:'sell',icon:'ion-ios-log-out'},
        //    {value:'service',icon:'ion-ios-planet'}]
        //this.sec_types_all = [
        //    {value:'buy',icon:'ion-ios-log-in'},
        //    {value:'sell',icon:'ion-ios-log-out'},
        //    {value:'rent0',icon:'ion-ios-log-in'},
        //    {value:'rent1',icon:'ion-ios-log-out'},
        //    {value:'service',icon:'ion-ios-planet'}]
        //this.GpsTick=0
        this.validators={}
        this.select_validator={ validator:(...args) => { return (args[0]==='')? false:true; }, message:'{TITLE} is required' }
        this.number_validator={ validator: 'isNumeric', message:'{TITLE} is numeric' }
        this.phone_validator={ validator: 'matches', arguments: /^\d{6,12}$/, message:'{TITLE} is invalid' }
        this.price1_validator={ validator:'contains',arguments:['/'], message:'{TITLE} format like 100/day' }
        this.length_validator=(min,max)=>{ return { validator: 'isLength', arguments:[min,max],  message:'{TITLE} needs {ARGS[0]} and {ARGS[1]} chars' }}
        this.str_validator=(sep)=>{ return { validator:'contains',arguments:[sep], message:'{TITLE} is invalid' }}
        this.time_validator=(day)=>{ return { validator:'indays', arguments: [day, this.time_format], message:'{TITLE} in next {ARGS[0]} days' }}
        //this.no_rent_types = ['ticket','service'];
        this.rent_price_circles = ['year','quarter','month','week','day'];
        this.price_units = ['usd','gbp','eur','cny','cad','aud'];
        this.info_types = {   //type= {txt1,nmbr,txt3,addr,time}
            //common:{
                //title:  {type:'txt1',title:'Title',  validator:this.length_validator(5,55)},
                //address:{type:'addr',title:'Address',validator:this.length_validator(10,255)},
                //phone:  {type:'nmbr',title:'Phone',  validator:this.number_validator},
                //price:  {type:'nmbr',title:'Price',  validator:this.number_validator},
                //content:{type:'txt3',title:'Content',validator:this.length_validator(10,255)},
            //},
            house:{
                rent0:{
                  start:   {type:'time',title:I18n.t('start'), validator:this.time_validator(30), img:'fa-clock-o'},
                  end:     {type:'time',title:I18n.t('end'), validator:this.time_validator(30), img:'fa-clock-o'},
                  bedroom: {type:'nmbr',title:I18n.t('bedroom'), validator:this.number_validator, img:'fa-bed'},
                  bathroom:{type:'nmbr',title:I18n.t('bathroom'),validator:this.number_validator, img:'fa-bath'},
                  garage:  {type:'nmbr',title:I18n.t('garage'),  validator:this.number_validator, img:'fa-car'},
                  area:    {type:'nmbr',title:I18n.t('area'),    validator:this.number_validator, img:'fa-square-o'},
                },
                rent1:{
                  //calendar:  {type:'time',title:I18n.t('time'), validator:this.time_validator(30), img:'fa-clock-o'},
                  bedroom: {type:'nmbr',title:I18n.t('bedroom'), validator:this.number_validator, img:'fa-bed'},
                  bathroom:{type:'nmbr',title:I18n.t('bathroom'),validator:this.number_validator, img:'fa-bath'},
                  garage:  {type:'nmbr',title:I18n.t('garage'),  validator:this.number_validator, img:'fa-car'},
                  area:    {type:'nmbr',title:I18n.t('area'),    validator:this.number_validator, img:'fa-square-o'},
                },
                buy:{
                  bedroom: {type:'nmbr',title:I18n.t('bedroom'), validator:this.number_validator, img:'fa-bed'},
                  bathroom:{type:'nmbr',title:I18n.t('bathroom'),validator:this.number_validator, img:'fa-bath'},
                  garage:  {type:'nmbr',title:I18n.t('garage'),  validator:this.number_validator, img:'fa-car'},
                  area:    {type:'nmbr',title:I18n.t('area'),    validator:this.number_validator, img:'fa-square-o'},
                },
                sell:{
                  bedroom: {type:'nmbr',title:I18n.t('bedroom'), validator:this.number_validator, img:'fa-bed'},
                  bathroom:{type:'nmbr',title:I18n.t('bathroom'),validator:this.number_validator, img:'fa-bath'},
                  garage:  {type:'nmbr',title:I18n.t('garage'),  validator:this.number_validator, img:'fa-car'},
                  area:    {type:'nmbr',title:I18n.t('area'),    validator:this.number_validator, img:'fa-square-o'},
                },
                service:{
                  bedroom: {type:'nmbr',title:I18n.t('bedroom'), validator:this.number_validator, img:'fa-bed'},
                  bathroom:{type:'nmbr',title:I18n.t('bathroom'),validator:this.number_validator, img:'fa-bath'},
                  garage:  {type:'nmbr',title:I18n.t('garage'),  validator:this.number_validator, img:'fa-car'},
                  area:    {type:'nmbr',title:I18n.t('area'),    validator:this.number_validator, img:'fa-square-o'},
                },
            },
            car:{
                rent0:{
                  start: {type:'time',title:I18n.t('start'), validator:this.time_validator(30), img:'fa-clock-o'},
                  end:   {type:'time',title:I18n.t('end'), validator:this.time_validator(30), img:'fa-clock-o'},
                  dest:  {type:'addr',title:I18n.t('dest'), validator:this.str_validator(','), img:'fa-flag'},
                },
                rent1:{
                  //calendar:  {type:'time',title:I18n.t('time'), validator:this.time_validator(30), img:'fa-clock-o'},
                },
                buy:{},
                sell:{},
                service:{},
            },
            tool:{
            },
            game:{
            },
            phone:{
            },
            computer:{
            },
            camera:{
            },
            ticket:{
                time:  {type:'time',title:I18n.t('time'), validator:this.time_validator(30), img:'fa-clock-o'},
            },
            media:{},
            medkit:{},
            service:{},
        }
    }
    componentWillMount(){
        this.initKeys();
        this.permission();
        this.initAllValidators()
        this.processProps();
        //this.turnOnGps()
        this.getMyLocation()
    }
    componentDidMount(){
        DeviceEventEmitter.removeAllListeners('refresh:FormInfoVar')
        this.evt = DeviceEventEmitter.addListener('refresh:FormInfoVar',(data)=>this.updatePics(data));
    }
    componentWillUnMount(){
        this.turnOffGps()
        this.evt.remove()
        DeviceEventEmitter.removeAllListeners('refresh:FormInfoVar')
        //DeviceEventEmitter.removeListener('refresh:FormInfoVar',(data)=>this.updatePics(data));
    }
    getMyLocation(){
        let self=this
        Net.getLocation((gps)=>{
            self.city=gps.city
            self.city_id=gps.city_id
            self.country=gps.country
        })
    }
    updatePics(pics){
        //alert('updatePics()'+JSON.stringify(pics))
        this.setState({form:{ ...this.state.form, pics:pics }})
    }
    initAllValidators(){
        //I18n.t('type')
        this.validators={}
        this.genValidator('type',     this.select_validator)
        this.genValidator('cat',      this.select_validator)
        this.genValidator('title',    this.length_validator(5,55))
        this.genValidator('content',  this.length_validator(10,255))
        this.genValidator('address',  this.length_validator(10,255))
        this.genValidator('phone',    this.phone_validator)
        this.genValidator('price',    this.price1_validator)
        //this.genValidator('price',  this.number_validator)
    }
    genValidator(name,validateJson){
        this.validators[name] = {title:I18n.t(name), validate:[validateJson]}
    }
    genTypeValidators(type,cat){
        let self=this
        let fields = this.info_types[type]
        if(fields[cat]) fields=fields[cat]
        let keys = Object.keys(fields)
        keys.map((key)=>{
            let obj = fields[key]
            this.genValidator(key,obj.validator)
        })
        //this.setState({validators:this.validators})
    }
    changePriceValidator(){
        if(this.lastcat!==''){
            if(Global.rent_cats.indexOf(this.lastcat)>-1){
                this.genValidator('price', this.price1_validator)
            }else{
                this.genValidator('price', this.number_validator)
            }
        }
    }
    changeValidator(){
      if(this.lasttype !== ''&&this.lastcat !== ''){
        this.initAllValidators()
        this.genTypeValidators(this.lasttype,this.lastcat)
        this.changePriceValidator()
        GiftedFormManager.stores[this.formName].validators = {};
        for (var key in this.validators) {
            let value = this.validators[key]
            //if(key==='price') alert('lastcat='+this.lastcat+'form.cat='+this.state.form.cat+' price validator '+JSON.stringify(value))
            GiftedFormManager.setValidators(this.formName, key, {title:I18n.t(key),validate:value.validate});
        }
      }
    }
    processProps(){
        let logins = Global.getLoginStr()
        GiftedFormManager.reset(this.formName);
        if(!this.props.msg){
            var myDefaults = {
              type: 'car', cat: 'rent0',
              title: '',     content: '', 
              address: '',   price: '',
              phone: '',     ctime: this.ctime,
              lat:   '',     lng:   '',
              //time:  '',     dest:  '',
              pics:  [],     owner: logins,
            };
            this.setState({form:myDefaults})
            this.genTypeValidators('car','rent0')
        }else{
            //alert(JSON.stringify(this.props.msg))
            let myDefaults=this.props.msg;
            let {type,cat,ctime,pics}=myDefaults;
            //alert('type='+type+' cat='+cat)
            if(typeof pics === 'string') myDefaults['pics']=pics.split(',')
            this.ctime=parseInt(ctime)
            this.setState({ form: myDefaults })
            this.genTypeValidators(type,cat)
            this.lastcat=cat
            this.changePriceValidator()
        }
    }
    /*singlePermission(name){
        requestPermission('android.permission.'+name).then((result) => {
          let perm = this.state.grantedPermissions;
          perm[name] = true
          this.setState({grantedPermissions:perm})
        }, (result) => {
          //alert('Please grant location permission in settings')
        });
    }*/
    permission(){
        /*if(Platform.OS === 'android' && Platform.Version > 22){
            this.permissions.map((perm)=>{
                this.singlePermission(perm)
            })
        }*/
        Permissions.checkMultiplePermissions(Object.keys(Global.permissions))
          .then(response => {
            //if(response.camera) this.permissions['camera']=response.camera
            //if(response.photo)  this.permissions['photo']=response.photo
            if(response.location==='authorized'){
              Global.permissions['location']=response.location
              this.turnOnGps()
            }else{
              Permissions.requestPermission('location').then(resp=>{
                if(resp==='authorized') this.turnOnGps()
              })
            }
          });
    }
    initKeys(){
        this.mcode = Global.ios_mcode;
        this.ak = Global.ios_ak;
        if (Platform.OS === 'android') {
            this.ak=Global.and_ak
            this.mcode=(__DEV__) ? Global.dev_and_mcode : Global.rel_and_mcode
        }
        this.ggkey=Global.ggkey
    }
    deleteEmptyFields(obj){
        Object.keys(obj).forEach((key) =>
          (obj[key] === undefined || obj[key] === null || obj[key] === '') && delete obj[key]);
    }
    fixFormData(values){
        if(values.owner == null) {
          alert('Please login first, go to settings')
          return
        }
        if(values.hasOwnProperty('cat') && typeof values.cat ==='object')  values.cat = values.cat[0]
        values.cat=values.cat.toLowerCase()
        if(values.hasOwnProperty('type') && typeof values.type ==='object')  values.type = values.type[0]
        values.type=values.type.toLowerCase()
        if(values.hasOwnProperty('pics') && typeof values.pics ==='object')  values.pics = values.pics.join(',')
        //if(values.hasOwnProperty('ask')) delete values.ask
        values.lat = parseFloat(values.lat).toFixed(6)
        values.lng = parseFloat(values.lng).toFixed(6)
        //if(values.hasOwnProperty('pics') && values.pics.length===0) delete values.pics
        values.country=this.country
        values.city=this.city
        values.city_id=this.city_id
        this.merge_into(values,this.hidden_fields)
        if(Push.uid) values['uid']=Push.uid
        if(Platform.OS==='ios'){ 
          if (__DEV__) values['os']='idev' 
          else values['os']='ios' 
        }
    }
    merge_into(obj,obj_to_merge){
        for (var key in obj_to_merge) { obj[key] = obj_to_merge[key]; }
    }
    onSubmit(values) {
        var self = this;
        let latlng = {latitude:values.lat, longitude:values.lng}
        //if(this.checkTooFarAway(latlng)<0) return
        self.deleteEmptyFields(values)
        self.fixFormData(values);
        //alert('form:'+JSON.stringify(values));
        Alert.alert(
            "Publish",
            "Do you want to publish this form ? ",
            [
              {text:"Cancel" },
              {text:"OK", onPress:()=>{
                  self.fixFormData(values);
                  Net.setMsg(values).then((ret)=> {
                    let alertmsg = ''
                    //console.log('Net.setMsg() ret='+JSON.stringify(ret))
                    if(ret==null){
                        //alert("Edit but no Response, please confirm your update is made correctly")
                        self.exitUpdatePages()
                    }else{
                      let newkey = Global.getKeyFromMsg(ret)
                      if(ret.phone == values.phone){
                          if(this.props.msg!=null){ //edit
                              let oldkey = Global.getKeyFromMsg(this.props.msg)
                              if( oldkey !== newkey ){
                                //self.changeReply( oldkey, newkey )
                                self.deleteMsg(oldkey)
                                var my_value={key:'*'+Global.mainlogin,field:newkey,value:'owner|open'}
                                Net.putHash(my_value);
                                alertmsg = 'Changed successfully'
                              }else{
                                alertmsg = 'Edit successfully'
                              }
                          }else{
                              self.pushToTags(values);
                              let sns_ret = self.postSNS(values);
                              alertmsg = 'Create successfully' +sns_ret
                              var my_value={key:'*'+Global.mainlogin,field:newkey,value:'owner|open'}
                              Net.putHash(my_value);
                          }
                          alert(alertmsg);
                          self.exitUpdatePages()
                      }else{
                          alert('Error:'+ret)
                      }
                    }
                  })
              }},
            ]
        )
    }
    exitUpdatePages(){
        DeviceEventEmitter.emit('refresh:Maps',0);
        DeviceEventEmitter.emit('refresh:MyList',0);
        this.props.navigator.pop();
        this.back()
    }
    pushToTags(msg){
        //{'listen:car_sell','listen:car_rent0'},'AND','tags_title','click to view more',{t:'r',i:'car_sell:lat,lng:ctime',f:Push.uid,r:now}
        let name = Global.getMainLoginName()
        let key  = Global.getKeyFromMsg(msg)
        Push.postTags(
            Global.getTagNameFromJson(msg),  //'l_'+msg.country+'_'+msg.city_id+'_'+msg.district+'_'+msg.type+'_'+msg.cat
            msg.title,
            I18n.t('click_more'),
            {t:Global.push_tag,i:key,f:Push.uid,n:name},
            msg.os
        )
        Push.postTagMsg(
            Global.getLocalTagNameFromJson(msg),  //'l_'+msg.country+'_'+msg.city_id
            msg.title,
            {t:Global.push_local,i:key,f:Push.uid,n:name},
            msg.os
        )
    }
    postSNS(json){
        let ret = ''
        if(Global.SETTINGS_LOGINS.fb!=Global.none){ 
            this.postFB(json); 
            ret+=',facebook'
        }
        if(Global.SETTINGS_LOGINS.wb!=Global.none){
            this.postWB(json);
            ret+=',weibo'
        }
        //if(ret.indexOf(',') > -1)
        if(ret.startsWith(',')){
            ret=ret.substring(1)
        }
        return ret
    }
    postFB(json){ //working
        let key = Global.getKeyFromMsg(json)
        let url = Global.getSnsUrl(key,'fb')
        let {AccessToken,ShareApi} = require('react-native-fbsdk')
        let data={contentType:'link',contentUrl:url,contentDescription:'See more in App'}
        ShareApi.canShare(data).then( (canShare)=>{
            if (canShare) {
              return ShareApi.share(data, '/me', json.title);
            }
          }
        ).then(
          function(result) {
            //alert('Share with ShareApi success.');
          },
          function(error) {
            alert('Post on Facebook failed with error: ' + error);
          }
        )
    }
    postWB(json){  //scope:'all',redirectURI:'http://www.weibo.com',appid:'964503517'
        let key = Global.getKeyFromMsg(json)
        let url = Global.getSnsUrl(key,'wb')
        let data = {scope:'all',redirectURI:'http://www.weibo.com',appid:'964503517',accessToken:Global.userObjects.wb.token,type:'text',text:json.title+'\n'+url}
        //let data = {type:'text', text:json.title, accessToken:Global.userObjects.wb.token}
        WeiboAPI.share(data).then((result)=>{
          //alert('data:'+result)
        }).catch((err)=>{
            alert('Post on Weibo failed with error: ' + err);
        }).done();
        //alert('weibo.share: '+JSON.stringify(data))
    }
    deleteMsg(key){
        Net.delMsg(key)
        let myjson = {key:'*'+Global.mainlogin,field:key}
        Net.delHash(myjson);
    }
    changeReply(old_key,new_key){
        if(old_key != new_key){
            Net.delMsg(Global.getKeyFromMsg(this.props.msg))
            let logins = Global.getLogins(this.props.msg.owner)
            let mainlogin = Global.getInfoMainLogin(logins);
            Net.getNotify(mainlogin).then((rows)=> {
              //alert('all notifies='+JSON.stringify(rows))
              if(rows && rows.length>0)
              Object.keys(rows).map((field)=>{
                let key_arr = field.split('#')
                if(old_key==key_arr[0]){
                    let json = {key:'#'+mainlogin, oldfield:old_key+'#'+key_arr[1], newfield:new_key+'#'+key_arr[1]}
                    //alert('json='+JSON.stringify(json))
                    Net.renameHashKey(json)
                }
              })
            });
        }
    }
    turnOffGps(){
        if(this.watchID==null){
            return
        }
        //alert('closing gps:'+this.watchID)
        if(Global.MAP===Global.GoogleMap)
            navigator.geolocation.clearWatch(this.watchID);
        else
            KKLocation.clearWatch(this.watchID)
    }
    turnOnGps(){
      let self=this
      if(Global.MAP===Global.GoogleMap){
        this.watchID = navigator.geolocation.watchPosition((position) => {
        //navigator.geolocation.getCurrentPosition((position) => {
            //{timestamp,{coords:{speed,heading,accuracy,longitude,latitude,altitude}}}
            self.setState({ pos:position.coords })
            self.turnOffGps()
            //self.sendDataToUsbSerialDevice(JSON.stringify(self.pos));
          },
          (error) => {
              console.log(error.message)
              alert('gps err:'+error.message)
          },
          {enableHighAccuracy: false, timeout: 10000, maximumAge: 1000, distanceFilter:100},
        );
      }else if(Global.MAP===Global.BaiduMap){
        this.watchID = KKLocation.watchPosition((position) => {
            //{timestamp,{coords:{heading,accuracy,longitude,latitude}}}  //no speed,altitude
            self.setState({ pos:position.coords })
            self.turnOffGps()
            //self.sendDataToUsbSerialDevice(JSON.stringify(self.pos));
        });
      }
      //this.setState({gps:true});
    }
    checkTooFarAway(position){
        let maxDelta = 0.3
        if(!this.state.pos) {
            alert('Getting your location...')
            return -1
        }
        let latDiff = Math.abs(position.latitude-this.state.pos.latitude)
        let lngDiff = Math.abs(position.longitude-this.state.pos.longitude)
        if(latDiff>maxDelta || lngDiff>maxDelta){
            alert('You are creating a remote event, which is only 1/day')
            return 1
        }else return 0
    }
    showActionIcons(){
        //<Icon name={'fa-weibo'} size={40} color={'red'} onPress={()=>this.postWB({type:'text',title:'this is a test'}) } />
        let size = this.state.form.pics?this.state.form.pics.length:''
        if(size===0) size=''
        if(size===1&&this.state.form.pics[0]==='') size=''
        return (
            <TouchableOpacity style={{width:50,height:50}} onPress={
                    ()=>this.props.navigator.push({
                        component: Attachments,
                        passProps: {
                          pics:this.state.form.pics,
                          ctime:this.ctime,
                          navigator:this.props.navigator
                        } })
            }>
                <Icon name={'ion-ios-attach'} size={40} color={Style.font_colors.enabled} badge={{text:size, color:'red'}} />
            </TouchableOpacity>
        )
    }
    handleValueChange(values) {
        //if( typeof values.type==='string'&&values.type && values.lat && values.lng && values.ctime ){
        //  this.key = values.type+':'+values.lat+','+values.lng+':'+values.ctime
        //}
        if(typeof values.type === 'object'){ // && values.type[0]!==this.lasttype) 
            if(values.type[0]!==this.lasttype){
                this.lasttype=values.type[0]
                //alert('change type:'+this.lasttype)
                this.setState({form:{...this.state.form,type:this.lasttype}})
                this.changeValidator()
                //GiftedFormManager.updateValue(this.formName, 'type', this.lasttype)
            }
        }
        if(typeof values.cat === 'object'){
            if(values.cat[0]!==this.lastcat){
                this.lastcat=values.cat[0]
                this.lasttype=this.state.form.type
                //alert('type='+this.lasttype+' cat='+this.lastcat)
                this.setState({form:{...this.state.form,cat:this.lastcat}})
                this.changeValidator()
                if(values.price)this.setState({validationResults:GiftedFormManager.validate(this.formName)});
            }
        }
        if (this.state.validationResults!=null) {
            //alert(JSON.stringify(this.state.form.dest))
            //this.setState({validationResults:GiftedFormManager.validate(this.formName)});
        }
    }
    renderTypeOptions(){
        let arr = Object.keys(Global.TYPE_ICONS)
        return arr.map((key,i)=>{
            return <GiftedForm.OptionWidget 
                       key={i} 
                       title={I18n.t(key)} 
                       value={key} 
                       image={(
                           <View style={{width:80,alignItems:'center'}}>
                               <Icon name={Global.TYPE_ICONS[key]} size={40} />
                           </View>
                       )} />
        })
    }
    back(){
      this.turnOffGps()
      this.props.navigator.pop();
    }
    renderAddrField(name,title,validator,img=null){
        let imgView = img==null?null:<View style={{marginLeft:8,width:20,alignItems:'center'}}><Icon name={img} size={18} /></View>
        return (
            <GiftedForm.PlaceSearchWidget
                key={name+'_addr'}
                name={name}
                title={title}
                placeholder={I18n.t('enter')+title}
                clearButtonMode='while-editing'
                displayValue={name}
                value={this.state.form[name]}
                validationResults={this.state.validationResults}
                image={imgView}
                map={Global.MAP}
                query={{
                    ak:this.ak,mcode:this.mcode,
                    //gdkey:gdkey,
                    key:this.ggkey,
                    location:this.state.pos.latitude+','+this.state.pos.longitude,
                    radius:1500,
                    //components:{country:'NZ'},
                }}
                onClose={ (loc)=> {
                    this.hidden_fields[name+'_lat']=loc.lat
                    this.hidden_fields[name+'_lng']=loc.lng
                }}
            />)
    }
    renderTimeField(name,title,validator,img=null){
        let imgView = img==null?null:<View style={{marginLeft:8,width:20,alignItems:'center'}}><Icon name={img} size={18} /></View>
        return (
            <GiftedForm.DatePickerIOSWidget
                key={name}
                name={name}
                title={title}
                displayValue={name}
                image={imgView}
                //underlined={true}
                mode='datetime'
                value={this.state.form[name]}
                getDefaultDate={() => {return this.state.form[name]}}
                validationResults={this.state.validationResults}
            />
        )
    }
    /*renderSelectOptions(list){
        return list.map((key,i)=>{
            return <GiftedForm.OptionWidget
                       key={i}
                       title={I18n.t(key)}
                       value={key}
                   />
        })
    }
    renderSelectField(name,optlist,validator,img=null){
        //this.genValidator(name, this.select_validator)
        let imgView = img==null?null:<View style={{width:30,alignItems:'center'}}><Icon name={img} size={25} /></View>
        let title=I18n.t(name)
        let display = this.state.form[name]?I18n.t(this.state.form[name]):''
        return (
            <GiftedForm.ModalWidget
                title={title}
                name={name}
                display={display}
                value={this.state.form[name]}
                image={imgView}
            >
                <GiftedForm.SeparatorWidget />
                <GiftedForm.SelectWidget name={name} title={title} multiple={false}>
                    {this.renderSelectOptions(optlist)}
                </GiftedForm.SelectWidget>
            </GiftedForm.ModalWidget>
        )
    }*/
    renderTextField(name,title,validator,img=null){
        let imgView = img==null?null:<View style={{marginLeft:8,width:20,alignItems:'center'}}><Icon name={img} size={18} /></View>
        return (
            <GiftedForm.TextInputWidget
                key={name}
                name={name}
                title={title}
                image={imgView}
                placeholder={I18n.t('enter')+title}
                clearButtonMode='while-editing'
                displayValue={name}
                value={this.state.form[name]}
                validationResults={this.state.validationResults}
            />)
    }
    renderField(type,name,title,validator,img){  //type= {txt1,nmbr,txt3,addr,time}
        if(type==='txt1'||type==='nmbr') return this.renderTextField(name,title,validator,img)
        else if(type==='addr') return this.renderAddrField(name,title,validator,img)
        else if(type==='txt3') return null
        else if(type==='time') return this.renderTimeField(name,title,validator,img)
    }
    renderOptionalFields(json){
        let keys = Object.keys(json)
        //alert('renderOptionalFields '+JSON.stringify(keys))
        return keys.map((key)=>{
            let obj = json[key]
            return this.renderField(obj.type,key,obj.title,obj.validator,obj.img)
        })
    }
    renderSecondTypeOptionList(){
        let no_rent = Global.no_rent_types.indexOf(this.state.form.type)>-1?true:false
        let cats = no_rent?Global.sec_types_no_rent:Global.sec_types_all
        return cats.map((key,id)=>{
            return <GiftedForm.OptionWidget
                    key={id} 
                    title={I18n.t(key.value)} 
                    value={key.value}
                    image={(
                         <View style={{width:80,alignItems:'center'}}>
                             <Icon name={key.icon} size={30} />
                         </View>
                    )} />
        })
    }
    render(){
        let h = Style.DEVICE_HEIGHT-Style.NAVBAR_HEIGHT-40
        //let form_height = (this.state.form.pics && this.state.form.pics.length>0)? h-Style.THUMB_HEIGHT : h
        if(this.props.msg!=null) title_nav = I18n.t('edit_share')
        else title_nav = I18n.t('create_share')
        let fields = this.info_types[this.state.form.type]
        if(fields[this.state.form.cat]) fields=fields[this.state.form.cat]
        //console.log('form.render() type='+this.state.type+' cat='+this.state.cat+' fields = '+JSON.stringify(fields))
        return (
            <View style={{backgroundColor: '#eeeeee'}}>
                <NavigationBar style={Style.navbar} title={{title:title_nav, tintColor:Style.font_colors.enabled}}
                   leftButton={
                     <TouchableOpacity style={{width:50,height:50}} onPress={() => this.back()}>
                       <Icon 
                           name={"ion-ios-arrow-round-back"} 
                           color={Style.font_colors.enabled} size={46} />
                     </TouchableOpacity>
                   }
                   rightButton={ this.showActionIcons() }
                />
                  <ScrollView>
                  <KeyboardAvoidingView behavior='position' style={{flex:1,}}>
                  <GiftedForm
                    formName={this.formName}
                    style={{flex:1,}} //marginLeft:2,marginRight:2}}  //height:form_height
                    openModal={(route) => { route.giftedForm = true; this.props.navigator.push(route) }}
                    onValueChange={this.handleValueChange.bind(this)}
                    validators={ this.validators }
                    defaults={this.state.form}
                    >
                        <GiftedForm.ModalWidget
                            title={I18n.t('cat')}
                            name='type'
                            display={I18n.t(this.state.form.type)}
                            value={this.state.form.type}
                            image={<View style={{width:30,alignItems:'center'}}><Icon name={Global.TYPE_ICONS[this.state.form.type]} size={30} /></View>}
                        >
                            <GiftedForm.SeparatorWidget />
                            <GiftedForm.SelectWidget name='type' title='Category' multiple={false} onSelect={()=>this.props.navigator.pop()}>
                                {this.renderTypeOptions()}
                            </GiftedForm.SelectWidget>
                        </GiftedForm.ModalWidget>
                        <GiftedForm.ModalWidget
                            title={I18n.t('type')}
                            name='cat'
                            display={this.state.form.cat===''?'':I18n.t(this.state.form.cat)}
                            value={this.state.form.cat}
                            image={<View style={{width:30,alignItems:'center'}}><Icon name={'ion-ios-list'} size={30} /></View>}
                            validationResults={this.state.validationResults}
                        >
                            <GiftedForm.SeparatorWidget />
                            <GiftedForm.SelectWidget name='cat' title='Type' multiple={false} onSelect={()=>this.props.navigator.pop()}>
                                {this.renderSecondTypeOptionList()}
                            </GiftedForm.SelectWidget>
                        </GiftedForm.ModalWidget>
                        {this.renderTextField('title',I18n.t('title'), this.length_validator(5,55),'fa-header')}
                        {this.renderTextField('phone',I18n.t('phone'), this.number_validator,'fa-phone')}
                        {this.renderTextField('price',I18n.t('price'), this.price_validator,'fa-usd')}
                        {this.renderOptionalFields(fields)}
                        <GiftedForm.PlaceSearchWidget
                            name='address'
                            title={I18n.t('address')}
                            //placeholder='Enter address'
                            clearButtonMode='while-editing'
                            displayValue='address'
                            value={this.state.form.address}
                            image={<View style={{marginLeft:8,width:20,alignItems:'center'}}><Icon name={'fa-location-arrow'} size={18} /></View>}
                            validationResults={this.state.validationResults}
                            map={Global.MAP}
                            query={{
                                ak:this.ak,mcode:this.mcode,
                                //gdkey:gdkey,
                                key:this.ggkey,
                                location:this.state.pos.latitude+','+this.state.pos.longitude,
                                radius:1500,
                                //components:{country:'NZ'},
                            }}
                            onClose={ (loc)=> {
                                this.setState({form:{ ...this.state.form, lat:loc.lat, lng:loc.lng }})} 
                            }
                        />
                        <GiftedForm.ModalWidget
                            name='content'
                            title={I18n.t('content')}
                            display={this.state.form.content}
                            //scrollEnabled={true}
                            image={<View style={{marginLeft:8,width:20,alignItems:'center'}}><Icon name={'fa-file-text-o'} size={18} /></View>}
                            value={this.state.form.content}
                            validationResults={this.state.validationResults}
                            //displayValue='content'
                        >
                            <GiftedForm.SeparatorWidget/>
                            <GiftedForm.TextAreaWidget name='content' title='Content'
                                autoFocus={true}
                                placeholder='Detail information'
                                //value={this.state.form.content}
                                //style={{flex:1}}
                            />
                        </GiftedForm.ModalWidget>
                        <GiftedForm.HiddenWidget name='lat' displayValue='lat' value={this.state.form.lat} />
                        <GiftedForm.HiddenWidget name='lng' displayValue='lng' value={this.state.form.lng} />
                        <GiftedForm.HiddenWidget name='owner' displayValue='owner' value={this.state.form.owner} />
                        <GiftedForm.HiddenWidget name='ctime' displayValue='ctime' value={this.state.form.ctime} />
                        <GiftedForm.HiddenWidget name='pics' displayValue='pics' value={this.state.form.pics} />
                        <GiftedForm.SubmitWidget
                            title={I18n.t('publish')}
                            widgetStyles={{
                                submitButton: {
                                    backgroundColor: Style.highlight_color,
                                }
                            }}
                            onSubmit={(isValid, values, validationResults, postSubmit = null, modalNavigator = null) => {
                                //alert('validators='+JSON.stringify(this.validators))
                                this.setState({ validationResults:validationResults.results })
                                if (isValid === true) {
                                  this.onSubmit(values)
                                  postSubmit();
                                }else{
                                  //alert(JSON.stringify(values))
                                }
                            }}
                        />
                </GiftedForm>
                </KeyboardAvoidingView>
                </ScrollView>
            </View>
        );
        //<GiftedForm.ErrorsWidget/>
    }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF'
  },
  avatarContainer: {
    borderColor: '#9B9B9B',
    borderWidth: 1 / PixelRatio.get(),
    justifyContent: 'center',
    alignItems: 'center'
  },
  avatar: {
    borderRadius: 75,
    width: 150,
    height: 150
  },
  progress: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    //flexDirection: 'row',
    //width: 100
  },
});

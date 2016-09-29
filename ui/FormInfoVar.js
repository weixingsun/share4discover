//'use strict'; //ERROR: Attempted to assign to readonlly property
import React, { Component } from 'react';
import {ActivityIndicator, Alert, Picker, PixelRatio, Platform, KeyboardAvoidingView, ScrollView, StyleSheet, Text, TouchableHighlight, View } from 'react-native';
import {Icon,getImageSource} from './Icon'
import { GiftedForm, GiftedFormManager } from 'react-native-gifted-form'
import NavigationBar from 'react-native-navbar';
import KKLocation from 'react-native-baidumap/KKLocation';
import Style from './Style';
import Store from '../io/Store';
import Global from '../io/Global';
import Net from '../io/Net'
import Immutable from 'immutable'
//import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view'
//import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scrollview'
import PlaceSearch from './PlaceSearch'
import ImagePicker from 'react-native-image-picker'
import Image from 'react-native-image-progress';
//import Progress from 'react-native-progress';
import ProgressBar from 'react-native-progress/Bar';
import * as WeiboAPI from 'react-native-weibo';
import {checkPermission,requestPermission} from 'react-native-android-permissions';
 
export default class FormInfo extends Component {
    constructor(props) {
        super(props);
        this.ctime = +new Date();
        this.permissions=['ACCESS_FINE_LOCATION','CAMERA','WRITE_EXTERNAL_STORAGE']
        this.state={ 
            uploading:[],
            form:{},
            grantedPermissions:{},
            type:'house',
            //validators:{},
        };
        this.validators={}
        this.select_validator={ validator:(...args) => { return (args[0]==='')? false:true; }, message:'{TITLE} is required' }
        this.number_validator={ validator: 'isNumeric', message:'{TITLE} is numeric' }
        this.time_validator={ validator: 'isNumeric', message:'{TITLE} is numeric' }
        this.info_types = {   //type= {txt1,nmbr,txt3,addr,time}
            house:{
                //title:  {type:'txt1',title:'Title',validator:this.length_validator(5,55)},
                //address:{type:'addr',title:'Address',validator:this.length_validator(10,255)},
                //phone:  {type:'nmbr',title:'Phone',validator:this.number_validator},
                //price:  {type:'nmbr',title:'Price',validator:this.number_validator},
                bedroom: {type:'nmbr',title:'Bedroom',validator:this.number_validator},
                bathroom:{type:'nmbr',title:'Bathroom',validator:this.number_validator},
                //content: {type:'txt3',title:'Content',validator:this.length_validator(10,255)},
            },
            car:{
                //title:  {type:'txt1',title:'Title',validator:this.length_validator(5,55)},
                //address:{type:'addr',title:'Address',validator:this.length_validator(10,255)},
                //phone:  {type:'nmbr',title:'Phone',validator:this.number_validator},
                //price:  {type:'nmbr',title:'Price',validator:this.number_validator},
                target :{type:'addr',title:'Target',validator:this.length_validator(10,255)},
                time:   {type:'time',title:'Time',validator:this.time_validator},
                //content:{type:'txt3',title:'Content',validator:this.length_validator(10,255)},
            },
        }
    }
    length_validator(min,max){
        return { validator: 'isLength', arguments:[min,max],  message:'{TITLE} needs {ARGS[0]} and {ARGS[1]} chars' }
    }
    componentWillMount(){
        this.initKeys();
        this.permission();
        this.initAllValidators()
        this.processProps();
        getImageSource('ion-ios-close', 40, 'white').then((source) => {  //for deleting image in slides
            this.setState({close_image:source})
        });
        this.turnOnGps()
    }
    componentWillUnMount(){
        this.turnOffGps()
    }
    initAllValidators(){
        this.validators={}
        this.genValidator('type',  'Type',     this.select_validator)
        this.genValidator('cat',   'Category', this.select_validator)
        this.genValidator('ask',   'Ask/Offer',this.select_validator)
        this.genValidator('title', 'Title',    this.length_validator(5,55))
        this.genValidator('content','Content', this.length_validator(10,255))
        this.genValidator('address','Address', this.length_validator(10,255))
        this.genValidator('phone', 'Phone',    this.number_validator)
        this.genValidator('price', 'Price',    this.number_validator)
    }
    genValidator(name,titleStr,validateJson){
        //alert('genValidator:'+name+' title:'+titleStr)
        this.validators[name] = {title:titleStr, validate:[validateJson]}
    }
    genTypeValidators(type){
        let self=this
        let keys = Object.keys(this.info_types[type])
        keys.map((key)=>{
            let obj = this.info_types[type][key]
            this.genValidator(key,obj.title,obj.validator)
        })
        //this.setState({validators:this.validators})
        /*for (var i=0;i<keys.length;i++){
            let key = keys[i]
            let obj = this.info_types[type][key]
            alert('add validator for type:'+type+' name='+key+' title='+obj)
            this.genValidator(key,obj.title,obj.validator)
        }*/
    }
    changeValidator(type){
        this.initAllValidators()
        this.genTypeValidators(type)
        GiftedFormManager.stores['newInfoForm'].validators = {};
        for (var key in this.validators) {
            //alert('key='+key+' value='+this.validators[key])
            //if (nextProps.validators.hasOwnProperty(key)) {}
            let value = this.validators[key]
            GiftedFormManager.setValidators('newInfoForm', key, {title:value.title,validate:value.validate});
        }
    }
    processProps(){
        let logins = Global.getLoginStr()
        GiftedFormManager.reset('newInfoForm');
        if(!this.props.msg){
            var myDefaults = {
              type: 'house', typeTitle: 'House',
              ask: '', cat: '',
              title: '',     content: '', address: '',
              phone: '',     ctime: this.ctime, time:  '',
              lat:   '',     lng:   '',  price: '',
              dest:  '',     pics:  [], owner: logins,
            };
            this.setState({type:'house', form:myDefaults})
            this.genTypeValidators('house')
        }else{
            var myDefaults=this.props.msg;
            //var typekey = 'type{'+this.props.msg.type+'}';
            //myDefaults[typekey] = true;
            //var askkey  = 'ask{' +this.props.msg.ask+'}';
            //myDefaults[askkey]  = true;
            myDefaults['typeTitle'] = this.capitalizeFirstLetter(this.props.msg.type)
            myDefaults['askTitle'] = (this.props.msg.ask==='true')?'Ask':'Offer'
            myDefaults['catTitle'] = this.capitalizeFirstLetter(this.props.msg.cat)
            //myDefaults['owner_name'] = Global.getMainLoginName()
            //myDefaults['ask'] = [this.props.msg.ask]
            if(typeof this.props.msg.pics === 'string') myDefaults['pics']=this.props.msg.pics.split(',')
            this.ctime=parseInt(this.props.msg.ctime)
            this.setState({ type:this.props.msg.type, form: myDefaults })
            this.genTypeValidators(this.props.msg.type)
        }
    }
    singlePermission(name){
        requestPermission('android.permission.'+name).then((result) => {
          //console.log(name+" Granted!", result);
          let perm = this.state.grantedPermissions;
          perm[name] = true
          this.setState({grantedPermissions:perm})
        }, (result) => {
          //alert('Please grant location permission in settings')
        });
    }
    permission(){
        if(Platform.OS === 'android' && Platform.Version > 22){
            this.permissions.map((perm)=>{
                this.singlePermission(perm)
            })
        }
    }
    initKeys(){
        this.map=Global.MAP
        this.mcode = 'com.share.2016';    //ios mcode
        this.ak = 'Cyq8AKxGeAVNZSzV0Dk74dGpRsImpIHu';    //ios ak
        var rel_and_mcode = 'F9:F3:46:15:55:59:22:6A:FB:75:92:FF:23:B4:75:AF:20:E7:22:D6;com.share'
        var dev_and_mcode = '81:1E:3F:40:F6:F6:4F:68:D7:6E:79:BC:18:CA:AC:26:84:14:1C:F7;com.share'
        var demo_mcode = 'DA:4C:B6:A9:55:62:1D:AD:12:29:DD:7B:69:31:67:47:C5:B2:4E:E1;szj.com.ditu'
        if (Platform.OS === 'android') {
            this.ak='6MbvSM9MLCPIOYK4I05Ox0FGoggM5d9L';    //android ak
            //ak='VRMNc7QoiSM5ar5at5g3lRQD';          //android demo ak
            this.mcode=(__DEV__) ? dev_and_mcode : rel_and_mcode
        }
        this.ggkey='AIzaSyApl-_heZUCRD6bJ5TltYPn4gcSCy1LY3A'
    }
    fixFormData(values){
        if(values.owner == null) {
          alert('Please login first, go to settings')
          return
        }
        if(values.hasOwnProperty('ask')  && typeof values.ask ==='object')   values.ask = values.ask[0]
        if(values.ask === 'Ask' || values.ask === 'true')  values.ask = true
        else values.ask = false
        if(values.hasOwnProperty('cat') && typeof values.cat ==='object')  values.cat = values.cat[0]
        values.cat=values.cat.toLowerCase()
        if(values.hasOwnProperty('type') && typeof values.type ==='object')  values.type = values.type[0]
        values.type=values.type.toLowerCase()
        if(values.hasOwnProperty('pics') && typeof values.pics ==='object')  values.pics = values.pics.join(',')
        if(values.hasOwnProperty('askTitle')) delete values.askTitle
        if(values.hasOwnProperty('typeTitle')) delete values.typeTitle
        //if(values.hasOwnProperty('contentTitle')) delete values.contentTitle
        //if(values.hasOwnProperty('dest') && values.dest.length===0) delete values.dest
        //if(values.hasOwnProperty('pics') && values.pics.length===0) delete values.pics
        values.lat = parseFloat(values.lat).toFixed(6)
        values.lng = parseFloat(values.lng).toFixed(6)
        //alert(JSON.stringify(values))
    }
    onSubmit(values) {
        var self = this;
        let latlng = {latitude:values.lat, longitude:values.lng}
        if(this.checkTooFarAway(latlng)){
            alert('Your location is too far away')
            return
        }
        //values.birthday = moment(values.birthday).format('YYYY-MM-DD');
        /* postSubmit(['An error occurred, please try again']); // disable the loader and display an error message
        ** postSubmit(['Username already taken', 'Email already taken']); // disable the loader and display an error message
        ** GiftedFormManager.reset('signupForm'); // clear the states of the form manually. 'signupForm' is the formName used
        */
        //alert('props.msg='+JSON.stringify(this.props.msg)+'\nstate.form='+JSON.stringify(values))
        Alert.alert(
            "Publish",
            "Do you want to publish this form ? ",
            [
              {text:"Cancel" },
              {text:"OK", onPress:()=>{
                  self.fixFormData(values);
                      //console.log('ready:'+JSON.stringify(values));
                  Net.setMsg(values).then((ret)=> {
                      //console.log('created:'+JSON.stringify(ret));
                      if(ret.phone == values.phone){
                          if(this.props.msg!=null){ //edit
                              self.changeReply( Global.getKeyFromMsg(this.props.msg), Global.getKeyFromMsg(values) )
                              alert('Edit successfully');
                          }else{
                              var my_value={
                                  key:'*'+Global.mainlogin, 
                                  field:Global.getKeyFromMsg(values), 
                                  value:'owner|open'
                              }
                              Net.putHash(my_value);
                              let sns_ret = self.postSNS(values);
                              if(sns_ret.length>0) alert('Create successfully');
                          }
                          self.props.navigator.pop();
                      }else{
                          alert('Error:'+ret)
                      }
                  })
              }},
            ]
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
    changeReply(old_key,new_key){
        if(old_key != new_key){
            Net.delMsg(Global.getKeyFromMsg(this.props.msg))
            let logins = Global.getLogins(this.props.msg.owner)
            let mainlogin = Global.getMainLogin(logins);
            Net.getNotify(mainlogin).then((rows)=> {
              //alert('all notifies='+JSON.stringify(rows))
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
            //{timestamp,{coords:{speed,heading,accuracy,longitude,latitude,altitude}}}
            self.pos=position.coords
            //self.sendDataToUsbSerialDevice(JSON.stringify(self.pos));
          },
          (error) => console.log(error.message),
          {enableHighAccuracy: true, timeout: 30000, maximumAge: 1000, distanceFilter:30},
        );
      }else if(Global.MAP===Global.BaiduMap){
        this.watchID = KKLocation.watchPosition((position) => {
          //{timestamp,{coords:{heading,accuracy,longitude,latitude}}}  //no speed,altitude
          self.pos=position.coords
          //self.sendDataToUsbSerialDevice(JSON.stringify(self.pos));
        });
      }
      //this.setState({gps:true});
    }
    checkTooFarAway(position){
        if(!this.pos) return false
        let latDiff = Math.abs(position.latitude-this.pos.latitude)
        let lngDiff = Math.abs(position.longitude-this.pos.longitude)
        if(latDiff>0.1 || lngDiff>0.1){
            return true
        }else return false
    }
    capitalizeFirstLetter(str) {
        return str.charAt(0).toUpperCase() + str.slice(1);
    }
    openImagePicker(){
        //if(!this.key){  //type:lat,lng:ctime
        //    alert('Please select type, ask/offer and address')
        //    return
        //}
        //let perm_nbr = Object.keys(this.state.grantedPermissions).length
        //if(perm_nbr< this.permissions.length) {
            
        //}
        const options = {
          title: 'Add photo into this form',
          //quality: 0.5,
          //maxWidth: 300,
          //maxHeight: 300,
          allowsEditing: false,
          storageOptions: {
            skipBackup: true
          },
          //customButtons: this.state.add_fields,
        };
        ImagePicker.showImagePicker(options, (response) => {
          if (response.didCancel) {
            //alert('User cancelled image picker');
          }else if (response.error) {
            //alert('ImagePicker Error: ', JSON.stringify(response));
          }else if (response.customButton) {
            //alert('User tapped custom button: '+response.customButton);
            //this.addField(response.customButton)
          }else {
            //{type,fileName,fileSize,path,data,uri,height,width,isVertical}
            //const source = {uri: 'data:image/jpeg;base64,' + response.data, isStatic: true};
            const source = {uri: response.uri, isStatic: true};
            //const source = {uri: response.uri.replace('file://', ''), isStatic: true};
            //alert(JSON.stringify(source))  // {uri}
            this._upload(source)
         }
       });
       /*ImagePicker.launchCamera(options, (response)  => {
           // Same code as in above section!
       });*/
    }
    showImages(list){
        //alert('this.state.form.pics='+JSON.stringify(this.state.form.pics))  //pics=['0.jpg','1.jpg']
        //alert('uploading[]='+JSON.stringify(this.state.uploading)+'\nlist[]='+JSON.stringify(list))
        return (
          <View style={{marginLeft:10,height:Style.THUMB_HEIGHT+10,justifyContent:'center'}}>
            <View style={{height:5}}/>
            <ScrollView style={{height:Style.THUMB_HEIGHT,}} horizontal={true}>
                {
                  list.map((pic,id)=>{
                    let source = pic
                    if(this.state.uploading[id] <100) source={uri:Global.empty_image}
                    return (
                        <Image key={pic.uri} source={source}
                            style={{width:Style.THUMB_HEIGHT,height:Style.THUMB_HEIGHT}}
                            indicator={ProgressBar}
                        >
                            {
                              this.state.uploading[id]<100 ?
                              <View style={{flex: 1,alignItems: 'center',justifyContent: 'center',}}>
                                  <Text style={{fontWeight: 'bold',color:'blue'}}>{Math.floor(this.state.uploading[id])}%</Text>
                                  <ActivityIndicator style={{marginLeft:5}} />
                              </View> :
                              <View style={Style.close,{height:25,flexDirection:'row'}}>
                              <View style={{flex:1}}/>
                              <TouchableHighlight 
                                  onPress={()=>this.deletePic(id)}
                                  style={{ width:25,height:25,backgroundColor:'black',alignItems:'center',justifyContent:'center' }}>
                                  <Image style={{width:16,height:16,margin:5}} source={this.state.close_image} />
                              </TouchableHighlight>
                              </View>
                            }
                        </Image>
                    )
                  })
                }
            </ScrollView>
          </View>
        )
    }
    showPics(){
        //alert(JSON.stringify(this.state.form.pics))
        if(this.state.form.pics && this.state.form.pics.length>0 && this.state.form.pics[0].length>0){
            //let key = Global.getKeyFromMsg(this.state.form)
            let url = Global.host_image_info+this.ctime+'/'
            let list = this.state.form.pics.map((pic)=>{
                return {uri: url+pic}
            })
            //alert(JSON.stringify(list))
            return this.showImages(list)
        }
    }
    deletePic(id){
        let pictures = this.state.form.pics
        let filename = pictures[id]
        //let key = Global.getKeyFromMsg(this.state.form)
        let self=this
        Alert.alert(
            "Delete",
            "Do you want to delete this picture ? ",
            [
              {text:"Cancel" },
              {text:"OK", onPress:()=>{
                  //delete file from server
                  //self._deletePic(this.ctime,filename)
                  pictures.splice(id,1)
                  self.setState({ form:{...self.state.form, pics:pictures}});  //pics_changed:true,
              }},
            ]
        )
    }
    _deletePic(key,filename){
        var xhr = new XMLHttpRequest();
        xhr.open('DELETE', Global.host_image+'/svc.php');
        //var formdata = new FormData();
        //formdata.append('to_delete', filename);
        xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        xhr.send("to_delete="+filename+"&key="+key);
    }
    _upload(file) {
      //alert('uri:'+file.uri)
      let time = new Date().getTime()
      var index = this.state.form.pics?this.state.form.pics.length:0;
      var filename = this.ctime+'-'+time+'.png'
      //alert('filename='+filename+'\ntype='+this.state.form.type)
      var xhr = new XMLHttpRequest();
      xhr.open('POST', Global.host_image+'/svc.php');
      xhr.onload = () => {
        let uploadingJson = this.state.uploading
        uploadingJson[index]=100
        this.setState({uploading:uploadingJson });
        if (xhr.status !== 200) {
            alert('Upload error: ' + xhr.status)
            return;  //redo upload
        }
        if (!xhr.responseText) {
            alert('Upload failed: No response payload. ')
            return;  //redo upload
        }
        if (xhr.responseText.indexOf('OK:') < 0) {
            alert('Upload failed: '+xhr.responseText)
            return;  //redo upload
        }
        // http://nzmessengers.co.nz/service/info/car:39.915814,116.478772:1468417311586/2.jpg
        //let photos = this.state.form.pics? this.state.form.pics: [];
        //photos.push(index+'.jpg')
        //alert('pics:'+JSON.stringify(photos))
        //this.setState({
        //    form:{ ...this.state.form, pics:photos },
        //})
      };
      var formdata = new FormData();
      formdata.append('image', {uri:file.uri, type:'image/png', name:filename });
      xhr.upload.onprogress = (event) => {
        //console.log('upload onprogress', event);
        if (event.lengthComputable) {
          let uploadingJson = this.state.uploading
          uploadingJson[index]=100*(event.loaded / event.total)
          this.setState({uploading: uploadingJson});
        }
      };
      xhr.send(formdata);
      let uploadingJson = this.state.uploading
      uploadingJson[index]=0
      let pics_arr = this.state.form.pics
      if(pics_arr==null) pics_arr=[]
      else if(typeof pics_arr==='string' && pics_arr==='') pics_arr=[]
      else if(typeof pics_arr==='object' && pics_arr.length===1 && pics_arr[0].length===0) pics_arr=[]
      //alert('pics_arr:'+JSON.stringify(pics_arr)+'\nnew_pic: '+this.ctime+'/'+time+'.png')
      this.setState({
          uploading:uploadingJson,
          //pics_changed:true,      new pic will consistent if not submit/publish
          form: { ...this.state.form, pics: [...pics_arr, time+'.png'],}
      });
    }
    showActionIcons(){
        //<Icon name={'fa-weibo'} size={40} color={'red'} onPress={()=>this.postWB({type:'text',title:'this is a test'}) } />
        return (
            <View style={{flexDirection:'row',}}>
                <Icon name={'ion-ios-images-outline'} size={40} color={Style.font_colors.enabled} onPress={this.openImagePicker.bind(this) } />
                <View style={{width:10}} />
            </View>
        )
    }
    handleValueChange(values) {
        //if( typeof values.type==='string'&&values.type && values.lat && values.lng && values.ctime ){
        //  this.key = values.type+':'+values.lat+','+values.lng+':'+values.ctime
        //}
        if(typeof values.type === 'object'){ // && values.type[0]!==this.lasttype) 
            if(this.lasttype==null || values.type[0]!==this.lasttype){
                this.lasttype=values.type[0]
                //alert('change type:'+this.lasttype)
                this.setState({type:this.lasttype})
                this.changeValidator(this.lasttype)
            }
        }
    }
    capitalizeFirstLetter(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }
    renderTypeOptions(){
        let arr = Object.keys(Global.TYPE_ICONS)
        return arr.map((key,i)=>{
            return <GiftedForm.OptionWidget 
                       key={i} 
                       title={this.capitalizeFirstLetter(key)} 
                       value={key} 
                       image={(
                           <View style={{width:80,alignItems:'center'}}>
                               <Icon name={Global.TYPE_ICONS[key]} size={40} />
                           </View>
                       )} />
        })
        //<GiftedForm.OptionWidget title='Estate' value='estate'/>
    }
    back(){
      this.turnOffGps()
      this.props.navigator.pop();
    }
    renderAddrField(name,title,validator){
        return (
            <GiftedForm.PlaceSearchWidget
                key={name}
                name={name}
                title={title}
                placeholder={'Enter '+title}
                clearButtonMode='while-editing'
                displayValue={name}
                value={this.state.form[name]}
                validationResults={this.state.validationResults}
                map={this.map}
                query={{
                    ak:this.ak,mcode:this.mcode,
                    //gdkey:gdkey,
                    key:this.ggkey
                }}
                onClose={ (loc)=> {
                    let values = this.state.form
                    values[name+'_lat']=loc.lat
                    values[name+'_lng']=loc.lng
                    //form:{ ...this.state.form, lat:loc.lat, lng:loc.lng }
                    this.setState({
                        form:values
                    })
                }}
            />)
    }
    renderTextField(name,title,validator){
        return (
            <GiftedForm.TextInputWidget
                key={name}
                name={name}
                title={title}
                placeholder={'Enter '+title}
                clearButtonMode='while-editing'
                displayValue={name}
                value={this.state.form[name]}
                validationResults={this.state.validationResults}
            />)
    }
    renderField(type,name,title,validator){  //type= {txt1,nmbr,txt3,addr,time}
        if(type==='txt1'||type==='nmbr') return this.renderTextField(name,title,validator)
        else if(type==='addr') return this.renderAddrField(name,title,validator)
        else if(type==='txt3') return null
        else if(type==='time') return this.renderTextField(name,title,validator)
    }
    renderOptionalFields(json){
        let keys = Object.keys(json)
        return keys.map((key)=>{
            let obj = json[key]
            return this.renderField(obj.type,key,obj.title,obj.validator)
        })
    }
    render(){
        //alert('render()form:'+JSON.stringify(this.state.form) +'\nmsg:'+JSON.stringify(this.props.msg))
        let h = Style.DEVICE_HEIGHT-Style.NAVBAR_HEIGHT-40
        //let form_height = (this.state.form.pics && this.state.form.pics.length>0)? h-Style.THUMB_HEIGHT : h
        if(this.props.msg!=null) title_nav = 'Edit this Share'
        else title_nav = 'Create a Share'
        return (
            <View style={{backgroundColor: '#eeeeee'}}>
                <NavigationBar style={Style.navbar} title={{title:title_nav, tintColor:Style.font_colors.enabled}}
                   leftButton={
                     <View style={{flexDirection:'row',}}>
                       <Icon 
                           name={"ion-ios-arrow-round-back"} 
                           color={'#333333'} size={46} 
                           onPress={() => this.back() } />
                     </View>
                   }
                   rightButton={ this.showActionIcons() }
                />
                <KeyboardAvoidingView behavior='position' style={{flex:1,}}>
                  {this.showPics()}
                  <GiftedForm
                    formName='newInfoForm'
                    style={{flex:1,marginLeft:10,marginRight:10}}  //height:form_height
                    openModal={(route) => { route.giftedForm = true; this.props.navigator.push(route) }}
                    onValueChange={this.handleValueChange.bind(this)}
                    validators={ this.validators }
                    defaults={this.state.form}
                    >
                        <GiftedForm.ModalWidget
                            title='Type'
                            name='type'
                            //displayValue='typeTitle'
                            display={this.state.form.typeTitle}
                            value={this.state.form.type}
                            validationResults={this.state.validationResults}
                        >
                            <GiftedForm.SeparatorWidget />
                            <GiftedForm.SelectWidget name='type' title='Type' multiple={false}>
                                {this.renderTypeOptions()}
                            </GiftedForm.SelectWidget>
                        </GiftedForm.ModalWidget>
                        <GiftedForm.ModalWidget
                            title='Sell/Rent/Free'
                            name='cat'
                            display={this.state.form.catTitle}
                            value={this.state.form.cat}
                            validationResults={this.state.validationResults}
                        >
                            <GiftedForm.SeparatorWidget />
                            <GiftedForm.SelectWidget name='cat' title='Sell/Rent/Free' multiple={false}>
                                <GiftedForm.OptionWidget title='Sell' value='sell' />
                                <GiftedForm.OptionWidget title='Rent' value='rent' />
                                <GiftedForm.OptionWidget title='Free' value='free' />
                            </GiftedForm.SelectWidget>
                        </GiftedForm.ModalWidget>
                        <GiftedForm.ModalWidget
                            title='Ask/Offer'
                            name='ask'
                            display={this.state.form.askTitle}
                            value={this.state.form.ask}
                            validationResults={this.state.validationResults}
                        >
                            <GiftedForm.SeparatorWidget />
                            <GiftedForm.SelectWidget name='ask' title='Ask/Offer' multiple={false}>
                                <GiftedForm.OptionWidget title='Ask'   value='true' />
                                <GiftedForm.OptionWidget title='Offer' value='false' />
                            </GiftedForm.SelectWidget>
                        </GiftedForm.ModalWidget>
                        {this.renderTextField('title','Title', this.length_validator(5,55))}
                        {this.renderTextField('phone','Phone', this.number_validator)}
                        {this.renderTextField('price','Price', this.number_validator)}
                        {this.renderOptionalFields(this.info_types[this.state.type])}
                        <GiftedForm.PlaceSearchWidget
                            name='address'
                            title='Address'
                            //placeholder='Enter address'
                            clearButtonMode='while-editing'
                            displayValue='address'
                            value={this.state.form.address}
                            validationResults={this.state.validationResults}
                            map={this.map}
                            query={{
                                ak:this.ak,mcode:this.mcode,
                                //gdkey:gdkey,
                                key:this.ggkey
                            }}
                            onClose={ (loc)=> this.setState({form:{ ...this.state.form, lat:loc.lat, lng:loc.lng }}) }
                        />
                        <GiftedForm.ModalWidget
                            name='content'
                            title='Content'
                            display={this.state.form.content}
                            //scrollEnabled={true}
                            value={this.state.form.content}
                            validationResults={this.state.validationResults}
                            displayValue='content'
                        >
                            <GiftedForm.SeparatorWidget/>
                            <GiftedForm.TextAreaWidget
                                name='content'
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
                            title='Publish'
                            widgetStyles={{
                                submitButton: {
                                    backgroundColor: '#6495ED',
                                }
                            }}
                            onSubmit={(isValid, values, validationResults, postSubmit = null, modalNavigator = null) => {
                                //alert(JSON.stringify(validationResults))
                                //alert(JSON.stringify(values))
                                this.setState({ validationResults:validationResults.results })
                                if (isValid === true) {
                                  this.onSubmit(values)
                                  postSubmit();
                                }else{
                                  //alert(JSON.stringify(validationResults.results))
                                }
                            }}
                        />
                </GiftedForm>
              </KeyboardAvoidingView>
            </View>
        );
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

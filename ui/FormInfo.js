//'use strict'; //ERROR: Attempted to assign to readonly property
import React, { Component } from 'react';
import {ActivityIndicator, Alert, Image, Picker, PixelRatio, Platform, ScrollView, StyleSheet, Text, TouchableHighlight, View } from 'react-native';
import {Icon} from './Icon'
import { GiftedForm, GiftedFormManager } from 'react-native-gifted-form'
import ExNavigator from '@exponent/react-native-navigator';
import NavigationBar from 'react-native-navbar';
import Style from './Style';
import Store from '../io/Store';
import Global from '../io/Global';
import Net from '../io/Net'
import Immutable from 'immutable'
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view'
import PlaceSearch from './PlaceSearch'
import ImagePicker from 'react-native-image-picker'
 
export default class FormInfo extends Component {
    constructor(props) {
        super(props);
        this.ctime = +new Date();
        this.state={ 
            uploading:[],
            localpics:[],
            add_fields:{
              Price:   'Price:num',
              Time:    'Time:date',
              Destination: 'Destination:str',
            },
            form:{},
        };
        this.validators={
              title:{
                title:'Title',
                validate:[{
                  validator:'isLength',
                  arguments:[2,20],
                  message:'{TITLE} must be between {ARGS[0]} and {ARGS[1]} characters'
                }]
              },
              content:{
                title:'Content',
                validate:[{
                  validator:'isLength',
                  arguments:[10,512],
                  message:'{TITLE} must be between {ARGS[0]} and {ARGS[1]} characters'
                }]
              },
              phone:{
                title:'Phone number',
                validate:[{
                  validator:'isLength',
                  arguments:[6,20],
                  message:'{TITLE} must be between {ARGS[0]} and {ARGS[1]} characters'
                }]
              },
              type:{
                title:'Type',
                validate:[{
                  validator:(...args) => {
                      if (args[0] === undefined) {
                         return false;
                      }
                      return true;
                  },
                  message:'{TITLE} is required'
                }]
              },
              ask:{
                title:'Ask/Offer',
                validate:[{
                  validator:(...args) => {
                      if (args[0] === undefined) {
                         return false;
                      }
                      return true;
                  },
                  message:'{TITLE} is required'
                }]
              },
              lat:{
                title:'Address',
                validate:[{
                  validator:(...args) => {
                      if (args === undefined) {
                         return false;
                      }
                      return true;
                  },
                  message:'{TITLE} is invalid'
                }]
              },
        }
        // price: t.maybe(t.Number),
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
    validateAll(){
        var fields = Object.keys(this.state.validators)
        fields.map((field_name)=>{
            let obj = this.state.validators[field_name]
            if(obj.validate[0].arguments !== undefined) alert(JSON.stringify(obj.validate[0].arguments))
        })
    }
    addField(value){  //value = field:type
        let add_fields = this.state.add_fields
        let all_fields = this.state.all_fields
        let name = value.split(':')[0]
        all_fields[name] = this.getFieldType(value)
        delete add_fields[name];
        this.setState({
            add_fields: add_fields,
            all_fields: all_fields,
            //all_fields: {...this.state.all_fields, name:t.maybe(t.String), },
        })
    }
    removeField(name){
        let add_fields = this.state.add_fields
        let all_fields = this.state.all_fields
        add_fields[name] = all_fields[name];
        delete all_fields[name];
        this.setState({
            add_fields: add_fields,
            all_fields: all_fields,
        })
    }
    onSubmit(values) {
        var self = this;
        //values['pics']=[]
        //this.validateAll();
        if(values.ask  && typeof values.ask ==='object')   values.ask = values.ask[0]
        if(values.ask === 'Ask' || values.ask === 'true')  values.ask = true
        else values.ask = false
        if(values.type && typeof values.type ==='object')  values.type = values.type[0]
        values.type=values.type.toLowerCase()
        if(values.pics && typeof values.pics ==='object')  values.pics = values.pics.join(',')
        if(values.askTitle) delete values.askTitle
        if(values.typeTitle) delete values.typeTitle
        if(values.dest && values.dest.length===0) delete values.dest
        //
        //values.birthday = moment(values.birthday).format('YYYY-MM-DD');
        /* postSubmit(['An error occurred, please try again']); // disable the loader and display an error message
        ** postSubmit(['Username already taken', 'Email already taken']); // disable the loader and display an error message
        ** GiftedFormManager.reset('signupForm'); // clear the states of the form manually. 'signupForm' is the formName used
        */
        alert(JSON.stringify(values))
        /*Alert.alert(
            "Publish",
            "Do you want to publish this info ? ",
            [
              {text:"Cancel" },
              {text:"OK", onPress:()=>{
                  if(values.pics.length===0) delete values.pics
                  Net.setMsg(values)
                  self.props.navigator.pop();
              }},
            ]
        )*/
    }
    componentWillMount(){
        this.initKeys();
        this.processProps();
    }
    processProps(){
        if(!this.props.msg){
            //alert('processProps(null)')
            var myDefaults = {
              title: '', content: '', address: '',
              type:  '',  ask: 'true',
              owner: Global.getLoginStr(Global.logins),
              phone: '',  ctime: this.ctime, time:  '',
              lat:   '',  lng:   '',  price: '',
              dest:  '', pics:  [],
            };
            this.setState({form:myDefaults})
        }else{
            //alert('processProps(msg)')
            var myDefaults=this.props.msg;
            //var typekey = 'type{'+this.props.msg.type+'}';
            //var askkey  = 'ask{' +this.props.msg.ask+'}';
            //myDefaults[typekey] = true;
            //myDefaults[askkey]  = true;
            myDefaults['typeTitle'] = this.capitalizeFirstLetter(this.props.msg.type)
            myDefaults['askTitle'] = this.props.msg.ask?'Ask':'Offer'
            this.setState({ form:myDefaults })
        }
    }
    capitalizeFirstLetter(str) {
        return str.charAt(0).toUpperCase() + str.slice(1);
    }
    openImagePicker(){
        if(!this.key){
            alert('Please select type, ask/offer and address')
            return
        }
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
            alert('ImagePicker Error: ', JSON.stringify(response.error));
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
    showPics(){
      if(this.state.localpics.length==0)  return null;  //local pics
      else
        return (
            <ScrollView style={{height:Style.THUMB_HEIGHT+4}} horizontal={true}>
                {
                  this.state.localpics.map((pic,id)=>{
                    return (
                        <Image key={id} source={pic} 
                            style={{width:Style.THUMB_HEIGHT,height:Style.THUMB_HEIGHT}}>
                            {
                              this.state.uploading[id]<100 ? 
                              <View style={styles.progress}> 
                                  <Text style={{fontWeight: 'bold',color:'white'}}>{Math.floor(this.state.uploading[id])}%</Text> 
                                  <ActivityIndicator style={{marginLeft:5}} />
                              </View> :
                              <View style={styles.progress}>
                                  <Icon style={{padding:0}} name={'ion-ios-checkmark-circle'} color={'green'} size={33} />
                              </View>
                            }
                        </Image>
                    )
                  })
                }
            </ScrollView>
        )
    }
    _upload(file) {
      //alert('uri:'+file.uri)
      var index = this.state.localpics.length;
      var filename = this.key+'-'+index+'.jpg'
      var xhr = new XMLHttpRequest();
      //xhr.open('POST', 'http://posttestserver.com/post.php');
      xhr.open('POST', 'http://nzmessengers.co.nz/service/upload.php');
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
        let photos = this.state.form.pics? this.state.form.pics: [];
        photos.push(index+'.jpg')
        this.setState({
            form:{ ...this.state.form, pics:photos },
        })
      };
      var formdata = new FormData();
      formdata.append('image', {uri:file.uri, type:'image/jpg', name:filename });
      //key= car:lat,lng:ctime
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
      this.setState({
          uploading:uploadingJson,
          localpics: [...this.state.localpics, file],
      });
    }
    showActionIcons(){
        return (
            <View style={{flexDirection:'row',}}>
                <Icon name={'ion-ios-images-outline'} size={40} onPress={this.openImagePicker.bind(this) } />
                <View style={{width:20}} />
            </View>
        )
    }
    //<Icon name={'ion-ios-paper-plane-outline'} size={40} onPress={this.onSubmit.bind(this) } />
    handleValueChange(values) {
        if( values.type && values.lat && values.lng && values.ctime ){
          this.key = values.type+':'+values.lat+','+values.lng+':'+values.ctime
        }
        //this.setState({ form: values })
        //alert(JSON.stringify(values))
    }
    render(){
        //alert('render()form:'+JSON.stringify(this.state.form) +'\nmsg:'+JSON.stringify(this.props.msg))
        //let {}
        return (
            <View >
                <NavigationBar style={Style.navbar} title={{title: '',}}
                   leftButton={
                     <View style={{flexDirection:'row',}}>
                       <Icon name={"ion-ios-arrow-round-back"} color={'#333333'} size={40} onPress={() => this.props.navigator.pop() } />
                     </View>
                   }
                   rightButton={ this.showActionIcons() }
                />
                {this.showPics()}
                <GiftedForm
                    formName='newInfoForm'
                    style={{height:Style.DEVICE_HEIGHT-Style.NAVBAR_HEIGHT-Style.THUMB_HEIGHT-50,margin:20}}
                    openModal={(route) => { route.giftedForm = true; this.props.navigator.push(route) }}
                    onValueChange={this.handleValueChange.bind(this)}
                    validators={ this.validators }
                    defaults={this.state.form}
                    >
                        <GiftedForm.ModalWidget
                            title='Ask/Offer'
                            name='ask'
                            displayValue='askTitle'
                            value={this.state.form.askTitle}
                        >
                            <GiftedForm.SeparatorWidget />
                            <GiftedForm.SelectWidget name='ask' title='Ask/Offer' multiple={false}>
                                <GiftedForm.OptionWidget title='Ask'   value='true' />
                                <GiftedForm.OptionWidget title='Offer' value='false' />
                            </GiftedForm.SelectWidget>
                        </GiftedForm.ModalWidget>
                        <GiftedForm.ModalWidget
                            title='Type'
                            name='type'
                            displayValue='typeTitle'
                            value={this.state.form.typeTitle}
                        >
                            <GiftedForm.SeparatorWidget />
                            <GiftedForm.SelectWidget name='type' title='Type' multiple={false}>
                                <GiftedForm.OptionWidget title='Car'    value='car'/>
                                <GiftedForm.OptionWidget title='Estate' value='estate'/>
                                <GiftedForm.OptionWidget title='Tool'   value='tool'/>
                                <GiftedForm.OptionWidget title='Help'   value='help'/>
                            </GiftedForm.SelectWidget>
                        </GiftedForm.ModalWidget>
                        <GiftedForm.TextInputWidget
                            name='title'
                            title='Title'
                            placeholder='Enter title'
                            clearButtonMode='while-editing'
                            displayValue='title'
                            value={this.state.form.title}
                        />
                        <GiftedForm.TextInputWidget
                            name='phone'
                            title='Phone'
                            placeholder='Enter phone'
                            clearButtonMode='while-editing'
                            displayValue='phone'
                            value={this.state.form.phone}
                        />
                        <GiftedForm.TextInputWidget
                            name='price'
                            title='Price'
                            placeholder='Enter price'
                            clearButtonMode='while-editing'
                            displayValue='price'
                            value={this.state.form.price}
                        />
                        <GiftedForm.PlaceSearchWidget
                            name='address'
                            title='Address'
                            //placeholder='Enter address'
                            clearButtonMode='while-editing'
                            displayValue='address'
                            value={this.state.form.address}
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
                            displayValue='content'
                            //scrollEnabled={true}
                            value={this.state.form.content}
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
                                if (isValid === true) {
                                  this.onSubmit(values)
                                  postSubmit();
                                }
                            }}
                        />
                </GiftedForm>
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
    //alignItems: 'flex-end',
    //justifyContent: 'flex-end',
    //flexDirection: 'row',
    //width: 100
  },
});

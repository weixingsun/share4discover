//'use strict'; //ERROR: Attempted to assign to readonly property
import React, { Component } from 'react';
import {Alert, Image, Picker, PixelRatio, Platform, ScrollView, StyleSheet, Text, TouchableHighlight, View } from 'react-native';
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
        this.old_value = this.props.msg? this.props.msg: {owner:'',ask:false,address:'',latlng:''};
        this.old_value['ask']=false;
        this.state={ 
            content_height: 40,
            value: this.old_value,
            init_address: this.props.msg? this.props.msg.address:'',
            pics:[],
            add_fields:{
              Price:   'Price:num',
              Time:    'Time:date',
              Destination: 'Destination:str',
            },
            all_fields:{
            },
            form: {
              title:   '',
              content: '',
              address: '',
              type: '',
              ask: '',
              owner: '',
              phone: '',
              ctime: '',
              time: '',
              lat: '',
              lng: '',
              price: '',
              dest: '',
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
    getFieldType(value){
        let type = value.split(':')[1]
        let form_type = t.String
        switch(type){
            case 'num':  break;
            case 'date': break;
            case 'bool': break;
            case 'sex':  break;
            default: 
        }
        return form_type;
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
    changePlace(place){
        //this.refs.form.props.value;
        var ctime = +new Date();
        if(!this.props.msg)  this.old_value['ctime']= ctime
        this.old_value['owner']= this.state.value.owner
        this.old_value['address']= place.address
        this.old_value['lat']= typeof place.latitude =='string'?parseFloat(place.latitude): place.latitude.toFixed(5)
        this.old_value['lng']= typeof place.longitude =='string'?parseFloat(place.longitude): place.longitude.toFixed(5)
        this.setState({
             value: this.old_value,
        })
    }
    onSubmit () {
        var value = this.refs.form.getValue();
        if (value) { // if validation fails, value will be null
            //value['pics']=[]
            var _this = this;
            Alert.alert(
              "Publish",
              "Do you want to publish this information ? ",
              [
                {text:"Cancel", },
                {text:"OK", onPress:()=>{
                    Net.setMsg(value)
                    _this.props.navigator.pop();
                }},
              ]
           );
       }else{

       }
    }
    onChange(form){
        var ctime = +new Date();
        this.old_value = form
	if(!this.props.msg)  this.old_value['ctime']= ctime
        this.setState({
             value: this.old_value,
        })
    }
    componentWillMount(){
        this.initKeys();
        this.checkLoginUser();
        //alert(JSON.stringify(this.props.navigator))
    }
    openImagePicker(){
        const options = {
          title: 'Add a field in this form',
          //quality: 0.5,
          //maxWidth: 300,
          //maxHeight: 300,
          allowsEditing: false,
          storageOptions: {
            skipBackup: true
          },
          customButtons: this.state.add_fields,
        };
        ImagePicker.showImagePicker(options, (response) => {
          if (response.didCancel) {
            //alert('User cancelled image picker');
          }else if (response.error) {
            alert('ImagePicker Error: ', JSON.stringify(response.error));
          }else if (response.customButton) {
            //alert('User tapped custom button: '+response.customButton);
            this.addField(response.customButton)
          }else {
            //{type,fileName,fileSize,path,data,uri,height,width,isVertical}
            //const source = {uri: 'data:image/jpeg;base64,' + response.data, isStatic: true};
            const source = {uri: response.uri, isStatic: true};
            //const source = {uri: response.uri.replace('file://', ''), isStatic: true};
            alert(JSON.stringify(source))
            this.setState({
              pics: [...this.state.pics, source]
            });
         }
       });
       /*ImagePicker.launchCamera(options, (response)  => {
           // Same code as in above section!
       });*/
    }
    showPics(){
      if(this.state.pics.length==0)  return null;
      else
        return (
            <ScrollView style={{height:102}} horizontal={true}>
                {
                  this.state.pics.map((pic,id)=>{
                    return <Image key={id} source={pic} style={{width:100,height:100}} />
                  })
                }
            </ScrollView>
        )
    }
    checkLoginUser(){
        var self = this
        Store.get('user_fb').then(function(fb){
            if(fb != null){
                var name = fb.type+':'+fb.email
                if(self.state.value.owner !== '') name += ','+self.state.value.owner
                if(!self.props.msg){
                  self.setState({
                    value: {owner:name,address:'',latlng:''},
                  });
		}
            }
        });
        Store.get('user_gg').then(function(gg){
            if(gg != null) {
                //alert('Please login to publish information.')
                var name = gg.type+':'+gg.email
                if(self.state.value.owner !== '') name += ','+self.state.value.owner
                if(!self.props.msg){
                  self.setState({
                    value: {owner:name,address:'',latlng:''},
                  });
                }
            }
        });
    }
    showActionIcons(){
        return (
            <View style={{flexDirection:'row',}}>
                <Icon name={'ion-ios-add'} size={50} onPress={this.openImagePicker.bind(this) } />
                <View style={{width:50}} />
                <Icon name={'ion-ios-paper-plane-outline'} size={40} onPress={this.onSubmit.bind(this) } />
            </View>
        )
    }
    handleValueChange(values) {
        //console.log('handleValueChange', values)
        //alert('handleValueChange:'+ JSON.stringify(values))
        this.setState({ form: values })
    }
    render(){
        //alert(JSON.stringify(this.state.pics))
        //alert('map='+this.map+'\nak='+this.ak+'\nmcode='+this.mcode+'\nggkey='+this.ggkey)
        let self = this;
        const { type, ask, owner, phone, title, address, lat,lng, time, content } = this.state.form
        return (
            <View >
                <NavigationBar style={Style.navbar} title={{title: '',}}
                   leftButton={
                     <View style={{flexDirection:'row',}}>
                       <Icon name={"ion-ios-arrow-round-back"} color={'#333333'} size={40} onPress={() => self.props.navigator.pop() } />
                     </View>
                   }
                   rightButton={ self.showActionIcons() }
                />
                {this.showPics()}
                <GiftedForm
                    formName='signupForm'
                    style={{height:Style.DEVICE_HEIGHT-300,margin:10}}   //flex:1
                    openModal={(route) => { route.giftedForm = true; self.props.navigator.push(route) }}
                    onValueChange={self.handleValueChange.bind(self)}
                    >
                        <GiftedForm.TextInputWidget
                            name='title'
                            title='Title'
                            placeholder='Enter title'
                            clearButtonMode='while-editing'
                            value={title}
                        />
                        <GiftedForm.TextInputWidget
                            name='phone'
                            title='Phone'
                            placeholder='Enter phone'
                            clearButtonMode='while-editing'
                            value={phone}
                        />
                        <GiftedForm.ModalWidget
                            title='Ask/Offer'
                            displayValue='true'
                            //image={require('./icons/color/gender.png')}
                        >
                            <GiftedForm.SeparatorWidget />
                            <GiftedForm.SelectWidget name='ask' title='Ask/Offer' multiple={false}>
                                <GiftedForm.OptionWidget title='Ask' value='true'/>
                                <GiftedForm.OptionWidget title='Offer' value='false'/>
                            </GiftedForm.SelectWidget>
                        </GiftedForm.ModalWidget>
                        <GiftedForm.PlaceSearchWidget
                            name='address'
                            title='Address'
                            //placeholder='Enter address'
                            clearButtonMode='while-editing'
                            value={address}
                            map={this.map}
                            query={{
                                ak:this.ak,mcode:this.mcode,
                                //gdkey:gdkey,
                                key:this.ggkey
                            }}
                            onClose={ (loc)=> this.setState({form:{ ...this.state.form, lat:loc.lat, lng:loc.lng }}) }
                        />

                        <GiftedForm.ModalWidget
                            title='Content'
                            displayValue='content'
                            scrollEnabled={true}
                        >
                            <GiftedForm.SeparatorWidget/>
                            <GiftedForm.TextAreaWidget
                                name='content'
                                autoFocus={true}
                                placeholder='Detail information'
                                style={{flex:1}}
                            />
                        </GiftedForm.ModalWidget>
                        <GiftedForm.HiddenWidget name='lat' value={lat} />
                        <GiftedForm.HiddenWidget name='lng' value={lng} />
                        <GiftedForm.HiddenWidget name='owner' value={owner} />

                        <GiftedForm.SubmitWidget
                            title='Publish'
                            widgetStyles={{
                                submitButton: {
                                    backgroundColor: 'gray',
                                }
                            }}
                            onSubmit={(isValid, values, validationResults, postSubmit = null, modalNavigator = null) => {
                                if (isValid === true) {
                                  // prepare object
                                  alert(JSON.stringify(values))
                                  //values.birthday = moment(values.birthday).format('YYYY-MM-DD');
                                  /* postSubmit(['An error occurred, please try again']); // disable the loader and display an error message
                                  ** postSubmit(['Username already taken', 'Email already taken']); // disable the loader and display an error message
                                  ** GiftedFormManager.reset('signupForm'); // clear the states of the form manually. 'signupForm' is the formName used
                                  */
                                  postSubmit();
                                }
                            }}
                        />

                </GiftedForm>
            </View>
        );
    }
}
/*
<PlaceSearch style={{height:50}} onSelect={self.changePlace.bind(self)} value={self.state.init_address} />
*/
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
  }
});

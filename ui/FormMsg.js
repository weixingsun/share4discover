//'use strict'; //ERROR: Attempted to assign to readonly property
import React, { Component } from 'react';
import {Alert, Image, Picker, PixelRatio, Platform, ScrollView, StyleSheet, Text, TouchableHighlight, View } from 'react-native';
import {Icon} from './Icon'
//import Form from 'react-native-tableview-form';
//import Form from './Form';
import t from 'tcomb-form-native'
var Form = t.form.Form;
import NavigationBar from 'react-native-navbar';
import Style from './Style';
import Store from '../io/Store';
//import Global from '../io/Global';
import Net from '../io/Net'
import Immutable from 'immutable'
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view'
import PlaceSearch from './PlaceSearch'
import ImagePicker from 'react-native-image-picker'
 
export default class FormMsg extends Component {
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
              type: t.enums(Net.MSG_TYPES),
              ask: t.Boolean,
              owner: t.String,
              phone: t.String,
              title: t.String,
              address: t.String,
              lat: t.Number,
              lng: t.Number,
              ctime: t.Number,
              content: t.String,
            },
        }
        // price: t.maybe(t.Number),
    }
    getFieldType(value){
        let type = value.split(':')[1]
        let form_type = t.String
        switch(type){
            case 'num':  form_type = t.Number; break;
            case 'date': form_type = t.Date;   break;
            case 'bool': form_type = t.Boolean;   break;
            case 'sex':  form_type = t.enums({m:'Male',f:'Female'});   break;
            default:  form_type = t.String;
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
        this.checkLoginUser();
    }
    openImagePicker(){
        const options = {
          title: 'Add a field',
          quality: 0.5,
          maxWidth: 300,
          maxHeight: 300,
          allowsEditing: false,
          //allowsEditing: true,
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
        return (
            this.state.pics.map((pic,id)=>{
                return <Image key={id} source={pic} style={{width:150,height:150}} />
            })
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
    render(){
      //alert(JSON.stringify(this.state.pics))
      const options = {
        auto: 'placeholders',
        fields: {
          owner:{hidden:true},
          address:{hidden:true},
          lat:{hidden:true},
          lng:{hidden:true},
          ctime:{hidden:true},
          content: {
            stylesheet: Object.assign({}, Form.stylesheet, {
              textbox: {
                normal: {
                  height: this.state.content_height
                },
                error: {
                  height: this.state.content_height
                }
              }
            }),
            multiline: true,
            onChange: (event) => {
              this.old_value['content']= event.nativeEvent.text
              this.setState({
                value: this.old_value,
                content_height: event.nativeEvent.contentSize.height
              });
            }
          }
        }
      }
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
                <KeyboardAwareScrollView style={{
                        flexDirection: 'column',
                        flex: 1,
                        //marginTop: 50,
                        margin: 15,
                }}>
                    <ScrollView style={{marginBottom:10}} horizontal={true}>
                        {this.showPics()}
                    </ScrollView>
                    <PlaceSearch style={{flex:1}} onSelect={this.changePlace.bind(this)} value={this.state.init_address} />
                    <Form
                        ref="form"
                        type={t.struct(this.state.all_fields)}
                        value={this.state.value}
                        options={options}
                        onChange={this.onChange.bind(this)}
                    />
                </KeyboardAwareScrollView>
            </View>
        );
    }
}
//<Image source={this.state.} style={{}} />
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

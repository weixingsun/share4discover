//'use strict'; //ERROR: Attempted to assign to readonly property
import React, { Component } from 'react';
import {Alert, Picker, StyleSheet, Text, TouchableHighlight, View } from 'react-native';
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
 
export default class PDF extends Component {
    constructor(props) {
        super(props);
        this.old_value = {};
        this.state={ 
            content_height: 40,
            value: {owner:'',ask:false,address:'',latlng:''},
        }
        this.type= {
            type: t.enums(Net.MSG_TYPES),
            owner: t.String,
            ask: t.Boolean,
            title: t.String,
            address: t.String,
            lat: t.Number,
            lng: t.Number,
            ctime: t.Number,
            content: t.String,
        }
        //this.onChangeNative=this.onChangeNative.bind(this)
    }
    changePlace(place){
        //this.refs.form.props.value;
	//alert('place.latitude:'+parseFloat(place.latitude))
        var ctime = +new Date();
        this.old_value['ctime']= ctime
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
        //alert(JSON.stringify(value))
        if (value) { // if validation fails, value will be null
            //value['pics']=[]                             ////////ctime undefined
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
       }
    }
    onChange(form){
        var ctime = +new Date();
        this.old_value = form
        this.old_value['ctime']= ctime
        this.setState({
             value: this.old_value,
        })
    }
    /*onChangeNative(event){
        this.content_height= event.nativeEvent.contentSize.height
        this.multilineStyle = this.immutableMap.mergeDeep({textbox: {normal: {height: this.content_height}}}).toJS();
        this.setState({
            options:{
                fields:{
                    owner:{editable:false},
                    content:{multiline:true,stylesheet: this.multilineStyle, onChange:this.onChangeNative},
                    address:{hidden:true},
                    lat:{hidden:true},
                    lng:{hidden:true},
                }
            },
        });
            //text: event.nativeEvent.text,
            //content_height: event.nativeEvent.contentSize.height,
    }*/
    componentWillMount(){
        //alert(Date.now())
        this.checkLoginUser();
    }
    checkLoginUser(){
        var self = this
        Store.get('user_fb').then(function(fb){
            if(fb == null){
                Store.get('user_gg').then(function(gg){
                    if(gg == null) {
                        alert('Please login to publish information.')
                    }else{
                        var name = gg.type+':'+gg.email
                        self.setState({
                            value: {owner:name,address:'',latlng:''},
                        });
                    }
                });
            }else{
                var name = fb.type+':'+fb.email
                self.setState({
                    value: {owner:name,address:'',latlng:''},
                });
            }
        });
    }
    render(){
        //console.log('rendering....yql:'+JSON.stringify(this.state.yql));
      const options = {
        fields: {
          owner:{editable:false},
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
                       <Icon name={"ion-ios-arrow-back"} color={'#333333'} size={30} onPress={() => this.props.navigator.pop() } />
                     </View>
                   }
                   rightButton={
                     <View style={{flexDirection:'row',}}>
                        <Icon name={'ion-ios-paper-plane-outline'} size={40} onPress={this.onSubmit.bind(this) } />
                     </View>
                   }
                  />
                <KeyboardAwareScrollView style={{
                        flexDirection: 'column',
                        flex: 1,
                        marginTop: 50,
                        margin: 15,
                }}>
                    <PlaceSearch style={{flex:1}} onSelect={this.changePlace.bind(this)}/>
                    <Form
                        ref="form"
                        type={t.struct(this.type)}
                        value={this.state.value}
                        options={options}
                        onChange={this.onChange.bind(this)}
                    />
                </KeyboardAwareScrollView>
            </View>
        );
    }
}
var styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    marginTop: 50,
    padding: 20,
    backgroundColor: '#ffffff',
  },
  title: {
    fontSize: 30,
    alignSelf: 'center',
    marginBottom: 30
  },
  buttonText: {
    fontSize: 18,
    color: 'white',
    alignSelf: 'center'
  },
  button: {
    height: 36,
    backgroundColor: '#48BBEC',
    borderColor: '#48BBEC',
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 10,
    alignSelf: 'stretch',
    justifyContent: 'center'
  }
});

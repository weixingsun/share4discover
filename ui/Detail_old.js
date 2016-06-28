//'use strict'; //ERROR: Attempted to assign to readonly property
import React, { Component } from 'react';
import {Alert, Picker, StyleSheet, Text, TouchableHighlight, View } from 'react-native';
import {Icon} from './Icon'
//import Form from 'react-native-tableview-simple';
//import Form from './Form';
import t from 'tcomb-form-native'
var Form = t.form.Form;
import NavigationBar from 'react-native-navbar';
import Style from './Style';
import Store from '../io/Store';
//import Global from '../io/Global';
import Net from '../io/Net'
import Immutable from 'immutable'
import PlaceSearch from './PlaceSearch'
import {Cell, Section, TableView} from 'react-native-tableview-simple'
 
export default class Detail extends Component {
    constructor(props) {
        super(props);
        this.old_value = {};
        this.state={ 
            content_height: 40,
        }
        this.type= {
            title: t.String,
            address: t.String,
            type: t.String,
            owner: t.String,
            ask: t.String,
            lat: t.Number,
            lng: t.Number,
            ctime: t.Number,
            content: t.String,
            reply: t.String,
        }
        //this.onChangeNative=this.onChangeNative.bind(this)
    }
    changePlace(place){
        //this.refs.form.props.value;
	//alert('place.latitude:'+parseFloat(place.latitude))
        var ctime = +new Date();
        this.old_value['ctime']= ctime
        this.old_value['address']= place.address
        this.old_value['lat']= typeof place.latitude =='string'?parseFloat(place.latitude): place.latitude.toFixed(5)
        this.old_value['lng']= typeof place.longitude =='string'?parseFloat(place.longitude): place.longitude.toFixed(5)
        this.setState({
             value: this.old_value,
        })
    }
    onSubmit () {
        //var value = this.refs.form.getValue();
        //value['pics']=[]                             ////////ctime undefined
	var key = this.props.msg.type+':'+this.props.msg.lat+','+this.props.msg.lng
	var value={key:key, field:'reply', value:'reply in app'}
        var _this = this;
        Alert.alert(
            "Reply",
            "Do you want to reply this information ? ",
            [
                {text:"Cancel", },
                {text:"OK", onPress:()=>{
                    Net.putMsg(value)
                    _this.props.navigator.pop();
                }},
            ]
        );
    }
    componentWillMount(){
        //alert(Date.now())
        //alert(JSON.stringify(this.props.msg))
        //this.checkLoginUser();
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
          type:{editable:false},
          title:{editable:false},
          address:{editable:false},
          lat:{hidden:true},
          ask:{editable:false},
          lng:{hidden:true},
          ctime:{editable:false},
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
	    editable:false,
          },
	  //reply:{}
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
                        <Icon 
			    name={'ion-ios-mail-outline'} //ion-ios-checkmark-circle green
			    color={'red'} 
			    size={40} 
			    onPress={this.onSubmit.bind(this) } />
                     </View>
                   }
                />
                <Form
                    ref="form"
                    type={t.struct(this.type)}
                    value={this.props.msg}
                    options={options}
                    //onChange={this.onChange.bind(this)}
                />
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

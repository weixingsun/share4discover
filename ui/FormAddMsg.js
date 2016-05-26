//'use strict'; //ERROR: Attempted to assign to readonly property
import React, { Component } from 'react';
import {Alert, Picker, StyleSheet, Text, TouchableHighlight, View } from 'react-native';
import IIcon from 'react-native-vector-icons/Ionicons';
import FIcon from 'react-native-vector-icons/FontAwesome';
//import Form from 'react-native-tableview-form';
//import Form from './Form';
import t from 'tcomb-form-native'
var Form = t.form.Form;
import NavigationBar from 'react-native-navbar';
import Style from './Style';
import Store from '../io/Store';
import Net from '../io/Net'
import Immutable from 'immutable'
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view'
import GooglePlace from './GooglePlace'
 
export default class PDF extends Component {
    constructor(props) {
        super(props);
        this.old_value = {};
        //this.content_height=22;
        this.immutableMap = Immutable.fromJS(t.form.Form.stylesheet);
        this.multilineStyle = this.immutableMap.mergeDeep({textbox: {normal: {height: 200}}}).toJS();
        this.state={ 
            disabled: false,
            type: {
                type: t.enums(Net.MSG_TYPES),
                owner: t.String,
                title: t.String,
                address: t.String,
                lat: t.Number,
                lng: t.Number,
                content: t.String,
            },
            value:{owner:'wsun',address:'',latlng:''},
            options:{
                fields:{
                    owner:{editable:false},
                    content:{multiline:true,stylesheet:this.multilineStyle}, //waiting for autoGrow prop
                    address:{hidden:true},
                    lat:{hidden:true},
                    lng:{hidden:true},
                }
            },
        }
    }
    multilineChange(event){
        this.setState({
            value: event.nativeEvent.text,
        });
        //this.content_height=event.nativeEvent.contentSize.height;
        //alert(event.nativeEvent.contentSize)
    }
    changePlace(place){
        //this.refs.form.props.value;
        this.old_value['address']= place.addr
        this.old_value['lat']= place.latitude.toFixed(5)
        this.old_value['lng']= place.longitude.toFixed(5)
        this.setState({
             value: this.old_value,
        })
    }
    onSubmit () {
        var value = this.refs.form.getValue();
        //alert(JSON.stringify(value))
        if (value) { // if validation fails, value will be null
            value['ctime']=Math.floor(Date.now()/1000);
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
       }
    }
    onChange(form){
        if(form.content != null && form.content !== this.old_value.content) {
            //this.content_height=event.nativeEvent.contentSize.height;
            //this.setState({
            //    value: event.nativeEvent.text,
            //});
        }
        this.old_value = form
    }
    onChangeEvent(event){
        alert(JSON.stringify(Object.keys(event)))
    }
    componentWillMount(){
        //this.load();
        //this.loadApi('MSG')
    }
    onSubmit2(){
        var _this=this;
        var form = this.loginForm.getValue();
        Store.get(form.name).then(function(value){
          if(value!=null){
            Alert.alert(
              "Overwrite",
              "Do you want to overwrite: "+form.name+" ? \nold_value:"+JSON.stringify(value)+'\nnew_value:'+JSON.stringify(form),
              [
                {text:"Cancel", },
                {text:"OK", onPress:()=>{
                    _this.save();
                    _this.props.navigator.pop();
                }},
              ]
            );
          }else{ //add new api
              _this.save();
              _this.props.navigator.pop();
          }
        })
    }
    save(){
        var form = this.loginForm.getValue();
        Store.insertApi(form.name, form);
    }
    load(){
        var _this=this;
        Store.get(Store.API_LIST).then(function(list){
            if(list==null) return;
            _this.setState({api_list:list});
        })
    }
    loadApi(name){
        var _this=this;
        //console.log('loadApi:'+name);
        Store.get(name).then(function(value){
            if(value!=null)
              _this.setState({
                  name:name,
                  data: value,
              });
            else
              _this.setState({
                name:name,
                data:{},
              });
            _this.setModel();
        })
    }
    getLockIcon(){
        if(this.state.disabled) return 'lock' //'ios-locked-outline'
        return 'unlock-alt'
    }
    switchEditMode(){
        if(this.state.disabled) this.setState({disabled:false})
        else this.setState({disabled:true})
    }
    setModel(){
      //this.state.data = {name,title,filter,yql,path,url,subpath,}
      var fields = Object.keys(this.state.data);  //["name","title","filter","yql","path"]
      //alert(JSON.stringify(this.state.data[fields[0]]))
      var model = {};
      fields.map((key,n)=>{
          model[key] = {
              disabled: this.state.disabled,
              type: Form.fieldType.String,
              label: key,
              multiline: true,
              value: this.state.data[key],
          }
      })
      /*let model = {
            name: {
                disabled: this.state.disabled,
                type: Form.fieldType.String,
                label: "Name",
                value: this.state.name,
            },
            path: {
                disabled: this.state.disabled,
                type: Form.fieldType.String,
                label: "Path",
                value: this.state.path,
                //onFieldChange: (value, ref)=>{
                    //new value, ref to element
                //}
            },
            //RN 0.23.1  Picker cannot inside form, many issues
            api_type: {
                type: Form.fieldType.Select,
                disabled: false,
                label: "API Types",
                //valueStyle: {},
                values: [{id:"0",label:"Yahoo",value:"yql"},{id:"1",label:"Url",value:"url"}],
                selected: this.state.api_type,
                onChange:(value)=>{
                    this.setState({api_type:value})
                }
            },
        };*/
        this.setState({model:model})
    }
    render(){
        //console.log('rendering....yql:'+JSON.stringify(this.state.yql));
        return (
            <View style={{flex:1}}>
                  <NavigationBar style={Style.navbar} title={{title: '',}}
                   leftButton={
                     <View style={{flexDirection:'row',}}>
                       <IIcon name={"ios-arrow-back"} color={'#333333'} size={30} onPress={() => this.props.navigator.pop() } />
                     </View>
                   }
                   rightButton={
                     <View style={{flexDirection:'row',}}>
                        <FIcon name={this.getLockIcon()} size={40} onPress={() => this.switchEditMode()} />
                     </View>
                   }
                  />
                <KeyboardAwareScrollView style={{
                        flexDirection: 'column',
                        flex: 1,
                        marginTop: 50,
                        margin: 15,
                }}>
                    <GooglePlace style={{flex:1}} onSelect={this.changePlace.bind(this)}/>
                    <Form
                        ref="form"
                        type={t.struct(this.state.type)}
                        value={this.state.value}
                        options={this.state.options}
                        onChange={this.onChange.bind(this)}
                    />
                    <TouchableHighlight style={styles.button} onPress={this.onSubmit.bind(this)} underlayColor='#99d9f4'>
                        <Text style={styles.buttonText}>Save</Text>
                    </TouchableHighlight>
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

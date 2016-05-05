'use strict';
import React, {Component} from 'react' 
import {Alert, Picker, StyleSheet, Text, View } from 'react-native';
import Button from 'apsl-react-native-button';
import IIcon from 'react-native-vector-icons/Ionicons';
//import Form from 'react-native-tableview-form';
import Form from './Form';
import NavigationBar from 'react-native-navbar';
import Style from './Style';
import Store from '../io/Store';
 
export default class PDF extends Component {
    constructor(props) {
        super(props);
        this.state={ 
            api_list:["-- Add Another API --"],
            name:"-- Add Another API --",
            disabled: false,
            data:{},
        }
    }
    componentWillMount(){
        this.load();
    }
    onSubmit(){
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
        if(this.state.disabled) return 'ios-locked-outline'
        return 'ios-unlocked-outline'
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
                  <NavigationBar style={Style.navbar} title={{title: 'Add Another API',}}
                   leftButton={
                     <View style={{flexDirection:'row',}}>
                       <IIcon name={"close"} color={'#333333'} size={30} onPress={() => this.props.navigator.pop() } />
                     </View>
                   }
                   rightButton={
                     <View style={{flexDirection:'row',}}>
                        <IIcon name={this.getLockIcon()} size={40} onPress={() => this.switchEditMode()} />
                     </View>
                   }
                  />
                <View style={styles.container}>
                    <Picker selectedValue={this.state.name} onValueChange={(value)=> { this.loadApi(value)}}>
                        {this.state.api_list.map(function(item,n){
                            return <Picker.Item key={item} label={item} value={item} />;
                        })}
                    </Picker>
                    <Form
                        style={{flex:1}}
                        ref={(frm)=> this.loginForm = frm}
                        model={this.state.model}
                    />
                    <Button onPress={this.onSubmit.bind(this)}>
                       Save
                    </Button>
                </View>
            </View>
        );
    }
}
var styles = StyleSheet.create({
    container: {
        flexDirection: 'column',
        flex: 1,
        marginTop: 50,
        margin: 15,
    },
    pwdContainer:{
        marginBottom: 20,
        flexDirection:'row',
        alignItems: 'center'
    },
    qrContainer:{
        marginTop: 10,
        marginBottom: 10,
        alignItems: 'center'
    }
});

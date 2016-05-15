'use strict';
import React,{Component} from 'react';
import {Alert, Picker, StyleSheet, Text, View } from 'react-native';
import Button from 'apsl-react-native-button'
import IIcon from 'react-native-vector-icons/Ionicons'
import FIcon from 'react-native-vector-icons/FontAwesome'
//import Form from 'react-native-tableview-form'
import Form from './Form'
import NavigationBar from 'react-native-navbar'
import Style from './Style'
import Store from '../io/Store'
 
export default class PlaceForm extends Component {
    constructor(props) {
        super(props);
        this.arr = this.props.data.split(':')
        this.state={ 
            place_list:[],
            //selected_place:"-- New Place --",
            disabled: false,
            name:this.arr[0],
            location:this.arr[1],
        }
    }
    componentWillMount(){
        this.load();
        this.setModel();
    }
    onSubmit(){
        var _this=this;
        var form = this.loginForm.getValue();
        Store.get(Store.PLACE_LIST).then(function(value){
          if(value!=null){
            Alert.alert(
              "Overwrite",
              "Do you want to overwrite old value:"+Store.PLACE_LIST+" ? \n"+JSON.stringify(value),
              [
                {text:"Cancel", },
                {text:"OK", onPress:()=>{
                    _this.save();
                    _this.props.navigator.pop();
                }},
              ]
            );
          }else{
            _this.save();
            _this.props.navigator.pop();
          }
        })
    }
    save(){
        var form = this.loginForm.getValue();
        //Store.save(form.name,form);
        var new_place_list = [];
        var inlist = false;
        this.state.place_list.map((place,n)=> {
            if(place.split(':')[0] === form.name){
                new_place_list.push( form.name+":"+form.location )
                inlist = true;
            }else{
                new_place_list.push( place );
            }
        } )
        if(!inlist) new_place_list.push( form.name+":"+form.location );
        //console.log('newlist:'+JSON.stringify(new_place_list)+'    oldlist:'+JSON.stringify(this.state.place_list)+',   form='+form.name +':'+form.location)
        Store.save(Store.PLACE_LIST,new_place_list)
    }
    load(){
        var _this=this;
        //alert('load():'+Store.PLACE_LIST)
        Store.get(Store.PLACE_LIST).then(function(list){
            if(list==null) return;
            _this.setState({place_list:list});
            //console.log('load():result:'+JSON.stringify(list));
        })
    }
    loadApi(place_option_name){
        var _this=this;
        var selected_name='',selected_location='';
        this.state.place_list.map((place)=>{
            //console.log('loadApi:name='+place_option_name+',place:'+place);
            if(place_option_name === place){
                selected_name=place.split(':')[0];
                selected_location=place.split(':')[1];
                
            }
        })
        //console.log('loadApi:looop end: name='+selected_name);
        if(selected_name !== ''){
            this.setState({
                selected_place:place_option_name,
                name:    selected_name,
                location:selected_location,
            });
        }
        this.setModel();

        /*Store.get(name).then(function(value){
            if(value!=null){
              console.log(value)
              _this.setState({
                selected_place:name,
                name:value.split(':')[0],
                location:value.split(':')[1],
              });
            }else{
              _this.setState({
                selected_place:name,
                name:'',
                location:'',
              });
            }
            //console.log('loadApi:'+name+',data:'+JSON.stringify(value))
            _this.setModel();
            //_this.loginForm.forceRender();
        })*/
    }
    getLockIcon(){
        if(this.state.disabled) return 'lock'
        return 'unlock-alt'
    }
    switchEditMode(){
        if(this.state.disabled) this.setState({disabled:false})
        else this.setState({disabled:true})
    }
    setModel(){
      let model = {
            name: {
                disabled: this.state.disabled,
                type: Form.fieldType.String,
                label: "Name",
                value: this.state.name,
            },
            location: {
                disabled: this.state.disabled,
                type: Form.fieldType.String,
                label: "Location",
                multiline: false,
                value: this.state.location,
                //onFieldChange: (value, ref)=>{
                    //this.setState({location: value})
                    //this.ref.setNativeProps({text: value});
                    //console.log(ref)
                //}
            },
            //RN 0.23.1  Picker cannot inside form, many issues
            /*place_type: {
                type: Form.fieldType.Select,
                disabled: false,
                label: "API Types",
                //valueStyle: {},
                values: [{id:"0",label:"Yahoo",value:"yql"},{id:"1",label:"Url",value:"url"}],
                selected: this.state.place_type,
                onChange:(value)=>{
                    this.setState({place_type:value})
                }
            },*/
        };
        this.setState({model:model})
    }
    render(){
        //console.log('rendering....this.state.place_list:'+JSON.stringify(this.state.place_list));
        return (
            <View style={{flex:1}}>
                  <NavigationBar style={Style.navbar} title={{title: 'Edit Place',}}
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
                <View style={styles.container}>
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
/*
                    <Picker selectedValue={this.state.selected_place} onValueChange={(value)=> { this.loadApi(value)}}>
                        {this.state.place_list.map(function(item,n){
                            return <Picker.Item key={item} label={item} value={item} />;
                        })}
                    </Picker>
*/

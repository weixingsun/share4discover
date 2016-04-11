'use strict';
 
import React,{Alert, Component, Picker, StyleSheet, Text, View } from 'react-native';
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
            selected_api:"-- Add Another API --",
            disabled: false,
            name:'',
            title:'',
            yql:'',
            path:'',
            subpath:'',
            filter:'',
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
              "Do you want to overwrite "+form.name+" ? \n"+JSON.stringify(value),
              [
                {text:"Cancel", },
                {text:"OK", onPress:()=>{
                    _this.save();
                }},
              ]
            );
          }else{
              _this.save(form);
              //
              _this.props.navigator.pop();
          }
        })
    }
    save(){
        var form = this.loginForm.getValue();
        Store.save(form.name,form);
        if (this.state.api_list.indexOf(form.name) == -1) {
            this.state.api_list.push(form.name);
            Store.save(Store.API_LIST_NAME,this.state.api_list)
        }
    }
    load(){
        var _this=this;
        Store.get(Store.API_LIST_NAME).then(function(list){
            if(list==null) return;
            _this.setState({api_list:list});
            console.log('load:'+JSON.stringify(list));
        })
    }
    loadApi(name){
        var _this=this;
        //console.log('loadApi:'+name);
        Store.get(name).then(function(value){
            if(value!=null)
            _this.setState({
               selected_api:name,
               name:value.name,
               title:value.title,
               yql:value.yql,
               path:value.path,
               subpath:value.subpath,
               filter:value.filter,
            });
            else
            _this.setState({
               selected_api:name,
               name:'',
               title:'',
               yql:'',
               path:'',
               subpath:'',
               filter:'',
            });
            //console.log('loadApi:'+name+',data:'+JSON.stringify(value))
            _this.setModel();
            //_this.loginForm.forceRender();
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
      let model = {
            title: {
                disabled: this.state.disabled,
                type: Form.fieldType.String,
                label: "Title",
                value: this.state.title,
            },
            name: {
                disabled: this.state.disabled,
                type: Form.fieldType.String,
                label: "Name",
                value: this.state.name,
            },
            filter: {
                disabled: this.state.disabled,
                type: Form.fieldType.String,
                label: "Filter",
                multiline: true,
                value: this.state.filter,
                ///onFieldChange: (value, ref)=>{
                    //new value, ref to element
                //}
            },
            /*url: {
                type: Form.fieldType.String,
                label: "Url",
                value: "",
                onFieldChange: (value, ref)=>{
                    //new value, ref to element
                }
            },*/
            yql: {
                disabled: this.state.disabled,
                type: Form.fieldType.String,
                label: "YQL",
                multiline: true,
                value: this.state.yql,
                //onFieldChange: (value, ref)=>{
                    //new value, ref to element
                //}
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
            /*api_type: {
                type: Form.fieldType.Select,
                disabled: false,
                label: "API Types",
                //valueStyle: {},
                values: [{id:"0",label:"Yahoo",value:"yql"},{id:"1",label:"Url",value:"url"}],
                selected: this.state.api_type,
                onChange:(value)=>{
                    this.setState({api_type:value})
                }
            },*/
        };
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
                    <Picker selectedValue={this.state.selected_api} onValueChange={(value)=> { this.loadApi(value)}}>
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

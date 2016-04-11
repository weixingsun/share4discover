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
            api_type: 'url',
            disabled: false,
        }
        //this.save=this.save.bind(this)
    }
    
    onButtonPress(){
        var _this=this;
        var form = this.loginForm.getValue();
        Store.get(form.name).then(function(value){
          //alert(' overwrite: ' + JSON.stringify(form))
          if(value!=null){
            Alert.alert(
              "Overwrite",
              "Do you want to overwrite "+form.name+" ? \n"+JSON.stringify(value),
              [
                {text:"Cancel", },
                {text:"OK", onPress:()=>{
                    //alert(' overwrite: ' + JSON.stringify(form))
                    _this.save();
                }},
              ]
            );
          }else{
              _this.save(form);
          }
        })
    }
    save(){
        var form = this.loginForm.getValue();
        console.log(form)
        Store.save(form.name,form);
    }
    getEditText(){
        if(this.state.disabled) return "Disabled"
        else return "Edit"
    }
    getLockIcon(){
        if(this.state.disabled) return 'ios-locked-outline'
        return 'ios-unlocked-outline'
    }
    switchEditMode(){
        if(this.state.disabled) this.setState({disabled:false})
        else this.setState({disabled:true})
    }
    render(){
      let model = {
            title: {
                disabled: this.state.disabled,
                type: Form.fieldType.String,
                label: "Title",
                value: "My Exchange Rates Watch List Simple",
            },
            name: {
                disabled: this.state.disabled,
                type: Form.fieldType.String,
                label: "Name",
                value: "exchange1",
            },
            filter: {
                disabled: this.state.disabled,
                type: Form.fieldType.String,
                label: "Filter",
                multiline: true,
                value: "USD/CNY,USD/NZD",
                onFieldChange: (value, ref)=>{
                    //console.log(value);
                    //console.log(ref);
                }
            },
            /*url: {
                type: Form.fieldType.String,
                label: "Url",
                value: "",
                onFieldChange: (value, ref)=>{
                    console.log(value);
                    //console.log(ref);
                }
            },*/
            yql: {
                disabled: this.state.disabled,
                type: Form.fieldType.String,
                label: "YQL",
                multiline: true,
                value: 'select * from yahoo.finance.xchange where pair in ("USDCNY","USDNZD")',
                onFieldChange: (value, ref)=>{
                    //console.log(value);
                    //console.log(ref);
                }
            },
            path: {
                disabled: this.state.disabled,
                type: Form.fieldType.String,
                label: "Path",
                value: '$.query.results.rate',
                onFieldChange: (value, ref)=>{
                    //console.log(value);
                    //console.log(ref);
                }
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
 
        return (
            <View style={{flex:1}}>
                  <NavigationBar style={Style.navbar} title={{title: 'Add a Json API',}}
                   leftButton={
                     <View style={{flexDirection:'row',}}>
                       <IIcon name={"close"} color={'#333333'} size={30} onPress={() => this.props.navigator.pop() } />
                     </View>
                   }
                   rightButton={
                     <View style={{flexDirection:'row',}}>
                        <Text size={28} onPress={() => this.switchEditMode()}>{this.getEditText()}</Text>
                     </View>
                   }
                  />
                <View style={styles.container}>
                    <View style={styles.qrContainer}>
                        <IIcon name={this.getLockIcon()} size={60}/>
                    </View>
                    <Picker selectedValue={this.state.api_type} onValueChange={(value)=> this.setState({api_type:value}) }>
                        {[{id:"0",label:"Yahoo",value:"yql"},{id:"1",label:"Url",value:"url"}].map(function(item){
                            return <Picker.Item key={item.id} label={item.label} value={item.value} />;
                        })}
                    </Picker>
                    <Form
                        style={{flex:1}}
                        ref={(frm)=> this.loginForm = frm}
                        model={model}
                    />
                    <Button onPress={this.onButtonPress.bind(this)}>
                       Save
                    </Button>
                </View>
            </View>
        );
    }
}
/*
                   rightButton={
                     <View style={{flexDirection:'row',}}>
                        <Text size={28} onPress={() => this.save()}>Apply</Text>
                     </View>
                   }
                        <Picker
                            //ref={this.componentId}
                            //name={name}
                            style={model.valueStyle}
                            //type={model.type}
                            //values={model.value}
                            selectedValue={model.selected}
                            //disabled={model.disabled}
                            onValueChange={model.onChange}
                        >
                            {
                              model.values.map(function(item){
                                 return <Picker.Item key={item.id} label={item.label} value={item.value} />;
                              })
                            }
                        </Picker>
                    <Picker selectedValue={this.state.language} onValueChange={(lang) => this.setState({language: lang})}>
                      <Picker.Item label="Java" value="java" />
                      <Picker.Item label="JavaScript" value="js" />
                    </Picker>
*/
var styles = StyleSheet.create({
    container: {
        flexDirection: 'column',
        flex: 1,
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

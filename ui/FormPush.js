'use strict'
import React, { Component } from 'react'
import {Alert, DeviceEventEmitter, Image, Linking, ListView, Picker, Platform, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
//import jsonpath from '../io/jsonpath'
import Store from '../io/Store'
import Global from '../io/Global'
import Net from '../io/Net'
import Push from '../io/Push'
import Style from './Style'
import Loading from './Loading'
//import PlaceForm from './PlaceForm'
import NavigationBar from 'react-native-navbar'
import {Icon} from './Icon'
import { GiftedForm, GiftedFormManager } from 'react-native-gifted-form'
import I18n from 'react-native-i18n';
import xml2js from 'xml2js'
import xpath from 'xml2js-xpath'

var styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
    },
    scrollViewContainer: {
        flex: 1,
        flexDirection: 'column',
        padding: 15,
    },
    listViewContainer: {
        flex: 1,
        flexDirection: 'column',
    },
    buttonContainer: {
        flex: 1,
        flexDirection: 'column',
        padding: 15,
      	backgroundColor: "#EEE",
    },
    header: {
        flex: 0,
        flexDirection: "row",
        justifyContent: "space-between",
        padding: 6,
        backgroundColor: "#387ef5",
    },
});

export default class FormFeed extends React.Component{
    constructor(props){
        super(props);
        this.ds = new ListView.DataSource({
            rowHasChanged: (row1, row2) => row1 !== row2,
            sectionHeaderHasChanged: (s1, s2) => s1 !== s2,
        });
        this.push_fields = { 
            type:true,
            cat:true,
            city:false,
            country:false
        }
        this.state = {
            form: {
                type:'car',
                cat:'rent0',
                city:'',
                country:'',
            }
        };
        this.formName='newPushForm'
    }
    componentWillMount() {
        GiftedFormManager.reset(this.formName);
        if(this.props.push){
            this.setState({
                form: this.props.push
            });
        }else{
            this.getLocation()
        }
    }
    componentDidMount(){
    }
    componentWillUnmount(){
        //this.event.remove();
    }
    handleValueChange(form){
        if(typeof form.type === 'object'){
            if(form.type[0] !=null && typeof form.type[0] === 'string'){
                this.setState({ form:{...this.state.form,type:form.type[0]} })
                //this.getFeedName(form)
            }
        }else if(typeof form.cat === 'object'){
            if(form.cat[0] !=null && typeof form.cat[0] === 'string'){
                this.setState({ form:{...this.state.form,cat:form.cat[0]} })
                //this.getFeedName(form)
            }
        }
        //alert('form:'+JSON.stringify(form))
    }
    onSubmit(values){
        //alert(JSON.stringify(values))
        let tag = Global.getTagNameFromJson(values)  //{country,city,type,cat}
        Push.instance.setTag(tag,(state)=>{
            if(state.status===0) alert("Tag "+tag+" added")
            else alert("Add tag "+tag+" failed.");
        });
        DeviceEventEmitter.emit('refresh:PushList',values);
        this.props.navigator.pop()
    }
    getLocation(form){
        let self=this
        Net.getLocation().then((gps)=>{
            //alert(JSON.stringify(gps))
            self.setState({ form:{ ...self.state.form, city:gps.city.toLowerCase(), country:gps.country_code.toLowerCase() } })
        })
    }
    renderField(name,editable){
      if(name==='type')
        return this.renderTypeField()
      else if(name==='cat')
        return this.renderCatField()
      else
        return this.renderTextField(name,editable)
    }
    renderTypeField(){
        return (
            <GiftedForm.ModalWidget
                title={I18n.t('cat')}
                name='type'
                key='type'
                display={I18n.t(this.state.form.type)}
                value={this.state.form.type}
                image={<View style={{width:30,alignItems:'center'}}><Icon name={Global.TYPE_ICONS[this.state.form.type]} size={30} /></View>}
            >
                <GiftedForm.SeparatorWidget />
                <GiftedForm.SelectWidget name='type' title='Category' multiple={false} onSelect={()=>this.props.navigator.pop()}>
                    {this.renderTypeOptions()}
                </GiftedForm.SelectWidget>
            </GiftedForm.ModalWidget>
        )
    }
    renderTypeOptions(){
        let arr = Object.keys(Global.TYPE_ICONS)
        return arr.map((key,i)=>{
            return <GiftedForm.OptionWidget
                       key={'type'+i}
                       title={I18n.t(key)}
                       value={key}
                       image={(
                           <View style={{width:80,alignItems:'center'}}>
                               <Icon name={Global.TYPE_ICONS[key]} size={40} />
                           </View>
                       )} />
        })
    }
    renderCatField(){
        return (
            <GiftedForm.ModalWidget
                title={I18n.t('type')}
                name='cat'
                key='cat'
                display={I18n.t(this.state.form.cat)}
                value={this.state.form.cat}
                image={<View style={{width:30,alignItems:'center'}}><Icon name={'ion-ios-list'} size={30} /></View>}
                >
                <GiftedForm.SeparatorWidget />
                <GiftedForm.SelectWidget name='cat' title='Type' multiple={false} onSelect={()=>this.props.navigator.pop()}>
                    {this.renderCatOptions()}
                </GiftedForm.SelectWidget>
            </GiftedForm.ModalWidget>
        )
    }
    renderCatOptions(){
        let no_rent = Global.no_rent_types.indexOf(this.state.form.type)>-1?true:false
        let cats = no_rent?Global.sec_types_no_rent:Global.sec_types_all
        return cats.map((key,id)=>{
            return <GiftedForm.OptionWidget
                    key={'cat'+id}
                    title={I18n.t(key.value)}
                    value={key.value}
                    image={(
                         <View style={{width:80,alignItems:'center'}}>
                             <Icon name={key.icon} size={30} />
                         </View>
                    )} />
        })
    }
    renderTextField(name,editable){
        return (
            <GiftedForm.TextInputWidget
                key={name}
                name={name}
                title={I18n.t(name)}
                //placeholder='Enter'
                editable={editable}
                clearButtonMode='while-editing'
                value={this.state.form[name]}
                //displayValue='title'
                //validationResults={this.state.validationResults}
            />)
    }
    renderFieldsBySource(obj){
        let keys = Object.keys(obj)
        return keys.map((key)=>{
            return this.renderField(key,obj[key])
        })
    }
    render() {
        let title1 = this.props.feed==null?'Create a Push Listener':'Edit Listener: '+this.state.form.name
        return(
        <View style={{flex:1}}>
          <NavigationBar style={Style.navbar} title={{title: title1}}
             leftButton={
                <View style={{flexDirection:'row',}}>
                  <Icon name={"ion-ios-arrow-round-back"} color={'#333333'} size={40} onPress={() => this.props.navigator.pop() } />
                </View>
             }
             //<Icon name={"ion-ios-search-outline"} color={'#333333'} size={40} onPress={this.getAllTags}  />
             //rightButton={}
          />
          <View style={styles.container}>
                <GiftedForm
                    formName={this.formName}
                    style={{flex:1,marginLeft:10,marginRight:10}}  //height:form_height
                    openModal={(route) => { route.giftedForm = true; this.props.navigator.push(route) }}
                    onValueChange={this.handleValueChange.bind(this)}
                    //validators={ this.validators }
                    defaults={this.state.form}
                    >
                        {this.renderFieldsBySource(this.push_fields)}
                        <GiftedForm.SubmitWidget
                            title={I18n.t('submit')}
                            widgetStyles={{
                                submitButton: {
                                    backgroundColor: '#6495ED',
                                }
                            }}
                            onSubmit={(isValid, values, validationResults, postSubmit = null, modalNavigator = null) => {
                                if (isValid === true) {
                                    //alert(JSON.stringify(values))
                                    postSubmit();
                                    this.onSubmit(values)
                                }
                            }}
                       />
                </GiftedForm>
          </View>
        </View>
        )
    }
};
//<GiftedForm.OptionWidget title='WEB' value='web' />

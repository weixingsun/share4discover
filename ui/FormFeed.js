'use strict'
import React, { Component } from 'react'
import {Alert, DeviceEventEmitter, Image, Linking, ListView, Picker, Platform, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
//import jsonpath from '../io/jsonpath'
import Store from '../io/Store'
import Global from '../io/Global'
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
        this.feed_types = { rss:{url:true,name:false}, yql:{yql:true,name:true}, web:{url:true,name:false},}
        this.state = {
            type: 'rss',
            form: {
                url:   '',
                name:  '',
            }
        };
    }
    getValueObj(str){
        let fields = JSON.parse(this.props.feed)
        let type = fields.type
        delete fields.type
        return {type:type, fields:fields}
    }
    componentWillMount() {
        if(this.props.feed){
            //alert(JSON.stringify(this.props.feed))
            let obj = this.getValueObj(this.props.feed)
            //alert(JSON.stringify(obj))
            this.setState({
                type: obj.type,
                form: obj.fields,
            });
        }
    }
    componentDidMount(){
        //this.event = DeviceEventEmitter.addListener('refresh:'+this.className,this.refresh);
    }
    componentWillUnmount(){
        //this.event.remove();
    }
    handleValueChange(form){
        if(typeof form.type === 'object'){
            if(form.type[0] !=null && typeof form.type[0] === 'string'){
                //form.type = form.type[0]
                this.setState({ type:form.type[0] })
            }
        }
        //alert('form:'+JSON.stringify(form))
    }
    onSubmit(values){
        //alert(JSON.stringify(values))
        Store.insertFeed(values)
        DeviceEventEmitter.emit('refresh:FeedList',values);
        this.props.navigator.pop()
    }
    getFeedName(formValues){
        let self=this
        //alert(JSON.stringify(formValues))
        if(formValues.type==='rss'){
          fetch(formValues.url).then(function(result){
            if (result.status===200){
                xml2js.parseString(result._bodyText, function(err,json){
                    let title = xpath.find(json, "/rss/channel/title")[0];
                    self.setState({
                        form:{ ...self.state.form, name:title },
                    })
                })
            }
          })
        }else if(formValues.type==='yql'){
          let title = formValues.yql.split('from')[1]
          //let table = arr[0].split('from')[1]
          self.setState({ form:{ ...self.state.form, name:title }, })
        }else if(formValues.type==='web'){
          let title = formValues.url
          self.setState({ form:{ ...self.state.form, name:title }, })
        }
    }
    cap1(str){
        return str.charAt(0).toUpperCase() + str.slice(1);
    }
    renderField(name,editable){
        return (
            <GiftedForm.TextInputWidget
                key={name}
                name={name}
                title={this.cap1(name)}
                //placeholder='Enter'
                editable={editable}
                clearButtonMode='while-editing'
                value={this.state.form[name]}
                //displayValue='title'
                //validationResults={this.state.validationResults}
            />)
    }
    renderTypeFields(obj){
        let keys = Object.keys(obj)
        return keys.map((key)=>{
            return this.renderField(key,obj[key])
        })
    }
    render() {
        //alert('render.map:'+this.state.map+'\nmap.type='+this.state.map_type+'\nmap.traffic='+this.state.map_traffic)
        let title1 = this.props.feed==null?'Create a Feed Source':'Edit Feed: '+this.state.form.name
        let submit_name = (this.state.form.name==='')?'Validate':'Submit'
        return(
        <View style={{flex:1}}>
          <NavigationBar style={Style.navbar} title={{title: title1}}
             leftButton={
                <View style={{flexDirection:'row',}}>
                  <Icon name={"ion-ios-arrow-round-back"} color={'#333333'} size={40} onPress={() => this.props.navigator.pop() } />
                </View>
             }
             rightButton={
                <View style={{flexDirection:'row',}}>
                  <Icon name={"ion-ios-search-outline"} color={'#333333'} size={40} onPress={() => Linking.openURL('http://ctrlq.org/rss') } />
                </View>
             }
          />
          <View style={styles.container}>
                <GiftedForm
                    formName='newFeedForm'
                    style={{flex:1,marginLeft:10,marginRight:10}}  //height:form_height
                    openModal={(route) => { route.giftedForm = true; this.props.navigator.push(route) }}
                    onValueChange={this.handleValueChange.bind(this)}
                    //validators={ this.validators }
                    defaults={this.state.form}
                    >
                        <GiftedForm.ModalWidget
                            title='Type'
                            name='type'
                            display={this.state.type.toUpperCase()}
                            value={this.state.type}
                            //validationResults={this.state.validationResults}
                        >
                            <GiftedForm.SeparatorWidget />
                            <GiftedForm.SelectWidget name='type' title='Type' multiple={false}>
                                <GiftedForm.OptionWidget title='RSS' value='rss' />
                                <GiftedForm.OptionWidget title='WEB' value='web' />
                                <GiftedForm.OptionWidget title='YQL' value='yql' />
                            </GiftedForm.SelectWidget>
                        </GiftedForm.ModalWidget>
                        {this.renderTypeFields(this.feed_types[this.state.type])}
                        <GiftedForm.SubmitWidget
                            title={submit_name}
                            widgetStyles={{
                                submitButton: {
                                    backgroundColor: '#6495ED',
                                }
                            }}
                            onSubmit={(isValid, values, validationResults, postSubmit = null, modalNavigator = null) => {
                                if (isValid === true) {
                                    //alert(JSON.stringify(values))
                                    postSubmit();
                                    if(typeof values.type === 'object') values.type=values.type[0]
                                    //alert(JSON.stringify(values))
                                    if(values.name===''){
                                        this.getFeedName(values)
                                    }else{
                                        this.onSubmit(values)
                                    }
                                }
                            }}
                       />
                </GiftedForm>
          </View>
        </View>
        )
    }
};

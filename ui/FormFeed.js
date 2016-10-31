'use strict'
import React, { Component } from 'react'
import {Alert, DeviceEventEmitter, Image, Linking, ListView, Picker, Platform, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
//import jsonpath from '../io/jsonpath'
import Store from '../io/Store'
import Global from '../io/Global'
import Net from '../io/Net'
import Style from './Style'
import Loading from './Loading'
//import PlaceForm from './PlaceForm'
import NavigationBar from 'react-native-navbar'
import {Icon} from './Icon'
import { GiftedForm, GiftedFormManager } from 'react-native-gifted-form'
import I18n from 'react-native-i18n';
import xml2js from 'xml2js'
import xpath from 'xml2js-xpath'
import OneSignal from 'react-native-onesignal';

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
        this.feed_sources = { 
          share:{type:true,cat:true,area:false,name:false},  //freq:false
            rss:{url:true,name:false}, 
            yql:{yql:true,name:true}, 
            //web:{url:true,name:false},
        }
        this.state = {
            source: 'rss',
            form: {
                url:   '',
                name:  '',
            }
        };
    }
    getValueObj(str){
        let fields = JSON.parse(this.props.feed)
        let source = fields.source
        delete fields.source
        return {source:source, fields:fields}
    }
    componentWillMount() {
        if(this.props.feed){
            //alert(JSON.stringify(this.props.feed))
            let obj = this.getValueObj(this.props.feed)
            //alert(JSON.stringify(obj))
            this.setState({
                source: obj.source,
                form: obj.fields,
            });
        }
    }
    componentDidMount(){
    }
    componentWillUnmount(){
        //this.event.remove();
    }
    handleValueChange(form){
        if(typeof form.source === 'object'){
            if(form.source[0] !=null && typeof form.source[0] === 'string'){
                //form.type = form.type[0]
                this.setState({ source:form.source[0] })
            }
        }
        //alert('form:'+JSON.stringify(form))
    }
    onSubmit(values){
        //alert(JSON.stringify(values))
        Store.insertFeed(values)
        OneSignal.sendTag(values.name, values.area);
        DeviceEventEmitter.emit('refresh:FeedList',values);
        this.props.navigator.pop()
    }
    getFeedName(formValues){
        let self=this
        //alert(JSON.stringify(formValues))
        if(formValues.source==='rss'){
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
        }else if(formValues.source==='yql'){
          let title = formValues.yql.split('from')[1]
          //let table = arr[0].split('from')[1]
          self.setState({ form:{ ...self.state.form, name:title }, })
        }else if(formValues.source==='web'){
          let title = formValues.url
          self.setState({ form:{ ...self.state.form, name:title }, })
        }else if(formValues.source==='share'){
          Net.getLocation().then((gps)=>{
              //alert(JSON.stringify(gps))
              let title = formValues.type+'_'+formValues.cat
              let area  = (gps.country_code+'_'+gps.city).toLowerCase() //+'_'+formValues.freq
              self.setState({ form:{ ...self.state.form, area:area, name:title } })
          })
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
                            title={I18n.t('source')}
                            name='source'
                            display={this.state.source.toUpperCase()}
                            value={this.state.source}
                            //validationResults={this.state.validationResults}
                        >
                            <GiftedForm.SeparatorWidget />
                            <GiftedForm.SelectWidget name='source' title='Source' multiple={false} onSelect={()=>this.props.navigator.pop()}>
                                <GiftedForm.OptionWidget title='RSS' value='rss' />
                                <GiftedForm.OptionWidget title='YQL' value='yql' />
                                <GiftedForm.OptionWidget title='Share' value='share' />
                            </GiftedForm.SelectWidget>
                        </GiftedForm.ModalWidget>
                        {this.renderTypeFields(this.feed_sources[this.state.source])}
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
                                    if(typeof values.source === 'object') values.source=values.source[0]
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
//<GiftedForm.OptionWidget title='WEB' value='web' />

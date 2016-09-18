'use strict'
import React, { Component } from 'react'
import {Alert, DeviceEventEmitter, Image, ListView, Picker, Platform, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
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
//import YQL from 'yql' //sorry, react native is not nodejs

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
        this.type_list = ['rss'];
        this.state = {
            form: {
                type:  'rss',
                url:   '',
                name:  '',

                typeTitle: 'RSS',
            }
        };
    }
    componentWillMount() {
        if(this.props.feed){
            //alert(JSON.stringify(this.props.feed))
            let array = this.props.feed.split('|')
            let type = array[0]
            let url = array[1]
            let name = array.length===3?array[2]:''
            this.setState({
                form: {
                    type:  type,
                    url:   url,
                    name:  name,

                    typeTitle: type,
                }
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
        /*if(typeof form.type === 'object'){
            if(form.type[0] !=null && typeof form.type[0] === 'string'){
                form.type = form.type[0]
            }
        }*/
        //alert('form:'+JSON.stringify(form))
    }
    onSubmit(values){
        if(typeof values.type === 'object') values.type=values.type[0]
        let obj = values.type+'|'+values.url+'|'+values.name
        Store.insertFeed(obj)
        DeviceEventEmitter.emit('refresh:FeedList',obj);
        this.props.navigator.pop()
    }
    getFeedName(url){
        let self=this
        fetch(url).then(function(result){
            if (result.status===200){
                xml2js.parseString(result._bodyText, function(err,json){
                    let title = xpath.find(json, "/rss/channel/title")[0];
                    self.setState({
                        form:{ ...self.state.form, name:title },
                    })
                })
            }
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
                            display={this.state.form.typeTitle}
                            value={this.state.form.type}
                            //validationResults={this.state.validationResults}
                        >
                            <GiftedForm.SeparatorWidget />
                            <GiftedForm.SelectWidget name='type' title='Type' multiple={false}>
                                <GiftedForm.OptionWidget title='RSS' value='rss' />
                                <GiftedForm.OptionWidget title='Web' value='web' />
                            </GiftedForm.SelectWidget>
                        </GiftedForm.ModalWidget>
                        <GiftedForm.TextInputWidget
                            name='url'
                            title='URL'
                            placeholder='Enter URL'
                            clearButtonMode='while-editing'
                            //displayValue='title'
                            value={this.state.form.url}
                            //validationResults={this.state.validationResults}
                        />
                        <GiftedForm.TextInputWidget
                            name='name'
                            title='Name'
                            placeholder='Auto Fill'
                            clearButtonMode='while-editing'
                            editable={false}
                            value={this.state.form.name}
                            //validationResults={this.state.validationResults}
                        />
                        <GiftedForm.SubmitWidget
                            title={submit_name}
                            widgetStyles={{
                                submitButton: {
                                    backgroundColor: '#6495ED',
                                }
                            }}
                            onSubmit={(isValid, values, validationResults, postSubmit = null, modalNavigator = null) => {
                                if (isValid === true) {
                                    //values.type = values.type[0];
                                    postSubmit();
                                    if(this.state.form.name===''){
                                        this.getFeedName(values.url)
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

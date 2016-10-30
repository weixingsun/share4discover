'use strict'
import React, { Component } from 'react'
import {Alert, Image, ListView, Picker, Platform, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
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

export default class Settings extends React.Component{
    constructor(props){
        super(props);
        this.ds = new ListView.DataSource({
            rowHasChanged: (row1, row2) => row1 !== row2,
            sectionHeaderHasChanged: (s1, s2) => s1 !== s2,
        });
        this.map_list = [Global.GoogleMap,Global.BaiduMap];
        this.map_traffic_list = ['true','false'];
        this.map_type_list = [Global.MAP_TYPE_NORMAL,Global.MAP_TYPE_SATELLITE];
        this.place_list = [];
        this.mapTitleIos = Platform.OS==='ios'?I18n.t('apple')+I18n.t('map'):I18n.t('gg')+I18n.t('map')
        this.state = {
            //isLoading:true,
            form: {
                map:        Global.MAP,
                map_type:   Global.MAP_TYPE,
                map_traffic:Global.MAP_TRAFFIC,
                //mapTitle:       Global.MAP===Global.GoogleMap?this.mapTitleIos:I18n.t('baidu')+I18n.t('map'),
            }
            //editable: false,
            //timerEnabled: false,
            //dataSource: this.ds.cloneWithRows(this.place_list),
        };
    }
    componentWillMount() {
    }
    componentDidMount() {
    }
    //componentWillUnmount() {}

    handleValueChange(form){
        if(typeof form.map === 'object'){
            if(form.map[0] !=null && typeof form.map[0] === 'string'){
                Store.save_string(Store.SETTINGS_MAP,form.map[0])
                Global.MAP=form.map[0]
            }
        }
        if(typeof form.map_type === 'object'){
            if(form.map_type[0] !=null && typeof form.map_type[0] === 'string'){
                Store.save_string(Store.SETTINGS_MAP_TYPE,form.map_type[0])
                Global.MAP_TYPE=form.map_type[0]
            }
        }
        if(typeof form.map_traffic === 'object'){
            if(form.map_traffic[0] !=null && typeof form.map_traffic[0] === 'string'){
                Store.save_string(Store.SETTINGS_MAP_TRAFFIC,form.map_traffic[0])
                Global.MAP_TRAFFIC=form.map_traffic[0]
            }
        }
        //alert('form:'+JSON.stringify(form))
    }
    render() {
        //alert('render.map:'+this.state.map+'\nmap.type='+this.state.map_type+'\nmap.traffic='+this.state.map_traffic)
        //if(this.state.isLoading) return <Loading />
        //<Icon name={"ion-ios-timer-outline"} color={this.getColor(this.state.timerEnabled)} size={30} onPress={() => this.enableTimer() } />
        let titleName = I18n.t('map')+' '+I18n.t('settings')
        let google = Platform.OS==='ios'?I18n.t('apple'):I18n.t('gg')
        return(
        <View style={{flex:1}}>
          <NavigationBar style={Style.navbar} title={{title: titleName}}
             leftButton={
                <View style={{flexDirection:'row',}}>
                  <Icon name={"ion-ios-arrow-round-back"} color={'#333333'} size={40} onPress={() => this.props.navigator.pop() } />
                </View>
             }
          />
          <View style={styles.container}>
                <GiftedForm
                    formName='mapSettingsForm'
                    style={{flex:1,marginLeft:10,marginRight:10}}  //height:form_height
                    openModal={(route) => { route.giftedForm = true; this.props.navigator.push(route) }}
                    onValueChange={this.handleValueChange.bind(this)}
                    //validators={ this.validators }
                    defaults={this.state.form}
                    >
                        <GiftedForm.ModalWidget
                            title={I18n.t('map')}
                            name='map'
                            display={I18n.t(this.state.form.map)}
                            value={this.state.form.map}
                            //validationResults={this.state.validationResults}
                        >
                            <GiftedForm.SeparatorWidget />
                            <GiftedForm.SelectWidget name='map' title='Map' multiple={false} onSelect={()=>this.props.navigator.pop()}>
                                <GiftedForm.OptionWidget title={google} value='gg' />
                                <GiftedForm.OptionWidget title={I18n.t('baidu')}  value='baidu' />
                            </GiftedForm.SelectWidget>
                        </GiftedForm.ModalWidget>
                        <GiftedForm.ModalWidget
                            title={I18n.t('type')}
                            name='map_type'
                            display={I18n.t(this.state.form.map_type)}
                            value={this.state.form.mapType}
                            //validationResults={this.state.validationResults}
                        >
                            <GiftedForm.SeparatorWidget />
                            <GiftedForm.SelectWidget name='map_type' title='Map Type' multiple={false} onSelect={()=>this.props.navigator.pop()}>
                                <GiftedForm.OptionWidget title={I18n.t('standard')} value='standard' />
                                <GiftedForm.OptionWidget title={I18n.t('satellite')} value='satellite' />
                            </GiftedForm.SelectWidget>
                        </GiftedForm.ModalWidget>
                        <GiftedForm.ModalWidget
                            title={I18n.t('traffic')}
                            name='map_traffic'
                            display={I18n.t(this.state.form.map_traffic)}
                            value={this.state.form.map_traffic}
                            //validationResults={this.state.validationResults}
                        >
                            <GiftedForm.SeparatorWidget />
                            <GiftedForm.SelectWidget name='map_traffic' title='Real Time Traffic' multiple={false} onSelect={()=>this.props.navigator.pop()}>
                                <GiftedForm.OptionWidget title={I18n.t('yes')} value='yes' />
                                <GiftedForm.OptionWidget title={I18n.t('no')} value='no' />
                            </GiftedForm.SelectWidget>
                        </GiftedForm.ModalWidget>
                </GiftedForm>
          </View>
        </View>
        )
    }
/*
             <TouchableOpacity style={styles.header} >
                 <Text>Map & Search Engine Provider</Text>
             </TouchableOpacity>
*/
};

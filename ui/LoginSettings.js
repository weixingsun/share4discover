'use strict'
import React, { Component } from 'react'
import {Alert, Image, ListView, Picker, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
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
        backgroundColor: Style.normal_color,
    },
});

export default class LoginSettings extends React.Component{
    constructor(props){
        super(props);
        this.ds = new ListView.DataSource({
            rowHasChanged: (row1, row2) => row1 !== row2,
            sectionHeaderHasChanged: (s1, s2) => s1 !== s2,
        });
        this.state = {
            //isLoading:true,
            form: {
                fb:   Global.SETTINGS_LOGINS['fb'],
                gg:   Global.SETTINGS_LOGINS['gg'],
                wx:   Global.SETTINGS_LOGINS['wx'],
                wb:   Global.SETTINGS_LOGINS['wb'],
            }
            //editable: false,
            //timerEnabled: false,
            //dataSource: this.ds.cloneWithRows(this.place_list),
        };
        //this.reload=this.reload.bind(this);
        //this._renderRow=this._renderRow.bind(this);
        //this.switchEdit=this.switchEdit.bind(this);
        //this.getLockIcon=this.getLockIcon.bind(this);
    }
    componentWillMount() {
    }
    componentDidMount() {
    }
    //componentWillUnmount() {}

    clone(hash) {
        var json = JSON.stringify(hash);
        var object = JSON.parse(json);
        return object;
    }
    handleValueChange(form){
        let oldlogins = this.clone(this.state.form)
        let logins = this.state.form
        if(typeof form.fb === 'object'){
            let login = form.fb[0]
            if(login !=null && typeof login === 'string'){
                Global.SETTINGS_LOGINS['fb']=login
                logins.fb=login
            }
        }
        if(typeof form.gg === 'object'){
            let login = form.gg[0]
            if(login !=null && typeof login === 'string'){
                Global.SETTINGS_LOGINS['gg']=login
                logins.gg=login
            }
        }
        if(typeof form.wb === 'object'){
            let login = form.wb[0]
            if(login !=null && typeof login === 'string'){
                Global.SETTINGS_LOGINS['wb']=login
                logins.wb=login
            }
        }
        if(JSON.stringify(logins) != JSON.stringify(oldlogins)){
            Store.save(Store.SETTINGS_LOGINS,logins)
            //alert(JSON.stringify(logins))
        }
    }
    render() {
        //alert('render.map:'+this.state.map+'\nmap.type='+this.state.map_type+'\nmap.traffic='+this.state.map_traffic)
        //if(this.state.isLoading) return <Loading />
        //<Icon name={"ion-ios-timer-outline"} color={this.getColor(this.state.timerEnabled)} size={30} onPress={() => this.enableTimer() } />
        let titleName = I18n.t('login')+' '+I18n.t('settings')
        return(
        <View style={{flex:1}}>
          <NavigationBar style={Style.navbar} title={{title: titleName,tintColor:Style.font_colors.enabled}}
             leftButton={
                <View style={{flexDirection:'row',}}>
                  <Icon name={"ion-ios-arrow-round-back"} color={Style.font_colors.enabled} size={40} onPress={() => this.props.navigator.pop() } />
                </View>
             }
          />
          <View style={styles.container}>
             <TouchableOpacity style={styles.header} >
                 <Text style={{color:Style.font_colors.enabled}}>{I18n.t('share_via_sns')}</Text>
             </TouchableOpacity>
                <GiftedForm
                    formName='loginSettingsForm'
                    style={{flex:1,marginLeft:10,marginRight:10}}  //height:form_height
                    openModal={(route) => { route.giftedForm = true; this.props.navigator.push(route) }}
                    onValueChange={this.handleValueChange.bind(this)}
                    //validators={ this.validators }
                    defaults={this.state.form}
                    >
                        <GiftedForm.ModalWidget
                            title={I18n.t('fb')}
                            name='fb'
                            display={I18n.t(this.state.form.fb)}
                            value={this.state.form.fb}
                            //validationResults={this.state.validationResults}
                        >
                            <GiftedForm.SeparatorWidget />
                            <GiftedForm.SelectWidget name='fb' title='fb' multiple={false} onSelect={()=>this.props.navigator.pop()}>
                                <GiftedForm.OptionWidget title={I18n.t(Global.none)} value={Global.none} />
                                <GiftedForm.OptionWidget title={I18n.t(Global.post)} value={Global.post} />
                            </GiftedForm.SelectWidget>
                        </GiftedForm.ModalWidget>
                        <GiftedForm.ModalWidget
                            title={I18n.t('wb')}
                            name='wb'
                            display={I18n.t(this.state.form.wb)}
                            value={this.state.form.wb}
                            //validationResults={this.state.validationResults}
                        >
                            <GiftedForm.SeparatorWidget />
                            <GiftedForm.SelectWidget name='wb' title='wb' multiple={false} onSelect={()=>this.props.navigator.pop()}>
                                <GiftedForm.OptionWidget title={I18n.t(Global.none)} value={Global.none} />
                                <GiftedForm.OptionWidget title={I18n.t(Global.post)} value={Global.post} />
                            </GiftedForm.SelectWidget>
                        </GiftedForm.ModalWidget>
                </GiftedForm>
          </View>
        </View>
        )
    }
};
/*
                        <GiftedForm.ModalWidget
                            title='Google'
                            name='gg'
                            display={this.state.form.gg}
                            value={this.state.form.gg}
                            //validationResults={this.state.validationResults}
                        >
                            <GiftedForm.SeparatorWidget />
                            <GiftedForm.SelectWidget name='gg' title='gg' multiple={false}>
                                <GiftedForm.OptionWidget title={Global.none} value={Global.none} />
                                <GiftedForm.OptionWidget title={Global.post} value={Global.post} />
                            </GiftedForm.SelectWidget>
                        </GiftedForm.ModalWidget>
*/

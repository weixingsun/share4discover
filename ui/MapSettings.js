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

//xchange: 'select * from yahoo.finance.xchange where pair in (' + items + ')'
//weather: 'select * from weather.forecast where (location = 94089)'
//stock:   'select * from yahoo.finance.quote where symbol in (' + items + ')'
//path:    '$.query.results.rate[*]'   //'$.query.results.rate'
//field:   'Name,Rate,Date,Time,Ask,Bid'   //default all
//timer:   3

//API_NAME: exchange
//value: {"list":"USDCNY,USDAUD", "yql":"select * from yahoo.finance.xchange where pair in ", "path":"$.query.results.rate", "title":"My Exchange Rates Watch List"}
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
        this.state = {
            //isLoading:true,
            form: {
                map:        Global.MAP,
                map_type:   Global.MAP_TYPE,
                map_traffic:Global.MAP_TRAFFIC,

                mapTitle:       Global.MAP,
                mapTypeTitle:   Global.MAP_TYPE,
                mapTrafficTitle:Global.MAP_TRAFFIC,
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
    /*deleteItem(seq,name){
        Alert.alert(
          "Delete",
          "Do you want to delete "+name+" ?",
          [
            {text:"Cancel", },
            {text:"OK", onPress:()=>{
              this.place_list.splice(seq,1);
              this.reload();
            }},
          ]
        );
    }
    getLockIcon(){
        if(!this.state.editable) return 'ion-ios-lock-outline'
        return 'ion-ios-unlock-outline'
    }
    reload(){
        if(this.place_list.length>0){
            this.setState({
                isLoading:false,
                dataSource: this.state.dataSource.cloneWithRows(this.place_list),
            });
        }
    }
    _renderDeleteButton(id,name){
        if(this.state.editable)
            return <Icon name="ion-minus-circled" size={30} color="#C00" onPress={()=>this.deleteItem(id,name)} />
        else return null;
    }
    _renderRow(data, sectionID, rowID) {
        //alert(JSON.stringify(data))
        //let Arr = this.place_list.map((k, n) => {
        //    return <View key={n} style={{ height:Style.CARD_ITEM_HEIGHT, width:this.column_width, alignItems:'center', justifyContent: 'center', }}>
        //             <Text>{ k }</Text>
        //           </View>
        //})
        let Arr = <Text>{ data.split(':')[0] }</Text>
	return (
          <View style={Style.slim_card}>
            <TouchableOpacity style={{flex:1,marginLeft:10}} onPress={()=>{ this.props.navigator.push({  component: PlaceForm,  passProps: {data:data}  }); }} >
              <View style={{flexDirection:'row'}}>
                { Arr }
              </View>
            </TouchableOpacity>
            {this._renderDeleteButton(this.seq-1,data.Name)}
          </View>
        );
    }
    _renderSectionHeader(sectionData, sectionID) {
      return (
        <View style={styles.header}>
          <Text style={styles.sectionText}>{sectionID}</Text>
        </View>
      )
    }*/

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
             <TouchableOpacity style={styles.header} >
                 <Text>Map & Search Engine Provider</Text>
             </TouchableOpacity>
                <GiftedForm
                    formName='newInfoForm'
                    style={{flex:1,marginLeft:10,marginRight:10}}  //height:form_height
                    openModal={(route) => { route.giftedForm = true; this.props.navigator.push(route) }}
                    onValueChange={this.handleValueChange.bind(this)}
                    //validators={ this.validators }
                    defaults={this.state.form}
                    >
                        <GiftedForm.ModalWidget
                            title='Map Provider'
                            name='map'
                            display={this.state.form.mapTitle}
                            value={this.state.form.map}
                            //validationResults={this.state.validationResults}
                        >
                            <GiftedForm.SeparatorWidget />
                            <GiftedForm.SelectWidget name='map' title='Map' multiple={false}>
                                <GiftedForm.OptionWidget title='Google Maps'   value='GoogleMap' />
                                <GiftedForm.OptionWidget title='Baidu Maps' value='BaiduMap' />
                            </GiftedForm.SelectWidget>
                        </GiftedForm.ModalWidget>
                        <GiftedForm.ModalWidget
                            title='Map Type'
                            name='map_type'
                            display={this.state.form.mapTypeTitle}
                            value={this.state.form.mapType}
                            //validationResults={this.state.validationResults}
                        >
                            <GiftedForm.SeparatorWidget />
                            <GiftedForm.SelectWidget name='map_type' title='Map Type' multiple={false}>
                                <GiftedForm.OptionWidget title='Standard'   value='standard' />
                                <GiftedForm.OptionWidget title='Satellite' value='satellite' />
                            </GiftedForm.SelectWidget>
                        </GiftedForm.ModalWidget>
                        <GiftedForm.ModalWidget
                            title='Traffic on Map'
                            name='map_traffic'
                            display={this.state.form.mapTrafficTitle}
                            value={this.state.form.mapTraffic}
                            //validationResults={this.state.validationResults}
                        >
                            <GiftedForm.SeparatorWidget />
                            <GiftedForm.SelectWidget name='map_traffic' title='Real Time Traffic' multiple={false}>
                                <GiftedForm.OptionWidget title='Yes' value='true' />
                                <GiftedForm.OptionWidget title='No' value='false' />
                            </GiftedForm.SelectWidget>
                        </GiftedForm.ModalWidget>
                </GiftedForm>
          </View>
        </View>
        )
    }
};
/*
            <ListView
                enableEmptySections={true}      //annoying warning
                style={styles.listViewContainer}
                dataSource={this.state.dataSource}
                renderRow={this._renderRow.bind(this)}
                //renderHeader={this._renderHeader.bind(this)}
                //renderSectionHeader = {this._renderSectionHeader.bind(this)}
                automaticallyAdjustContentInsets={false}
                initialListSize={9}
            />
             <Picker selectedValue={this.state.map} onValueChange={(value)=> {
                  this.setState({ map:value })
                  Store.save_string(Store.SETTINGS_MAP,value)
                  Global.MAP=value
             }}>
                 {this.map_list.map(function(item,n){
                      return <Picker.Item key={item} label={item} value={item} />;
                 })}
             </Picker>
             <TouchableOpacity style={styles.header} >
                 <Text>Map Settings</Text>
             </TouchableOpacity>
             <Picker selectedValue={this.state.map_type} onValueChange={(value)=> {
                  this.setState({ map_type:value })
                  Store.save_string(Store.SETTINGS_MAP_TYPE,value)
                  Global.MAP_TYPE=value
             }}>
                 {this.map_type_list.map(function(item,n){
                      return <Picker.Item key={item} label={item} value={item} />;
                 })}
             </Picker>
             <Picker selectedValue={this.state.map_traffic} onValueChange={(value)=> {
                  this.setState({ map_traffic:value })
                  Store.save_string(Store.SETTINGS_MAP_TRAFFIC,value)
                  Global.MAP_TRAFFIC=value
             }}>
                 {this.map_traffic_list.map(function(item,n){
                      return <Picker.Item key={item} label={item} value={item} />;
                 })}
             </Picker>
*/

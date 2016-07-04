'use strict'
import React, { Component } from 'react'
import {Alert, Image, ListView, Picker, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
//import jsonpath from '../io/jsonpath'
import Store from '../io/Store'
import Global from '../io/Global'
import Style from './Style'
import Loading from './Loading'
import PlaceForm from './PlaceForm'
import NavigationBar from 'react-native-navbar'
import {Icon} from './Icon'
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

//title:'My Exchange Rates Watch List'
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
        this.map_list = ['GoogleMap','BaiduMap'];
        this.place_list = [];
        this.state = {
            isLoading:true,
            map:null,
            editable: false,
            timerEnabled: false,
            dataSource: this.ds.cloneWithRows(this.place_list),
        };
        this.loaded=false;
        this.seq=0;
        this.reload=this.reload.bind(this);
        //this._renderRow=this._renderRow.bind(this);
        this.switchEdit=this.switchEdit.bind(this);
        this.getLockIcon=this.getLockIcon.bind(this);
    }
    componentWillMount() {
        var _this=this;
        Store.get_string(Store.SETTINGS_MAP).then((value)=>{
            _this.setState({map:value})
        });
        Store.get(Store.PLACE_LIST).then((value) => {
          if(value !=null){
              _this.place_list= value;
          }else{
              Store.save(Store.PLACE_LIST, ["Home:0,0","Work:0,0"] );
              _this.place_list= ["Home:0,0","Work:0,0"];
          }
          _this.reload();
        });
        //this.reload();
    }
    componentDidMount() {
        //this.loaded = true;
    }
    //componentWillUnmount() {}
    getColor(enable){
        if(enable) return '#3B3938';
        else return '#D3D3D3';
    }
    //['USDCNY','USDNZD']
    arrayToStr(array){
        var str_items = '';
        for (var i in array) {
          str_items += '"'+array[i]+'",';
        }
        return str_items.slice(0, -1);
    }
    //shouldComponentUpdate(nextProps,nextState){
    //    return (nextState.count !==this.state.editable);
    //}
    switchEdit(){
        if(this.state.editable){
          this.setState({editable: false})
          this.reload();
        }else{
          this.setState({editable: true})
        }
    }
    deleteItem(seq,name){
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
    }
    render() {
        //alert('render.map:'+this.state.map)
        if(this.state.isLoading) return <Loading />
        //<Icon name={"ion-ios-timer-outline"} color={this.getColor(this.state.timerEnabled)} size={30} onPress={() => this.enableTimer() } />
        return(
        <View style={{flex:1}}>
          <NavigationBar style={Style.navbar} title={{title: "Settings"}}
             leftButton={
                <View style={{flexDirection:'row',}}>
                  <Icon name={"ion-ios-arrow-round-back"} color={'#333333'} size={40} onPress={() => this.props.navigator.pop() } />
                </View>
             }
          />
          <View style={styles.container}>
             <TouchableOpacity style={styles.header} >
                 <Text>Map & Search Engine</Text>
             </TouchableOpacity>
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
                 <Text>Places Settings</Text>
                 <View style={{flex:1}} />
                 <Icon name={"ion-ios-add"} color={'#333333'} size={30} onPress={() => this.props.navigator.push({component: FormAddJson, }) } />
                 <View style={{width:40}} />
                 <Icon name={this.getLockIcon()} size={30} onPress={() => this.switchEdit()} />
                 <View style={{width:20}} />
             </TouchableOpacity>
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
          </View>
        </View>
        )
    }
};
/*
             rightButton={
               <View style={{flexDirection:'row',}}>
                  <Icon name={"ion-ios-add"} color={'#333333'} size={48} onPress={() => this.props.navigator.push({component: FormAddJson, }) } />
                  <View style={{width:50}} />
                  <Icon name={this.getLockIcon()} size={40} onPress={() => this.switchEdit()} />
                </View>
             }
*/

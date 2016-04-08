'use strict'
import React, {Alert, ScrollView, Text, Image, StyleSheet, TouchableOpacity, View, ListView,} from 'react-native';
import jsonpath from '../io/jsonpath'
import Store from '../io/Store'
import Style from './Style'
import NavigationBar from 'react-native-navbar'
import IIcon from 'react-native-vector-icons/Ionicons'
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
export default class ListJson extends React.Component{
    constructor(props){
        super(props);
        this.ds = new ListView.DataSource({
            rowHasChanged: (row1, row2) => row1 !== row2,
        });
        //this.foods = [ 'USDCNY','USDNZD','USDAUD' ];
        this.foods = [];
        this.fields = []; // 'Name,Rate,Date,Time,Ask,Bid'
        this.yql = '';
        this.path = '';
        this.title = '';
        this.column_width = 0;
        this.state = {
            editable: false,
            timerEnabled: false,
            dataSource: this.ds.cloneWithRows(this.foods),
        };
        this.seq=0,
        this.reload=this.reload.bind(this);
        this._renderRow=this._renderRow.bind(this);
    }
    componentWillMount() {
        var _this=this;
        //Store.save('exchange', {"list":"USDCNY,USDAUD", "yql":"select * from yahoo.finance.xchange where pair in ", "path":"$.query.results.rate", "title":"My Exchange Rates Watch List"});
        Store.get(this.props.API_NAME).then((value) => {
          if(value !=null){
              _this.foods= value.list.split(',')
              _this.yql= value.yql
              _this.path= value.path
              _this.title= value.title
              _this.reload();
          }
        });
    }
    componentDidMount() {
        this.reload();
        this.timer = setInterval(() => {
          //console.log('I am a background timer!');
        }, 60000);
    }
    componentWillUnmount() {
        clearInterval(this.timer);
    }
    setTimer(seconds, func){
        this.timer = setInterval(() => {
            func();
        }, seconds);
    }
    dummy(){ }
    enableTimer(){
      if(this.state.timerEnabled){
          clearInterval(this.timer);
          this.setState({timerEnabled:false});
          this.setTimer(2000,this.dummy);
      }else{
          clearInterval(this.timer);
          this.setState({timerEnabled:true});
          this.setTimer(2000,this.reload);
      }
    }
    getColor(enable){
        if(enable) return '#3B3938';
        else return '#D3D3D3';
    }
    pullData(){
        fetch(requestURL).then((response) => response.json()).then((responseData) => {
            this.setState({
                dataSource: this.state.dataSource.cloneWithRows(responseData),
            });
        }).done();
    }
    //['USDCNY','USDNZD']
    arrayToStr(array){
        var str_items = '';
        for (var i in array) {
          str_items += '"'+array[i]+'",';
        }
        return str_items.slice(0, -1);
    }
    getYQLjsonpath(array){
        var items = this.arrayToStr(array);
        var sql = this.yql+' (' + items + ')';
        //alert(JSON.stringify())
        var prefixUrl = 'http://query.yahooapis.com/v1/public/yql?q=';
        var suffixUrl = '&format=json&env=store://datatables.org/alltableswithkeys';
        var URL = prefixUrl+encodeURI(sql)+suffixUrl;
        fetch(URL).then((response) => response.json()).then((responseData) => {
            var rates = JSONPath({json: responseData, path: this.path});//responseData.query.results.rate
            var list = rates[0];
            if(typeof list[0] == 'undefined'){   //check if it is a leaf, caused by some APIs drop [] with a single record
              list = rates;
            }
            //alert(JSON.stringify(list));
            this.fields =Object.keys(list[0]);
            this.column_width = Style.CARD_WIDTH / this.fields.length;
            this.setState({
                dataSource: this.state.dataSource.cloneWithRows(list),
            });
        })
        .catch((error) => {
          alert('Network Error: '+error.description)
        })
        .done();
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
    incSeq(){
        if(this.seq==this.foods.length-1){
          this.seq=0;
        }else{
          this.seq++;
        }
    }
    deleteItem(seq,name){
        Alert.alert(
          "Delete",
          "Do you want to delete "+name+" ?",
          [
            {text:"Cancel", },
            {text:"OK", onPress:()=>{
              this.foods.splice(seq,1);
              this.reload();
            }},
          ]
        );
    }
    getEditText(){
        if(this.state.editable) return 'Apply'
        else return 'Edit'
    }
    reload(){
        if(this.foods.length>0){
          this.getYQLjsonpath(this.foods);
        }
    }
    _renderDeleteButton(id,name){
        if(this.state.editable)
            return <IIcon name="minus-circled" size={30} color="#C00" onPress={()=>this.deleteItem(id,name)} />
        else return null;
    }
    _renderRow(data, sectionID, rowID) {
        this.incSeq();
        let Arr = this.fields.map((k, n) => {
            return <View key={n} style={{ height:Style.CARD_ITEM_HEIGHT, width:this.column_width, alignItems:'center', justifyContent: 'center', }}>
                     <Text>{ JSONPath({path: '$.'+k, json: data}) }</Text>
                   </View>
        })
	return (
          <View style={Style.card}>
            <TouchableOpacity style={{flex:1}} /*onPress={()=>{
                                                 this.props.navigator.push({
                                                     component: Web,
                                                     passProps: {url:'http://'+data.url},
                                                 });
                                               }}*/
            >
              <View style={{flexDirection:'row'}}>
                { Arr }
              </View>
            </TouchableOpacity>
            {this._renderDeleteButton(this.seq-1,data.Name)}
          </View>
        );
    }
    _renderHeader() {
        let Arr = this.fields.map((k, n) => {
            return <View key={n} style={{ height:Style.LIST_HEADER_HEIGHT, width:this.column_width, alignItems:'center', justifyContent: 'center', }}>
                     <Text>{ k }</Text>
                   </View>
        })
	return (
            <View style={styles.header}>
              <View style={{flexDirection:'row'}}>
                { Arr }
              </View>
            </View>
        );
    }
    render() {
        return(
        <View style={{flex:1}}>
          <NavigationBar style={Style.navbar} title={{title: this.title,}}
             leftButton={
                <View style={{flexDirection:'row',}}>
                  <IIcon name={"close"} color={'#333333'} size={30} onPress={() => this.props.navigator.pop() } />
                  <View style={{width:50}} />
                  <IIcon name={"ios-timer-outline"} color={this.getColor(this.state.timerEnabled)} size={30} onPress={() => this.enableTimer() } />
                </View>
             }
             rightButton={
               <Text size={28} onPress={() => this.switchEdit()}>{this.getEditText()}</Text>
             }
          />
          <View style={styles.container}>
            <ListView
                enableEmptySections={true}      //annoying warning
                style={styles.listViewContainer}
                dataSource={this.state.dataSource}
                renderRow={this._renderRow.bind(this)}
                renderHeader={this._renderHeader.bind(this)}
                //automaticallyAdjustContentInsets={false}
                initialListSize={11}
            />
          </View>
        </View>
        )
    }
};

'use strict'
import React, {Alert, ScrollView, Text, Image, StyleSheet, TouchableOpacity, View, ListView,} from 'react-native';
import jsonpath from '../io/jsonpath'
import Style from './Style'
import Button from 'react-native-button'
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

//items:[ 'USDCNY','USDNZD','USDAUD' ]
//sql:  'select * from yahoo.finance.xchange where pair in (' + items + ')'
//path: '$.query.results.rate[*]'
//field:'Name,Rate,Date,Time,Ask,Bid'
//timer: 3
export default class ListJson extends React.Component{
    constructor(props){
        super(props);
        this.ds = new ListView.DataSource({
            rowHasChanged: (row1, row2) => row1 !== row2,
        });
        this.foods = [ 'USDCNY','USDNZD','USDAUD' ];
        this.state = {
            editable: false,
            timerEnabled: false,
            dataSource: this.ds.cloneWithRows(this.foods),
        };
        this.seq=0,
        this.reload=this.reload.bind(this);
        //this._onFetch=this._onFetch.bind(this);
        this._renderRow=this._renderRow.bind(this);
        //this.yahoo_exchange = 'http://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20yahoo.finance.xchange%20where%20pair%20in%20(%22USDEUR%22,%20%22USDJPY%22,%20%22USDGBP%22,%20%22USDAUD%22,%20%22USDCAD%22,%20%22USDCNY%22,%20%22USDHKD%22,%20%22USDNZD%22)&format=json&env=store://datatables.org/alltableswithkeys';
        //this.yahoo_exchange_ = 'http://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20yahoo.finance.xchange%20where%20pair%20in%20(';
        //this._yahoo_exchange = ')&format=json&env=store://datatables.org/alltableswithkeys';
        this.YQLweather = null; //new YQL('select * from weather.forecast where (location = 94089)');
        this.YQLexchange = null; //new YQL('select * from yahoo.finance.xchange where pair in ("USDCNY", "USDNZD")');
        this.YQLstock = null;
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
    getYQLexchange(array){
        var items = this.arrayToStr(array);
        var sql = 'select * from yahoo.finance.xchange where pair in (' + items + ')';
        var prefixUrl = 'http://query.yahooapis.com/v1/public/yql?q=';
        var suffixUrl = '&format=json&env=store://datatables.org/alltableswithkeys';
        var URL = prefixUrl+encodeURI(sql)+suffixUrl;
        //console.log(URL)
        fetch(URL).then((response) => response.json()).then((responseData) => {
            this.setState({
                dataSource: this.state.dataSource.cloneWithRows(responseData.query.results.rate),
            });
        }).done();
        //  if(response.error){console.log(response.error.description)}
    }
    getYQLjsonpath(array){
        var items = this.arrayToStr(array);
        var sql = 'select * from yahoo.finance.xchange where pair in (' + items + ')';
        var prefixUrl = 'http://query.yahooapis.com/v1/public/yql?q=';
        var suffixUrl = '&format=json&env=store://datatables.org/alltableswithkeys';
        var URL = prefixUrl+encodeURI(sql)+suffixUrl;
        fetch(URL).then((response) => response.json()).then((responseData) => {
            var rates = JSONPath({json: responseData, path: '$.query.results.rate[*]'});
            this.setState({
                dataSource: this.state.dataSource.cloneWithRows(rates),
            });
        }).done();
    }
    getYQLstock(array){
        var items = this.arrayToStr(array);
        var sql = 'select * from yahoo.finance.quote where symbol in (' + items + ')';
        var _this = this;
        new YQL.exec(sql,function(response){
          if(response.error){console.log(response.error.description)}
          else{
            _this.setState({
              dataSource: _this.ds.cloneWithRows(response.query.results.quote),
            });
          }
        }) //.query.results.rate;
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
        //this.getYQLexchange(this.foods);
        this.getYQLjsonpath(this.foods);
    }
    _renderDeleteButton(id,name){
        if(this.state.editable)
          //return <Button containerStyle={styles.deleteButtonContainerStyle} style={styles.deleteButton} onPress={()=>this.deleteItem(id,name)}>Delete</Button>
            return <IIcon name="minus-circled" size={30} color="#C00" onPress={()=>this.deleteItem(id,name)} />
        else return null;
//containerStyle={{padding:10, height:45, overflow:'hidden', borderRadius:4, backgroundColor: 'white'}}
    }
    _renderRow(data, sectionID, rowID) {
        this.incSeq();
	return (
          <View style={Style.card}>
            <TouchableOpacity style={{flex:1}} /*onPress={()=>{
                                                 this.props.navigator.push({
                                                     component: Web,
                                                     passProps: {url:'http://'+data.url},
                                                 });
                                               }}*/
            >
                <Text>{data.Name + ': ' + data.Rate}</Text>
            </TouchableOpacity>
            {this._renderDeleteButton(this.seq-1,data.Name)}
          </View>
        );
    }
    _renderHeader() {
	return (
            <View
                style={styles.header}>
                <Text>Exchange Rates</Text>
            </View>
        );
    }
    render() {
        return(
        <View style={{flex:1}}>
          <NavigationBar style={Style.navbar} title={{title:'My Exchange Rates Watch List',}}
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

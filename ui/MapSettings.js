'use strict'
import React, {Alert, ScrollView, Text, Image, StyleSheet, TouchableOpacity, View, ListView,} from 'react-native';
import jsonpath from '../io/jsonpath'
import Store from '../io/Store'
import Style from './Style'
import PlaceForm from './PlaceForm'
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
export default class MapSettings extends React.Component{
    constructor(props){
        super(props);
        this.ds = new ListView.DataSource({
            rowHasChanged: (row1, row2) => row1 !== row2,
            sectionHeaderHasChanged: (s1, s2) => s1 !== s2,
        });
        this.foods = [];
        this.state = {
            editable: false,
            timerEnabled: false,
            dataSource: this.ds.cloneWithRows(this.foods),
        };
        this.seq=0,
        this.reload=this.reload.bind(this);
        //this._renderRow=this._renderRow.bind(this);
        this.switchEdit=this.switchEdit.bind(this);
        this.getLockIcon=this.getLockIcon.bind(this);
    }
    componentWillMount() {
        var _this=this;
        //Store.save(Store.PLACE_LIST, ["Home:0,0","Work:0,0"] );
        Store.get(Store.MAP_LIST).then((value) => {
          if(value !=null){
              _this.foods= value;
          }else{
              Store.save(Store.MAP_LIST, ["GoogleMap","Mapbox"] );
              _this.foods= ["GoogleMap","Mapbox"];
          }
          _this.reload();
        });
    }
    componentDidMount() {
        this.reload();
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
              this.foods.splice(seq,1);
              this.reload();
            }},
          ]
        );
    }
    getLockIcon(){
        if(!this.state.editable) return 'ios-locked-outline'
        return 'ios-unlocked-outline'
    }
    reload(){
        if(this.foods.length>0){
            this.setState({
                dataSource: this.state.dataSource.cloneWithRows(this.foods),
            });
        }
    }
    _renderDeleteButton(id,name){
        if(this.state.editable)
            return <IIcon name="minus-circled" size={30} color="#C00" onPress={()=>this.deleteItem(id,name)} />
        else return null;
    }
    _renderRow(data, sectionID, rowID) {
        //alert(JSON.stringify(data))
        //let Arr = this.foods.map((k, n) => {
        //    return <View key={n} style={{ height:Style.CARD_ITEM_HEIGHT, width:this.column_width, alignItems:'center', justifyContent: 'center', }}>
        //             <Text>{ k }</Text>
        //           </View>
        //})
        let Arr = <Text>{ data.split(':')[0] }</Text>
	return (
          <View style={Style.card}>
            <TouchableOpacity style={{flex:1}} onPress={()=>{ this.props.navigator.push({  component: PlaceForm,  passProps: {data:data}  }); }} >
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
        return(
        <View style={{flex:1}}>
          <NavigationBar style={Style.navbar} title={{title: "Settings"}}
             leftButton={
                <View style={{flexDirection:'row',}}>
                  <IIcon name={"close"} color={'#333333'} size={30} onPress={() => this.props.navigator.pop() } />
                  <View style={{width:50}} />
                  <IIcon name={"ios-timer-outline"} color={this.getColor(this.state.timerEnabled)} size={30} onPress={() => this.enableTimer() } />
                </View>
             }
             rightButton={
               <View style={{flexDirection:'row',}}>
                  <IIcon name={"plus"} color={'#333333'} size={30} onPress={() => this.props.navigator.push({component: FormAddJson, }) } />
                  <View style={{width:50}} />
                  <IIcon name={this.getLockIcon()} size={40} onPress={() => this.switchEdit()} />
                </View>
             }
          />
          <View style={styles.container}>
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

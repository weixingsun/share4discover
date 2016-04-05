'use strict'
import React, {Alert, ScrollView, Text, Image, StyleSheet, TouchableHighlight, View, ListView,} from 'react-native';
import Style from './Style'
import Button from 'react-native-button'
import NavigationBar from 'react-native-navbar'
import IIcon from 'react-native-vector-icons/Ionicons'
import GiftedListView from 'react-native-gifted-listview';

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
        padding: 10,
        backgroundColor: "#387ef5",
    },
    deleteButton: {
        fontSize: 12, 
        color: 'black',
        margin:5,
    },
    deleteButtonContainerStyle:{
        borderRadius:4,
        backgroundColor:'red',
    },
});
////////////////
var url = 'http://forex.wiapi.hexun.com/gb/forex/quotelist?&code=FOREXUSDCNY,FOREXNZDCNY,' +
          '&column=priceweight,code,name,'+
          'price,updownrate,updown,open,lastclose,high,low,'+
          'buyprice,sellprice,datetime';
var reply = ({
      "Data":[[
        [10000,"USDCNY","USD - CNY"
         -2147483648,331514584,2147418872,-2147483648,64776,-2147483648,-2147483648,
         [0,0,0,0,0],[0,0,0,0,0],20160405040024],
        [10000,"NZDCNY","NZD - CNY",
         44236,-93,-414,44657,44650,44715,44203,
         [0,0,0,0,0],[0,0,0,0,0],20160405055939]
      ]]
  });

export default class SampleApp extends React.Component{
    constructor(props){
        super(props);
        this.ds = new ListView.DataSource({
            rowHasChanged: (row1, row2) => row1 !== row2,
        });
        this.foods = [
          {id:1, key: 'coke 1', details:'', isCollapsed: true},
          {id:2, key: 'coke 2', details:''},
          {id:3, key: 'coke 3', details:'', isCollapsed: true},
          {id:4, key: 'coke 4', details:''},
          {id:5, key: 'coke 5', details:''},
          {id:6, key: 'coke 6', details:''},
          {id:7, key: 'coke 7', details:''},
          {id:8, key: 'coke 8', details:''},
          {id:9, key: 'coke 9', details:''},
          {id:10,key: 'coke10', details:''},
        ];
        this.state = {
            editable: false,
            dataSource: this.ds.cloneWithRows(this.foods),
        };
        this.seq=0,
        this._forceRefresh=this._forceRefresh.bind(this);
        //this._onFetch=this._onFetch.bind(this);
        this._renderRow=this._renderRow.bind(this);
    }
    //shouldComponentUpdate(nextProps,nextState){
    //    return (nextState.count !==this.state.editable);
    //}
    switchEdit(){
        if(this.state.editable){
          this.setState({editable: false})
        }else{
          this.setState({editable: true})
        }
        //alert('edit:'+this.state.editable+', foods:'+JSON.stringify(this.foods));
        //this.foods.splice(0, 1)  //remove 1 item, #0
        this._forceRefresh();
    }
    incSeq(){
        if(this.seq==this.foods.length-1){
          //alert('reset seq:'+this.seq)
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
              this._forceRefresh();
            }},
          ]
        );
        //var index = this.foods.splice(seq,1)
        //alert('#'+seq +', index='+JSON.stringify(index));
        //this._forceRefresh();
    }
    getEditText(){
        if(this.state.editable) return 'Apply'
        else return 'Edit'
    }
    _forceRefresh(){
        //this.refs.list._refresh(null, {external: true});
        this.setState({
            dataSource: this.ds.cloneWithRows(this.foods),
        });
    }
    _renderDeleteButton(id,name){
        if(this.state.editable)
          return <Button containerStyle={styles.deleteButtonContainerStyle} style={styles.deleteButton} onPress={()=>this.deleteItem(id,name)}>Delete</Button>
        else return null;
//containerStyle={{padding:10, height:45, overflow:'hidden', borderRadius:4, backgroundColor: 'white'}}
    }
    _renderRow(data, sectionID, rowID) {
        this.incSeq();
	return (
          <View style={Style.card}>
            <TouchableHighlight style={{flex:1}}>
                <Text>{data.key}</Text>
            </TouchableHighlight>
            {this._renderDeleteButton(this.seq-1,data.key)}
          </View>
        );
    }
    _renderHeader() {
	return (<Text>This is some text. This is some text. This is some text. This is some text.</Text>);
    }
    //_onFetch(page = 1, callback, options) {
      //RestAPI.rangeMsg(this.state.type,'-43.52,172.62',5000).then((rows)=> {
      //  callback(rows, {allLoaded: true} );
      //});
      //callback(this.foods, {allLoaded: true} );
    //}
    render() {
        return(
        <View style={{flex:1}}>
          <NavigationBar style={Style.navbar} title={{title:'My Watch List',}}
             leftButton={
               <IIcon name={"ios-arrow-thin-left"} color={'#3B3938'} size={40} onPress={() => this.props.navigator.pop() } />
             }
             rightButton={
               <Text size={24} onPress={() => this.switchEdit()}>{this.getEditText()}</Text>
             }
          />
          <View style={styles.container}>
            <View
                style={styles.header}>
                <Text>Exchange Rates</Text>
            </View>
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
/*
            <GiftedListView
              ref='list'
              rowView={this._renderRow}
              onFetch={this._onFetch}
              firstLoader={true}
              refreshable={false}
              //withSections={false}
            />
            <ListView
                style={styles.listViewContainer}
                dataSource={this.state.dataSource}
                renderRow={this._renderRow.bind(this)}
                renderHeader={this._renderHeader.bind(this)}
                automaticallyAdjustContentInsets={false}
                initialListSize={11}
            />
*/

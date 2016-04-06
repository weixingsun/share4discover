'use strict'
import React, {Alert, ScrollView, Text, Image, StyleSheet, TouchableOpacity, View, ListView,} from 'react-native';
import Style from './Style'
import Web from './Web'
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
        padding: 6,
        backgroundColor: "#387ef5",
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

export default class WatchList extends React.Component{
    constructor(props){
        super(props);
        this.ds = new ListView.DataSource({
            rowHasChanged: (row1, row2) => row1 !== row2,
        });
        this.foods = [
          {key: 'Baidu', url:'news.baidu.com', type:'web' },
          {key: '163',   url:'news.163.com',   type:'web' },
          {key: 'iFeng', url:'news.ifeng.com', type:'web'},
          {key: 'Sina',  url:'news.sina.com.cn', type:'web'},
          {key: 'Sohu',  url:'news.sohu.com',  type:'web'},
          {key: 'QQ',    url:'news.qq.com',    type:'web'},
          {key: 'HuanQiu',url:'www.huanqiu.com', type:'web'},
          {key: 'CanKao', url:'www.cankaoxiaoxi.com', type:'web'},
          {key: 'People', url:'www.people.com.cn', type:'web'},
          {key: 'CNTV',   url:'news.cntv.cn', type:'web'},
          {key: 'Github', url:'news.qq.com',    type:'web'},
          {key: 'Dropbox',url:'www.huanqiu.com', type:'web'},
          {key: 'Google', url:'www.cankaoxiaoxi.com', type:'web'},
          {key: 'Facebook',url:'www.people.com.cn', type:'web'},
          {key: 'Pinterest',url:'news.cntv.cn', type:'web'},
          {key: 'Twitter',  url:'news.qq.com',    type:'web'},
          {key: 'Monster',url:'www.huanqiu.com', type:'web'},
          {key: 'Zhaopin', url:'www.cankaoxiaoxi.com', type:'web'},
          {key: 'Youtube', url:'www.people.com.cn', type:'web'},
          {key: 'LeTV',   url:'news.cntv.cn', type:'web'},
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
          //return <Button containerStyle={styles.deleteButtonContainerStyle} style={styles.deleteButton} onPress={()=>this.deleteItem(id,name)}>Delete</Button>
            return <IIcon name="minus-circled" size={30} color="#C00" onPress={()=>this.deleteItem(id,name)} />
        else return null;
//containerStyle={{padding:10, height:45, overflow:'hidden', borderRadius:4, backgroundColor: 'white'}}
    }
    _renderRow(data, sectionID, rowID) {
        this.incSeq();
	return (
          <View style={Style.card}>
            <TouchableOpacity style={{flex:1}} onPress={()=>{
                                                 this.props.navigator.push({
                                                     component: Web,
                                                     passProps: {url:'http://'+data.url},
                                                 });
                                               }}>
                <Text>{data.key}</Text>
            </TouchableOpacity>
            {this._renderDeleteButton(this.seq-1,data.key)}
          </View>
        );
    }
    _renderHeader() {
	return (
            <View
                style={styles.header}>
                <Text>Websites</Text>
            </View>
        );
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
/*
            <GiftedListView
              ref='list'
              rowView={this._renderRow}
              onFetch={this._onFetch}
              firstLoader={true}
              refreshable={false}
              //withSections={false}
            />
*/

//'use strict'; //ERROR: Attempted to assign to readonly property
import React, { Component } from 'react';
import {Alert, Dimensions, Picker, StyleSheet,View, ScrollView,Text,TouchableOpacity,TouchableHighlight } from 'react-native';
import {Icon} from './Icon'
import t from 'tcomb-form-native'
var Form = t.form.Form;
import NavigationBar from 'react-native-navbar';
import Style from './Style';
import Store from '../io/Store';
import Global from '../io/Global';
import Net from '../io/Net'
import DetailImg from './DetailImg';
import FormEditMsg from "./FormEditMsg"
var {height, width} = Dimensions.get('window');

export default class Detail extends Component {
    constructor(props) {
        super(props);
        this.login = '';
        this.state={ 
            content_height: 40,
            isMyMsg:false,
        }
        this.type= {
            title: t.String,
            address: t.String,
            type: t.String,
            owner: t.String,
            ask: t.String,
            lat: t.Number,
            lng: t.Number,
            ctime: t.Number,
            content: t.String,
            reply: t.String,
        }
        //this.onChangeNative=this.onChangeNative.bind(this)
    }
    onReply() {
        //var value = this.refs.form.getValue();
        //value['pics']=[]                             ////////ctime undefined
        var key = this.props.msg.type+':'+this.props.msg.lat+','+this.props.msg.lng
        var value={key:key, field:'reply', value:'reply in app'}
        var _this = this;
        Alert.alert(
            "Reply",
            "Do you want to reply this information ? ",
            [
                {text:"Cancel", },
                {text:"OK", onPress:()=>{
                    Net.putMsg(value)
                    _this.props.navigator.pop();
                }},
            ]
        );
    }
    onClose() {
        var key = this.props.msg.type+':'+this.props.msg.lat+','+this.props.msg.lng
        var value={key:key, field:'close', value:this.login}
        var _this = this;
        Alert.alert(
            "Close",
            "Do you want to complete this request ? ",
            [
                {text:"Cancel", },
                {text:"OK", onPress:()=>{
                    Net.putMsg(value)
                    //Net.emailOwner(value)
                    _this.props.navigator.pop();
                }},
            ]
        );
    }
    onDelete() {
	var _this = this;
        var key = this.props.msg.type+':'+this.props.msg.lat+','+this.props.msg.lng
        Alert.alert(
            "Delete",
            "Do you want to delete this information ? ",
            [
                {text:"Cancel", },
                {text:"OK", onPress:()=>{
                    Net.delMsg(key)
                    _this.props.navigator.pop();
                }},
            ]
        );
    }
    onEdit(){
        this.props.navigator.push({component: FormEditMsg, passProps: { msg:this.props.msg } })
    }
    componentWillMount(){
        //alert(Date.now())
        //alert(JSON.stringify(this.props.msg))
	this.isMyMsg(this.props.msg)
    }
    isMyMsg(msg){
        this.checkSns('user_fb',msg.owner)
        this.checkSns('user_gg',msg.owner)
    }
    checkSns(type,owner){
        var self = this
        Store.get(type).then(function(user){  //{type,email}
            if(user != null){
                self.login = self.login===''? user.type+':'+user.email:self.login+','+user.type+':'+user.email
                if(owner.indexOf(user.email) > -1)
                    self.setState({isMyMsg:true})
            }
        });
    }
    setStateOnce(key,value){
        if(this.state[key] != value) {
          this.setState({key:value})
          //alert('setStateOnce:'+key+'='+value)
        }
    }
    getSNSIcon(type){
        return Global.SNS_ICONS[type]  //this.props.msg.owner.split(':')[0]
    }
    showActionIcons(){
        if(!this.state.isMyMsg){
	  return (
            <View style={{flexDirection:'row',}}>
              <Icon
                name={'ion-ios-mail-outline'}
                color={'yellow'}
                size={40}
                onPress={this.onReply.bind(this) } />
            </View>
          )
        }else{
          return (
            <View style={{flexDirection:'row',}}>
              <Icon
                name={'ion-ios-mail-outline'}
                color={'green'}
                size={40}
                onPress={this.onReply.bind(this) } />
              <View style={{width:50}} />
              <Icon
                name={'ion-ios-create-outline'}
                color={'blue'}
                size={40}
                onPress={this.onEdit.bind(this) } />
	      <View style={{width:50}} />
              <Icon
                name={'ion-ios-trash-outline'}
                color={'red'}
                size={40}
                onPress={this.onDelete.bind(this) } />
              <View style={{width:50}} />
              <Icon
                name={'ion-ios-checkmark-circle-outline'}
                color={'green'}
                size={40}
                onPress={this.onClose.bind(this) } />
            </View>
          )
        }
    }
    showSlides(){
        if(this.props.msg.pics != null) {
            return (
              <View style={{height:height/3}} >
                <DetailImg />
              </View>
            )
        }
    }
    showOwners(){
	var owners = this.props.msg.owner.split(',')
        return (
            owners.map( (owner) => {
                return (
                        <View style={{flexDirection:'row'}} key={owner} >
                          <Icon
                            style={{marginLeft:20,marginRight:1}}
                            size={34}
                            color={'blue'}
                            name={Global.SNS_ICONS[owner.split(':')[0]]}
                          />
                          <Text style={{marginLeft:20}}>{owner.split(':')[1]}</Text>
                        </View>
                )
            })
        );
    }
    render(){
        var _ctime = new Date(parseInt(this.props.msg.ctime));
        //((TelephonyManager) getSystemService(TELEPHONY_SERVICE)).getLine1Number();

        return (
            <View style={{flex:1}}>
                <NavigationBar style={Style.navbar} title={{title: '',}}
                   leftButton={
                     <View style={{flexDirection:'row',}}>
                       <Icon name={"ion-ios-arrow-round-back"} color={'#333333'} size={40} onPress={() => this.props.navigator.pop() } />
                     </View>
                   }
                   rightButton={ this.showActionIcons() }
                />
                <View style={{flex:8,backgroundColor: '#DDDDDD',}}>
                    <ScrollView
                      automaticallyAdjustContentInsets={false}
                      scrollEventThrottle={200}
                      style={{flex:8}}
                    >
                      {this.showSlides()}
                      <View style={Style.title_card} >
                        <Icon
                            style={{marginLeft:20,marginRight:1}}
                            size={44}
                            color={this.props.msg.ask=='false'?'blue':'gray'}
                            name={Global.TYPE_ICONS[this.props.msg.type]}
                        />
                        <View style={{flex:1,marginLeft:30}}>
                            <Text style={{fontWeight:'bold', fontSize:20,}}>{this.props.msg.title}</Text>
                            <Text>Time   : {_ctime.toLocaleString()}</Text>
                            <Text>Address: {this.props.msg.address}</Text>
                        </View>
                      </View>
                      <View style={Style.contact_card} >
			{ this.showOwners() }
                        <View style={{flexDirection:'row'}}>
                          <Icon
                            style={{marginLeft:22,marginRight:1}}
                            size={34}
                            color={'green'}
                            name={Global.CALL}
                          />
                          <Text style={{marginLeft:21}}>{this.props.msg.phone}</Text>
                        </View>
                      </View>
                      <View style={Style.detail_card} >
                        <Text>Publish Time: {_ctime.toLocaleString()}</Text>
                        <Text>Details</Text>
                      </View>
                    </ScrollView>
		</View>
            </View>
        );
    }
}

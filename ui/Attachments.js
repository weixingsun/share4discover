//'use strict'; //ERROR: Attempted to assign to readonly property
import React, { Component } from 'react';
import {ActivityIndicator,Alert, DeviceEventEmitter, Dimensions,NativeModules,Picker,StyleSheet,View,ScrollView,Text,TextInput,TouchableOpacity,TouchableHighlight,TouchableWithoutFeedback } from 'react-native';
import {Icon,getImageSource} from './Icon'
import NavigationBar from 'react-native-navbar';
import Modal from 'react-native-root-modal'
import Button from 'apsl-react-native-button'
import Style from './Style';
import Store from '../io/Store';
import Global from '../io/Global';
import DetailImg from './DetailImg';
import I18n from 'react-native-i18n';
import OneSignal from 'react-native-onesignal';
//import { Col, Row, Grid } from "react-native-easy-grid";
var {height, width} = Dimensions.get('window');
import ImagePicker from 'react-native-image-picker'
import Image from 'react-native-image-progress';
import ProgressBar from 'react-native-progress/Bar';
import Gallery from 'react-native-gallery';

export default class Attachment extends Component {
    constructor(props) {
        super(props);
        //this.lang = NativeModules.RNI18n.locale.replace('_', '-').toLowerCase()
        this.state={ 
            show_pic_modal:false,
            uploading:null,
            pics:[],
        }
        this.openZoom=this.openZoom.bind(this)
        this.closeZoom=this.closeZoom.bind(this)
        this.ctime=this.props.ctime
    }
    componentWillMount(){
        let self = this;
        //alert((typeof this.props.pics)+' pics='+JSON.stringify(this.props.pics))
        if(typeof this.props.pics ==='string'){
            if(this.props.pics!=='') this.setState({ pics:this.props.pics.split(',') })
        }else if(this.props.pics){
            if(this.props.pics[0]!=='') this.setState({pics:this.props.pics})
        }
        I18n.locale = NativeModules.RNI18n.locale
    }
    openZoom(){
        this.setState({show_pic_modal:true})
    }
    closeZoom(){
        this.setState({show_pic_modal:false})
    }
    deletePic(id){
        let pictures = this.state.pics
        let filename = pictures[id]
        let self=this
        Alert.alert(
            "Delete",
            "Do you want to delete this picture ? ",
            [
              {text:"Cancel" },
              {text:"OK", onPress:()=>{
                  //delete file from server
                  //self._deletePic(this.ctime,filename)
                  pictures.splice(id,1)
                  self.setState({ pics:pictures});  //pics_changed:true,
              }},
            ]
        )
    }
    _deletePic(key,filename){
        var xhr = new XMLHttpRequest();
        xhr.open('DELETE', Global.host_image+'/svc.php');
        //var formdata = new FormData();
        //formdata.append('to_delete', filename);
        xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        xhr.send("to_delete="+filename+"&key="+key);
    }
    _upload(file) {
      //alert('uri:'+file.uri)
      let time = Math.round(+new Date()/1000)
      var index = this.state.pics?this.state.pics.length:0;
      var filename = this.ctime+'-'+time+'.png'  //ctime is for creating folder
      var xhr = new XMLHttpRequest();
      xhr.open('POST', Global.host_image+'/svc.php');
      xhr.onload = () => {
        this.setState({
            uploading:null,
            pics: [...this.state.pics, time+'.png'],
        });
        //alert(JSON.stringify(this.state.pics))
        if (xhr.status !== 200) {
            alert('Upload error: ' + xhr.status)
            return;  //redo upload
        }
        if (!xhr.responseText) {
            alert('Upload failed: No response payload. ')
            return;  //redo upload
        }
        if (xhr.responseText.indexOf('OK:') < 0) {
            alert('Upload failed: '+xhr.responseText)
            return;  //redo upload
        }
        // http://nzmessengers.co.nz/service/info/1468417311/1468418245.jpg
      };
      var formdata = new FormData();
      formdata.append('image', {uri:file.uri, type:'image/png', name:filename });
      xhr.upload.onprogress = (event) => {
        //console.log('upload onprogress', event);
        if (event.lengthComputable && event.loaded!==event.total) {
          let percent = Math.floor(100*(event.loaded / event.total))
          this.setState({uploading:percent });
        }
      };
      xhr.send(formdata);
    }
    openImagePicker(){
        const options = {
          title: 'Add photo into this form',
          //quality: 0.5,
          //maxWidth: 300,
          //maxHeight: 300,
          allowsEditing: false,
          storageOptions: {
            skipBackup: true
          },
        };
        ImagePicker.showImagePicker(options, (response) => {
          if (response.didCancel) {
          }else if (response.error) {
          }else if (response.customButton) {
          }else {
            //{type,fileName,fileSize,path,data,uri,height,width,isVertical}
            //const source = {uri: 'data:image/jpeg;base64,' + response.data, isStatic: true};
            const source = {uri: response.uri, isStatic: true};
            //const source = {uri: response.uri.replace('file://', ''), isStatic: true};
            this._upload(source)
         }
       });
    }
    showActionIcons(){
        if(this.state.uploading===null)
        return (
            <View style={{flexDirection:'row',}}>
              <Icon
                name={'ion-ios-add'}
                color={'blue'}
                size={50}
                onPress={this.openImagePicker.bind(this) } />
              <View style={{width:10}} />
            </View>
        )
    }
    showImages(list){
        return (
          <View style={{marginLeft:10,height:Style.THUMB_HEIGHT+10,justifyContent:'center'}}>
            <View style={{height:5}}/>
            <ScrollView style={{height:Style.THUMB_HEIGHT,}} horizontal={true}>
                {
                  list.map((pic,id)=>{
                    let source={uri:pic}
                    //console.log('showImages() source='+JSON.stringify(source))
                    return (
                        <Image key={id} source={source} 
                            style={{width:Style.THUMB_HEIGHT,height:Style.THUMB_HEIGHT}}
                            indicator={ProgressBar}
                        >
                            {
                              pic===Global.empty_image ?
                              <View style={{flex: 1,alignItems: 'center',justifyContent: 'center',}}>
                                  <Text style={{fontWeight: 'bold',color:'blue'}}>{this.state.uploading}%</Text>
                                  <ActivityIndicator style={{marginLeft:5}} />
                              </View> 
                              :
                              <View style={{alignItems:'flex-end',justifyContent:'flex-start',height:25,flexDirection:'row',backgroundColor:'transparent'}}>
                              <Icon style={{padding:0,backgroundColor:'transparent'}} name={'fa-minus-circle'} color={'red'} size={20} onPress={()=>this.deletePic(id)}/>
                              </View>
                            }
                        </Image>
                    )
                  })
                }
            </ScrollView>
          </View>
        )
    }
    showSlides(){
        if(this.state.pics.length>0 || this.state.uploading!==null) {
            let pre = Global.host_image_info+this.ctime+'/'
            //console.log('showSlides() pics:'+JSON.stringify(this.state.pics))
            let list = this.state.pics.map((img)=>{
                return pre+img;
            })
            if(this.state.uploading&&this.state.uploading<100) list.push(Global.empty_image)
            //alert('uploading='+this.state.uploading+'\npics='+JSON.stringify(this.state.pics)+'\nlist='+JSON.stringify(list))
            return this.showImages(list);
            /*return(
              <ScrollView>
                <Grid>
                    <Row size={2} style={{backgroundColor:'green'}}></Row>
                    <Row size={1}></Row>
                    <Row size={1}></Row>
                    <Row size={1}></Row>
                    <Row size={1}></Row>
                    <Row size={1}></Row>
                    <Row size={1}></Row>
                    <Row size={1}></Row>
                </Grid>
              </ScrollView>
            )*/
        }else return null
    }
    renderModal(){
      if(this.state.pics.length===0) return null
      let pre = Global.host_image_info+this.ctime+'/'
      let images = this.state.pics.map((item)=>{
          return pre+item
      })
      return (
        <Modal
            style={{ top:0,bottom:0,right:0,left:0, backgroundColor:'rgba(0, 0, 0, 0.7)' }}
            //transform: [{scale: this.state.scaleAnimation}]
            visible={this.state.show_pic_modal}
        >
            <View>
            <Gallery
                style={{flex:1,backgroundColor:'black',width: Style.DEVICE_WIDTH, height: Style.DEVICE_HEIGHT}}
                images={ images }
                onSingleTapConfirmed={this.closeZoom}
            />
            </View>
        </Modal>
      )
    }
    back(){
        DeviceEventEmitter.emit('refresh:FormInfoVar',this.state.pics);
        this.props.navigator.pop()
    }
    render(){
        return (
            <View style={{flex:1}}>
                <NavigationBar style={Style.navbar} title={{title: '',}}
                   leftButton={
                     <View style={{flexDirection:'row',}}>
                       <Icon name={"ion-ios-arrow-round-back"} color={'#333333'} size={40} onPress={() => this.back() } />
                     </View>
                   }
                   rightButton={ this.showActionIcons() }
                />
                <View style={{flex:8,backgroundColor: '#eeeeee',}}>
                    {this.showSlides()}
                    {this.renderModal()}
		</View>
            </View>
        );
    }
}

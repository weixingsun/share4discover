import React, {
  Component,
  PropTypes,
} from 'react';
import { Dimensions,PanResponder,StyleSheet } from 'react-native'
import Svg,{Circle,G,Defs,Use,Rect,Line } from 'react-native-svg'
import Style from './Style'
import JsonNode from './JsonNode'

export default class JsonStar extends Component {
  //static propTypes = {
  //  data: PropTypes.array.isRequired,
  //}
  componentWillMount() {
    //this.traverse(this.props.data,0);
      this._panResponder = PanResponder.create({
          onStartShouldSetPanResponder: this._onlyMove,
          onMoveShouldSetPanResponder: this._onlyMove,
          //onPanResponderGrant: this._handlePanResponderGrant,
          onPanResponderMove: this._handlePanResponderMove,
          onPanResponderRelease: this._handlePanResponderEnd,
          onPanResponderTerminate: this._handlePanResponderEnd,
          onMoveShouldSetPanResponderCapture: this._onlyMove,
      });
  }
  init(){
      this.nodes=[]
      this.NODES={}  //JsonNode view
      this.totalIndex=0
      this._previousLeft = 0;
      this._previousTop = 0;
      this.stat={}  //{d1:1,d2:2}
      this.state={
        root_pos:{x:0,y:0}
      }
  }
  componentDidUpdate() {
      //alert('this.nodes='+JSON.stringify(this.nodes))
  }
  componentWillReceiveProps(nextProps) {
    this.init()
    this.traverse(nextProps.data,{d:0,i:0});
    //alert(JSON.stringify(nextProps.data))
  }
  constructor(props){
    super(props);
    //this.data = this.props.data
    this.panel={
        w:Style.DEVICE_WIDTH,
        h:Style.DEVICE_HEIGHT-Style.NAVBAR_HEIGHT-20
    }
    this.init()
  }
    _alwaysTrue = () => true;
    _onlyMove = (e,gestureState) => Math.abs(gestureState.dx) > 5  //gestureState.dx != 0 && gestureState.dy != 0

    _handlePanResponderMove = (e, gestureState)=>{
        //let find_node = this.findNearestNode(x,y,10)
        //console.log('_handlePanResponderMove('+x+','+y+')'+JSON.stringify(find_node.length))
        let x= gestureState.x0 + gestureState.dx
        let y= gestureState.y0 + gestureState.dy - Style.NAVBAR_HEIGHT
        this.hover(x,y);
    };

    _handlePanResponderGrant = ()=>{
        /*this.root.setNativeProps({
            opacity: 0.5
        });*/
    };

    _handlePanResponderEnd = (e, gestureState)=>{
        /*this.root.setNativeProps({
            opacity: 1
        })*/
        //alert('_handlePanResponderEnd')
        let x= gestureState.x0 + gestureState.dx
        let y= gestureState.y0 + gestureState.dy - Style.NAVBAR_HEIGHT
        this.hover(x,y);
    };

  traverse(json,dad) {
    let deep = dad.d+1
    for (var obj in json) {
        let kids=typeof(json[obj])==="object"?json[obj].length:0
        if (kids==null) kids=Object.keys(json[obj]).length
        let siblings=typeof(json)==="object"?json.length:0
        if (siblings==null) siblings=Object.keys(json).length
        if(this.stat['d'+deep]==null) this.stat['d'+deep]=1  //{renderSeq,totalSeq}
        else this.stat['d'+deep]++
        //let n= {d:deep, i:this.stat['d'+deep].t-1, f:dad.i, s:siblings, c:kids, k:i, v:o[i]}
        let n= {d:deep, o:this.stat['d'+deep]-1, i:this.totalIndex, f:dad.i, s:siblings, c:kids, k:obj, v:json[obj]}
        this.nodes.push( n );
        this.totalIndex++
        if (json[obj] !== null && typeof(json[obj])=="object") {
            this.traverse(json[obj],n);
        }
    }
  }
  findStarXY(node){  //{d,i,f,s,c,k,v}
    let total=this.stat['d'+node.d]      //deep #
    //let seq  =this.stat['d'+node.d].r
    let seq  =node.o                     //horizontal #
    let divX =this.panel.w*0.8/total
    let startX=this.panel.w/2 - (total-1)/2.0*divX
    let X=startX + seq * divX
    //this.stat['d'+node.d].r++
    let totalDeep = Object.keys(this.stat).length
    let divY=this.panel.h*0.8/totalDeep
    let startY=this.panel.h/2 - (totalDeep)/2.0*divY
    let Y = startY + (node.d-1) *divY
    return {x:X,y:Y}
  }
  findNearestNode(x,y,min){
    return this.nodes.filter((node)=>{
        return Math.abs(node.x-x)+Math.abs(node.y-y) < min
    })
  }
  hover(x,y){
      let find_nodes = this.findNearestNode(x,y,30)
      if(find_nodes.length>0){
          //let v1 = this.NODES[find_node[0].i]
          find_nodes.map((node)=>{
              this.NODES[node.i].highlight()
          } )
      }
      //alert('x='+x+'\ny='+y+'\nnode0='+this.nodes[0].x+','+this.nodes[0].y+'\nnodes='+this.nodes.length+'\n'+JSON.stringify(find_node)) //x,y is moving delta
      //console.log('_handlePanResponderMove('+x+','+y+')'+JSON.stringify(find_node.length))
  }
  renderNodes(){
    return this.nodes.map((node,seq)=>{
      let xy=this.findStarXY(node)
      node['x']=xy.x
      node['y']=xy.y
      let dad = this.nodes[node.f]
      let fxy = this.findStarXY(dad)
      //console.log('('+xy.x+','+xy.y+') \n fxy('+fxy.x+','+fxy.y+')\n f ' +JSON.stringify(dad))
      return (
          <JsonNode ref={ele => {this.NODES[node.i] = ele;}} key={seq} node={node} n1={xy} n2={fxy} />
      )
    })
  }
  render() {
    //{...this._panResponder.panHandlers}
    return (
            <Svg height={this.panel.h} width={this.panel.w} {...this._panResponder.panHandlers}>
              <G
                ref={ele => {this.root = ele;}}
                x={this.state.root_pos.x}
                y={this.state.root_pos.y}
                >
                {this.renderNodes()}
              </G>
            </Svg>
    );
  }
}

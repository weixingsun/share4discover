import React, {
  Component,
  PropTypes,
} from 'react';
import { Dimensions,StyleSheet } from 'react-native'
import Svg,{Circle,G,Defs,Use,Rect,Line } from 'react-native-svg'
import Style from './Style'

export default class ForceView extends Component {
  //static propTypes = {
  //  data: PropTypes.array.isRequired,
  //}
  componentWillMount() {
    //this.traverse(this.props.data,0);
  }

  componentWillReceiveProps(nextProps) {
    this.traverse(nextProps.data,{d:0,i:0});
  }
  constructor(props){
    super(props);
    //this.data = this.props.data
    this.nodes = []
    this.panel={
        w:Style.DEVICE_WIDTH,
        h:Style.DEVICE_HEIGHT-Style.NAVBAR_HEIGHT-20
    }
    this.stat={}  //{d1:1,d2:2}
    //this.state={}
    this.totalIndex=0
  }
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
  findPyramidXY(node){  //{d,i,f,s,c,k,v}
    let total=this.stat['d'+node.d]
    //let seq  =this.stat['d'+node.d].r
    let seq  =node.o
    let divX =this.panel.w*0.8/total
    let startX=this.panel.w/2 - (total-1)/2.0*divX
    let X=startX + seq * divX
    //this.stat['d'+node.d].r++
    let totalDeep = Object.keys(this.stat).length
    let divY=this.panel.h*0.8/totalDeep
    let startY=this.panel.h/2 - (totalDeep-1)/2.0*divY
    let Y = startY + (node.d-1) *divY
    return {x:X,y:Y}
  }
  renderNodes(){
    return this.nodes.map((node,seq)=>{
      let xy=this.findPyramidXY(node)
      let dad = this.nodes[node.f]
      let fxy=this.findPyramidXY(dad)
      //console.log('('+xy.x+','+xy.y+') \n fxy('+fxy.x+','+fxy.y+')\n f ' +JSON.stringify(dad))
      return (
        <G key={'g'+seq}>
          <Circle key={'c'+seq}
              cx={xy.x}
              cy={xy.y}
              r="10"
              //stroke={node.e?"green":"blue"}
              //strokeWidth="2.5"
              fill={node.c==0?"green":"blue"}
              onPress={()=> {
                  let msg = node.c===0?node.k+": "+node.v:node.k
                  alert(JSON.stringify(msg))
              }}
          />
          <Line key={'l'+seq}
              x1={xy.x} y1={xy.y} 
              x2={fxy.x} y2={fxy.y} 
              stroke="#999" />
        </G>
      )
    })
  }
  render() {
    return (
            <Svg height={this.panel.h} width={this.panel.w}>
                {this.renderNodes()}
            </Svg>
    );
  }
}

const styles = StyleSheet.create({
  container: {
  },

  tickLabelX: {
    position: 'absolute',
    bottom: 0,
    fontSize: 12,
    textAlign: 'center',
  },

  ticksYContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
  },

  tickLabelY: {
    position: 'absolute',
    left: 0,
    backgroundColor: 'transparent',
  },

  tickLabelYText: {
    fontSize: 12,
    textAlign: 'center',
  },

  ticksYDot: {
    position: 'absolute',
    width: 2,
    height: 2,
    backgroundColor: '#000000',
    borderRadius: 100,
  },
});

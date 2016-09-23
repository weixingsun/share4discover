import React, {
  Component,
  PropTypes,
} from 'react';
import { Dimensions,StyleSheet } from 'react-native'
import Svg,{Circle,G,Defs,Use,Rect } from 'react-native-svg'
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
    this.state={}
  }
  traverse(o,dad) {
    let deep = dad.d+1
    for (var i in o) {
        let kids=typeof(o[i])==="object"?o[i].length:0
        if (kids==null) kids=Object.keys(o[i]).length
        let siblings=typeof(o)==="object"?o.length:0
        if (siblings==null) siblings=Object.keys(o).length
        if(this.stat['d'+deep]==null) this.stat['d'+deep]={r:0,t:1}  //{renderSeq,totalSeq}
        else this.stat['d'+deep].t++
        let n= {d:deep, i:this.stat['d'+deep].t-1, f:dad.i, s:siblings, c:kids, k:i, v:o[i]}
        this.nodes.push( n );
        if (o[i] !== null && typeof(o[i])=="object") {
            this.traverse(o[i],n);
        }
    }
  }
  findPiramidXY(node){  //{d,i,f,s,c,k,v}
    let total=this.stat['d'+node.d].t
    let seq  =this.stat['d'+node.d].r
    let divX=this.panel.w*0.8/total
    let startX=this.panel.w/2 - (total-1)/2.0*divX
    let X=startX + seq * divX
    this.stat['d'+node.d].r++
    let totalDeep = Object.keys(this.stat).length
    let divY=this.panel.h*0.8/totalDeep
    let startY=this.panel.h/2 - (totalDeep-1)/2.0*divY
    let Y = startY + (node.d-1) *divY
    return {x:X,y:Y}
  }
  renderNodes(){
    return this.nodes.map((node,seq)=>{
      let xy=this.findPiramidXY(node)
      return (
          <Circle key={seq}
              cx={xy.x}
              cy={xy.y}
              r="10"
              //stroke={node.e?"green":"blue"}
              //strokeWidth="2.5"
              fill={node.c==0?"green":"blue"}
              onPress={()=> alert(JSON.stringify(node)) }
          />
      )
    })
  }
  render() {
    //alert(this.nodes.length+'  \n'+JSON.stringify(this.stat))
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

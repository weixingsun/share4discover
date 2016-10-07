import React, {
  Component,
  PropTypes,
} from 'react';
import { Dimensions,PanResponder,StyleSheet } from 'react-native'
import Svg,{Circle,G,Defs,Use,Rect,Line,Text } from 'react-native-svg'
import Style from './Style'
import RNAnimated from 'Animated'
import AnimatedImplementation from 'AnimatedImplementation'
const Animated = {
  ...RNAnimated,
  G: AnimatedImplementation.createAnimatedComponent(G),
}

export default class JsonNode extends Component {
  componentWillMount() {
      /*this._panResponder = PanResponder.create({
          onStartShouldSetPanResponder: this._alwaysTrue,
          onMoveShouldSetPanResponder: this._alwaysTrue,
          onPanResponderGrant: this._handlePanResponderGrant,
          onPanResponderMove: this._handlePanResponderMove,
          //onPanResponderMove: Animated.event([ null, {dx: this._animatedValue.x, dy: this._animatedValue.y} ]),
          onPanResponderRelease: this._handlePanResponderEnd,
          onPanResponderTerminate: this._handlePanResponderEnd
      });
      */
  }

  constructor(props){
    super(props);
    this.init_pos={x:this.props.n1.x,y:this.props.n1.y}
    this.dad_pos={x:this.props.n2.x,y:this.props.n2.y}
    this.init_color=this.props.node.c==0?"green":"blue"
    this.state={
        color: this.init_color,
        text_timer: 0,
    }
    this.pos=new Animated.ValueXY(this.init_pos)
    //this._animatedValue = new Animated.ValueXY()
    //this._value = {x: 0, y: 0}
    //this._animatedValue.addListener((value) => this._value = value);
  }
    /*
    _alwaysTrue = () => true;

    _handlePanResponderMove = (e, gestureState)=> { 
        //Animated.event([null, {dx: this.pos.x, dy: this.pos.y} ]);
        this.pos = {x:this.init_pos.x+gestureState.dx, y:this.init_pos.y+gestureState.dy}
        //this.pos = {x:gestureState.dx, y:gestureState.dy}
        this.moveCircle(this.pos)
        this.moveLine(this.pos,this.dad_pos)
        this.moveText(this.pos)
    }
    _handlePanResponderGrant = (e, gestureState)=>{
        this.C.setNativeProps({ opacity: 0.6 });
        //this.state.pos.setOffset({x: this.state.pos.x, y: this.state.pos.y});
        //this.state.pos.setValue(this.init_pos);
        //this.state.pos.setValue({x: 0, y: 0})
        //this.state.pos.flattenOffset();
        //this._animatedValue.setOffset({x: this._value.x, y: this._value.y});
        //this._animatedValue.setValue({x: 0, y: 0});
    };

    _handlePanResponderEnd = (e, gestureState)=>{
        this.C.setNativeProps({ opacity: 1 });
        //this.state.pos.flattenOffset();
        //this.startAnimation();
        //let start = new Animated.ValueXY(this.pos)
        //let end   = new Animated.ValueXY(this.init_pos)
        //Animated.spring(this._animatedValue, {
        //    toValue: 0,
        //    tension: 80
        //}).start();
        this.moveCircle(this.init_pos)
        this.moveLine(this.init_pos,this.dad_pos)
        this.moveText(this.init_pos)
    };*/
    moveCircle(pos){
        this.C.setNativeProps({
            cx: pos.x+'',
            cy: pos.y+'',
            //r:  "15",
        });
    }
    moveLine(pos1,pos2){
        this.L.setNativeProps({
            x1: pos1.x+'',
            y1: pos1.y+'',
            x2: pos2.x+'',
            y2: pos2.y+'',
        });
    }
    moveText(pos){
      if(this.T)
        this.T.setNativeProps({
            x: pos.x+'',
            y: pos.y+'',
        });
        //console.log('moveText('+pos.x+','+pos.y+')')
    }
    findDownLinks(){
        
    }
    getTextXY(pos){
        return {
            x:pos.x+10,
            y:pos.y+15,
        }
    }
    highlight = ()=>{
        this.change('red',10)
        setTimeout(()=> this.change(this.init_color,0), 15000);
    }
  change(color,timer){
      this.setState({
          color: color,
          text_timer: timer,
      })
  }
  renderText(){
    let msg = this.props.node.c===0?this.props.node.k+": "+this.props.node.v:this.props.node.k
    if(this.state.text_timer>0)
    return (
        <Text key={'t'+this.props.node.i} ref={ele => {this.T = ele;}}
            rotate="90" fontSize="18" fontWeight="normal" fill="blue"
            //onPress={()=> {alert(msg)} }
            textAnchor="start" x={this.getTextXY(this.init_pos).x} y={this.getTextXY(this.init_pos).y} >
              {msg}
        </Text>
    )
  }
  render() {
    // <Animated.G 
    return (
            <G 
              key={'g_'+this.props.node.i} 
              ref={ele => {this.G = ele;}} 
              //style={this.state.pos.getLayout()}
              //x={this.pos.x._value}
              //y={this.pos.y._value}
              //{...this._panResponder.panHandlers}
            >
                <Circle key={'c'+this.props.node.i} ref={ele => {this.C = ele;}}
                  cx={this.pos.x._value}
                  cy={this.pos.y._value}
                  //style={this.state.pos.getLayout()}
                  r="15"
                  fill={this.state.color}
                  //stroke={node.e?"green":"blue"}
                  //strokeWidth="2.5"
                  onPress={()=> {this.highlight()}}
                  //{...this._panResponder.panHandlers}
                />
                <Line key={'l'+this.props.node.i} ref={ele => {this.L = ele;}}
                  x1={this.props.n1.x} y1={this.props.n1.y}
                  x2={this.props.n2.x} y2={this.props.n2.y}
                  //x1={0} y1={0}
                  //x2={this.props.n2.x-this.props.n1.x} y2={this.props.n2.y-this.props.n1.y}
                  stroke="#999" />
                {this.renderText()}
            </G>
    );
  }
}

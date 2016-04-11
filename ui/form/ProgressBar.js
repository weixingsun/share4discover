/**
 * Created by Kevin on 16/1/15.
 */
'use strict'


import React,{Animated,Easing,StyleSheet,View,Text, PropTypes,Component,Platform} from 'react-native';

const styles = StyleSheet.create({
    background: {
        backgroundColor: '#bbbbbb',
        height: 5,
        overflow: 'hidden'
    },
    fill: {
        backgroundColor: '#3b5998',
        height: 5
    },
    text:{
        position: 'absolute',
        color: 'white'
    }
});

class ProgressBar extends Component {
    constructor(props) {
        super(props);
        this.state = {
            progress: new Animated.Value(this.props.initialProgress || 0)
        }
    }

    componentDidMount() {
        if (this.props.progress > 0) {
            this.update();
        }
    }

    componentWillReceiveProps(nextProps) {
        if (this.props.progress != nextProps.progress){
            this.update();
        }
    }

    render() {
        var fillWidth = this.state.progress.interpolate({
            inputRange: [0, 1],
            outputRange: [0 * this.props.style.width, 1 * this.props.style.width],
        });

        let processText = Math.round(this.props.progress * 100) + '%';
        let textStyle = {
            top: (this.props.style.height && this.props.style.height/2 - 10 || 0),
            left: (this.props.style.width && this.props.style.width/2 - 10 || 0)
        };

        return (
            <View style={[styles.background, this.props.backgroundStyle, this.props.style]}>
                <Animated.View style={[styles.fill, this.props.fillStyle, { width: fillWidth }]}/>
                <Text style={[styles.text, textStyle]}>{processText}</Text>
            </View>
        );
    }

    update() {
        Animated.timing(this.state.progress, {
            easing: this.props.easing,
            duration: this.props.easingDuration,
            toValue: this.props.progress
        }).start();
    }
}

ProgressBar.defaultProps = {
    style: styles,
    easing: Easing.inOut(Easing.ease),
    easingDuration: 800
}
export default ProgressBar;
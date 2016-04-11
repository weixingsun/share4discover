import React,{
    Component,
    Picker,
    PropTypes,
    StyleSheet,
    View,
    Text,
    TouchableOpacity,
    TouchableWithoutFeedback,
    Dimensions
} from 'react-native';
import Input from './form/Input';
import Switch from './form/Switch';
import ProgressBar from './form/ProgressBar';
import Icon from 'react-native-vector-icons/Ionicons';
import DateTimePicker from 'react-native-datetime';

const screen = Dimensions.get('window');

Date.prototype.Format = function (fmt) {
    var o = {
        "M+": this.getMonth() + 1, //月份
        "d+": this.getDate(), //日
        "h+": this.getHours() % 12 == 0 ? 12 : this.getHours() % 12, //小时
        "H+": this.getHours(), //小时
        "m+": this.getMinutes(), //分
        "s+": this.getSeconds(), //秒
        "q+": Math.floor((this.getMonth() + 3) / 3), //季度
        "S": this.getMilliseconds() //毫秒
    };
    var week = {
        "0": "日",
        "1": "一",
        "2": "二",
        "3": "三",
        "4": "四",
        "5": "五",
        "6": "六"
    };
    if (/(y+)/.test(fmt)) {
        fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    }
    if (/(E+)/.test(fmt)) {
        fmt = fmt.replace(RegExp.$1, ((RegExp.$1.length > 1) ? (RegExp.$1.length > 2 ? "星期" : "周") : "") + week[this.getDay() + ""]);
    }
    for (var k in o) {
        if (new RegExp("(" + k + ")").test(fmt)) {
            fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
        }
    }
    return fmt;
}

class Form extends Component {
    constructor(props) {
        super(props);
        this.state={
            model: props.model,
            isMultipleSelect: false,
            multipleSelectValue: {}
        };
        this.componentId = 0;
        this.dtPicker = null;
    }

    componentWillMount() {
        let models = this.props.model;
        for(let name in models) {
            let model = models[name];
            if (model.type === "select" || model.type === "date" || model.type === "time" || model.type === "datetime"){
                this.setState({[`CurrentValue_${name}`]: model.value});
                //console.log('type:'+model.type)
            }
        }
    }

    longPressChange(){
        if (this.props.longPressSelect) {
            this.setState({isMultipleSelect: !this.state.isMultipleSelect});
            this.props.onSelectStateChange(this.state.isMultipleSelect);
        }
    }

    componentWillReceiveProps(nextProps) {
        if (JSON.stringify(this.state.model) !== JSON.stringify(nextProps.model)){
            this.setState({model: nextProps.model});
        }
    }

    renderSeparator() {
        return (
            <View style={styles.separator}>
                <View style={styles.separator_inner} />
            </View>
        );
    }

    checkStateChange(name){
        let checkState = this.state.multipleSelectValue;
        if (checkState[name])
            checkState[name] = false;
        else
            checkState[name] = true;
        this.setState({multipleSelectValue: checkState});
        this.props.onItemCheckStateChange(checkState);
    }

    renderAccessory(name){
        if (this.state.isMultipleSelect){
            let iconName = 'ios-circle-outline';
            let iconColor = {};
            if (this.state.multipleSelectValue[name]) {
                iconName = 'ios-checkmark-outline';
                iconColor = {color:'red'};
            }
            return (
                <TouchableWithoutFeedback
                    onPress={()=>{this.checkStateChange(name)}}>
                    <Icon name={iconName} size={30} {...iconColor}/>
                </TouchableWithoutFeedback>
            );
        }else {
            return (
                <View style={styles.accessory}/>
            );
        }
    }

    renderModels(){
        let models = this.state.model;
        let rows = [];
        let noRefId = 0;
        for(let name in models){
            let model = models[name];
            let content = null;
            let isNeedLabel = true;
            switch ((model.type || "label")) {
                case "label":
                    content = (
                        <Text
                            ref={this.componentId}
                            name={name}
                            type={model.type}
                            value={model.value}
                            style={[styles.label_detail, model.valueStyle]}>
                            {model.value}
                        </Text>
                    );
                    break;
                case "progress":
                    let progressValue = parseFloat(model.value);
                    content = (
                        <ProgressBar
                            fillStyle={{height: 30, borderRadius: 10}}
                            backgroundStyle={{backgroundColor: '#cccccc', borderRadius: 10}}
                            style={{marginTop: 5, marginBottom: 5, height: 30, width: screen.width - 130}}
                            progress={progressValue}
                        />
                    );
                    break;
                case "subtitle":
                    content = (
                        <TouchableOpacity key={'subtitle'+noRefId++}
                                          onPress={()=>{model.onPress && model.onPress(model)}}
                                          onLongPress={()=>{this.longPressChange()}}>
                            <View>
                                <View style={[styles.formRow, this.props.rowStyle, model.rowStyle]}>
                                    <View style={styles.subtitle}>
                                        <Text numberOfLines={1} style={[styles.label, model.labelStyle]}>{model.label}</Text>
                                        <Text numberOfLines={1} style={styles.subtitle_detail}>{model.value}</Text>
                                    </View>
                                    {this.renderAccessory(name)}
                                </View>
                                {this.renderSeparator()}
                            </View>
                        </TouchableOpacity>
                    );
                    isNeedLabel = false;
                    break;
                case "section":
                    content = (
                        <View key={'section'+noRefId++} style={[styles.section, model.sectionStyle]}>
                            <Text style={[styles.sectionheader, model.sectionLabelStyle]}>{model.label}</Text>
                        </View>
                    );
                    isNeedLabel = false;
                    break;
                case "number":
                case "string":
                case "password":
                    //console.log("Form.text:"+model.value)
                    content = (
                        <Input
                            ref={this.componentId}
                            style={[styles.input, model.valueStyle]}
                            name={name}
                            type={model.type}
                            value={model.value}
                            editable={!model.disabled}
                            placeholder={model.placeholder}
                            onChange={model.onFieldChange}
                            multiline={model.multiline}
                        />
                    );
                    break;
                case "boolean":
                    content = (
                        <Switch
                            ref={this.componentId}
                            style={model.valueStyle}
                            name={name}
                            type={model.type}
                            value={model.value}
                            disabled={model.disabled}
                            onChange={model.onFieldChange}
                        />
                    );
                    break;
                case "select":
                    //console.log('select drawing....')
                    content = (
                        <Picker
                            //ref={this.componentId}
                            //name={name}
                            style={model.valueStyle}
                            //type={model.type}
                            //values={model.value}
                            selectedValue={model.selected}
                            //disabled={model.disabled}
                            onValueChange={model.onChange}
                        >
                            { 
                              model.values.map(function(item){
                                 return <Picker.Item key={item.id} label={item.label} value={item.value} />;
                              })
                            }
                        </Picker>
                    );
                    isNeedLabel=false;
                    break;
                case "date":
                case "time":
                case "datetime":
                    let currentVal = (model.value || "");
                    if (this.state[`CurrentValue_${name}`]){
                        currentVal = this.state[`CurrentValue_${name}`];
                    }
                    let callbackPress = (val)=>{
                        model.onPress && model.onPress(val);
                    }
                    let dateCallback = (d)=>{
                        if (d instanceof Date)
                            d = d.Format("yyyy-MM-dd");
                        this.setState({[`CurrentValue_${name}`]: d});
                        callbackPress(d);
                    }
                    let timeCallback = (d)=>{
                        if (d instanceof Date)
                            d = d.Format("HH:mm");
                        this.setState({[`CurrentValue_${name}`]: d});
                        callbackPress(d);
                    }
                    let datetimeCallback = (d)=>{
                        if (d instanceof Date)
                            d = d.Format("yyyy-MM-dd HH:mm");
                        this.setState({[`CurrentValue_${name}`]: d});
                        callbackPress(d);
                    }
                    if (model.type === "date" || model.type === "datetime"){
                        currentVal = currentVal.replace(/T/g," ")
                    }
                    let innerContent = (
                        <View style={{flexDirection:'row',justifyContent: 'center',alignItems: 'center'}}>
                            <Text
                                ref={this.componentId}
                                name={name}
                                type={model.type}
                                style={[styles.label_detail, model.valueStyle]}>
                                {currentVal}
                            </Text>
                            {this.renderAccessory(name)}
                        </View>
                    );
                    content = (
                        <View key={this.componentId++}>
                            <View style={[styles.formRow, this.props.rowStyle, model.rowStyle]}>
                                <Text numberOfLines={1} style={[styles.label, model.labelStyle]}>{model.label}</Text>
                                {innerContent}
                            </View>
                            {this.renderSeparator()}
                        </View>
                    );
                    if (!model.disabled) {
                        content = (
                            <TouchableOpacity
                                key={this.componentId}
                                onLongPress={()=>{this.longPressChange()}}
                                onPress={()=>{
                                    if (model.type === "select"){
                                        //callbackPress();
                                        //console.log("select.content:"+content)
                                    }else
                                    {
                                        if (!this.dtPicker){
                                            callbackPress();
                                            return;
                                        }
                                        let showValue = null;
                                        if(model.type === "date"){
                                            if (currentVal){
                                                showValue = new Date(Date.parse(currentVal.replace(/-/g,"/")));
                                            }
                                            this.dtPicker.showDatePicker(showValue, dateCallback);
                                        }else if(model.type === "time"){
                                            this.dtPicker.showTimePicker(showValue, timeCallback);
                                        }else if(model.type === "datetime"){
                                            if (currentVal){
                                                showValue = new Date(Date.parse(currentVal.replace(/-/g,"/")));
                                            }
                                            this.dtPicker.showDateTimePicker(showValue, datetimeCallback);
                                        }
                                    }
                                }}>
                                {content}
                            </TouchableOpacity>
                        );
                    }
                    isNeedLabel = false;
                    break;
            }
            if (isNeedLabel) {
                rows.push(
                    <View key={this.componentId++}>
                        <View style={[styles.formRow, this.props.rowStyle, model.rowStyle]}>
                            <Text numberOfLines={1} style={[styles.label, model.labelStyle]}>{model.label}</Text>
                            {content}
                        </View>
                        {this.renderSeparator()}
                    </View>
                );
            }else{
                rows.push(content);
            }
        }
        return rows;
    }

    getValue(){
        let values = {};
        for(let i in this.refs){
            var row = this.refs[i];
            if(row.getValue){
                values[row.props.name] = row.getValue();
            }else
            if (row.props.type == 'label'){
                values[row.props.name] = row.props.value;
            }else
            if (this.state[`CurrentValue_${row.props.name}`]){
                values[row.props.name] = this.state[`CurrentValue_${row.props.name}`];
            }
        }
        return values
    }
    forceRender(){
        this.forceUpdate();
    }
    render() {
        this.componentsRef = [];
        this.componentId = 0;
        return(
            <View style={[styles.container, this.props.style]}>
                {this.renderModels()}
                <DateTimePicker ref={(picker)=>{this.dtPicker =picker}}/>
            </View>
        );
    }
}

Form.fieldType = {
    Section: "section",
    Label: "label",
    Subtitle: "subtitle",
    String: "string",
    Number: "number",
    Boolean: "boolean",
    Password: "password",
    Progress: "progress",
    Date: "date",
    Time: "time",
    DateTime: "datetime",
    Select: "select"
}

Form.defaultProps = {
    model:{},
    longPressSelect: false,
    onSelectStateChange: ()=>{},
    onItemCheckStateChange: ()=>{}
}

Form.propTypes = {
    model: PropTypes.object.isRequired,
    style: View.propTypes.style,
    rowStyle: View.propTypes.style,
    longPressSelect: PropTypes.bool,
    onSelectStateChange: PropTypes.func,
    onItemCheckStateChange: PropTypes.func
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'column'
    },
    section: {
        paddingTop: 15,
        paddingBottom: 15,
        backgroundColor : '#EFEFF4'
    },
    sectionheader: {
        fontSize: 13,
        paddingLeft: 15,
        paddingRight: 15,
        paddingBottom: 5,
        color: '#6d6d72'
    },
    separator: {
        backgroundColor: '#fff'
    },
    separator_inner: {
        height: 0.5,
        backgroundColor: '#c8c7cc',
        marginLeft: 15,
        marginRight: 0
    },
    label: {
        flex: 1,
        fontSize: 16,
        color: '#000'
    },
    label_detail: {
        fontSize: 16,
        alignSelf: 'center',
        color: '#8E8E93'
    },
    subtitle:{
        flexDirection: 'column',
        flex: 1
    },
    subtitle_detail: {
        fontSize: 11
    },
    accessory: {
        width: 10,
        height: 10,
        marginLeft: 7,
        marginRight: 2,
        backgroundColor: 'transparent',
        borderTopWidth: 1,
        borderRightWidth: 1,
        borderColor: '#c7c7cc',
        transform: [{
            rotate: '45deg'
        }]
    },
    input: {
        flex: 3,
    },
    formRow: {
        justifyContent: 'center',
        paddingLeft: 15,
        paddingRight: 20,
        paddingTop: 10,
        paddingBottom: 10,
        flexDirection: 'row',
        alignItems: 'center',
        height: 44,
        backgroundColor: '#fff'
    }
});

export default Form;

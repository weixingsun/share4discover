//var crypto = require('react-native-crypto');
const md5 = require('./md5');

let config = [{
    "name": "pushSingle",
    "uri": "push/single_device",
    "requiredParams": [{
        "name": "channel_id",
        "type": "string"
    }, {
        "name": "msg",
        "type": "string"
    }],
    "optionalParams": []
},{
    "name": "pushTags",
    "uri": "push/tags",
    "requiredParams": [{
        "name": "type",
        "type": "number"
    }, {
        "name": "tag",
        "type": "string"
    }, {
        "name": "msg",
        "type": "string"
    }],
    "optionalParams": []
}]
var defaultHeaders = {
    'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8',
    'User-Agent': 'BCCS_SDK/3.0 (Darwin; Darwin Kernel Version 14.0.0: Fri Sep 19 00:26:44 PDT 2014; root:xnu-2782.1.97~2/RELEASE_X86_64; x86_64) PHP/5.6.3 (Baidu Push Server SDK V3.0.0 and so on..) cli/Unknown ZEND/2.6.0'
};
var defaultMethod = 'POST';
function fullEncodeURIComponent (str) {
    var rv = encodeURIComponent(str).replace(/[!'()*~]/g, function(c) {
      return '%' + c.charCodeAt(0).toString(16).toUpperCase();
    });
    return rv.replace(/\%20/g,'+');
}

/**
 * 生成请求签名
 * 
 * @param {object} reqParams, 由url.parse解析出来的对象内容,描述请求的位置和url及参数等信息的对象
 * @param {object} postParams post表单内容
 * @param {string} secretKey 开发者中心的SK
 * @return {string} 签名值
 */
  //apikey,timestamp,sign
  //
var singKey = function (reqParam, postParmas, secretKey) {
    var basekey = "";
    var method = reqParam.method.toUpperCase();
    var baseurl = reqParam.href;
    var query = reqParam.query || false;
    var param = {};
    var paramStr = '';
    if (query) {
        query = querystring.parse(query);
        for ( var key in query) {
            param[key] = query[key];
        }
    }
    if (postParmas) {
        for ( var key in postParmas) {
            param[key] = postParmas[key];
        }
    }
    var keys = Object.keys(param).sort();
    keys.forEach(function (key) {
        paramStr += key + "=" + param[key];
    })
    basekey = method + baseurl + paramStr + secretKey;
    console.log("basekey : ", basekey);
    //var md5 = crypto.createHash('md5');
    basekey = fullEncodeURIComponent(basekey);
    //md5.update(basekey);
    return md5(basekey);
}

function invokeBaidu(options, cbk) {
    // check required parameters
    if (!options || !options.uri || !options.params) {
        throw new Error('Lack required parameters');
    }
    //
    var uri = util.format("http://api.tuisong.baidu.com/rest/3.0/%s", options.uri);
    // build post params
    var params = options.params;
    params.timestamp = Math.round(Date.now() / 1000);
    params.apikey = options.apiKey;
    var httpInfo = {
        href: uri,
        method: defaultMethod
    };
    params.sign = signKey(httpInfo, params, options.secretKey);
    // build post options
    var requestOptions = {
        uri: uri,
        headers: defaultHeaders,
        method: defaultMethod,
        form: params
    };
    // do request (if provide callback function use the traditinal way, if not use promise way)
    if (typeof cbk === 'function') {
        request(requestOptions, function (err, response, body) {
            var result = dealResult(err, body);
            result.error ? cbk(result.error) : cbk(null, result.data);
        });
    } else {
        return new Promise(function(resolve, reject) {
            request(requestOptions, function(err, response, body) {
                var result = dealResult(err, body);
                result.error ? reject(result.error) : resolve(result.data);
            });
        });
    }
}

function dealResult (err, body) {
    var result = {};
    if (err) {
        result.error = err;
    } else {
        try {
            result.data = JSON.parse(body);
        } catch (e) {
            result.error = e;
        }
    }
    return result;
}

function createApi (config) {
    return function(params, cbk) {
        // check required params
        for (var i in config.requiredParams) {
            var p = config.requiredParams[i];
            if (!params[p.name]) {
                throw new Error(util.format('Required param "%s" is requied', p.name));
            }
        }
        // build request options
        var opts = {
            uri: config.uri,
            params: params,
            apiKey: this.options.apiKey,
            secretKey: this.options.secretKey
        };
        var args = [];
        args.push(opts);
        if (cbk) {
            args.push(cbk);
        }
        return invokeBaidu.apply(global, args);
    };
}

/*
* 百度推送类
*
* @param {Object} options 百度推送服务配置: apiKey, secretKey
* @return {Object} 百度推送对象实例
*/
function BaiduPush (options) {
    if (!options || !options.apiKey || !options.secretKey) {
        throw new Error('apiKey and secretKey is required');
    }
    this.options = options;
    return this;
}

// dynamic add REST API methods from config
var proto = {};
config.forEach(function (config) {
    proto[config.name] = createApi(config);    
});
BaiduPush.prototype = proto;
module.exports = BaiduPush;

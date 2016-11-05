/**
 * 生成请求签名及uri编码
 */
var crypto = require('react-native-crypto');
const md5 = require('./md5');

// 兼容php的urlencode
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

module.exports = {
    singKey:singKey
};

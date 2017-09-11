const request = require('request-promise').defaults({
    jar: true,
    simple: false,
    resolveWithFullResponse: true
});
const urlencode = require('urlencode');
const iconv = require('iconv-lite');


module.exports.get = async function (url, encoding = 'utf-8') {
    let options = {
        url: url,
        encoding: null
    };

    let rsp = await request.get(options);
    if (rsp.statusCode >= 400) {
        console.log(App.error.network("访问失败！"));
        return null;
    }

    rsp.body = iconv.decode(rsp.body, encoding);
    return rsp;
}

module.exports.post = async function (url, formData, encoding = 'utf-8') {
    options = {
        url: url,
        form: formData,
        encoding: null
    }

    let rsp = await request.post(options);
    if (!rsp || rsp.statusCode >= 400) {
        console.log(App.error.network("访问失败！"));
        return null;
    }

    rsp.body = iconv.decode(rsp.body, encoding);

    return rsp;
}

module.exports.toFormData = function (obj, encoding) {
    let data = '';
    for (let k in obj) {
        let val = obj[k].toString().match(/^\w+$/) ? obj[k] : urlencode(obj[k], encoding)
        data += '&' + k + '=' + val
    }
    return data.replace(/^&+/, '');
}

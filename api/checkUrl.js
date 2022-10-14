// 获取url里面的参数   输入对象 或者 false
function url2Obj(url) {
  var reg_url = /^[^\?]+\?([\w\W]+)$/,
    reg_para = /([^&=]+)=([\w\W]*?)(&|$)/g,
    arr_url = reg_url.exec(url),
    ret = {};
  if (arr_url && arr_url[1]) {
    var str_para = arr_url[1], result;
    while ((result = reg_para.exec(str_para)) != null) {
      ret[result[1]] = result[2];
    }
    return ret;
  } else {
    return false;
  }
}
//  对象 转 url参数
function obj2Params(obj){
  var urlWithArgs = '?'
  for (var key in obj) {
    var value = obj[key];
    urlWithArgs += key + '=' + value + '&';
  }
  urlWithArgs = urlWithArgs.substring(0, urlWithArgs.length - 1);
  return urlWithArgs
}

module.exports = {
  url2Obj : url2Obj,
  obj2Params: obj2Params
}
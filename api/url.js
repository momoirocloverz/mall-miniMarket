const urlApi = {
  //判断h5域名环境
  getSystem(str) {
    var url = '';
    if (str.startsWith('https://pre-wsnb-apiweb.anchumall.cn')){
      url = 'https://pre-wsnb.anchumall.cn';
    } else if (str.startsWith('https://dev-wsnb-apiweb.anchumall.cn')){
      url = 'https://dev-wsnb.anchumall.cn';
    } else if (str.startsWith('https://master-apiweb-wsnb.hzanchu.com')) {
      url = 'https://wsnb.hzanchu.com'
    } else {
      url = 'https://wsnb.hzanchu.com';
    }
    return url;
  },
  getUrlWithQuery() {
    var pages = getCurrentPages()    //获取加载的页面
    var currentPage = pages[pages.length - 1]    //获取当前页面的对象
    var url = currentPage.route    //当前页面url
    var options = currentPage.options    //如果要获取url中所带的参数可以查看options
    //拼接url的参数
    var urlWithArgs = url + '?'
    for (var key in options) {
      var value = options[key]
      urlWithArgs += key + '=' + value + '&'
    }
    urlWithArgs = urlWithArgs.substring(0, urlWithArgs.length - 1)
    return '/' + urlWithArgs
  },
}
export default urlApi
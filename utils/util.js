//格式化时间
const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}
//获取url参数
const getQueryString = (name)=> {
  var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
  var r = window.location.search.substr(1).match(reg);
  if (r != null) return unescape(r[2]);
  return null;
}

const getQueryValue = (url) => {
  let theRequest = new Object();
  if (url.indexOf("?") != -1) {
    let str = url.substr(url.indexOf("?") + 1);
    if (str.indexOf('&') >= -1) {
      let strs = str.split("&");
      for (var i = 0; i < strs.length; i++) {
        theRequest[strs[i].split("=")[0]] = decodeURI(strs[i].split("=")[1]);
      }
    }
  }
  return theRequest;
}

const messageListID = {
  change_amount: 'QdGjQzc55aNWjZtQrCn1G4gbxaNYCC0rsjFXaB1dfNY' ,  // 订单修改结果通知
  obligation: 'f9EzfWAjO7guD0j1ax_C6eoA-1hdyrNJCT_nvRVzxLk',  // 待付款提醒
  cancel_order: 'Ie_af60ydBuvzr7fdKPghKbGAkcBhR4ymHExC5Jwj4M',  // 订单取消通知
  deliver_goods: '47Bsn0aC-mNLPIO0-ylIL4z0TBiUhASBFxKL1rD5rlQ',  // 订单发货通知
  shipments: 'PeF2xg2gwLl-hpB01uujHbsA3vKks5vR2i6cSfoDg8E',  // 订单代发货提醒
  apply_drawback: '_a0eUurAPfU-mm_M8lnZgEnCbHPBSDFF_3c0maX7_bA',  // 申请退款通知
  take_goods: 'VHkMf1ie9BZIxvcFaBNxR1lD3nNKAjssJNuNXYTsqMc',  // 订单收货通知
}

module.exports = {
  formatTime: formatTime,
  getQueryString: getQueryString,
  getQueryValue: getQueryValue,
  messageListID: messageListID
}

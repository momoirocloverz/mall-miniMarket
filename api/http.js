import { hexMD5 } from '../utils/md5.js';
import urlApi from './url.js';
import userInfo from './userInfo.js';

// export const baseUrl = 'https://pre-apiweb.phbjx.com/api/';
// export const baseUrl = 'https://dev-apiweb.phbjx.com/api/';
export const baseUrl = 'https://apiweb.phbjx.com/api/';

const appSec = 'base64:3/BnNb5S84hpsrEKqFfC01997pEvKf/r/ojN0K8gF3Y=';
const version = 'application/vnd.phbjx.v1.0.0+json'

const http = {
  base_url_h5: urlApi.getSystem(baseUrl), //h5跳转域名
  apiUrl: baseUrl,
  appSec: appSec,
  get: (url, data, cb) => {
    let str = '';
    for (let i in data) {
      str += '&' + i + '=' + encodeURIComponent(data[i]);
    }
    // let sign = hexMD5(`${str}${appSec}`);
    wx.request({
      url: baseUrl + url,
      data: data,
      method: 'get',
      header: {
        'Content-Type': 'application/json',
        'Authorization': userInfo.getUserInfoParams('token'),
        'Accept': version
      },
      success: (res) => {
        if (res.data.code === 0) {
          return typeof cb == 'function' && cb(res.data)
        }
        if (res.statusCode !== 200) {
          wx.showToast({
            title: '网络异常，请稍后重试',
            icon: 'none',
            duration: 2000
          })
          return typeof cb == 'function' && cb({
            code: -1,
            msg: ''
          })
        }
        if (res.data.code == '21001') {
          wx.clearStorage();
          wx.showToast({
            title: '登录状态已过期，请重新登录',
            icon: 'none'
          })
          //清除缓存 
          wx.removeStorageSync('userInfo')
          console.log(encodeURIComponent(urlApi.getUrlWithQuery()), "===>url");
          wx.redirectTo({
            url: '/pages/common/login/index?url=' + encodeURIComponent(urlApi.getUrlWithQuery())
          })
        } else if (res.data.code == '11002') {
          //清除缓存 
          wx.showToast({
            title: '您当前访问的店铺已失效，请联系商家，获取新的店铺链接',
            icon: 'none',
            duration: 2000
          })
          wx.removeStorageSync('userInfo')
          wx.redirectTo({
            url: '/pages/seller/entryStore/index'
          })
        } else {
          wx.showToast({
            title: res.data.msg,
            icon: 'none'
          })
          return typeof cb == 'function' && cb({
            code: -1,
            msg: res.data.msg
          })
        }
      },
      fail: (res) => {
        wx.hideLoading();
        wx.showToast({
          title: '网络异常，请稍后重试',
          icon: 'none',
          duration: 2000
        })
        return null;
      }
    })
  },
  post: (url, data, cb) => {
    let str = '';
    for (let i in data) {
      if (str === '') {
        str += i + '=' + encodeURIComponent(data[i]);
      } else {
        str += '&' + i + '=' + encodeURIComponent(data[i]);
      }
    }
    // let sign = hexMD5(`${str}${appSec}`);
    wx.request({
      url: baseUrl + url,
      data: data,
      method: 'POST',
      header: {
        'Content-Type': 'application/json',
        'Authorization': userInfo.getUserInfoParams('token'),
        'Accept': version
      },
      success: (res) => {
        if (res.data.code === 0) {
          return typeof cb == 'function' && cb(res.data)
        }
        if (res.statusCode !== 200) {
          wx.showToast({
            title: '网络异常，请稍后重试',
            icon: 'none',
            duration: 2000
          })
          return typeof cb == 'function' && cb({
            code: -1,
            msg: ''
          })
        }
        console.log(res.data.code);
        if (res.data.code == '21001') {
          //清除缓存
          wx.removeStorageSync('userInfo')
          wx.showToast({
            title: '您的登录状态已过期，请重新登录',
            icon: 'none'
          })
          wx.redirectTo({
            url: '/pages/common/login/index?url=' + encodeURIComponent(urlApi.getUrlWithQuery())
          })
          return false;
        } else if (res.data.code === '11002') {
          //清除缓存 
          wx.showToast({
            title: '您当前访问的店铺已失效，请联系商家，获取新的店铺链接',
            icon: 'none',
            duration: 2000
          })
          wx.removeStorageSync('userInfo')
          wx.redirectTo({
            url: '/pages/seller/entryStore/index'
          })
          return false;
        } else {
          // 此处返回code=-1,用于处理页面loading等交互情况，错误message全部收敛到全局处理
          wx.showToast({
            title: res.data.msg,
            icon: 'none'
          })
          // log.info({log: res})
          return typeof cb == 'function' && cb({
            code: -1,
            msg: res.data.msg
          })
        }
      },
      fail: (res) => {
        wx.hideLoading();
        wx.showToast({
          title: '网络异常，请稍后重试',
          icon: 'none',
          duration: 2000
        })
        return null;
      }
    })
  }
}

export default http;
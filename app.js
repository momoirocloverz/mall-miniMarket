//app.js
import http from './api/http.js'
import {https} from './api/https.js'
import {wxUtil} from './utils/wxUtil'
import {urls} from './api/config'
import uma from 'umtrack-wx';
App({
  onLaunch: function () {
    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              this.globalData.userInfo = res.userInfo
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
            }
          })
        }
      }
    })

    // 获取胶囊按钮信息
    const menuButtonInfo = wx.getMenuButtonBoundingClientRect()
    console.log(menuButtonInfo, 'menuButtonInfo')
    this.globalData.menuButton = menuButtonInfo
    // 判断系统
    wx.getSystemInfo({
      success: res => {
        // 判断系统
        this.globalData.system = res.system.slice(0, 3);
        let modelmes = res.model;
        // 兼容iphoneX
        if (modelmes.search('iPhone X') != -1) {
          this.globalData.isX = true;
          console.log(this.globalData.isX, 'iponeX')
        }
      }
    })
    // 更新版本
    const updateManager = wx.getUpdateManager();
    updateManager.onUpdateReady(function () {
      wx.showModal({
        title: '更新提示',
        content: '新版本已经准备好，是否重启应用？',
        success: function (res) {
          if (res.confirm) {
            // 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
            updateManager.applyUpdate()
          }
        }
      })
    })
  },
  // 页面重定向
  onPageNotFound: function (res) {
    wx.reLaunch({
      url: '/pages/seller/entryStore/index',
    })
  },
  umengConfig: {
    appKey: '5f0d5ff8dbc2ec0841e9c48d', //由友盟分配的APP_KEY
    useOpenid: false, // 是否使用openid进行统计，此项为false时将使用友盟+随机ID进行用户统计。使用openid来统计微信小程序的用户，会使统计的指标更为准确，对系统准确性要求高的应用推荐使用OpenID。
    autoGetOpenid: false, // 是否需要通过友盟后台获取openid，如若需要，请到友盟后台设置appId及secret
    debug: false //是否打开调试模式
  },
  globalData: {
    userInfo: null,
    isX: false,
    system: '',
    statusBarHeight: wx.getSystemInfoSync()['statusBarHeight'],
    code: '',
    menuButton: ''
  },
  globalHttps:https,
  globalUrls:urls,
  globalFun: {
    http: http,
    shareCallback(params) {
      http.post(params)
    }
  },
  wxApi:wxUtil
})
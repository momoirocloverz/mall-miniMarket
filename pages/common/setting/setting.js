import Dialog from '@vant/weapp/dist/dialog/dialog';

Page({

  /**
   * 页面的初始数据
   */
  data: {
    user_role: 1,
    navList: [
      // { icon: 'https://img.hzanchu.com/acimg/a567a2dedfdcab6e321c5b30bc6e66f4.png', name: '联系客服', value: '', path: '', method: 'callStore' },
      { icon: 'https://img.hzanchu.com/acimg/3bbdebc64d7b7f68381caca2309bc3e8.png', name: '服务协议', value: '', path: '/pages/seller/policy/service', method: 'goService' },
      { icon: 'https://img.hzanchu.com/acimg/847a57bee2246321320819c2006efb5f.png', name: '隐私政策', value: '', path: '/pages/seller/policy/privacy', method: 'goPrivacy'}
    ]
  },
  onLoad:function(options){
    this.setData({user_role: options.user_role})
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onShow() {
    if(this.data.user_role === "1"){
      this.setData({
        navList:[
          // { icon: 'https://img.hzanchu.com/acimg/a567a2dedfdcab6e321c5b30bc6e66f4.png', name: '联系客服', value: '', path: '', method: 'callStore' },
          { icon: 'https://img.hzanchu.com/acimg/3bbdebc64d7b7f68381caca2309bc3e8.png', name: '服务协议', value: '', path: '/pages/seller/policy/service', method: 'goService' },
          { icon: 'https://img.hzanchu.com/acimg/847a57bee2246321320819c2006efb5f.png', name: '隐私政策', value: '', path: '/pages/seller/policy/privacy', method: 'goPrivacy'}
        ]
      })
    }else {
      this.setData({
        navList: [
          // { icon: 'https://img.hzanchu.com/acimg/a567a2dedfdcab6e321c5b30bc6e66f4.png', name: '联系客服', value: '', path: '', method: 'callStore' },
          { icon: 'https://img.hzanchu.com/acimg/3bbdebc64d7b7f68381caca2309bc3e8.png', name: '服务协议', value: '', path: '/buyerInfo/buyer/policy/service', method: 'goService' },
          { icon: 'https://img.hzanchu.com/acimg/847a57bee2246321320819c2006efb5f.png', name: '隐私政策', value: '', path: '/buyerInfo/buyer/policy/privacy', method: 'goPrivacy'}
        ]
      })
    }
  },
  // 隐私协议
  goPrivacy() {
    wx.navigateTo({
      url: '/pages/seller/policy/privacy',
    })
  },
  // 服务协议
  goService() {
    wx.navigateTo({
      url: '/pages/seller/policy/service',
    })
  },

  goSet() {
    // wx.navigateTo({
    //   url: '/pages/common/login/index?url=/pages/seller/mine/index',
    // })
  },
})
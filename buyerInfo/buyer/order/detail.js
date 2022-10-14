// pages/buyer/order/detail.js
var app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    address: '',
    consignee: '',
    mobile:'',
    isX: app.globalData.isX,
    orderInfo: '',
    timeText: '',// 倒计时文案
    time: 0,
    timeContent: '',
    order_sn: '',
    orderType: [
      {
        name: '待付款'
      },
      {
        name: '已取消'
      },
      {
        name: '超时取消'
      },
      {
        name: '买家已付款'
      },
      {
        name: '卖家已发货'
      },
      {
        name: '售后中'
      },
      {
        name: '交易成功'
      },
      {
        name: '交易关闭'
      },
      {
        name: '卖家取消'
      }
    ],
    orderImg: [
      {
        name: 'https://img.hzanchu.com/acimg/16f86a599dd3ef74c1cebb7f4f425de2.png'
      },
      {
        name: 'https://img.hzanchu.com/acimg/2d8a1ce55f91ac2cc90e9ebc9f60ea44.png'
      },
      {
        name: 'https://img.hzanchu.com/acimg/2d8a1ce55f91ac2cc90e9ebc9f60ea44.png'
      },
      {
        name: 'https://img.hzanchu.com/acimg/db58896931c0bda5c4ca3807b9f989a6.png'
      },
      {
        name: 'https://img.hzanchu.com/acimg/e73e1590ecc9f16cf2045c4106d6b53a.png'
      },
      {
        name: 'https://img.hzanchu.com/acimg/dabec254ef64692b23dbdf45165a7892.png'
      },
      {
        name: 'https://img.hzanchu.com/acimg/3ad441e7d2ccb4ace685aa293dee1de5.png'
      },
      {
        name: 'https://img.hzanchu.com/acimg/dcff9e2486017112c1d7b480c9e33160.png'
      }
    ]        
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      store_id: wx.getStorageSync('store_id'),
      order_sn: options.order_sn
    }, () => {
      this.getInfo()
    })
  },
  //复制订单编号
  copy() {
    wx.setClipboardData({
      data: this.data.orderInfo.order_sn,
      success(res) {
        wx.showToast({
          title: '复制成功',
        })
      }
    })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  getInfo() {
    wx.showLoading({
      title: '加载中',
    })
    app.globalFun.http.post('order/info', {
      order_sn: this.data.order_sn,
      store_id: wx.getStorageSync('store_id')
    }, (res) => {
      wx.hideLoading();
      if (res.code === 0) {
        // 待付款时间
        let auto_cancel_time = res.data.auto_cancel_time
        let confirm_time = res.data.confirm_time
        let time = ''
        let timeContent = ''
        if (auto_cancel_time !== 0) {
          time = auto_cancel_time
          timeContent = '剩余 mm 分 ss 秒自动关闭'
        }
        if (confirm_time !== 0) {
          time = confirm_time
          timeContent = '剩余DD 天 HH 时自动确认'
        }
        
        this.setData({
          address: res.data.address,
          consignee: res.data.consignee,
          mobile: res.data.mobile,
          orderInfo: res.data,
          time: time*1000,
          timeContent: timeContent
        })
      }
    })
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})
var app = getApp();

Page({
  /**
   * 页面的初始数据
   */
  data: {
    address: '',
    consignee: '',
    mobile: '',
    orderInfo: '',
    timeText: '',// 倒计时文案
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
      }
    ],
    orderImg: [
      {
        name: 'https://img.hzanchu.com/acimg/1ac30d5f227bcb64ceadce0ffb2c5f6b.png'
      },
      {
        name: 'https://img.hzanchu.com/acimg/7de193b2ed1257c379e59adfdfa0edb0.png'
      },
      {
        name: 'https://img.hzanchu.com/acimg/7de193b2ed1257c379e59adfdfa0edb0.png'
      },
      {
        name: 'https://img.hzanchu.com/acimg/77faa47a2b09af63cbe72ff56ad71e48.png'
      },
      {
        name: 'https://img.hzanchu.com/acimg/326125222c900676c22299b867146f69.png'
      },
      {
        name: 'https://img.hzanchu.com/acimg/dabec254ef64692b23dbdf45165a7892.png'
      },
      {
        name: 'https://img.hzanchu.com/acimg/087383f2224df8303863aebf99dea450.png'
      },
      {
        name: 'https://img.hzanchu.com/acimg/1a3095858b4065e0be58888097cf109b.png'
      }
    ],
    options: ''
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      options: options
    })
    this.getInfo(options)
  },
  copy() {
    wx.setClipboardData({
      data: this.data.orderInfo.order_sn,
      success (res) {
        
      }
    })
  },
  getInfo(options) {
    wx.showLoading({
      title: '加载中',
    })
    app.globalFun.http.post('order/seller_info', {
      order_sn: options.order_sn
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
          time: time * 1000,
          timeContent: timeContent
        })
      } else {
        wx.showToast({
          title: res.msg,
          icon: 'none'
        })
      }
    })
  },
  reload() {
    this.getInfo(this.data.options)
  }
})
var app = getApp();
import util from '../../../utils/util'

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
    shipWay: '2',
    expressCode: '',
    isShowSelect: false,
    actions: [],
    expressName: '',
    expressMark: '',
    isShowExpress: false,
    orderId: '',
    shipLoading: false
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getInfo(options);
    this.getExpressList();
    this.setData({
      orderId: decodeURIComponent(options.order_sn)
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
        let cancel_arr = []
        let confirm_arr = []
        let timeText = ''
        cancel_arr[0] = Math.floor(auto_cancel_time / 1000 / 60 / 60 % 24)
        cancel_arr[1] = Math.floor(auto_cancel_time / 1000 / 60 % 60)
        confirm_arr[0] = Math.floor(confirm_time / 1000 / 60 / 60 / 24)
        confirm_arr[1] = Math.floor(confirm_time / 1000 / 60 / 60 % 24)
        if (auto_cancel_time !== 0) {
          timeText = cancel_arr[0] != 0 ? '剩余' + cancel_arr[0] + '小时' + cancel_arr[1] + '分钟关闭订单' : '剩余' + cancel_arr[1] + '分钟自动关闭订单'
        }
        if (confirm_time !== 0) {
          timeText = confirm_arr[0] != 0 ? '剩余' + confirm_arr[0] + '天' + confirm_arr[1] + '小时自动确认' : '剩余' + confirm_arr[1] + '分钟自动确认'
        }
        this.setData({
          address: res.data.address,
          consignee: res.data.consignee,
          mobile: res.data.mobile,
          orderInfo: res.data,
          timeText: timeText
        })
        console.log(this.data.isEmpty, '空')
      } else {
        wx.showToast({
          title: res.msg,
          icon: 'none'
        })
      }
    })
  },
  // 发货选择
  onChangeShip(event) {
    this.setData({
      shipWay: event.detail,
    });
    if (event.detail === '1') {
      this.setData({
        isShowExpress: true
      })
    } else {
      this.setData({
        isShowExpress: false
      })
    }
  },
  changeExpressCode(event) {
    this.setData({
      expressCode: event.detail.value,
    });
  },
  closeSelect() {
    this.setData({
      isShowSelect: false
    })
  },
  onSelect(event) {
    this.setData({
      expressName: event.detail.name,
      expressMark: event.detail.code
    })
  },
  showSelect() {
    this.setData({
      isShowSelect: true
    })
  },
  // 获取快递公司
  getExpressList() {
    app.globalFun.http.get('express/list', {}, (res) => {
      if (res.code === 0) {
        const names = Object.keys(res.data).map(item => {
          return {
            name: res.data[item],
            code: item
          }
        });
        this.setData({
          actions: names,
        })
      }
    })
  },
  // 复制地址信息
  copy() {
    let that = this
    wx.setClipboardData({
      data: that.data.consignee + ' ' + that.data.mobile + ' ' + that.data.address,
      success(res) {
        console.log(res, 'res')
      }
    })
  },
  // 立刻发货
  shipOrder() {
    this.setData({ shipLoading: true })
    const data = {
      order_sn: this.data.orderId,
      express_way: this.data.shipWay,
      express_no: this.data.expressCode,
      express_name: this.data.shipWay === '2' ? '同城配送' : this.data.expressName,
      express_code: this.data.expressMark
    };
    wx.getSetting({
      success(res) {
        if (!res.authSetting['scope.withSubscriptions']) {
          wx.requestSubscribeMessage({
            tmplIds: [
              util.messageListID.take_goods
            ],
            success (res) {
              console.log(res);
            },
            complete (){
              app.globalFun.http.post('express/send', data, (res) => {
                if (res.code === 0) {
                  wx.showToast({
                    title: '发货成功',
                    icon: 'success',
                    duration: 2000
                  });
                  setTimeout(() => {
                    wx.navigateBack({ delta: 1 })
                  }, 1000)
                } else {
                  wx.showToast({
                    title: res.msg,
                    icon: 'none',
                    duration: 2000
                  })
                }
                this.setData({ shipLoading: false })
              })
            }
          })
        } else {
          // that.save_phones(tempFilePath, callback)
        }
      }
    })
  }
})
//获取应用实例
const app = getApp();

Page({
  data: {
    totalAccount: 0,
    waitAccount: 0,
    bankCode: '',
    name: '',
    bank: '',
    nickname: ''
  },
  onShow() {
    this.getDetail();
  },
  onLoad() {
    wx.getUserInfo({
      success: res => {
        this.setData({
          nickname: JSON.parse(res.rawData).nickName
        })
      }
    })
  },
  getDetail() {
    app.globalFun.http.post('cash/index', {}, (res) => {
      if (res.code === 0) {
        this.setData({
          // todayAccount: res.data.day_account,
          totalAccount: res.data.walletAmount,
          // cumulativeAccount: res.data.cumulative_account,
          waitAccount: res.data.waitAmount,
          // take_amount: res.data.take_amount
        })
      }
    })
  },
  toDetail() {
    wx.navigateTo({
      url: '/pages/seller/fund/detail',
    })
  },
  toRecord() {
    wx.navigateTo({
      url: '/pages/seller/fund/record',
    })
  },
  onPullDownRefresh: function () {
    this.getDetail();
    setTimeout(() => {
      wx.stopPullDownRefresh();
    }, 1000)
  },
  onShowDialog() {
    wx.navigateTo({
      url: '/pages/seller/fund/confirm',
    })
  },
  withdrawal() {
    app.globalFun.http.post('cash/take', {
      account: this.data.nickname
    }, (res) => {
      if (res.code === 0) {
        wx.showToast({
          title: '提现成功',
          icon: 'success',
          duration: 2000
        });
        wx.redirectTo({
          url: '/pages/seller/fund/index',
        })
      } else {
        wx.showToast({
          title: res.msg,
          icon: 'none',
          duration: 2000
        })
      }
    })
  },
  // 获取账户详情
  getAccount() {
    app.globalFun.http.post('account/info', {}, (res) => {
      if (res.code === 0) {
        this.setData({
          bankCode: res.data.card_number,
          name: res.data.name,
          bank: res.data.bank,
        })
      }
    })
  }
})

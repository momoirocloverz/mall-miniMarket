// pages/seller/fund/confirm.js
const app = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    totalAccount: 0,
    amountValue: '',
    disabled: false,
    showDialog: false,
    nickname: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.getInfo();
    this.userInfo();
  },
  userInfo() {
    wx.getUserInfo({
      success: res => {
        this.setData({
          nickname: JSON.parse(res.rawData).nickName
        })
      }
    })
  },
  getInfo() {
    app.globalFun.http.post('cash/index', {}, (res) => {
      if (res.code === 0) {
        this.setData({
          totalAccount: res.data.walletAmount,
        })
      }
    })
  },
  takeAll() {
    this.setData({
      amountValue: this.data.totalAccount
    })
  },
  inputValue(e) {
    if(e.detail.value) {
      this.setData({
        amountValue: e.detail.value.match(/\d+\.?\d{0,2}/)[0]
      })
    }
  },
  confirm() {
    if(!this.data.amountValue) {
      wx.showToast({
        title: '请输入提现金额',
        icon: 'none'
      })
      return;
    }
    if(+this.data.amountValue > +this.data.totalAccount) {
      wx.showModal({
        title: '警告',
        content: '您的提现金额超过钱包余额，请您修改后再提现。',
        showCancel: false
      })
      return;
    }
    if(+this.data.amountValue > 5000) {
      wx.showModal({
        title: '警告',
        content: '您的提现金额超过单日上限，请您修改后再提现',
        showCancel: false
      })
      return;
    }
    this.setData({
      disabled: true,
      showDialog: true
    })
  },
  closeDialog() {
    this.setData({
      showDialog: false,
      disabled: false
    })
  },
  withdrawal() {
    app.globalFun.http.post('cash/take', {
      amount: this.data.amountValue
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
        this.setData({
          disabled: false
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
})
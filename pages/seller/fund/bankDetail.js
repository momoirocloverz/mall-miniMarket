//获取应用实例
const app = getApp();

Page({
  data: {
    bankCode: '',
    name: '',
    bank: '',
  },
  onShow() {
    this.getAccount();
  },
  onChange(event) {
    if (event.currentTarget.dataset.type === '1') {
      this.setData({
        bankCode: event.detail
      })
    } else if (event.currentTarget.dataset.type === '2') {
      this.setData({
        name: event.detail
      })
    } else if (event.currentTarget.dataset.type === '3') {
      this.setData({
        bank: event.detail
      })
    }
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
  },
  save() {
    const {
      bank,
      bankCode,
      name
    } = this.data
    console.log(this.data)
    if (!bank || !bankCode || !name) {
      wx.showToast({
        title: '请将数据填写完整',
        icon: 'none'
      })
      return false
    }
    app.globalFun.http.post('cash/account', {
      bank,
      card_number: bankCode,
      name
    }, (res) => {
      if (res.code === 0) {
        wx.showToast({
          title: '保存成功',
          icon: 'success',
          duration: 2000
        });
        wx.navigateBack()
      }
    })
  }
})

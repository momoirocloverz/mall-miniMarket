//获取应用实例
const app = getApp();

Page({
  data: {
    value: ''
  },
  onLoad: function (options) {
    const val = decodeURIComponent(options.val);
    this.setData({
      value: val,
    })
  },
  changePhone(event) {
    this.setData({
      value: event.detail.value
    })
  },
  submit() {
    if (this.data.value === '') {
      wx.showToast({
        title: '请上传店铺电话',
        icon: 'none'
      })
      return false
    }
    app.globalFun.http.get('store/edit', {
      mobile: this.data.value
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

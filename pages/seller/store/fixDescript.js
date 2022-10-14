//获取应用实例
const app = getApp();

Page({
  data: {
    limit: 40,
    value: ''
  },
  onLoad: function (options) {
    const val = decodeURIComponent(options.val);
    this.setData({
      value: val,
      limit: 40 - val.length
    })
  },
  changeDes(event) {
    this.setData({
      limit: 40 - event.detail.value.length,
      value: event.detail.value
    })
  },
  submit() {
    if (this.data.value === '') {
      wx.showToast({
        title: '请输入店铺简介',
        icon: 'none'
      })
      return false
    }
    app.globalFun.http.get('store/edit', {
      description: this.data.value
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

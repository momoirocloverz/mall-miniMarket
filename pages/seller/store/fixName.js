//获取应用实例
const app = getApp();

Page({
  data: {
    limit: 20,
    value: ''
  },
  onLoad: function (options) {
    const val = decodeURIComponent(options.val);
    this.setData({
      value: val,
      limit: 20 - val.length
    })
  },
  changeName(event) {
    this.setData({
      limit: 20 - event.detail.value.length,
      value: event.detail.value
    })
  },
  submit() {
    if (this.data.value === '') {
      wx.showToast({
        title: '请上传店铺名称',
        icon: 'none'
      })
      return false
    }
    app.globalFun.http.get('store/edit', {
      title: this.data.value
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

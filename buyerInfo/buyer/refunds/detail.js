// pages/buyer/refunds/detail.js
//获取应用实例
const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getInfo(options)
  },
  getInfo(options) {
    wx.showLoading({
      title: '加载中',
    })
    app.globalFun.http.post('order/apply_info', {
      apply_id: options.apply_id
    }, (res) => {
      wx.hideLoading();
      if (res.code === 0) {
        this.setData({
          orderInfo: res.data,
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

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

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
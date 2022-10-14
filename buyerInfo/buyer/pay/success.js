// pages/buyer/pay/success.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    options: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      options: options
    })
  },
  // 去店铺首页
  toIndex(){
    wx.switchTab({
      url: '/pages/buyer/index/index',
    })
  },
  // 查看订单
  toOrderDetail(){
    console.log(this.data.options)
    wx.navigateTo({
      url: '/buyerInfo/buyer/order/detail?order_sn=' + this.data.options.order_sn,
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

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
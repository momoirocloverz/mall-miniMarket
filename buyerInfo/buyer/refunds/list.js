// pages/buyer/refunds/list.js
//获取应用实例
const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    isEnd: false,
    page: 1,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getList()
  },

  getList() {
    wx.showLoading({
      title: '加载中',
    })
    app.globalFun.http.post('order/apply_list', {
      page: this.data.page,
      page_size: 10,
    }, (res) => {
      wx.hideLoading();
      if (res.code === 0) {
        let isEnd = this.data.page >= res.data.last_page ? true : false
        this.setData({
          orderList: res.data.data,
          isEmpty: res.data.total == 0 ? true : false,
          checkStatus: false,
          isEnd: isEnd
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
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    if (!this.data.isEnd) {
      this.setData({
        page: this.data.page + 1,
      })
      this.getList();
    }
  },
})
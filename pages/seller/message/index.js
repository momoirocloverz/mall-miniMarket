//获取应用实例
const app = getApp();

Page({
  data: {
    msgList: [],
    page: 1,
    isEnd: false,
    isEmpty: false
  },
  onShow() {
    wx.hideHomeButton();
  },
  onLoad: function (options) {
    this.getMsgList();
  },
  getMsgList() {
    app.globalFun.http.get('store/message', {
      page_size: 6,
      page: this.data.page
    }, (res) => {
      if (res.code === 0) {
        if (res.data.total === 0) {
          this.setData({
            isEmpty: true
          })
        } else if (this.data.page === 1 && res.data.total === res.data.data.length) {
          this.setData({
            msgList: res.data.data,
            isEnd: true
          })
        } else {
          if (this.data.msgList.length < res.data.total) {
            this.setData({
              msgList: this.data.msgList.concat(res.data.data),
              isEnd: false
            })
          } else {
            this.setData({
              isEnd: true
            })
          }
        }
      } else {
        wx.showToast({
          title: res.msg,
          icon: 'none',
          duration: 2000
        })
      }
    })
  },
  // 上拉加载
  onReachBottom: function () {
    if (!this.data.isEnd && !this.data.isEmpty) {
      let page = this.data.page + 1
      this.setData({
        page: page
      })
      this.getMsgList()
    } else {
      return false
    }
  },
  // 下拉刷新
  onPullDownRefresh: function () {
    this.setData({
      msgList: [],
      page: 1,
      isEnd: false,
      isEmpty: false
    })
    this.getMsgList()
    setTimeout(() => {
      wx.stopPullDownRefresh();
    }, 1000)
  }
})

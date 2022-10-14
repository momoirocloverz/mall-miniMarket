//获取应用实例
const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    page: 1,
    orderList: [],
    isEmpty: false,
    isEnd: false,
    reason: '',
    showDialog: false,
    order_id: '',
  },
  onShow: function (options) {
    this.clearState();
    this.getGoodsList();
    
  },
  getGoodsList() {
    wx.showLoading({
      title: '加载中',
    })
    app.globalFun.http.post('order/seller_list', {
      typeName: '待发货',
      page_size: 6,
      page: this.data.page
    }, (res) => {
      wx.hideLoading();
      if (res.code === 0) {
        if( res.data.total === 0 ) {
          this.setData({
            isEmpty: true
          })
          return
        }
        if(this.data.orderList.length >= res.data.total) {
          this.setData({
            isEnd: true
          })
          return
        } else {
          this.setData({
            orderList: this.data.orderList.concat(res.data.data),
            isEnd: false
          })
        }
      } else {
        wx.showToast({
          title: res.msg,
          icon: 'none'
        })
      }
    })
  },
  // 去发货
  toShip(event) {
    wx.navigateTo({
      url: '/pages/seller/shipments/detail?order_sn=' + event.currentTarget.dataset.id,
    })
  },
  inReason(e) {
    this.setData({
      reason: e.detail.value.trim()
    })
  },
  quxiao() {
    this.setData({
      showDialog: false,
      reason: ''
    })
  },
  queding() {
    if(this.data.reason.trim() === '') {
      wx.showToast({
        title: '请填写原因',
        icon: 'none'
      })
      return
    }
    app.globalFun.http.post('order/seller_cancel', {
      order_sn: this.data.order_id,
      comment: this.data.reason
    }, r => {
      console.log(r, 'r')
      if(r.code === 0) {
        wx.showToast({
          title: '已取消',
          icon: 'none'
        })
        this.setData({
          reason: '',
          showDialog: false,
          orderList: [],
          page: 1
        }, () => {
          this.getGoodsList()
        })
      } else {
        wx.showToast({
          title: r.msg,
          icon: 'none'
        })
      }
    })
  },
  cancel(e) {
    this.setData({
      showDialog: true,
      order_id: e.currentTarget.dataset.id,
    })
  },
  clearState() {
    this.setData({
      orderList: [],
      page: 1,
      isEnd: false,
      isEmpty: false
    });
  },
  // 上拉加载
  onReachBottom: function () {
    if (!this.data.isEnd && !this.data.isEmpty) {
      let page = this.data.page + 1;
      this.setData({
        page: page
      });
      this.getGoodsList();
    } else {
      return false
    }
  },
  // 下拉刷新
  onPullDownRefresh: function () {
    this.clearState();
    this.getGoodsList();
    setTimeout(() => {
      wx.stopPullDownRefresh();
    }, 1000)
  }
})
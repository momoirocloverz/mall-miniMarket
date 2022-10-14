//获取应用实例
const app = getApp();

Page({
  /**
   * 页面的初始数据
   */
  data: {
    modifyPrice: 0,
    isEnd: false,
    page: 1,
    status: 0,
    cateList: [
      {
        value: 0,
        name: '全部'
      },
      {
        value: 1,
        name: '待付款'
      },
      {
        value: 2,
        name: '待发货'
      },
      {
        value: 3,
        name: '待收货'
      }
    ],
    cateType: '全部',
    isEmpty: false,
    orderList: [],
    orderType: [
      {
        name: '待付款'
      },
      {
        name: '已取消'
      },
      {
        name: '超时取消'
      },
      {
        name: '待发货'
      },
      {
        name: '已发货'
      },
      {
        name: '售后中'
      },
      {
        name: '交易完成'
      },
      {
        name: '交易关闭'
      },
      {
        name: '已取消'
      }
    ],
    showDialog: false,
    showModifyDialog: false,
    reason: '',
    order_id: '',
    dialogType: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onShow: function (options) {
    this.setData({
      orderList: [],
      page: 1,
    }, () => {
      this.getList()
    })
  },
  // 去发货
  toShip(event) {
    wx.navigateTo({
      url: '/pages/seller/shipments/detail?order_sn=' + event.currentTarget.dataset.id,
    })
  },
  agree(e) {
    console.log(e)
    wx.showModal({
      title: '提示',
      content: '确定同意买家退货吗？',
      success: (res) => {
        if (res.confirm) {
          app.globalFun.http.post('refund/pass', {
            order_id: e.currentTarget.dataset.item.order_id,
            refund_money: e.currentTarget.dataset.item.pay_price
          }, r => {
            if(r.code === 0) {
              this.setData({
                orderList: [],
                page: 1
              }, () => {
                this.getList()
              })
            }
          })
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      } 
    })
  },
  refuse(e) {
    this.setData({
      showDialog: true,
      order_id: e.currentTarget.dataset.item.order_id,
      dialogType: 'refuse'
    })
  },
  inReason(e) {
    this.setData({
      reason: e.detail.value.trim()
    })
  },
  modifyPrice(e) {
    this.setData({
      modifyPrice: e.detail.value.trim()
    })
  },
  quxiao() {
    this.setData({
      showDialog: false,
      reason: ''
    })
  },
  quxiaoModify() {
    this.setData({
      showModifyDialog: false,
      modifyPrice: 0
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
    if(this.data.dialogType === 'refuse'){
      app.globalFun.http.post('refund/refuse', {
        order_id: this.data.order_id,
        refuse_reason: this.data.reason
      }, r => {
        console.log(r, 'r')
        if(r.code === 0) {
          wx.showToast({
            title: '已拒绝',
            icon: 'none'
          })
          this.setData({
            reason: '',
            showDialog: false,
            dialogType: '',
            orderList: [],
            page: 1
          }, () => {
            this.getList()
          })
        } else {
          wx.showToast({
            title: r.msg,
            icon: 'none'
          })
        }
      })
    }else if(this.data.dialogType === 'calcle'){
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
            dialogType: '',
            orderList: [],
            page: 1
          }, () => {
            this.getList()
          })
        } else {
          wx.showToast({
            title: r.msg,
            icon: 'none'
          })
        }
      })
    }
  },
  quedingModify() {
    if(this.data.modifyPrice.trim() === '') {
      wx.showToast({
        title: '请填写价格',
        icon: 'none'
      })
      return
    }
    const that = this
    wx.showModal({
      title: '提示',
      content: '确定要修改成交价么？',
      success (res) {
        if (res.confirm) {
          console.log("hhahhha");
          app.globalFun.http.post('order/alter_amount', {
            order_sn: that.data.order_id,
            amount: that.data.modifyPrice
          }, r => {
            if(r.code === 0) {
              wx.showToast({
                title: '操作成功',
                icon: 'none'
              })
              that.setData({
                modifyPrice: 0,
                showModifyDialog: false,
                orderList: [],
                page: 1
              }, () => {
                that.getList()
              })
            } else {
              wx.showToast({
                title: r.msg,
                icon: 'none'
              })
            }
          })
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },
  //点击导航
  clickNav(e) {
    const value = e.currentTarget.dataset.item.value
    this.setData({
      status: value,
      cateType: this.data.cateList[value].name,
      isEnd: false,
      isEmpty: true,
      page: 1,
      orderList: []
    }, () => {
      this.getList();
    })
  },
  // 切换分类
  selectCate(e) {
    let cateName = e.detail.title;
    this.setData({
      cateType: cateName,
      isEnd: false,
      page: 1,
      status: Number(options.status)
    }, () => {
      this.getList()
    })
  },
  getList() {
    wx.showLoading({
      title: '加载中',
    })
    app.globalFun.http.post('order/seller_list', {
      page: this.data.page,
      page_size: 6,
      typeName: this.data.cateType
    }, (res) => {
      wx.hideLoading();
      if (res.code === 0) {
        let isEnd = this.data.page >= res.data.last_page ? true : false
        this.setData({
          orderList: this.data.orderList.concat(res.data.data),
          isEmpty: res.data.total == 0 ? true : false,
          checkStatus: false,
          isEnd: isEnd
        })
      }
    })
  },
  // 订单详情
  toDetail(e) {
    const order_sn = e.currentTarget.dataset.item.order_sn
    wx.navigateTo({
      url: '/pages/seller/orderManage/detail?order_sn=' + order_sn,
    })
  },
  // 上拉加载
  onReachBottom: function () {
    if (!this.data.isEnd && !this.data.isEmpty) {
      let page = this.data.page + 1;
      this.setData({
        page: page
      }, () => {
        this.getList()
      });
    } else {
      return false
    }
  },
  // 下拉刷新
  onPullDownRefresh: function () {
    this.setData({
      orderList: [],
      page: 1,
      isEnd: false,
      isEmpty: false
    }, () => {
      this.getList();
    });
    setTimeout(() => {
      wx.stopPullDownRefresh();
    }, 1000)
  },
  // 取消订单
  calcle(e) {
    this.setData({
      showDialog: true,
      order_id: e.currentTarget.dataset.id,
      dialogType: 'calcle'
    })
  },
  // 调整价格
  modify(e) {
    this.setData({
      showModifyDialog: true,
      order_id: e.currentTarget.dataset.id,
      modifyPrice: e.currentTarget.dataset.price
    })
  }
})
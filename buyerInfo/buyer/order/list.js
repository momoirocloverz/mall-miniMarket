// pages/buyer/order/list.js
//获取应用实例
const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    isEnd: false,
    page: 1,
    active: 0,
    options: '',
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
    status: 0,
    isEmpty: false,
    orderList: [],
    isX: false,
    headTop: '',
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
        name: '卖家取消'
      }
    ]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onShow() {
    this.setData({
      orderList: [],
      page: 1,
    }, () => {
      this.getList();
    })
  },
  onLoad: function (options) {
    const pages = getCurrentPages()
    const data = wx.getMenuButtonBoundingClientRect();
    this.setData({
      cateType: this.data.cateList[options.status].name,
      active: Number(options.status),
      store_id: wx.getStorageSync('store_id'),
      options: options,
      status: Number(options.status),
      isX: app.globalData.isX,
      headTop: Number(data.top) + 42
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
  // 切换分类-暂时不用，有性能问题
  selectCate(e) {
    let cateName = e.detail.title;
    this.setData({
      cateType: cateName,
      isEnd: false,
      page: 1,
      orderList: []
    }, () => {
      this.getList()
    })
  },
  reloadList() {
    this.setData({
      orderList: [],
      page: 1,
    }, () => {
      this.getList()
    })
  },
  getList() {
    wx.showLoading({
      title: '加载中',
    })
    app.globalFun.http.post('order/list', {
      page: this.data.page,
      page_size: 5,
      typeName: this.data.cateType,
      store_id: this.data.store_id
    }, (res) => {
      setTimeout(() => {
        wx.hideLoading();
      }, 500)
      if (res.code === 0) {
        let isEnd = this.data.page >= res.data.last_page ? true : false
        this.setData({
          orderList: this.data.orderList.concat(res.data.data.map(item=>{
            return{
              ...item,
              store_name: item.store_name.length > 9? item.store_name.substr(0,10)+"..." : item.store_name
            }
          })),
          isEmpty: res.data.total == 0 ? true : false,
          checkStatus: false,
          isEnd: isEnd
        })
      }
    })
  },
  // 订单详情
  toDetail(e) {
    console.log(e)
    const order_sn = e.currentTarget.dataset.item.order_sn
    wx.navigateTo({
      url: '/buyerInfo/buyer/order/detail?order_sn=' + order_sn,
    })
  },
  onClickLeft() {
    if (this.data.options.source === 'confirm') {
      wx.switchTab({
        url: '/pages/buyer/index/index',
      })
    } else {
      wx.navigateBack()
    }
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
  goStore(e){
    wx.reLaunch({
      url: '/pages/buyer/index/index?store_id=' + e.currentTarget.dataset.id,
    })
  }
})
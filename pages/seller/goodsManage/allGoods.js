//index.js
//获取应用实例
const app = getApp();

Page({
  data: {
    active: 'sell',
    imageURL: 'https://img.hzanchu.com/acimg/53a1e3346c33248ae9855f1a12ebb671.jpeg?x-oss-process=image/resize,l_300',
    pageSize: 10,
    page: 1,
    isEnd: false,
    isEmpty: false,
    list: [],
    onSaleNum: 0,
    onSellNum: 0,
    showDeleteDialog: false,
    goodsId: '',
    toggle: 'all',
    isX: false,
    headTop: '',
    status: 1,
    tabList:[
      {
        value: 1,
        name: '出售中',
        count: 0
      },
      {
        value: 2,
        name: '售罄',
        count: 0
      },
    ],
    menubutton: '',
    opacity: 1,
    backIcon: '../../../lib/image/back-icon.png',
    homeIcon: '../../../lib/image/home-icon.png'
  },
  onLoad() {
    const data = wx.getMenuButtonBoundingClientRect();
    this.setData({
      headTop: Number(data.top) + 42,
      isX: app.globalData.isX,
    })
    this.setData({
      menubutton: app.globalData.menuButton
    })
  },
  onShow() {
    wx.setStorageSync('goodsPageTitle', '编辑商品');
    this.setData({
      list: [],
      page: 1,
    }, () => {
      this.getList();
    });
  },
  // onLoad() {
  //   this.getList();
  // },
  // tib标签切换
  onChange() {
    this.setData({
      active: this.data.active === 'sell' ? 'noSell' : 'sell',
      list: [],
      page: 1,
    }, () => {
      this.getList();
    });
  },
  // 跳商品详情
  toDetail(event) {
    wx.navigateTo({
      url: '/pages/seller/goodsManage/goodsDetail?id=' + event.currentTarget.dataset.id,
    })
  },
  // 获取详情
  getList() {
    const {
      pageSize,
      active,
      page,
      status
    } = this.data
    wx.showLoading({
      title: '加载中',
    })
    app.globalFun.http.post('goods/list', {
      page_size: pageSize,
      page,
      status: status,
    }, (res) => {
      wx.hideLoading();
      if (res.code === 0) {
        this.setData({
          onSaleNum: res.data.on_sale,
          onSellNum: res.data.on_sell,
          'tabList[0].count': res.data.on_sale,
          'tabList[1].count': res.data.on_sell,
          
        });
        if (res.data.data.total === 0) {
          this.setData({
            isEmpty: true,
            list: [],
            isEnd: false
          })
        } else if (page === 1 && res.data.data.total === res.data.data.data.length) {
          this.setData({
            list: res.data.data.data,
            isEnd: true,
            isEmpty: false,
          })
        } else {
          if (this.data.list.length < res.data.data.total) {
            this.setData({
              list: this.data.list.concat(res.data.data.data),
              isEnd: false,
              isEmpty: false,
            })
          } else {
            this.setData({
              isEnd: true,
              isEmpty: false,
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
      let page = this.data.page + 1;
      this.setData({
        page: page
      }, () => {
        this.getList();
      });
    } else {
      return false
    }
  },
  toAllGoods() {
    wx.redirectTo({
      url: '/pages/seller/goodsManage/allGoods',
    })
  },
  toGoodsType() {
    wx.redirectTo({
      url: '/pages/seller/goodsManage/allTypes',
    })
  },
  goBack() {
    wx.redirectTo({
      url: '/pages/seller/index/index',
    })
  },
  clickNav(e) {
    console.log(e,'val')
    const status = e.currentTarget.dataset.item.value 
    this.setData({
      status: status
    });
    this.getList();
  },
  // 下拉刷新
  onPullDownRefresh: function () {
    this.setData({
      list: [],
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
  showDialog(event) {
    console.log(event)
    this.setData({
      showDeleteDialog: true,
      goodsId: event.currentTarget.dataset.id
    })
  },
  deleteGoods() {
    app.globalFun.http.post('goods/delete', {
      goods_id: this.data.goodsId
    }, (res) => {
      if (res.code === 0) {
        wx.showToast({
          title: '删除成功',
          icon: 'success',
          duration: 2000
        });
        this.setData({
          list: [],
          page: 1,
        }, () => {
          this.getList();
        });
      }
    })
  },
  toEdit(e) {
    let goods_id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: '/pages/seller/addGoods/add?goodsId=' + goods_id +'&url=/pages/seller/goodsManage/allGoods'
    })
  }
})

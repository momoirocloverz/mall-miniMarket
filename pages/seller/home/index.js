//index.js
//获取应用实例
const app = getApp();

Page({
  data: {
    bannerList: [],
    isEnd: false,
    isEmpty: false,
    is_expert: '',
    wechat: '',
    mobile: '',
    category_id: 0, // 分类id
    cateList: [],
    goodsList: [],
    page: 1, // 页码
    bannerImage: '',
    storeId: '',
    menubutton: '',
    backIcon: '../../../lib/image/back-icon.png',
    homeIcon: '../../../lib/image/home-icon.png'
  },
  onLoad(options) {
    // 解析店铺id
    this.getStoreId()
    this.setData({
      menubutton: app.globalData.menuButton
    })
    console.log(this.data.menubutton.top, 'toptoptopt')
  },
  // 获取store_id
  getStoreId() {
    app.globalFun.http.get('user/me', {}, (res) => {
      if (res.code === 0) {
        wx.setStorageSync('store_id', res.data.store_id)
        this.getBannerInfo(res.data.store_id)
        this.getCateInfo(res.data.store_id)
        this.setData({
          storeId: res.data.store_id,
          goodsList: []
        }, () => {
          this.getGoodsInfo(res.data.store_id)
        })
      }
    })
  },
  //获取首页数据
  getGoodsInfo(id) {
    wx.showLoading({
      title: '页面加载中',
    })
    app.globalFun.http.post('index/list', {
      store_id: id,
      page: this.data.page,
      page_size: 10,
      category_id: this.data.category_id
    }, (r) => {
      wx.hideLoading();
      if (r.code === 0) {
        let isEnd = true
        if (this.data.category_id === 0) {
          isEnd = true
        } else {
          isEnd = this.data.page >= r.data.last_page ? true : false
        }
        this.setData({
          goodsList: r.data.data.length > 0 ? this.data.goodsList.concat(r.data.data) : [],
          isEmpty: r.data.data.length > 0 ? false : true,
          isEnd: isEnd
        })
      } else {
        this.setData({
          isEmpty: true,
          goodsList: []
        })
      }
    })
  },
  getBannerInfo(store_id) {
    app.globalFun.http.post('index/banner', {
      store_id: store_id
    }, (r) => {
      this.setData({
        bannerImage: r.data.banner
      })
    })
  },
  // 获取分类数据
  getCateInfo(id) {
    app.globalFun.http.post('index/category', {
      store_id: id
    }, (r) => {
      if (r.code === 0) {
        this.setData({
          cateList: r.data || []
        })
      }
    })
  },
  // 切换分类
  selectCate(e) {
    const index = e.detail.index,
      id = this.data.cateList[index].id;
    if (this.data.category_id === id) {
      return false
    } else {
      this.setData({
        category_id: id,
        isEnd: false,
        page: 1,
        goodsList: []
      }, () => {
        this.getGoodsInfo(this.data.storeId);
      })
    }
  },
  // 监听页面滚动
  onPageScroll(e) {
    this.setData({
      opacity: (e.scrollTop / 30).toFixed(2)
    })
  },
  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    if (!this.data.isEnd) {
      this.setData({
        page: this.data.page + 1,
      }, () => {
        this.getGoodsInfo(this.data.storeId);
      })
    }
  }
})

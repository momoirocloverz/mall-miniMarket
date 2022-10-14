//index.js
//获取应用实例
const app = getApp();
import userInfo from '../../../api/userInfo';

Page({
  data: {
    title: '',
    isEnd: false,
    isEmpty: false,
    category_id: 0, // 分类id
    cateList: [],
    goodsList: [],
    page: 1, // 页码
    shareInfo: {}, //分享信息
    bannerImage: '',
    store_id: '',
    is_login: false,
    loading: true,
    slideShow: false,
    currentTab: 0, //预设当前项的值
    scrollLeft: 0, //tab标题的滚动条位置
    
    // 自定义导航style
    isShowLicense: false,
    paddingBottom: 0,
    is_collect: 0,
    statusBarHeight: 0,
    latitude: 0,
    longitude: 0,
    address: '',
    storeInfo: null,
    page_size: 10,
    menubutton: '',
    backIcon: '../../../lib/image/back-icon.png',
    homeIcon: '../../../lib/image/home-icon.png'
  },
  onLoad(options) {
    // 通过二维码扫码进来
    if (options.scene) {
      const result = decodeURIComponent(options.scene);
      const storeId = result.split('&')[1].split('=')[1];
      this.setData({
        options: {
          store_id: storeId
        }
      })
      if (storeId) {
        this.commonLoader(storeId);
        wx.setStorageSync('store_id', storeId)
      }
    } else {
      let storeId = options.store_id || wx.getStorageSync('store_id');
      this.commonLoader(storeId);
      if (options.store_id) {
        wx.setStorageSync('store_id', options.store_id)
      }
      this.getShopViews()
    }
    this.getOtherStore()
    this.getShare();
    this.setData({
      goodsList: []
    }, () => {
      this.getGoodsInfo();
    })
  },
  onShow() {
    const token = wx.getStorageSync('userInfo')
    if (token) {
      // 切换为买家身份
      this.setScene()
    }
    // token存在已登录,否则未登录
    this.setData({
      is_login:!token
    });
    this.setData({
      menubutton: app.globalData.menuButton
    })
  },
  commonLoader(storeId) {
    this.setData({
      store_id: storeId
    }, () => {
      this.getBannerInfo()
      this.getCateInfo()
    })
  },
  getOtherStore() {
    let data = {
      id: this.data.store_id
    };
    app.globalHttps.getOtherDetail(data).then(res => {
      app.wxApi.hideLoading();
      if (res.code === 0) {
        let data = res.data;
        this.setData({
          storeInfo: data,
          latitude: Number(data.latitude),
          longitude: Number(data.longitude),
          address: data.address
        });
        if (data.license_image_url) {
          this.setData({
            isShowLicense: true
          });
        }
      }
    })
  },
  getShopViews() {
    let data = {
      store_id: this.data.store_id
    };
    if(userInfo.getUserInfoParams('token')) app.globalHttps.getHistoryRecord(data);
  },
  // 获取store_id
  getStoreId() {
    app.globalHttps.getUserMe().then(res => {
      this.getCateInfo(res.data.store_id)
    });
  },
  // 加入购物车
  onAddCart(value) {
    let data = {
      store_id: this.data.store_id,
      goods_id: value.detail.goods_id,
      entrance: 'cart'
    };
    app.globalHttps.addShopCar(data).then(res => {
      if (res.code === 0) {
        let title = '加购成功';
        app.wxApi.showToast(title, 'success');
      }
    });
  },
  //获取首页数据
  getGoodsInfo() {
    app.wxApi.showLoading('加载中');
    const {
      category_id,
      store_id,
      page,
      page_size,
      goodsList
    } = this.data;
    let data = {
      store_id,
      page,
      page_size,
      category_id
    };
    app.globalHttps.getStoreGoods(data).then(res => {
      app.wxApi.hideLoading();
      if (res.code === 0) {
        let data = res.data;
        if (!category_id) {
          data.page = 1;
          data.last_page = 1;
        }
        let isEnd = page >= data.last_page ? true : false;
        this.setData({
          goodsList: data.data.length > 0 ? goodsList.concat(data.data) : [],
          isEmpty: data.data.length > 0 ? false : true,
          isEnd,
          loading: false
        });
      } else {
        this.setData({
          isEmpty: true,
          goodsList: [],
          loading: false
        });
      }
    })
  },
  // 获取banner
  getBannerInfo() {
    let data = {
      store_id: this.data.store_id
    };
    app.globalHttps.getBanner(data).then(res => {
      this.setData({
        bannerImage: res.data.banner ? res.data.banner : app.globalUrls.commonBanner,
        is_collect: res.data.is_collect
      });
    });
  },
  // 获取分类数据
  getCateInfo() {
    let data = {
      store_id: this.data.store_id
    };
    app.globalHttps.getCategory(data).then(res => {
      if (res.code === 0) {
        this.setData({
          cateList: res.data || []
        });
        if (this.data.cateList.length <= 10) {
          this.setData({
            slideShow: false
          });
        }
      }
    })
  },
  // 切换分类
  selectCate(e) {
    const id = this.data.cateList[e.detail.index].id;
    if (this.data.category_id !== id) {
      this.setData({
        category_id: id,
        isEnd: false,
        page: 1,
        goodsList: []
      }, () => {
        this.getGoodsInfo();
      })
    }
  },
  // 去登陆
  goLogin() {
    let url = `/pages/common/login/index?url=/pages/buyer/index/index&store_id=${this.store_id}`;
    app.wxApi.navigateTo(url);
  },
  handleCollect() {
    let data = {
      store_id: this.data.store_id
    };
    if (!this.data.is_collect) {
      app.globalHttps.addCollect(data).then(res => {
        if (res.code === 0) {
          app.wxApi.showToast('收藏成功');
          this.setData({
            is_collect: true
          });
        } else {
          app.wxApi.showToast(res.msg || '收藏失败');
        }
      });
    } else {
      app.globalHttps.deleteCollect(data).then(res => {
        if (res.code === 0) {
          app.wxApi.showToast('取消收藏成功');
          this.setData({
            is_collect: false
          });
        } else {
          app.wxApi.showToast(res.msg || '操作失败');
        }
      });
    }
  },
  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    const {
      isEnd,
      category_id,
      page
    } = this.data;
    if (!isEnd && category_id) {
      this.setData({
        page: page + 1,
      }, () => {
        this.getGoodsInfo();
      })
    }
  },
  // 获取分享信息
  getShare() {
    let data = {
      store_id: this.data.store_id
    };
    app.globalHttps.shareHome(data).then(res => {
      if (res.code === 0) {
        let title = res.data.store_name;
        app.wxApi.setNavigationBarTitle(title);
        this.setData({
          shareInfo: res.data,
          title: (title && title.length > 6) ? `${title.substring(0,6)}...` : title
        });
      }
    });
  },
  //切换身份
  setScene() {
    let data = {
      client_user_role: '0'
    };
    app.globalHttps.checkScene(data).then(res => {
      if (res.code !== 0) {}
    });
  },
  onPullDownRefresh() {
    this.setData({
      goodsList: [],
      page: 1
    }, () => {
      this.getGoodsInfo();
      this.getOtherStore();
    })
    wx.stopPullDownRefresh()
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    const {
      store_name,
      path,
      imgurl
    } = this.data.shareInfo;
    return {
      title: store_name,
      path: path,
      imageUrl: imgurl
    }
  },
  goLicense: function () {
    if(this.data.isShowLicense) {
      let url = `/buyerInfo/buyer/licensePhoto/index?store_id=${this.data.store_id}`;
      app.wxApi.navigateTo(url);
    } else {
      return
    }
  },
  toLocation() {
    const {
      latitude,
      longitude,
      address
    } = this.data;
    if (latitude) {
      wx.openLocation({
        type: 'gcj02',
        latitude: latitude,
        longitude: longitude,
        name: address,
        scale: 14
      })
    }
  }
})
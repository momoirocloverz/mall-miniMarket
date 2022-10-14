//index.js
import userInfo from '../../../api/userInfo.js'
//获取应用实例
const app = getApp();
// 入口
const ENTRY_LIST = [
  {
    url: '/pages/seller/addGoods/add',
    img: 'https://img.phbjx.com/test/92d99034cc6ebf7af1704cf531ca8ed4.png',
    name: '添加商品'
  },
  {
    url: '/pages/seller/goodsManage/allGoods',
    img: 'https://img.phbjx.com/test/2367a33b9b3cd02d4a98c0de265cf9bb.png',
    name: '商品管理'
  }, 
  {
    url: '/pages/seller/shipments/list',
    img: 'https://img.phbjx.com/test/951c1f576cdfa90d32d59712ee064a89.png',
    name: '发货管理'
  }, 
  {
    url: '/pages/seller/store/manager',
    img: 'https://img.phbjx.com/test/777f40f9c98448f02867df21e6d600dd.png',
    name: '店铺管理'
  },
  {
    url: '/pages/seller/home/index',
    img: 'https://img.phbjx.com/test/8486fe1f616a8683568e522343e3ccf9.png',
    name: '店铺预览'
  },
  {
    url: '/pages/seller/orderManage/list',
    img: 'https://img.phbjx.com/test/c510e889b2620291d7e0b80927783443.png',
    name: '订单管理'
  },
  {
    url: '/pages/seller/fund/index',
    img: 'https://img.phbjx.com/test/cb68c30456a65efdce5b7172be6ab76e.png',
    name: '资金管理'
  }
]

Page({
  data: {
    dataList: [{
      data: '',
      name: '今日营业额'
    }, {
      data: '',
      name: '今日付款单数'
    }, {
      data: '',
      name: '今日待发货单数'
    }],
    entryList: ENTRY_LIST,
    headImg: '',
    storeTitle: '',
    shareInfo: {},
    overlayVisible: false,
    noShipOrder: 0,
    menubutton: '',
    opacity: 0,
    backIcon: '../../../lib/image/back-icon.png',
    homeIcon: '../../../lib/image/home-icon.png'
  },
  onShow() {
    wx.setStorageSync('goodsPageTitle', '新增商品');
    this.getData();
  },
  onLoad: function() {
    this.setScene();
    this.getUserInfo();
    wx.setStorageSync('source', 'store')
    this.setData({
      menubutton: app.globalData.menuButton
    })
  },
  // 更新角色
  setScene() {
    app.globalFun.http.get('switch/role', {
      client_user_role: '1'
    }, (res) => {
      if (res.code !== 0) {
        wx.showToast({
          title: res.msg,
          icon: 'none',
          duration: 2000
        })
      }
    })
  },
  // 获取数据
  getData() {
    app.globalFun.http.get('store/home', {}, (res) => {
      if (res.code === 0) {
        this.data.dataList[0].data = res.data.turnover || '0.00',
        this.data.dataList[1].data = res.data.order_count || 0,
        this.data.dataList[2].data = res.data.delivery || 0,
        this.setData({
          dataList: [...this.data.dataList],
          headImg: res.data.store_image === '' ? 'https://img.hzanchu.com/acimg/312110ea0061743445e66d828fe9268c.png?x-oss-process=image/resize,l_300' : res.data.store_image,
          storeTitle: res.data.store_title,
          overlayVisible: res.data.first?true:false,
          noShipOrder: res.data.deliver || 0,
        })
      }
    })
  },
  // 下拉刷新
  onPullDownRefresh: function () {
    this.getData();
    setTimeout(() => {
      wx.stopPullDownRefresh();
    }, 1000)
  },
  // 入口跳转
  toDetailPage(event) {
    const jumpUrl = event.currentTarget.dataset.jumpUrl || '';
    wx.removeStorageSync('goodsTypes');
    wx.removeStorageSync('goodsDetailImgs');
    wx.removeStorageSync('goodsMainImgs');
    wx.removeStorageSync('goodData');
    if (userInfo.getUserInfoParams('token')) {
      wx.navigateTo({
        url: jumpUrl
      })
    } else {
      wx.navigateTo({
        url: '/pages/common/login/index?url=' + jumpUrl
      })
    }
  },
  // 获取用户信息
  getUserInfo() {
    app.globalFun.http.get('user/me', {}, (res) => {
      if (res.code === 0) {
        wx.setStorageSync('store_id', res.data.store_id)
        this.getShare(res.data.store_id)
      }
    })
  },
  // 分享
  onShareAppMessage(e) {
    return {
      title: this.data.shareInfo.store_name,
      path: this.data.shareInfo.path,
      imageUrl: this.data.shareInfo.imgurl
    }
  },
  //获取分享信息
  getShare(id) {
    app.globalFun.http.get('share/home', {
      store_id: id
    }, (res) => {
      if (res.code === 0) {
        this.setData({
          shareInfo: res.data
        })
      }
    })
  },
  // 去分享
  toShare() {
    wx.navigateTo({
      url: '/pages/common/share/shareStore?storeId=' + wx.getStorageSync('store_id'),
    })
  },
  // 店铺管理
  toStoreManage() {
    wx.navigateTo({
      url: '/pages/seller/store/manager',
    })
  },
  onClickHide() {
    this.setData({
      overlayVisible: false
    })
    app.globalFun.http.get('store/notfirst', {
      first: 0
    }, (res) => {
      if (res.code === 0) {
        console.log(res)
      }
    })
  },
  // 监听页面滚动
  onPageScroll(e) {
    this.setData({
      opacity: (e.scrollTop / 30).toFixed(2)
    })
  },
})

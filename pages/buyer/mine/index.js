// pages/buyer/mine/index.js
import Dialog from '@vant/weapp/dist/dialog/dialog';
const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: '',
    storeInfo: '', // 店铺信息
    showScene: false, // 切换身份弹窗
    is_login: false,//是否登录
    store_id: '',
    user_role: 0,
    mine_default: 'https://img.hzanchu.com/acimg/312110ea0061743445e66d828fe9268c.png?x-oss-process=image/resize,l_300',
    mine_user: '?x-oss-process=image/resize,m_lfit,h_150,w_150',
    is_open: 0,
    orderType: [
      { icon: 'https://img.hzanchu.com/acimg/b1b1bba82dd2780327b70a45cdfea22f.png', name: '待付款', value: '', path: '', method: 'goOrderList' },
      { icon: 'https://img.hzanchu.com/acimg/c19f93d295e35e8e4fbe95e1ed99cb10.png', name: '待发货', value: '', path: '', method: 'goOrderList' },
      { icon: 'https://img.hzanchu.com/acimg/6dd9a43cf60a3c661dd3329d0934a8b3.png', name: '待收货', value: '', path: '', method: 'goOrderList' },
    ],
    navList: [
      { icon: 'https://img.hzanchu.com/acimg/8d5f21dd3dc60caf7766e21a6491ddbc.png', name: '收货地址管理', value: '', path: '', method: 'goAddress', show: 1 },
      { icon: 'https://img.hzanchu.com/acimg/ab386bd8d10836482f12bf596eb4cded.png', name: '联系商家', value: '', path: '', method: 'callStore', show: 1 },
      { icon: 'https://img.hzanchu.com/acimg/9d80290b743e28a8729a80947f132803.png', name: '切换身份', value: '我是买家', path: '', method: 'changeScene', show: 0 },
      { icon: 'https://img.hzanchu.com/acimg/05a928b5be9413bcd9bd1d398d70f1f6.png', name: '我要开店', value: '', path: '', method: 'goStore', show: 1},
      { icon: 'https://img.hzanchu.com/acimg/dc58de00587124528d2aecde4b08c94e.png', name: '我收藏的店铺', value: '', path: '', method: 'goCollection', show: 1},
      { icon: 'https://img.hzanchu.com/acimg/1b1c56bc3341fcd630b053ed9ce59b7c.png', name: '设置', value: '', path: '', method: 'goSet', show: 1},
      { icon: 'https://img.hzanchu.com/acimg/af38d3e995dc931f6c5b59f373147d36.png', name: '退出登录', value: '', path: '', method: 'logOut', show: 1}
    ]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      store_id: wx.getStorageSync('store_id')
    })
  },
  onShow(){
    this.setData({
    })
    this.getUserInfo()
  },
  // 获取用户信息
  getUserInfo() {
    const is_login =  wx.getStorageSync('userInfo') ? true : false
    wx.showLoading({
      title: '加载中',
    })
    app.globalFun.http.get('user/me', {
      store_id: this.data.store_id
    }, (res) => {
      wx.hideLoading()
      if (res.code === 0) {
        this.setData({
          userInfo: res.data,
          is_login: is_login,
          user_role: res.data.user_role,
          'orderType[0].value': res.data.order_count ? res.data.order_count.unPay : 0,
          'orderType[1].value': res.data.order_count ? res.data.order_count.unDelivery : 0,
          'orderType[2].value': res.data.order_count ? res.data.order_count.unRec : 0,
          'navList[1].show': is_login ? 1 : 0,
          'navList[2].show': res.data.user_role && is_login,
          'navList[3].show': res.data.user_role && is_login ? 0 : 1,
          'navList[4].show': is_login ? 1 : 0,
          'navList[6].show': is_login ? 1 : 0,
        })
      }
    })
  },
  //去往订单列表
  goOrderList(e) {
    wx.navigateTo({
      url: '/buyerInfo/buyer/order/list?source=mine&status=' + (e.currentTarget.dataset.status + 1),
    })
  },
  checkAllOrder() {
    wx.navigateTo({
      url: '/buyerInfo/buyer/order/list?status=0',
    })
  },
  goAfterSale(e) {
    wx.navigateTo({
      url: '/buyerInfo/buyer/refunds/list?status=' + e.currentTarget.dataset.status,
    })
  },
  //去往地址列表
  goAddress() {
    wx.navigateTo({
      url: '/buyerInfo/buyer/address/list',
    })
  },
  //联系商家
  callStore() {
    Dialog.confirm({
      width: 260,
      message: this.data.userInfo.store_mobile,
    })
    .then(() => {
      wx.makePhoneCall({
        phoneNumber: this.data.userInfo.store_mobile
      })
    })
    .catch(() => {
      // on cancel
    });
    
  },
  // 申请开店
  goStore() {
    wx.navigateTo({
      url: '/pages/seller/entryStore/index',
    })
  },
  // 我的收藏
  goCollection(){
    wx.navigateTo({
      url: '/buyerInfo/buyer/collection/index',
    })
  },
  // 切换身份
  changeScene() {
    this.setData({
      showScene: true
    })
  },
  setScene(){
    app.globalFun.http.get('switch/role', {
      client_user_role: '1'
    }, (res) => {
      if (res.code === 0) {
        wx.showToast({
          title: '身份切换成功',
          icon: 'success',
          duration: 2000
        });
        wx.setStorageSync('source', 'store')
        wx.reLaunch({
          url: '/pages/seller/index/index',
        })
      } else {
        wx.showToast({
          title: res.msg,
          icon: 'none',
          duration: 2000
        })
      }
      this.setData({
        showScene: false
      })
    })
  },
  onClose() {
    this.setData({
      showScene: false
    })
  },
  // 隐私协议
  goPrivacy() {
    wx.navigateTo({
      url: '/buyerInfo/buyer/policy/privacy',
    })
  },
  // 服务协议
  goService() {
    wx.navigateTo({
      url: '/buyerInfo/buyer/policy/service',
    })
  },
  goLogin() {
    wx.redirectTo({
      url: '/pages/common/login/index?url=/pages/buyer/mine/index',
    })
  },
  goSet() {
    wx.navigateTo({
      url: '/pages/common/setting/setting?user_role=0',
    })
  },

  logOut() {
    wx.showModal({
      content: '确定要退出登录吗',
      // cancelColor: 'cancelColor',
      success: (res)=>{
        if(res.confirm){
          app.globalFun.http.get('user/logout', {}, (res) => {
            if(res.code === 0){
              wx.showToast({
                title: '退出成功',
              })
              this.goLogin()
            }
          })
        }
      }
    })
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

})
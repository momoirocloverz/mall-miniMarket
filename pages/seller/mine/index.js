import Dialog from '@vant/weapp/dist/dialog/dialog';
//获取应用实例
const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: {},
    storeInfo: '', // 店铺信息
    showScene: false, // 切换身份弹窗
    is_login: false,//是否登录
    mine_default: 'https://img.hzanchu.com/acimg/312110ea0061743445e66d828fe9268c.png?x-oss-process=image/resize,l_300',
    mine_user: '?x-oss-process=image/resize,m_lfit,h_150,w_150',
    is_open: 0,
    navList: [
      // { icon: 'https://img.hzanchu.com/acimg/a567a2dedfdcab6e321c5b30bc6e66f4.png', name: '联系客服', value: '', path: '', method: 'callStore' },
      // { icon: 'https://img.hzanchu.com/acimg/3bbdebc64d7b7f68381caca2309bc3e8.png', name: '服务协议', value: '', path: '', method: 'goService' },
      // { icon: 'https://img.hzanchu.com/acimg/847a57bee2246321320819c2006efb5f.png', name: '隐私政策', value: '', path: '', method: 'goPrivacy'},
      { icon: 'https://img.hzanchu.com/acimg/83c970316787014c682f76738015cd57.png', name: '切换身份', value: '我是商家', path: '', method: 'changeScene' },
      { icon: 'https://img.hzanchu.com/acimg/1b1c56bc3341fcd630b053ed9ce59b7c.png', name: '设置', value: '', path: '', method: 'goSet'},
      { icon: 'https://img.hzanchu.com/acimg/af38d3e995dc931f6c5b59f373147d36.png', name: '退出登录', value: '', path: '', method: 'logOut'}
    ],
    menubutton: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onShow() {
    this.getUserInfo();
    this.setData({
      menubutton: app.globalData.menuButton
    })
    if (wx.getStorageSync('userInfo')) {
      this.setData({
        is_login: true
      })
    } else {
      this.setData({
        is_login: false
      })
    }
  },
  //联系商家
  callStore() {
    wx.navigateTo({
      url: '/pages/seller/concat/concat',
    })
    // Dialog.confirm({
    //   message: '18158512049',
    //   width: 260,
    // })
    // .then(() => {
    //   wx.makePhoneCall({
    //     phoneNumber: '18158512049',
    //   })
    // })
    // .catch(() => {
    //   // on cancel
    // });
  },
  // 切换身份
  changeScene() {
    app.glo
    this.setData({
      showScene: true
    })
  },
  setScene(){
    app.globalFun.http.get('switch/role', {
      client_user_role: '0'
    }, (res) => {
      if (res.code === 0) {
        wx.showToast({
          title: '身份切换成功',
          icon: 'success',
          duration: 2000
        });
        wx.reLaunch({
          
          url: '/pages/buyer/index/index?store_id=' + this.data.userInfo.store_id,
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
      url: '/pages/seller/policy/privacy',
    })
  },
  // 服务协议
  goService() {
    wx.navigateTo({
      url: '/pages/seller/policy/service',
    })
  },
  // 去登录
  goTransfer() {
    wx.redirectTo({
      url: '/pages/common/login/index?url=/pages/seller/mine/index',
    })
  },
  goSet() {
    wx.navigateTo({
      url: '/pages/common/setting/setting?user_role=1',
    })
  },
  // 我的收藏
  goCollection(){
    wx.navigateTo({
      url: '/buyerInfo/buyer/collection/index',
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
              wx.clearStorage();
              wx.showToast({
                title: '退出成功',
              })
              this.goTransfer()
            }
          })
        }
      }
    })
  },
  // 获取用户信息
  getUserInfo() {
    app.globalFun.http.get('user/me', {}, (res) => {
      if (res.code === 0) {
        let arr = [
          // { icon: 'https://img.hzanchu.com/acimg/a567a2dedfdcab6e321c5b30bc6e66f4.png', name: '联系客服', value: '', path: '', method: 'callStore' },
          // { icon: 'https://img.hzanchu.com/acimg/3bbdebc64d7b7f68381caca2309bc3e8.png', name: '服务协议', value: '', path: '', method: 'goService' },
          // { icon: 'https://img.hzanchu.com/acimg/847a57bee2246321320819c2006efb5f.png', name: '隐私政策', value: '', path: '', method: 'goPrivacy' },
          { icon: 'https://img.hzanchu.com/acimg/1b1c56bc3341fcd630b053ed9ce59b7c.png', name: '设置', value: '', path: '', method: 'goSet'},
        ];
        if (res.data.user_role === 1) {
          arr = arr.concat([
            // {
            //   icon: 'https://img.hzanchu.com/acimg/dc58de00587124528d2aecde4b08c94e.png',
            //   name: '我收藏的店铺',
            //   value: '',
            //   path: '',
            //   method: 'goCollection'
            // },
            {
              icon: 'https://img.hzanchu.com/acimg/83c970316787014c682f76738015cd57.png',
              name: '切换身份',
              value: '我是商家',
              path: '',
              method: 'changeScene'
            },
            { 
              icon: 'https://img.hzanchu.com/acimg/af38d3e995dc931f6c5b59f373147d36.png', 
              name: '退出登录', 
              value: '', 
              path: '', 
              method: 'logOut'
            }
          ])
        }
        this.setData({
          userInfo: res.data,
          navList: arr
        })
      }
    })
  }
})
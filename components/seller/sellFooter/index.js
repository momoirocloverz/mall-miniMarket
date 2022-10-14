const app = getApp();
Component({
  properties: {
    active: {
      type: Number,
      default: 0
    }
  },
  data: {
    urlArr: [
      "/pages/seller/index/index",
      "/pages/seller/message/index",
      "/pages/seller/mine/index"
    ]
  },
  ready() {
    this.getUserInfo();
  },
  methods: {
    onChange(event) {
      wx.redirectTo({
        url: this.data.urlArr[event.detail || 0],
      })
    },
    getUserInfo() {
      app.globalFun.http.get('user/me', {}, (res) => {
        if (res.code === 0) {
          if (wx.getStorageSync('userInfo')) {
            if (res.data.client_user_role === 0) {
              this.setData({
                urlArr: [
                  "/pages/seller/index/indexShow",
                  "/pages/seller/message/index",
                  "/pages/seller/mine/index"
                ]
              })
            } else {
              this.setData({
                urlArr: [
                  "/pages/seller/index/index",
                  "/pages/seller/message/index",
                  "/pages/seller/mine/index"
                ]
              })
            }
          } else {
            this.setData({
              urlArr: [
                "/pages/seller/index/indexShow",
                "/pages/common/login/index?url=/pages/seller/message/index",
                "/pages/seller/mine/index",
              ]
            })
          }
        }
      })
    }
  }
})
const app = getApp();
Page({
  data: {
    phone_number: '',
    options: '',
    showAuthor: true,
    show: false
  },
  onShow: function () {
    // if (wx.getStorageSync('unionid') && wx.getStorageSync('openid')) {
    //   this.setData({
    //     showAuthor: false
    //   })
    // } else {
    //   this.setData({
    //     showAuthor: true
    //   })
    // }
    wx.getSetting({
      success: res => {
        console.log(res, 'res')
        if(res.authSetting["scope.userInfo"] && wx.getStorageSync('unionid') && wx.getStorageSync('openid')) {
          this.setData({
            showAuthor: false
          })
        } else {
          this.setData({
            showAuthor: true
          })
        }
      }
    })
  },
  onLoad: function (options) {
    this.setData({
      options: options
    })
  },
  getTel(e) {
    console.log(e, 'e')
    const that = this
    wx.login({
      success: res => {
        let code = res.code;
        // const source = wx.getStorageSync('source')
        const source = 'search'
        wx.getUserInfo({
          success: res2 => {
            console.log(res2, 'res2')
            app.globalFun.http.post('wx/login', {
              code: code,
              encryptedData: e.detail.encryptedData,
              iv: e.detail.iv,
              user_data: JSON.stringify(res2),
              source: source
            }, (r) => {
              if (r.code == 0) {
                console.log(r.data, 'userdatadatadata')
                let userInfo = r.data
                // 存储 token
                wx.setStorageSync('userInfo', JSON.stringify(userInfo));
                // 页面跳转逻辑
                if(that.data.options.url != undefined) {
                  let backUrl = decodeURIComponent(that.data.options.url)
                  if (backUrl === '/pages/seller/entryStore/index' || backUrl === '/pages/seller/index/index' || backUrl === '/pages/seller/message/index' || backUrl === '/pages/seller/mine/index') {
                    if (r.data.client_user_role === 1) {
                      wx.reLaunch({
                        url: '/pages/seller/index/index'
                      })
                    } else {
                      wx.reLaunch({
                        url: '/pages/seller/store/index'
                      })
                    }
                  } else {
                    wx.reLaunch({
                      url: backUrl
                    })
                  }
                } else {
                  wx.reLaunch({
                    url: '/pages/seller/entryStore/index?url=/pages/seller/mine/index'
                  })
                }
              }
            })
          },
          fail: error => {
            console.log(error,'error')
          }
        })
      },
    })
  },
  toService() {
    wx.navigateTo({
      url: '/pages/seller/policy/service'
    })
  },
  toPrivacy() {
    wx.navigateTo({
      url: '/pages/seller/policy/privacy'
    })
  },
})
const app = getApp();
Component({
  properties: {
    title: {
      type: String,
      value: ''
    },
    content: {
      type: String,
      value: ''
    },
    cancelBtnText: {
      type: String,
      value: '取消'
    },
    confirmBtnText: {
      type: String,
      value: '确定'
    },
    show: {
      type: Boolean,
      value: false
    }
  },
  methods: {
    getUserInfo() {
      wx.login({
        success: res => {
          let code = res.code;
          console.log(code, '信息授权code')
          wx.getUserInfo({
            success: res2 => {
              //发送请求 获取unionid
              app.globalFun.http.post('wx/authorization', {
                code: code,
                os: 'applet',
                user_data: JSON.stringify(res2)
              }, (r) => {
                if (r.code == 0) {
                  wx.setStorageSync('openid', r.data.open_id)
                  wx.setStorageSync('unionid', r.data.union_id)
                  wx.showToast({
                    title: '授权成功',
                    icon: 'success',
                  })
                  this.setData({
                    show: false
                  })
                } else {
                  wx.showToast({
                    title: r.msg,
                    icon: 'none'
                  })
                }
              })
            },
          })
        }
      })
    },
    cancel() {
      let pages = getCurrentPages();
      console.log(pages, 'pages')
      let prevPage = pages[0].__displayReporter.showReferpagepath.split('/')
      console.log(prevPage[1])
      this.setData({
        show: false
      })
      if(pages.length >= 2) {
        wx.navigateBack()
      } else {
        if(prevPage[1] === 'seller') {
          wx.redirectTo({
            url: '/pages/seller/index/indexShow',
          })
        } else {
          wx.navigateBack()
        }
      }
    }
  }
})
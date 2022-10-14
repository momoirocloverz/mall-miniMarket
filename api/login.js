const login = {
  author(url, type) {
    wx.login({
      success: res => {
        let code = res.code;
        wx.getUserInfo({
          success: res => {
            var app = getApp();
            app.globalData.userInfo = res.userInfo;
            //发送请求 获取unionid
            app.globalFun.http.post({
              api_name: '/wx/authorization',
              code: code,
              os: 'applet',
              user_data: JSON.stringify(res)
            }, (r) => {
              if (r.code == 0) {
                wx.setStorageSync('openid', r.data.openId)
                wx.setStorageSync('unionid', r.data.unionId)
                wx.showToast({
                  title: '授权成功',
                  icon: 'success',
                })
                wx.navigateTo({
                  url: '/pages/common/login/index?url=' + url + '&type=' + type
                })
              } else {
                wx.showToast({
                  title: r.msg || '',
                  icon: 'none'
                })
              }
            })
          },
          fail: res => {
            wx.showToast({
              title: res.errMsg,
              icon: 'none'
            })
          },
        })
      },
      fail: res => {
        wx.showToast({
          title: res.errMsg,
          icon: 'none'
        })
      },
      complete: res => {
        console.log(res, '授权2')
      }
    })
  }
}

export default login
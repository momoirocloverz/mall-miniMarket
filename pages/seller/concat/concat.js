// import { base64src } from '../../lib/js/base64src'
var app = getApp()

Page({
  data: {
    shareInfo: {},
    shareBaseInfo: {},
    options: '',
    cardInfo: {
      popBack: 'https://img.phbjx.com/test/4de0c9c5b1af4b185523d5155006d07a.png',
      wximg: 'https://img.hzanchu.com/acimg/711585644823142.jpeg',
      headImg: 'https://img.hzanchu.com/acimg/711585644823142.jpeg',
    },
    headImage: '',
    codeImage: '',
    backImage: '',
    qrCodedUrl: ''
  },
  onLoad: function (options) {
    this.setData({
      options: options
    })
    this.getShareInfo(options.storeId)
  },
  getShareInfo(id) {
    app.globalFun.http.post('store/contact', {}, (r) => {
      if (r.code == 0) {
        this.setData({
          qrCodedUrl: r.data
        })
        this.downLoad(r.data);
        return
      }
    })
  },
  // 图片下载
  downLoad(url) {
    let that = this
    wx.downloadFile({
      url: url, //二维码路径
      success: function (res) {
        // wx.hideLoading();
        if (res.statusCode === 200) {
          var codeSrc = res.tempFilePath;
          console.log(codeSrc, 'codeSrc')
          that.setData({ codeImage: codeSrc })
        } else {
          wx.showToast({
            title: '图片下载失败！',
            icon: 'none'
          })
        }
      }
    })
  },
  //点击保存到相册
  save() {
    var that = this;
    const tempFilePath = that.data.codeImage
    console.log(that.data.codeImage);
    wx.getSetting({
      success(res) {
        if (!res.authSetting['scope.writePhotosAlbum']) {
          wx.authorize({
            scope: 'scope.writePhotosAlbum',
            success() {
              that.save_phones(tempFilePath)
            },
            fail() {
              wx.showModal({
                title: '提示',
                content: '该功能需要打开相册权限是否前去打开',
                success (res) {
                  if (res.confirm) {
                    wx.openSetting({
                      success (res) {
                        console.log(res.authSetting)
                      }
                    })
                  } else if (res.cancel) {
                    console.log('用户点击取消')
                  }
                }
              })
            }
          })
        } else {
          that.save_phones(tempFilePath)
        }
      }
    })
    return
  },
  save_phones(tempFilePath) {
    wx.showLoading({
      title: '正在保存',
      mask: true,
    })
    wx.saveImageToPhotosAlbum({
      filePath: tempFilePath,
      success(res) {
        wx.showModal({
          content: '图片已保存到相册',
          showCancel: false,
          confirmText: '好的',
          confirmColor: '#333',
          success: function (res) {
            //
          },
        })
      },
      fail: function (res) {
        wx.showToast({
          title: res.errMsg,
          icon: 'none',
          duration: 2000
        })
      },
      complete(){
        wx.hideLoading()
      }
    })
  }
})
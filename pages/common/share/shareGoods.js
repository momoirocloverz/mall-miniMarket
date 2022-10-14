// import { base64src } from '../../lib/js/base64src'
import Card from '../../palette/card1'
var app = getApp()

Page({
  data: {
    shareInfo: {},
    shareBaseInfo: {},
    use2D: (/iaomi/g).test(wx.getSystemInfoSync().brand) ? true : false,
    options: '',
    cardInfo: {
      wximg: 'https://img.hzanchu.com/acimg/711585644823142.jpeg',
      headImg: 'https://img.hzanchu.com/acimg/711585644823142.jpeg',
      goodsImg: 'https://img.hzanchu.com/acimg/711585644823142.jpeg',
    },
    headImage: '',
    codeImage: '',
    goodsImage: '',
    image: '',
    widthPixels: wx.getSystemInfoSync().windowWidth,
    currentHeight: wx.getSystemInfoSync().windowHeight,
    authorizeSave: true
  },
  onLoad: function (options) {
    this.setData({
      options: options
    }, () => {
      this.getShareInfo()
      this.getShare()
    })
  },
  onShow: function () {
    let that = this;
    wx.getSetting({
      success: res => {
        that.setData({
          authorizeSave:(res.authSetting['scope.writePhotosAlbum'] === undefined || res.authSetting['scope.writePhotosAlbum'] === true) ? true : false
        });
      }
    })
  },
  getShareInfo() {
    app.wxApi.showLoading('生成中');
    const {
      options,
      currentHeight
    } = this.data;
    let data = {
      store_id: options.storeId,
      goods_id: options.goodsId
    };
    app.globalHttps.getShareCode(data).then(res => {
      console.log(res, 'res')
      if (res.code === 0) {
        let paintPallette = new Card().palette(res.data, currentHeight * 2);
        this.setData({
          paintPallette
        }, () => {
          app.wxApi.hideLoading();
        });
      }
    });
  },
  //获取分享信息
  getShare() {
    const {
      goodsId,
      storeId
    } = this.data.options;
    let data = {
      goods_id: goodsId,
      store_id: storeId
    };
    app.globalHttps.goodsShare(data).then(res => {
      if (res.code === 0) {
        console.log(res.data);
        this.setData({
          shareBaseInfo: res.data
        });
      }
    });
  },
  /**
   * 分享
   */
  onShareAppMessage: function () {
    const {
      title,
      path,
      imgurl
    } = this.data.shareBaseInfo;
    return {
      title,
      path,
      imageUrl: imgurl
    }
  },
  onImgOK(e) {
    if (e.detail.path) {
      this.setData({
        image: e.detail.path
      });
    } else {
      wxUtil.showLoading('生成中');
    }
  },
  //点击保存到相册
  save() {
    var that = this;
    wx.saveImageToPhotosAlbum({
      filePath: that.data.image,
      success: res => {
        if (res.errMsg == 'saveImageToPhotosAlbum:ok') {
          wxUtil.showToast('保存成功');
        }
      },
      fail: error => {
        that.setData({
          authorizeSave: false
        });
      }
    });
  }
})
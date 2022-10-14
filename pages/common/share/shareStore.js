// import { base64src } from '../../lib/js/base64src'
import Card from '../../palette/card';
import {
  wxUtil
} from '../../../utils/wxUtil';
var app = getApp()

Page({
  data: {
    shareInfo: {},
    shareBaseInfo: {},
    options: '',
    use2D:(/iaomi/g).test(wx.getSystemInfoSync().brand) ? true : false,
    cardInfo: {
      // popBack:'https://img.hzanchu.com/acimg/56cbc0a2500e27b9be0ed246dc6c3da2.png',
      popBack: 'https://img.hzanchu.com/acimg/6d31f79c07c3a67ea264cbf04d050ec3.png',
      storeImgBack: 'https://img.hzanchu.com/acimg/dae277c7cb7d1768facf5dde6e5f553e.png',
      qrcodeBack: 'https://img.hzanchu.com/acimg/795ce4e10fab9a1f01fc51b414b90d2a.png',
      wximg: 'https://img.hzanchu.com/acimg/711585644823142.jpeg',
      headImg: 'https://img.hzanchu.com/acimg/711585644823142.jpeg',
      textImg: "https://img.hzanchu.com/acimg/2b2af9ca660bd188a7bb56caae9c8aa2.png"
    },
    headImage: '',
    codeImage: '',
    backImage: '',
    shareImage: '',
    shareTextImage: '',
    authorizeSave: true,
    image: '',
    widthPixels: wx.getSystemInfoSync().windowWidth
  },
  onLoad: function (options) {
    this.setData({
      options: options
    })
    this.getShareInfo(options.storeId)
    this.getShare(options.storeId)
    let systemInfo = wx.getSystemInfoSync()
    console.log(systemInfo, 'systemInfo')
  },
  onShow: function () {
    let that = this;
    wx.getSetting({
      success: res => {
        that.setData({
          authorizeSave: res.authSetting['scope.writePhotosAlbum'] === undefined || res.authSetting['scope.writePhotosAlbum'] === true ? true : false
        });
      }
    })
  },
  onImgOK(e) {
    if(e.detail.path){
      wxUtil.hideLoading();
      this.setData({
        image: e.detail.path
      });
    }else{
      wxUtil.showLoading('生成中');
    }
  },
  getShareInfo(id) {
    wxUtil.showLoading('生成中');
    app.globalFun.http.get('share/qrcode', {
      store_id: id
    }, (r) => {
      if (r.code == 0) {
        console.log(r.data, 'r,data')
        this.setData({
          shareInfo: r.data
        });
        let height = wx.getSystemInfoSync().windowHeight * 2 - 180;
        let width = wx.getSystemInfoSync().windowWidth * 2
        let zoom = (wx.getSystemInfoSync().windowWidth / 414).toFixed(2)
        const {
          cardInfo,
          shareInfo
        } = this.data;
        let paintPallette = new Card().palette(
          cardInfo.popBack,
          cardInfo.storeImgBack,
          cardInfo.qrcodeBack,
          r.data.image,
          r.data.store,
          shareInfo.store.share_image_url,
          cardInfo.textImg,
          zoom,
          width,
          height
        );
        this.setData({
          paintPallette
        });
      }
    })
  },
  //获取分享信息
  getShare(id) {
    app.globalFun.http.get('share/home', {
      store_id: id
    }, (res) => {
      if (res.code === 0) {
        this.setData({
          shareBaseInfo: res.data
        })
      }
    })
  },
  // 分享
  onShareAppMessage(e) {
    return {
      title: this.data.shareBaseInfo.store_name,
      path: this.data.shareBaseInfo.path,
      imageUrl: this.data.shareBaseInfo.imgurl
    }
  },
  //点击保存到相册
  save() {
    var that = this;
    wx.saveImageToPhotosAlbum({
      filePath: that.data.image,
      success: res => {
        console.log(res);
        if(res.errMsg=='saveImageToPhotosAlbum:ok'){
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
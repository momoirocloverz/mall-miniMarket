import Dialog from '@vant/weapp/dist/dialog/dialog';

//获取应用实例
const app = getApp();

Page({
  data: {
    name: '',
    introduce: '',
    phone: '',
    imgUrl: '',
    imgId: ''
  },
  onShow() {
    this.getDetail();
  },
  getDetail() {
    app.globalFun.http.get('store/detail', {}, (res) => {
      if (res.code === 0) {
        this.setData({
          name: res.data.title,
          introduce: res.data.description,
          phone: res.data.store_mobile,
          imgUrl: res.data.store_image,
          imgId: res.data.image_id,
          mainImage: res.data.main_image_url,
          mainImageId: res.data.main_image,
          shareImage: res.data.share_image_url,
          ahareImageId: res.data.share_image,
        })
      }
    })
  },
  //联系商家
  callStore() {
    Dialog.confirm({
      message: '客服电话：18158512049',
      width: 260,
      confirmButtonText: '拨打电话'
    })
      .then(() => {
        wx.makePhoneCall({
          phoneNumber: '18158512049',
        })
      })
      .catch(() => {
        // on cancel
      });
  },
})

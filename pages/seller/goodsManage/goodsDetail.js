//获取应用实例
const app = getApp();

Page({
  /**
   * 页面的初始数据
   */
  data: {
    goodsInfo: {}, //商品信息
    shareInfo: {}, //分享信息
    options: {},
    storeId: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    this.setData({ options: options }, ()=>{
      this.getStoreId();
      this.getGoodsInfo();
    })
    
  },
  getGoodsInfo() {
    const options = this.data.options
    wx.showLoading({
      title: '拼命加载中...',
    })
    app.globalFun.http.post('goods/info', {
      goods_id: decodeURIComponent(options.id)
    }, (res) => {
      wx.hideLoading();
      if (res.code === 0) {
        let goodsInfo = {
          title: res.data.goods_name,
          price: res.data.price,
          num: res.data.store_count,
          express: res.data.freight,
          unit:res.data.unit,
          freight_comment: res.data.freight_comment,
          original_price: res.data.original_price,
          banner: {
            image: res.data.slide_image
          },
          images: res.data.info_image
        };
        this.setData({
          goodsInfo: goodsInfo
        })
      }
    })
  },
  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    this.getDetail();
  },
  // 获取store_id
  getStoreId() {
    app.globalFun.http.get('user/me', {}, (res) => {
      if (res.code === 0) {
        this.setData({ storeId: res.data.store_id })
        this.getShare(res.data.store_id)
      }
    })
  },
  //获取分享信息
  getShare(id) {
    const options = this.data.options
    app.globalFun.http.get('share/goods', {
      goods_id: decodeURIComponent(options.id),
      store_id: id
    }, (res) => {
      if (res.code === 0) {
        this.setData({
          shareInfo: res.data
        })
      }
    })
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    return {
      title: this.data.shareInfo.title,
      path: this.data.shareInfo.path,
      imageUrl: this.data.shareInfo.imgurl
    }
  },
  // 去分享
  toShare() {
    wx.navigateTo({
      url: '/pages/common/share/shareGoods?goodsId=' + this.data.options.id + '&storeId=' + this.data.storeId,
    })
  },
})
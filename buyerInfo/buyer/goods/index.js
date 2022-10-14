// pages/buyer/goodsDetail/index.js
import Dialog from '@vant/weapp/dist/dialog/dialog';
//获取应用实例
const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    options: {}, //url 参数
    goodsInfo: {}, //商品信息
    shareInfo: {}, //分享信息
    buyLoading: false,
    addLoading: false,
    goLoading: false,
    store_id: '',
    scene: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (options.scene) {
      const result = decodeURIComponent(options.scene);
      const id = result.split('&')[1].split('=')[1];
      const storeId = result.split('&')[2].split('=')[1];
      this.setData({
        options: {
          goods_id: id,
          store_id: storeId
        },
        scene: options.scene
      }, () => {
        this.commonLoad(storeId);
      })
    } else {
      this.commonLoad(options.store_id,options);
    }
  },
  commonLoad(storeId, options) {
    if (storeId) {
      wx.setStorageSync('store_id', storeId)
    }
    this.setData({
      options: options ? options : this.data.options,
      store_id: storeId || wx.getStorageSync('store_id')
    }, () => {
      this.getGoodsInfo();
    });
  },
  onShow() {
    const token = wx.getStorageSync('userInfo')
    if (token) {
      // 切换为买家身份
      this.setScene()
    }
  },
  // 获取商品详情
  getGoodsInfo() {
    let title = '拼命加载中...';
    app.wxApi.showLoading(title);
    let data = {
      goods_id: this.data.options.goods_id
    };
    app.globalHttps.getGoodsInfo(data).then(res => {
      app.wxApi.hideLoading();
      if (res.code === 0) {
        this.setData({
          goodsInfo: res.data
        });
        this.getShare();
        this.getShopViews();
      }
    });
  },
  getShopViews() {
    let data = {
      store_id: this.data.goodsInfo.store_id
    };
    app.globalHttps.getHistoryRecord(data).then(res => {});
  },
  // 加入购物车
  addCart() {
    this.setData({
      addLoading: true
    });
    const {
      store_id,
      options
    } = this.data;
    let data = {
      store_id,
      goods_id: options.goods_id,
      entrance: 'cart'
    };
    app.globalHttps.addShopCar(data).then(res => {
      this.setData({
        addLoading: false
      });
      if (res.code === 0) {
        this.getGoodsInfo();
        app.wxApi.showToast('加入成功', 'success');
      } else {
        app.wxApi.showToast(res.msg);
      }
    });
  },
  // 立即购买
  fastBuy() {
    this.setData({
      buyLoading: true
    });
    const {
      store_id,
      options
    } = this.data;
    let data = {
      store_id,
      goods_id: options.goods_id,
      entrance: 'fastbuy'
    };
    app.globalHttps.addShopCar(data).then(res => {
      if (res.code === 0) {
        let url = `/buyerInfo/buyer/order/confirm?&entrance=fastbuy&cart_id=${res.data.cart_id}`;
        app.wxApi.navigateTo(url);
      }
      this.setData({
        buyLoading: false
      })
    });
  },
  // 前往购物车
  goCart() {
    let url = `/pages/buyer/shopcart/index?store_id=${this.data.store_id}`;
    app.wxApi.switchTab(url);
  },
  //联系商家
  callStore() {
    Dialog.confirm({
        message: '商家电话：' + this.data.goodsInfo.mobile,
        width: 260,
        confirmButtonText: '拨打电话'
      })
      .then(() => {
        wx.makePhoneCall({
          phoneNumber: this.data.goodsInfo.mobile,
        })
      })
      .catch(() => {
        // on cancel
      });
  },
  //获取分享信息
  getShare() {
    const {
      store_id,
      options
    } = this.data;
    let data = {
      store_id,
      goods_id: options.goods_id
    };
    app.globalHttps.goodsShare(data).then(res => {
      if (res.code === 0) {
        this.setData({
          shareInfo: res.data
        });
      }
    });
  },
  setScene() {
    let data = {
      client_user_role: 0
    };
    app.globalHttps.checkScene(data).then(res => {
      if (res.code === 0) {
        this.setData({
          showScene: false
        });
      }
    });
  },
  // 去分享
  toShare() {
    const {
      options,
      store_id
    } = this.data;
    let url = `/pages/common/share/shareGoods?goodsId=${options.goods_id}&storeId=${store_id}`;
    app.wxApi.navigateTo(url);
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    const {
      title,
      path,
      imgurl
    } = this.data.shareInfo;
    return {
      title: title,
      path: path,
      imageUrl: imgurl
    }
  },
  onClickLeft() {
    if (this.data.options.source === 'share' || this.data.scene) {
      let url = '/pages/buyer/index/index';
      app.wxApi.switchTab(url);
    } else {
      app.wxApi.navigateBack(1);
    }
  }
})
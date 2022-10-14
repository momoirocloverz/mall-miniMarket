// pages/buyer/order/confirm.js
const app = getApp();
import urlApi from '../../../api/url.js';
import util from '../../../utils/util'

Page({

  /**
   * 页面的初始数据
   */
  data: {
    expressPrice: 0, // 运费
    user_note: '', // 留言
    goodsList:[],
    options: '',
    address_id: 0,
    addressInfo: {
      consignee: '',
      mobile: '',
      province_text: '',
      city_text: '',
      district_text: '',
      street_text: '',
      address: ''
    },
    loading: false,
    hasAddress:false,
    store_id: '',
    payPrice: 0,
    emptyText: '暂无收货地址，立即添加'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      options: options,
      store_id: wx.getStorageSync('store_id')
    })
    this.getOrderInfo(options);
  },
  // 获取地址信息
  getAddress(options) {
    app.globalFun.http.post('address/show', {
      id: options.address_id
    }, (r) => {
      if (r.code == 0) {
        this.setData({
          addressInfo: r.data,
          hasAddress: true
        })
      }
    })
  },
  // 获取订单信息
  getOrderInfo(options) {
    wx.showLoading({
      title: '拼命加载中...',
    })
    app.globalFun.http.post('order/confirm', {
      cart_ids: this.data.options.cart_id,
      entrance: this.data.options.entrance,
      store_id: this.data.store_id
    }, (r) => {
      wx.hideLoading()
      if (r.code === 0) {
        let addressInfo = {
          consignee: '',
          mobile: '',
          province_text: '',
          city_text: '',
          district_text: '',
          street_text: '',
          address: ''
        }
        this.setData({
          goodsList: r.data.cart.lists,
          orderInfo: r.data.cart,
          payPrice: Number(r.data.cart.amount)*100,
          expressPrice: r.data.cart.freight,
          addressInfo: this.data.options.address_id ? addressInfo : r.data.address,
          hasAddress: r.data.address || this.data.options.address_id ? true : false
        })
        if (options.address_id) {
          this.getAddress(options)
        }
      }
    })
  },
  // 提交订单
  onSubmit() {
    let _this = this
    if(!this.data.addressInfo) {
      wx.showToast({
        title: '请选择收货地址',
        icon: 'none'
      })
      return
    }
    this.setData({
      loading: true
    })
    // 购物车页面过来没有cartid,因为太长了，后端去处理
    app.globalFun.http.post('order/create', {
      address_id: this.data.addressInfo ? this.data.addressInfo.id : '',
      store_id: this.data.store_id,
      entrance: this.data.options.entrance,
      cart_id: this.data.options.cart_id,
      user_note: this.data.user_note
    }, (res) => {
      const orderSn = res.data.order_sn
      if(res.code === 0) {
        app.globalFun.http.post('wx/payment', {
          order_sn: res.data.order_sn,
          continue: 1
        }, (r) => {
          if (r.code === 0) {
            _this.setData({
              loading: false
            })
            wx.requestPayment({
              timeStamp: r.data.timestamp,
              nonceStr: r.data.nonceStr,
              package: r.data.package,
              signType: 'MD5',
              paySign: r.data.paySign,
              // 支付回调
              complete: (res_pay) => {
                wx.getSetting({
                  success(res_setting) {
                    if(!res_setting.authSetting['scope.withSubscriptions']) {
                      wx.requestSubscribeMessage({
                        tmplIds: [
                          util.messageListID.obligation,
                          util.messageListID.change_amount,
                          util.messageListID.deliver_goods
                        ],
                        complete (res_message) {
                          if(res_pay.errMsg == 'requestPayment:ok') { // 支付成功
                            wx.redirectTo({
                              url: '/buyerInfo/buyer/pay/success?order_sn=' + orderSn,
                            })
                          } else { // 支付失败或者未支付
                            wx.redirectTo({
                              url: '/buyerInfo/buyer/order/list?status=0&source=confirm',
                            })
                          }
                        }
                      })
                    }
                  }
                })
              }
            })
          } else {
            _this.setData({
              loading: false
            })
          }
        })
      } else {
        this.setData({
          loading: false
        })
      }
    })
  },
  //去往地址选择
  goAddress() {
    wx.redirectTo({
      url: '/buyerInfo/buyer/address/list?from_url=' + encodeURIComponent(urlApi.getUrlWithQuery()) + '&page_type=confirm'
    })
  },
  onChangeMessage(e) {
    this.setData({
      user_note: e.detail
    })
  },
  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },
})
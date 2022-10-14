// components/buyer/orderOperate/index.js
// import Dialog from '@vant/weapp/dist/dialog/dialog';

var app = getApp();
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    obj: {
      type: Object,
      value: {}
    },
    from: {
      type: String,
      value: 'list'
    },
    //列表下标
    index: {
      type: Number,
      value: ''
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    showNext: false,
    lowerGoods: {},
    tip_text: ''
  },

  /**
   * 组件的方法列表
   */
  methods: {
    //获取订单详情
    getInfo(cb) {
      app.globalFun.http.get('order/order_info', {
        order_id: this.data.from == 'list' ? this.data.obj.order_id : this.data.obj.base_info.order_id
      }, (r) => {
        if (r.code == 0) {
          let objs = this.data.obj;
          objs.order_status_name = r.data.base_info.order_status_name;
          objs.order_status = r.data.base_info.order_status;
          objs.buttons = r.data.buttons;
          this.triggerEvent('setInfo', { index: this.data.index, obj: objs })
          return typeof cb == 'function' && cb()
        }
      })
    },
    //取消订单
    cancelOrder(e) {
      wx.showModal({
        title: '提示',
        content: '真的要抛弃我吗？',
        success: (res) => {
          if (res.confirm) {
            app.globalFun.http.post('order/apply_ensure', {
              order_sn: this.data.obj.order_sn,
              type: '2',
              refund_price: this.data.obj.pay_price
            }, (r) => {
              if (r.code == 0) {
                wx.showToast({
                  title: '已申请退款',
                  icon: 'none'
                })
                this.triggerEvent('reload')
              } else {
                wx.showToast({
                  title: r.msg,
                  icon: 'none'
                })
              }
            })
          }
        }
      })
    },
    // 取消订单
    cancel() {
      console.log(11111)
      wx.showModal({
        title: '提示',
        content: '真的要抛弃我吗？',
        success: (res) => {
          if (res.confirm) {
            app.globalFun.http.post('order/cancel', {
              order_sn: this.data.obj.order_sn,
            }, (r) => {
              if (r.code == 0) {
                wx.showToast({
                  title: '订单已取消',
                  icon: 'none'
                })
                this.triggerEvent('reload')
              } else {
                wx.showToast({
                  title: r.msg,
                  icon: 'none'
                })
              }
            })
          }
        }
      })
    },
    //删除订单
    delOrder() {
      wx.showModal({
        title: '提示',
        content: '真的要抛弃我吗？',
        success: (res) => {
          if (res.confirm) {
            app.globalFun.http.post('order/delete', {
              order_sn: this.data.obj.order_sn
            }, (r) => {
              if (this.data.from == 'list') {
                wx.showToast({
                  title: '删除成功',
                  icon: 'none'
                })
                this.triggerEvent('reload')
              } else {
                wx.navigateBack({
                  delta: 1
                })
              }
            })
          }
        }
      })
    },
    //再来一单  continue
    againOrder(e) {
      app.globalFun.http.post('cart/add_by_order', {
        order_id: this.data.from == 'list' ? this.data.obj.order_id : this.data.obj.base_info.order_id,
        type: e.currentTarget.dataset.type
      }, (r) => {
        if (r.code == 0) {
          if (r.data.result == 'success') {
            wx.reLaunch({
              url: '/pages/shopcart/index'
            })
          } else if (r.data.result == 'all_invalid') {
            wx.showToast({
              title: '启禀陛下，这些商品全部卖光了，您还是挑点别的吧',
              icon: "none"
            })
          } else {
            let text = `以下${r.data.info.invalid_count == 1 ? '' : r.data.info.invalid_count + '个'}商品卖光了`;
            this.setData({
              showNext: true,
              lowerGoods: r.data.info.goods,
              tip_text: text
            })
          }
        } else {
          wx.showToast({
            title: r.msg,
            icon: 'none'
          })
        }
      })
    },
    //付款
    goPay(e) {
      let params = {};
      if (this.data.from == 'list') {
        params.order_id = this.data.obj.order_id;
        params.order_sn = this.data.obj.order_sn;
        params.url = '/buyerInfo/buyer/pay/success?order_sn=' + params.order_sn
        params.path = '/pages/order/detail?order_sn=' + params.order_sn;
        
      } else {
        params.order_id = this.data.obj.order_id;
        params.order_sn = this.data.obj.order_sn;
        params.url = '/buyerInfo/buyer/pay/success?order_sn=' + params.order_sn
        params.path = '/buyerInfo/buyer/pay/succes?order_sn=' + params.order_sn;
    
      }
      app.globalFun.http.post('wx/payment', {
        order_sn: params.order_sn,
        continue: 1
      }, (r) => {
        if (r.code == 0) {
          console.log(r)
          wx.requestPayment({
            timeStamp: r.data.timestamp,
            nonceStr: r.data.nonceStr,
            package: r.data.package,
            signType: 'MD5',
            paySign: r.data.paySign,
            success: (res) => {
              wx.redirectTo({
                url: params.url,
              })
            },
            fail: (res) =>{
              this.triggerEvent('reload')

              // wx.redirectTo({
              //   url: '/pages/buyer/order/list?status=0',
              // })
            }
          })
        } else {
          wx.showToast({
            title: r.msg,
            icon: "none"
          })
        }
      })
    },
    //提醒发货
    remindSend() {
      app.globalFun.http.post('order/remind', {
        order_sn: this.data.obj.order_sn
      }, (r) => {
        if(r.code === 0) {
          wx.showToast({
            title: '已收到您的提醒,会尽快安排发货,请您耐心等待一下！',
            icon: "none"
          })
        }
      })
    },
    //确认收货
    confirmOrder(e) {
      wx.showModal({
        title: '提示',
        content: '确认收到货了吗？',
        success: (res) => {
          if (res.confirm) {
            app.globalFun.http.post('order/receipt', {
              order_sn: this.data.obj.order_sn
            }, (r) => {
              if (r.code == 0) {
                this.triggerEvent('reload')
                wx.showToast({
                  title: '操作成功',
                })
              } else {
                wx.showToast({
                  title: r.msg,
                  icon: 'none'
                })
              }
            })
          }
        }
      })
    },

    //订单跟踪
    goPackage() {
      wx.navigateTo({
        url: '/pages/order/package?order_id=' + (this.data.from == 'list' ? this.data.obj.order_id : this.data.obj.base_info.order_id),
      })
    },
  }
})

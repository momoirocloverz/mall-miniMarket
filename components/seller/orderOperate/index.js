const app = getApp()
Component({
  properties: {
    orderInfo: {
      type: Object,
      value: ''
    }
  },
  data: {
    showDialog: '',
    reason: ''
  },
  methods: {
    agree() {
      let that = this
      wx.showModal({
        title: '提示',
        content: '确定同意买家退货吗？',
        success: (res) => {
          if (res.confirm) {
            app.globalFun.http.post('refund/pass', {
              order_id: that.properties.orderInfo.order_id,
              refund_money: that.properties.orderInfo.pay_price
            }, r => {
              if(r.code === 0) {
                this.triggerEvent('reload')
              }
            })
          } else if (res.cancel) {
            console.log('用户点击取消')
          }
        } 
      })
    },
    refuse(e) {
      this.setData({
        showDialog: true,
        dialogType: 'refuse'
      })
    },
    inReason(e) {
      this.setData({
        reason: e.detail.value.trim()
      })
    },
    quxiao() {
      this.setData({
        showDialog: false,
        reason: ''
      })
    },
    queding() {
      if(this.data.reason.trim() === '') {
        wx.showToast({
          title: '请填写原因',
          icon: 'none'
        })
        return
      }
      app.globalFun.http.post('refund/refuse', {
        order_id: this.properties.orderInfo.order_id,
        refuse_reason: this.data.reason
      }, r => {
        if(r.code === 0) {
          wx.showToast({
            title: '已拒绝',
            icon: 'none'
          })
          this.setData({
            showDialog: false
          })
          this.triggerEvent('reload')
        } else {
          wx.showToast({
            title: r.msg,
            icon: 'none'
          })
        }
      })
      
    },
  }
})
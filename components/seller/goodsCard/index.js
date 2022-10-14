// components/buyer/goodsCard/index.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    goods: {
      type: Object,
      value: {}
    },
    storeInfo: {
      type: Object,
      value: {}
    }
  },

  /**
   * 组件的初始数据
   */
  data: {

  },

  /**
   * 组件的方法列表
   */
  methods: {
    goDetail() {
      wx.navigateTo({
        url: '/pages/seller/goodsManage/goodsDetail?id=' + this.data.goods.goods_id + '&store_id=' + this.data.storeId,
      })
    }
  }
})

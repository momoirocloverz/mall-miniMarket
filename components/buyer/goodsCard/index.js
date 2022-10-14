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
    storeId: {
      type: Number,
      value: 0
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
    addCart(e) {
      const item = e.currentTarget.dataset.item
      this.triggerEvent('addCart', item)
    },
    goDetail() {
      if(this.data.goods.store_count) {
        wx.navigateTo({
          url: '/buyerInfo/buyer/goods/index?goods_id=' + this.data.goods.goods_id + '&store_id=' + this.data.storeId,
        })
      } else {
        wx.showToast({
          title: '补货中，看看其他商品吧',
          icon: 'none'
        })
      }
    }
  }
})

// components/buyer/goodsCard/index.js
var app = getApp();
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    collectionHide: {
      type: Boolean,
      value: true
    },
    isShowMore: {
      type: Boolean,
      value: false
    },
    storeInfo: {
      type: Object,
      value: {}
    },
    key: {
      type: Number,
      value: 0
    },
    from: {
      type: String,
      value: 'index'
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    // collectionHide: true
  },

  /**
   * 组件的方法列表
   */
  methods: {
    addCart(e) {
      const item = e.currentTarget.dataset.item
      this.triggerEvent('addCart', item)
    },
    handleMore() {
      this.triggerEvent("triggerCollectionHide", {index: this.data.key})
      this.setData({collectionHide: false})
    },
    handleUnCollection(e){
      app.globalFun.http.post('store/collect/delete', {
        store_id: this.data.storeInfo.id
      }, (r) => {
        if (r.code === 0) {
          wx.showToast({
            title: '操作成功',
            icon: 'none'
          })
          this.triggerEvent('reload', {index: this.data.key})
        } else {
          wx.showToast({
            title: '操作失败',
            icon: 'none'
          })
        }
      })
    },
    goStore(){
      if(this.data.isShowMore && !this.data.collectionHide){
        this.setData({collectionHide: true})
        return
      }
      let url=`/pages/buyer/index/index?store_id=${this.data.from === 'index' ? this.data.storeInfo.id : this.data.storeInfo.store_id}`;
      app.wxApi.reLaunch(url);
    }
  }
})

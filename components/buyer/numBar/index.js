// components/numBar/index.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    goodsNum:{
      type:Number,
      value:0
    },
    goodsPrice:{
      type: String,
      value:''
    },
    cartId:{
      type:Number,
      value:''
    },
    goodsItem:{
      type:Object,
      value:{}
    },
    goodsIndex:{
      type:Number,
      value:0
    },
    changeGoods:{
      type:Array,
      value:[]
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
    //增加
    addNum(e) {
      this.triggerEvent('addNum')
    },
    //减少
    reduceNum(e) {
      this.triggerEvent('reduceNum')
    },
    changeNum(e) {
      this.triggerEvent('changeNum', e.detail)
    },
    deleteGoods(e) {
      this.triggerEvent('deleteGoods', this.data.cartId)
    },
    blur(e) {
      this.triggerEvent('blur', e.detail)
    }
  }
})

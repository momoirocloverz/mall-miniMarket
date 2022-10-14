// components/wSwiper/index.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    list:{
      type:Array,
      value:[],
      observer: 'getLen'
    },
    height:{
      type:String,
      value:''
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    nowIndex:1,
    len:1
  },

  /**
   * 组件的方法列表
   */
  methods: {
    getLen(newVal) {
      if(newVal.length) {
        this.setData({
          len: newVal.length
        })
      }
    },
    changeItem(e){
      this.setData({
        nowIndex : e.detail.current + 1
      })
    }
  }
})

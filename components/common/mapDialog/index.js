Component({
  /**
   * 组件的属性列表
   */
  properties: {
    isAuthor: {
      type: Boolean,
      value: false
    }
  },
  /**
   * 组件的方法列表
   */
  methods: {
    cancelAddress:function(e){
      this.triggerEvent('cancelAuthor');
    },
    handleOpenSetting:function(e){
      this.triggerEvent('openSetting',e.detail);
    }
  }
})

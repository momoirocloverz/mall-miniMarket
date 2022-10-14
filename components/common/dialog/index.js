Component({
  properties: {
    title: {
      type: String,
      value: ''
    },
    cancleText: {
      type: String,
      value: '取消'
    },
    confirmText: {
      type: String,
      value: '确认'
    },
    show: {
      type: Boolean,
      value: false
    }
  },
  methods: {
    cancle() {
      this.triggerEvent('cancle')
    },
    confirm() {
      this.triggerEvent('confirm')
    }
  }
})
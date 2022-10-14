// components/common/navBar/index.js
const app = getApp();

Component({
  properties: {
    toggle: {
      type: String,
      value: 'all'
    },
    navHeight: {
      type: Number,
      value: 0
    },
    navTop: {
      type: Number,
      value: 0
    },
    opacity: {
      type: Number,
      value: 0
    },
    homeIcon: {
      type: String,
      value: ''
    },
    backIcon: {
      type: String,
      value: ''
    }
  },
  data: {
    headTop: '16',
    isX: false,
    canGoHome: 0
  },
  ready() {
    const data = wx.getMenuButtonBoundingClientRect();
    this.setData({
      headTop: Number(data.top) - 4,
      isX: app.globalData.isX,
    })
    // 获取页面栈信息
    let pages = getCurrentPages();
    console.log(pages, pages.length, 'pages')
    // let prevPage = pages[0].__displayReporter.showReferpagepath.split('/')
    let useIcon
    if(pages.length === 1) {
      useIcon = 1
    } else if(pages.length === 2 && pages[0].route === 'pages/seller/entryStore/index') {
      useIcon = 1
    } else {
      useIcon = 2
    }
    this.setData({
      canGoHome: useIcon
    })
  },
  methods: {
    goHome() {
      wx.redirectTo({
        url: '/pages/seller/entryStore/index',
      })
    },
    goBack() {
      wx.navigateBack()
    }
  }
})

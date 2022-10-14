Component({
  properties: {
    toggle: {
      type: String,
      value: 'all'
    }
  },
  data: {
    headTop: '16'
  },
  ready() {
    const data = wx.getMenuButtonBoundingClientRect();
    console.log(data)
    this.setData({
      headTop: Number(data.top) + 3
    })
  },
  methods: {
    onClickLeft() {
      const pages = getCurrentPages();
      const prepage = pages[pages.length - 2];
      const route = prepage.route;
      if (!route) {
        wx.redirectTo({
          url: '/pages/seller/index/index',
        })
      } else {
        wx.navigateBack()
      }
    },
    toAllGoods() {
      wx.redirectTo({
        url: '/pages/seller/goodsManage/allGoods',
      })
    },
    toGoodsType() {
      wx.redirectTo({
        url: '/pages/seller/goodsManage/allTypes',
      })
    }
  }
})
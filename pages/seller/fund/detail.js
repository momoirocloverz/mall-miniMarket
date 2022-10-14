//获取应用实例
const app = getApp();

Page({
  data: {
    detailList: [],
    account: ''
  },
  onLoad() {
    this.getDetail();
  },
  getDetail() {
    app.globalFun.http.post('cash/detail', {}, (res) => {
      if (res.code === 0) {
        this.setData({
          detailList: res.data.rows,
          account: res.data.account
        })
      }
    })
  }
})

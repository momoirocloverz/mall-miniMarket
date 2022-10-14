//获取应用实例
const app = getApp();

Page({
  data: {
    recordList: [],
    takeTotalAmount: 0,
    page: 1,
    isEnd: false
  },
  onLoad() {
    this.getDetail();
  },
  getDetail() {
    app.globalFun.http.post('cash/takeList', {
      page: this.data.page,
      page_size: 1000
    }, (res) => {
      if (res.code === 0) {
        let isEnd = this.data.page >= res.data.last_page ? true : false
        let arr = res.data.list
        arr.map(item => {
          if(item.status === 0) {
            item.status_name = '待审核'
          } else if(item.status === 1) {
            item.status_name = '提现成功'
          } else if(item.status === 2) {
            item.status_name = '提现失败'
          }
        })
        this.setData({
          recordList: arr,
          takeTotalAmount: res.data.takeTotalAmount,
          isEnd: isEnd
        })
      }
    })
  },
  onReachBottom: function () {
    if (!this.data.isEnd) {
      this.setData({
        page: this.data.page + 1,
      })
      this.getDetail();
    }
  }
})

//index.js
//获取应用实例
const app = getApp();

Page({
  data: {
    pageSize: 10,
    page: 1,
    isEnd: false,
    isEmpty: false,
    list: [],
    status: 1,
    collectionHides:[]
  },
  onLoad() {

  },
  onShow() {
    this.setData({
      list: [],
      page: 1,
    }, () => {
      this.getList();
    });
  },
  // 跳商品详情
  toDetail(event) {

  },
  // 获取详情
  getList() {
    const {
      pageSize,
      page,
      status
    } = this.data
    wx.showLoading({
      title: '加载中',
    })
    app.globalFun.http.post('store/collect/list', {}, (res) => {
      wx.hideLoading();
      if (res.code === 0) {
        if(res.data.length>0){
          this.setData({
            isEmpty: false,
            list: res.data.map(item => {
              let title = item.store_info.title.length > 9 ? item.store_info.title.substr(0,10)+"..." : item.store_info.title;
              let description = item.store_info.description.length > 14 ? item.store_info.description.substr(0,15)+"..." : item.store_info.description;
              let newStoreInfo = {...item.store_info,title,description};
              return {...item,store_info:newStoreInfo}
            }),
            collectionHides: new Array(res.data.length).fill(true),
            isEnd: true
          })
        }else{
          this.setData({
            isEmpty: true,
            list: [],
            isEnd: false
          })
        }
        // if (res.data.total === 0) {
        //   this.setData({
        //     isEmpty: true,
        //     list: [],
        //     isEnd: false
        //   })
        // } else if (page === 1 && res.data.total === res.data.data.length) {
        //   this.setData({
        //     list: res.data.data,
        //     isEnd: true,
        //     isEmpty: false,
        //   })
        // } else {
        //   if (this.data.list.length < res.data.total) {
        //     this.setData({
        //       list: this.data.list.concat(res.data.data),
        //       isEnd: false,
        //       isEmpty: false,
        //     })
        //   } else {
        //     this.setData({
        //       isEnd: true,
        //       isEmpty: false,
        //     })
        //   }
        // }
      } else {
        wx.showToast({
          title: res.msg,
          icon: 'none',
          duration: 2000
        })
      }
    })
  },
  // 上拉加载
  onReachBottom: function () {
    if (!this.data.isEnd && !this.data.isEmpty) {
      let page = this.data.page + 1;
      this.setData({
        page: page
      }, () => {
        this.getList();
      });
    } else {
      return false
    }
  },
  // 下拉刷新
  onPullDownRefresh: function () {
    this.setData({
      list: [],
      page: 1,
      isEnd: false,
      isEmpty: false
    }, () => {
      this.getList();
    });
    setTimeout(() => {
      wx.stopPullDownRefresh();
    }, 1000)
  },
  triggerHide(e){
    let tempList = this.data.collectionHides.map((item,index) => index === e.detail.index? false: true)
    this.setData({collectionHides: tempList})
  }
})

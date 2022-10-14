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
    showDeleteDialog: false,
    goodsId: '',
    headTop: '',
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
  // toDetail(event) {
  //   wx.navigateTo({
  //     url: '/pages/seller/goodsManage/goodsDetail?id=' + event.currentTarget.dataset.id,
  //   })
  // },
  // 获取详情
  getList() {
    const {
      page,
    } = this.data
    wx.showLoading({
      title: '加载中',
    })
    app.globalFun.http.post('store/good_store', {
      page,
    }, (res) => {
      wx.hideLoading();
      if (res.code === 0) {
        if (res.data.total === 0) {
          this.setData({
            isEmpty: true,
            list: [],
            isEnd: false
          })
        } else if (page === 1 && res.data.total === res.data.data.length) {
          this.setData({
            list: res.data.data.map(item => {
              return {
                ...item,
                title: item.title.length > 9 ? item.title.substr(0,10)+"..." : item.title,
                description: item.description.length > 14 ? item.description.substr(0,15)+"..." : item.description,
                image: item.store_image
              }
            }),
            isEnd: true,
            isEmpty: false,
          })
        } else {
          if (this.data.list.length < res.data.total) {
            // 将数据格式化为组件可用的结构
            const newStores = res.data.data.map(item => {
              return {
                store_id: item.id,
                store_info: {
                  ...item,
                  title: item.title.length > 9 ? item.title.substr(0,10)+"..." : item.title,
                  description: item.description.length > 14 ? item.description.substr(0,15)+"..." : item.description,
                  image: item.store_image
                }
              }
            })
            this.setData({
              list: this.data.list.concat(newStores),
              isEnd: false,
              isEmpty: false,
            })
          } else {
            this.setData({
              isEnd: true,
              isEmpty: false,
            })
          }
        }
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
  showDialog(event) {
    console.log(event)
    this.setData({
      showDeleteDialog: true,
      goodsId: event.currentTarget.dataset.id
    })
  },
  deleteGoods() {
    app.globalFun.http.post('goods/delete', {
      goods_id: this.data.goodsId
    }, (res) => {
      if (res.code === 0) {
        wx.showToast({
          title: '删除成功',
          icon: 'success',
          duration: 2000
        });
        this.setData({
          list: [],
          page: 1,
        }, () => {
          this.getList();
        });
      }
    })
  },
  triggerHide(e){
    let tempList = this.data.collectionHides.map((item,index) => index === e.detail.index? false: true)
    this.setData({collectionHides: tempList})
  }
})

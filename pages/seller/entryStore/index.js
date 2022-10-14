//index.js

const { default: userInfo } = require("../../../api/userInfo");

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
    freshState: false,
    collectionHides: [],
    keyword: ''
  },
  onShow() {
    this.setData({
      list: [],
      page: 1,
    }, () => {
      this.getList();
    });
  },
  // 设置搜索内容
  setSearchValue(e) {
    this.setData({
      keyword: e.detail.value
    })
  },
  search() {
    this.setData({
      list: [],
      page: 1,
    }, () => {
      this.getList();
    });
  },
  clearSearchValue() {
    this.setData({
      keyword: ''
    })
  },
  // 获取详情
  getList() {
    const {
      page,
      keyword
    } = this.data;
    app.wxApi.showLoading();
    let data = {
      page,
      keyword
    };
    app.globalHttps.storeList(data).then(res => {
      app.wxApi.hideLoading();
      let code = res.code;
      if (code === 0) {
        let data = res.data;
        if (data.stores.length > 0) {
          data.stores.map(item => {
            item.title = item.title.length > 9 ? `${item.title.substr(0,10)}...` : item.title;
            item.description = item.description.length > 14 ? `${item.description.substr(0,15)}...` : item.description;
          });
          let temp=this.data.list;
          this.setData({
            list: temp.concat(data.stores),
            isEmpty: false,
            isEnd: data.stores.length<10?true:false,
            collectionHides: new Array(res.data.length).fill(true),
            freshState: false
          });
        }else{
          this.setData({
            isEmpty: this.data.list>0?false:true,
            isEnd: false,
            freshState: false
          });
        }
      } else {
        app.wxApi.showToast(res.msg);
      }
    });
  },
  toEntry() {
    app.globalHttps.getUserMe().then(res=>{
      if(res.code===0) {
        let data = res.data;
        if(data.client_user_role===0) {
          if(data.store_status && data.store_status===1) {
            let url='/pages/seller/index/index';
            app.wxApi.redirectTo(url);
          } else {
            if(wx.getStorageSync('userInfo')) {
              let url='/pages/seller/store/index';
              app.wxApi.navigateTo(url);
            } else {
              let url='/pages/seller/index/indexShow';
              app.wxApi.navigateTo(url);
            }
          }
        } else {
          let url = '/pages/seller/index/index';
          app.wxApi.redirectTo(url);
        }
      } else {
        app.wxApi.showToast(res.msg);
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
    if (this.data.freshState) {
      return
    }
    this.setData({
      list: [],
      page: 1,
      isEnd: false,
      isEmpty: false,
      freshState: true
    }, () => {
      this.getList();
    });
    setTimeout(() => {
      wx.stopPullDownRefresh();
    }, 1000)
  },
  triggerHide(e) {
    let tempList = this.data.collectionHides.map((item, index) => index === e.detail.index ? false : true)
    this.setData({
      collectionHides: tempList
    })
  }
})
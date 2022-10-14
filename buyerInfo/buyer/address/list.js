// pages/buyer/address/list.js
import { getQueryValue } from '../../../utils/util.js'
var app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    isEmpty: false,
    isEdit: false,
    addressList: [],
    editStatus: false,//编辑icon显示
    isDelete: false,//删除按钮
    address_id: '',//地址id
    from_url: '',//来源页面url
    page_type: '',//来源页面
    editType: '',//编辑类型 add 和edit 
    openNew: true,
    openEdit: true,
    allSelected: false,  //是否全选
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let from_url = decodeURIComponent(options.from_url);
    let page_type = options.page_type;
    let url_data = getQueryValue(from_url)

    this.setData({
      address_id: url_data.address_id ? url_data.address_id : '',//地址id
      url_data: url_data, //路径参数
      from_url: from_url ? from_url : '',//来源页面url
      page_type: page_type ? page_type : 'mine',//页面类型
    })
    this.getAddressList()
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.getAddressList();
    this.setData({
      openNew: true,
      openEdit: true,
      allSelected: false
    })
  },
  //返回上一页
  toFromPage(e) {
    let item = e.currentTarget.dataset.item;
    console.log(this.data.from_url, 'form_url')
    //确认订单页面--confirm  商品详情--goods 我的页面--mine  
    if (this.data.page_type == 'confirm' || this.data.page_type == 'goods') {
      //替换address_id
      let path = this.data.from_url.split('?', 1)[0];
      //拼接url的参数
      let options = getQueryValue(this.data.from_url)
      let urlWithArgs = path + '?'
      options.address_id = item.id;
      for (var key in options) {
        var value = options[key]
        urlWithArgs += key + '=' + value + '&'
      }
      urlWithArgs = urlWithArgs.substring(0, urlWithArgs.length - 1)
      wx.redirectTo({
        url: urlWithArgs
      })
    }
  },
  //编辑地址
  editAddress(e) {
    let status = this.data.isEdit;
    //切换编辑-完成
    if (status) {
      this.setData({
        editStatus: false,
        isEdit: false,
        isDelete: false
      })
    } else {
      this.setData({
        editStatus: true,
        isEdit: true,
        isDelete: true
      })
    }
  },
  //获取收货地址列表
  getAddressList() {
    app.globalFun.http.post('address/lists', {}, (res) => {
      if (res.code == 0) {
        this.setData({
          addressList: res.data,
          isEmpty: res.data.length>0 ? false: true,
        })
      }
    })
  },
  //编辑地址
  toEdit(e) {
    let item = e.currentTarget.dataset.item;
    if (this.data.openNew) {
      wx.navigateTo({
        url: '/buyerInfo/buyer/address/detail?type=add&from_url=' + encodeURIComponent(this.data.from_url) + '&page_type=' + this.data.page_type + '&address_id=' + item.id,
      })
      this.setData({
        openNew: false
      })
    }
  },
  //新增地址
  toAdd(e) {
    let item = { ...this.data }
      wx.navigateTo({
        url: '/buyerInfo/buyer/address/detail?type=add&from_url=' + encodeURIComponent(item.from_url) + '&page_type=' + this.data.page_type + '&address_id=',
      })
  },
  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})
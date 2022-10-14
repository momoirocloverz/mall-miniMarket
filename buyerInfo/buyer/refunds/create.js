// pages/buyer/refunds/create.js
import { baseUrl } from '../../../api/http.js';
import Dialog from '@vant/weapp/dist/dialog/dialog';
//获取应用实例
const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    refund_price: '', // 退款金额
    reason: '', // 问题描述
    imgList: '',
    fileList: [],
    img_ids:'',
    order_sn: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      order_sn: options.order_sn
    })
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

  },
  submit() {
    Dialog.confirm({
      message: '是否确认提交售后？',
    })
    .then(() => {
      wx.showLoading({
        title: '提交中',
      })
      const {
        detailImg,
        reason,
        refund_price,
        fileList
      } = this.data;
      const fileIds = fileList.map(item => item.id);
      app.globalFun.http.post('order/apply_ensure', {
        order_sn: this.data.order_sn,
        refund_price: this.data.refund_price,
        reason: this.data.reason,
        image_id: fileIds.join(',')
      }, (res) => {
        wx.hideLoading();
        if (res.code === 0) {
          wx.navigateTo({
            url: '/buyerInfo/buyer/refunds/list',
          })
          wx.showLoading({
            title: '提交成功',
          })
        } else {
          wx.showToast({
            title: res.msg,
            icon: 'none'
          })
        }
      })
    })
    .catch(() => {
      // on cancel
    });
   
  },
  // 图片上传
  afterRead(event) {
    const { file } = event.detail;
    const type = event.currentTarget.dataset.type;
    const that = this
    wx.showLoading({
      title: '上传中',
    })
    wx.uploadFile({
      url: baseUrl + 'upload',
      filePath: file.path,
      header: { 'Content-Type': 'application/json', 'Authorization': JSON.parse(wx.getStorageSync('userInfo'))['token'], 'Accept': 'application/vnd.phbjx.v1.0.0+json' },
      name: 'file',
      success(res) {
        wx.hideLoading()
        if (res.statusCode === 200) {
          const arr = [...that.data.fileList];
          arr.push({
            ...file,
            url: JSON.parse(res.data).data.url,
            id: JSON.parse(res.data).data.id,
            isImage: true,
            deletable: true,
          });
          that.setData({
            fileList: arr
          });
        }
      },
      fail(error) {
        wx.hideLoading()
        console.log(error)
      }
    });
  },
  // 删除图片
  deletImg(event) {
    const index = event.detail.index;
    const type = event.currentTarget.dataset.type;
    this.data.fileList.splice(index, 1);
    this.setData({
      fileList: this.data.fileList
    })
  },
  getReason(e) {
    this.setData({
      reason: e.detail.value
    })
  },
  getPrice(e){
    this.setData({
      refund_price: e.detail
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
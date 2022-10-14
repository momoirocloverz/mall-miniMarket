// pages/buyer/policy/privacy.js
// import { html } from './privacyText.js'
//获取应用实例
const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    htmlSnip: '', // 隐私协议内容
    content: ``
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getInfo()
  },
  getInfo() {
    app.globalFun.http.post('index/clause', {}, (res) => {
      if (res.code === 0) {
        this.setData({
          htmlSnip: res.data.clause
        })
       
      }else{
        wx.showToast({
          title: res.msg,
          icon: 'none',
          duration: 2000
        })
      }
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
})
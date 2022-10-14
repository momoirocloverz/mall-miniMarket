// pages/common/cropImage/index.js
import { baseUrl } from '../../../api/http.js';
//获取应用实例
const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    tempImage: '',
    src: '',
    from_url: '',
    id: '',
    url:'',
    width: 250, // 裁剪区域宽
    height: 250,// 裁剪区域高
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options, 'options')
    let from_url = decodeURIComponent(options.from_url);
    let id = decodeURIComponent(options.id);
    let url = decodeURIComponent(options.url);
    let width = decodeURIComponent(options.width) / 2;
    let height = decodeURIComponent(options.height) / 2;
    console.log(options,'op')
    this.setData({
      from_url: from_url,
      id: id,
      url: url,
      width: width,
      height: height
    })
    this.cropper = this.selectComponent("#image-cropper");
    this.uploadStart();//上传图片
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.setData({
      tempImage: wx.getStorageSync('tempImage')
    })
  },

  //裁剪图片
  cropperload(e) {
    console.log('cropper加载完成');
  },
  loadimage(e) {
    wx.hideLoading();
    this.cropper.imgReset();
  },
  clickcut(e) {
    //图片预览
    wx.previewImage({
      current: e.detail.url, // 当前显示图片的http链接
      urls: [e.detail.url] // 需要预览的图片http链接列表
    })
  },
  // 开始载入
  uploadStart() {
    let that = this;
    that.setData({
      src: wx.getStorageSync('tempImage'),
    }, () => {
      that.cropper = that.selectComponent("#image-cropper");
      //重置图片角度、缩放、位置
      that.cropper.imgReset();
    })
  },
  // 提交
  submit() {
    this.cropper.getImg((obj) => {
      console.log(obj.url, 'url')
      this.setData({
        cropperVisible: false
      })
      wx.showLoading({
        title: '上传中',
        mask: true
      })
      const that = this

      wx.uploadFile({
        url: baseUrl + 'upload',
        filePath: obj.url,
        header: { 'Content-Type': 'application/json', 'Authorization': JSON.parse(wx.getStorageSync('userInfo'))['token'], 'Accept': 'application/vnd.phbjx.v1.0.0+json' },
        name: 'file',
        success(res) {
          wx.hideLoading();
          console.log(res)
          if (res.statusCode === 200) {
            console.log('成功',that.data.from_url)
            wx.redirectTo({
              url: that.data.from_url + '?imgId=' + JSON.parse(res.data).data.id + '&val=' + JSON.parse(res.data).data.url
            })
          }
        },
        fail(error) {
          console.log(error)
          wx.hideLoading();
          wx.showToast({
            title: error.errMsg || '',
            icon: 'none'
          })
        }
      });
    });
  },
  // 取消裁剪
  cancelCropper() {
    wx.redirectTo({
      url: this.data.from_url + '?imgId=' + this.data.id + '&val=' + this.data.url
    })
  },
  // 重新选择
  choose() {
    let that = this;
    wx.chooseImage({
      count: 1,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success(res) {
        const tempFilePaths = res.tempFilePaths[0];
        that.cropper = that.selectComponent("#image-cropper");
        //重置图片角度、缩放、位置
        that.cropper.imgReset();
        that.setData({
          src: tempFilePaths
        });
      }
    })
  },
  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

 
})
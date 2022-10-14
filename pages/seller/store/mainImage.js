// pages/seller/store/mainImage.js
import { baseUrl } from '../../../api/http.js';
//获取应用实例
const app = getApp();

Page({
  data: {
    headList: [],
    id: '',
    url: ''
  },
  onLoad: function (options) {
    const url = decodeURIComponent(options.val);
    const id = decodeURIComponent(options.imgId);
    this.setData({
      headList: [{
        id: id,
        url: url,
        isImage: true,
        deletable: true,
      }],
      id: id,
      url: url
    })
  },
  // 图片上传
  afterRead(event) {
    const { file } = event.detail;
    console.log(file,'file')
    wx.setStorageSync('tempImage', file.path)
    wx.redirectTo({
      url: '/pages/common/cropImage/index?width=345&height=120&from_url=/pages/seller/store/mainImage&id=' +this.data.id+'&url='+this.data.url,
    })
    return;
    // 暂时跳出
    const that = this
    wx.uploadFile({
      url: baseUrl + 'upload',
      filePath: file.path,
      header: { 'Content-Type': 'application/json', 'Authorization': JSON.parse(wx.getStorageSync('userInfo'))['token'], 'Accept': 'application/vnd.phbjx.v1.0.0+json' },
      name: 'file',
      success(res) {
        if (res.statusCode === 200) {
          const arr = [...that.data.headList];
          arr.push({
            ...file,
            url: JSON.parse(res.data).data.url,
            id: JSON.parse(res.data).data.id,
            isImage: true,
            deletable: true,
          })
          that.setData({
            headList: arr
          })
        }
      },
    });
  },
  // 删除图片
  deletImg(event) {
    this.setData({
      headList: []
    })
  },
  submit() {
    if (this.data.headList.length === 0) {
      wx.showToast({
        title: '请上传店铺主图',
        icon: 'none'
      })
      return false
    }
    app.globalFun.http.get('store/edit', {
      main_image: this.data.headList[0].id || ''
    }, (res) => {
      if (res.code === 0) {
        wx.showToast({
          title: '保存成功',
          icon: 'success',
          duration: 2000
        });
        wx.navigateBack()

      }
    })
  }
})

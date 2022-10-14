import { baseUrl } from '../../../api/http.js';
//获取应用实例
const app = getApp();

Page({
  data: {
    fileList: [],
  },
  onLoad: function(options) {
    this.getDetail(options.store_id)
  },
  getDetail(storeId) {
    app.globalFun.http.post('store/other_detail', {
      id: storeId
    }, (res) => {
      if (res.code === 0) {
        const r = res.data || {}
        this.setData({
          fileList: [{
            url: r.license_image_url,
            id: r.license_image_id,
            isImage: true,
            deletable: true,
          }]
        })
      }
    })
  },
})

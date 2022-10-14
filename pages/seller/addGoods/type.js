//获取应用实例
const app = getApp();

Page({
  data: {
    typeList: [],
    result: [],
    isShowDialog: false,
    typeName: '',
    goodsId: '',
    cateName:''
  },
  onLoad(options) {
    this.getTypeList();
    if (options.val !== '') {
      const checkedIds = decodeURIComponent(options.val);
      this.setData({
        result: checkedIds.split(',')
      })
    }
    if (options.goodsId) {
      this.setData({
        goodsId: decodeURIComponent(options.goodsId)
      })
    }
  },
  onChange(event) {
    this.setData({
      result: event.detail
    });
  },
  closeDialog() {
    this.setData({
      isShowDialog: false
    })
  },
  showDialog() {
    this.setData({
      isShowDialog: true
    })
  },
  getTypeName(event) {
    console.log(event, 'event')
    this.setData({
      typeName: event.detail.value
    })
  },
  // 获取列表
  getTypeList() {
    app.globalFun.http.post('category/list', {}, (res) => {
      if(res.code === 0) {
        this.setData({
          typeList: res.data
        })
      }
    })
  },
  // 确定添加
  confirm() {
    app.globalFun.http.post('category/add', {
      category_name: this.data.typeName
    }, (res) => {
      if (res.code === 0) {
        wx.showToast({
          title: '添加成功',
          icon: 'success',
          duration: 2000
        });
        this.closeDialog();
        this.getTypeList();
      }else{
        wx.showToast({
          title: res.msg,
          icon:'none'
        })
      }
      this.setData({ typeName: '', cateName: '' })
    })
  },
  // 保存
  save() {
    if (this.data.result.length === 0) {
      wx.showToast({
        title: '请选择类型',
        icon: 'none',
        duration: 2000
      })
    } else {
      const data = {};
      this.data.typeList.forEach(item => {
        data[item.id] = item.category_name
      })
      const arr = []
      this.data.result.forEach(item => {
        arr.push({
          id: item,
          name: data[item]
        })
      })
      wx.setStorageSync('goodsTypes', arr);
      wx.showToast({
        title: '保存成功',
        icon: 'success',
        duration: 2000
      });
      wx.navigateBack()
    }
  }
})

//index.js
//获取应用实例
const app = getApp();

Page({
  data: {
    typeList: [],
    isShowDialog: false,
    isShowDeleteDialog: false,
    deleteName: '',
    isEdit: false,
    typeValue: '',
    categoryId: '',
    isX: false,
    toggle: 'edit',
    headTop: '',
    menubutton: '',
    opacity: 1,
    backIcon: '../../../lib/image/back-icon.png',
    homeIcon: '../../../lib/image/home-icon.png'
  },
  onLoad() {
    const data = wx.getMenuButtonBoundingClientRect();
    this.setData({
      headTop: Number(data.top) + 52,
      isX: app.globalData.isX,
    })
    this.getList();
    this.setData({
      menubutton: app.globalData.menuButton
    })
  },
  // 分类弹窗
  closeDialog() {
    this.setData({
      isShowDialog: false,
    })
  },
  showDialog(event) {
    const data = {
      isShowDialog: true,
      categoryId: event.currentTarget.dataset.id,
      typeValue: ''
    }
    if (this.data.isEdit) {
      data.typeValue = event.currentTarget.dataset.name
    }
    this.setData(data)
  },
  getTypeValue(event) {
    this.setData({
      typeValue: event.detail.value
    })
  },
  addType() {
    if (this.data.typeValue === '') {
      wx.showToast({
        title: '请填写分类名称',
        icon: 'none'
      })
      return false
    }
    let url = this.data.isEdit ? 'category/edit' : 'category/add';
    const data = {
      category_name: this.data.typeValue
    };
    if (this.data.isEdit) {
      data.category_id = this.data.categoryId
    }
    app.globalFun.http.post(url, data, (res) => {
      if (res.code === 0) {
        wx.showToast({
          title: this.data.isEdit ? '编辑成功' : '添加成功',
          icon: 'success',
          duration: 2000
        });
        this.closeDialog();
        this.getList();
      }
      this.setData({ typeValue: '' })
    })
  },
  // 管理分类
  showDeleteDialog(event) {
    const nameData = event.currentTarget.dataset.name;
    const id = event.currentTarget.dataset.id;
    this.setData({
      isShowDeleteDialog: true,
      deleteName: nameData,
      categoryId: id
    })
  },
  closeDeleteDialog() {
    this.setData({
      isShowDeleteDialog: false,
      deleteName: '',
    })
  },
  changeEdit(event) {
    const editData = event.currentTarget.dataset.edit;
    if (editData === 'noEdit') {
      this.setData({
        isEdit: true
      })
    } else {
      this.setData({
        isEdit: false
      })
    }
  },
  deletType() {
    app.globalFun.http.post('category/delete', {
      category_id: this.data.categoryId
    }, (res) => {
      if (res.code === 0) {
        wx.showToast({
          title: '删除成功',
          icon: 'success',
          duration: 2000
        });
        this.getList();
      } else {
        console.log(res, 'res msg')
        wx.showToast({
          title: res.msg,
          icon: 'none',
          duration: 2000
        })
      }
    })
  },
  // 获取详情
  getList() {
    app.globalFun.http.post('goods/category', {}, (res) => {
      if (res.code === 0) {
        const arr = [];
        const data = res.data || [];
        data.forEach(item => {
          arr.push({
            name: item.category_name,
            number: item.count,
            id: item.id
          })
        });
        this.setData({
          typeList: arr
        })
      }
    })
  },
  // 下拉刷新
  onPullDownRefresh: function () {
    this.getList();
    setTimeout(() => {
      wx.stopPullDownRefresh();
    }, 1000)
  },
  // 跳转
  toGoodsList(event) {
    if (this.data.isEdit) {
      return false
    } else {
      wx.navigateTo({
        url: '/pages/seller/goodsManage/typeGoods?id=' + event.currentTarget.dataset.id + '&name=' + event.currentTarget.dataset.name,
      })
    }
  },
  toAllGoods() {
    wx.redirectTo({
      url: '/pages/seller/goodsManage/allGoods',
    })
  },
  toGoodsType() {
    wx.redirectTo({
      url: '/pages/seller/goodsManage/allTypes',
    })
  },
  goBack() {
    wx.redirectTo({
      url: '/pages/seller/index/index',
    })
  }
})

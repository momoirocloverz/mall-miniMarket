import http, { baseUrl } from '../../../api/http.js';
import util from '../../../utils/util';
//获取应用实例
const app = getApp();
const citys = {
  浙江: ['杭州', '宁波', '温州', '嘉兴', '湖州'],
  福建: ['福州', '厦门', '莆田', '三明', '泉州'],
};

Page({
  data: {
    isEdit: false,
    fileList: [],
    wordNumber: 0,
    title: '',
    typeName: '',
    typeIds: '',
    detailImg: [],
    formData: {
      price: '',
      unit: '',
      store: '',
      postage: '',
      sort: '',
      originalPrice: '',
      explain: ''
    },
    goodsId: '',
    showCategory: false,
    columns: [
      {
        values: Object.keys(citys),
        className: 'column1',
      },
      {
        values: citys['浙江'],
        className: 'column2',
        defaultIndex: 2,
      },
    ],
    goodsTypeList1: [],
    goodsTypeList2: [],
    column_first_index: '',
    fir_info: [],
    sec_info: [],
    value: [0,0],
    selectValue: '',
    options: ''
  },
  // unitChange(e) {
  //   this.setData({
  //     unit: this.data.unitList[e.detail.value]
  //   })
  // },
  onShow() {
    wx.setNavigationBarTitle({
      title: wx.getStorageSync('goodsPageTitle')
    })
    const goodsTypes = wx.getStorageSync('goodsTypes') || [];
    const mainImgArr = wx.getStorageSync('goodsMainImgs') || [];
    const imgArr = wx.getStorageSync('goodsDetailImgs') || [];
    const nameArr = goodsTypes.map(item => {
      return item.name
    });
    const idArr = goodsTypes.map(item => {
      return item.id
    });
    this.setData({
      typeName: nameArr.join('、'),
      typeIds: idArr.join(','),
      detailImg: imgArr,
      fileList: mainImgArr
    });
  },
  onLoad(options) {
    this.setData({
      options: options,
      goodsId: options.goodsId ? decodeURIComponent(options.goodsId) : ''
    })
    this.getGoodsType()
  },
  getGoodsType() {
    app.globalFun.http.post('goods/item/list', {}, r => {
      if(r.code === 0) {
        this.setData({
          goodsTypeList1: r.data,
          goodsTypeList2: r.data[0].children || [],
          fir_info: [r.data[0].id, r.data[0].name],
          column_first_index: 0
        })
        if(r.data[0].children.length) {
          this.setData({
            sec_info: [r.data[0].children[0].id, r.data[0].children[0].name]
          })
        } else {
          this.setData({
            sec_info: []
          })
        }
        let options = this.data.options
        if (options.url === '/pages/seller/goodsManage/allGoods' || options.url === '/pages/seller/goodsManage/typeGoods') {
          this.getGoodsInfo(options);
          this.setData({isEdit: true})
        } else {
          this.getRect();
          this.setData({isEdit: false})
        }
      }
    })
  },
  // 非编辑页进入
  getRect() {
    const goodsTypes = wx.getStorageSync('goodsTypes') || [];
    console.log(goodsTypes)
    const nameArr = goodsTypes.map(item => {
      return item.name
    });
    const idArr = goodsTypes.map(item => {
      return item.id
    });
    const mainImgArr = wx.getStorageSync('goodsMainImgs') || [];
    const imgArr = wx.getStorageSync('goodsDetailImgs') || [];
    const {
      title,
      fileList,
      wordNumber,
      price,
      store,
      postage
    } = wx.getStorageSync('goodData');
    this.setData({
      typeName: nameArr.join('、'),
      typeIds: idArr.join(','),
      detailImg: imgArr,
      title: title || '',
      fileList: mainImgArr || [],
      wordNumber: wordNumber || 0,
      ["formData.price"]: (price || price === 0) ? price : '',
      ["formData.store"]: (store || store === 0) ? store : '',
      ["formData.postage"]: (postage || postage === 0) ? postage : ''
    });
  },
  // 从商品编辑进入
  getGoodsInfo(option) {
    app.globalFun.http.post('goods/info', {
      goods_id: decodeURIComponent(option.goodsId)
    }, (res) => {
      if (res.code === 0) {
        const fileList = [];
        res.data.slide_image.forEach((item, index) => {
          fileList.push({
            url: item,
            id: res.data.slide_image_id.split(',')[index]
          })
        })
        const detailImg = [];
        res.data.info_image.forEach((item, index) => {
          detailImg.push({
            url: item,
            id: res.data.info_image_id.split(',')[index]
          })
        })
        const mainImages = [];
        res.data.slide_image.forEach((item, index) => {
          mainImages.push({
            url: item,
            id: res.data.slide_image_id.split(',')[index]
          })
        })
        const typeArr = [];
        if (res.data.category_id !== '') {
          res.data.category_id.split(',').forEach((item, index) => {
            typeArr.push({
              name: res.data.category_name.split(',')[index],
              id: item
            })
          })
        } 
        console.log(this.data.goodsTypeList1, 'goodstypelist111111')
        if(res.data.fir_item && this.data.goodsTypeList1.length) {
          this.data.goodsTypeList1.map((item, index) => {
            if(res.data.fir_item === item.name) {
              this.setData({
                goodsTypeList2: item.children,
                fir_info: [item.id, item.name],
                column_first_index: index
              })
              console.log(index, 'indexxxx')
              item.children.map((item2, index2) => {
                if(res.data.sec_item === item2.name) {
                  this.setData({
                    sec_info: [item2.id, item2.name],
                    selectValue: item.name + item2.name,
                    value: [index, index2]
                  })
                }
              })
            }
          })
        }
        console.log(this.data.selectValue, 'selectValue')
        
        this.setData({
          typeName: res.data.category_name,
          typeIds: res.data.category_id,
          detailImg: detailImg,
          title: res.data.goods_name,
          fileList: fileList,
          wordNumber: res.data.goods_name.length,
          ["formData.price"]: res.data.price,
          ["formData.store"]: res.data.store_count,
          ["formData.postage"]: res.data.freight,
          ["formData.unit"]: res.data.unit,
          ["formData.sort"]: res.data.sort,
          ["formData.explain"]: res.data.freight_comment,
          ["formData.originalPrice"]: Number(res.data.original_price) ? res.data.original_price : ''
        });
        const data = {
          title: res.data.goods_name,
          fileList: fileList,
          wordNumber: res.data.goods_name.length,
          price: res.data.price,
          store: res.data.store_count,
          postage: res.data.freight,
          sort: res.data.sort
        };
        wx.setStorageSync('goodData', data);
        wx.setStorageSync('goodsDetailImgs', detailImg);
        wx.setStorageSync('goodsMainImgs', mainImages);
        wx.setStorageSync('goodsTypes', typeArr);
      }
    })
  },
  // 记录标题长度
  recordWordNumber(event) {
    const number = event.detail.value.length;
    this.setData({
      wordNumber: number,
      title: event.detail.value
    })
  },
  changeForm(event) {
    const index = event.currentTarget.dataset.index;
    const arr = String(event.detail.value).split('.');
    if (index === '0') {
      let num = event.detail.value;
      if (num < 0 && num !== '') {
        num = 0
      } 
      if (num > 99999) {
        num = 99999
      }
      if (arr.length > 1) {
        const value = arr[0] + '.' + arr[1].slice(0, 2);
        num = value
      }
      this.setData({
        ["formData.price"]: num
      })
    } else if (index === '1') {
      let unit = event.detail.value;
      this.setData({
        ["formData.unit"]: unit
      })
    } else if (index === '2') {
      let store = event.detail.value;
      if (store < 0) {
        store = 0
      }
      this.setData({
        ["formData.store"]: store
      })
    } else if (index === '3') {
      let postage = event.detail.value;
      if (postage < 0) {
        postage = 0
      }
      if (postage > 99999) {
        postage = 99999
      }
      this.setData({
        ["formData.postage"]: postage
      })
    } else if(index === '4') {
      let sort = e.detail.value;
      if (sort < 0) {
        sort = 0
      }
      if (sort > 99999) {
        sort = 99999
      }
      this.setData({
        ["formData.sort"]: sort
      })
    } else if(index === '5') {
      this.setData({
        ["formData.originalPrice"]: event.detail.value
      })
    } else if(index === '6') {
      this.setData({
        ["formData.explain"]: event.detail.value
      })
    }
  },
  toType() {
    const data = {
      title: this.data.title,
      fileList: this.data.fileList,
      wordNumber: this.data.wordNumber,
      price: this.data.formData.price,
      store: this.data.formData.store,
      postage: this.data.formData.postage,
      sort: this.data.formData.sort,
      fir_item: this.data.fir_info.length ? this.data.fir_info[0] : 0,
      sec_item: this.data.sec_info.length ? this.data.sec_info[0] : 0
    };
    wx.setStorageSync('goodData', data);
    if (this.data.goodsId) {
      wx.navigateTo({
        url: '/pages/seller/addGoods/type?val=' + this.data.typeIds + '&goodsId=' + this.data.goodsId,
      })
    } else {
      wx.navigateTo({
        url: '/pages/seller/addGoods/type?val=' + this.data.typeIds,
      })
    }
  },
  toDetail() {
    const data = {
      title: this.data.title,
      fileList: this.data.fileList,
      wordNumber: this.data.wordNumber,
      price: this.data.formData.price,
      store: this.data.formData.store,
      postage: this.data.formData.postage,
      sort: this.data.formData.sort,
      fir_item: this.data.fir_info.length ? this.data.fir_info[0] : 0,
      sec_item: this.data.sec_info.length ? this.data.sec_info[0] : 0
    };
    wx.setStorageSync('goodData', data);
    if (this.data.goodsId) {
      wx.navigateTo({
        url: '/pages/seller/addGoods/detail?goodsId=' + this.data.goodsId,
      })
    } else {
      wx.navigateTo({
        url: '/pages/seller/addGoods/detail',
      })
    }
  },
  toGoodsImages(e){
    // if(!this.data.isEdit) return
    if(!e.target.dataset.item) return
    wx.navigateTo({
      url: '/pages/seller/addGoods/goodsImage/index',
    })
  },
  // 图片上传
  afterRead(event) {
    wx.showLoading({
      title: '上传中',
      mask: true
    })
    const { file } = event.detail;
    const type = event.currentTarget.dataset.type;
    const that = this
    for(let i=0; i<file.length; i++) {
      wx.uploadFile({
        url: baseUrl + 'upload',
        filePath: file[i].path,
        header: { 'Content-Type': 'application/json', 'Authorization': JSON.parse(wx.getStorageSync('userInfo'))['token'], 'Accept': 'application/vnd.phbjx.v1.0.0+json' },
        name: 'file',
        success(res) {
          wx.hideLoading();
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
          wx.hideLoading();
        }
      });
    }
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
  // 开启类目选择
  selectCategory(e) {
    this.setData({
      showCategory: true
    })
  },
  bindChange(e) {
    if(e.detail.value[0] !== this.data.column_first_index) {
      this.setData({
        value: [e.detail.value[0], 0]
      })
    }
    this.setData({
      fir_info: [this.data.goodsTypeList1[e.detail.value[0]].id, this.data.goodsTypeList1[e.detail.value[0]].name],
      goodsTypeList2: this.data.goodsTypeList1[e.detail.value[0]].children,
      column_first_index: e.detail.value[0]
    })
    if(this.data.goodsTypeList2.length) {
      this.setData({
        sec_info: [this.data.goodsTypeList2[e.detail.value[1]].id, this.data.goodsTypeList2[e.detail.value[1]].name]
      })
    } else {
      this.setData({
        sec_info: []
      })
    }
  },
  onConfirm() {
    let value = `${this.data.fir_info.length ? this.data.fir_info[1] : ''}${this.data.sec_info.length ? this.data.sec_info[1] : ''}`
    this.setData({
      showCategory: false,
      selectValue: value
    })
  },
  onCancel() {
    this.setData({
      showCategory: false,
      fir_info: [],
      sec_info: [],
    })
  },
  // 提交
  formSubmit(event) {
    const {
      price,
      unit,
      store,
      postage,
      sort,
      originalPrice,
      explain
    } = event.detail.value;
    console.log(event)
    const {
      fileList,
      detailImg,
      title,
      typeIds,
      // unit
    } = this.data;
    const fileIds = fileList.map(item => item.id);
    const detailImgIds = detailImg.map(item => item.id);
    const data = {
      goods_name: title,
      price: price,
      store_count: store,
      freight: postage,
      slide_image_id: fileIds.join(','),
      info_image_id: detailImgIds.join(','),
      category_id: typeIds,
      unit,
      sort: +sort,
      original_price: originalPrice || 0,
      freight_comment: explain,
      fir_item: this.data.fir_info.length ? this.data.fir_info[0] : 0,
      sec_item: this.data.sec_info.length ? this.data.sec_info[0] : 0
    };
    // 规格初始使用单位后考虑替换
    if(data.price <= 0) {
      wx.showToast({
        title: '价格必须为大于0的数字',
        icon: 'none',
        duration: 2000
      })
      return
    }
    if(!data.unit.trim()) {
      wx.showToast({
        title: '规格不可为空',
        icon: 'none',
        duration: 2000
      })
      return
    }
    if(data.freight_comment.trim().length > 100) {
      wx.showToast({
        title: '运费说明不得超过100个字',
        icon: 'none'
      })
      return
    }
    if(data.original_price === data.price) {
      wx.showToast({
        title: '原价不得与当前价格相同',
        icon: 'none'
      })
      return
    }
    let url = '';
    if (this.data.goodsId !== '') {
      url = 'goods/edit';
      data.goods_id = this.data.goodsId;
    } else {
      url = 'goods/add'
    }
    wx.getSetting({
      success(res) {
        if (!res.authSetting['scope.withSubscriptions']) {
          wx.requestSubscribeMessage({
            tmplIds: [
              util.messageListID.shipments,
              util.messageListID.apply_drawback
            ],
            complete (){
              wx.showLoading({
                title: '正在发布...',
              });
              app.globalFun.http.post(url, data, (r) => {
                if (r.code === 0) {
                  wx.removeStorageSync('goodsTypes');
                  wx.removeStorageSync('goodsDetailImgs');
                  wx.removeStorageSync('goodsMainImgs');
                  wx.removeStorageSync('goodData');
                  wx.showToast({
                    title: '发布成功',
                    icon: 'success',
                    duration: 2000
                  })
                  wx.navigateBack()
                }
              })
            }
          })
        } else {
          wx.showLoading({
            title: '正在发布...',
          });
          app.globalFun.http.post(url, data, (r) => {
            if (r.code === 0) {
              wx.removeStorageSync('goodsTypes');
              wx.removeStorageSync('goodsDetailImgs');
              wx.removeStorageSync('goodsMainImgs');
              wx.removeStorageSync('goodData');
              wx.showToast({
                title: '发布成功',
                icon: 'success',
                duration: 2000
              })
              wx.navigateBack()
            }
          })
        }
      }
    })
  }
})

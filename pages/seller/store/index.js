import {
  baseUrl
} from '../../../api/http.js';
import Dialog from '@vant/weapp/dist/dialog/dialog';

//获取应用实例
const app = getApp();

Page({
  data: {
    // 是否位置授权
    isAuthor: false,
    showAuthor: false,
    // 经度、纬度
    shopAddress: '',
    latitude: '',
    longitude: '',
    headList: [],
    positiveList: [],
    frontList: [],
    reverseList: [],
    handheldList: [],
    nameWordNumber: 0,
    introducWordNumber: 0,
    isShowDetail: true,
    formData: {
      detail_address: '',
      name: '',
      introduc: '',
      nickname: '',
      mobile: '',
      address: '',
      idCard: '',
      status: '',
      apply: '',
      auditRemark: '',
      corporate_name: '',
      social_credit_code: '',
      register_no: ''
    },
    isAble: true,
    //省市区选择数据
    maskVisual: 'hidden',
    animationData: {},
    current: 0,
    provinceName: '请选择',
    cityName: '',
    regionName: '',
    streetName: '',
    province: [],
    city: [],
    region: [],
    street: [],
    provinceId: '',
    cityId: '',
    regionId: '',
    streetId: '',
    provinceIndex: -1,
    cityIndex: -1,
    regionIndex: -1,
    streetIndex: -1,
    isShowDialog: false,
    timeSecend: 5,
    interval: '',
    src: '', // 裁剪图片链接
    cropperVisible: false
  },
  onShow() {},
  onLoad: function (options) {
    this.getAreaInfo('0');
    this.getDetail()
    // app.globalFun.http.post('demo', {
    //   value: '0'
    // })
  },
  // 记录文字长度
  recordNameWordNumber(event) {
    const number = event.detail.value.length;
    this.setData({
      nameWordNumber: number,
      ["formData.name"]: event.detail.value
    })
  },
  recordIntroducWordNumber(event) {
    const number = event.detail.value.length;
    this.setData({
      introducWordNumber: number,
      ["formData.introduc"]: event.detail.value
    })
  },
  // 获取详情
  getDetail() {
    app.globalFun.http.get('store/detail', {}, (res) => {
      if (res.code === 0) {
        const r = res.data || {}
        if (r.is_apply === 0) {
          this.setData({
            formData: {
              name: '',
              introduc: '',
              nickname: '',
              corporate_name: '',
              social_credit_code: '',
              register_no: '',
              mobile: '',
              address: '',
              idCard: '',
              status: '',
              apply: '',
              auditRemark: '',
              detail_address: ''
            },
            nameWordNumber: 0,
            introducWordNumber: 0,
            headList: [],
            provinceName: '请选择',
            cityName: '',
            regionName: '',
            streetName: '',
            provinceId: '',
            cityId: '',
            regionId: '',
            streetId: '',
            positiveList: [],
            reverseList: [],
            frontList: [],
            handheldList: [],
            isAble: true,
            shopAddress: '',
            latitude: 0,
            longitude: 0
          })
        } else {
          this.setData({
            ["formData.detail_address"]: r.detail_address,
            ["formData.name"]: r.title,
            nameWordNumber: r.title.length,
            ["formData.introduc"]: r.description,
            introducWordNumber: r.description.length,
            headList: [{
              url: r.store_image,
              id: r.image_id,
              isImage: true,
              deletable: true,
            }],
            ["formData.nickname"]: r.nickname,
            ["formData.mobile"]: r.mobile,
            ["formData.address"]: r.address,
            ["formData.corporate_name"]: r.corporate_name,
            ["formData.social_credit_code"]: r.social_credit_code,
            ["formData.register_no"]: r.register_no,
            ["formData.idCard"]: r.identity,
            ["formData.status"]: r.status,
            ["formData.apply"]: r.is_apply,
            ["formData.auditRemark"]: r.audit_remark,
            provinceName: r.province_name || '请选择',
            cityName: r.city_name || '',
            regionName: r.district_name || '',
            streetName: r.street_name || '',
            provinceId: r.province,
            cityId: r.city,
            regionId: r.district,
            streetId: r.street,
            positiveList: [{
              url: r.license_image_url,
              id: r.license_image_id,
              isImage: true,
              deletable: true,
            }],
            frontList: [{
              url: r.front_identity_image,
              id: r.front_identity_image_id,
              isImage: true,
              deletable: true,
            }],
            reverseList: [{
              url: r.back_identity_image,
              id: r.back_identity_image_id,
              isImage: true,
              deletable: true,
            }],
            shopAddress: r.address,
            latitude: Number(r.latitude),
            longitude: Number(r.longitude),
            isAble: r.status === 2 ? true : false
          })
        }
        this.setData({
          isShowDetail: r.is_hidden == 1 ? false : true
        })
      } else {
        wx.showToast({
          title: res.msg || '',
          icon: 'none',
          duration: 2000
        })
      }
    })
  },

  // 图片上传
  afterRead(event) {
    wx.showLoading({
      title: '上传中',
      mask: true
    })
    const {
      file
    } = event.detail;
    const type = event.currentTarget.dataset.type;
    const that = this

    wx.uploadFile({
      url: baseUrl + 'upload',
      filePath: file.path,
      header: {
        'Content-Type': 'application/json',
        'Authorization': JSON.parse(wx.getStorageSync('userInfo'))['token'],
        'Accept': 'application/vnd.phbjx.v1.0.0+json'
      },
      name: 'file',
      success(res) {
        wx.hideLoading();
        console.log(res)
        if (res.statusCode === 200) {
          if (type === 'head') {
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
          } else if (type === 'front') {
            const arr = [...that.data.frontList];
            arr.push({
              ...file,
              url: JSON.parse(res.data).data.url,
              id: JSON.parse(res.data).data.id,
              isImage: true,
              deletable: true,
            })
            that.setData({
              frontList: arr
            })
          } else if (type === 'reverse') {
            const arr = [...that.data.reverseList];
            arr.push({
              ...file,
              url: JSON.parse(res.data).data.url,
              id: JSON.parse(res.data).data.id,
              isImage: true,
              deletable: true,
            })
            that.setData({
              reverseList: arr
            })
          } else if (type === 'hand') {
            const arr = [...that.data.handheldList];
            arr.push({
              ...file,
              url: JSON.parse(res.data).data.url,
              id: JSON.parse(res.data).data.id,
              isImage: true,
              deletable: true,
            })
            that.setData({
              handheldList: arr
            })
          } else if (type === 'license') {
            const arr = [...that.data.positiveList];
            arr.push({
              ...file,
              url: JSON.parse(res.data).data.url,
              id: JSON.parse(res.data).data.id,
              isImage: true,
              deletable: true,
            })
            that.setData({
              positiveList: arr
            })
          }
        }
      },
      fail(error) {
        wx.hideLoading();
        wx.showToast({
          title: error.errMsg || '',
          icon: 'none'
        })
      }
    });
  },
  // 地图授权回调事件
  openSettingInfo(res) {
    let userLocation = res.detail.authSetting['scope.userLocation'];
    if (userLocation) {
      this.setData({
        isAuthor: false
      });
    }
  },
  // 取消授权
  cancelMapAuthor() {
    this.setData({
      isAuthor: false
    });
  },
  // 选择地址
  chooseAddress() {
    let that = this;
    wx.getSetting({
      success: res => {
        // 判断是否授权
        if (res.authSetting['scope.userLocation'] === false) {
          that.setData({
            isAuthor: true
          });
        } else {
          that.setData({
            isAuthor: false,
            showAuthor: true
          });
        }
      }
    });
    wx.authorize({
      scope: 'scope.userLocation',
      complete: res => {
        console.log(3);
        wx.chooseLocation({
          latitude: Number(that.data.latitude),
          longitude: Number(that.data.longitude),
          success(obj) {
            console.log(obj);
            if (obj.errMsg === 'chooseLocation:ok') {
              if (obj.name === '') {
                return wx.showToast({
                  title: '请选择地址再确定哦',
                  icon: 'none'
                });
              }
              that.setData({
                shopAddress: obj.address,
                latitude: obj.latitude,
                longitude: obj.longitude
              });
            }
          }
        })
      }
    });
  },
  // 删除图片
  deletImg(event) {
    const index = event.detail.index;
    const type = event.currentTarget.dataset.type;
    if (type === 'head') {
      this.setData({
        headList: []
      })
    } else if (type === 'license') {
      this.setData({
        positiveList: []
      })
    } else if (type === 'front') {
      this.setData({
        frontList: []
      })
    } else if (type === 'reverse') {
      this.setData({
        reverseList: []
      })
    } else if (type === 'hand') {
      this.setData({
        handheldList: []
      })
    }
  },
  // message提醒
  message(title) {
    let obj = {
      title
    };
    obj = arguments.length > 1 ? {
      ...obj,
      icon: arguments[1]
    } : obj;
    wx.showToast(obj);
  },
  // 提交
  formSubmit(event) {
    const {
      formData,
      headList,
      provinceId,
      cityId,
      regionId,
      streetId,
      frontList,
      reverseList,
      positiveList,
      handheldList,
      shopAddress,
      latitude,
      longitude
    } = this.data;
    const {
      name,
      phone,
      // address,
      corporate_name,
      social_credit_code,
      register_no,
      detail_address,
      idCard
    } = event.detail.value
    console.log(event, 'event')
    const data = {
      title: formData.name,
      description: formData.introduc,
      image_id: headList.length > 0 ? headList[0].id : '',
      nickname: name,
      mobile: phone,
      corporate_name: formData.corporate_name,
      province: provinceId,
      city: cityId,
      district: regionId,
      street: streetId,
      address: shopAddress,
      detail_address,
      latitude,
      longitude,
      identity: idCard,
      corporate_name,
      social_credit_code,
      register_no,
      front_identity_image_id: frontList.length > 0 ? frontList[0].id : '',
      back_identity_image_id: reverseList.length > 0 ? reverseList[0].id : '',
      license_image_id: positiveList.length > 0 ? positiveList[0].id : '',
      hand_image_id: handheldList.length > 0 ? handheldList[0].id : ''
    };
    let str = /^1[3,4,5,7,8,9]{1}[0-9]{9}$/;
    if (!str.test(data.mobile)) {
      let title = "输入的手机号格式不正确";
      return this.message(title, 'none');
    }
    if (!data.corporate_name.trim() || data.corporate_name.length < 3) {
      let title = "主体名称不得小于三个字符";
      return this.message(title, 'none');
    }
    if(!provinceId||!cityId||!regionId){
      let title="请选择所在区域";
      return this.message(title,'none');
    }
    if (!shopAddress) {
      let title = "请选择店铺地址";
      return this.message(title, 'none');
    }
    if (!data.social_credit_code.trim() || data.social_credit_code.length < 3) {
      let title = "社会信用代码不得小于三个字符";
      return this.message(title, 'none')
    }
    if(data.register_no.trim().length > 18) {
      let title = "请输入正确的工商注册号";
      return this.message(title, 'none')
    }
    if (!data.front_identity_image_id) {
      let title = '请上传身份证正面照片';
      return this.message(title, 'none')
    }
    if (!data.back_identity_image_id) {
      let title = '请上传身份证背面照片';
      return this.message(title, 'none');
    }
    if (!data.license_image_id) {
      let title = '请上传营业执照';
      return this.message(title, 'none');
    }
    wx.showLoading({
      title: '正在提交...',
    })
    app.globalFun.http.post('store/apply', data, (r) => {
      wx.hideLoading();
      const that = this;
      if (r.code === 0) {
        that.setData({
          isShowDialog: true
        })
        that.data.interval = setInterval(() => {
          if (that.data.timeSecend === 0) {
            clearInterval(that.data.interval);
            that.setData({
              isShowDialog: false
            })
            that.toEntrey();
          } else {
            that.setData({
              timeSecend: that.data.timeSecend - 1
            })
          }
        }, 1000)
      } else {
        wx.showToast({
          title: r.msg || '',
          icon: 'none',
          duration: 2000
        })
      }
    })
  },
  // 显示弹窗
  toEntrey() {
    this.setData({
      isShowDialog: false
    })
    clearInterval(this.data.interval);
    wx.redirectTo({
      url: '/pages/seller/entryStore/index'
    })
  },
  //打开浮窗
  cascadePopup: function () {
    if (this.data.isAble) {
      var animation = wx.createAnimation({
        duration: 300,
        timingFunction: 'ease-in-out',
      });
      this.animation = animation;
      animation.translateY(-285).step();
      this.setData({
        animationData: this.animation.export(),
        maskVisual: 'show'
      });
    } else {
      return false
    }
  },
  //关闭浮窗
  cascadeDismiss: function () {
    this.animation.translateY(285).step();
    this.setData({
      animationData: this.animation.export(),
      maskVisual: 'hidden'
    });
  },
  // 记录点击的标题所在的区级级别
  changeCurrent: function (e) {
    var current = e.currentTarget.dataset.current;
    this.setData({
      current: current
    });
  },
  currentChanged: function (e) {
    // swiper滚动使得current值被动变化，用于高亮标记
    var current = e.detail.current;
    // this.setData({
    //   current: current
    // });
  },
  //获取省
  provinceTapped: function (e) {
    // 标识当前点击省份，记录其名称与主键id都依赖它
    var index = e.currentTarget.dataset.index;
    // current为1，使得页面向左滑动一页至市级列表
    // provinceIndex是省数据的标识
    this.setData({
      provinceName: this.data.province[index].name,
      provinceId: this.data.province[index].id,
      provinceIndex: index,
      cityName: '',
      regionName: '',
      streetName: '',
      cityId: '',
      regionId: '',
      streetId: '',
      cityIndex: -1,
      regionIndex: -1,
      streetIndex: -1,
      region: [],
      street: []
    });
    this.getAreaInfo(this.data.province[index].id, '1');
  },
  //获取市
  cityTapped: function (e) {
    // 标识当前点击县级，记录其名称与主键id都依赖它
    var index = e.currentTarget.dataset.index;
    // cityIndex是市区数据的标识
    this.setData({
      cityName: this.data.city[index].name,
      cityId: this.data.city[index].id,
      cityIndex: index,
      regionIndex: -1,
      streetIndex: -1,
      regionName: '',
      streetName: '',
      regionId: '',
      streetId: '',
      street: []
    });
    this.getAreaInfo(this.data.city[index].id, '2');
  },
  //获取区
  regionTapped: function (e) {
    // 标识当前点击镇级，记录其名称与主键id都依赖它
    var index = e.currentTarget.dataset.index;
    // current为1，使得页面向左滑动一页至市级列表
    // regionIndex是县级数据的标识
    this.setData({
      regionName: this.data.region[index].name,
      regionId: this.data.region[index].id,
      regionIndex: index,
      streetIndex: 0,
      streetName: '',
      streetId: '',
    });
    this.getAreaInfo(this.data.region[index].id, '3');
  },
  //获取街道
  streetTapped: function (e) {
    var index = e.currentTarget.dataset.index;
    this.setData({
      streetName: index == 0 ? '' : this.data.street[index].name,
      streetId: index == 0 ? 0 : this.data.street[index].id,
      streetIndex: index
    });
    //没有镇一级了，关闭悬浮框，并显示地址
    this.cascadeDismiss();
  },
  // 省市区
  getAreaInfo(id, index) {
    app.globalFun.http.post('address/level', {
      pid: id || ''
    }, (r) => {
      if (r.code === 0) {
        if (index == '1') {
          //填充市数据
          this.setData({
            city: r.data,
          });
          // 确保生成了数组数据再移动swiper
          this.setData({
            current: 1
          });
        }
        if (index == '2') {
          //cityObjects是id数组
          this.setData({
            region: r.data,
          });
          this.setData({
            current: 2
          });
        }
        if (index == '3') {
          if (r.data.length) {
            r.data.unshift({
              id: '9999999',
              level: 4,
              name: '我不清楚，暂不选择'
            });
            this.setData({
              street: r.data,
            });
            this.setData({
              current: 3
            });
          } else {
            this.cascadeDismiss();
          }
        }
        if (id === '0') {
          this.setData({
            province: r.data
          })
        }
      }
    })
  },
  //裁剪图片
  cropperload(e) {
    console.log('cropper加载完成');
  },
  loadimage(e) {
    wx.hideLoading();
    console.log('图片');
    this.cropper.imgReset();
  },
  clickcut(e) {
    console.log(e.detail);
    //图片预览
    wx.previewImage({
      current: e.detail.url, // 当前显示图片的http链接
      urls: [e.detail.url] // 需要预览的图片http链接列表
    })
  },
  uploadStart(event) {
    let that = this;
    const {
      file
    } = event.detail;
    const tempFilePaths = file.path;
    that.setData({
      cropperVisible: true,
      src: tempFilePaths,
    }, () => {
      that.cropper = that.selectComponent("#image-cropper");
      //重置图片角度、缩放、位置
      that.cropper.imgReset();
    })
  },
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
        header: {
          'Content-Type': 'application/json',
          'Authorization': JSON.parse(wx.getStorageSync('userInfo'))['token'],
          'Accept': 'application/vnd.phbjx.v1.0.0+json'
        },
        name: 'file',
        success(res) {
          wx.hideLoading();
          console.log(res)
          if (res.statusCode === 200) {
            const arr = [...that.data.headList];
            arr.push({
              url: JSON.parse(res.data).data.url,
              id: JSON.parse(res.data).data.id,
              isImage: true,
              deletable: true,
            })
            console.log(arr, 'arr')
            that.setData({
              headList: arr
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
    this.setData({
      cropperVisible: false
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
  //联系商家
  callStore() {
    Dialog.confirm({
        message: '客服电话：18158512049',
        width: 260,
        confirmButtonText: '拨打电话'
      })
      .then(() => {
        wx.makePhoneCall({
          phoneNumber: '18158512049',
        })
      })
      .catch(() => {
        // on cancel
      });
  },
})
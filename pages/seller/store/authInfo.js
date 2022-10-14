//获取应用实例
const app = getApp();

Page({
  data: {
    // 是否位置授权
    isAuthor: false,
    showAuthor: false,
    store_id: 0,
    // 经度、纬度
    latitude: '',
    latitude: '',
    detailData: {},
    positiveList: [],
    frontList: [],
    reverseList: [],
    isShowDetail: false,
    hasIdCardFront: false,
    hasIdCardBack: false,
    hasIdCardLicense: false,
    oldLatitude: '',
    oldLatitude: '',
    detail_address:'',
    provinceName:'请选择',
    province: [],
    city: [],
    region: [],
    street: [],
    maskVisual: 'hidden',
    animationData: {}
  },
  onLoad() {
    this.getAreaInfo('0');
    this.getDetail();
  },
   //打开浮窗
   cascadePopup: function () {
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
  },
  //关闭浮窗
  cascadeDismiss: function () {
    this.animation.translateY(285).step();
    this.setData({
      animationData: this.animation.export(),
      maskVisual: 'hidden'
    });
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
        streetId: index == 0 ? '' : this.data.street[index].id,
        streetIndex: index
      });
      //没有镇一级了，关闭悬浮框，并显示地址
      this.cascadeDismiss();
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
      complete: (res) => {
        wx.chooseLocation({
          latitude: Number(that.data.latitude),
          longitude: Number(that.data.longitude),
          success(obj) {
            if (obj.errMsg === 'chooseLocation:ok') {
              if (obj.name === '') {
                return wx.showToast({
                  title: '请选择地址再确定哦',
                  icon: 'none'
                });
              }
              that.setData({
                'detailData.detailAddress': obj.address,
                latitude: obj.latitude,
                longitude: obj.longitude
              });
            }
          }
        })
      }
    });
  },
  // 保存地址
  saveAddress() {
    const {
      latitude,
      longitude,
      oldLatitude,
      oldLongitude,
      detail_address,
      store_id
    } = this.data;
    if (latitude == oldLatitude && longitude == oldLongitude&&detail_address==this.data.detailData.detail_address) {
      return wx.showToast({
        title: '您暂未修改店铺信息',
        icon: 'none'
      });
    }
    let data = {
      id: store_id,
      latitude,
      longitude,
      detail_address:this.data.detailData.detail_address,
      address: this.data.detailData.detailAddress
    };
    app.globalFun.http.post('store/auth', data, res => {
      let code = res.code;
      if (code === 0) {
        wx.showToast({
          title: '更新成功',
          icon: 'success'
        });
        this.setData({
          oldLatitude: latitude,
          oldLongitude: longitude,
          detail_address:this.data.detailData.detail_address
        });
        wx.navigateBack()
      } else {
        wx.showToast({
          title: res.msg,
          icon: 'none'
        })
      }
    })
  },
  changeDetailAddress(e){
    this.setData({
      'detailData.detail_address':e.detail.value
    });
  },
  getDetail() {
    app.globalFun.http.get('store/detail', {}, (res) => {
      if (res.code === 0) {
        const r = res.data || {}
        if (r.license_image_url) {
          this.setData({
            positiveList: [{
              url: r.license_image_url,
              id: r.license_image_id,
              isImage: true,
              deletable: true,
            }],
          })
        }
        if (r.front_identity_image) {
          this.setData({
            frontList: [{
              url: r.front_identity_image,
              id: r.front_identity_image_id,
              isImage: true,
              deletable: true,
            }],
          })
        }
        if (r.back_identity_image) {
          this.setData({
            reverseList: [{
              url: r.back_identity_image,
              id: r.back_identity_image_id,
              isImage: true,
              deletable: true,
            }],
          })
        }
        this.setData({
          latitude: Number(r.latitude),
          longitude: Number(r.longitude),
          oldLatitude: Number(r.latitude),
          oldLongitude: Number(r.longitude),
          store_id: r.store_id,
          detail_address:r.detail_address,
          detailData: {
            detail_address:r.detail_address,
            nickname: r.nickname,
            mobile: r.mobile,
            address: r.province_name + r.city_name + r.district_name + r.street_name,
            detailAddress: r.address,
            corporate_name: r.corporate_name,
            identity: r.identity,
            forntImg: r.front_identity_image,
            backImg: r.back_identity_image,
            licenseImg: r.license_image_url,
            handImg: r.hand_image
          },
          isShowDetail: r.is_hidden == 1 ? false : true
        })
      }
    })
  },
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
            r.data.unshift({ id: '9999999', level: 4, name: '我不清楚，暂不选择' });
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
})
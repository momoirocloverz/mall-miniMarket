// pages/buyer/address/detail.js
import { getQueryValue } from '../../../utils/util.js'
import Dialog from '@vant/weapp/dist/dialog/dialog';
var app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    data: '', //路由参数  新增 is_gift 表示是否为礼盒填写地址
    gift_nickname: '',//送礼人昵称
    detail: '', //详细地址
    userName: '',//名称
    userPhone: '',//电话
    setDefault: 0, //设置默认 0-未选中 1-选中
    page_type: '',//来源-页面
    editType: 'add',//操作类型
    address_id: '',//地址id

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
    streetIndex: -1
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getAreaInfo('0');
    let address_id = options.address_id;
    let from_url = decodeURIComponent(options.from_url);
    let page_type = options.page_type ? options.page_type : 'mine';
    this.setData({
      from_url: from_url,
      page_type: page_type
    })
    // 编辑 | 新增
    if (address_id) {
      this.setData({
        editType: 'edit',
        address_id: address_id
      })
      this.getInfo(address_id)
    }
  },

  //获取地址信息
  getInfo(address_id) {
    app.globalFun.http.post('address/show', {
      id: address_id
    }, (res) => {
      let r = res.data;
      if (res.code == 0) {
        this.setData({
          provinceName: r.province_text,
          cityName: r.city_text,
          regionName: r.district_text,
          streetName: r.street_text,
          provinceId: r.province,
          cityId: r.city,
          regionId: r.district,
          streetId: r.street,
          detail: r.address,
          setDefault: r.is_default,
          userName: r.consignee,
          userPhone: r.mobile,
        })
        this.getAreaInfo(this.data.provinceId, 1);
        this.getAreaInfo(this.data.cityId, 2);
        this.getAreaInfo(this.data.regionId, 3);
      }
    })
  },
  //保存
  submit() {
    let info = { ...this.data };
    if (info.userName == '') {
      wx.showToast({
        title: '收货人名称不能为空',
        icon: 'none'
      })
      return null;
    } else if (info.userPhone == '') {
      wx.showToast({
        title: '手机号不能为空',
        icon: 'none'
      })
      return null;
    } else if (info.detail.length < 5) {
      wx.showToast({
        title: '地址不得少于五个字',
        icon: 'none'
      })
      return null;
    }
    let data = {
      id: info.address_id,
      consignee: info.userName,
      mobile: info.userPhone.replace(/^\s*$/g, ""),
      address: info.detail, //详细收货地址
      is_default: info.setDefault,
      province: info.provinceId,
      city: info.cityId,
      district: info.regionId,
      street: info.streetId
    }

    app.globalFun.http.post(this.data.editType == 'add' ? 'address/create' : 'address/edit', data, (res) => {
      
      if (res.code == 0) {
        let address_id = this.data.editType == 'edit' ? this.data.address_id : res.data.id;
        //商品详情和订单跳转
        if (this.data.page_type == 'goods' || this.data.page_type == 'confirm') {
          //替换address_id
          let path = this.data.from_url.split('?', 1)[0];

          //拼接url的参数
          let options = getQueryValue(this.data.from_url)
          let urlWithArgs = path + '?'
          options.address_id = address_id;
          for (var key in options) {
            var value = options[key]
            urlWithArgs += key + '=' + value + '&'
          }
          urlWithArgs = urlWithArgs.substring(0, urlWithArgs.length - 1)
          wx.redirectTo({
            url: urlWithArgs
          })
        }
        //我的页面跳转
        if (this.data.page_type == 'mine') {
          wx.navigateBack()
        }
      } 
    })
  },
  // 删除
  delAddress() {
    Dialog.alert({
      showCancelButton: true,
      message: '确定要删除该地址吗？',
    }).then(() => {
      app.globalFun.http.post('address/delete', {
        id: this.data.address_id
      }, (res) => {
        if (res.code === 0) {
          wx.showToast({
            title: '删除成功'
          })
          wx.navigateBack()
        } else {
          wx.showToast({
            title: res.msg,
            icon: 'none'
          })
        }
      })
    }).catch(error => {
      console.log(error)
    });
    
  },
  // 取消
  cancelHandle() {
    wx.navigateBack({
      delta: 1
    })
  },
  //是否设置成默认收货地址
  setting(e) {
    if (this.data.setDefault == 1) {
      this.setData({
        setDefault: 0
      })
    } else {
      this.setData({
        setDefault: 1
      })
    }
  },
  getAreaInfo(id, index) {
    app.globalFun.http.post('address/level', {
      pid: id || ''
    }, (r) => {
      console.log(r);
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
  //获取收货人姓名
  getUseName(e) {
    this.setData({
      userName: e.detail.value
    })
  },
  //获取手机号
  getMobile(e) {
    this.setData({
      userPhone: e.detail.value
    })
  },
  //获取详细地址
  getAddressDetail(e) {
    this.setData({
      detail: e.detail.value
    })
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
  currentChanged: function (e) {
    // swiper滚动使得current值被动变化，用于高亮标记
    var current = e.detail.current;
    // this.setData({
    //   current: current
    // });
  },
  changeCurrent: function (e) {
    // 记录点击的标题所在的区级级别
    var current = e.currentTarget.dataset.current;
    this.setData({
      current: current
    });
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
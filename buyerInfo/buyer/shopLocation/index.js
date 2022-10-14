const app = getApp()
Page({
  data: {
    addmissage: '选的位置',
    // markers	 Array	标记点
    stitle:'故宫',
    latitude: "",
    longitude: "",
    scale: 14,
    markers: [],
    //controls控件 是左下角圆圈小图标,用户无论放大多少,点这里可以立刻回到当前定位(控件（更新一下,即将废弃，建议使用 cover-view 代替）)
    controls: [{
      id: 1,
      // iconPath: '../../images/img/controls.png',
      position: {
        left: 15,
        top: 260 - 50,
        width: 40,
        height: 40
      },
      clickable: true
    }],
    distanceArr: []

  },
  onLoad: function () {
    let that = this
    wx.getLocation({
      type: 'wgs84', // 默认为 wgs84 返回 gps 坐标，gcj02 返回可用于 wx.openLocation 的坐标
      success: function (res) {
        //赋值经纬度
        that.setData({
          latitude: res.latitude,
          longitude: res.longitude,
 
        })
      }
    })

  },
  getLocation: function () {
    var _this = this;
    wx.chooseLocation({
      success: function (res) {
        console.log(res, 'res')
        var name = res.name
        var address = res.address
        var latitude = res.latitude
        var longitude = res.longitude
        _this.setData({
          name: name,
          address: address,
          latitude: latitude,
          longitude: longitude
        })
      },
      complete(r){
        console.log(r)
        console.log(222)
      }
    })
  },
  onGuideTap: function (event) {
    var lat = Number(event.currentTarget.dataset.latitude);
    var lon = Number(event.currentTarget.dataset.longitude);
    var bankName = event.currentTarget.dataset.bankname;
    console.log(lat);
    console.log(lon);
    wx.openLocation({
      type: 'gcj02',
      latitude: lat,
      longitude: lon,
      name: bankName,
      scale: 14
    })
  },
})
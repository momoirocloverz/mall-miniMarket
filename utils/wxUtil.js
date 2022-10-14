export const wxUtil = {
  showLoading: title => {
    wx.showLoading({
      title: title ? title : '加载中'
    })
  },
  hideLoading: () => {
    wx.hideLoading();
  },
  showToast: (title,icon,duration) => {
    wx.showToast({
      title,
      duration: duration ? duration : 2000,
      icon: icon ? icon : 'none',
      mask: true
    })
  },
  // 移除缓存
  removeStoreage:(str)=>{
    wx.removeStorageSync(str);
  },
  // 跳转
  redirectTo:(url)=>{
    wx.redirectTo({url});
  },
  // reLaunch
  reLaunch:(url)=>{
    wx.reLaunch({url});
  },
  // navigator
  navigateTo:(url)=>{
    wx.navigateTo({url})
  },
  // switchTab
  switchTab:(url)=>{
    wx.switchTab({url})
  },
  // navigateBack
  navigateBack:(delta)=>{
    wx.navigateBack({delta})
  },
  setNavigationBarTitle:(title)=>{
    wx.setNavigationBarTitle({
      title
    })
  }
}
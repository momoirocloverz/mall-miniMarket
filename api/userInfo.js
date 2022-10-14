const userInfo = {
  getUserInfoParams(label) {
    if(wx.getStorageSync('userInfo')) {
      let userInfo = JSON.parse(wx.getStorageSync('userInfo'))
      switch(label) {
        case 'user_id':
          return userInfo.user_id
          
        case 'avatar':
          return userInfo.avatar

        case 'nick_name':
          return userInfo.nick_name
        
        case 'city_id':
          return userInfo.city_id

        case 'token':
          return userInfo.token

        case 'village_id':
          return userInfo.village_id

        case 'village_name':
          return userInfo.village_name
        
        case 'is_expert':
          return userInfo.is_expert

        default:
          return false
      }
    } else {
      return ''
    }
  }
}

export default userInfo;
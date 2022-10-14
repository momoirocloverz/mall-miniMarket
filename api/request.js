import {
  urls
} from './config';
import urlApi from './url.js';
import {
  wxUtil
} from '../utils/wxUtil';

function errorCommon(title,url){
    wxUtil.showToast(title);
    wxUtil.removeStoreage('userInfo');
    wxUtil.redirectTo(url);
}

export const request = (url, data, method) => {
  return new Promise((resolve, reject) => {
    wx.request({
      url: `${urls.baseUrl}${url}`,
      method: method ? method : 'post',
      header: urls.header(),
      data,
      success: res => {
        let code = res.data.code;
        if (res.statusCode !== 200) {
          let title = '网络异常，请稍后重试';
          wxUtil.showToast(title);
          return reject({
            code: -1,
            msg: ''
          });
        }
        if (code === 0) {
          resolve(res.data);
        } else if (code === 21001) {
          let title = '登录状态已过期，请重新登录';
          let url = `/pages/common/login/index?url=${encodeURIComponent(urlApi.getUrlWithQuery())}`;
          wx.clearStorage();
          errorCommon(title,url);
        }else if(code===11002){
          let title='您当前访问的店铺已失效，请联系商家，获取新的店铺链接';
          let url=`/pages/seller/entryStore/index`;
          errorCommon(title,url);
        }else{
          let title=res.data.msg;
          wxUtil.showToast(title);
          return reject({
            code:-1,
            msg: res.data.msg
          });
        }
      },
      fail:res=>{
        wxUtil.hideLoading();
        let title='网络异常，请稍后重试';
        wxUtil.showToast(title);
        return null;
      }
    })
  })
}
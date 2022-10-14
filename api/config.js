import { hexMD5 } from '../utils/md5.js';
import userInfo from './userInfo.js';
export const urls = {
  // 本家鲜小程序域名：
  baseUrl: 'https://apiweb.phbjx.com/api/',
  // baseUrl: 'https://pre-apiweb.phbjx.com/api/',
  // baseUrl: 'https://dev-apiweb.phbjx.com/api/',

  appSec: 'base64:3/BnNb5S84hpsrEKqFfC01997pEvKf/r/ojN0K8gF3Y=',
  version: 'application/vnd.phbjx.v1.0.0+json',
  getSign: (data) => {
    var str = '';
    for(let key in data){
      str+=`&${key}=${encodeURIComponent(data[key])}`
    }
    return hexMD5(`${str}${urls.appSec}`)
  },
  contentType:'application/json',
  header:()=>{
    return {
      'Content-Type':urls.contentType,
      'Authorization':userInfo.getUserInfoParams('token'),
      'Accept':urls.version
    }
  },
  commonBanner:'https://img.phbjx.com/test/3c87a361db09f2164c99b2052a2c38d3.png',
  // 商家列表
  storeListUrl:'store/lists',
  // 获取用户信息
  getUserMeUrl:'user/me',
  // 获取banner信息
  getBannerUrl:'index/banner',
  // 获取分类
  getCategoryUrl:'index/category',
  // 获取商家产品列表数据
  getStoreGoodsUrl:'index/list',
  // 获取历史记录
  getHistoryRecordUrl:'history/record',
  // 获取其他详情页
  getOtherDetailUrl:'store/other_detail',
  // 加入购物车
  addShopCarUrl:'cart/addcart',
  // 添加收藏
  addCollectUrl:'store/collect/add',
  // 取消收藏
  deleteCollectUrl:'store/collect/delete',
  // 切换身份
  checkSceneUrl:'switch/role',
  // 分享首页
  shareHomeUrl:'share/home',
  // 获取产品信息
  getGoodsInfoUrl:'goods/info',
  // 商品分享
  goodsShareUrl:'share/goods',
  // 获取分享二维码
  getShareCodeUrl:'share/qrcode',
  // 购物车列表
  shopCarListUrl:'cart/lists',
  // 改变商品数量
  updateCartNumberUrl:'cart/update_number',
  // 修改后台选择接口
  updateCartSelectUrl:'cart/select',
  // 改变数量check
  checkNumUrl:'cart/update_number',
  // 删除单个商品
  deleteOneGoodsUrl:'cart/delete'
}
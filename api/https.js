import {
  request
} from './request';
import {
  urls
} from './config';

export const https = {
  storeList: (data) => {
    return request(urls.storeListUrl, data);
  },
  getUserMe: () => {
    return request(urls.getUserMeUrl, {}, 'get');
  },
  getBanner: (data) => {
    return request(urls.getBannerUrl, data);
  },
  getCategory: (data) => {
    return request(urls.getCategoryUrl, data);
  },
  getStoreGoods: (data) => {
    return request(urls.getStoreGoodsUrl, data);
  },
  getHistoryRecord:(data)=>{
    return request(urls.getHistoryRecordUrl,data);
  },
  getOtherDetail:(data)=>{
    return request(urls.getOtherDetailUrl,data);
  },
  addShopCar:(data)=>{
    return request(urls.addShopCarUrl,data);
  },
  addCollect:(data)=>{
    return request(urls.addCollectUrl,data);
  },
  deleteCollect:(data)=>{
    return request(urls.deleteCollectUrl,data);
  },
  checkScene:(data)=>{
    return request(urls.checkSceneUrl,data,'get');
  },
  shareHome:(data)=>{
    return request(urls.shareHomeUrl,data,'get');
  },
  getGoodsInfo:(data)=>{
    return request(urls.getGoodsInfoUrl,data);
  },
  goodsShare:(data)=>{
    return request(urls.goodsShareUrl,data,'get');
  },
  getShareCode:(data)=>{
    return request(urls.getShareCodeUrl,data,'get');
  },
  shopCarList:(data)=>{
    return request(urls.shopCarListUrl,data);
  },
  updateCartNumber:(data)=>{
    return request(urls.updateCartNumberUrl,data);
  },
  updateCartSelect:(data)=>{
    return request(urls.updateCartSelectUrl,data);
  },
  checkNum:(data)=>{
    return request(urls.checkNumUrl,data);
  },
  deleteOneGoods:(data)=>{
    return request(urls.deleteOneGoodsUrl,data);
  }
}
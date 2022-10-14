//index.js
import userInfo from '../../../api/userInfo.js'
//获取应用实例
const app = getApp();
// 入口
const ENTRY_LIST = [{
  url: '/pages/seller/addGoods/add',
  img: 'https://img.hzanchu.com/acimg/159e835ddd8f8439ca578571461d68cd.png?x-oss-process=image/resize,l_300',
  name: '添加商品'
}, {
    url: '/pages/seller/goodsstoreTitleManage/allGoods',
  img: 'https://img.hzanchu.com/acimg/e03dd8cd1769f8722dd4697ac186702a.png?x-oss-process=image/resize,l_300',
  name: '商品管理'
}, {
  url: '/pages/seller/shipments/list',
  img: 'https://img.hzanchu.com/acimg/c430e78e31459a0905e6c9ed3b10f0c5.png?x-oss-process=image/resize,l_300',
  name: '发货管理'
}, {
  url: '/pages/seller/orderManage/list',
  img: 'https://img.hzanchu.com/acimg/91b46ae5e66367d4fb4bc4a0891e53af.png?x-oss-process=image/resize,l_300',
  name: '订单管理'
},
{
  url: '/pages/seller/home/index',
  img: 'https://img.hzanchu.com/acimg/95cec62b009a91fdaf33e9fcecf2fac5.png?x-oss-process=image/resize,l_300',
  name: '店铺预览'
},
{
  url: '/pages/seller/store/manager',
  img: 'https://img.hzanchu.com/acimg/0d1fe30d7cccce0d60e5983fa6485e30.png?x-oss-process=image/resize,l_300',
  name: '店铺管理'
},
{
  url: '/pages/seller/fund/index',
  img: 'https://img.hzanchu.com/acimg/cdc056d8d1caee48755ef3f100f00595.png?x-oss-process=image/resize,l_300',
  name: '资金管理'
}]

Page({
  data: {
    dataList: [{
      data: '0.00',
      name: '今日营业额'
    }, {
      data: '0',
      name: '今日付款单数'
    }, {
      data: '0',
      name: '今日待发货单数'
    }],
    entryList: ENTRY_LIST,
    headImg: 'https://img.hzanchu.com/acimg/312110ea0061743445e66d828fe9268c.png?x-oss-process=image/resize,l_300'
  },
  toDetailPage() {
    wx.navigateTo({
      url: '/pages/common/login/index?url=/pages/seller/index/index',
    })
  }
})

// pages/buyer/shopcart/index.js
var app = getApp();

Page({
  /**
   * 页面的初始数据
   */
  data: {
    bCompile: false, //false表示非编辑状态
    isEmpty: 2, // 购物车是否为空
    normal_money: 0, // 合计
    checkStatus: false,
    goodsList: [], // 商品列表
    store_id: 0,
    changeGoods: [], // 修改数量的商品数组
    selected_ids: [],
    selectDelCount: 0, //选中数量--完成状态下使用    
    selectCount: 0, //选中数量--编辑状态下使用
    totalInfo: 0,
    cartCount: 0,
    bWatchAll: false,
    startTime: '',
    endTime: ''
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    const store_id = wx.getStorageSync('store_id')
    this.setData({
      store_id: store_id,
      bCompile: false
    })
    this.getList(store_id)
  },
  // 编辑和完成切换状态
  editHandle() {
    const {
      bCompile,
      goodsList
    } = this.data;
    this.setData({
      bCompile: !bCompile,
    })
    if (!bCompile) {
      goodsList.forEach(item => {
        item.is_del = 0
      })
      this.setData({
        goodsList: goodsList,
        bWatchAll: false
      })
    } else {
      this.getList()
    }
  },
  getList() {
    app.wxApi.showLoading('加载中');
    let data = {
      store_id: this.data.store_id
    };
    app.globalHttps.shopCarList(data).then(res => {
      app.wxApi.hideLoading();
      if (res.code === 0) {
        let selectCount = 0;
        const data = res.data;
        data.lists.forEach(item => {
          if (item.is_selected) {
            selectCount = selectCount + 1;
          }
        });
        this.setData({
          goodsList: data.lists,
          isEmpty: data.count == 0 ? 1 : 0,
          totalInfo: data.amount,
          cartCount: data.count,
          checkStatus: false,
          selectCount: selectCount
        });
        if (data.count != 0) {
          this.watchAllMenu();
        }
      }
    })
  },
  //改变商品数量功能接口
  // changeNum(cartInfo, redo) {
  //   let data = {
  //     cart_info: cartInfo
  //   };
  //   app.globalHttps.updateCartNumber(data).then(res => {
  //     if (res.code == 0 && redo) {
  //       this.getList();
  //     } else {
  //       app.wxApi.showToast(res.msg);
  //     }
  //   });
  // },
  isShow(e) {
    let item = e.currentTarget.dataset;
    let goods_item = item.goodsitem; //商品
    let goods_index = item.goodsindex;
    //编辑状态
    if (!this.data.bCompile) {
      let str = 'goodsList[' + goods_index + '].is_selected'
      let param = {}
      if (goods_item.is_selected === 0) {
        param[str] = 1;
        param['selectCount'] = this.data.selectCount + 1
        goods_item.is_selected = 1
        this.setData(param)
      } else {
        param[str] = 0;
        param['selectCount'] = this.data.selectCount - 1
        goods_item.is_selected = 0
        this.setData(param)
      }
      //修改后台选择接口
      let data = {
        select: goods_item.is_selected,
        cart_ids: goods_item.cart_id
      };
      app.globalHttps.updateCartSelect(data).then(res => {
        if (res.code === 0) {
          this.getList();
        } else {
          goods.is_selected = goods.is_selected == 0 ? 1 : 0;
        }
      });
    } else {
      // 删除状态
      let str = 'goodsList[' + goods_index + '].is_del'
      let param = {}
      //切换商品选中状态
      if (goods_item.is_del == 0) {
        param[str] = 1;
        param['selectDelCount'] = this.data.selectDelCount + 1
        goods_item.is_del = 1
        this.setData(param)
      } else {
        param[str] = 0;
        param['selectDelCount'] = this.data.selectDelCount == 0 ? 0 : this.data.selectDelCount - 1
        goods_item.is_del = 0
        this.setData(param)
      }
      //修改selected_ids中的数据
      if (goods_item.is_del == 1) {
        this.data.selected_ids.push(goods_item.cart_id)
        let ids = this.data.selected_ids
        this.setData({
          selected_ids: ids
        })
      } else {
        let ids = this.data.selected_ids
        ids.forEach((i, j) => {
          if (ids[j] == goods_item.cart_id) {
            ids.splice(j, 1)
          }
        })
        this.setData({
          selected_ids: ids
        })
      }
    }
    this.watchAllMenu();
  },
  //全选
  checkAll(e) {
    app.wxApi.showLoading('请稍等...');
    this.setData({
      bWatchAll: !this.data.bWatchAll
    });
    const {
      bCompile,
      bWatchAll,
      goodsList,
      selected_ids
    } = this.data;
    //编辑状态下全选
    if (!bCompile) {
      // bWatchAll 为true则选中
      if (!bWatchAll) {
        goodsList.map(item => {
          item.is_selected = 0;
        })
        this.setData({
          totalInfo: '0.00',
          selectCount: 0,
          goodsList
        })
      } else {
        goodsList.map(item => {
          item.is_selected = 1;
        });
        this.setData({
          selectCount: this.data.cartCount,
          goodsList: goodsList
        })
      }
    } else {
      //删除状态-全选中
      if (bWatchAll) {
        goodsList.map(item => {
          item.is_del = 1;
          selected_ids.push(item.cart_id);
        })
        this.setData({
          goodsList,
          selected_ids,
          selectDelCount: this.data.cartCount
        })
      } else {
        goodsList.map(item => {
          item.is_del = 0
        });
        this.setData({
          selectDelCount: 0,
          goodsList: goodsList,
          selected_ids: []
        })
      }
    }
    app.wxApi.hideLoading();
    this.watchAllMenu()
  },
  //全选监听
  watchAllMenu() {
    const {
      goodsList,
      bCompile
    } = this.data;

    if (goodsList.length === 0) {
      this.setData({
        bWatchAll: false
      });
      return;
    }
    let isAll = true;
    if (!bCompile) {
      let normal_money = 0;
      goodsList.map(item => {
        if (item.is_selected == 0) {
          isAll = false;
        } else {
          normal_money += item.goods_info.price * item.goods_count;
        }
      });
      this.setData({
        totalInfo: normal_money.toFixed(2)
      });
    } else {
      goodsList.map(item => {
        if (item.is_del == 0) {
          isAll = false;
        }
      })
    }
    this.setData({
      bWatchAll: isAll
    });
  },
  //增加
  addNum(e) {
    let item = e.currentTarget.dataset,
        goods_item = item.goodsitem,
        goods_index = item.goodsindex;
    if (+goods_item.goods_count >= +goods_item.goods_info.store_count) {
      return app.wxApi.showToast('库存不够了哦～');
    }
    if (this.data.checkStatus) {
      return app.wxApi.showLoading('处理中');
    }
    let str = 'goodsList[' + goods_index + '].goods_count';
    this.setData({
      [str]: this.data.goodsList[goods_index].goods_count + 1
    })
    let newGoodsNum = {};
    newGoodsNum.cart_id = this.data.goodsList[goods_index].cart_id;
    newGoodsNum.number = this.data.goodsList[goods_index].goods_count;
    this.checkNum(newGoodsNum);
  },
  //减少
  reduceNum(e) {
    let item = e.currentTarget.dataset,
        goods_item = item.goodsitem,
        goods_index = item.goodsindex,
        that = this
    if (this.data.checkStatus) {
      return app.wxApi.showLoading('处理中');
    }
    if (+goods_item.goods_count > 1) {
      let str = 'goodsList[' + goods_index + '].goods_count'
      this.setData({
        [str]: this.data.goodsList[goods_index].goods_count - 1
      })
      let newGoodsNum = {};
      newGoodsNum.cart_id = this.data.goodsList[goods_index].cart_id;
      newGoodsNum.number = this.data.goodsList[goods_index].goods_count;
      this.checkNum(newGoodsNum);
    } else {
      wx.showModal({
        title: '',
        content: '您确定删除此商品吗？',
        success (res) {
          if (res.confirm) {
            that.executeDelete(goods_item.cart_id)
          }
        }
      })
    }
  },
  changeNum(e) {
    console.log(e , 'e')
    let item = e.currentTarget.dataset,
        goods_item = item.goodsitem,
        goods_index = item.goodsindex,
        value = e.detail.value,
        history_value = item.goodsitem.goods_count
    if(+value <= 0) {
      app.wxApi.showToast('商品加购数量不可为零')
      let str = 'goodsList[' + goods_index + '].goods_count'
      this.setData({
        [str]: history_value
      })
    } else if(+value > item.goodsitem.goods_info.store_count) {
      app.wxApi.showToast('超出商品库存数量')
      let str = 'goodsList[' + goods_index + '].goods_count'
      this.setData({
        [str]: history_value
      })
    } else {
      let str = 'goodsList[' + goods_index + '].goods_count'
      this.setData({
        [str]: value
      })
      let newGoodsNum = {};
      newGoodsNum.cart_id = this.data.goodsList[goods_index].cart_id;
      newGoodsNum.number = this.data.goodsList[goods_index].goods_count;
      this.checkNum(newGoodsNum);
    }
  },
  // 改变数量
  checkNum(obj) {
    let data = {
      cart_id: obj.cart_id,
      number: obj.number
    };
    app.globalHttps.checkNum(data).then(res => {
      console.log(res, 'res')
      if (res.code === 0) {
        this.getList();
      }
    });
  },
  touchStart(e) {
    this.setData({
      startTime: e.timeStamp
    })
  },
  touchEnd(e) {
    this.setData({
      endTime: e.timeStamp
    })
  },
  // 长按删除商品
  delete(e) {
    let that = this;
    let goods_item = e.currentTarget.dataset.goodsitem; //商品
    console.log(e, 'e')
    wx.showModal({
      content: '您确定要删除此商品吗？',
      success(res) {  
        if (res.confirm) {
          that.executeDelete(goods_item.cart_id)
        }
      }
    })
  },
  // 删除单个商品 
  deleteGoods(e) {
    let that = this;
    let goods_item = e.target.dataset.goodsitem; //商品
    console.log(e, 'e')
    wx.showModal({
      content: '您确定要删除此商品吗？',
      success(res) {  
        if (res.confirm) {
          that.executeDelete(goods_item.cart_id)
        }
      }
    })
  },
  // 执行删除
  executeDelete(cart_id) {
    let data = {
      cart_ids: cart_id
    };
    app.globalHttps.deleteOneGoods(data).then(res => {
      if (res.code === 0) {
        this.getList();
        app.wxApi.showToast('删除成功');
      } else {
        this.setData({
          bWatchAll: !that.data.bWatchAll
        });
      }
    });
  },
  //批量删除(否则就直接去结算)
  deleteAllorGoPay() {
    let that = this;
    //删除状态
    if (this.data.bCompile) {
      //全选时，清空购物车
      if (!that.data.selected_ids.length) {
        return app.wxApi.showToast('亲，请选择商品');
      }
      wx.showModal({
        content: '真的要抛弃我吗？',
        success(res) {
          if (res.confirm) {
            that.setData({
              goodsList: [],
            })
            that.delGoods();
          }
        }
      })
    }
    //结算状态
    else {
      if (this.data.selectCount === 0) {
        return app.wxApi.showToast('亲，请选择商品');
      }
      let url='/buyerInfo/buyer/order/confirm?entrance=cart&cart_id=0';
      app.wxApi.navigateTo(url);
    }
  },
  //删除商品
  delGoods() {
    let data={
      cart_ids:this.data.selected_ids.join(',')
    };
    app.globalHttps.deleteOneGoods(data).then(res=>{
      if(res.code===0){
        this.getList();
      }
    });
  },
  toIndex() {
    let url='/pages/buyer/index/index';
    app.wxApi.switchTab(url);
  },
  // 删除商品
  // delete(e) {
  //   console.log(e, 'e')
  //   let index = e.currentTarget.dataset.index
  //   wx.showModal({
  //     title: '提示',
  //     content: '是否删除此消息？',
  //     success (res) {
  //       if (res.confirm) {
  //         app.globalFun.http.post({
  //           api_name: 'delete_message_info',
  //           message_id: e.currentTarget.dataset.item.message_id
  //         }, r => {
  //           if(r.code === 0) {
  //             let arr = that.data.messageList
  //             arr.splice(index, 1)
  //             that.setData({
  //               messageList: arr
  //             })
  //             if(!that.data.messageList.length) {
  //               that.setData({
  //                 isEmpty: true,
  //                 isEnd: false
  //               })
  //             }
  //           }
  //         })
  //       }
  //     }
  //   })
  // },
  // 前往商品详情
  toGoodsDetail(e) {
    if(this.data.endTime - this.data.startTime < 350) {
      let url=`/buyerInfo/buyer/goods/index?goods_id=${e.currentTarget.dataset.goodsitem.goods_id}`;
      app.wxApi.navigateTo(url);
    }
  },
  // blur(e) {
  //   let item = e.currentTarget.dataset,
  //       goods_index = item.goodsindex,
  //       history_value = item.goodsitem.goods_count
  //   let str = 'goodsList[' + goods_index + '].goods_count'
  //   this.setData({
  //     [str]: history_value
  //   })
  // }
})
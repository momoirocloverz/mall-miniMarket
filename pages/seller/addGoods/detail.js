import { baseUrl } from '../../../api/http.js';
//获取应用实例
const app = getApp();

Page({
  data: {
    fileList: [],
    goodsId: '',
    isChoose: false
  },
  onLoad(options) {
    const goodsImg = wx.getStorageSync('goodsDetailImgs') || [];
    this.setData({
      fileList: goodsImg
    })
    if (options.goodsId) {
      this.setData({
        goodsId: decodeURIComponent(options.goodsId)
      })
    }
  },
  addImage() {
    let that = this;
    if (this.data.isChoose) {
      return false;
    }else{
      this.setData({
        isChoose: true
      })
    }
    console.log(1123)
    wx.chooseImage({
      count: 9,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success(res) {
        const tempFilePaths = res.tempFilePaths;
       console.log(res,'res')
        for (let i = 0; i < tempFilePaths.length; i++) {
          wx.uploadFile({
            url: baseUrl + 'upload',
            filePath: tempFilePaths[i],
            header: { 'Content-Type': 'application/json', 'Authorization': JSON.parse(wx.getStorageSync('userInfo'))['token'], 'Accept': 'application/vnd.phbjx.v1.0.0+json' },
            name: 'file',
            success(res) {
              wx.hideLoading()
              if (res.statusCode === 200) {
                const arr = [...that.data.fileList];
                arr.push({
                  url: JSON.parse(res.data).data.url,
                  id: JSON.parse(res.data).data.id,
                })
                that.setData({
                  fileList: arr,
                  isChoose: false
                })
              }
            },
            fail(res) {
              wx.hideLoading()
            }
          });
        }
      },
      fail(error) {
        that.setData({
          isChoose: false
        })
      }
    })
  },
  // 图片上传
  afterRead(event) {
    wx.showLoading({
      title: '上传中',
      mask: true
    })
    const { file } = event.detail;
    const that = this
    for(let i=0; i<file.length; i++) {
      wx.uploadFile({
        url: baseUrl + 'upload',
        filePath: file[i].path,
        header: { 'Content-Type': 'application/json', 'Authorization': JSON.parse(wx.getStorageSync('userInfo'))['token'], 'Accept': 'application/vnd.phbjx.v1.0.0+json' },
        name: 'file',
        success(res) {
          wx.hideLoading()
          if (res.statusCode === 200) {
            const arr = [...that.data.fileList];
            arr.push({
              url: JSON.parse(res.data).data.url,
              id: JSON.parse(res.data).data.id,
            })
            that.setData({
              fileList: arr,
              isChoose: false
            })
          }
        },
        fail(res) {
          wx.hideLoading()
        }
      });
    }
  },
  // 删除图片
  deletImg(event) {
    const index = event.currentTarget.dataset.bindex;
    this.data.fileList.splice(index, 1);
    this.setData({
      fileList: this.data.fileList
    })
  },
  upImg(event) {
    const index = event.target.dataset.bindex
    const cutItem = this.data.fileList.splice(index,1)
    this.data.fileList.splice(index-1,0,...cutItem)
    this.setData({
      fileList: this.data.fileList
    })
  },
  downImg(event) {
    const index = event.target.dataset.bindex
    const cutItem = this.data.fileList.splice(index,1)
    this.data.fileList.splice(index+1,0,...cutItem)
    this.setData({
      fileList: this.data.fileList
    })
  },
  // 保存
  save() {
    if (this.data.fileList.length === 0) {
      wx.showToast({
        title: '请添加图片',
        icon: 'none',
        duration: 2000
      })
    } else {
      wx.setStorageSync('goodsDetailImgs', this.data.fileList);
      wx.showToast({
        title: '保存成功',
        icon: 'success',
        duration: 2000
      });
      wx.navigateBack()
    }
  }
})



// 拖拽排序代码暂时注释
// const app = getApp()

// let listData = [
// 	{
// 		dragId: "item0",
// 		title: "芒果",
// 		description: "思念、愿望什么的都是一场空，被这种虚幻的东西绊住脚，什么都做不到",
// 		images: "https://ss0.bdstatic.com/70cFuHSh_Q1YnxGkpoWK1HF6hhy/it/u=3048239447,2486735319&fm=26&gp=0.jpg",
// 		fixed: false
// 	},
// 	{
// 		dragId: "item1",
// 		title: "西瓜",
// 		description: "有太多的羁绊只会让自己迷惘，强烈的想法和珍惜的思念，只会让自己变弱",
// 		images: "https://ss0.bdstatic.com/70cFvHSh_Q1YnxGkpoWK1HF6hhy/it/u=2632937098,2645396802&fm=26&gp=0.jpg",
// 		fixed: false
// 	},
// 	{
// 		dragId: "item2",
// 		title: "橘子",
// 		description: "但我已经在无限存在的痛苦之中，有了超越凡人的成长。从凡人化为神",
// 		images: "https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1599624343764&di=cfda3747dc215fcd52ce54d1047d782e&imgtype=0&src=http%3A%2F%2Fn.sinaimg.cn%2Fsinacn%2Fw960h806%2F20180224%2Fffb3-fyrwsqh8163446.jpg",
// 		fixed: false
// 	},
// 	{
// 		dragId: "item2",
// 		title: "哈密瓜",
// 		description: "但我已经在无限存在的痛苦之中，有了超越凡人的成长。从凡人化为神",
// 		images: "https://ss1.bdstatic.com/70cFvXSh_Q1YnxGkpoWK1HF6hhy/it/u=1107974757,4092714080&fm=26&gp=0.jpg",
// 		fixed: false
// 	},
// 	{
// 		dragId: "item0",
// 		title: "香蕉",
// 		description: "思念、愿望什么的都是一场空，被这种虚幻的东西绊住脚，什么都做不到",
// 		images: "https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1599577598326&di=46d80c92715ccf3c06af946830f62c13&imgtype=0&src=http%3A%2F%2Fdpic.tiankong.com%2Frh%2Fwv%2FQJ6763114805.jpg",
// 		fixed: false
// 	},
// 	{
// 		dragId: "item2",
// 		title: "菠萝",
// 		description: "但我已经在无限存在的痛苦之中，有了超越凡人的成长。从凡人化为神",
// 		images: "https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1599623948159&di=42325853fb5b58b245d5c227532dbb75&imgtype=0&src=http%3A%2F%2F5b0988e595225.cdn.sohucs.com%2Fimages%2F20181118%2F74105d2e55f8414895cd28122447f07e.jpeg",
// 		fixed: false
// 	},
// 	{
// 		dragId: "item1",
// 		title: "草莓",
// 		description: "有太多的羁绊只会让自己迷惘，强烈的想法和珍惜的思念，只会让自己变弱",
// 		images: "https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1599577621899&di=02ff42767dfb251ae4576692f5761f72&imgtype=0&src=http%3A%2F%2Fp2.ssl.cdn.btime.com%2Ft01e8b8e97b21d5b44e.jpg",
// 		fixed: false
// 	},
// 	{
// 		dragId: "item2",
// 		title: "苹果",
// 		description: "但我已经在无限存在的痛苦之中，有了超越凡人的成长。从凡人化为神",
// 		images: "https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1599577645826&di=28f44f3717d4733338d08909cc215dcf&imgtype=0&src=http%3A%2F%2Fpic.baike.soso.com%2Fp%2F20140104%2F20140104094613-2051076391.jpg",
// 		fixed: false
// 	},
// 	{
// 		dragId: "item2",
// 		title: "水蜜桃",
// 		description: "但我已经在无限存在的痛苦之中，有了超越凡人的成长。从凡人化为神",
// 		images: "https://ss0.bdstatic.com/70cFvHSh_Q1YnxGkpoWK1HF6hhy/it/u=1989928309,1693928381&fm=26&gp=0.jpg",
// 		fixed: false
// 	},
// 	];

// Page({
// 	data: {
// 		isIphoneX: app.globalData.isIphoneX,
// 		size: 4,
// 		listData: [],
// 		extraNodes: [
// 			// {
// 			// 	type: "destBefore",
// 			// 	dragId: "destBefore0",
// 			// 	destKey: 0,
// 			// 	slot: "before",
// 			// 	fixed: true
// 			// },
// 			// {
// 			// 	type: "destAfter",
// 			// 	dragId: "destAfter0",
// 			// 	destKey: 0,
// 			// 	slot: "after",
// 			// 	fixed: true
// 			// },
// 			{
// 				type: "after",
// 				dragId: "plus",
// 				slot: "plus",
// 				fixed: true
// 			}
// 		],
// 		pageMetaScrollTop: 0,
// 		scrollTop: 0
// 	},
// 	sortEnd(e) {
// 		console.log("sortEnd", e.detail.listData)
// 		this.setData({
// 			listData: e.detail.listData
// 		});
// 	},
// 	change(e) {
// 		console.log("change", e.detail.listData)
// 	},
// 	sizeChange(e) {
// 		wx.pageScrollTo({scrollTop: 0})
// 		this.setData({
// 			size: e.detail.value
// 		});
// 		this.drag.init();
// 	},
// 	itemClick(e) {
// 		console.log(e);
// 	},
// 	toggleFixed(e) {
// 		let key = e.currentTarget.dataset.key;

// 		let {listData} = this.data;

// 		listData[key].fixed = !listData[key].fixed

// 		this.setData({
// 			listData: listData
// 		});

// 		this.drag.init();
// 	},
// 	add(e) {
// 		let listData = this.data.listData;
// 		listData.push({
// 			dragId: `item${listData.length}`,
// 			title: "这个绝望的世界没有存在的价值，所剩的只有痛楚",
// 			description: "思念、愿望什么的都是一场空，被这种虚幻的东西绊住脚，什么都做不到",
// 			images: "/assets/image/swipe/1.png",
// 			fixed: false
// 		});
// 		setTimeout(() => {
// 			this.setData({
// 				listData,
// 			});
// 			this.drag.init();
// 		}, 300)

// 	},
// 	scroll(e) {
// 		this.setData({
// 			pageMetaScrollTop: e.detail.scrollTop
// 		})
// 	},
// 	// 页面滚动
// 	onPageScroll(e) {
// 		this.setData({
// 			scrollTop: e.scrollTop
// 		});
// 	},
// 	onLoad() {
// 		this.drag = this.selectComponent('#drag');
// 		// 模仿异步加载数据
// 		setTimeout(() => {
// 			this.setData({
// 				listData: listData
// 			});
// 			this.drag.init();
// 		}, 100)
// 	}
// })
export default class LastMayday {
  palette(){
    let args=[...arguments];
    return {
      // width:'660rpx',
      // height:'900rpx',
      width: '750rpx',
      height: '1028rpx',
      background: '#fff',
      views:[
        {
          type: 'rect',
          css: {
            width: '600rpx',
            height: '880rpx',
            left: (750 - 600) / 2 + 'rpx',
            top: '25rpx',
            shadow: "0 0 5rpx rgba(0,0,0,0.08)",
            color: '#fff',
            borderRadius: '30rpx'
          }
        },
        {
          type: 'image',
          url: args[0].goods.firt_slide_image,
          css: {
            width: '600rpx',
            height: '600rpx',
            mode:'scaleToFill',
            left: (750 - 600) / 2 + 'rpx',
            top: '25rpx',
            borderRadius: '30rpx 30rpx 0 0'
          }
        },
        // {
        //   type: 'image',
        //   url: 'https://img.hzanchu.com/acimg/e6dddd6f4a16acc00d9de309249530d9.png',
        //   css: {
        //     width: '600rpx',
        //     left: (750 - 600) / 2 + 'rpx',
        //     top: '25rpx',
        //     borderRadius: '30rpx 30rpx 0 0'
        //   }
        // },
        {
          type: 'image',
          url: args[0].store.store_image,
          css: {
            width: '46rpx',
            height: '46rpx',
            borderRadius: '23rpx',
            left: '107rpx',
            top: '648rpx'
          }
        },
        {
          type: 'text',
          text: args[0].store.title,
          css: {
            width: '280rpx',
            color: '#333',
            fontSize: '30rpx',
            height: '46rpx',
            lineHeight: '46rpx',
            top: '654rpx',
            left: '161rpx',
            fontWeight: 'bold',
            maxLines: 1
          }
        },
        {
          type: 'text',
          text: args[0].goods.goods_name,
          css: {
            width: '300rpx',
            color: '#333',
            fontSize: '30rpx',
            lineHeight: '46rpx',
            top: '725rpx',
            left: '109rpx',
            maxLines: 2
          }
        },
        {
          type: 'text',
          text: '￥' + args[0].goods.price,
          css: {
            width: '200rpx',
            color: '#F76925',
            fontSize: '42rpx',
            lineHeight: '46rpx',
            top: '811rpx',
            left: '109rpx',
            maxLines: 1
          }
        },
        {
          type: 'text',
          text: args[0].goods.original_price != '0.00' ? '￥' + args[0].goods.original_price : '',
          css: {
            width: '200rpx',
            color: '#666',
            fontSize: '26rpx',
            lineHeight: '46rpx',
            top: '860rpx',
            left: '109rpx',
            maxLines: 1,
            textDecoration: 'line-through'
          }
        },
        {
          type: 'image',
          url: args[0].image,
          css: {
            width: '180rpx',
            height: '180rpx',
            top: '655rpx',
            left: '468rpx'
          }
        },
        {
          type: 'text',
          text: '长按或扫一扫查看',
          css: {
            width: '210rpx',
            color: '#999',
            fontSize: '26rpx',
            top: '839rpx',
            left: '453rpx',
            maxLines: 1
          }
        }
        // {
        //   type:'image',
        //   url:args[0].goods.firt_slide_image,
        //   css:{
        //     width:'750rpx',
        //     height:'700rpx',
        //     mode:'scaleToFill'
        //   }
        // },
        // {
        //   type:'image',
        //   url:args[0].store.store_image,
        //   css:{
        //     width:'120rpx',
        //     height:'120rpx',
        //     borderRadius:'60rpx',
        //     borderColor:'#fff',
        //     borderWidth:'2rpx',
        //     top:'750rpx',
        //     left:'30rpx'
        //   }
        // },
        // {
        //   type:'text',
        //   text:args[0].store.corporate_name,
        //   css:{
        //     width:'300rpx',
        //     color:'#000',
        //     fontSize:'30rpx',
        //     top:'770rpx',
        //     left:'170rpx',
        //     maxLines:1
        //   }
        // },
        // {
        //   type:'text',
        //   text:args[0].goods.goods_name,
        //   css:{
        //     width:'300rpx',
        //     color:'#000',
        //     fontSize:'24rpx',
        //     top:'820rpx',
        //     left:'170rpx',
        //     lineHeight:'30rpx',
        //     maxLines:1
        //   }
        // },
        // {
        //   type:'text',
        //   text:`¥ ${args[0].goods.price}`,
        //   css:{
        //     color:'red',
        //     top:'880rpx',
        //     left:'50rpx',
        //     fontSize:'36rpx'
        //   }
        // },
        // {
        //   type:'image',
        //   url:args[0].image,
        //   css:{
        //     width:'180rpx',
        //     top:'750rpx',
        //     right:'30rpx'
        //   }
        // }
      ]
    }
  }
}
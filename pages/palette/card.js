export default class LastMayday {
  palette() {
    let everyFive = [...arguments].every(item => item != '');
    if (everyFive == true) {
      let args = [...arguments];
      let height = `${args[args.length - 1]}`;
      let width = `${args[args.length - 2]}`;
      let zoom = `${args[args.length - 3]}`;
      console.log(args, 'args')
      return {
        width: '750rpx',
        height: '1028rpx',
        views: [
          {
            type: 'image',
            url: args[0],
            css: {
              width: '750rpx',
              height: '1028rpx'
            }
          },
          {
            type: 'image',
            url: args[1],
            css: {
              width: '505rpx',
              height: '406rpx',
              left: (750 - 505) / 2 + 'rpx',
              top: '147rpx' 
            }
          },
          {
            type: 'image',
            url: args[5],
            css: {
              width: '482rpx',
              height: '386rpx',
              left: (750 - 482) / 2 + 'rpx',
              top: '158rpx',
              mode: 'aspectFill'
            }
          },
          {
            type: 'image',
            url: args[2],
            css: {
              width: '492rpx',
              height: '512rpx',
              left: (750 - 492) / 2 + 'rpx',
              top: '388rpx',
            }
          },
          {
            type: 'text',
            text: `${args[4].title}`,
            css: {
              width: '295rpx',
              height: '62rpx',
              color: '#674500',
              fontWeight: 'bold',
              fontSize: '30rpx',
              textAlign: 'center',
              left: (750 - 295) / 2 + 'rpx',
              top: '534rpx',
              maxLines: 1
            }
          },
          {
            type: 'image',
            url: args[3],
            css: {
              width: '190rpx',
              height: '190rpx',
              left: (750 - 190) / 2 + 'rpx',
              top: '604rpx'
            }
          }
        ],
      }
    }
  }
}
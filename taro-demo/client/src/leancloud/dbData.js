import AV from './index'
const CommodityData = [{ "_id": "1", "_openid": "oFQSH5MekinNSc_yqH9dNlmKh6vI", "colorInfo": { "all": ["黑色", "白色", "黄色", "绿色"], "name": "颜色分类", "value": "黑色" }, "desc": [{ "image": "//img30.360buyimg.com/jgsq-productsoa/jfs/t14749/340/2355158754/76418/b93a30b9/5a991e02Nd53a1731.jpg", "name": "商品描述" }, { "image": "//img30.360buyimg.com/jgsq-productsoa/jfs/t14977/135/2361657259/41330/d91b6b25/5a991e0fN210886a6.jpg", "name": "尺寸说明" }], "imageUrl": "img30.360buyimg.com/n8/s310x390_jfs/t17854/168/351555684/169201/cee057c/5a6ebd84Nd6204a28.jpg", "images": ["https://img13.360buyimg.com/ling/jfs/t1/4285/11/5427/13721/5b9f4a26E00109ebb/04e810edd36a305a.png", "https://img13.360buyimg.com/ling/jfs/t1/248/11/5679/72231/5b9f4aa3Ee4dddd31/64f087ff40be13da.jpg"], "name": "描述当前的商品", "price": "120.00", "sizeInfo": { "all": ["S", "M", "L", "XL"], "name": "尺寸", "value": "M" }, "skuId": 1, "skuName": "测试商品1", "stockState": 111, "venderId": 1 }, { "_id": "4", "_openid": "oFQSH5MekinNSc_yqH9dNlmKh6vI", "colorInfo": { "all": ["黑色", "白色", "黄色", "绿色"], "name": "颜色分类", "value": "黄色" }, "desc": [{ "image": "//img30.360buyimg.com/jgsq-productsoa/jfs/t14749/340/2355158754/76418/b93a30b9/5a991e02Nd53a1731.jpg", "name": "商品描述" }, { "image": "//img30.360buyimg.com/jgsq-productsoa/jfs/t14977/135/2361657259/41330/d91b6b25/5a991e0fN210886a6.jpg", "name": "尺寸说明" }], "imageUrl": "img12.360buyimg.com/n8/s310x390_jfs/t16897/151/354607586/157665/d0e395e8/5a6ebb73Neabb5265.jpg", "images": ["https://img13.360buyimg.com/ling/jfs/t1/248/11/5679/72231/5b9f4aa3Ee4dddd31/64f087ff40be13da.jpg", "https://img13.360buyimg.com/ling/jfs/t1/4285/11/5427/13721/5b9f4a26E00109ebb/04e810edd36a305a.png"], "name": "花辰月夕系列手镯", "price": "1200.00", "sizeInfo": { "all": ["S", "M", "L", "XL"], "name": "尺寸", "value": "M" }, "skuId": 4, "skuName": "测试商品4", "venderId": 4 }, { "_id": "3", "_openid": "oFQSH5MekinNSc_yqH9dNlmKh6vI", "colorInfo": { "all": ["黑色", "白色", "黄色", "绿色"], "name": "颜色分类", "value": "绿色" }, "desc": [{ "image": "//img30.360buyimg.com/jgsq-productsoa/jfs/t14749/340/2355158754/76418/b93a30b9/5a991e02Nd53a1731.jpg", "name": "商品描述" }, { "image": "//img30.360buyimg.com/jgsq-productsoa/jfs/t14977/135/2361657259/41330/d91b6b25/5a991e0fN210886a6.jpg", "name": "尺寸说明" }], "images": ["https://img13.360buyimg.com/ling/jfs/t1/4285/11/5427/13721/5b9f4a26E00109ebb/04e810edd36a305a.png", "https://img13.360buyimg.com/ling/jfs/t1/248/11/5679/72231/5b9f4aa3Ee4dddd31/64f087ff40be13da.jpg"], "name": "测试商品3测试商品3测试商品3", "price": "36.00", "sizeInfo": { "all": ["S", "M", "L", "XL"], "name": "尺寸", "value": "S" }, "skuId": 3, "skuName": "测试商品3", "stockState": 111, "venderId": 2 }, { "_id": "5", "_openid": "oFQSH5MekinNSc_yqH9dNlmKh6vI", "colorInfo": { "all": ["黑色", "白色", "黄色", "绿色"], "name": "颜色分类", "value": "黑色" }, "desc": [{ "image": "//img30.360buyimg.com/jgsq-productsoa/jfs/t14749/340/2355158754/76418/b93a30b9/5a991e02Nd53a1731.jpg", "name": "商品描述" }, { "image": "//img30.360buyimg.com/jgsq-productsoa/jfs/t14977/135/2361657259/41330/d91b6b25/5a991e0fN210886a6.jpg", "name": "尺寸说明" }], "imageUrl": "img10.360buyimg.com/n8/s310x390_jfs/t19057/352/345862030/116670/dfb12b18/5a6ebca8Nd2e72e52.jpg", "images": ["https://img13.360buyimg.com/ling/jfs/t1/248/11/5679/72231/5b9f4aa3Ee4dddd31/64f087ff40be13da.jpg", "https://img13.360buyimg.com/ling/jfs/t1/4285/11/5427/13721/5b9f4a26E00109ebb/04e810edd36a305a.png"], "name": "测试商品5测试商品5测试商品5", "price": "850.00", "sizeInfo": { "all": ["S", "M", "L", "XL"], "name": "尺寸", "value": "XL" }, "skuId": 5, "skuName": "测试商品5", "venderId": 3 }, { "_id": "2", "_openid": "oFQSH5MekinNSc_yqH9dNlmKh6vI", "colorInfo": { "all": ["黑色", "白色", "黄色", "绿色"], "name": "颜色分类", "value": "绿色" }, "desc": [{ "image": "//img30.360buyimg.com/jgsq-productsoa/jfs/t14749/340/2355158754/76418/b93a30b9/5a991e02Nd53a1731.jpg", "name": "商品描述" }, { "image": "//img30.360buyimg.com/jgsq-productsoa/jfs/t14977/135/2361657259/41330/d91b6b25/5a991e0fN210886a6.jpg", "name": "尺寸说明" }], "images": ["https://img13.360buyimg.com/ling/jfs/t1/4285/11/5427/13721/5b9f4a26E00109ebb/04e810edd36a305a.png", "https://img13.360buyimg.com/ling/jfs/t1/248/11/5679/72231/5b9f4aa3Ee4dddd31/64f087ff40be13da.jpg"], "price": "10.00", "sizeInfo": { "all": ["S", "M", "L", "XL"], "name": "尺寸", "value": "L" }, "skuId": 2, "skuName": "测试商品2", "venderId": 1 }, { "_id": "7", "_openid": "oFQSH5MekinNSc_yqH9dNlmKh6vI", "colorInfo": { "all": ["黑色", "白色", "黄色", "绿色"], "name": "颜色分类", "value": "白色" }, "desc": [{ "image": "//img30.360buyimg.com/jgsq-productsoa/jfs/t14749/340/2355158754/76418/b93a30b9/5a991e02Nd53a1731.jpg", "name": "商品描述" }, { "image": "//img30.360buyimg.com/jgsq-productsoa/jfs/t14977/135/2361657259/41330/d91b6b25/5a991e0fN210886a6.jpg", "name": "尺寸说明" }], "imageUrl": "img10.360buyimg.com/n8/s310x390_jfs/t19057/352/345862030/116670/dfb12b18/5a6ebca8Nd2e72e52.jpg", "images": ["https://img13.360buyimg.com/ling/jfs/t1/248/11/5679/72231/5b9f4aa3Ee4dddd31/64f087ff40be13da.jpg", "https://img13.360buyimg.com/ling/jfs/t1/4285/11/5427/13721/5b9f4a26E00109ebb/04e810edd36a305a.png"], "name": "测试商品7测试商品7测试商品7", "price": "5.00", "sizeInfo": { "all": ["S", "M", "L", "XL"], "name": "尺寸", "value": "M" }, "skuId": 7, "skuName": "测试商品7", "venderId": 3 }, { "_id": "6", "_openid": "oFQSH5MekinNSc_yqH9dNlmKh6vI", "colorInfo": { "all": ["黑色", "白色", "黄色", "绿色"], "name": "颜色分类", "value": "黄色" }, "desc": [{ "image": "//img30.360buyimg.com/jgsq-productsoa/jfs/t14749/340/2355158754/76418/b93a30b9/5a991e02Nd53a1731.jpg", "name": "商品描述" }, { "image": "//img30.360buyimg.com/jgsq-productsoa/jfs/t14977/135/2361657259/41330/d91b6b25/5a991e0fN210886a6.jpg", "name": "尺寸说明" }], "imageUrl": "img10.360buyimg.com/n8/s310x390_jfs/t19057/352/345862030/116670/dfb12b18/5a6ebca8Nd2e72e52.jpg", "images": ["https://img13.360buyimg.com/ling/jfs/t1/4285/11/5427/13721/5b9f4a26E00109ebb/04e810edd36a305a.png", "https://img13.360buyimg.com/ling/jfs/t1/248/11/5679/72231/5b9f4aa3Ee4dddd31/64f087ff40be13da.jpg"], "name": "测试商品6测试商品6测试商品6测试商品6测试商品6测试商品6测试商品6", "price": "250.00", "sizeInfo": { "all": ["S", "M", "L", "XL"], "name": "尺寸", "value": "XL" }, "skuId": 6, "skuName": "测试商品6", "venderId": 4 }]

const shopData = [
  {
    "_id": "4",
    "banner": [
      "http://img20.360buyimg.com/ling/jfs/t1/5373/22/5202/707257/5b9f1e8aE219cdf19/bb17192e448bade7.jpg",
      "http://img14.360buyimg.com/ling/jfs/t1/460/5/5518/747242/5b9f1eb2Ed89cd28b/7787f2a49186610f.jpg",
      "http://img30.360buyimg.com/ling/jfs/t1/268/31/5534/1729274/5b9f1f14Eee5b2adf/8e74d65c03f3f9fd.jpg!q60",
      "http://img11.360buyimg.com/ling/jfs/t1/4629/4/5095/1714340/5b9f1f72E997695e5/4f56ca1a12642971.jpg!q60"
    ],
    "desc": "店铺4页面",
    "floors": [
      {
        "commodities": [
          4,
          6,
          1,
          2
        ],
        "desc": "http://img30.360buyimg.com/ling/jfs/t1/5083/21/5232/267378/5b9f2d78E8bcd381b/ff27135de4d8cf8c.jpg",
        "title": "//img12.360buyimg.com/tuangou/s750x170_jfs/t15316/209/1136705664/8030/71099545/5a4626ebN8fea2205.png"
      },
      {
        "commodities": [
          1,
          2,
          5,
          3
        ],
        "desc": "http://img13.360buyimg.com/ling/jfs/t1/351/8/5598/360623/5b9f2d78E2ae9ff61/716a483125913fd9.jpg",
        "title": "//img10.360buyimg.com/tuangou/s750x170_jfs/t15328/270/809894122/7669/cc12bee5/5a38bbd7Nd9f338f0.png"
      }
    ],
    "thumbnail": "//img14.360buyimg.com/popshop/s190x80_jfs/t11023/223/1027006619/7985/c520a46c/5a379a4aN9d105368.png",
    "title": "店铺4",
    "venderId": 4
  },
  {
    "_id": "3",
    "banner": [
      "http://img20.360buyimg.com/ling/jfs/t1/5373/22/5202/707257/5b9f1e8aE219cdf19/bb17192e448bade7.jpg",
      "http://img14.360buyimg.com/ling/jfs/t1/460/5/5518/747242/5b9f1eb2Ed89cd28b/7787f2a49186610f.jpg",
      "http://img30.360buyimg.com/ling/jfs/t1/268/31/5534/1729274/5b9f1f14Eee5b2adf/8e74d65c03f3f9fd.jpg!q60",
      "http://img12.360buyimg.com/ling/jfs/t1/1501/21/5274/925976/5b9f2021E25bcf9e1/9850163290842937.jpg!q60"
    ],
    "desc": "店铺3页面",
    "floors": [
      {
        "commodities": [
          2,
          3,
          6,
          4
        ],
        "desc": "http://img30.360buyimg.com/ling/jfs/t1/5083/21/5232/267378/5b9f2d78E8bcd381b/ff27135de4d8cf8c.jpg",
        "title": "//img12.360buyimg.com/tuangou/s750x170_jfs/t15316/209/1136705664/8030/71099545/5a4626ebN8fea2205.png"
      },
      {
        "commodities": [
          1,
          5,
          3,
          6
        ],
        "desc": "http://img10.360buyimg.com/ling/jfs/t1/1657/27/5346/245880/5b9f2d78E85f0c8c7/1dc51ecf4e25b6d0.jpg",
        "title": "//img10.360buyimg.com/tuangou/s750x170_jfs/t15328/270/809894122/7669/cc12bee5/5a38bbd7Nd9f338f0.png"
      }
    ],
    "thumbnail": "//img12.360buyimg.com/n1/s190x80_jfs/t22429/300/1109626640/5017/d77c7252/5b50350aNb53dba6c.png",
    "title": "店铺3",
    "venderId": 3
  },
  {
    "_id": "1",
    "banner": [
      "http://img14.360buyimg.com/ling/jfs/t1/460/5/5518/747242/5b9f1eb2Ed89cd28b/7787f2a49186610f.jpg",
      "http://img30.360buyimg.com/ling/jfs/t1/268/31/5534/1729274/5b9f1f14Eee5b2adf/8e74d65c03f3f9fd.jpg!q60",
      "http://img12.360buyimg.com/ling/jfs/t1/1501/21/5274/925976/5b9f2021E25bcf9e1/9850163290842937.jpg!q60",
      "http://img14.360buyimg.com/ling/jfs/t1/1826/38/5279/1690440/5b9f1f90Eecfa2c50/10051d297b94c29b.jpg!q60"
    ],
    "desc": "店铺1页面",
    "floors": [
      {
        "commodities": [
          1,
          2,
          3,
          4
        ],
        "desc": "http://img13.360buyimg.com/ling/jfs/t1/351/8/5598/360623/5b9f2d78E2ae9ff61/716a483125913fd9.jpg",
        "title": "//img12.360buyimg.com/tuangou/s750x170_jfs/t15316/209/1136705664/8030/71099545/5a4626ebN8fea2205.png"
      },
      {
        "commodities": [
          1,
          3,
          4,
          5
        ],
        "desc": "http://img10.360buyimg.com/ling/jfs/t1/1657/27/5346/245880/5b9f2d78E85f0c8c7/1dc51ecf4e25b6d0.jpg",
        "title": "//img10.360buyimg.com/tuangou/s750x170_jfs/t15328/270/809894122/7669/cc12bee5/5a38bbd7Nd9f338f0.png"
      }
    ],
    "thumbnail": "//img10.360buyimg.com/popshop/s190x80_jfs/t16390/270/1887231446/24253/18756a28/5a72d454N18b1efc6.jpg",
    "title": "店铺1",
    "venderId": 1
  },
  {
    "_id": "2",
    "banner": [
      "http://img30.360buyimg.com/ling/jfs/t1/268/31/5534/1729274/5b9f1f14Eee5b2adf/8e74d65c03f3f9fd.jpg!q60",
      "http://img12.360buyimg.com/ling/jfs/t1/1501/21/5274/925976/5b9f2021E25bcf9e1/9850163290842937.jpg!q60",
      "http://img14.360buyimg.com/ling/jfs/t1/1826/38/5279/1690440/5b9f1f90Eecfa2c50/10051d297b94c29b.jpg!q60",
      "http://img20.360buyimg.com/ling/jfs/t1/5373/22/5202/707257/5b9f1e8aE219cdf19/bb17192e448bade7.jpg"
    ],
    "desc": "店铺2页面",
    "floors": [
      {
        "commodities": [
          3,
          1,
          2,
          5
        ],
        "desc": "http://img10.360buyimg.com/ling/jfs/t1/1657/27/5346/245880/5b9f2d78E85f0c8c7/1dc51ecf4e25b6d0.jpg",
        "title": "//img12.360buyimg.com/tuangou/s750x170_jfs/t15316/209/1136705664/8030/71099545/5a4626ebN8fea2205.png"
      },
      {
        "commodities": [
          1,
          3,
          2,
          7
        ],
        "desc": "http://img30.360buyimg.com/ling/jfs/t1/5083/21/5232/267378/5b9f2d78E8bcd381b/ff27135de4d8cf8c.jpg",
        "title": "//img10.360buyimg.com/tuangou/s750x170_jfs/t15328/270/809894122/7669/cc12bee5/5a38bbd7Nd9f338f0.png"
      }],
    "thumbnail": "//img10.360buyimg.com/popshop/s190x80_jfs/t17935/53/2369573223/24376/e2dd64/5af1b116N558ae2db.jpg",
    "title": "店铺2",
    "venderId": 2
  }]

const ObjectIds = [
  '5baddeae0b6160006fc4ae06',
  '5baddeaeac502e00632b413e',
  '5baddeaeee920a00675648bc',
  '5baddeaefb4ffe006948b10e',
  '5baddeae808ca40072d5f05f',
  '5baddeae0b6160006ab64ab0',
  '5baddeae9f54540070420da6'
]

function initShopData() {
  const Shop = AV.Object.extend('shop')
  const newShopData = shopData.map((item) => {
    delete item._id
    item.floors.map((floor) => {
      const newCommodities = randomArray(ObjectIds, 4)
      floor.commodities = newCommodities.map(comId => {
        return AV.Object.createWithoutData('commodity', comId)
      })
      return floor
    })
    return item
  })
  newShopData.forEach(item => {
    const shop = new Shop()
    for (let key in item) {
      shop.set(key, item[key])
    }
    shop.save().then((res) => {
      console.log(res)
    })
  })
}

function randomArray(arr, num) {
  const tempArr = arr.slice(0)
  const result = []
  let count = tempArr.length
  for (let i = 0; i < num; i++) {
    let idx = ~~(Math.random() * count) + i
    result.push(tempArr[idx])
    tempArr[idx] = tempArr[i]

    count--
  }
  console.log(result)
  return result
}

function initCommodityData() {
  const Commodity = AV.Object.extend('commodity')
  CommodityData.forEach((commodity) => {
    delete commodity._id
    delete commodity._openid
    const com = new Commodity()
    for (let key in commodity) {
      com.set(key, commodity[key])
    }
    com.save().then((res) => {
      console.log(res.id)
    })
  })
}

import Taro from '@tarojs/taro'
import aesjs from 'aes-js'
import base64js from 'base64-js'
import '@tarojs/async-await'

const WEEK_DAYS = ['周日', '周一', '周二', '周三', '周四', '周五', '周六']
const PAGE_LEVEL_LIMIT = 10

const reduce = Function.bind.call(Function.call, Array.prototype.reduce)
const isEnumerable = Function.bind.call(Function.call, Object.prototype.propertyIsEnumerable)
const concat = Function.bind.call(Function.call, Array.prototype.concat)
const keys = Reflect.ownKeys

if (!Object.values) {
  Object.values = function values (O) {
    return reduce(keys(O), (v, k) => concat(v, typeof k === 'string' && isEnumerable(O, k) ? [O[k]] : []), [])
  }
}

// 获取用户信息
async function getUserInfo () {
  // await getUuid()
  try {
    if (!userInfo) {
      const userData = await Taro.getUserInfo()

      userInfo = userData.userInfo
    }
    return userInfo
  } catch (err) {
    console.log(err)
    console.log('getUserInfo error')
    return ''
  }
}

// 返回四级地址
function getAreas () {
  const defaultArea = {
    areaIds: [1, 72, 2799, 0],
    commonAreaId: null
  }
  const areasobj = Taro.getStorageSync('areaobj') || null
  if (!areasobj) {
    return {
      areas: defaultArea.areaIds.join('-')
    }
  }
  return areasobj
}

// 返回ptKey
function getLoginStatus () {
  var ptKey = Taro.getStorageSync || Taro.getStorageSync('jdlogin_pt_key') || null // 登录状态
  return ptKey
}

// 获取uuid
async function getUuid () {
  try {
    // 调用登录接口
    const loginRes = await Taro.login()
    const _uuid = await getLoginUuid(loginRes.code)
    return _uuid
  } catch (err) {
    console.log(err)
    return ''
  }
}

// 去登录
function goLogin (data) {
  var arrpageShed = Taro.getCurrentPages()
  var strCurrentPage = '/' + arrpageShed[arrpageShed.length - 1].__route__
  let _data = []
  let _dataString = ''
  if (data) {
    for (const key in data) {
      if (data.hasOwnProperty(key)) {
        _data.push(`${key}=${data[key]}`)
      }
    }
  }
  if (_data.length > 0) {
    _dataString = '?' + _data.join('&')
  }
  var returnpage = encodeURIComponent(strCurrentPage + _dataString)
  var urlString = '/pages/account/login/login?returnpage=' + returnpage
  // console.log(urlString)
  Taro.navigateTo({
    url: urlString
  })
}

function isEmptyObject (obj) {
  if (!obj) {
    return true
  }
  for (const prop in obj) {
    if (obj.hasOwnProperty(prop)) {
      return false
    }
  }
  return true
}

// 判断是否登录
function getJdLogin () {
  let ptKey = Taro.getStorageSync || Taro.getStorageSync('jdlogin_pt_key') || null // 登录状态
  return {
    ptKey: ptKey
  }
}

// 获取地址里的query param
function getQueryParam (url, param) {
  if (url.split('?').length === 2) {
    let params = url.split('?')[1].split('&')
    let obj = {}
    for (let i = 0; i < params.length; i++) {
      let key = params[i].split('=')[0]
      let val = params[i].split('=')[1]
      obj[key] = val
    }
    return obj[param]
  }
}

//拼接url
function createUrl (url, params) {
  let newUrl = ''
  if (url && params) {
    for (let key in params) {
      if (params[key]) {
        let item = '&' + key + '=' + params[key]
        newUrl += item
      }
    }
  }

  url = url.indexOf('?') > -1 ? url + newUrl : url + '?' + newUrl.substr(1)
  return url.replace(' ', '')
}

//获取当前系统信息
function getSystemInfo () {
  const systemInfo = Taro.getSystemInfoSync() || {
    model: ''
  }
  systemInfo.isIpx = systemInfo.model && systemInfo.model.indexOf('iPhone X') > -1 ? true : false
  return systemInfo
}

function parseDate (time) {
  if (time instanceof Date) {
    return time
  }
  if (time) {
    time = typeof time === 'string' ? time.replace(/-/g, '/') : time
    return new Date(time)
  }
  return new Date()
}

function getWeekDay (time) {
  const date = parseDate(time)
  return WEEK_DAYS[date.getDay()]
}

function getParseDay (time, weekDay, symbol) {
  symbol = symbol || '-'
  const date = parseDate(time)
  const WEEK_DAYS = ['周日', '周一', '周二', '周三', '周四', '周五', '周六']
  const month = date.getMonth() + 1
  const parseMonth = month.toString().length < 2 ? `0${month}` : month
  let lparseDate = date.getDate()
  lparseDate = lparseDate.toString().length < 2 ? `0${lparseDate}` : lparseDate
  let parseDay = weekDay
    ? `${date.getFullYear()}${symbol}${parseMonth}${symbol}${lparseDate} ${WEEK_DAYS[date.getDay()]}`
    : `${date.getFullYear()}${symbol}${parseMonth}${symbol}${lparseDate}`
  return parseDay
}

function getParseTime (time) {
  const date = parseDate(time)
  const hours = date.getHours().toString().length > 1 ? date.getHours() : `0${date.getHours()}`
  const minutes = date.getMinutes().toString().length > 1 ? date.getMinutes() : `0${date.getMinutes()}`
  const seconds = date.getSeconds().toString().length > 1 ? date.getSeconds() : `0${date.getSeconds()}`
  return `${hours}:${minutes}:${seconds}`
}

function getImageDomain (a) {
  let b
  a = String(a)
  switch (a.match(/(\d)$/)[1] % 6) {
    case 0:
      b = 10
      break
    case 1:
      b = 11
      break
    case 2:
      b = 12
      break
    case 3:
      b = 13
      break
    case 4:
      b = 14
      break
    case 5:
      b = 30
      break
    default:
      b = 10
  }
  return 'https://img{0}.360buyimg.com/'.replace('{0}', b)
}

/**
 * 获取JD图片
 * @author Manjiz
 * @see http://storage.jd.com/doc/jd-image.pdf
 * @param {string} imgUrlOrPath As parameter name.
 * @param {number} [id=0] SkuId or index of this item.
 * @param {string} [business=da] Business name，you can use n0-n12, test, da and so on. IF imgUrl is provided and business name is omitted, we will get the business name from imgUrl.
 * @param {object} [size] Image size.
 * @param {number} [size.w]
 * @param {number} [size.h]
 * @param {bool} [size.raw] It's raw size or retina size, default false (retina support).
 * @param {string[]} [posttreatments] Post-treatments. For details, see DOC-OF-JD-IMAGE.
 * @return {string} JDImage url.
 */
function getJDImage (imgUrlOrPath = '', id = 0, business, size, posttreatments = []) {
  const imgPath = imgUrlOrPath.replace(/.*(?=jfs\/)/, '')
  const domain = getImageDomain(id)
  if (!business) {
    const matches = imgUrlOrPath.match(/(?:360buyimg\.com\/)(.*?)\//)
    if (matches && matches[1]) {
      business = matches[1]
    }
  }
  const sizeKey = Object.keys(size)
  const hasSize = sizeKey.length > 0
  // const retina = Helper.isRetina && !size.raw
  const retina = !size.raw
  const sizePath = hasSize ? `s${retina ? size.w * 2 : size.w}x${retina ? size.h * 2 : size.h}_` : ''
  const joinPost = posttreatments.join('')
  return `${domain}${business || 'da'}/${sizePath}${imgPath}${joinPost}`
}

// 获取地址
function getAreaId () {
  const defaultArea = {
    areaIds: [1, 72, 2799, 0],
    commonAreaId: null
  }
  let storedArea = Taro.getStorageSync('ipLoc-djd')
  if (storedArea) {
    const index = storedArea.indexOf('.')
    if (index > -1) {
      defaultArea.commonAreaId = Number(storedArea.substr(index + 1))
      storedArea = storedArea.substring(0, index)
    }
    defaultArea.areaIds = storedArea.split('-')
    if (defaultArea.areaIds.length < 4) {
      defaultArea.areaIds.push(0)
    }
    defaultArea.areaIds = defaultArea.areaIds.map(item => Number(item))
  }
  return defaultArea
}

function parseMoney (num) {
  num = num.toString().replace(/\$|,/g, '')
  if (isNaN(num)) num = '0'

  // let sign = (num === (num = Math.abs(num)))

  num = Math.floor(num * 100 + 0.50000000001)
  let cents = num % 100
  num = Math.floor(num / 100).toString()

  if (cents < 10) cents = '0' + cents
  for (var i = 0; i < Math.floor((num.length - (1 + i)) / 3); i++) {
    num = num.substring(0, num.length - (4 * i + 3)) + ',' +
      num.substring(num.length - (4 * i + 3))
  }

  return (num + '.' + cents)
}

function throttle (fn, threshhold, scope) {
  threshhold || (threshhold = 250)
  let last, deferTimer
  return function () {
    let context = scope || this

    let now = +new Date()
    let args = arguments
    if (last && now < last + threshhold) {
      clearTimeout(deferTimer)
      deferTimer = setTimeout(() => {
        last = now
        fn.apply(context, args)
      }, threshhold)
    } else {
      last = now
      fn.apply(context, args)
    }
  }
}

/**
 * 店铺组件里用到的各种跳转
 * pages 必须,没有填 undefined[String]
 * props 必须 tourl, 当pages为undefined时必须urltype
 **/

function gotoPage (pages, e) {
  const tourl = e && e.currentTarget && e.currentTarget.dataset.tourl
  let urltype = e && e.currentTarget && e.currentTarget.dataset.urltype
  const venderid = e && e.currentTarget && e.currentTarget.dataset.venderid
  const subShopId = e && e.currentTarget && e.currentTarget.dataset.subshop
  // 容错
  if (!tourl && !urltype && pages === 'undefined') {
    return
  }
  urltype = parseInt(urltype, 10)
  let id = tourl
  let pagesType = ''
  const pagesTypeMap = {
    '1': 'detail',
    '2': 'shop',
    '3': 'act', //（后台配置的是m页类型），就调用活动接口取id跳转
    '4': 'act', // 没有urltype=4的情况，cf有问题
    '5': 'sList', // 那边调用s/wares
    '6': 'm', //如果urltype=6，（后台配置是其他活动类型），就直接跳配置的链接
    '100': 'video',
    '101': 'list', // 那边调用list/wares
    '102': 'live',
    '103': 'mstoneList', // 那边调用 list/visualwares
    '104': 'videoList',
    '105': 'tClassList',
    '106': 'tclasslistdetail',
    '107': 'coupon',
    '108': 'download',
    '109': 'subShop'
  }
  if (pages === 'undefined') {
    switch (urltype) {
      case 1:
        id = getQueryParam(tourl, 'skuId') || tourl
        break
      case 2:
        id = getQueryParam(tourl, 'venderId') || tourl
        break
      case 3:
      case 4:
        id = getQueryParam(tourl, 'id') || tourl
        break
      //case 5:                                           //分类 list
      //  id = getQueryParam(tourl, 'venderId') || tourl
      //  break
      case 6:
        id = getQueryParam(tourl, 'id') || tourl
        break
      case 109:
        id = getQueryParam(tourl, 'id') || tourl
        break
      default:
        id = tourl
    }
    if (urltype === 6 && getQueryParam(tourl, 'id')) { // 处理 http://www.toplife.com/asc.html?id=xxx这种情况
      urltype = 3
    } else {
      id = String(id).replace('http:', 'https:')
    }
    pagesType = pagesTypeMap[urltype]
  } else {
    pagesType = pages
  }
  const path = {
    index: {
      url: '/pages/index/index',
      fn: 'switchTab'
    },
    cart: {
      url: '/pages/cart/cart_sub',
      fn: 'navigateTo'
    },
    list: {
      url: '/pages/list/list?cid2=' + id + '&venderId=' + venderid + '&subShop=' + (subShopId || ''),
      fn: 'navigateTo'
    },
    sList: {
      url: '/pages/list/list?ShopCategoryIDS=' + id + '&venderId=' + venderid + '&subShop=' + (subShopId || ''),
      fn: 'navigateTo'
    },
    mstoneList: {
      url: '/pages/list/list?sub=' + id + '&venderId=' + venderid,
      fn: 'navigateTo'
    },
    detail: {
      url: '/pages/detail/detail?skuId=' + id,
      fn: 'navigateTo'
    },
    shop: {
      url: '/pages/shop/shop?venderId=' + id,
      fn: 'navigateTo'
    },
    subShop: {
      url: '/pages/shop/subShop?id=' + id + '&venderId=' + venderid,
      fn: 'navigateTo'
    },
    act: {
      url: '/pages/tclass/tclass?id=' + id,
      fn: 'navigateTo'
    },
    m: {
      url: '/pages/webview?url=' + encodeURIComponent(id),
      fn: 'navigateTo'
    },
    search: {
      url: '/pages/search/search?ShopCategoryIDS=' + id + '&venderId=' + venderid,
      fn: 'navigateTo'
    },
    video: {
      url: '/pages/info/video?url=' + id,
      fn: 'navigateTo'
    }
  }

  Taro[path[pagesType].fn]({url: path[pagesType].url})
}

// 处理微信跳转超过10层
function jumpUrl (url, options = {}) {
  const pages = Taro.getCurrentPages()
  let method = options.method || 'navigateTo'
  if (url && typeof url === 'string') {
    if (method == 'navigateTo' && pages.length >= PAGE_LEVEL_LIMIT - 3) {
      method = 'redirectTo'
    }

    if (method == 'navigateToByForce') {
      method = 'navigateTo'
    }

    if (method == 'navigateTo' && pages.length == PAGE_LEVEL_LIMIT) {
      method = 'redirectTo'
    }

    Taro[method]({
      url
    })
  }
}

function aesEncrypt (content) {
  const byteArr = Array.apply(null, {length: 16})
  let key = stringToByte('toplife@')
  key = byteArr.map((item, idx) => {
    if (key[idx]) {
      item = key[idx]
    } else {
      item = 0
    }
    return item
  })
  const AES = new aesjs.ModeOfOperation.ecb(key)

  const contentBytes = aesjs.utils.utf8.toBytes(content)
  const result = AES.encrypt(aesjs.padding.pkcs7.pad(contentBytes))

  return base64js.fromByteArray(result)
}

function stringToByte (str) {
  var bytes = new Array()
  var len, c
  len = str.length
  for (var i = 0; i < len; i++) {
    c = str.charCodeAt(i)
    if (c >= 0x010000 && c <= 0x10FFFF) {
      bytes.push(((c >> 18) & 0x07) | 0xF0)
      bytes.push(((c >> 12) & 0x3F) | 0x80)
      bytes.push(((c >> 6) & 0x3F) | 0x80)
      bytes.push((c & 0x3F) | 0x80)
    } else if (c >= 0x000800 && c <= 0x00FFFF) {
      bytes.push(((c >> 12) & 0x0F) | 0xE0)
      bytes.push(((c >> 6) & 0x3F) | 0x80)
      bytes.push((c & 0x3F) | 0x80)
    } else if (c >= 0x000080 && c <= 0x0007FF) {
      bytes.push(((c >> 6) & 0x1F) | 0xC0)
      bytes.push((c & 0x3F) | 0x80)
    } else {
      bytes.push(c & 0xFF)
    }
  }
  return bytes
}

function jsonToQueryString (json) {
  return '?' +
    Object.keys(json).map((key) => {
      return encodeURIComponent(key) + '=' +
        encodeURIComponent(json[key])
    }).join('&')
}

function queryStringToJson (queryString) {
  if (queryString.indexOf('?') > -1) {
    queryString = queryString.split('?')[1]
  }
  const pairs = queryString.split('&')
  const result = {}
  pairs.forEach((pair) => {
    pair = pair.split('=')
    result[pair[0]] = decodeURIComponent(pair[1] || '')
  })
  return result
}

function createApis (domain, routes, params) {
  const defaultParams = {
    clientType: 'xcx',
    source: '4',
    cv: '2.7.4'
  }
  params = Object.assign(defaultParams, params)
  if (typeof routes === 'string') {
    return domain + routes + jsonToQueryString(params)
  }
  for (let key in routes) {
    routes[key] = domain + routes[key] + jsonToQueryString(params)
  }
  return routes
}

module.exports = {
  getAreas,
  getLoginStatus,
  goLogin,
  getQueryParam,
  getUserInfo,
  getJdLogin,
  getParseDay,
  isEmptyObject,
  getImageDomain,
  getJDImage,
  getAreaId,
  parseMoney,
  getWeekDay,
  getParseTime,
  throttle,
  getSystemInfo,
  createUrl,
  jumpUrl,
  gotoPage,
  aesEncrypt,
  createApis,
  jsonToQueryString,
  queryStringToJson
}

import Taro from '@tarojs/taro'
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

export {
  getAreas,
  getLoginStatus,
  goLogin,
  getQueryParam,
  getUserInfo,
  getJdLogin,
  getParseDay,
  isEmptyObject,
  parseMoney,
  getWeekDay,
  getParseTime,
  throttle,
  getSystemInfo,
  createUrl,
  jumpUrl,
  jsonToQueryString,
  queryStringToJson
}

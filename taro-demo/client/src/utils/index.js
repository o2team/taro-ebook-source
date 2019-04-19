import Taro from '@tarojs/taro'
import { getGlobalData } from '../constants/globalData'

const appid = 'wx9504f077bdc24ea2'
const secret = 'a98c03055579cfd517a45fb4771377e9'

async function getUserInfo () {
  const userData = getGlobalData('userData')
  if (userData) {
    return userData
  }
  try {
    const userData = await Taro.getUserInfo()
    return userData
  } catch (err) {
    console.log(err)
    console.log('微信登录或用户接口故障')
    return {}
  }
}

async function getOpenId () {
  let openId
  try {
    openId = Taro.getStorageSync('taro_demo_openid')
  } catch (error) {
    console.log(error)
  }
  if (openId) {
    return openId
  } else {
    const res = await Taro.cloud.callFunction({
      name: 'user',
      data: {
        func: 'getOpenId'
      }
    })
    const openId = res.result.data.openId
    Taro.setStorage({key: 'taro_demo_openid', data: openId})
    return openId
  }
}

async function getIsAuth () {
  const openid = await getOpenId()
  let {userInfo} = await getUserInfo()
  let isAuth = false
  if (userInfo) {
    userInfo.isAuth = true
    userInfo._id = openid
    isAuth = true
  } else {
    userInfo = {
      _id: openid,
      isAuth: false
    }
  }
  await wx.cloud.callFunction({
    name: 'user',
    data: {
      func: 'addUser',
      data: userInfo
    },
    success: (res) => {
      // console.log(res)
    },
    fail: (res) => {
      // console.log(res)
    }
  })

  return isAuth
}

function getH5UniqueId () {
  if (process.env.TARO_ENV !== 'weapp') {
    return new Promise((resolve, reject) => {
      Taro.getStorage({
        key: 'Taro_h5_demo_uid',
        success({ data }) {
          if (!data) {
            const h5Id = `user_${Math.random().toString(36).substr(2)}`
            Taro.setStorage({ key: 'Taro_h5_demo_uid', data: h5Id })
            const addUser = require('../leancloud/user/addUser').addUser
            addUser(h5Id).then((res) => {
              Taro.setStorage({ key: 'Taro_h5_demo_objectId', data: res.id })
              resolve(h5Id)
            }).catch(reject)
          } else {
            resolve(data)
          }
        },
        fail() {
          const h5Id = `user_${Math.random().toString(36).substr(2)}`
          Taro.setStorage({ key: 'Taro_h5_demo_uid', data: h5Id })
          const addUser = require('../leancloud/user/addUser').addUser
          addUser(h5Id).then((res) => {
            Taro.setStorage({ key: 'Taro_h5_demo_objectId', data: res.id })
            resolve(h5Id)
          }).catch(reject)
        }
      })
    })
  } else {
    return null
  }
}

export {
  getUserInfo,
  getOpenId,
  getIsAuth,
  getH5UniqueId
}

import Taro from '@tarojs/taro'

import { getGlobalData } from '../constants/globalData'
import { isEmptyObject } from './util'

export async function getWxUserData () {
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
    return null
  }
}

export async function checkSettingStatus (scope, { title, content }) {
  const setting = await Taro.getSetting()
  const authSetting = setting.authSetting
  if (!isEmptyObject(authSetting)) {
    if (authSetting[scope] === false) {
      const res = await Taro.showModal({
        title: title,
        content: content,
        showCancel: true
      })
      if (res.confirm) {
        const setting = await Taro.openSetting()
        const authSetting = setting.authSetting
        if (!isEmptyObject(authSetting)) {
          if (authSetting[scope] === true) {
            return await getWxUserData()
          }
        }
      }
    }
  }
  return null
}

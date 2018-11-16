import Taro from '@tarojs/taro'
import { createAction } from 'redux-actions'
import {
  SHOW_SEARCH_BAR,
  REQUEST_SEARCH_RESULT,
  RECEIVE_SEARCH_RESULT,
  RECEIVE_SEARCH_ERROR,
  SHOW_RESULT,
  CHANGE_HISTORY,
  SHOW_NOT_FIND,
  RESET_STATE
} from '../constants/search'

export const triggerShowSearchBar = createAction(SHOW_SEARCH_BAR)
export const showResult = createAction(SHOW_RESULT, data => data)
export const changeHistory = createAction(CHANGE_HISTORY, data => data)
export const restState = createAction(RESET_STATE)

const actionMap = {
  requestSearch: createAction(REQUEST_SEARCH_RESULT, (data) => data),
  receiveSearch: createAction(RECEIVE_SEARCH_RESULT, (data) => data),
  receiveSearchError: createAction(RECEIVE_SEARCH_ERROR, (data) => data),
  receiveShowNotFind: createAction(SHOW_NOT_FIND)
}

export function setSearchHistory (data = {}) {
  
  return async dispatch => {     
    try {
      const res = await Taro.getStorage({key: 'search_history'})
      let history = res.data
      if (data.value && data.type && data.type === 'add' && history.indexOf(data.value) === -1) {
        history.unshift(data.value)

      } else if (data.value && data.type && data.type === 'add' && history.indexOf(data.value) > -1) {
        history.splice(history.indexOf(data.value), 1)
        history.unshift(data.value)

      } else if (history && data.value && data.type && data.type === 'delete' && history.indexOf(data.value) > -1) {
        history.splice(data.value, 1)
      }
      if (history.length > 50) {
        history = history.splice(0, 50)
      }

      Taro.setStorage({
        key: 'search_history',
        data: history,
        success: () => {
          dispatch(changeHistory(history))
        }
      })
    } catch (e) {
      console.log('操作历史搜索失败')
    }
  }
}

export function fetchSearchData (data) {
  Taro.showLoading({title: '加载中...'})
  data.page = data.page || 1
  data['pageSize'] = 10
  console.log(data)
  return async dispatch => {
    try {
      dispatch(actionMap['requestSearch']())
      let res
      if (process.env.TARO_ENV === 'weapp') {
        res = await wx.cloud.callFunction({
          name: 'search',
          data: {
            func: 'getList',
            data
          }
        })
      } else if (process.env.TARO_ENV === 'h5' || 'rn') {
        const getList = require('../leancloud/search/getList').getList
        res = await getList(data)
      }
      if (res.result.data && res.result.data.count) {
        dispatch(actionMap['receiveSearch'](res.result.data))
      } else {
        dispatch(actionMap['receiveShowNotFind']())
      }
      Taro.hideLoading()
    } catch (err) {
      console.log(err)
      dispatch(actionMap['receiveSearchError']())
      Taro.hideLoading()
    }
  }
}

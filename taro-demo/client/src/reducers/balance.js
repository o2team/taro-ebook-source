import { handleActions } from 'redux-actions'
import {
  REQUEST_BALANCE_INFO,
  RECEIVE_BALANCE_INFO,
  RECEIVE_BALANCE_ORDER,
  REQUEST_BALANCE_ORDER
} from '../constants/balance'

import { parseMoney } from '../utils/util'

const balanceData = {
  isNeedBanlance: true,
  payCommodities: [],
  freightPrice: 14,
  totalPrice: 0,
  allPrice: 0,
  payNum: 0, 
  isFetching: false
}

export default handleActions({
  [REQUEST_BALANCE_INFO] (state) {
    return {
      ...state,
      isFetching: true
    }
  },
  [RECEIVE_BALANCE_INFO] (state, action) {
    const { payCommodities, isNeedBanlance, payNum } = action.payload
    let totalPrice = action.payload.totalPrice
    const allPrice = parseMoney(totalPrice + state.freightPrice)
    totalPrice = parseMoney(totalPrice)
    return {
      ...state,
      isNeedBanlance,
      payCommodities,
      totalPrice,
      allPrice,
      payNum,
      isFetching: false
    }
  },
  [REQUEST_BALANCE_ORDER](state) {
    return Object.assign({}, state, {
      isFetching: true
    })
  },

  [RECEIVE_BALANCE_ORDER](state) {
    return Object.assign({}, state, {
      isFetching: false
    })
  }
}, {...balanceData})

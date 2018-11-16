import { handleActions } from 'redux-actions'
import {
  REQUEST_ORDER_DETAIL,
  RECEIVE_ORDER_DETAIL,
  RECEIVE_ORDER_CANCEL,
  REQUEST_ORDER_CANCEL
} from '../../constants/order/detail'

const detail = {
  isFetchingDetail: false,
  all: {}
}

export default handleActions({
  [REQUEST_ORDER_DETAIL] (state) {
    return Object.assign({
      isFetchingDetail: true
    }, state)
  },

  [RECEIVE_ORDER_DETAIL] (state, action) {
    const res = action.payload
    return {
      ...state,
      isFetchingDetail: false,
      all: res
    }
  },

  [REQUEST_ORDER_CANCEL] (state) {
    return {
      ...state,
      isFetchingDetail: true
    }
  },

  [RECEIVE_ORDER_CANCEL] (state) {
    return {
      ...state,
      isFetchingDetail: false
    }
  },
}, {
  ...detail
})

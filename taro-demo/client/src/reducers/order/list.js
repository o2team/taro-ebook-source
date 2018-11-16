import { handleActions } from 'redux-actions'
import {
  REQUEST_ORDER_LIST,
  RECEIVE_ORDER_LIST
} from '../../constants/order/list'

const list = {
  isFetchingList: false,
  orderList: []
}

export default handleActions({
  [REQUEST_ORDER_LIST] (state) {
    return Object.assign({}, state, {
      isFetchingList: true
    })
  },

  [RECEIVE_ORDER_LIST] (state, action) {
    const data = action.payload
    return Object.assign({}, state, {
      isFetchingList: false,
      orderList: data
    })
  },
}, { ...list })

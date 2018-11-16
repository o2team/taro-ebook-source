import { handleActions } from 'redux-actions'
import {
  REQUEST_DETAIL_CART,
  RECEIVE_DETAIL_CART,
  REQUEST_DETAIL_SKU,
  RECEIVE_DETAIL_SKU,
  REQUEST_DETAIL_ADD_CART,
  RECEIVE_DETAIL_ADD_CART
} from '../constants/detail'

const detailData = {
  sku: {},
  cartInfo: [],
  cartNum: 0,
  isFetching: false
}

export default handleActions({
  [REQUEST_DETAIL_CART](state) {
    return {
      ...state,
      isFetching: true
    }
  },
  [RECEIVE_DETAIL_CART](state, action) {
    const { cartNum } = action.payload
    return {
      ...state,
      cartNum,
      isFetching: false
    }
  },
  [REQUEST_DETAIL_SKU](state) {
    return {
      ...state,
      isFetching: true
    }
  },
  [RECEIVE_DETAIL_SKU](state, action) {
    const sku  = action.payload
    return {
      ...state,
      sku,
      isFetching: false
    }
  },
  [REQUEST_DETAIL_ADD_CART](state) {
    return {
      ...state,
      isFetching: true
    }
  },
  [RECEIVE_DETAIL_ADD_CART](state, action) {
    const { cartNum } = action.payload
    return {
      ...state,
      cartNum,
      isFetching: false
    }
  },
}, {...detailData})

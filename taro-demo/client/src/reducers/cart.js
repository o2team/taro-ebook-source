import { handleActions } from 'redux-actions'
import {
  REQUEST_CART,
  RECEIVE_CART,
  REQUEST_DEL_CART,
  RECEIVE_DEL_CART,
  REQUEST_CHANGE_NUM,
  RECEIVE_CHANGE_NUM,
  REQUEST_ADD_CART,
  RECEIVE_ADD_CART,
  REQUEST_CHECK_CART,
  RECEIVE_CHECK_CART,
  REQUEST_INVERSE_CHECK,
  RECEIVE_INVERSE_CHECK,
  REQUEST_CHANGE_ATTR,
  RECEIVE_CHANGE_ATTR,
  REQUEST_SKU_ATTR,
  RECEIVE_SKU_ATTR,
  CHECK_DEL,
  INVERSE_CHECK_DEL,
  SHOW_ATTR_BOX,
  HIDE_ATTR_BOX,
  CHANGE_EDIT_STATUS
} from '../constants/cart'

const INITIAL_STATE = {
  commoditys: [],
  offSales: [],
  editSkuData: {
    showEidtBox: false
  },
  diviner: [],
  footmark: [],
  couponData: {
    showCouponList: false
  },
  checkCartNum: 0,
  totalPrice: 0,
  checkAll: false,
  checkDelAll: false,
  isEditStatus: false,
  isFetching: false
}

function genarateFetchActions () {
  const actionsMap = {}

  const fetchActionType = [
    REQUEST_CART,
    REQUEST_DEL_CART,
    REQUEST_CHANGE_NUM,
    REQUEST_ADD_CART,
    REQUEST_CHECK_CART,
    REQUEST_INVERSE_CHECK,
    REQUEST_CHANGE_ATTR,
    REQUEST_SKU_ATTR,
  ]

  const receiveActionType = [
    RECEIVE_CART,
    RECEIVE_DEL_CART,
    RECEIVE_CHANGE_NUM,
    RECEIVE_ADD_CART,
    RECEIVE_CHECK_CART,
    RECEIVE_INVERSE_CHECK,
    RECEIVE_CHANGE_ATTR
  ]

  fetchActionType.forEach((type) => {
    actionsMap[type] = function(state){
      return {
        ...state,
        isFetching: true
      }
    }
  })
  receiveActionType.forEach((type) => {
    actionsMap[type] = function (state, action) {
      const {
        commoditys = [],
        offSales = [],
        checkCartNum = 0,
        totalPrice = 0,
        checkAll = false
      } = action.payload

      return {
        ...state,
        commoditys,
        offSales,
        checkCartNum,
        totalPrice,
        checkAll,
        isFetching: false
      }
    }
  })

  return actionsMap
}

export default handleActions({
  ...genarateFetchActions(),
  [CHECK_DEL](state, action) {
    const { commoditys, checkDelAll } = action.payload
    return {
      ...state,
      commoditys,
      checkDelAll
    }
  },
  [INVERSE_CHECK_DEL](state, action) {
    const { commoditys, checkDelAll } = action.payload
    return {
      ...state,
      commoditys,
      checkDelAll
    }
  },
  [RECEIVE_SKU_ATTR](state, action) {
    const { editSkuData } = action.payload
    return {
      ...state,
      editSkuData,
      isFetching: false
    }
  },
  [SHOW_ATTR_BOX](state, action) {
    const { editSkuData } = action.payload
    return {
      ...state,
      editSkuData
    }
  },
  [HIDE_ATTR_BOX](state, action) {
    const { editSkuData } = action.payload
    return {
      ...state,
      editSkuData
    }
  },
  [CHANGE_EDIT_STATUS](state, action) {
    const { isEditStatus } = action.payload
    return {
      ...state,
      isEditStatus
    }
  }
}, { ...INITIAL_STATE })

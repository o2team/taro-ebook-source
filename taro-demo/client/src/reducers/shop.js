import { handleActions } from 'redux-actions'
import {
  REQUEST_SHOP,
  RECEIVE_SHOP,
  RESET_SHOP
} from '../constants/shop'

const INITIAL_STATE = {
  title: '',
  floors: []
}

export default handleActions({
  [REQUEST_SHOP](state) {
    return { ...state }
  },
  [RECEIVE_SHOP](state, action) {
    const data = action.payload
    return {
      ...state,
      ...data
    }
  },
  [RESET_SHOP](state) {
    return {
      title: '',
      floors: []
    }
  }
}, { ...INITIAL_STATE })

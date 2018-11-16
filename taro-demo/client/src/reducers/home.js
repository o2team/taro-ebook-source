import { handleActions } from 'redux-actions'
import {
  REQUEST_HOME,
  RECEIVE_HOME,
  RECEIVE_HOME_ERROR
} from '../constants/home'

const homeData = {
  loading: false,
  floorData: []
}

export default handleActions({
  [REQUEST_HOME] (state) {
    return {
      ...state,
      loading: true
    }
  },
  [RECEIVE_HOME] (state, action) {
    const { data } = action.payload
    return {
      ...state,
      loading: false,
      floorData: data
    }
  },
  [RECEIVE_HOME_ERROR] (state) {
    return {
      ...state
    }
  }
}, {...homeData})

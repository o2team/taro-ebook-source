import { handleActions } from 'redux-actions'

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
const searchData = {
  historyWords: ['品牌', '衣服'],
  hotWords: ['品牌', '衣服'],
  searchResult: {
    wares: []
  },
  loading: false,
  cart: null,
  showSearchBar: true,
  showSearchResult: false,
  showSearchHot: true,
  showSearchHistory: true,
  showErrorProblem: false,
  showNotFind: false  
}
export default handleActions({
  [SHOW_SEARCH_BAR] (state) {  
    return {
      ...state,
      showSearchBar: !state.showSearchBar
    }
  },
  [REQUEST_SEARCH_RESULT] (state, action) { 
    if (state.searchResult.page && state.searchResult.page === 1) {
      state.searchResult = {
        wares: []
      }
    }
    return {
      ...state,
      loading: true,
      showSearchBar: true,
      showSearchResult: true,
      showSearchHot: false,
      showSearchHistory: false,
      showErrorProblem: false,
      showNotFind: false 
    }
  },
  [RECEIVE_SEARCH_RESULT] (state, action) {
    return {
      ...state,
      searchResult: action.payload
    }
  },
  [RECEIVE_SEARCH_ERROR] (state) {  
    return {
      ...state,
      showErrorProblem: true
    }
  },
  [CHANGE_HISTORY] (state, action) { 
    return {
      ...state,
      historyWords: action.payload
    }
  },
  [SHOW_RESULT] (state, action) { 
    let isShow = action.payload
    return {
      ...state,
      showSearchResult: isShow,
      showSearchHot: !isShow,
      showSearchHistory: !isShow
    }
  },
  [SHOW_NOT_FIND] (state) { 
    return {
      ...state,
      showNotFind: true
    }
  },
  [RESET_STATE] () {
    return searchData
  }
}, { ...searchData })

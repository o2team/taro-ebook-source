import { combineReducers } from 'redux'
import detail from './detail'
import home from './home'
import shop from './shop'
import search from './search'
import cart from './cart'
import balance from './balance'

import orderDetail from './order/detail'
import orderList from './order/list'

export default combineReducers({
  detail,
  home,
  shop,
  search,
  orderDetail,
  orderList,
  cart,
  balance
})

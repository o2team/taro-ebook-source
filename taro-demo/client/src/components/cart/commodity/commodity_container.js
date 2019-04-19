import Taro, { Component } from '@tarojs/taro'
import { connect } from '@tarojs/redux'
import { View } from '@tarojs/components'

import Commondity from './commodity'
import {
  fetchCheckCart,
  fetchInvertCheckCart,
  checkDelCart,
  inverseCheckDelCart,
  showEditBox,
  fetchCart,
  fetchChangeCartNum,
  fetchDelCart,
  changeCouponStatus,
  changeEditStatus
} from '../../../actions/cart'

class CommondityContainer extends Component {
  constructor (...args) {
    super(...args)
  }

  render () {
    const {
      isFixedBar,
      commoditys,
      editSkuData,
      isEditStatus,
      isFetching,
      fetchCheckCart,
      fetchInvertCheckCart,
      checkDelCart,
      inverseCheckDelCart,
      showEditBox,
      fetchCart,
      fetchChangeCartNum,
      fetchDelCart,
      changeEditStatus
    } = this.props
    return (
      <View className='commondity_container'>
        <Commondity
          commoditys={commoditys}
          editSkuData={editSkuData}
          isEditStatus={isEditStatus}
          isFetching={isFetching}
          isFixedBar={isFixedBar}
          onFetchCart={fetchCart}
          onFetchCheckCart={fetchCheckCart}
          onFetchInvertCheckCart={fetchInvertCheckCart}
          onCheckDelCart={checkDelCart}
          onInverseCheckDelCart={inverseCheckDelCart}
          onShowEditBox={showEditBox}
          onFetchChangeCartNum={fetchChangeCartNum}
          onFetchDelCart={fetchDelCart}
          onChangeEditStatus={changeEditStatus}
        />
      </View>
    )
  }
}

export default connect(({
  cart
}) => {
  return {
    editSkuData: cart.editSkuData,
    commoditys: cart.commoditys,
    isEditStatus: cart.isEditStatus,
    isFetching: cart.isFetching
  }
}, (dispatch) => ({
  fetchCart (...args) {
    dispatch(fetchCart(...args))
  },
  fetchCheckCart (...args) {
    dispatch(fetchCheckCart(...args))
  },
  fetchInvertCheckCart (...args) {
    dispatch(fetchInvertCheckCart(...args))
  },
  checkDelCart (...args) {
    dispatch(checkDelCart(...args))
  },
  inverseCheckDelCart (...args) {
    dispatch(inverseCheckDelCart(...args))
  },
  showEditBox (...args) {
    dispatch(showEditBox(...args))
  },
  fetchChangeCartNum (...args) {
    dispatch(fetchChangeCartNum(...args))
  },
  fetchDelCart (...args) {
    dispatch(fetchDelCart(...args))
  },
  changeCouponStatus (...args) {
    dispatch(changeCouponStatus(...args))
  },
  changeEditStatus (...args) {
    dispatch(changeEditStatus(...args))
  }
}))(CommondityContainer)

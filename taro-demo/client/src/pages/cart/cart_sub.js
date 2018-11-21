import Taro, { Component } from '@tarojs/taro'
import { View, ScrollView } from '@tarojs/components'
import { connect } from '@tarojs/redux'
import classnames from 'classnames'

import CommondityContainer from '../../components/cart/commodity/commodity_container'
import Goods from '../../components/cart/goods/goods'
import BottomBar from '../../components/cart/bottom_bar/bottom_bar'
import EditBox from '../../components/cart/edit_box/edit_box'

import {
  fetchCart
} from '../../actions/cart'

import { getLoginStatus, throttle, getSystemInfo } from '../../utils/util'

import './cart.scss'

class CartSub extends Component {
  config = {
    navigationBarTitleText: '购物车',
    backgroundColor: '#f2efef',
    disableScroll: true
  }

  constructor () {
    super(...arguments)
    this.state = {
      isLogin: Boolean(getLoginStatus()),
      isFixedBar: false,
      systemInfo: {}
    }

    this.scrollTop = 0
    this.pageScrollFn = throttle(this.isNeedFixedBar, 200, this)
  }

  componentDidShow () {
    const isLogin = Boolean(getLoginStatus())
    this.props.fetchCart()
    this.setState({
      isLogin,
      systemInfo: getSystemInfo()
    })
  }

  onViewScroll = (e) => {
    this.pageScrollFn && this.pageScrollFn(e.detail.scrollTop)
  }

  isNeedFixedBar (top) {
    const {isFixedBar} = this.state
    this.scrollTop = top
    let needTop = 45
    if (top > needTop) {
      !isFixedBar && this.setState({isFixedBar: true})
    } else {
      isFixedBar && this.setState({isFixedBar: false})
    }
  }

  render () {
    const {isLogin, isFixedBar, systemInfo} = this.state
    const {commoditys, editSkuData, isFetching} = this.props

    const showEidtBox = editSkuData.showEidtBox

    const hasCommodity = commoditys.length !== 0

    const cartClass = classnames('cart-scroll', {'no_bottom': !hasCommodity && !isLogin})

    const newSystemInfo = getSystemInfo()

    let windowHeight = systemInfo.windowHeight
    if (newSystemInfo.windowHeight > windowHeight && windowHeight) {
      windowHeight = newSystemInfo.windowHeight
    }

    if (isFetching) {
      Taro.showLoading({title: '请求加载中...'})
    } else {
      Taro.hideLoading()
    }

    return (
      <View className='cart'>
        <ScrollView
          className={cartClass}
          scrollY={!showEidtBox}
          onScroll={this.onViewScroll}
          enable-back-to-top

        >
          <CommondityContainer isLogin={isLogin} isFixedBar={isFixedBar} />
          <Goods isSub />
          {/* <ServiceBox /> */}
        </ScrollView>
        {showEidtBox ? <EditBox /> : null}
        <BottomBar isLogin={isLogin} isSub />
      </View>
    )
  }
}

export default connect((
  {
    cart,
    home
  }) => ({
  floorData: home.floorData || {},
  commoditys: cart.commoditys,
  editSkuData: cart.editSkuData,
  isFetching: cart.isFetching
}), (dispatch) => ({
  fetchCart (...args) {
    dispatch(fetchCart(...args))
  }
}))(CartSub)

import Taro, { Component } from '@tarojs/taro'
import { View, Text, Label, Image } from '@tarojs/components'
import { connect } from '@tarojs/redux'
import classnames from 'classnames'

import {
  fetchCheckCart,
  fetchInvertCheckCart,
  checkDelCart,
  inverseCheckDelCart,
  fetchDelCart,
  changeEditStatus
} from '../../../actions/cart'

import Modal from '../../gb/modal/modal'
import { jumpUrl } from '../../../utils/util'

import './bottom_bar.scss'

class BottomBar extends Component {
  constructor () {
    super(...arguments)
    this.state = {
      showConfirm: false,
      delNum: 0
    }
    this.delSkusArr = []
  }

  checkAllCart = () => {
    const {
      isEditStatus,
      commoditys,
      onFetchCheckCart,
      onFetchInvertCheckCart,
      onCheckDelCart,
      onInverseCheckDelCart,
      checkAll,
      checkDelAll
    } = this.props
    const skusArr = []
    commoditys.forEach(commodity => {
      commodity.skus.forEach(sku => {
        skusArr.push({skuId: sku.skuId})
      })
    })
    if (skusArr.length === 0) return
    if (isEditStatus) {
      checkDelAll ? onInverseCheckDelCart(skusArr) : onCheckDelCart(skusArr)
    } else {
      checkAll ? onFetchInvertCheckCart(skusArr) : onFetchCheckCart(skusArr)
    }
  }

  onHideDelPopup = () => {
    this.setState({showConfirm: false})
  }

  delCart () {
    const {onFetchDelCart, onChangeEditStatus} = this.props
    onFetchDelCart(this.delSkusArr)
    this.setState({showConfirm: false})
    onChangeEditStatus(false)
  }

  handleDelbtn (hasDelCart) {
    if (!hasDelCart) return
    const {commoditys} = this.props
    let delNum = 0
    this.delSkusArr = []
    commoditys.forEach(commodity => {
      commodity.skus.forEach(sku => {
        if (sku.checkDel) {
          delNum++
          this.delSkusArr.push({skuId: sku.skuId})
        }
      })
    })
    this.setState({
      showConfirm: true,
      delNum
    })
  }

  booleanDelCart () {
    const {commoditys = []} = this.props
    let hasDelCart = false
    for (let i = 0; i < commoditys.length; i++) {
      const commodity = commoditys[i]
      for (let j = 0; j < commodity.skus.length; j++) {
        const sku = commodity.skus[j]
        if (sku.checkDel) {
          hasDelCart = true
          break
        }
      }
      if (hasDelCart) break
    }
    return hasDelCart
  }

  gotoBalance = () => {
    const {checkCartNum, isLogin} = this.props
    if (checkCartNum <= 0) return
    if (isLogin) {
      jumpUrl('/pages/balance/balance')
    } else {
      const pages = Taro.getCurrentPages()
      const route = pages[pages.length - 1]
      jumpUrl(`../account/login/login?returnpage=/${route.route}`)
    }
  }

  render () {
    const {
      isLogin,
      isSub,
      isEditStatus,
      checkCartNum,
      totalPrice,
      checkAll,
      checkDelAll,
      commoditys
    } = this.props

    const hasCommodity = commoditys.length !== 0

    const {showConfirm, delNum} = this.state
    const hasDelCart = this.booleanDelCart()
    const bottomClass = classnames('bottom_bar_wp', {'hide': !hasCommodity && !isLogin})
    return (
      <View className={bottomClass} style={isSub ? 'margin-bottom: 0' : ''}>
        {isEditStatus
          ? <View className='bottom_bar del'>
            <View className='bottom_bar_select'>
              <Label className='bottom_bar_select_wp' onClick={this.checkAllCart}>
                <Text className={checkDelAll ? 'select_radio on' : 'select_radio'} />
                {
                  checkDelAll
                    ? <Image className='select_radio_img' src='http://storage.jd.com/o2images/select_icon_on.png' />
                    : <Image className='select_radio_img' src='http://storage.jd.com/o2images/select_icon_off.png' />
                }
                <Text className='select_radio_text' onClick={this.checkAllCart}>全选</Text>
              </Label>
            </View>
            <View
              className={hasDelCart ? 'bottom_bar_btn' : 'bottom_bar_btn del'}
              data-component-className='BottomBar'
              onClick={this.handleDelbtn.bind(this, hasDelCart)}
            >
              <Text className='bottom_bar_text_del'>删除</Text>
            </View>
          </View>
          : <View className='bottom_bar'>
            <View className='bottom_bar_select'>
              <Label className='bottom_bar_select_wp' onClick={this.checkAllCart}>
                <Text className={checkAll ? 'select_radio on' : 'select_radio'} />
                {
                  checkAll
                    ? <Image className='select_radio_img' src='http://storage.jd.com/o2images/select_icon_on.png' />
                    : <Image className='select_radio_img' src='http://storage.jd.com/o2images/select_icon_off.png' />
                }
                <Text className='select_radio_text' onClick={this.checkAllCart}>全选</Text>
              </Label>
            </View>
            <View className='bottom_bar_total'>
              <View className='bottom_bar_total_text'>
                <Text className='bottom_bar_total_text'>共计：</Text>
                <Text className='bottom_bar_total_small'>￥</Text>
                <Text className='bottom_bar_total_big'>{totalPrice}</Text>
              </View>
              <Text className='bottom_bar_total_desc'>不含运费</Text>
            </View>
            <View className={checkCartNum === 0 ? 'bottom_bar_btn bottom_bar_btn_none' : 'bottom_bar_btn'} onClick={this.gotoBalance}>
              <Text onClick={this.gotoBalance} className='bottom_bar_text'>去结算({checkCartNum})</Text>
            </View>
          </View>}
        {showConfirm ?
          <Modal
            title='提示'
            contentText={`是否删除这${delNum}种商品`}
            onCancelCallback={this.onHideDelPopup}
            onConfirmCallback={this.delCart.bind(this)}
          />
          : null}
      </View>
    )
  }
}

export default connect(({
  cart
}) => ({
  commoditys: cart.commoditys,
  checkAll: cart.checkAll,
  checkDelAll: cart.checkDelAll,
  checkCartNum: cart.checkCartNum,
  totalPrice: cart.totalPrice,
  isEditStatus: cart.isEditStatus
}), (dispatch) => ({
  onFetchCheckCart (...args) {
    dispatch(fetchCheckCart(...args))
  },
  onFetchInvertCheckCart (...args) {
    dispatch(fetchInvertCheckCart(...args))
  },
  onCheckDelCart (...args) {
    dispatch(checkDelCart(...args))
  },
  onInverseCheckDelCart (...args) {
    dispatch(inverseCheckDelCart(...args))
  },
  onFetchDelCart (...args) {
    dispatch(fetchDelCart(...args))
  },
  onChangeEditStatus (...args) {
    dispatch(changeEditStatus(...args))
  }
}))(BottomBar)

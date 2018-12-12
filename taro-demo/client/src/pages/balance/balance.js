import Taro, { Component } from '@tarojs/taro'
import { View, Text, Button, ScrollView, Image, Form } from '@tarojs/components'
import { connect } from '@tarojs/redux'

import './balance.scss'

import { jumpUrl } from '../../utils/util'
import { getGlobalData, setGlobalData } from '../../constants/globalData'
import { fetchBalanceData, fetchGenerateOrder } from '../../actions/balance'

import Express from '../../components/balance/express'
import GoodList from '../../components/balance/good_list'
import Modal from '../../components/gb/modal/modal'

class Balance extends Component {
  config = {
    navigationBarTitleText: '确认订单',
    disableScroll: true
  }

  defaultProps = {}

  constructor () {
    super(...arguments)
    this.currentScrollTop = 0
    this.state = {
      reachTop: true,
      showTip: true,
      showPayWay: false,
      aniShowPayWay: false,
      payWay: 0, // 在线支付：0；货到付款：1
      noStockSkuList: null,
      paymentType: 4,
      isShowUserAuth: false,
      isShowUserAuthModal: false
    }
  }

  componentWillMount () {
    this.firstIn = true
    const userData = getGlobalData('userData')
    if (Taro.getEnv() === 'WEB') return
    if (!userData) {
      this.setState({
        isShowUserAuth: true
      })
    }
  }

  componentDidShow () {
    this.props.fetchBalanceInfo()
  }

  componentDidUpdate (nextProps) {
    const {isNeedBanlance} = nextProps
    if (!isNeedBanlance) {
      this.backToCart()
    }
  }

  onPageScroll (e) {
    if (!e.scrollTop && !this.state.reachTop) {
      this.setState({
        reachTop: true
      })
      return
    }
    if (this.state.reachTop) {
      this.setState({
        reachTop: false
      })
    }
  }

  closeTip = () => {
    let {showTip} = this.state
    this.setState({
      showTip: !showTip
    })
  }

  showPayWayBox () {
    if (!this.state.showPayWay) {
      this.setState({
        showPayWay: true,
        aniShowPayWay: true
      })
    }
  }

  closePayWay () {
    this.setState({
      showPayWay: false
    })
  }

  checkPayWay (payWay) {
    this.setState({
      paymentType: payWay
    })
  }

  submitOrder = () => {
    console.log('submitOrder')
    const {freightPrice} = this.props
    const {paymentType} = this.state
    this.props.fetchGenerateOrder(freightPrice, paymentType, this.submitOrderCb)
  }

  submitOrderCb = (data) => {
    const orderId = data.data.orderId
    jumpUrl(`/pages/user/order/detail/detail?orderId=${orderId}`)
  }

  navigateTo (page) {
    let url = `../${page}/${page}`
    jumpUrl(url, {method: 'navigateToByForce'})
  }

  showUserAuthModal = () => {
    console.log('showUserAuthModal')
    this.setState({
      isShowUserAuthModal: true
    })
  }

  onHideUserAuthModal = () => {
    this.setState({
      isShowUserAuthModal: false
    })
  }

  onProcessAuthResult = userData => {
    this.setState({
      isShowUserAuthModal: false
    })
    if (userData.userInfo) {
      setGlobalData('userData', userData)
      this.setState({
        isShowUserAuth: false
      })
    }
  }

  backToCart () {
    Taro.redirectTo({url: '../cart/cart_sub'})
  }

  onAnimationEnd () {
    if (!this.state.showPayWay) {
      this.setState({
        aniShowPayWay: false
      })
    }
  }

  render () {
    const {
      paymentType,
      reachTop,
      showTip,
      aniShowPayWay,
      showPayWay,
      isShowUserAuth,
      isShowUserAuthModal
    } = this.state

    let {payCommodities, freightPrice, totalPrice, payNum, allPrice} = this.props

    return (
      <View className='balance_page'>
        {
          showTip &&
          <View className='balance_tip'>
            <Text className='balance_tip_text'>温馨提示：订单中包含不支持7天无理由退货的商品，请确认相关商品信息后提交订单</Text>
            <View className='balance_tip_close' onClick={this.closeTip}>
              <Image className='balance_tip_close_image' src='https://static.360buyimg.com/tp-statics/2018-4-20/m/img/ic_close1@2x.png' />
            </View>
          </View>
        }
        <ScrollView className='balance' scrollY>
          <View className='balance_good'>
            <View className='balance_tit'>
              <Text className='balance_tit_text'>商品与配送</Text>
            </View>
            <Express freightPrice={freightPrice} />
            <GoodList payCommodities={payCommodities} />
          </View>
          <View className='balance_pay'>
            <View className='balance_tit'>
              <Text className='balance_tit_text'>支付信息</Text>
            </View>
            <View className='balance_box'>
              <View
                className='balance_pay_info balance_pay_way'
                onClick={this.showPayWayBox}
              >
                <Text className='balance_pay_info_label'>支付</Text>
                <Text className='balance_pay'>{paymentType === 4 ? '微信支付' : '货到付款'}</Text>
                <View className='arrow' />
              </View>
              <View className='balance_pay_info balance_pay_coupon'>
                <Text className='balance_pay_info_label'>优惠券</Text>
                <Text className='coupon_val balance_pay'>无可用</Text>
                <View className='arrow' />
              </View>
              <View className='balance_pay_info balance_pay_invoice'>
                <Text className='balance_pay_info_label'>发票</Text>
                <Text className='balance_pay_info_val balance_pay'>个人-商品明细</Text>
                <View className='arrow' />
              </View>
            </View>
          </View>
          <View className='balance_amount'>
            <View className='balance_tit'>
              <Text className='balance_tit_text'>订单金额</Text>
            </View>
            <View className='balance_box'>
              <View className='balance_amount_info'>
                <Text className='label balance_grey'>商品金额：</Text>
                <Text className='val balance_grey'>+￥{totalPrice}</Text>
              </View>
              <View className='balance_amount_info'>
                <Text className='label balance_grey'>运费：</Text>
                <Text className='val balance_grey'>+￥{freightPrice}</Text>
              </View>
              <View className='balance_slice' />
              <Text className='balance_amount_total'>合计：¥{allPrice && <Text>{allPrice}</Text>}</Text>
            </View>
          </View>
          {/*<View className={reachTop ? 'balance_addr top' : 'balance_addr'}>*/}
          {/*<View className='balance_addr_icon' />*/}
          {/*<Text className='balance_addr_text'>广东省深圳市宝安区龙光世纪大厦</Text>*/}
          {/*</View>*/}
          {
            aniShowPayWay &&
            <View className={showPayWay ? 'balance_pay_choose show' : 'balance_pay_choose'}>
              <View className='mask' onAnimationEnd={this.onAnimationEnd} />
              <View className='main'>
                <View className='choose_main'>
                  <View className='close_wrap'>
                    <View className='icon_close' onClick={this.closePayWay} />
                  </View>
                  <Text className={(paymentType === 4) ? 'method checked' : 'method'} onClick={this.checkPayWay.bind(this, 4)}>微信支付</Text>
                  <Text className={(paymentType === 1) ? 'method checked' : 'method'} onClick={this.checkPayWay.bind(this, 1)}>货到付款</Text>
                </View>
                <Text className='btn_close' onClick={this.closePayWay}>关闭</Text>
              </View>
            </View>
          }
          {
            isShowUserAuthModal &&
            <Modal
              title='授权提示'
              contentText='TARO商城请求获取授权信息，以便记录您的订单'
              cancelCallback={this.onHideUserAuthModal.bind(this)}
              confirmCallback={this.onProcessAuthResult.bind(this)}
              isAuth
            />
          }
        </ScrollView>
        <View className='balance_footer'>
          <View className='balance_footer_info'>
            <Text className='balance_footer_info_text'>
              <Text>共计：</Text>
              <Text className='yan'>¥</Text>
              <Text className='money'>{allPrice}</Text>
            </Text>
            <Text className='balance_footer_info_text'>共{payNum && <Text className='num'>{payNum}</Text>}件商品</Text>
          </View>
          <View onClick={this.submitOrder} reportSubmit='true' className='balance_footer_btn'>
            {(paymentType === 4 || !paymentType) ? isShowUserAuth ? (
              <View className='balance_footer_btn' onClick={this.showUserAuthModal}>
                <Text className='balance_footer_btn_text'>微信支付</Text>
              </View>
            ) : (
              <View className='balance_footer_btn' formType='submit'>
                <Text className='balance_footer_btn_text'>微信支付</Text>
              </View>
            ) : (
              <View className='balance_footer_btn' formType='submit'>货到付款</View>
            )}
          </View>
        </View>
      </View>
    )
  }
}

export default connect(({balance}) => ({
  isNeedBanlance: balance.isNeedBanlance,
  payCommodities: balance.payCommodities,
  freightPrice: balance.freightPrice,
  totalPrice: balance.totalPrice,
  allPrice: balance.allPrice,
  payNum: balance.payNum,
  isFetching: balance.isFetching
}), (dispatch) => ({
  fetchBalanceInfo () {
    dispatch(fetchBalanceData())
  },
  fetchGenerateOrder (...args) {
    dispatch(fetchGenerateOrder(...args))
  }
}))(Balance)

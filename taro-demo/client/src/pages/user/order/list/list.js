import Taro, { Component } from '@tarojs/taro'
import { View, Button, Image, Text, Form } from '@tarojs/components'
import { connect } from '@tarojs/redux'

import Modal from '../../../../components/gb/modal/modal'

import { fetchOrderList } from '../../../../actions/order'
import { getGlobalData, setGlobalData } from '../../../../constants/globalData'
import { goLogin, jumpUrl } from '../../../../utils/util'
import orderLoading from '../../../../asset/order_loading.gif'
import icSearchTips from '../../../../asset/ic_search_tips.png'

import './list.scss'

@connect(({orderList}) => ({
  orderList: orderList.orderList
}), dispatch => ({
  fetchOrderList (callback) {
    dispatch(fetchOrderList(callback))
  }
}))
class OrderList extends Component {
  config = {
    navigationBarTitleText: '订单中心',
    enablePullDownRefresh: true,
    backgroundTextStyle: 'dark'
  }

  constructor () {
    super(...arguments)
    this.state = {
      userInfo: null,
      page: 1,
      pageSize: 10,
      isFirst: true,
      isShowUserAuth: false,
      isShowUserAuthModal: false
    }
  }

  gotoLogin () {
    goLogin({
      fromPageType: 'switchTab'
    })
  }

  gotoCoupon () {
    jumpUrl('../../../coupon/coupon')
  }

  gotoBrand (venderId) {
    if (venderId) {
      jumpUrl(`/pages/shop/shop?venderId=${venderId}`)
    }
  }

  gotoDetail (orderId) {
    jumpUrl(`/pages/user/order/detail/detail?orderId=${orderId}`)
  }

  gotoHome () {
    Taro.switchTab({
      url: '/pages/index/index'
    })
  }

  showUserAuthModal = () => {
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

  componentWillMount () {
    const userData = getGlobalData('userData')
    let isShowUserAuth = false
    if (Taro.getEnv() === 'WEB') return
    if (!userData) {
      isShowUserAuth = true
    }
    this.setState({
      isShowUserAuth
    })
  }

  componentDidShow () {
    this.initFetchData()
  }

  initFetchData () {
    const {fetchOrderList} = this.props
    const userData = getGlobalData('userData')
    const userInfo = userData && userData.userInfo
    this.setState({
      userInfo,
      page: 1
    })
    fetchOrderList()
  }

  payOrder () {
    Taro.showToast({
      title: '你触发了去支付',
      duration: 2000
    })
  }

  onPullDownRefresh () {
    this.initFetchData()
    Taro.stopPullDownRefresh()
  }

  render () {
    const {isFirst, isShowUserAuthModal, isShowUserAuth} = this.state
    const {orderList} = this.props
    return (
      <View className='orders'>
        <View className='orders_list'>
          {(orderList && orderList.length > 0) ? orderList.map((item, index) => {
            return (
              <View className='orders_item' key={index}>
                <View className='orders_item_hd' onClick={this.gotoBrand.bind(this, item.shopInfo.venderId)}>
                  <View className='orders_item_avatar'>
                    <Image src={'http:' + item.shopInfo.thumbnail} mode='aspectFit' className='orders_item_avatar_img' lazyLoad />
                  </View>
                  <View className='orders_item_shop'>
                    <Text className='orders_item_shop_name'>{item.shopInfo.title}&nbsp;</Text>
                    <Text className={item.statusClassName}>{item.orderStateStr}</Text>
                  </View>
                  {item.shopInfo.venderId && <Text className='orders_arrow'>{'>'}</Text>}
                </View>
                {item.isMulti ? (<View className='orders_item_bd orders_item_bd_multi' onClick={this.gotoDetail.bind(this, item.orderId)}>
                  {item.skuInfoList.map(sku => {
                    return (
                      <View className='orders_item_sku' key={sku.skuId}>
                        <Image src={sku.info.images[0]} mode='aspectFill' className='orders_item_sku_img' lazyLoad />
                      </View>
                    )
                  })}
                  <View className='orders_item_count'>
                    <Text className='fontSize24 grey'>共</Text>
                    <Text className='fontSize24 orders_item_count_txt'>{item.totalGoodsCount}</Text>
                    <Text className='fontSize24 grey'>件</Text>
                  </View>
                  <Text className='orders_arrow'>{'>'}</Text>
                </View>) : (<View className='orders_item_bd' onClick={this.gotoDetail.bind(this, item.orderId)}>
                  <View className='orders_item_sku'>
                    <Image src={item.skuItem.info.images[0]} mode='aspectFill' className='orders_item_sku_img' lazyLoad />
                  </View>
                  <View className='orders_item_info'>
                    <Text className='orders_item_info_tit'>{item.skuItem.info.skuName}</Text>
                    <View className='orders_item_info_attr'>
                      {item.skuItem.info.colorInfo.value &&
                      <Text className='orders_item_info_attr_txt'>{item.skuItem.info.colorInfo.name}：{item.skuItem.info.colorInfo.value}</Text>}
                      {item.skuItem.info.sizeInfo.value &&
                      <Text className='orders_item_info_attr_txt'>{item.skuItem.info.sizeInfo.name}：{item.skuItem.info.sizeInfo.value}</Text>}
                    </View>
                    <Text className='orders_item_info_tip'>支持7天无理由退换</Text>
                    <View className='orders_item_info_buy'>
                      <View className='orders_item_info_price'>
                        <Text className='orders_item_symbol'>￥</Text>
                        <Text className='orders_item_info_price_txt'>{item.skuItem.info.price}</Text>
                      </View>
                      <Text className='orders_item_info_count'>X{item.skuItem.num}</Text>
                    </View>
                  </View>
                </View>)}
                <View className='orders_item_ft'>
                  <View className='orders_item_total'>
                    <Text>支付金额：</Text>
                    <Text className='orders_item_symbol'>￥</Text>
                    <Text className='orders_item_total_price'>{item.shouldPayPrice}</Text>
                  </View>
                  {item.orderState === 1 && <View className='orders_item_op'>
                    {
                      !isShowUserAuth
                        ? <Text className='orders_item_btn' onClick={this.payOrder.bind(this, item)}>去支付</Text>
                        : <Text className='orders_item_btn' onClick={this.showUserAuthModal}>去支付</Text>
                    }
                  </View>}
                </View>
              </View>
            )
          }) : <View className='orders_list_none'>
            <Image src={icSearchTips} className='orders_list_none_img' />
            <View className='orders_list_none_tip'>
              <Text className='orders_list_none_tip_tit'>很抱歉</Text>
              <Text className='orders_list_none_tip_txt'>没有相关订单</Text>
            </View>
            <Text className='orders_list_none_btn' onClick={this.gotoHome}>去首页逛逛</Text>
          </View>}
          {
            (orderList.isFetchingList && !isFirst) &&
            <View className='orders_list_loading'>
              <Image className='orders_list_loading_img' src={orderLoading} />
            </View>
          }
          {(orderList && orderList.length) && <Text className='orders_list_end'>已加载完毕</Text>}
        </View>
        {
          isShowUserAuthModal &&
          <Modal
            title='授权提示'
            contentText='TOPLIFE请求获取授权信息，以便记录您的订单'
            onCancelCallback={this.onHideUserAuthModal.bind(this)}
            onConfirmCallback={this.onProcessAuthResult.bind(this)}
            isAuth
          />
        }
      </View>
    )
  }
}

export default OrderList

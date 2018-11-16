import Taro, { Component } from '@tarojs/taro'
import { View, Image, Swiper, SwiperItem, ScrollView, Text } from '@tarojs/components'
import { connect } from '@tarojs/redux'
import { jumpUrl, getSystemInfo, queryStringToJson } from '../../utils/util'
import { SEARCH_BAR_MORE_IMAGE } from '../../constants/images'

import { fetchShopData, resetShopData } from '../../actions/shop'

import SearchInto from '../../components/search/searchInto'
import './shop.scss'

class Shop extends Component {
  config = {
    navigationBarTitleText: '',
    enablePullDownRefresh: false,
    disableScroll: true
  }

  constructor () {
    super(...arguments)
    this.state = {
      isFirst: true,
      params: {},
      showMore: false
    }
  }

  async componentWillMount () {
    const params = (this.$router || this.context.$router).params
    let venderId = params.venderId || '182324'
    const scene = decodeURIComponent(params.scene)
    if (scene) {
      const sceneParams = queryStringToJson(scene)
      if (sceneParams.venderId) {
        venderId = sceneParams.venderId
      }
    }
    this.setState({params: {venderId: venderId}, isFirst: true})
  }

  async componentDidMount () {
    await this.props.fetchShopData({venderId: this.state.params.venderId})
    this.setState({
      showMore: false,
      isFirst: false
    })
    Taro.setNavigationBarTitle({
      title: this.props.shop.title
    })
  }

  onShareAppMessage () {
    return {
      // title,
      path: '/pages/shop/shop?venderId=' + this.state.params.venderId,
      success: function () {
        Taro.showToast({
          title: '转发成功！',
          icon: 'success'
        })
      },
      fail: function () {
        Taro.showToast({
          title: '转发失败！',
          icon: 'none'
        })
      }
    }
  }

  // 显示more
  toggleShowMore = () => {
    this.setState({showMore: !this.state.showMore})
  }

  // more里的联系客服
  connectService () {
    Taro.makePhoneCall({
      phoneNumber: '4006563355' //仅为示例，并非真实的电话号码
    })
  }

  onGotoDetail = (skuId) => {
    jumpUrl(`/pages/detail/detail?skuId=${skuId}`)
  }

  onGotoPage = (pages) => {
    if (pages === 'index') {
      this.setState({
        showMore: false
      })
      if (process.env.TARO_ENV === 'weapp') {
        Taro.switchTab({
          url: '/pages/index/index'
        })
      } else {
        jumpUrl('/pages/index/index')
      }
    } else if (pages === 'cart') {
      jumpUrl('/pages/cart/cart_sub')
    }
  }

  render () {
    const {isFirst} = this.state
    const {banner = [], floors = [], venderId} = this.props.shop
    const isIphonex = getSystemInfo().isIpx
    const isScroll = true
    return !isFirst && (
      <View className='shop_nocate' style={isIphonex ? 'padding-bottom: 164rpx;' : ''}>
        <View className='topbar'>
          <SearchInto cls='small search_into' placeholder='搜索店铺内商品' type='shop' venderId={venderId} />
          <View className='topbar_search_action'>
            <View className='topbar_search_more' onClick={this.toggleShowMore}>
              <Image className='topbar_search_icon topbar_search_icon_more' src={SEARCH_BAR_MORE_IMAGE} />
              {this.state.showMore && <View className='topbar_search_more_container'>
                <View className='topbar_search_more_container-inner'>
                  <View className='topbar_search_more_connect' onClick={this.connectService}>联系客服</View>
                  <View className='topbar_search_more_tohome' onClick={this.onGotoPage.bind(this, 'index')}>回到首页</View>
                  <View className='topbar_search_more_tocart' onClick={this.onGotoPage.bind(this, 'cart')}>购物车</View>
                </View>
              </View>}
            </View>
            {this.state.showMore && <View className='mask' onClick={this.toggleShowMore} />}
          </View>
        </View>
        <ScrollView scrollY={isScroll} className='shop_main-scroll'>
          <Swiper
            className='shop_main_swiper'
            indicatorDots
            indicatorColor='#ddd'
            indicatorActiveColor='#232323'
            current={0}
            interval='3000'
            duration='300'
            circular
            autoplay
          >
            {
              banner.map((item, index) => {
                console.log(item)
                return <SwiperItem key={index}>
                  <Image src={item} mode='widthFix' className='shop_main_swiper_item_image' />
                </SwiperItem>
              })}
          </Swiper>
          <View className='shop_floor'>
            {floors.map((floor, index) => {
              return <View key={index} className='shop_floor_item'>
                <View className='shop_floor_title'>
                  <Image className='shop_floor_title_img' src={'http:' + floor.title} mode='widthFix' />
                </View>
                {floor.desc && <View className='shop_floor_desc'>
                  <Image className='shop_floor_desc_img' src={floor.desc} mode='widthFix' />
                </View>}
                {floor.commodities.map((item, index) => {
                  return <View key={index} className='goods_item' onClick={this.onGotoDetail.bind(null, item.skuId)}>
                    <View className='goods_img'>
                      <Image className='goods_img_image' src={item.images[0]} mode='widthFix' lazyLoad />
                    </View>
                    <View className='goods_info'>
                      <Text className='goods_name' onClick={this.onGotoDetail.bind(null, item.skuId)}>{item.skuName}</Text>
                      <Text className='goods_price goods_price_new'>￥{item.price}</Text>
                    </View>
                  </View>
                })}
              </View>
            })}
          </View>
        </ScrollView>
      </View>
    )
  }
}

export default connect(({shop}) => ({
  shop
}), dispatch => ({
  async fetchShopData (data) {
    await dispatch(fetchShopData(data))
  },
  resetShopData (params) {
    dispatch(resetShopData(params))
  }
}))(Shop)

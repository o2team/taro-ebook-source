import Taro, { Component } from '@tarojs/taro'
import { Swiper, SwiperItem, View, Text, Button, Image, ScrollView, Label } from '@tarojs/components'
import { connect } from '@tarojs/redux'
import { jumpUrl, getSystemInfo } from '../../utils/util'
import { fetchAddCart, fetchSkuData, fetchCart } from '../../actions/detail'
import bagImage from './bag.png'

import './detail.scss'

class Detail extends Component {
  config = {
    navigationBarTitleText: '商品详情',
    enablePullDownRefresh: false,
    disableScroll: true
  }

  constructor () {
    super(...arguments)
    this.state = {
      detailInfoRow: [
        {
          name: 'desc',
          title: '商品描述',
          show: true,
          open: true
        },
        {
          name: 'size',
          title: '尺寸说明',
          show: true,
          open: false
        },
        {
          name: 'service',
          title: '服务说明',
          show: true,
          open: false
        }
      ],
      isFirst: true,
      isShowCartLayer: false,
      systemInfo: {},
      skuId: '',
      areaId: '1-72-4137-0',
      areasName: '深圳市宝安区龙光世纪大厦',
      showAddress: false,
      isIpx: false,
      showMore: false,
      showColorValue: '',
      showSizeValue: ''
    }
  }

  async componentDidMount () {
    const params = this.$router.params

    const systemInfo = getSystemInfo()
    this.setState({
      isFirst: false,
      isIpx: systemInfo.isIpx,
      systemInfo: systemInfo
    })
    console.log(params, this.props)
    const skuId = params.skuId || params.skuid || '1'
    Taro.showNavigationBarLoading()
    await Promise.all[this.props.fetchSkuData(skuId), this.props.fetchCart()]
    Taro.hideNavigationBarLoading()
  }

  componentWillUnmount () {
    this.setState({
      isShowCartLayer: false,
      showMore: false,
      detailInfoRow: [
        {
          name: 'desc',
          title: '商品描述',
          show: true,
          open: true
        },
        {
          name: 'editor',
          title: '编辑笔记',
          show: true,
          open: false
        },
        {
          name: 'size',
          title: '尺寸说明',
          show: true,
          open: false
        },
        {
          name: 'service',
          title: '服务说明',
          show: true,
          open: false
        }
      ]
    })
  }

  toggleFold = (idx) => {
    const {detailInfoRow} = this.state
    detailInfoRow[idx].open = !detailInfoRow[idx].open
    const newDetailInfoRow = detailInfoRow
    this.setState({
      detailInfoRow: newDetailInfoRow
    })
  }

  toggleDetailLayer = () => {
    this.setState({isShowCartLayer: !this.state.isShowCartLayer})
  }

  toggleShowMore = () => {
    this.setState({showMore: !this.state.showMore})
  }

  changeAttr = (type, value) => {
    if (type === 'color') {
      this.setState({showColorValue: value})
    } else if (type === 'size') {
      this.setState({showSizeValue: value})
    }
  }

  addToCart = () => {
    const {fetchAddCart, sku} = this.props
    const {showColorValue, showSizeValue} = this.state
    const newSku = [
      {
        skuId: sku.skuId,
        num: 1,
        color: showColorValue || sku.colorInfo.value,
        size: showSizeValue || sku.sizeInfo.value
      }]

    fetchAddCart(newSku)

    this.setState({isShowCartLayer: false})
  }

  // more里的联系客服
  connectService () {
    Taro.makePhoneCall({
      phoneNumber: '4006563355' //仅为示例，并非真实的电话号码
    })
  }

  // 跳转去购物车
  toCartTab = () => {
    jumpUrl('/pages/cart/cart_sub')
  }

  gotoIndex () {
    if (process.env.TARO_ENV === 'weapp') {
      Taro.switchTab({
        url: '/pages/index/index'
      })
    } else {
      jumpUrl('/pages/index/index')
    }
  }

  toShop = (e) => {
    let url = '/pages/shop/shop?venderId=' + e.currentTarget.dataset.venderid
    jumpUrl(url)
  }

  stopTouchMove = (e) => {
    if (this.state.isShowCartLayer) {
      e.stopPropagation()
    }
  }

  render () {
    const {
      isFirst,
      isIpx,
      detailInfoRow,
      isShowCartLayer,
      serviceInfo,
      systemInfo,
      showColorValue,
      showSizeValue
    } = this.state
    const {sku, cartNum} = this.props
    const {colorInfo = {}, sizeInfo = {}} = sku

    const colorValue = showColorValue || colorInfo.value
    const sizeValue = showSizeValue || sizeInfo.value

    return !isFirst && (
      <View className='detail'>
        <ScrollView
          className='detail-scroll-view'
          scrollY={!this.state.isShowCartLayer}
          enable-back-to-top
        >
          <View className='detail_more'>
            {this.state.showMore && <View className='detail_more_in'>
              <View className='detail_more_connect' onClick={this.connectService}>联系客服</View>
              <View className='detail_more_home' onClick={this.gotoIndex}>回到首页</View>
            </View>}
            {this.state.showMore ?
              <View className='detail_more_icon detail_more_icon_arrow' onClick={this.toggleShowMore} /> :
              <View className='detail_more_icon' onClick={this.toggleShowMore} />}
          </View>
          <View className={isIpx ? 'detail_swiper_wrap detail_swiper_wrap_ipx' : 'detail_swiper_wrap'}>
            {sku.images &&
            <Swiper
              className='detail_swiper'
              indicatorDots
              indicatorColor='#ddd'
              indicatorActiveColor='#232323'
              current={0}
              interval='3000'
              duration='300'
              circular
              onChange={this.swpierChange}
            >
              {sku.images && sku.images.map((item, index) => {
                return <SwiperItem key={index} className='detail_swiper_item'>
                  <Image src={item} mode='widthFix' />
                </SwiperItem>
              })}
            </Swiper>
            }
          </View>
          <View className='detail_info'>
            <Text className='detail_info_brand'>{sku.name}</Text>
            <Text className='detail_info_name'>{sku.skuName}</Text>
            <View className='detail_info_price'>
              <Text className='detail_info_price_yen'>&yen;</Text>
              <Text className='detail_info_price_num'>{sku.price}</Text>
              <Text className='detail_info_price_yen detail_info_price_yend'>&yen;</Text>
              <Text className='detail_info_price_num detail_info_price_numd'>{sku.price}</Text>
            </View>
          </View>
          {
            detailInfoRow.map((item, idx) => {
              return (
                <View key={idx} className='detail_intro'>
                  {item.show && <View className={'detail_intro_row ' + item.name}>
                    <View className='detail_intro_hd' data-id={item.name} onClick={this.toggleFold.bind(this, idx)}>
                      <Text className='detail_intro_title' onClick={this.toggleFold.bind(this, idx)}>
                        {item.title}
                      </Text>
                      <Text className='detail_intro_title_icon'>
                        {item.open ? '-' : '+'}
                      </Text>
                    </View>
                    {item.open && idx < 2 && <View className='detail_intro_bd'>
                      <Image className='detail_intro_bd_img' src={sku.desc && 'http:' + sku.desc[idx].image} mode='widthFix' />
                    </View>}
                    {item.open && idx === 2 && <View className='detail_intro_bd'>
                      <View className='intro_service_item'>
                        <View className='intro_service_icon'>
                          <Image
                            className='intro_service_icon'
                            src='http://img14.360buyimg.com/ling/jfs/t17515/311/2405758638/2591/df64fd95/5af2619eN15039577.png'
                          />
                        </View>
                        <View className='intro_service_des'>
                          <Text className='intro_service_des_title'>店铺发货&amp;售后</Text>
                          {
                            serviceInfo && <View className='intro_service_des_text'>
                              <Text>{serviceInfo}</Text>
                            </View>
                          }
                        </View>
                      </View>
                      <View className='intro_service_item'>
                        <View className='intro_service_icon'>
                          <Image
                            className='intro_service_icon'
                            src='http://img20.360buyimg.com/ling/jfs/t19648/157/2365710951/2848/32543afe/5af26187Nfbebc808.png'
                          />
                        </View>
                        <View className='intro_service_des'>
                          <Text className='intro_service_des_title'>货到付款</Text>
                          <Text className='intro_service_des_text'>支持送货上门后再收款，支持现金、pos机刷卡等方式</Text>
                        </View>
                      </View>
                      <View className='intro_service_item' onClick={this.gotoAfterSale}>
                        <View className='intro_service_icon'>
                          <Image
                            className='intro_service_icon'
                            src='http://img30.360buyimg.com/ling/jfs/t18313/49/2358999676/2631/ebfad833/5af2618eNb6da904a.png'
                          />
                        </View>
                        <View className='intro_service_des'>
                          <Text className='intro_service_des_title'>七天退换</Text>
                          <Text className='intro_service_des_text'>支持七天无理由退换</Text>
                        </View>
                      </View>
                    </View>}
                  </View>}
                </View>
              )
            })
          }
          <View className='detail_no_more'>
            <Text className='detail_no_more_in'>
              没有更多内容了
            </Text>
          </View>
        </ScrollView>
        {
          isShowCartLayer &&
          <View className='dlayer'>
            <View className='dlayer_mask' onClick={this.toggleDetailLayer} onTouchMove={this.stopTouchMove} />
            <View className='dlayer_info'>
              <Text className='dlayer_close' onClick={this.toggleDetailLayer}>X</Text>
              <View className='dlayer_info_good' onTouchMove={this.stopTouchMove}>
                <View className='dlayer_info_sku'>
                  <Image className='dlayer_info_sku_img' src={sku.images[0]} mode='aspectFit' />
                </View>
                <View className='dlayer_info_pn'>
                  <View className='dlayer_info_price'>
                    <Text className='yen'>&yen;&nbsp;</Text>
                    <Text className='price'>{sku.price}</Text>
                  </View>
                  <Text className='dlayer_info_nu'>商品编号：{sku.skuId}</Text>
                </View>
              </View>
              <View className='dlayer_summary'>
                <View className='summary_row summary_address' onClick={this.selecteAddress}>
                  <View className='summary_row_in flex_row'>
                    <Text className='summary_row_tit'>送至：</Text>
                    <Text className='summary_row_cont'>{this.state.areasName}</Text>
                  </View>
                  <View className='summary_row_in flex_row paddingTop22'>
                    <Text className='summary_row_tit'>运费：</Text>
                    <Text className='summary_row_cont'>&yen;14</Text>
                  </View>
                </View>
                <View className='placeholder'>
                </View>
              </View>
              <View className='summary_row summary_color'>
                <View className='summary_row_in'>
                  <Text className='summary_row_tit'>{sku.colorInfo.name}：</Text>
                  <View className='summary_row_cont paddingTop22'>
                    <View className='radiogroup'>
                      {sku.colorInfo.all.map((prop, index) => {
                        return (
                          <Text
                            key={index}
                            className={prop === colorValue ? 'summary_row_cont_label label_active' : 'summary_row_cont_label'}
                            onClick={this.changeAttr.bind(null, 'color', prop)}
                          >
                            {prop}
                          </Text>
                        )
                      })}
                    </View>
                  </View>
                </View>
              </View>
              <View className='summary_row summary_size'>
                <View className='summary_row_in'>
                  <Text className='summary_row_tit'>{sku.sizeInfo.name}：</Text>
                  <View className='summary_row_cont paddingTop22'>
                    <View className='radiogroup'>
                      {sku.sizeInfo.all.map((prop, index) => {
                        return (
                          <Text
                            key={index}
                            className={prop === sizeValue ? 'summary_row_cont_label label_active' : 'summary_row_cont_label'}
                            onClick={this.changeAttr.bind(null, 'size', prop)}
                          >
                            {prop}
                          </Text>)
                      })}
                    </View>
                  </View>
                </View>
              </View>
              <View className='placeholder' />
              <View className='dlayer_btn_addcart' onClick={this.addToCart}>
                <Text className='dlayer_btn_addcart_text' onClick={this.addToCart}>确定</Text>
              </View>
            </View>
          </View>
        }
        <View className='dlayer_action'>
          <View className='dlayer_bag' onClick={this.toCartTab}>
            <Image
              overlayColor='white'
              className='dlayer_bag-image'
              src={bagImage}
              widthFix
            />
            {cartNum > 0 && <View className='dlayer_bag_num'><Text className='dlayer_bag_num_text'>{cartNum > 99 ? '99+' : cartNum}</Text></View>}
          </View>
          <View className='dlayer_btn_addcart' onClick={this.toggleDetailLayer}>
            <Text className='dlayer_btn_addcart_text' onClick={this.toggleDetailLayer}>加入购物车</Text>
          </View>
        </View>
      </View>
    )
  }
}

export default connect(({
  detail
}) => ({
  isFetching: detail.isFetching,
  sku: detail.sku,
  cartInfo: detail.cartInfo,
  cartNum: detail.cartNum
}), (dispatch) => ({
  fetchSkuData (...args) {
    dispatch(fetchSkuData(...args))
  },
  fetchCart (...args) {
    dispatch(fetchCart(...args))
  },
  fetchAddCart (...args) {
    dispatch(fetchAddCart(...args))
  }
}))(Detail)

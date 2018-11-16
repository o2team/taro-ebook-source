import Taro, { Component } from '@tarojs/taro'
import { View, Text, Image } from '@tarojs/components'
import { connect } from '@tarojs/redux'

import {
  fetchDiviner
} from '../../../actions/cart'

import { jumpUrl, log } from '../../../utils/util'
import './goods.scss'

class Goods extends Component {
  constructor () {
    super(...arguments)
    this.state = {
      showDiviner: true
    }
  }

  tabHandle = (type) => {
    if (type === 'diviner') {
      if (!this.state.showDiviner) this.setState({showDiviner: true})
    } else {
      if (this.state.showDiviner) this.setState({showDiviner: false})
    }
  }

  componentWillMount () {}

  gotoDetail = (skuId, e) => {
    jumpUrl(`../detail/detail?skuId=${skuId}`)
    log.autoClick(e)
  }

  render () {
    const { footmark, isSub } = this.props
    const hasNofootmark = !footmark || footmark.length === 0
    return (
      <View className='goods_wp'>
        <View className='goods'>
          <View className='goods_tab'>
            <View className='goods_tab_item on'>
              <Image className='goods_tab_icon' src='http://storage.jd.com/o2images/history_icon_on.png' />
              <Text>最近浏览</Text>
            </View>
          </View>
          {hasNofootmark
            ? <View className='goods_none'>
              暂无最近浏览商品
            </View>
            : <View className='goods_content footmark'>
              {footmark.map((good, index) => {
                return (
                  <View
                    className='goods_content_item'
                    key={good.skuId}
                    onClick={this.gotoDetail.bind(null, good.skuId)}
                    data-elevel='1'
                    data-eid='TOPLIFE_1528204514223'
                    data-eparam={8 + index}
                  >
                    <View className='goods_content_item_img'>
                      <Image src={'https://' + good.imageUrl} mode='aspectFit' lazyLoad />
                      {good.stockState === 34 || good.stockState === 0 || good.price === '-1'
                        ? <View className='item_img_none'>
                          <Text className='item_img_none_text'>补货中</Text>
                        </View> : null}
                    </View>
                    <View className='goods_content_item_wp gciw'>
                      <Text className='gciw_brand'>{good.brandName}</Text>
                      <Text className='gciw_name'>{good.shortName}</Text>
                      {good.price === '-1'
                        ? <Text className='gciw_none'>暂无报价</Text>
                        : <Text className='gciw_price'><Text className='small'>￥</Text>{good.price}</Text>}
                      {/* <Text className='gciw_overdue'><Text className='small'>￥</Text>32,700</Text> */}
                    </View>
                  </View>
                )
              })}
            </View>}
        </View>
      </View>
    )
  }
}

export default connect(({
                          cart
                        }) => ({
  diviner: cart.diviner,
  footmark: cart.footmark
}), (dispatch) => ({
  fetchDiviner (...args) {
    dispatch(fetchDiviner(...args))
  }
}))(Goods)

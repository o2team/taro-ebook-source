import Taro, { Component } from '@tarojs/taro'
import { View, Button, Input, Text } from '@tarojs/components'

import { getSystemInfo } from '../../../utils/util'
import './filterMask.scss'

export default class FilterMask extends Component {

  state = {
    priceMin: '',
    priceMax: '',
    isIpx: false,
    promotionType: -1
  }

  componentDidMount () {
    this.setState({
      priceMin: '',
      priceMax: ''
    })
    // 获取系统信息
    const systemInfo = getSystemInfo()
    this.setState({
      isIpx: systemInfo.isIpx
    })
  }

  resetSearch = () => {
    this.setState({
      priceMin: '',
      priceMax: '',
      promotionType: -1
    })
  }

  /**
   * 确定选择
   * @param {} event
   */
  confirmSelect () {
    const {priceMin, priceMax, promotionType} = this.state
    if (parseInt(priceMin) > parseInt(priceMax)) {
      this.setState({
        priceMin: priceMax,
        priceMax: priceMin
      })
    }
    let data = {
      priceMin: this.state.priceMin,
      priceMax: this.state.priceMax,
      promotionType
    }
    this.props.onShowFilterMask()
    this.props.onConfirmSelect(data)
  }

  priceInput (type, {detail}) {
    let value = detail.value
    if (value && value > 0) {
      value = (value + '').replace(/\b(0+)/gi, '')
    } else {
      value = (value + '').replace(/\b(0+)/gi, 0)
    }
    if (type === 'min') {
      this.setState({
        priceMin: value
      })
    } else if (type === 'max') {
      this.setState({
        priceMax: value
      })
    }
  }

  addPromotion = (promotionType) => {
    promotionType = this.state.promotionType === promotionType ? 0 : promotionType
    this.setState({
      promotionType
    })
  }

  showFilterMask = () => {
    this.props.onShowFilterMask()
  }

  render () {
    const {isIpx, priceMin, priceMax, promotionType} = this.state
    const {showFilterMask} = this.props
    const filterContentClass = showFilterMask ? 'filter_mask_content search_animation' : 'filter_mask_content'
    return showFilterMask && <View className='filter_mask' catchtouchmove='ture'>
      <View className='filter_mask_layer' onClick={this.showFilterMask} />
      <View className={filterContentClass}>
        <View className='search_filter_header'>
          <View className='cate_header_back' onClick={this.showFilterMask} />
          <Text className='cate_header_title'>筛选1</Text>
        </View>
        <View className='filter_main_box'>
          <View className='filter_options'>
            <View className='filter_options_title'>
              <Text className='options_title_text'>活动</Text>
            </View>
            <View className='filter_options_content activity'>
              <Text
                className={promotionType === 1 ? 'activity_item active' : 'activity_item'}
                onClick={this.addPromotion.bind(this, 1)}
              >
                特惠
              </Text>
            </View>
          </View>
          <View className='filter_options'>
            <View className='filter_options_title'>
              <Text className='options_title_text'>价格</Text>
            </View>
            <View className='filter_options_content options_content_price'>
              <Input
                className='price_input'
                type='number'
                value={priceMin}
                onInput={this.priceInput.bind(this, 'min')}
                cursorSpacing='20'
                maxlength='8'
                placeholder='最高价'
              />
              <Text className='options_text'>至</Text>
              <Input
                className='price_input'
                type='number'
                value={priceMax}
                onInput={this.priceInput.bind(this, 'max')}
                cursorSpacing='20'
                maxlength='8'
                placeholder='最高价'
              />
            </View>
          </View>
          <View className='filter_confirm'>
            <Button className='item_btn reset_filter' onClick={this.resetSearch}>
              全部重置
            </Button>
            <Button className='item_btn filter_confirm_btn' onClick={this.confirmSelect}>
              确定
            </Button>
          </View>
        </View>
      </View>
    </View>
  }
}

FilterMask.defaultProps = {
  showFilterMask: false
}

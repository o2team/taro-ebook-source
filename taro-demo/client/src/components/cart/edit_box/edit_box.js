import Taro, { Component } from '@tarojs/taro'
import { View, Image, Text } from '@tarojs/components'
import { connect } from '@tarojs/redux'
import classnames from 'classnames'

import {
  hideEditBox,
  fetchChangeAttr
} from '../../../actions/cart'

import './edit_box.scss'

class EditBox extends Component {
  constructor () {
    super(...arguments)
    this.state = {
      showColorValue: '',
      showSizeValue: '',
      isClose: false
    }
  }

  onAnimationEnd = () => {
    const {isClose} = this.state
    if (isClose) {
      this.setState({isClose: false})
      this.props.hideEditBox()
    }
  }

  runCloseAni = () => {
    this.setState({isClose: true})
  }

  selectAttr = (type, value) => {
    if (type === 'color') {
      this.setState({showColorValue: value})
    } else if (type === 'size') {
      this.setState({showSizeValue: value})
    }
  }

  changeCartAttr = () => {
    const { editSkuData, onFetchChangeAttr } = this.props
    const {showColorValue, showSizeValue} = this.state
    const {sku} = editSkuData
    const newSku = [
      {
        skuId: sku.skuId,
        color: showColorValue || sku.colorInfo.value,
        size: showSizeValue || sku.sizeInfo.value
      }]

    this.runCloseAni()
    if (showColorValue || showSizeValue) {
      onFetchChangeAttr(newSku)
    }
  }

  render () {
    const {isClose, showColorValue, showSizeValue} = this.state
    const {editSkuData} = this.props
    const {showEidtBox, sku} = editSkuData
    const {colorInfo, sizeInfo} = sku || {}

    const colorValue = showColorValue || colorInfo.value
    const sizeValue = showSizeValue || sizeInfo.value

    const wpClass = classnames('editbox bg_shade', {'show': showEidtBox}, {'fade': isClose})
    const aniClass = classnames('editbox_content', {'show_wp': !isClose && showEidtBox}, {'hide_wp': isClose})
    return (
      <View className={wpClass}>
        <View className={aniClass} onAnimationEnd={this.onAnimationEnd}>
          <View className='editbox_header'>
            <View className='editbox_header_img'>
              <Image src={sku.main.images[0]} mode='aspectFill' />
            </View>
            <View className='editbox_header_text'>
              <Text className='editbox_header_text_price'><Text className='small'>￥</Text>{sku.main.price}</Text>
              <Text className='editbox_header_text_desc'>商品编号：{sku.skuId}</Text>
            </View>
            <Text className='editbox_header_close' onClick={this.runCloseAni} />
          </View>
          <View className='editbox_option'>
            <View className='editbox_option_title'>{colorInfo.name}：</View>
            <View className='editbox_option_wp'>
              {colorInfo.all.map((value, idx) => {
                return <Text
                  key={idx}
                  className={value === colorValue ? 'editbox_option_item on' : 'editbox_option_item'}
                  onClick={this.selectAttr.bind(null, 'color', value)}
                >{value}</Text>
              })}
            </View>
          </View>
          <View className='editbox_option size'>
            <View className='editbox_option_title'>{colorInfo.name}：</View>
            <View className='editbox_option_wp'>
              {sizeInfo.all.map((value, idx) => {
                return <Text
                  key={idx}
                  className={value === sizeValue ? 'editbox_option_item on' : 'editbox_option_item'}
                  onClick={this.selectAttr.bind(null, 'size', value)}
                >{value}</Text>
              })}
            </View>
          </View>
          {sku.isOutOfStock ? <View className='editbox_offsale'>该商品补货中</View> : <View className='editbox_btn' onClick={this.changeCartAttr}>确定</View>}
        </View>
      </View>
    )
  }
}

export default connect(({
  cart
}) => ({
  editSkuData: cart.editSkuData
}), (dispatch) => ({
  hideEditBox (...args) {
    dispatch(hideEditBox(...args))
  },
  onFetchChangeAttr (...args) {
    dispatch(fetchChangeAttr(...args))
  }
}))(EditBox)

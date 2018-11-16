import Taro, { Component } from '@tarojs/taro'
import { View, Button } from '@tarojs/components'

import './modal.scss'

class Modal extends Component {
  constructor() {
    super(...arguments)
    this.state = {}
  }

  onConfirmClick = () => {
    this.props.onConfirmCallback()
  }

  onCancelClick = () => {
    this.props.onCancelCallback()
  }

  onAuthConfirmClick = (e) => {
    this.props.onConfirmCallback(e.detail)
  }

  preventTouchMove = (e) => {
    e.stopPropagation()
  }

  render() {
    const { title, contentText, cancelText, confirmText, isAuth } = this.props
    return (
      <View className='toplife_modal' onTouchMove={this.preventTouchMove}>
        <View className='toplife_modal_content'>
          <View className='toplife_modal_title'>{title}</View>
          <View className='toplife_modal_text'>{contentText}</View>
          <View className='toplife_modal_btn'>
            <Button className='toplife_modal_btn_cancel' onClick={this.onCancelClick}>{cancelText}</Button>
            {!isAuth ?
              <Button className='toplife_modal_btn_confirm' onClick={this.onConfirmClick}>{confirmText}</Button> :
              <Button className='toplife_modal_btn_confirm' openType='getUserInfo' onGetUserInfo={this.onAuthConfirmClick}>授权</Button> }
          </View>
        </View>
      </View>
    )
  }
}

Modal.defaultProps = {
  title: '',
  contentText: '',
  cancelText: '取消',
  confirmText: '确定',
  isAuth: false,
  onCancelCallback: () => {},
  onConfirmCallback: () => {}
}

export default Modal

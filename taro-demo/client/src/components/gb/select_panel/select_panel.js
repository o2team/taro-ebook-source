import Taro, { Component } from '@tarojs/taro'
import { View, Text, Button } from '@tarojs/components'
import classnames from 'classnames'

import './select_panel.scss'

export default class SelectPanel extends Component {
  constructor () {
    super(...arguments)
    this.state = {
      isShow: true,
      selectedIndex: -1,
      selectedDetail: null
    }
  }

  closePanel = () => {
    this.setState({
      isShow: false
    })
  }

  confirmSelect = () => {
    if (this.state.selectedIndex !== -1) {
      this.setState({
        isShow: false
      }, () => {
        this.props.onSelected && this.props.onSelected(this.state.selectedDetail)
      })
    }
  }

  seleted (index, item) {
    this.setState({
      selectedIndex: index,
      selectedDetail: item
    })
  }

  onAnimationEnd = () => {
    if (!this.state.isShow) {
      this.setState({
        isShow: true,
        selectedIndex: -1,
        selectedDetail: null
      })
      this.props.onClose && this.props.onClose()
    }
  }

  touchMove = (e) => {
    e && e.stopPropagation()
  }

  render () {
    const { detail = [], title, tips, subTitle, cancelBtnText, confirmBtnText } = this.props
    const selectPanelClassName = classnames('select_panel', !this.state.isShow && 'hide')
    const confirmDisable = this.state.selectedIndex === -1

    return (
      <View className={selectPanelClassName} onTouchMove={this.touchMove}>
        <View className='select_panel_mask' onAnimationEnd={this.onAnimationEnd} onClick={this.closePanel}></View>
        <View className='select_panel_wrapper'>
          <View className='select_panel_hd'>
            <Text>{title}</Text>
            <View className='select_panel_close'></View>
          </View>
          <View className='select_panel_bd'>
            <View className='select_panel_tip'>
              {tips.map(item => {
                return <View>{item}</View>
              })}
            </View>
            <View className='select_panel_main'>
              <View className='select_panel_sub'>
                <Text className='select_panel_sub_tit'>{subTitle}</Text>
              </View>
              <View className='select_panel_detail'>
                {detail.map((item, index) => {
                  return (
                    <View className={'select_panel_detail_item' + ((index === this.state.selectedIndex) ? ' selected' : '')} onClick={this.seleted.bind(this, index, item)}>
                      <View className='select_panel_detail_inner'>
                        <Text className='select_panel_detail_txt'>{item.desc}</Text>
                      </View>
                    </View>
                  )
                })}
              </View>
            </View>
          </View>
          <View className='select_panel_ft'>
            <Button className={'select_panel_ft_btn confirm' + (confirmDisable && ' disabled')} onClick={this.confirmSelect}>{confirmBtnText}</Button>
            <View className='select_panel_ft_split'></View>
            <Button className='select_panel_ft_btn cancel disabled' onClick={this.closePanel}>{cancelBtnText}</Button>
          </View>
        </View>
      </View>
    )
  }
}

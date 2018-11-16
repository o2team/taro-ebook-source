import Taro, { Component } from '@tarojs/taro'
import { View, Image, Text } from '@tarojs/components'

import './searchError.scss'
import errIcon from '../../../asset/ic_search_tips.png'

export default class SearchError extends Component {

  async refresh () {
    this.props.onGoSearchContent()
  }

  render () {
    const {showNotFind, keyWords, showErrorProblem} = this.props
    const words = /^.*[,].*$/.test(keyWords) ? '' : keyWords
    const showWordsTips = `没有找到与“${words} 相关的商品`

    return (
        <View className='search_not_found'>
            <Image className='not_found_img' src={errIcon} />
            <Text className='not_found_text'>很抱歉</Text>
            {
              !showErrorProblem && showNotFind &&
              <Text className='not_found_word'>{showWordsTips}</Text>
            }
            {
              showErrorProblem &&
              <View>
                <Text className='not_found_word'>程序员可能送货去了</Text>
                <Text className='not_found_btn' onClick={this.refresh}>刷新试试</Text>
              </View>
            }
        </View>
    )
  }
}
SearchError.defaultProps = {
  showNotFind: false,
  keyWords: '',
  showErrorProblem: false
}

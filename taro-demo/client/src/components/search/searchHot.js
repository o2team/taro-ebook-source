import Taro, { Component } from '@tarojs/taro'
import { View, Text } from '@tarojs/components'

import './searchHot.scss'

const DEFAULT_TITLE = '热门搜索'
export default class SearchHot extends Component {

  goSearch = (value = '') => {
    if (value) {
      this.props.onAddHistory({value, type: 'add'})
      this.props.onSearchWords({keyWords: value})
    }
  }

  render () {
    const {hotWords, titleName} = this.props
    return (
      hotWords.length > 0 &&
      <View className='hot_word'>
        <Text className='hot_word-title'>{titleName}</Text>
        <View className='hot_word-list'>
          {
            hotWords.map((item, index) => {
              return (
                <Text
                  className={item ? 'hot_word-keyword' : 'search_not_see'}
                  onClick={this.goSearch.bind(this, item)}
                  key={index}
                >
                  {item}
                </Text>
              )
            })
          }
        </View>
      </View>
    )
  }
}
SearchHot.defaultProps = {
  hotWords: [],
  titleName: DEFAULT_TITLE
}

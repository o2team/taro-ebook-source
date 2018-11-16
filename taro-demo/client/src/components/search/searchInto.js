import Taro, { Component } from '@tarojs/taro'
import { View, Text, Image } from '@tarojs/components'
import searchIcon from '../../asset/ic_search.png'
import './searchInto.scss'
import { jumpUrl } from '../../utils/util'

const DEFAULT_PLACEHOLDER = '探索你的精致生活'

export default class SearchInto extends Component {
  handler = () => {
    console.log('类型：' + this.props.type)
  }
  goSearch = () => {
    console.log('goSearch')
    jumpUrl(`/pages/list/list`)
  }

  render () {
    const {placeholder} = this.props
    return (
      <View className='search_into' onClick={this.goSearch}>
        <Image mode='aspectFit' className='search_icon' src={searchIcon} />
        <Text className='search_text' onClick={this.goSearch}>{placeholder}</Text>
      </View>
    )
  }
}

SearchInto.defaultProps = {
  placeholder: DEFAULT_PLACEHOLDER
}

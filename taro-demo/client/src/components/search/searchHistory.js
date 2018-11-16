import Taro, { Component } from '@tarojs/taro'
import { View, Image, Text } from '@tarojs/components'

import delIcon from '../../asset/ic_del.png'
import './searchHistory.scss'

export default class SearchHistory extends Component {

  componentDidMount () {

  }

  goSearch (value = '') {
    if (value) {
      this.props.onChangeHistory({value, type: 'add'})
      this.props.onSearchWords({keyWords: value})
    }
    // let url = `../list/list?words=${value}`
    // jumpUrl(url, {method: 'redirectTo'})

  }

  deleteSearch (value) {
    this.props.onChangeHistory({value, type: 'delete'})
  }

  render () {
    const {historyWords = []} = this.props
    return (
      historyWords.length > 0 &&
      <View className='history'>
        <View className='history_title'>
          <Text className='history_title_content'>历史搜索</Text>
        </View>
        <View className='history_list'>
          {
            historyWords.map((item, index) => {
              return (
                <View className='history_word' key={index}>
                  <Text
                    className='history_word_info'
                    onClick={this.goSearch.bind(this, item)}
                  >
                    {item}
                  </Text>
                  <Image
                    mode='aspectFit'
                    src={delIcon}
                    className='history_word_del'
                    onClick={this.deleteSearch.bind(this, item)}
                    data-index={index}
                  >
                  </Image>
                </View>
              )
            })
          }
        </View>
      </View>
    )
  }
}


import Taro, { Component } from '@tarojs/taro'
import { View, Input, Text, Image } from '@tarojs/components'

import searchIcon from '../../asset/ic_search.png'
import cartIcon from '../../asset/shopping_cart.png'
import searchDel from '../../asset/ic_del.png'
import './searchBar.scss'
import { jumpUrl } from '../../utils/util'

export default class SearchBar extends Component {

  state = {
    words: '',
    focusSearch: false
  }

  componentWillReceiveProps (nextProps) {
    if (this.props.keyWords !== nextProps.keyWords || this.state.words === '') {
      this.setState({
        words: nextProps.keyWords
      })
    }
  }

  onSearchInput = ({detail = {}}) => {
    if (!detail.value) {
      return
    }
    this.setState({
      words: detail.value
    })
  }

  onH5Enter = (e) => {
    const key = e.key
    const value = e.target.value
    if (key === 'Enter') {
      this.props.onAddHistory({value: value, type: 'add'})
      this.props.onSearchWords({keyWords: value})
    }
  }

  onFocusSearch = () => {
    this.props.onShowSearchResult({type: 'result', isShow: false})
  }

  deleteHandler = () => {
    this.setState({
      words: ''
    })
  }
  cancelSearch = () => {
    this.props.onShowSearchResult({type: 'result', isShow: true})
  }
  goSearch = ({detail}) => {
    if (detail.value !== '') {
      this.props.onAddHistory({value: detail.value, type: 'add'})
      this.props.onSearchWords({keyWords: detail.value})
    }
  }

  goCart () {
    jumpUrl('../cart/cart_sub')
  }

  render () {
    const {showSearchResult = false} = this.props
    const {words} = this.state
    const carNumber = 99
    return (
      <View className='search_container'>
        <View className='search_container_box'>
          <View className='search_container_box-search_box'>
            <View className='search_container_box-search_icon-wrap'>
              <Image mode='aspectFit' className='search_container_box-search_icon' src={searchIcon} />
            </View>
            <Input
              className='search_container_box-search_input'
              type='text'
              placeholder={this.props.placeholder}
              confirm-type='search'
              value={words}
              onClick={this.onFocusSearch}
              onConfirm={this.goSearch}
              onInput={this.onSearchInput}
              onKeydown={this.onH5Enter}
            />
            <View
              className={!showSearchResult && words !== '' ? 'search_container_box-search_del' : 'search_not_see'}
              onClick={this.deleteHandler}
            >
              <Image mode='aspectFit' className='search_container_box-search_del_icon' src={searchDel} />
            </View>
          </View>
          <View className={showSearchResult ? 'search_container_box-search_show_cart' : 'search_not_see'}>
            <Image mode='aspectFit' className='search_container_box-cart_icon' src={cartIcon} onClick={this.goCart} />
            <View className={carNumber ? 'search_container_box-cart_num_wrap' : 'search_not_see'}>
              <Text className='search_container_box-cart_num'>{carNumber}</Text>
            </View>
          </View>
          <Text
            onClick={this.cancelSearch}
            className={!showSearchResult ? 'search_container_box-search_show_cancel' : 'search_not_see'}
          >
            取消
          </Text>
        </View>
      </View>
    )
  }
}

import Taro, { Component } from '@tarojs/taro'
import { View, Image, Text, ScrollView } from '@tarojs/components'

import { jumpUrl } from '../../../utils/util'
import './resultList.scss'

export default class ResultList extends Component {

  constructor () {
    super(...arguments)

    this.state = {
      list: []
    }
    this.allListData = []
    this.currentMaxPage = 1 //当前大分页
  }

  componentDidMount () {
    Taro.getSystemInfo({
      success: (res) => {
        console.log(res)
      }
    })
  }

  componentWillReceiveProps (nextProps) {
    const {searchResult, scrollTop} = nextProps
    if (searchResult.page < 10) {
      this.allListData = searchResult.wares
      this.setState({
        list: searchResult.wares
      })
    } else if (searchResult.page > 9 && nextProps.searchResult.page !== searchResult.page) {
      this.allListData = this.allListData.concat(searchResult.wares)
      let list = this.allListData
      if (searchResult.page % 10 === 0) {
        this.currentMaxPage = page
      }
      if (searchResult.page > 9) {
        list = this.allListData.slice((this.currentMaxPage - 2) * 10, (searchResult.page + 8) * 10)
      }
      this.setState({
        list
      })
    } else if (scrollTop < 1000 && searchResult.page > 9) {
      this.setState({
        list: this.allListData.slice((this.currentMaxPage - 9) * 10, (searchResult.page) * 10)
      })
    } else if (scrollTop > 1500 * 10 && searchResult.page > 9) {
      this.setState({
        list: this.allListData.slice((this.currentMaxPage - 2) * 10, (searchResult.page + 10) * 10)
      })
    }
  }

  doJump (skuid) {
    jumpUrl(`/pages/detail/detail?skuid=${skuid}`)
  }

  srollToTop () {
    Taro.pageScrollTo({
      scrollTop: 0,
      duration: 400
    })
  }

  showFilter = () => {
    this.props.onShowFilter({type: 'filter', isShow: true})
  }

  render () {
    const {
      list
    } = this.state
    const {searchResult = {}, showGoTop = false} = this.props
    const resultList = list.map((item, index) => {
      return (
        <View
          className='result_content-item'
          key={index}
          onClick={this.doJump.bind(this, item.skuId)}
        >
          <View className='result_content-item_img'>
            <Image
              className='item_img_info'
              mode='widthFix'
              src={item.imageUrl ? 'http://' + item.imageUrl : ''}
              lazyLoad={true}
            />
          </View>
          <Text className='result_content-item_title'>{item.skuName || ''}</Text>
          <Text className='result_content-item_subtitle'>{item.name}</Text>
          <Text className='result_content-item_price' onClick={this.doJump.bind(this, item.skuId)}>
            {
              item.price && item.price !== '-1' &&
              <Text className='result_content-item_price_unit'>&yen;</Text>
            }
            {item.price && item.price !== '-1' ? item.price : '暂无报价'}
          </Text>
        </View>
      )
    })

    return list.length > 0 && (
      <ScrollView scrollY className='search_result-scroll'>
        <View className='search_result-result_content'>
          <View className='result_content_list'>
            {resultList}
          </View>
          <View className={showGoTop ? 'search_result-go_top' : 'search_result-go_top not_see_go'} onClick={this.srollToTop}>
            <View className='search_result-go_to_arrow' />
          </View>
          <Text className={searchResult.count <= searchResult.page * 10 ? 'has_not_more' : 'search_not_see'}>没有更多商品了~</Text>
          <Text className={searchResult.count > searchResult.page * 10 ? 'has_not_more' : 'search_not_see'}>正在加载中...</Text>
        </View>
      </ScrollView>
    )
  }
}

ResultList.defaultProps = {
  searchResult: {
    wares: [],
    page: 1
  },
  showGoTop: false
}

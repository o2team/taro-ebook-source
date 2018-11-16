import Taro, { Component } from '@tarojs/taro'
import { View, Text } from '@tarojs/components'

import FilterMask from './filterMask'
import './searchFilter.scss'

export default class SearchFilter extends Component {

  constructor () {
    super(...arguments)
    this.state = {
      isClick: true,
      sortContent: [
        {
          label: '综合',
          value: 1,
          cName: 'result_filter_btn'
        },
        {
          label: '最新',
          value: 4,
          cName: 'result_filter_btn'
        },
        {
          label: '价格',
          value: 2,
          cName: 'result_filter_btn price_btn'
        }
      ],
      sortType: 1,
      showFilterMask: false,
      currentIndex: 0,
      filterObj: {}
    }
    this.allListData = []
  }

  selectFilter = async (index, value) => {

    Taro.pageScrollTo({
      scrollTop: 0
    })
    let {sortContent, isClick, currentIndex} = this.state
    let currentValue = parseInt(value, 10)
    if (currentValue === 2 || currentValue === 3) {
      currentIndex = 2
      if (isClick) {
        this.setState({
          isClick: false
        })
      } else {
        currentValue = currentValue === 2 ? 3 : 2
        sortContent[2].value = currentValue
      }
    } else {
      currentIndex = parseInt(index, 10)
      sortContent[2].value = 2
      this.setState({
        isClick: true,
        sortContent
      })
    }
    this.setState({
      sortType: currentValue,
      currentIndex,
      sortContent
    })
    this.goSearchContent()
  }

  confirmSelect = (data = {}) => {
    this.setState({
      filterObj: data
    })
    this.goSearchContent()
  }

  goSearchContent = () => {
    const {filterObj, sortType} = this.state
    this.props.onGoSearchContent({sortType, ...filterObj})
  }

  showFilterMask = () => {
    console.log('showFilterMask')
    this.setState({
      showFilterMask: !this.state.showFilterMask
    })
  }

  render () {
    const {
      sortContent,
      sortType,
      currentIndex,
      showFilterMask
    } = this.state
    const list = sortContent.map((item) => {
      const cNameItem = sortType === 2 ? (item.cName + ' top') : (sortType === 3 ? (item.cName + ' bottom') : item.cName)
      return {
        ...item,
        cName: cNameItem
      }
    })
    return (
      <View className='search_filter'>
        <View className='search_filter_content'>
          {
            list.map((item, index) => {
              return (
                <Text
                  className={currentIndex === index ? (item.cName + ' search_filter_content_active') : item.cName}
                  key={index}
                  onClick={this.selectFilter.bind(this, index, item.value)}
                >
                  {item.label}
                </Text>
              )
            })
          }
          <Text className='result_filter_btn' onClick={this.showFilterMask}>筛选</Text>
        </View>
        {
          <FilterMask
            showFilterMask={showFilterMask}
            onShowFilterMask={this.showFilterMask}
            onConfirmSelect={this.confirmSelect}
          />
        }
      </View>
    )
  }
}

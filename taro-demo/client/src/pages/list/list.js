import Taro, { Component } from '@tarojs/taro'
import { View } from '@tarojs/components'
import { connect } from '@tarojs/redux'
import _ from 'lodash'

import './list.scss'
import SearchBar from '../../components/search/searchBar'
import SearchHot from '../../components/search/searchHot'
import SearchHistory from '../../components/search/searchHistory'
import ResultList from '../../components/search/searchResult/resultList'
import SearchError from '../../components/search/searchResult/searchError'
import SearchFilter from '../../components/search/searchFilter/searchFilter'

import {
  fetchSearchData,
  triggerShowSearchBar,
  showResult,
  setSearchHistory,
  restState
} from '../../actions/search'

class SearchList extends Component {
  config = {
    navigationBarTitleText: '搜索列表',
    enablePullDownRefresh: true,
    onReachBottomDistance: 300,
    backgroundTextStyle: 'dark',
    disableScroll: true
  }

  state = {
    page: 1,
    keyWords: '',
    filterObj: {},
    scrollTop: 3000,
    showGoTop: false
  }

  componentWillMount () {
    console.log(this.$router)
    let keyWords = _.get(this.$router, 'params.words', '')
    this.setState({
      keyWords
    })
  }

  componentDidMount () {
    this.props.changeHistory()
    let keyWords = _.get(this.$router, 'params.words', '')
    if (keyWords) {
      this.props.fetchSearchData({keyWords})
    }
  }

  componentWillUnmount () {
    this.props.restState()
  }

  /**
   * 微信自带下拉到底部事件
   */
  onReachBottom () {
    const {searchResult} = this.props.search
    this.goSearchWords({page: searchResult.page + 1})
  }

  onPageScroll (e) {
    this.setState({
      scrollTop: e.scrollTop
    })
    if (e.scrollTop > 100) {
      if (!this.state.showGoTop) {
        this.setState({
          showGoTop: true
        })
      }
    } else {
      if (this.state.showGoTop) {
        this.setState({
          showGoTop: false
        })
      }
    }
  }

  showContent = (options = {}) => {
    switch (_.get(options, 'type', '')) {
      case 'result':
        this.props.showResult(options.isShow)
        break
      default:
        console.warn('type没有')
    }
  }

  changeHistory = (data = {}) => {
    this.props.changeHistory(data)
  }

  goSearchWords = (options = {}) => {
    if (options.keyWords) {
      this.setState({
        keyWords: options.keyWords
      })
    } else {
      options.keyWords = this.state.keyWords
    }
    this.props.fetchSearchData(options)
  }

  render () {
    const {keyWords, showGoTop, scrollTop} = this.state
    const {
      hotWords,
      historyWords,
      searchResult,
      showSearchResult,
      showSearchHot,
      showSearchHistory,
      showNotFind,
      showErrorProblem
    } = this.props.search
    const showError = showNotFind || showErrorProblem
    return (
      <View className='list'>
        <SearchBar
          keyWords={keyWords}
          showSearchResult={showSearchResult}
          onAddHistory={this.changeHistory}
          onSearchWords={this.goSearchWords}
          onShowSearchResult={this.showContent}
        />
        {
          showSearchHot &&
          <SearchHot
            hotWords={hotWords}
            onSearchWords={this.goSearchWords}
            onAddHistory={this.changeHistory}
          />
        }
        {
          showSearchHistory &&
          <SearchHistory
            historyWords={historyWords}
            onSearchWords={this.goSearchWords}
            onChangeHistory={this.changeHistory}
          />
        }
        {
          showSearchResult &&
          <SearchFilter
            onGoSearchContent={this.goSearchWords}
          />
        }
        {
          showSearchResult &&
          <ResultList
            searchResult={searchResult}
            showGoTop={showGoTop}
            scrollTop={scrollTop}
            onShowFilter={this.showContent}
            onSearchWords={this.goSearchWords}
          />
        }
        {
          showSearchResult && showError &&
          <SearchError
            showNotFind={showNotFind}
            showErrorProblem={showErrorProblem}
            keyWords={keyWords}
            onGoSearchContent={this.goSearchWords}
          />
        }
      </View>
    )
  }
}

export default connect(({search}) => ({
  search
}), (dispatch) => ({
  fetchSearchData (data) {
    dispatch(fetchSearchData(data))
  },
  triggerShowSearchBar () {
    dispatch(triggerShowSearchBar())
  },
  showResult (data) {
    dispatch(showResult(data))
  },
  changeHistory (data = {}) {
    dispatch(setSearchHistory(data))
  },
  restState () {
    dispatch(restState())
  }

}))(SearchList)

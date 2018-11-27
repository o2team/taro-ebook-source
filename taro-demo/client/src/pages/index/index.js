import Taro, { Component } from '@tarojs/taro'
import '@tarojs/async-await'
import { View, Image, ScrollView, Text } from '@tarojs/components'
import classnames from 'classnames'
import { connect } from '@tarojs/redux'

import './index.scss'
import SearchInto from '../../components/search/searchInto'
import Modal from '../../components/gb/modal/modal'
import { jumpUrl } from '../../utils/util'
import { getUserInfo, getIsAuth, getH5UniqueId } from '../../utils/index'
import { setGlobalData } from '../../constants/globalData'
import { fetchIndexList } from '../../actions/home'

class Index extends Component {
  config = {
    navigationBarTitleText: 'TARO商城',
    enablePullDownRefresh: true,
    backgroundTextStyle: 'dark',
    disableScroll: true
  }

  constructor () {
    super(...arguments)
    this.state = {
      animationClass: '',
      shouldIndexHidden: false,
      showAuthModal: false
    }
    this.env = process.env.TARO_ENV
  }

  onGotoPage (venderId) {
    jumpUrl(`/pages/shop/shop?venderId=${venderId}`)
  }

  onShareAppMessage () {
    const home = this.props.homeData
    let pages = Taro.getCurrentPages()
    let page = pages[pages.length - 1]
    let path = `${page.route}?id=${page.options.id}`
    let imageUrl = home.floorData && home.floorData && home.floorData.floors[0] ? home.floorData.floors[0].items[0].image : ''
    return {
      title: 'Taro商城开发样例',
      path,
      imageUrl,
      success: function () {
        Taro.showToast({
          title: '转发成功！',
          icon: 'success'
        })
      },
      fail: function () {
        Taro.showToast({
          title: '转发失败！',
          icon: 'none'
        })
      }
    }
  }

  hideAuthModal () {
    this.setState({
      showAuthModal: false
    })
    Taro.setStorage({key: 'isHomeLongHideAuthModal', data: true})
  }

  prcoessAuthResult (userData) {
    Taro.setStorage({key: 'isHomeLongHideAuthModal', data: true})
    if (userData.userInfo) {
      setGlobalData('userData', userData)
    }
    this.setState({
      showAuthModal: false
    })
    getIsAuth()
  }

  async onPullDownRefresh () {
    if (this.state.shouldIndexHidden) {
      Taro.stopPullDownRefresh() // 停止下拉刷新
    } else {
      await this.props.onFetchIndexList()
      Taro.stopPullDownRefresh() // 停止下拉刷新
    }
  }

  componentWillMount () {
    // 填充首页的数据
    this.props.onFetchIndexList()
  }

  componentDidMount () {
    if (this.env === 'weapp') {
      // 用类名来控制动画
      setTimeout(async () => {
        const userData = await getUserInfo()
        Taro.getStorage({
          key: 'isHomeLongHideAuthModal',
          success: (res) => {
            const isHomeLongHideAuthModal = res.data
            let showAuthModal
            if (!userData && !this.state.showAuthModal && !isHomeLongHideAuthModal) {
              showAuthModal = true
            } else {
              showAuthModal = false
            }
            this.setState({
              animationClass: 'animation',
              showAuthModal
            })
          },
          fail: () => {
            let showAuthModal
            if (!userData && !this.state.showAuthModal) {
              showAuthModal = true
            } else {
              showAuthModal = false
            }
            this.setState({
              animationClass: 'animation',
              showAuthModal
            })
          }
        })
      }, 1000)
      getIsAuth()
    } else if (this.env === 'h5' || 'rn') {
      getH5UniqueId()
    }
  }

  render () {
    const {animationClass, shouldIndexHidden, showAuthModal} = this.state
    const {floorData = []} = this.props.homeData
    const indexClassNames = classnames('container', 'index', animationClass, {
      hidden: shouldIndexHidden
    })
    const floorList = floorData.map(item => {
      return {
        className: 'index_item',
        venderId: item.venderId,
        image: item.image
      }
    })
    return (
      <View className={indexClassNames}>
        <View className='index-search_into'>
          <SearchInto placeholder='搜索框' type='index' />
        </View>
        <ScrollView
          scrollY
          className='index_list'
        >
          {floorList.map((floor, index) => {
            return (
              <View key={index} className={floor.className} onClick={this.onGotoPage.bind(this, floor.venderId)}>
                {index > 3
                  ? <Image mode='widthFix' className='index_item_img' src={floor.image} lazyLoad />
                  : <Image mode='widthFix' className='index_item_img' src={floor.image} />}
              </View>
            )
          })}
        </ScrollView>
        {showAuthModal &&
        <Modal
          title='授权提示'
          contentText='TARO商城请求获取授权信息，以便记录您的订单'
          onCancelCallback={this.hideAuthModal.bind(this)}
          onConfirmCallback={this.prcoessAuthResult.bind(this)}
          isAuth={true}
        />
        }
      </View>
    )

  }
}

export default connect(({home}) => ({
  homeData: home
}), (dispatch) => ({
  onFetchIndexList () {
    dispatch(fetchIndexList())
  }
}))(Index)

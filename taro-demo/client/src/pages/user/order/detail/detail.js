import Taro, { Component } from '@tarojs/taro'
import { View, Text, Image, Button, Form, ScrollView } from '@tarojs/components'
import { connect } from '@tarojs/redux'

import SelectPanel from '../../../../components/gb/select_panel/select_panel'
import Modal from '../../../../components/gb/modal/modal'

import { fetchOrderById, fetchCancelOrder } from '../../../../actions/order'
import { getGlobalData, setGlobalData } from '../../../../constants/globalData'
import { getLoginStatus, getParseTime, getParseDay, jumpUrl, getSystemInfo, parseMoney } from '../../../../utils/util'

import './detail.scss'

const iconImg1 = 'data:image/png;base64,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'
const iconImg2 = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADwAAAA8CAYAAAA6/NlyAAADXUlEQVRoge2ZzUsVURiHn3s1pZDCvlzcshLbVZuiD4oQgsAUotqUVOZfEBEFUVAtokUf1CJrU0EUFtQqKnDVIiKFIKpFSEWYFy0KKtNU9E6L8w7nYneud+acudfgPDCMznvmvL/fnTPvzDkDDofD4XA4HA7HtCQFHAU6gTQwAngl3L4DZ4Ey20argWvAWIkNBm0nbJptAQak4zGgA9gJLAYqbSYKwvO8nBvQJLp6beSpBG6gf8VOoM5Gx2HJYziRpc+IFNAlHQ0CraYdmhBkWEwbG14N9Esn74EVxooNidPwFuAXegjPtaLYkLgMbwdG5eRbwAxrig2Jw3AT2uwFVDGYNtg2vAlt9rx9uebYNFwPfJUT2uORa44tw3OA19L4PjG8ntnChuEk8FgadgEVsSo2xIbhg9LoC7AoXrnmmBpeDgxLo+b45ZpjYjgBPJcGN4sj1xwTwy0S7EMVrf+CqIYrgA8SbCueXHOiGt4rgTdM40dQLsIYTmadt0v2V4CJ4sktHf6Ub0mphYQlypCukYPfiqzVClGGdK3sPxZZa9HxDdfIfqBUQoqFb3i27AdLJaRYlEc4J4maNlahlj9Lcd8vRY3KH0APEVY0/DesO3nalAFH0NXcQz2+ngJrwiaMSDPwNiu/B3wC2sJW6T1ysCMgUTl6uugneQkMyf8jwA5rtnJzGMigP6F0oz7n+JrawxjeJgefBCQ7KfF+1MqlTxVwSWJD6Gpvm40os+PAIfStmAB2o3/41kINr0dP9iczE7U0m5HEubgr51+MaGgqHkr/pwLi+yT+rlDDdeihOpkGiXXnEbRB2rzKOpZCDb0wH7387UVWPwn0/Hx+QP4kqnh6QGqS4WHZAD00elHrVz05Olsg+748htOyr846lkHd21H4k/V3FWqUjRDwRPA8L5NIJPqBeaIhnRVuDJt8HTJc8rRp5N8rYxP/6tUHxGeh7uMMMDegeBVMGerqesD+HPEK9CrJ8VA9F8516f9eQPy0xJ/leTyFwi8Ko8AxYCHqvlmLeg57wGf0G5ttlgG/Jc8DYKXkrwMuoyv4ZluGAc4QXGTSIiJOtgI/A/KPAQemmDVFogF4JInHUUtC5wiunrapBa6iiuwEahn5NrAqn1kTww6Hw+FwOBwOh0PxF8yWc2uUXfUeAAAAAElFTkSuQmCC'
const iconImg3 = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADwAAAA8CAYAAAA6/NlyAAAE3klEQVRoge3aWaxdUxjA8V9Lb4vr0pjaBolQlBShSAwxNKYnHhBShDQSREXUg0SIKakhEkNUggiCB4khESEiTYuI4YkaWkJaNIaqDlpTy/Hwre24nH3v2fusfS9x/8nOurn7fNNZ+3z7W99ajDHGGGP8hxjXsP5+HIujsR/2xRTsgIlYhw34EsvxLhZhacN+ZaUfF+JlbEarxrUS9+DA3M7lnOHdcCUuw0D63xa8g8Vi1j7GV9goZnbHdO2DGTgMp4inoOBVXIKPMvraE324Fpu0Z2gJ5opHtyrjcCjuFY98C1dn8TQDh4tZKwJ9GrMy6u/HqZiUUWdt5uNXEehSHD+q3jTI1nhQBPo77hQZd6TZRTwBjbIVnhHBbsIZTRssYRLW4hPs3pSRcXhcBLsaRzRlqAvG443ky3vqJcdhuSEZWIdDmjBQkZ1EsC28KHMRdZr4vf6CE3Mq7pHd8Y0I+ppcSifj66R0fi6lGZmN38QbY/8cCh8SwS5W7bHpU//9OTD8RwZxj/BxkR4f7Zni2/tJFP5V+AArsHdFuRuF8+dUkBnQfrRPq2hvEMUr6K4asi8l2S90H/TNSWaz6oXMVUn2tYpyf7K3SFQ/GlzMd8t2oqbuNui/BntmDXv94nXZEouQyhQOPFJHONFt0LfoLdiC25Oeu+sIr0jCx/TgAMMHnStYOCjp+lrF5LVfXcESyoLOGWzBF0nnzCpClyehxzM5wT+Dvk/+YOHRpHdeFaHi3XtpRkcYHHQTwRIdlxYe6HRz6xKhGWms01aZhOcwfYj7BZtxW7r+zpb0/4cr2l+WxkpV1yrxLdVZek0WPas6zbu/Xwtr2N8ryX7e6WbZDBel3boaBtdiDxF4GTdhDq7HE0N8bmUN+9+nseOSsSzgopOwsYZBIui1Q9zfkMbv8FlNG2WsT2PHenx8idDmNE7I7MxIUOSInzvdLAu4mIGqq5Z/A4XPP3S6WfZIfys6CtOwpqLB4bI07JzGm5T3nOtm6alp/LaK0LMi051d0Rijn6XPTLLPd7pZNsMfio7kwXiqosHRztKHprHjhlxZwK+ncbbYRqnKaGbp49L4ZqebZUlriWjYzdL+vf0XGBDbP7+JTbh/UBbwj3hFNN7PbcS1ZjhLvEoXKymaygKmvfCfm9WlZrkgjbVWeX3a7dmeGmMdWCj/amxW0rke25d9aKgZ/hV3pL+vl7ezvzqNdUvXThTJ9X4lRUc3bCt27Fu4KINTBdvgJJEjcnCC9gZfnYbjIM7V3kDbtVdlDdCH94WPdV6hHXk5KXxB8yd/qrJA+LZcxn3qqdoJbEEupRk4XXuT7/DcymcnxS3R5BttjtQ+SHNVU0bmiG/0d1zRlJEuOEKs4lp4rGlj80TALdwqX6btlpNELV6cGhoR++drn+BZJMOroAvGiSy8Jdl9QmToEeME7Xf0Glxs6EKmF/YV9XFLLAxyF0JdM0WcrygW7G+Lg2S5nJkqtmqLZLkKJ2fS3RNna/eyW6IQmCfOX1ZlvFjTPioaccWs3i/OZf5r2EYEWWxmFY6+JbYxzxMF/jSxbp0guiLTxaxdiSdFL+qv8k/igBGMozITREHwnMEHTqtcH+M67JnbuaZ/+BNxlNhjPlDs90zVPiC+QbSCPhV7Qu+JbsuyTsrGGGOMMf53/AEkUnXEe+3LvwAAAABJRU5ErkJggg=='
const iconImg4 = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADwAAAA8CAYAAAA6/NlyAAAB+UlEQVRoge3av2vUYBzH8dfVoq1Q6yAqIuIg4qibu7O6KU7ioEtX/wI3V3dd/DUVdHHrrCA4iZOgICilYkVRrKVXh+QwzeX0Yn54Dd83BI4nXz75vi8JPDx5CIIg2Eb0GsyexlxD2Z+x2VA2WEovMCnHw1x/d3GvTuH/LZg/nhT01x9HZLqct5P4mhv7jrWSOWUZ5xGu9fUc/LPzdYbWyKC/yQ2smbH7m2q4kYkjhLtOCHedEO46IVySQ3ivvTn0W+yt0nBV4R2YqZhRhpn0mo0TU8vtSgh3nRDuOiHcdaoKH8SK9mZaKzhQpeGqwn2sV8wow7qWJkAx09quhHDXCeGuM47wzsa7aJFxhGcb76JF4pHuOiHcdUK464Rw1wnhlrLK7qmqrc+qQcexKFlr2sA73DB6OnoBzyWb2b7hKc6OqJ3DTXxIs5fxAEcr9vxX5hUvoZzAaubcRub3kuFdftcz5/u2Ls5dy9XuwrMR2cuGpWtdghol/Dgduy/5TtzDabxOxy9navfjB37iikRoFgupzBfsydQvpBkvcSodO4JHmWtmqVW4h0+23pHBsYrdufrzI2o3cacgf/EP9Wdytfskr0NR7Zt/Vxzmkt8bPLOyFwtqp3Bbcjez9S9wuKD+GF7latdwa0QvVyVPRLb+I86V1wqCIAgmi1/tOQiqlfXZbQAAAABJRU5ErkJggg=='

@connect(({orderDetail}) => ({
  orderDetail: orderDetail.all
}), dispatch => ({
  fetchOrderById (orderId, callback) {
    dispatch(fetchOrderById(orderId, callback))
  },
  fetchCancelOrder (orderId, callback) {
    dispatch(fetchCancelOrder(orderId, callback))
  }
}))

export default class OrderDetail extends Component {
  config = {
    navigationBarTitleText: '订单详情',
    enablePullDownRefresh: true,
    backgroundTextStyle: 'dark',
    disableScroll: true
  }

  constructor () {
    super(...arguments)
    this.state = {
      ptKey: false,
      isFirst: true,
      orderId: '',
      isShowTip: true,
      isShowCancelReasonPanel: false,
      isShowRefundReasonPanel: false,
      isShowUserAuth: false,
      isShowUserAuthModal: false,
      cancelTips: [
        '订单取消后无法恢复。',
        '拆单后取消订单，所使用的优惠券不再返还。'
      ],
      cancelReason: [
        {
          desc: '不想买了'
        }, {
          desc: '选错了尺码'
        }, {
          desc: '太贵了，手滑点错'
        }, {
          desc: '我只是测试人员，点来测试的'
        }, {
          desc: '就是想取消，没什么原因'
        }]
    }
  }

  componentWillMount () {
    const ptKey = getLoginStatus()
    const {orderId} = this.$router.params
    const systemInfo = getSystemInfo()
    const userData = getGlobalData('userData')
    this.setState({
      ptKey,
      orderId,
      isFirst: true,
      isShowTip: true,
      isShowUserAuth,
      isIpx: systemInfo.isIpx,
      systemInfo: systemInfo
    })
    if (Taro.getEnv() === 'WEB') return
    let isShowUserAuth = false
    if (!userData) {
      isShowUserAuth = true
    }
  }

  componentDidShow () {
    this.init(true)
  }

  async onPullDownRefresh () {
    await this.init(false)
    Taro.stopPullDownRefresh()
  }

  init () {
    const orderId = this.state.orderId
    this.props.fetchOrderById(orderId)
    this.setState({
      isFirst: false
    })
  }

  showUserAuthModal = () => {
    this.setState({
      isShowUserAuthModal: true
    })
  }

  onHideUserAuthModal = () => {
    this.setState({
      isShowUserAuthModal: false
    })
  }

  onProcessAuthResult = userData => {
    this.setState({
      isShowUserAuthModal: false
    })
    if (userData.userInfo) {
      setGlobalData('userData', userData)
      this.setState({
        isShowUserAuth: false
      })
    }
  }

  gotoBrand (venderId) {
    if (venderId) {
      jumpUrl(`../../../shop/shop?venderId=${venderId}`)
    }
  }

  gotoDetail (skuId) {
    jumpUrl(`../../../detail/detail?skuId=${skuId}`)
  }

  closeTip = () => {
    this.setState({
      isShowTip: false
    })
  }

  payOrder = () => {
    Taro.showToast({
      title: '你点击了付款',
      icon: 'none'
    })
  }

  async deleteOrder (e) {
    const res = await Taro.showModal({
      title: '提示',
      content: '您确定要删除当前订单吗？',
      showCancel: true,
      cancelText: '容我想想',
      cancelColor: '#232321',
      confirmText: '确定删除',
      confirmColor: '#999999'
    })
    if (res.confirm) {
      Taro.showToast({
        icon: 'none',
        title: '你触发了删除订单'
      })
    }
  }

  contactService = () => {
    Taro.makePhoneCall({
      phoneNumber: '4006563355'
    })
  }

  getCancelReason = () => {
    this.setState({
      isShowCancelReasonPanel: true
    })
  }

  onHideCancelReason = () => {
    this.setState({
      isShowCancelReasonPanel: false
    })
  }

  hideRefundReasonPanel = () => {
    this.setState({
      isShowRefundReasonPanel: false
    })
  }

  onCancelOrder = (reason, e) => {
    this.props.fetchCancelOrder({
      orderId: this.state.orderId,
      cancelReasonText: reason.desc
    }, (res) => {
      Taro.showToast({
        icon: 'none',
        title: '订单取消成功，请稍后刷新'
      })
      setTimeout(() => {
        jumpUrl('../list/list', {
          method: 'switchTab'
        })
      }, 1500)
    })
  }

  render () {
    const {
      orderId,
      isShowTip,
      cancelTips,
      isShowCancelReasonPanel,
      isShowRefundReasonPanel,
      isFirst,
      isShowUserAuthModal,
      isShowUserAuth,
      isIpx,
      cancelReason
    } = this.state
    const {detail, refundReason} = this.props

    let {skuInfoList = [], shouldPayPrice = 0, shopInfo, dateSubmit = {}, orderState, payType, cancelReasonText} = this.props.orderDetail
    let shopInfoSrc
    let venderId

    let totalGoodsCount = 0
    skuInfoList = skuInfoList.slice(0).map(sku => {
      venderId = sku.venderId
      shopInfoSrc = shopInfo[sku.venderId].thumbnail
      const newSku = {...sku}
      newSku.imageUrl = sku.info.images[0]
      totalGoodsCount += newSku.num
      return newSku
    })

    const orderDate = `${getParseDay(dateSubmit.$date)} ${getParseTime(dateSubmit.$date)}`
    const orderStateStr = orderState === 1 ? '待支付' : '已取消'
    const canShowDetail = skuInfoList
    const freightPrice = 14

    return !isFirst && canShowDetail && (
      <View className='order_detail'>
        <ScrollView scrollY className="order_detail-scroll">
          <View className='user_detail'>
            {isShowTip && (orderState === 5 || orderState === 6) && <View className='detail_tip'>
              <View className='detail_tip_wrapper'>
                <View className='detail_tip_txt'>
                  <Text className='detail_tip_txt_tit'>温馨提示：</Text>
                  <Text className='detail_tip_txt_cnt'>小程序暂不支持申请维修售后，如有需要请前往APP。</Text>
                </View>
                <View className='detail_tip_close' onClick={this.closeTip} />
              </View>
            </View>}
            {isShowTip && (orderState === 1) && <View className='detail_tip'>
              <View className='detail_tip_wrapper'>
                <View className='detail_tip_txt'>
                  <Text className='detail_tip_txt_tit'>温馨提示：</Text>
                  <Text className='detail_tip_txt_cnt'>该订单需要在下单后24小时内完成支付，超时订单将会被取消。</Text>
                </View>
                <View className='detail_tip_close' onClick={this.closeTip} />
              </View>
            </View>}
            <View className='detail_tit'>
              <Text className='detail_num'>订单号：{orderId}</Text>
              <Text className='detail_status'>状态：{orderStateStr}</Text>
            </View>
            {<View className='detail_cancel'>
              <View className='detail_cancel_progress'>
                <Text>{orderState === 1 ? '订单进度：' : '取消原因：'}</Text><Text>{cancelReasonText}</Text>
              </View>
              <Text className='detail_arrow'>{'>'}</Text>
            </View>}
            <View className='detail_info detail_section'>
              <View className='detail_get detail_section_item'>
                <View className='detail_section_icon detail_get_icon'>
                  <Image className='detail_section_icon_img' src={iconImg1} />
                </View>
                <View className='detail_section_main detail_get_main'>
                  <View className='detail_get_hd detail_section_main_hd'>
                    <Text className='detail_section_main_hd_tit'>A小伙伴</Text>
                    <Text className='detail_section_main_hd_txt'>118******45</Text>
                  </View>
                  <Text className='detail_get_address'>广东省深圳市宝安区龙光世纪大厦</Text>
                </View>
              </View>
              {<View className='detail_express detail_section_item'>
                <View className='detail_section_icon detail_express_icon'>
                  <Image className='detail_section_icon_img' src={iconImg2} />
                </View>
                <View className='detail_section_main detail_express_main'>
                  <View className='detail_express_tit detail_section_main_hd'>
                    <Text className='detail_express_tit_name detail_section_main_hd_tit'>Taro商城配送</Text>
                    <Text className='detail_express_tit_num detail_section_main_hd_txt'>运单编号：8247023234</Text>
                  </View>
                  <View className='detail_section_main_bd'>
                    <Text className='detail_express_codtime'>期望配送时间：2020-01-12[周一] 09:00-19:00</Text>
                    <View className='detail_express_track'>
                      <View className='detail_express_track_left'>
                        <Text className='detail_express_track_txt'>你订单尚未支付，请去系统确认</Text>
                        <Text className='detail_express_track_time'>{orderDate}</Text>
                      </View>
                      <Text className='detail_arrow'>{'>'}</Text>
                    </View>
                  </View>
                </View>
              </View>}
            </View>
            <View className='detail_main detail_section'>
              <View className='user_detail_shop' onClick={this.gotoBrand.bind(this, venderId)}>
                <Image mode='scaleToFill' className='detail_shop_img' src={'http:' + shopInfoSrc} />
              </View>
              <View className='detail_goods detail_section_item'>
                <View className='detail_goods_list'>
                  {skuInfoList.map(sku => {
                    return (
                      <View className='detail_goods_item' key={sku.skuId} onClick={this.gotoDetail.bind(this, sku.skuId)}>
                        <View className='detail_goods_show'>
                          <Image className='detail_goods_img' src={sku.imageUrl} mode='aspectFit' />
                        </View>
                        <View className='detail_goods_info'>
                          <Text className='detail_goods_tit'>{sku.info.skuName}123</Text>
                          <View className='detail_goods_attr'>
                            {
                              sku.info.colorInfo.value &&
                              <Text className='detail_goods_attr_txt'>{sku.info.colorInfo.name}：{sku.info.colorInfo.value}</Text>
                            }
                            {
                              sku.info.sizeInfo.value &&
                              <Text className='detail_goods_attr_txt'>{sku.info.sizeInfo.name}：{sku.info.sizeInfo.value}</Text>
                            }
                          </View>
                          <View className='detail_goods_pc'>
                            <View className='detail_goods_price'>
                              <Text className='detail_goods_price_symbol'>￥</Text>
                              <Text className='detail_goods_price_txt'>{sku.info.price}</Text>
                            </View>
                            <Text className='detail_goods_count'>X{sku.num}</Text>
                          </View>
                        </View>
                      </View>
                    )
                  })}
                </View>
                <View className='detail_goods_total'>
                  <View className='detail_goods_total_count'>
                    <Text className='detail_goods_total_count_txt'>共{totalGoodsCount}件商品</Text>
                  </View>
                  <View className='detail_goods_total_account'>
                    <View className='detail_goods_total_item'>
                      <Text className='detail_goods_total_item_tit fs-m color-grey'>商品小计：</Text>
                      <View className='detail_goods_total_item_info'>
                        <Text className='detail_goods_total_item_symbol fs-m color-grey'>￥</Text>
                        <Text className='fs-m color-grey'>{parseMoney(shouldPayPrice - freightPrice)}</Text>
                      </View>
                    </View>
                    <View className='detail_goods_total_item'>
                      <Text className='detail_goods_total_item_tit fs-m color-grey'>运费：</Text>
                      <View className='detail_goods_total_item_info'>
                        <Text className='detail_goods_total_item_symbol fs-m color-grey'>￥</Text>
                        <Text className='fs-m color-grey'>{parseMoney(freightPrice)}</Text>
                      </View>
                    </View>
                    <View className='detail_goods_total_item detail_goods_total_item_stress'>
                      <Text className='detail_goods_total_item_tit fs-m'>支付金额：</Text>
                      <View className='detail_goods_total_item_info'>
                        <Text className='detail_goods_total_item_symbol'>￥</Text>
                        <Text>{parseMoney(shouldPayPrice)}</Text>
                      </View>
                    </View>
                  </View>
                </View>
              </View>
            </View>
            <View className='detail_finance detail_section'>
              <View className='detail_pay detail_section_item'>
                <View className='detail_section_icon detail_pay_icon'>
                  <Image className='detail_section_icon_img' src={iconImg3} />
                </View>
                <View className='detail_section_main detail_pay_main'>
                  <View className='detail_pay_hd detail_section_main_hd'>
                    <Text className='detail_section_main_hd_tit'>支付方式</Text>
                    <Text className='detail_section_main_hd_txt'>{payType === 4 ? '微信支付' : '货到付款'}</Text>
                  </View>
                </View>
              </View>
              <View className='detail_invoice detail_section_item noinvoice'>
                <View className='detail_section_icon detail_invoice_icon'>
                  <Image className='detail_section_icon_img' src={iconImg4} />
                </View>
                <View className='detail_section_main detail_invoice_main'>
                  <View className='detail_invoice_hd detail_section_main_hd'>
                    <Text className='detail_section_main_hd_tit'>发票信息</Text>
                    <Text className='detail_section_main_hd_txt'>我是发票信息啊啊啊</Text>
                  </View>
                  <View className='detail_invoice_bd detail_section_main_bd'>
                    <View className='detail_invoice_up'>
                      <Text className='detail_invoice_up_tit'>发票抬头：</Text>
                      <Text className='detail_invoice_up_txt'>发票抬头ABCDEFG</Text>
                    </View>
                    <View className='detail_invoice_cnt'>
                      <Text className='detail_invoice_cnt_tit'>发票内容：</Text>
                      <Text className='detail_invoice_cnt_txt'>发票内容LIJHUH</Text>
                    </View>
                    <View className='detail_invoice_get'>
                      <View className='detail_invoice_get_btn'>
                        <Text className='detail_invoice_get_btn_text'>查看发票</Text>
                      </View>
                    </View>
                  </View>
                </View>
              </View>
            </View>
            <View className='detail_ft'>
              <Text className='detail_ft_text'>下单时间：</Text>
              <Text className='detail_ft_text'>{orderDate}</Text>
            </View>
            {isShowCancelReasonPanel && <SelectPanel
              title='取消原因'
              subTitle='取消原因'
              tips={cancelTips}
              cancelBtnText='暂不取消'
              confirmBtnText='确定取消'
              detail={cancelReason}
              onClose={this.onHideCancelReason.bind(this)}
              onSelected={this.onCancelOrder.bind(this)} />}
            {isShowRefundReasonPanel && <SelectPanel
              title='退款原因'
              subTitle='退款原因'
              tips={cancelTips}
              cancelBtnText='暂不退款'
              confirmBtnText='确定退款'
              detail={refundReason}
              onClose={this.hideRefundReasonPanel.bind(this)}
              onSelected={this.refundOrder.bind(this)} />}
            {isShowUserAuthModal && <Modal
              title='授权提示'
              contentText='TARO商城请求获取授权信息，以便记录您的订单'
              onCancelCallback={this.onHideUserAuthModal.bind(this)}
              onConfirmCallback={this.onProcessAuthResult.bind(this)}
              isAuth={true} />}
          </View>
        </ScrollView>
        <View className='detail_ops'>
          {/** 已取消/已完成 */}
          {(orderState === -1 || orderState === 5 || orderState === 6) && <View className={'detail_ops_btns' + (isIpx ? ' fix_ipx' : '')}>
            <Button className='detail_ops_btn' onClick={this.deleteOrder}>删除订单</Button>
            <View className='detail_ops_split' />
            <Button className='detail_ops_btn' onClick={this.contactService}>联系客服</Button>
          </View>}
          {/** 待支付 */}
          {(orderState === 1) && <View className='detail_ops_btns'>
            <Text className='detail_ops_btn' onClick={this.getCancelReason}>取消订单</Text>
            <View className='detail_ops_split' />
            <Text className='detail_ops_btn' onClick={this.contactService}>联系客服</Text>
            {!isShowUserAuth
              ? <View className='detail_ops_pay' onClick={this.payOrder.bind(this, detail)}><Text>马上付款</Text></View>
              : <View className='detail_ops_pay' onClick={this.showUserAuthModal}><Text>马上付款</Text></View>}
          </View>}
        </View>
      </View>
    )
  }
}

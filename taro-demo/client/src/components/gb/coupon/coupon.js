import Taro, {Component} from '@tarojs/taro'
import {View, Text, Image} from '@tarojs/components'
import {getUuid, getLoginStatus, getAreas, jumpUrl, log} from '../../../utils/util'

export class CouponItem extends Component {
  state = {}
  constructor () {
    super(...arguments)
  }

  toUseCoupon (coupon, cantUse, e) {
    let parseCantUse = typeof cantUse === 'boolean' && cantUse
    if (parseCantUse) return
    let couponBatch = coupon.batchId
    let couponInfo = `${coupon.quota}-${coupon.discount}`
    jumpUrl(`../list/list?couponBatch=${couponBatch}&couponInfo=${couponInfo}`)
    log.autoClick(e)
  }

  async selectCoupon (coupon, isBalance, cantUse) {
    let parseCantUse = typeof cantUse === 'boolean' && cantUse
    if (!isBalance || parseCantUse) return 
    let cantSelect = coupon.showDesc
    if (cantSelect) {
      Taro.showToast({
        icon: 'none',
        title: '请先取消选中的优惠券'
      })
      return
    }
    let balanceCoupon = this.$parent
    let {fetchCouponInfo, balanceInfo} = balanceCoupon.props
    let {cachedCoupons} = balanceCoupon.state
    let newCachedCoupons = {}

    if (coupon.selected) {
      for (let i in cachedCoupons) {
        if (coupon.id !== i) {
          newCachedCoupons[i] = coupon.discount
        }
      }
    } else {
      newCachedCoupons = cachedCoupons || {}
      newCachedCoupons[coupon.id] = coupon.discount
    }

    balanceCoupon.setState({
      cachedCoupons: newCachedCoupons
    }, async () => {
      let body = JSON.stringify({"cachedCoupons": newCachedCoupons})
      let uuid = await getUuid()
      let ptKey = await getLoginStatus()
      let areas = await getAreas()
      areas = areas ? areas.areas : null
      let address = balanceInfo.address
      areas = areas
        ? areas
        : (address ? `${address.provinceId}-${address.cityId}-${address.countyId}-${address.townId}`: null)

      fetchCouponInfo({
        uuid,
        areas,
        body
      }, {
        'cookie': `pt_key=${ptKey}`
      })
    })
    log.autoClick(e)
  }

  render () {
    const {coupon, cantSelect, isBalance, elevel, eid, eparam} = this.props
    let curCantSelect = cantSelect || (isBalance && coupon && coupon.showDesc)
    let useText = '立即使用'
    if (coupon && cantSelect) {
      switch (coupon.state) {
        case 3:
          useText = '已使用'
          break
        case 1000:
          useText = '已过期'
          break
      }
    }
    return (
      <View onClick={this.selectCoupon.bind(this, coupon, isBalance, cantSelect)} className={curCantSelect ? 'coupon_item cantSelect' : 'coupon_item'} data-elevel={elevel} data-eid={eid} data-eparam={2 + eparam}>
        <View className='coupon_tit'></View>
        {isBalance && !cantSelect && <View className={coupon && coupon.selected ? 'coupon_select selected' : 'coupon_select'}></View>}
        <View className='coupon_value'>¥
          <Text>{coupon && coupon.discount}</Text>
        </View>
        <View className='coupon_need_money'>
          <Text>满{coupon && coupon.quota}元使用</Text>
        </View>
        <View className="coupon_limit">{coupon && coupon.limitStr}</View>
        <View className="coupon_time">{coupon && coupon.timeStr}</View>
        {!isBalance && <View className="coupon_btn_use" onClick={this.toUseCoupon.bind(this, coupon, cantSelect)} data-elevel={elevel} data-eid={eid} data-eparam={2 + eparam}>{useText}</View>}
        {isBalance && curCantSelect && <View className="coupon_use_need">*{coupon && coupon.showDesc}</View>}
      </View>
    )
  }
}

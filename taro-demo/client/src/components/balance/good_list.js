import Taro, { Component } from '@tarojs/taro'
import { View, Text, Image } from '@tarojs/components'
import { parseMoney } from '../../utils/util'
import './good_list.scss'

export default class GoodList extends Component {
  navigateTo (id) {
    let url = `/pages/shop/shop?venderId=${id}`
    jumpUrl(url)
  }

  render () {
    let {payCommodities = []} = this.props

    payCommodities = payCommodities.map(item => {
      let totalNum = 0
      let totalPrice = 0
      const newSkus = item.skus.map(skuItem => {
        totalNum += parseInt(skuItem.num)
        totalPrice += totalNum * parseInt(skuItem.main.price)
        if (!/http:\/\/|https:\/\//.test(skuItem.main.images[0])) {
          skuItem.imgUrl = `https://${skuItem.main.images[0]}`
        } else {
          skuItem.imgUrl = skuItem.main.images[0]
        }
        return skuItem
      })
      item.skus = newSkus
      item.totalNum = totalNum
      item.totalPrice = parseMoney(totalPrice)
      return item
    })

    return (
      <View className='balance_good_wrap balance_good'>
        {
          payCommodities.map(item => {
            return (
              <View className='balance_box'>
                <View className='balance_good_shop'>
                  <Image className='balance_good_shop_image' src={'http:' + item.shop.thumbnail} mode='aspectFill' />
                </View>
                <View className='balance_slice' />
                {item.skus.map((sku) => {
                  console.log(1)
                  return <View className='balance_good_items' key={sku.skuId}>
                    <View className='balance_good_item'>
                      <View className='balance_good_items_pic'>
                        <Image className='balance_good_items_pic_image' src={sku.imgUrl} mode='aspectFill' />
                      </View>
                      <View className='info_wrap'>
                        <View className='info'>
                          <Text className='info_name balance_grey'>{sku.main.skuName}</Text>
                          <Text className='info_size balance_grey'>{sku.sizeInfo.name}: {sku.sizeInfo.value}</Text>
                          <Text className='info_size balance_grey'>{sku.colorInfo.name}: {sku.colorInfo.value}</Text>
                          <Text className='info_support balance_grey'>支持7天无理由退换</Text>
                        </View>
                        <View className='price'>
                          <Text className='price_val'>¥{sku.main.price}</Text>
                          <Text className='price_num'>X{sku.num}</Text>
                        </View>
                      </View>
                    </View>
                  </View>
                })}
                <View className='balance_slice' />
                <View className='balance_good_count'>
                  <Text className='count_text'>共&nbsp;{item.totalNum}&nbsp;件商品</Text>
                  <Text className='count_total_text'>小计：<Text>¥{item.totalPrice}</Text></Text>
                </View>
              </View>
            )
          })
        }
      </View>
    )
  }
}

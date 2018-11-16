import Taro, { Component } from '@tarojs/taro'
import { View, Text, Image } from '@tarojs/components'
import './express.scss'

export default class Express extends Component {
  render () {
    return (
      <View className='balance_box balance_good'>
        <View className='balance_good_addr'>
          {/*<View className='addr_icon' />*/}
          <Image className='balance_good_addr_icon' src='https://static.360buyimg.com/tp-statics/2018-4-20/m/img/ic_shdz46x60@2x.png' />
          <View className='addr_detail'>
            <View className='addr_detail_header'>
              <Text className='addr_detail_grey'>收货人A</Text>
              <Text className='addr_detail_grey'>&nbsp;123456789&nbsp;</Text>
              <Text className='addr_default'>&nbsp;默认</Text>
            </View>
            <Text className='addr_text'>广东省深圳市宝安区龙光世纪大厦</Text>
          </View>
          <Image className='balance_box_arrow' src='https://static.360buyimg.com/tp-statics/2018-4-20/m/img/ic_right_arrow@2x.png'/>
        </View>
        <View className='balance_slice' />
        <View className='balance_good_express'>
          <Text className='balance_good_label'>配送</Text>
          <View className='val_wrap'>
            <View className='val_express'>
              <Text className='expredd_grey'>TARO商城配送</Text>
              <Text className='express_fee'>
                <Text className='express_fee_small'>¥</Text>
                {this.props.freightPrice}
              </Text>
            </View>
            <Text className='val_time'>TARO商城配送默认时间</Text>
          </View>
          <Image className='balance_box_arrow' src='https://static.360buyimg.com/tp-statics/2018-4-20/m/img/ic_right_arrow@2x.png'/>
        </View>
      </View>
    )
  }
}

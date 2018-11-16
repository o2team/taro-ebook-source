import Taro, { Component } from '@tarojs/taro'
import { View, Label, Input, Radio, Text } from '@tarojs/components'
import { connect } from '@tarojs/redux'

import AreaSelect from '../../../../components/areaSelect/areaSelect'
import { fetchAddress, fetchNewAddress, fetchUpdateAddress } from '../../../../actions/address'
import { getLoginStatus, throttle, aesEncrypt, jumpUrl } from '../../../../utils/util'

import './edit.scss'

class AddressEdit extends Component {
  config = {
    navigationBarTitleText: '新增地址',
    backgroundColor: '#f2efef'
  }

  constructor() {
    super(...arguments)
    this.state = {
      name: {
        value: '',
        isFocus: false
      },
      phone: {
        value: '',
        isFocus: false
      },
      area: {
        ids: '',
        value: ''
      },
      address: {
        value: '',
        isFocus: false
      },
      isDefault: false,
      isSelectArea: false,
      isEdit: false,
      isSelectAreaCloseAni: false
    }
    // 有时候会出现点击后不能清除内容的bug，是失焦，获焦事件不断触发导致
    this.isClearInput = false
  }

  componentWillMount() {
    this.addressId = this.$router.params.addressId
    if (this.addressId) {
      Taro.setNavigationBarTitle({
        title: '编辑地址'
      })
      this.setState({ isEdit: true})
      this.props.fetchAddress(this.addressId, this.setAddress)
    }
  }

  componentDidShow () {}

  setAddress = () => {
    const { addressData } = this.props
    if (addressData.id) {
      this.setState({
        name: {
          value: addressData.name,
          isFocus: false
        },
        phone: {
          value: addressData.mobile,
          isFocus: false
        },
        area: {
          ids: `${addressData.provinceId}-${addressData.cityId}-${addressData.countyId}-${addressData.townId}`,
          value: `${addressData.provinceName}${addressData.cityName}${addressData.countyName}${addressData.townName}`
        },
        address: {
          value: addressData.addressDetail,
          isFocus: false
        },
        isDefault: addressData.addressDefault === 1
      })
    }
  }

  resetAddress () {
    this.addressId = ''
    this.setState({
      name: {
        value: '',
        isFocus: false
      },
      phone: {
        value: '',
        isFocus: false
      },
      area: {
        ids: '',
        value: ''
      },
      address: {
        value: '',
        isFocus: false
      },
      isDefault: false,
      isSelectArea: false,
      isEdit: false
    })
  }

  hanldeChange = (type, e) => {
    const data = this.state[type]
    const value = e.detail.value
    this.setState({
      [type]: {
        value: value,
        isFocus: Boolean(value)
      }
    })
  }

  handleFoucs = (type) => {
    if (this.isClearInput) return
    const data = this.state[type]
    if (!data.value) return
    this.setState({
      [type]: {
        value: data.value,
        isFocus: true
      }
    })
  }

  handleBlur = (type) => {
    if (this.isClearInput) return
    const data = this.state[type]
    this.setState({
      [type]: {
        value: data.value,
        isFocus: false
      }
    })
  }

  handleAreaSelect () {
    this.setState({ isSelectArea: true })
  }

  clearInputData = (type) => {
    this.isClearInput = true
    this.setState({
      [type]: '',
      isFocus: false
    }, () => {
      this.isClearInput = false
    })
  }

  selectDefault = () => {
    const { isDefault } = this.state
    this.setState({ isDefault: !isDefault })
  }

  onAreaSelect = (area) => {
    if (area.areasName) {
      this.setState({
        area: {
          ids: area.areas,
          value: area.areasName
        }
      })
    }
    this.setState({ isSelectArea: false })
  }

  handleConfirm () {
    const { fetchNewAddress } = this.props
    const { name, phone, area, address, isDefault, isEdit } = this.state
    const phoneRep = /^1[2-9](\d|\*){9}$/
    if (!name.value) {
      Taro.showToast({
        icon: 'none',
        title: '请填写收货人'
      })
      return
    }

    if (!phone.value) {
      Taro.showToast({
        icon: 'none',
        title: '请填写手机号码'
      })
      return
    }

    if (!phoneRep.test(phone.value)) {
      Taro.showToast({
        icon: 'none',
        title: '非法的手机号码'
      })
      return
    }

    if (!area.ids) {
      Taro.showToast({
        icon: 'none',
        title: '请填写所在区'
      })
      return
    }

    if (!address.value) {
      Taro.showToast({
        icon: 'none',
        title: '请填写详细地址'
      })
      return
    }

    let areasArr = area.ids.split('-')
    const params = {
      operate: 16,
      provinceId: areasArr[0],
      cityId: areasArr[1],
      countyId: areasArr[2],
      name: aesEncrypt(name.value),
      addressDetail: address.value,
      mobile: aesEncrypt(phone.value),
      addressDefault: isDefault ? 1 : 0,
      secret: '1'
    }

    areasArr[3] && (params.townId = areasArr[3])

    if (isEdit) {
      params.operate = 13
      params.id = this.addressId

      this.fetchUpdateAddress(params, () => {
        Taro.showToast({
          icon: 'none',
          title: '编辑收货地址成功'
        })
        setTimeout(() => {
          Taro.navigateBack()
        }, 300)
      })
    } else {
      this.fetchNewAddress(params, () => {
        Taro.showToast({
          icon: 'none',
          title: '新增收货地址成功'
        })
        Taro.setStorage({
          key:'areaobj', data:{
          areas: `${params.provinceId}-${params.cityId}-${params.countyId}-${params.townId || 0}`,
          areasName: `${area.value}${address.value}`
        }})
        setTimeout(() => {
          Taro.navigateBack({
            delta: 2
          })
          // jumpUrl('/pages/balance/index/balance', {
          //   method: 'redirectTo'
          // })
        }, 300)
      })
    }
  }

  componentWillUnmount() {
    this.resetAddress()
  }

  render() {
    const { isFetching, addressData } = this.props
    let showAddressDefault = addressData !== 1 && !addressData.addressDefault
    if (this.$router.params && !this.$router.params.addressId) { // 新增地址页面则显示
      showAddressDefault =  true
    }
    const { name, phone, area, address, isDefault, isSelectArea, isEdit } = this.state
    if (isFetching) {
      Taro.showLoading({ title: '请求加载中...' })
    } else {
      Taro.hideLoading()
    }

    return (
      <View className='address_edit'>
        <View className='edit_wp'>
          <View className='edit_item first'>
            <Label className='edit_item_wp'>
              <Text className='edit_item_text'>收货人</Text>
              <Input className='edit_item_input people'
                value={name.value}
                onFocus={this.handleFoucs.bind(null, 'name')}
                onBlur={this.handleBlur.bind(null, 'name')}
                onInput={this.hanldeChange.bind(null, 'name')}
                placeholder='收件人姓名' placeholder-style='color: #999' />
              <Text className={name.isFocus ? 'clear_icon' : 'clear_icon hide'} onClick={this.clearInputData.bind(null, 'name')} />
            </Label>
          </View>
          <View className='edit_item'>
            <Label className='edit_item_wp'>
              <Text className='edit_item_text'>联系方式</Text>
              <Input className='edit_item_input phone'
                value={phone.value}
                onFocus={this.handleFoucs.bind(null, 'phone')}
                onBlur={this.handleBlur.bind(null, 'phone')}
                onInput={this.hanldeChange.bind(null, 'phone')}
                maxlength='11'
                placeholder='电话号码' placeholder-style='color: #999' type='number' />
              <Text className={phone.isFocus ? 'clear_icon' : 'clear_icon hide'} onClick={this.clearInputData.bind(null, 'phone')} />
            </Label>
          </View>
          <View className='edit_item'>
            <Label className='edit_item_wp'>
              <Text className='edit_item_text'>所在地区</Text>
              <Input className='edit_item_input area'
                onClick={this.handleAreaSelect}
                disabled={true}
                value={area.value}
                placeholder='请选择所在地区' placeholder-style='color: #999' />
              <Text className='arrow_icon' />
            </Label>
          </View>
          <View className='edit_item'>
            <Label className='edit_item_wp'>
              <Text className='edit_item_text'>详细地址</Text>
              <Input className='edit_item_input address'
                value={address.value}
                onFocus={this.handleFoucs.bind(null, 'address')}
                onBlur={this.handleBlur.bind(null, 'address')}
                onInput={this.hanldeChange.bind(null, 'address')}
                placeholder='街道、楼牌号等' placeholder-style='color: #999' />
              <Text className={address.isFocus ? 'clear_icon' : 'clear_icon hide'} onClick={this.clearInputData.bind(null, 'address')} />
            </Label>
          </View>
          {showAddressDefault && <View className='edit_item default'>
            <Label className='edit_item_wp'>
              <Text className='edit_item_text'>设为默认地址</Text>
              <Radio className='edit_item_radio' check={isDefault} />
              <Text className={isDefault ? 'radio_icon on' : 'radio_icon'} onClick={this.selectDefault} />
            </Label>
          </View>}
        </View>
        <View className='edit_confirm' onClick={this.handleConfirm}>{isEdit ? '保存' : '保存并使用'}</View>
        {isSelectArea
          ? <View className='edit_select_shade'>
            <AreaSelect
              type='bottom'
              confirmArea={this.onAreaSelect}
              areas={area.ids}
              needUpdate={isSelectArea}
            />
          </View>
          : null}
      </View>
    )
  }
}

export default connect(({
  userAddress
}) => ({
  addressData: userAddress.addressData,
  isFetching: userAddress.isFetching
}), (dispatch) => ({
  fetchAddress(...args) {
    dispatch(fetchAddress(...args))
  },
  fetchNewAddress(...args) {
    dispatch(fetchNewAddress(...args))
  },
  fetchUpdateAddress(...args) {
    dispatch(fetchUpdateAddress(...args))
  },
}))(AddressEdit)

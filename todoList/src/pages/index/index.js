import Taro, { Component } from '@tarojs/taro'
import { View, Text, Input } from '@tarojs/components'
import './index.scss'

export default class Index extends Component {
  config = {
    navigationBarTitleText: '首页'
  }

  constructor (props) {
    super (props)
    this.state = {
      // 创建一个初始的 Todolist
      list: [
        'get up',
        'coding',
        'sleep',
      ],
      inputVal: ''
    }
  }

  // ... 生命周期函数，暂时不需要关注

  addItem () {
    let { list } = this.state
    const inputVal = this.inputVal
    if (inputVal == '') return
    else{
      list.push(inputVal)
    }
    this.setState({
      list,
      inputVal: ''
    })
  }

  delItem (index) {
    let { list } = this.state
    list.splice(index, 1)
    this.setState({
      list
    })
  }

  inputHandler (e) {
    // 不参与渲染的变量可不使用state储存，提高性能
    this.inputVal = e.target.value
  }

  render () {
    let { list, inputVal } = this.state

    return (
      <View className='index'>
        <Input className='input' type='text' value={inputVal} onInput={this.inputHandler.bind(this)} />
        <Text className='add' onClick={this.addItem.bind(this)}>添加</Text>
        <View className='list_wrap'>
          <Text>Todo list</Text>
          {
            list.map((item, index) => {
              return <View className='list'>
                <Text>{index + 1}.{item}</Text>
                <Text className='del' onClick={this.delItem.bind(this, index)}>删除</Text>
              </View>
            })
          }
        </View>
      </View>
    )
  }
}

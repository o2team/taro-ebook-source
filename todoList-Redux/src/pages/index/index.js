import Taro, { Component } from '@tarojs/taro'
import { View, Input, Text } from '@tarojs/components'
import { connect } from '@tarojs/redux'
import './index.scss'

import { add, del } from '../../actions/index'

class Index extends Component {
  config = {
    navigationBarTitleText: '首页'
  }

  constructor () {
    super ()

    this.state = {
      newTodo: ''
    }
  }

  componentDidMount () {
    
  }

  saveNewTodo (e) {
    let { newTodo } = this.state
    if (!e.detail.value || e.detail.value === newTodo) return

    this.setState({
      newTodo: e.detail.value
    })
  }

  addTodo () {
    let { newTodo } = this.state
    let { add } = this.props
    
    if (!newTodo) return

    add(newTodo)
    this.setState({
      newTodo: ''
    })
  }

  delTodo (id) {
    let { del } = this.props
    del(id)
  }

  render () {
    // 获取未经处理的todos并展示
    let { newTodo } = this.state
    let { todos, add, del } = this.props  

    const todosJsx = todos.map(todo => {
      return (
        <View className='todos_item'><Text>{todo.text}</Text><View className='del' onClick={this.delTodo.bind(this, todo.id)}>-</View></View>
      )
    })

    return (
      <View className='index todos'>
        <View className='add_wrap'>
          <Input placeholder="填写新的todo" onBlur={this.saveNewTodo.bind(this)} value={newTodo} />
          <View className='add' onClick={this.addTodo.bind(this)}>+</View>
        </View>
        <View>{ todosJsx }</View>  
      </View>
    )
  }
}

export default connect (({ todos }) => ({
  todos: todos.todos
}), (dispatch) => ({
  add (data) {
    dispatch(add(data))
  },
  del (id) {
    dispatch(del(id))
  }
}))(Index)


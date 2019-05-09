import { actionTypes } from '../action'

const defaultState = {
  inputValue: '3.25-3.31',
  list: [
    '登录',
    '注册',
    '高级表单',
    '数据可视化',
    '路由',
    '权限控制',
    '抽奖',
    'loading',
    '弹窗',
  ]
}

export default (previousState = defaultState, action) => {
  const newState = JSON.parse(JSON.stringify(previousState))
  if (action.type === actionTypes.CHANGE_INPUT_VALUE) {
    newState.inputValue = action.value
  }
  if (action.type === actionTypes.ADD_TODO_ITEM) {
    if (newState.inputValue !== '') {
      if (newState.list === undefined) {
        newState.list = []
      }
      newState.list.push(newState.inputValue)
      newState.inputValue = ''
    }
  }
  if (action.type === actionTypes.DELETE_TODO_ITEM) {
    newState.list.splice(action.index, 1)
  }
  if (action.type === actionTypes.INIT_LIST) {
    newState.list = action.data.list
  }
  return newState
}
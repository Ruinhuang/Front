import { actionTypes } from '../action'

const defaultState = {
  isLogin: false,
  user: {userType:3},
  userType: undefined,
  token: undefined,
}

export default (previousState = defaultState, action) => {

  const newState = JSON.parse(JSON.stringify(previousState))

  if (action.type === actionTypes.CLEAR_LOGIN_DATA) {
    newState.isLogin = false
    newState.user = {}
    newState.token = undefined
    newState.userType = undefined
  }

  if (action.type === actionTypes.SAVE_LOGIN_DATA) {
    newState.isLogin = true
    //传来的data就是获取的user对象
    newState.user = action.data
    newState.token = action.data.token
    newState.userType = action.data.userType
  }

  return newState
}
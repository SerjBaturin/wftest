import { combineReducers } from 'redux'
import some from './some'
import login from './login'
import ping from './ping'

export default combineReducers({
  some,
  login,
  ping,
})

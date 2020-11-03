import { combineReducers } from 'redux'
import some from './some'
import login from './login'
import ping from './ping'
import companyId from './companyId'
import cases from './cases'

export default combineReducers({
  some,
  login,
  ping,
  companyId,
  cases
})

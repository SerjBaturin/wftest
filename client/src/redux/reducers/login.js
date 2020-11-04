import { LOGIN, LOGOUT } from '../types'

const login = (state = '', action) => {
  switch (action.type) {
    case LOGIN:
      return action.payload.user
    case LOGOUT: 
      return ''
    default:
      return state
  }
}

export default login

import { LOGIN } from '../types'

const login = (state = '', action) => {
  switch (action.type) {
    case LOGIN:
      return action.payload.user
    default:
      return state
  }
}

export default login

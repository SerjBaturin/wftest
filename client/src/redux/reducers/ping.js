import { PING, LOGOUT } from '../types'

const ping = (state = '', action) => {
  switch (action.type) {
    case PING:
      return action.payload
    case LOGOUT:
      return ''
    default:
      return state
  }
}

export default ping

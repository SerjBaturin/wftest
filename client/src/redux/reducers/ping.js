import { PING } from '../types'

const ping = (state = '', action) => {
  switch (action.type) {
    case PING:
      return action.payload
    default:
      return state
  }
}

export default ping

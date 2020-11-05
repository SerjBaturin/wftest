import { CASES, UPDATE } from '../types'

const cases = (state = '', action) => {
  switch (action.type) {
    case CASES:
      return action.payload
    case UPDATE: 
      return action.payload
    default:
      return state
  }
}

export default cases

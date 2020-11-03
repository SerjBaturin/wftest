import { CASES } from '../types'

const cases = (state = '', action) => {
  switch (action.type) {
    case CASES:
      return action.payload
    default:
      return state
  }
}

export default cases

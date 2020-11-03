import { SET_COMPANY_ID } from '../types'

const companyId = (state = '', action) => {
  switch (action.type) {
    case SET_COMPANY_ID:
      return action.payload
    default:
      return state
  }
}

export default companyId

import { SET_COMPANY_ID, LOGOUT } from '../types'

const companyId = (state = '', action) => {
  switch (action.type) {
    case SET_COMPANY_ID:
      return action.payload
    case LOGOUT:
      return ''
    default:
      return state
  }
}

export default companyId

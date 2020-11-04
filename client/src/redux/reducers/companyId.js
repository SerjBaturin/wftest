import { SET_COMPANY_ID, LOGOUT, CHANGE_SHOP } from '../types'

const companyId = (state = '', action) => {
  switch (action.type) {
    case SET_COMPANY_ID:
      return action.payload
    case CHANGE_SHOP:
      return ''
    case LOGOUT:
      return ''
    default:
      return state
  }
}

export default companyId

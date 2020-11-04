import {
  LOGIN,
  LOGIN_ASYNC,
  PING,
  PING_ASYNC,
  CASES_ASYNC,
  CASES,
  SET_COMPANY_ID,
  LOGOUT,
} from '../types'

export const loginActionAsync = (data) => ({ type: LOGIN_ASYNC, payload: data })
export const loginAction = (data) => ({ type: LOGIN, payload: data })
export const pingActionAsync = () => ({ type: PING_ASYNC })
export const pingAction = (data) => ({ type: PING, payload: data })
export const casesActionAsync = (companyId) => ({
  type: CASES_ASYNC,
  payload: companyId,
})
export const casesAction = (data) => ({ type: CASES, payload: data })
export const setCompanyId = (companyId) => ({
  type: SET_COMPANY_ID,
  payload: companyId,
})
export const logout = () => {
  localStorage.removeItem('est_session')
  return {
    type: LOGOUT,
  }
}

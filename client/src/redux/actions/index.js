import {
  LOGIN,
  LOGIN_ASYNC,
  PING,
  PING_ASYNC,
  CASES_ASYNC,
  CASES,
  SET_COMPANY_ID,
  LOGOUT,
  CHANGE_SHOP,
  UPDATE,
  UPDATE_CASES_ASYNC,
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
export const setCompanyIdAction = (companyId) => ({
  type: SET_COMPANY_ID,
  payload: companyId,
})
export const logoutAction = () => {
  localStorage.removeItem('est_session')
  return {
    type: LOGOUT,
  }
}
export const changeShopAction = () => ({ type: CHANGE_SHOP })
export const updateCasesAction = (data) => ({ type: UPDATE, payload: data })
export const updateCasesActionAsync = (data) => ({
  type: UPDATE_CASES_ASYNC,
  payload: data,
})

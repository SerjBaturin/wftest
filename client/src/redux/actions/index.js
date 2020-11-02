import { LOGIN, LOGIN_ASYNC } from '../types'

export const loginActionAsync = (data) => ({ type: LOGIN_ASYNC, payload: data })
export const loginAction = (data) => ({ type: LOGIN, payload: data })

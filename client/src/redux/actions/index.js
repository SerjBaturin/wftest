import { LOGIN, LOGIN_ASYNC, PING, PING_ASYNC } from '../types'

export const loginActionAsync = (data) => ({ type: LOGIN_ASYNC, payload: data })
export const loginAction = (data) => ({ type: LOGIN, payload: data })
export const pingActionAsync = () => ({ type: PING_ASYNC, })
export const pingAction = (data) => ({ type: PING, payload: data  })

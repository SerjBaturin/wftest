import { takeEvery, put } from 'redux-saga/effects'
import axios from 'axios'

import { LOGIN_ASYNC } from '../types'
import { loginAction } from '../actions'

// Get action from connected component
export function* pingSaga() {
  yield takeEvery('PING_ASYNC', fetchData)
}

// Saga Worker
// if you need CALL method - needs to arguments, devide your request
function* fetchData(action) {
  try {
    const user = yield axios('/api/ping')
    // yield put(loginAction(user.data))
    yield console.log('OK', user.data)
  } catch (err) {
    yield console.log(err)
  }
}

import { takeEvery, put } from 'redux-saga/effects'
import axios from 'axios'

import { LOGIN_ASYNC } from '../types'
import { loginAction } from '../actions'

// Get action from connected component
export function* loginSaga() {
  yield takeEvery(LOGIN_ASYNC, fetchData)
}

// Saga Worker
// if you need CALL method - needs to arguments, devide your request
function* fetchData(action) {
  try {
    const user = yield axios.post('/api/login', action.payload)
    yield put(loginAction(user.data))
  } catch (err) {
    yield console.log(err)
  }
}

import { takeEvery, put } from 'redux-saga/effects'
import axios from 'axios'

import { PING_ASYNC } from '../types'
import { pingAction } from '../actions'

// Get action from connected component
export function* pingSaga() {
  yield takeEvery(PING_ASYNC, fetchData)
}

// Saga Worker
// if you need CALL method - needs to arguments, devide your request
function* fetchData() {
  try {
    const estSession = localStorage.getItem('est_session')
    const user = yield axios('/api/ping', {
      headers: {
        Authorization: `Bearer ${estSession}`,
      },
    })
    yield put(pingAction(user.data.user))
  } catch (err) {
    yield console.log(err)
  }
}

import { takeEvery, put } from 'redux-saga/effects'
import axios from 'axios'

import { CASES_ASYNC } from '../types'
import { casesAction } from '../actions'

// Get action from connected component
export function* casesSaga() {
  yield takeEvery(CASES_ASYNC, fetchData)
}

// Saga Worker
// if you need CALL method - needs to arguments, devide your request
function* fetchData(action) {
    try {
      const estSession = localStorage.getItem('est_session')
      const cases = yield axios('/api/cases', {
        headers: {
          Authorization: `Bearer ${estSession}`,
        },
        params: {
          company_id: action.payload
        }
      })
      yield put(casesAction(cases.data))
    } catch (err) {
      yield console.log(err)
    }
  }

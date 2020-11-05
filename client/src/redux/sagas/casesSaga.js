import { takeEvery, put, fork, all } from 'redux-saga/effects'
import axios from 'axios'

import { CASES_ASYNC, UPDATE, UPDATE_CASES_ASYNC } from '../types'
import { casesAction } from '../actions'

function* fetchCases() {
  yield takeEvery(CASES_ASYNC, fetchData)
}

function* updateCases() {
  yield takeEvery(UPDATE, updateData)
}

function* updateCasesAsync() {
  yield takeEvery(UPDATE_CASES_ASYNC, updateDataAsync)
}

function* fetchData(action) {
  try {
    const estSession = localStorage.getItem('est_session')
    const cases = yield axios('/api/cases', {
      headers: {
        Authorization: `Bearer ${estSession}`,
      },
      params: {
        company_id: action.payload,
      },
    })
    const data = cases.data.config.data.list.map((config) => {
      let result = config
      result.cases = []
      const params = cases.data.params.data
      const casesArr = cases.data.cases.data
      const wf_params = params.filter(
        (param) => param.param_name === 'wf_status'
      )
      wf_params.map((obj) => {
        const envID = Number(obj.envelope_id)
        const statusID = Number(obj.param_value)
        const caseObj = casesArr.find((obj) => obj.envelope_id === envID)
        if (Number(config.status_id) === statusID && caseObj !== undefined) {
          result.cases.push(caseObj)
        }
      })
      return result
    })
    yield put(casesAction(data))
  } catch (err) {
    yield console.log(err)
  }
}

function* updateData(action) {
  try {
    yield put(casesAction(action.payload))
  } catch (err) {
    yield console.log(err)
  }
}

function* updateDataAsync(action) {
  const params = action.payload
  try {
    const estSession = localStorage.getItem('est_session')
    yield axios('/api/cases', {
      headers: {
        Authorization: `Bearer ${estSession}`,
      },
      params: {
        company_id: params.company_id,
        date: params.date,
        envelope_id: params.envelope_id,
        from_wf_status: params.from_wf_status,
        to_wf_status: params.to_wf_status,
        user_id: params.user_id
      },
    })
  } catch (err) {
    yield console.log(err)
  }
}

function* casesSaga() {
  yield all([fork(fetchCases), fork(updateCases), fork(updateCasesAsync)])
}

export default casesSaga

import { takeEvery, put, fork, all } from 'redux-saga/effects'
import axios from 'axios'

import { CASES_ASYNC, UPDATE } from '../types'
import { casesAction } from '../actions'

function* fetchCases() {
  yield takeEvery(CASES_ASYNC, fetchData)
}

function* updateCases() {
  yield takeEvery(UPDATE, updateData)
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

function* casesSaga() {
  yield all([fork(fetchCases), fork(updateCases)])
}

export default casesSaga

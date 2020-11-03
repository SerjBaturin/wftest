import { all, fork } from 'redux-saga/effects'
import { loginSaga } from './loginSaga'
import { pingSaga } from './pingSaga'
import { casesSaga } from './casesSaga'

export default function* rootSaga() {
  yield all([fork(loginSaga), fork(pingSaga), fork(casesSaga)])
}

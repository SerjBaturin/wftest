import { all, fork } from 'redux-saga/effects'
import { loginSaga } from './loginSaga'
import { pingSaga } from './pingSaga'

export default function* rootSaga() {
  yield all([fork(loginSaga), fork(pingSaga)])
}

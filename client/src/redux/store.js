// To fix regeneratorRuntime issue for babel and generator functions
import "regenerator-runtime/runtime";
import { createStore, applyMiddleware } from "redux";
import { composeWithDevTools } from "redux-devtools-extension";
import createSagaMiddleware from "redux-saga";
import reducer from "./reducers";
import rootSaga from "./sagas";

// Create Saga
const sagaMiddleware = createSagaMiddleware();

// Connect Saga
const store = createStore(
  reducer,
  composeWithDevTools(applyMiddleware(sagaMiddleware)),
);

// Run Saga
sagaMiddleware.run(rootSaga);

export default store;

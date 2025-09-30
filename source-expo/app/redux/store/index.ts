import {configureStore} from '@reduxjs/toolkit';
import {persistStore} from 'redux-persist';
import createSagaMiddleware from 'redux-saga';
import logger from 'redux-logger';

import rootReducer from '../reducers';
import rootSagas from '../sagas';

const sagaMiddleware = createSagaMiddleware();

const middleware: any = [sagaMiddleware];
if (process.env.NODE_ENV === 'development') {
  middleware.push(logger);
}

const store = configureStore({
  reducer: rootReducer,
  middleware: getDefaultMiddleware => {
    return getDefaultMiddleware({serializableCheck: false}).concat(middleware);
  },
});

sagaMiddleware.run(rootSagas);

const persist = persistStore(store);

export {store, persist};

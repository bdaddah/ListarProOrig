import {combineReducers} from 'redux';
import {persistReducer} from 'redux-persist';
import {Reducer} from '@reduxjs/toolkit';
import Api from '@api';
import {Action} from '@models+types';
import {actionTypes} from '@redux';

import authenticationReducer from './authentication';
import applicationReducer from './application';
import homeReducer from './home';
import wishlistReducer from './wishlist';
import discoveryReducer from './discovery';
import blogReducer from './blog';
import searchReducer from './search';
import listingReducer from './listing';
import reviewReducer from './review';

const rootPersistConfig = {
  key: 'root',
  storage: Api.storage,
  whitelist: ['application', 'authentication'],
  timeout: 10000,
};

const appReducer = combineReducers({
  authentication: authenticationReducer,
  application: applicationReducer,
  home: homeReducer,
  wishlist: wishlistReducer,
  discovery: discoveryReducer,
  blog: blogReducer,
  search: searchReducer,
  listing: listingReducer,
  review: reviewReducer,
});

const rootReducer: Reducer = (state, action: Action) => {
  if (action.type === actionTypes.CLEAR_REDUCER) {
    return appReducer(undefined, action);
  }
  return appReducer(state, action);
};

export default persistReducer(rootPersistConfig, rootReducer);

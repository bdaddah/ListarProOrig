import {all} from 'redux-saga/effects';
import applicationSagas from './application';
import authenticationSagas from './authentication';
import homeSagas from './home';
import discoverySagas from './discovery';
import blogSagas from './blog';
import wishlistSagas from './wishlist';
import searchSagas from './search';
import categorySagas from './category';
import listingSagas from './listing';
import reviewSagas from './review';
import bookingSagas from './booking';
import claimSagas from './claim';

export default function* rootSaga() {
  yield all([
    applicationSagas(),
    authenticationSagas(),
    homeSagas(),
    blogSagas(),
    discoverySagas(),
    wishlistSagas(),
    categorySagas(),
    searchSagas(),
    listingSagas(),
    reviewSagas(),
    bookingSagas(),
    claimSagas(),
  ]);
}

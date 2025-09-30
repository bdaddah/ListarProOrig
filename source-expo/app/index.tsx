import React from 'react';
import {persist, store} from '@redux';
import {Provider} from 'react-redux';
import {PersistGate} from 'redux-persist/integration/react';
import Container from './container';

export default function App() {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persist}>
        <Container />
      </PersistGate>
    </Provider>
  );
}

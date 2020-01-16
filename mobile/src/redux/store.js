import thunk from 'redux-thunk';
import { createStore, combineReducers, applyMiddleware } from 'redux';
import { loginReducer } from './reducer/auth.reducer';
import { mapReducer } from './reducer/map.reducer';
import { componentReducer } from './reducer/component.reducer';
import { reducer as formReducer } from 'redux-form';
import { persistStore, persistReducer } from 'redux-persist';
import { AsyncStorage } from 'react-native';
import autoMergeLevel2 from 'redux-persist/lib/stateReconciler/autoMergeLevel2';
import { EActionRedux } from '../constants/actions.constants';
import { sportReducer } from './reducer/sport.reducer';

const appReducers = combineReducers({
  loginReducer,
  sportReducer,
  mapReducer,
  componentReducer,
  form: formReducer
});

const rootReducer = (state, action) => {
  if (action.type === EActionRedux.LOGOUT) {
    state = undefined;
  }
  return appReducers(state, action)
}

const persistConfig = {
  key: 'root',
  storage: AsyncStorage,
  stateReconciler: autoMergeLevel2 // Xem thêm tại mục "Quá trình merge".
};

// const rootReducer = (state, action) => {
//   return appReducers(state, action);
// }

// const persistedReducer = persistReducer(persistConfig, rootReducer);
// let store = createStore(persistedReducer, applyMiddleware(thunk));
// let persistor = persistStore(store);

const store = createStore(rootReducer, applyMiddleware(thunk))

export default Storage = { store } //, persistor 
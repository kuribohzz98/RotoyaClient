import { createEpicMiddleware } from 'redux-observable';
import { createStore, combineReducers, applyMiddleware } from 'redux';
import ReducerStore from './reducer';
import { reducer as formReducer } from 'redux-form';
import { persistStore, persistReducer } from 'redux-persist';
import { AsyncStorage } from 'react-native';
import autoMergeLevel2 from 'redux-persist/lib/stateReconciler/autoMergeLevel2';
import rootEpics from './epics/index';
import { ActionConstants } from '../constants';

const epicMiddleware = createEpicMiddleware();

const appReducers = combineReducers({
  ...ReducerStore,
  form: formReducer
});

const rootReducer = (state, action) => {
  if (action.type === ActionConstants.LOGOUT) {
    state = undefined;
  }
  return appReducers(state, action)
}

const persistConfig = {
  key: 'root',
  storage: AsyncStorage,
  stateReconciler: autoMergeLevel2,
  whitelist: ['loginReducer']
};

// const rootReducer = (state, action) => {
//   return appReducers(state, action);
// }

// const persistedReducer = persistReducer(persistConfig, rootReducer);
// let store = createStore(persistedReducer, applyMiddleware(thunk));
// let persistor = persistStore(store);

const initialState = {
  componentReducer: {
    optionsGetSportCenters: {limit: 5, page: 1}
  }
};

const store = createStore(rootReducer, initialState);
// epicMiddleware.run(rootEpics);

export default Storage = { store } //, persistor 
import thunk from 'redux-thunk';
import { createStore, combineReducers, applyMiddleware } from 'redux';
import { loginReducer } from '../redux/reducer/auth.reducer';
import { reducer as formReducer } from 'redux-form';
import { persistStore, persistReducer } from 'redux-persist';
import { AsyncStorage } from 'react-native';
import autoMergeLevel2 from 'redux-persist/lib/stateReconciler/autoMergeLevel2';
import { EActionRedux } from '../constants/actions.constants'

const appReducers = combineReducers({
  loginReducer,
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
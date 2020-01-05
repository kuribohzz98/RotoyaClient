import thunk from 'redux-thunk';
import { createStore, combineReducers, applyMiddleware } from 'redux';
import { loginReducer } from '../redux/reducer/auth.reducer';
import { reducer as formReducer } from 'redux-form';
import { persistStore, persistReducer } from 'redux-persist';
import { AsyncStorage } from 'react-native';
import autoMergeLevel2 from 'redux-persist/lib/stateReconciler/autoMergeLevel2';

const AppReducers = combineReducers({
  loginReducer,
  form: formReducer
});

const persistConfig = {
  key: 'root',
  storage: AsyncStorage,
  stateReconciler: autoMergeLevel2 // Xem thêm tại mục "Quá trình merge".
};

const rootReducer = (state, action) => {
  return AppReducers(state, action);
}

const persistedReducer = persistReducer(persistConfig, rootReducer);
let store = createStore(persistedReducer, applyMiddleware(thunk));
let persistor = persistStore(store);

export default Storage = { store, persistor }
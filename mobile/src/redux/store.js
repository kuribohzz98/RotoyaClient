import thunk from 'redux-thunk';
import { createStore, combineReducers, applyMiddleware } from 'redux';
import { loginReducer } from '../redux/reducer/auth.reducer';
import { reducer as formReducer } from 'redux-form';

const AppReducers = combineReducers({
  loginReducer,
  form: formReducer
});

const rootReducer = (state, action) => {
  return AppReducers(state, action);
}

let store = createStore(rootReducer, applyMiddleware(thunk));

export default store;
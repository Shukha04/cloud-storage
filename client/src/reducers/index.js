import { applyMiddleware, combineReducers, createStore } from 'redux'
import { composeWithDevTools } from 'redux-devtools-extension'
import thunk from 'redux-thunk'
import appReducer from './app'
import fileReducer from './file'
import userReducer from './user'
import uploadReducer from './upload'

const rootReducer = combineReducers({
	user: userReducer,
	file: fileReducer,
	uploader: uploadReducer,
	app: appReducer
})

export const store = createStore(rootReducer, composeWithDevTools(applyMiddleware(thunk)))
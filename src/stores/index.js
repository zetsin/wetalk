import { combineReducers, thunkActions } from 'redux-thunk-it'

import app from './app'
import auth from './auth'
import contacts from './contacts'
import dialpad from './dialpad'

export default combineReducers({
  app,
  auth,
  contacts,
  dialpad,
})

export const App = thunkActions(app)
export const Auth = thunkActions(auth)
export const Contacts = thunkActions(contacts)
export const Dialpad = thunkActions(dialpad)
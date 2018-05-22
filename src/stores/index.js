import { combineReducers, thunkActions } from 'redux-thunk-it'

import app from './app'
import auth from './auth'
import contacts from './contacts'
import recents from './recents'
import dialpad from './dialpad'

export default combineReducers({
  app,
  auth,
  contacts,
  recents,
  dialpad,
})

export const App = thunkActions(app)
export const Auth = thunkActions(auth)
export const Contacts = thunkActions(contacts)
export const Recents = thunkActions(recents)
export const Dialpad = thunkActions(dialpad)
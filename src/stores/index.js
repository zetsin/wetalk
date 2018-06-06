import { combineReducers, thunkActions } from 'redux-thunk-it'

import app from './app'
import auth from './auth'
import contacts from './contacts'
import recents from './recents'
import dialpad from './dialpad'
import netcall from './netcall'

export default combineReducers({
  app,
  auth,
  contacts,
  recents,
  dialpad,
  netcall,
})

export const App = thunkActions(app)
export const Auth = thunkActions(auth)
export const Contacts = thunkActions(contacts)
export const Recents = thunkActions(recents)
export const Dialpad = thunkActions(dialpad)
export const Netcall = thunkActions(netcall)
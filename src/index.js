import React from 'react'
import ReactDOM from 'react-dom'
import fastclick from 'fastclick'

import 'index.css'
import Root from 'Root'
import App from 'containers/App'

const startApp = () => {
  new fastclick(document.body)
  ReactDOM.render(<Root component={App} />, document.getElementById('root'))
}

if(window.cordova) {
  document.addEventListener('deviceready', startApp, false)
} else {
  startApp()
}

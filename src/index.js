import React from 'react'
import ReactDOM from 'react-dom'

import 'index.css'
import Root from 'Root'
import App from 'containers/App'

const startApp = () => {
  ReactDOM.render(<Root component={App} />, document.getElementById('root'))
}

if(window.cordova) {
  document.addEventListener('deviceready', startApp, false)
} else {
  startApp()
}

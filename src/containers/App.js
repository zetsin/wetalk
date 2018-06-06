import React from 'react'
import { connect } from 'react-redux'
import { Switch, Route, Redirect } from 'react-router'
import { HashRouter } from 'react-router-dom'

import 'typeface-roboto'
import { MuiThemeProvider, createMuiTheme, withStyles } from '@material-ui/core/styles'
import {
  CssBaseline,
  Snackbar,
} from '@material-ui/core'
import blue from '@material-ui/core/colors/blue'

import AuthComp from 'containers/Auth'
import Navigation from 'containers/Navigation'
import Contacts from 'containers/Contacts'
import Recents from 'containers/Recents'
import Dialpad from 'containers/Dialpad'
import Settings from 'containers/Settings'

import { App, Auth } from 'stores'

const theme = createMuiTheme({
  palette: {
    primary: blue,
    background: {
      default: '#fff'
    }
  },
})

const styles = {
  message: {
    margin: 'auto'
  }
}

class Comp extends React.Component {
  handleClose = event => {
    const { dispatch } = this.props
    dispatch(App.update({
      message: ''
    }))
  }

  render() {
    const { classes, app } = this.props

    return (
      <MuiThemeProvider theme={theme}>
        <CssBaseline />
        <Snackbar anchorOrigin={{vertical: 'top', horizontal: 'center'}} ContentProps={{classes}} open={!!app.message} onClose={this.handleClose} message={app.message} />
        <HashRouter>
          <Switch>
            <Route path="/auth/*" component={AuthComp} exact />
            <Route path="/navs" render={() => (
              <React.Fragment>
                <Route path="/navs/0" component={Contacts} exact />
                <Route path="/navs/1" component={Recents} exact />
                <Route path="/navs/2" component={Dialpad} exact />
                <Route path="/navs/3" component={Settings} exact />
                <Route path="/navs/:value" component={Navigation}/>
              </React.Fragment>
            )} />
            <Redirect to="/navs/0" /> 
          </Switch>
        </HashRouter>
      </MuiThemeProvider>
    )
  }

  componentDidMount() {
    setTimeout(() => {
      const { dispatch, auth } = this.props
      if(auth.accid && auth.token) {
        dispatch(Auth.signin(auth.accid, auth.token))
      }
    })
  }
}

export default withStyles(styles)(connect(state => state)(Comp))

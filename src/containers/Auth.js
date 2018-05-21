import React from 'react'
import { connect } from 'react-redux'
import { Route } from 'react-router'

import { withStyles } from '@material-ui/core/styles'
import {
  AppBar,
  Toolbar,
  Grid,
  Card,
  CardContent,
  TextField,
  Button,
  IconButton,
} from '@material-ui/core'
import {
  Clear,
} from '@material-ui/icons'

import { Auth } from 'stores'

const styles = theme => ({
  appbar: {
    background: 'none',
    boxShadow: 'none',
  },
  container: {
    minHeight: '100vh',
    background: theme.palette.primary[50],
  },
  item: {
    maxWidth: '100vw',
  },
  main: {
    background: 'none',
  },
  placeholder: {
    flex: 1,
  },
})

class Comp extends React.Component {
  state={
    signin_username: '',
    signin_password: '',

    signup_username: '',
    signup_password: '',
  }

  handleClose = event => {
    const { history } = this.props
    if(history.length > 1) {
      history.goBack()
    }
    else {
      history.replace('/')
    }
  }

  handleSignup = event => {
    const { dispatch } = this.props
    const { signup_username, signup_password } = this.state
    dispatch(Auth.signup(signup_username, signup_password))
  }

  handleSignin = event => {
    console.log(this.state.signin_username)
  }

  handleReplace = path => event => {
    const { history } = this.props
    history.replace(path)
  }

  handleChange = key => event => {
    this.setState({
      [key]: event.target.value
    })
  }

  render() {
    const { classes } = this.props
    const { signin_username, signin_password, signup_username, signup_password } = this.state

    return (
      <div>
        <AppBar position="fixed" className={classes.appbar}>
          <Toolbar>
            <div className={classes.placeholder}></div>
            <IconButton onClick={this.handleClose}>
              <Clear />
            </IconButton>
          </Toolbar>
        </AppBar>
        <Grid container justify="center" alignItems="center" className={classes.container}>
          <Grid item className={classes.item}>
            <Card elevation={0} className={classes.main}>
              <CardContent>
                <Route path="/auth/signin" render={() => (
                  <form>
                    <TextField label="电话号码" helperText="" margin="normal" autoComplete="current-username" fullWidth vaule={signin_username} onChange={this.handleChange('signin_username')} />
                    <TextField label="密码" helperText=" " margin="normal" type="password" autoComplete="current-password" fullWidth vaule={signin_password} onChange={this.handleChange('signin_password')} />
                    <Button variant="raised" color="primary" fullWidth onClick={this.handleSignin}>登录</Button>
                    <Button color="secondary" fullWidth onClick={this.handleReplace('/auth/signup')}>注册</Button>
                  </form>
                )} />
                <Route path="/auth/signup" render={() => (
                  <form>
                    <TextField label="电话号码" helperText="" margin="normal" autoComplete="current-username" fullWidth vaule={signup_username} onChange={this.handleChange('signup_username')} />
                    <TextField label="密码" helperText=" " margin="normal" type="password" autoComplete="new-password" fullWidth vaule={signup_password} onChange={this.handleChange('signup_password')} />
                    <Button variant="raised" color="primary" fullWidth onClick={this.handleSignup}>注册</Button>
                    <Button color="secondary" fullWidth onClick={this.handleReplace('/auth/signin')}>登陆</Button>
                  </form>
                )} />
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </div>
    )
  }
}

export default withStyles(styles)(connect(state => state)(Comp))

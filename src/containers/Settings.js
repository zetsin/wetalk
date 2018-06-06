import React from 'react'
import { connect } from 'react-redux'

import { withStyles } from '@material-ui/core/styles'
import {
  Card,
  Avatar,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  CardContent,
  Button,
} from '@material-ui/core'
import {
  KeyboardArrowRight
} from '@material-ui/icons'

import { Auth } from 'stores'

const styles = theme => ({
  root: {
    minHeight: '100vh',
    paddingBottom: 56,
  },
})

class Comp extends React.Component {
  handleSignin = event => {
    const { history } = this.props

    history.push('/auth/signin')
  }
  handleSignout = event => {
    const { dispatch } = this.props
    dispatch(Auth.signout())
  }

  render() {
    const { classes, auth } = this.props

    return (
      <Card className={classes.root}>
        <List>
          <ListItem button onClick={auth.accid ? ()=>{} : this.handleSignin}>
            <Avatar>R</Avatar>
            <ListItemText primary={auth.nick || auth.accid || "未登录"} secondary={auth.accid || "本机号码"} />
          </ListItem>
          <ListItemSecondaryAction>
              <IconButton>
                <KeyboardArrowRight />
              </IconButton>
            </ListItemSecondaryAction>
        </List>
        <CardContent>
          {auth.accid && (
            <Button variant="raised" color="secondary" fullWidth onClick={this.handleSignout}>
              退出账号
            </Button>
          )}
        </CardContent>
      </Card>
    )
  }
}

export default withStyles(styles)(connect(state => state)(Comp))

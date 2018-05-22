import React from 'react'
import { connect } from 'react-redux'

import { withStyles } from '@material-ui/core/styles'
import {
  Card,
  CardHeader,
  CardContent,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Avatar,
  IconButton,
  Divider,
  Typography,
} from '@material-ui/core'
import {
  CallReceived,
  CallMade,
  CallMissed,
  SwapCalls,
  Info,
} from '@material-ui/icons'

import { Recents } from 'stores'

const styles = theme => ({
  header: {
    position: 'fixed',
    left: 0,
    right: 0,
    top: 0,
    zIndex: theme.zIndex.appBar,
  },
  main: {
    paddingTop: 64,
    paddingBottom: 56,
  },
  secondary: {
    display: 'flex',
    alignItems: 'center',
  },
})

class Comp extends React.Component {
  handleCall = number => event => {
    const { dispatch } = this.props
    if(window.cordova) {
      window.PhoneDialer.call(
        number, 
        () => {
          dispatch(Recents.filter())
        },
        err => {},
      )
    }
  }

  componentDidMount() {
    const { dispatch } = this.props
    dispatch(Recents.filter())
  }
  render() {
    const { classes, recents } = this.props

    const types = {
      1: <CallReceived />,
      2: <CallMade />,
      3: <CallMissed />,
      default: <SwapCalls />,
    }

    return (
      <React.Fragment>
        <Card className={classes.header} elevation={0}>
          <CardHeader title="最近通话" />
        </Card>
        <Card className={classes.main} elevation={0}>
          <CardContent>
            <List subheader={<li />}>
              {recents.phonecall.map((item, index) => (
                <React.Fragment key={index}>
                  <ListItem button onClick={this.handleCall(item.number)}>
                    <Avatar>{types[item.type] || types.default}</Avatar>
                    <ListItemText
                      primary={<Typography variant="subheading" color={item.type < 3 ? 'default' : 'error'}>{item.cachedName || item.number}</Typography>}
                      secondary={item.number}
                    />
                    <ListItemSecondaryAction className={classes.secondary}>
                      <Typography color="textSecondary">{new Date(item.date).toLocaleDateString()}</Typography>
                      <IconButton>
                        <Info />
                      </IconButton>
                    </ListItemSecondaryAction>
                  </ListItem>
                  <Divider />
                </React.Fragment>
              ))}
            </List>
          </CardContent>
        </Card>
      </React.Fragment>
    )
  }
}

export default withStyles(styles)(connect(state => state)(Comp))

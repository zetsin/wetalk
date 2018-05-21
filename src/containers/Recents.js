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
} from '@material-ui/core'
import {
  CallMade,
  Info,
} from '@material-ui/icons'

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
  render() {
    const { classes } = this.props

    return (
      <React.Fragment>
        <Card className={classes.header} elevation={0}>
          <CardHeader title="最近通话" />
        </Card>
        <Card className={classes.main} elevation={0}>
          <CardContent>
            <List subheader={<li />}>
              {[1, 2, 3].map((item, index) => (
                <React.Fragment key={index}>
                  <ListItem button>
                    <Avatar>
                      <CallMade />
                    </Avatar>
                    <ListItemText primary={`Item ${item}`} secondary={`Sec ${item}`} />
                    <ListItemSecondaryAction className={classes.secondary}>
                      <ListItemText secondary={`Sec ${item}`} />
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

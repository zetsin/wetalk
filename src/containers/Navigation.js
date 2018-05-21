import React from 'react'
import { connect } from 'react-redux'

import { withStyles } from '@material-ui/core/styles'
import {
  Card,
  BottomNavigation,
  BottomNavigationAction,
} from '@material-ui/core'
import {
  Contacts,
  RecentActors,
  Dialpad,
  Settings,
} from '@material-ui/icons'

const styles = theme => ({
  root: {
    position: 'fixed',
    left: 0,
    right: 0,
    bottom: 0,
    borderTop: '1px solid #ddd',
    zIndex: theme.zIndex.appBar,
  },
})

class Comp extends React.Component {
  handleChange = (event, value) => {
    const { history } = this.props
    history.replace(`/navs/${value}`)
  }

  render() {
    const { classes, match } = this.props

    return (
      <Card className={classes.root} elevation={0}>
        <BottomNavigation value={~~match.params.value} onChange={this.handleChange} showLabels>
          <BottomNavigationAction label="通讯录" icon={<Contacts />} />
          <BottomNavigationAction label="最近通话" icon={<RecentActors />} />
          <BottomNavigationAction label="拨号键盘" icon={<Dialpad />} />
          <BottomNavigationAction label="设置" icon={<Settings />} />
        </BottomNavigation>
      </Card>
    )
  }
}

export default withStyles(styles)(connect(state => state)(Comp))

import React from 'react'
import { connect } from 'react-redux'

import { withStyles } from '@material-ui/core/styles'
import {
  Card,
} from '@material-ui/core'

const styles = theme => ({
  main: {
    minHeight: '100vh',
  },
})

class Comp extends React.Component {
  render() {
    const { classes } = this.props

    return (
      <React.Fragment>
        <Card className={classes.main}>
        </Card>
      </React.Fragment>
    )
  }
}

export default withStyles(styles)(connect(state => state)(Comp))

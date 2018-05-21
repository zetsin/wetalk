import React from 'react'
import { connect } from 'react-redux'

import { withStyles } from '@material-ui/core/styles'
import {
  Card,
  CardContent,
  TextField,
  Grid,
  Button,
} from '@material-ui/core'
import {
  Phone,
  Backspace,
} from '@material-ui/icons'

import { Dialpad } from 'stores'

const styles = theme => ({
  container: {
    minHeight: '100vh',
    paddingBottom: 56,
  },
  item: {
    maxWidth: '100vw',
  },
  input: {
    color: 'black',
    textAlign: 'center',
    fontSize: 'xx-large'
  },
  button: {
    background: 'none !important',
    boxShadow: 'none !important'
  }
})

class Comp extends React.Component {
  setCaret = position => {
    position = this.fix(position)
    this.input.setSelectionRange(position, position)
    this.setDirection()
  }
  setDirection() {
    const { dispatch, dialpad } = this.props

    const { font } = window.getComputedStyle(this.input)

    const canvas = this.canvas || (this.canvas = document.createElement("canvas"))
    const context = canvas.getContext("2d")
    context.font = font
    const width = context.measureText(dialpad.value).width
    
    if(width > this.input.clientWidth) {
      if(dialpad.dir === 'ltr') {
        dispatch(Dialpad.update({
          dir: 'rtl',
        }))
        this.setCaret(dialpad.position)
      }
    }
    else {
      if(dialpad.dir === 'rtl') {
        dispatch(Dialpad.update({
          dir: 'ltr',
        }))
        this.setCaret(dialpad.position)
      }
    }
  }
  fix = position => {
    const { dialpad } = this.props
    if(dialpad.dir === 'rtl') {
      if(position === 0) {
        position = dialpad.value.length
      }
      else if(position === dialpad.value.length) {
        position = 0
      }
    }
    return position
  }
  handleDial = key => event => {
    const { dispatch, dialpad } = this.props

    dispatch(Dialpad.update({
      value: dialpad.value.slice(0, dialpad.position) + key + dialpad.value.slice(dialpad.position),
      position: dialpad.position + 1,
    }))
    
    setTimeout(() => {
      this.setCaret(dialpad.position + 1)
    })
    
  }
  handleDel = event => {
    const { dispatch, dialpad } = this.props

    if(dialpad.position > 0) {
      dispatch(Dialpad.update({
        value: dialpad.value.slice(0, dialpad.position - 1) + dialpad.value.slice(dialpad.position),
        position: dialpad.position -1,
      }))

      setTimeout(() => {
        this.setCaret(dialpad.position -1)
      })
    }
  }
  handleBlur = event => {
    const { dialpad } = this.props
    this.setCaret(dialpad.position)
    event.target.focus()
  }
  handleFocus = event => {
    const { dispatch } = this.props
    dispatch(Dialpad.update({
      position: this.fix(event.target.selectionStart)
    }))

    if(window.cordova) {
      alert(window.Keyboard)
      window.Keyboard.hide()
    }
  }
  handleCall = event => {
    if(window.cordova) {
      console.log(window.phonedialer)
      window.phonedialer.dial(
        "18523400072", 
        err => {},
        success => {}
      )
    }
  }

  render() {
    const { classes, dialpad } = this.props

    return (
      <Grid container justify="center" alignItems="center" className={classes.container}>
        <Grid item className={classes.item}>
          <Card elevation={0}>
            <CardContent>
              <TextField margin="normal" label=" " helperText=" " value={dialpad.value} inputProps={{
                className: classes.input,
                ref: el => this.input = el,
                dir: dialpad.dir,
                onBlur: this.handleBlur,
                onFocus: this.handleFocus,
                onClick: this.handleFocus,
              }} fullWidth autoFocus />
              <Grid container justify="center" spacing={40}>
                <Grid item><Button variant="fab" onClick={this.handleDial(1)}>1</Button></Grid>
                <Grid item><Button variant="fab" onClick={this.handleDial(2)}>2</Button></Grid>
                <Grid item><Button variant="fab" onClick={this.handleDial(3)}>3</Button></Grid>
              </Grid>
              <Grid container justify="center" spacing={40}>
                <Grid item><Button variant="fab" onClick={this.handleDial(4)}>4</Button></Grid>
                <Grid item><Button variant="fab" onClick={this.handleDial(5)}>5</Button></Grid>
                <Grid item><Button variant="fab" onClick={this.handleDial(6)}>6</Button></Grid>
              </Grid>
              <Grid container justify="center" spacing={40}>
                <Grid item><Button variant="fab" onClick={this.handleDial(7)}>7</Button></Grid>
                <Grid item><Button variant="fab" onClick={this.handleDial(8)}>8</Button></Grid>
                <Grid item><Button variant="fab" onClick={this.handleDial(9)}>9</Button></Grid>
              </Grid>
              <Grid container justify="center" spacing={40}>
                <Grid item><Button variant="fab" onClick={this.handleDial('*')}>*</Button></Grid>
                <Grid item><Button variant="fab" onClick={this.handleDial(0)}>0</Button></Grid>
                <Grid item><Button variant="fab" onClick={this.handleDial('#')}>#</Button></Grid>
              </Grid>
              <Grid container justify="center" spacing={40}>
                <Grid item><Button variant="fab" className={classes.button} readOnly> </Button></Grid>
                <Grid item><Button variant="fab" color="primary" onClick={this.handleCall}><Phone /></Button></Grid>
                <Grid item><Button variant="fab" className={classes.button} onClick={this.handleDel}><Backspace /></Button></Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    )
  }
}

export default withStyles(styles)(connect(state => state)(Comp))

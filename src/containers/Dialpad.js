import React from 'react'
import { connect } from 'react-redux'
import classNames from 'classnames'

import { withStyles } from '@material-ui/core/styles'
import {
  Card,
  CardContent,
  Grid,
  Button,
  Typography,
  Popover,
  Divider,
} from '@material-ui/core'
import {
  Phone,
  Backspace,
} from '@material-ui/icons'

import { Dialpad } from 'stores'

const styles = theme => ({
  '@keyframes caret': {
    from: {
      opacity: 1
    },
    to: {
      opacity: 0
    }
  },
  container: {
    minHeight: '100vh',
    paddingBottom: 56,
  },
  item: {
    maxWidth: '100vw',
  },
  input: {
    overflow: 'scroll',
    '&::-webkit-scrollbar': {
      display: 'none'
    }
  },
  caret: {
    opacity: 0,
  },
  animation: {
    animation: 'caret .9s infinite',
  },
  backnone: {
    background: 'none !important',
    boxShadow: 'none !important',
  },
  placeholder: {
    flex: 1,
    opacity: 0,
  },
  popover: {
    borderRadius: 30,
    background: theme.palette.grey[900],
  },
  popover_item: {
    color: theme.palette.grey[50],
  },
  divider: {
    width: 1,
    height: '100%',
    background: theme.palette.grey[50],
  },
})

class Comp extends React.Component {
  state = {
    anchorEl: null
  }
  inputTimeout = null
  delTimeout = null

  handleDial = value => event => {
    const { dispatch, dialpad } = this.props
    value = `${value}`.replace(/[^0-9*#+]/ig, '')

    dispatch(Dialpad.update({
      value: dialpad.value.slice(0, dialpad.position) + value + dialpad.value.slice(dialpad.position),
      position: dialpad.position + value.length,
    }))
  }
  handleCall = event => {
    const { dispatch, dialpad } = this.props
    if(window.cordova && dialpad.value) {
      window.PhoneDialer.call(
        dialpad.value,
        () => {
          dispatch(Dialpad.update({
            value: '',
            position: 0,
          }))
        },
        err => {},
      )
    }
  }

  del = event => {
    const { dispatch, dialpad } = this.props

    if(dialpad.position > 0) {
      dispatch(Dialpad.update({
        value: dialpad.value.slice(0, dialpad.position - 1) + dialpad.value.slice(dialpad.position),
        position: dialpad.position - 1,
      }))
    }
  }
  handleDel = event => {
    this.del(event)
    clearTimeout(this.delTimeout)
  }
  handleDelTS = event => {
    clearTimeout(this.delTimeout)
    this.delTimeout = setTimeout(() => {
      this.del()
      this.handleDelTS()
    }, 100)
  }
  handleDelTM = event => {
    clearTimeout(this.delTimeout)
  }
  handleDelTE = event => {
    clearTimeout(this.delTimeout)
  }

  handleClick = event => {
    const { dispatch, dialpad } = this.props

    let { value, position } = dialpad
    let index = event.target.getAttribute('data-index')
    if(index !== '|') {
      index = ~~index
      if(index <= 0) {
        position = 0
      }
      else if(index > value.length) {
        position = value.length
      }
      else {
        position = index
      }
    }
    dispatch(Dialpad.update({
      position
    }))
  }

  handleInputTS = event => {
    const currentTarget = event.currentTarget
    clearTimeout(this.inputTimeout)
    this.inputTimeout = this.inputTimeout || setTimeout(() => {
      this.setState({
        anchorEl: currentTarget
      })
    }, 500)
  }
  handleInputTM = event => {
    clearTimeout(this.inputTimeout)
  }
  handleInputTE = event => {
    clearTimeout(this.inputTimeout)
  }
  handleClose = event => {
    this.setState({
      anchorEl: null
    })
  }
  handleCopy = event => {
    const { dialpad } = this.props

    if(window.cordova) {
      window.cordova.plugins.clipboard.copy(dialpad.value, () => {}, err => {})
    }
    else if(navigator.clipboard) {
      navigator.clipboard.writeText(dialpad.value)
      .catch(console.log)

    }
  }
  handlePaste = event => {
    if(window.cordova) {
      window.cordova.plugins.clipboard.paste(text => this.handleDial(text)(event), err => {})
    }
    else if(navigator.clipboard) {
      navigator.clipboard.readText()
      .then(text => this.handleDial(text)(event))
      .catch(console.log)
    }
    
  }

  render() {
    const { theme, classes, dialpad } = this.props
    const { anchorEl } = this.state

    setTimeout(() => {
      const input = document.getElementById('dialpad_input')
      if(dialpad.value.length === dialpad.position) {
        if(input.scrollTo) {
          input.scrollTo(input.scrollWidth, 0)
        }
        else {
          input.scrollLeft = input.scrollWidth
        }
      }
    })

    return (
      <Grid container justify="center" alignItems="center" className={classes.container}>
        <Grid item className={classes.item}>
          <Card elevation={0}>
            <CardContent>
              <Grid container
                id="dialpad_input"
                alignItems="center"
                wrap="nowrap"
                className={classes.input}
                onClick={this.handleClick}
                onTouchStart={this.handleInputTS}
                onTouchMove={this.handleInputTM}
                onTouchEnd={this.handleInputTE}
              >
                <Grid item className={classes.placeholder} data-index={-1}>
                  <Typography variant="display3" gutterBottom data-index={-1}>|</Typography>
                </Grid>
                {dialpad.value.slice(0, dialpad.position).split('').map((item, index) => (
                  <Grid item key={index} data-index={index}>
                    <Typography variant="display2" gutterBottom data-index={index}>{item}</Typography>
                  </Grid>
                ))}
                <Grid item data-index="|">
                  <Typography variant="display3" gutterBottom data-index="|" className={classNames(classes.caret, {
                    [classes.animation]: dialpad.value.length > 0
                  })}>|</Typography>
                </Grid>
                {dialpad.value.slice(dialpad.position).split('').map((item, index) => (
                  <Grid item key={index} data-index={dialpad.position + index}>
                    <Typography variant="display2" gutterBottom data-index={dialpad.position + index}>{item}</Typography>
                  </Grid>
                ))}
                <Grid item className={classes.placeholder} data-index={dialpad.value.length}>
                  <Typography variant="display3" gutterBottom data-index={dialpad.value.length}>|</Typography>
                </Grid>
              </Grid>
              <Popover
                open={!!anchorEl}
                anchorEl={anchorEl}
                onClose={this.handleClose}
                anchorOrigin={{
                  vertical: 'center',
                  horizontal: 'center',
                }}
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'center',
                }}
                PaperProps={{
                  elevation: 0,
                  style: styles(theme).popover
                }}
              >
                <Grid container>
                  {dialpad.value && (
                    <React.Fragment>
                      <Grid item><Button size="small" className={classes.popover_item} onClick={this.handleCopy}>复制</Button></Grid>
                      <Grid item><Divider className={classes.divider} /></Grid>
                    </React.Fragment>
                  )}
                  <Grid item><Button size="small" className={classes.popover_item} onClick={this.handlePaste}>粘贴</Button></Grid>
                </Grid>
              </Popover>
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
                <Grid item><Button variant="fab" className={classes.backnone} onClick={this.handleDial('+')}>+</Button></Grid>
                <Grid item><Button variant="fab" color="primary" onClick={this.handleCall}><Phone /></Button></Grid>
                <Grid item>
                  <Button
                    variant="fab"
                    className={classes.backnone}
                    onClick={this.handleDel}
                    onTouchStart={this.handleDelTS}
                    onTouchMove={this.handleDelTM}
                    onTouchEnd={this.handleDelTE}
                  >
                    <Backspace />
                  </Button>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    )
  }
}

export default withStyles(styles, {withTheme: true})(connect(state => state)(Comp))

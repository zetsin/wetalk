import React from 'react'
import { connect } from 'react-redux'

import { withStyles } from '@material-ui/core/styles'
import {
  Card,
  CardHeader,
  CardContent,
  TextField,
  InputAdornment,
  List,
  ListSubheader,
  ListItem,
  ListItemText,
  IconButton,
  Divider,
} from '@material-ui/core'
import {
  Add,
  Search,
} from '@material-ui/icons'

import { Contacts } from 'stores'

const styles = theme => ({
  header: {
    position: 'fixed',
    left: 0,
    right: 0,
    top: 0,
    zIndex: theme.zIndex.appBar,
  },
  title: {
    paddingBottom: 0
  },
  subheader: {
    paddingTop: 0
  },
  main: {
    paddingTop: 105,
    paddingBottom: 56,
  },
  listSubheader: {
    backgroundColor: '#fafafa',
  },
})

class Comp extends React.Component {
  handleChange = event => {
    const { dispatch } = this.props
    dispatch(Contacts.update({
      filter: event.target.value
    }))
  }

  componentDidMount() {
    const { dispatch } = this.props
    dispatch(Contacts.find())
  }
  render() {
    const { classes, contacts } = this.props

    function filter(target, value) {
      if(typeof target === 'object') {
        if(target.constructor === Array) {
          return target.filter(item => filter(item, value).length)
        }
        else {
          return Object.keys(target).filter(key => filter(target[key], value).length).map(key => target[key])
        }
      }
      else if(typeof target === 'string') {
        return target.toLowerCase().includes(value) ? [target] : []
      }
      return []
    }

    const list = filter(contacts.list, contacts.filter).reduce((pre, cur) => {
      pre[cur.first_letter] = pre[cur.first_letter] || []
      pre[cur.first_letter].push(cur)
      return pre
    }, {})

    return (
      <React.Fragment>
        <Card className={classes.header} elevation={0}>
          <CardHeader className={classes.title} title="通讯录" action={
            <IconButton>
              <Add />
            </IconButton>
          } />
          <CardHeader className={classes.subheader} subheader={
            <TextField placeholder="搜索" value={contacts.filter} onChange={this.handleChange} InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search />
                </InputAdornment>
              ),
            }} fullWidth />
          } />
        </Card>
        <Card className={classes.main} elevation={0}>
          <CardContent>
            <List subheader={<li />}>
              {Object.keys(list).sort((a, b) => a >= b).map((key, index) => (
                <React.Fragment key={index}>
                  <ListSubheader className={classes.listSubheader}>{key}</ListSubheader>
                  {list[key].map((contact, index) => (
                    <React.Fragment key={index}>
                      <ListItem button>
                        <ListItemText primary={contact.displayName} />
                      </ListItem>
                      {index < list[key].length - 1 && <Divider />}
                    </React.Fragment>
                  ))}
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

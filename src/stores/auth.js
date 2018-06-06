import config from 'config'
import nfetch from 'utils/nfetch'

import { App, Netcall } from 'stores'

export default {
  state: {
    accid: '',
    token: '',
    name: '',
  },

  actions: {
    signup: function(username, password) {
      const { dispatch } = this

      return nfetch('user/create.action', {
        accid: username,
        token: password
      })
      .then(res => res.json())
      .then(res => {
        if(res.code === 200 && res.info) {
          dispatch({
            type: 'auth/save',
            payload: res.info
          })
          return Promise.resolve(res.info)
        }
        else {
          return Promise.reject(new Error(res.desc))
        }
      })
      .catch(err => {
        dispatch(App.update({
          message: err.message
        }))
      })
    },
    signin: function(account, token, history) {
      const { dispatch } = this

      const cleanup = () => {
        dispatch(this.update({
          accid: '',
          token: '',
          nick: '',
        }))
      }

      window.nim = window.NIM.getInstance({
        appKey: config.appKey,
        account,
        token,
        onconnect: obj => {
          dispatch(this.update({
            accid: account,
            token: token,
          }))
  
          dispatch(Netcall.init())
          
          if(history) {
            if(history.length > 1) {
              history.goBack()
            }
            else {
              history.replace('/')
            }
          }
        },
        onmyinfo: info => {
          dispatch(this.update(info))
        },
        ondisconnect: obj => {
          dispatch(App.update({
            message: obj.code
          }))
          cleanup()
        },
        onerror: err => {
          dispatch(App.update({
            message: err.message
          }))
          cleanup()
        },
      })
    },
    signout: function() {
      const { dispatch } = this
      window.nim.disconnect()
      dispatch(this.update({
        accid: '',
        token: '',
        name: '',
      }))
    },
    update: function(data={}) {
      const { dispatch } = this

      dispatch({
        type: 'auth/save',
        payload: data
      })
    },
  },

  reducers: {
    save: (state, payload) => {
      return {
        ...state,
        ...payload
      }
    }
  }
}
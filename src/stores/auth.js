import nfetch from 'utils/nfetch'

export default {
  state: {
    account: '',
    token: ''
  },

  actions: {
    signup: function(username, password) {
      const { dispatch } = this

      nfetch('user/create.action', {
        accid: username,
        token: password
      })
      .then(res => res.json())
      .then(res => {
        if(res.code === 200) {
          dispatch({
            type: 'auth/save',
            payload: {
              account: username,
              token: password
            }
          })
        }
        else {
          dispatch({
            type: 'app/save',
            payload: {
              message: res.desc,
            }
          })
        }
      })
    },
    signin: function(username, password) {

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
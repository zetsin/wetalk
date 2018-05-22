export default {
  state: {
    phonecall: [],
    netcall: [],
  },

  actions: {
    filter: function() {
      const { dispatch } = this

      if(!window.cordova) {
        return
      }

      setTimeout(() => {
        window.plugins.callLog.getCallLog([], recents => {
          dispatch({
            type: 'recents/save',
            payload: {
              phonecall: recents
            }
          })
        }, err => {})
      })
    },
    update: function(data={}) {
      const { dispatch } = this

      dispatch({
        type: 'recents/save',
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
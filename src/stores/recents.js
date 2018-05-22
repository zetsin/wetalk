export default {
  state: {
    phonecall: [],
    netcall: [],
  },

  actions: {
    filter: function() {
      const { dispatch } = this

      if(!navigator.cordova) {
        return
      }

      const filter = () => {
        window.plugins.callLog.getCallLog([], recents => {
          dispatch({
            type: 'recents/save',
            payload: {
              list: recents
            }
          })
        }, err => {})
      }

      window.plugins.callLog.hasReadPermission(filter, err => {
        window.plugins.callLog.requestReadPermission(filter, err => {})
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
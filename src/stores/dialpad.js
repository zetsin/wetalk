export default {
  state: {
    value: '',
    dir: 'ltr',
    position: 0,
  },

  actions: {
    update: function(data={}) {
      const { dispatch } = this

      dispatch({
        type: 'dialpad/save',
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
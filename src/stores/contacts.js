import pinyin from 'utils/pinyin'

export default {
  state: {
    list: [],
    filter: ''
  },

  actions: {
    find: function() {
      const { dispatch } = this

      if(!window.cordova) {
        return
      }

      window.navigator.contacts.find(['*'], contacts => {

        contacts.map(contact => {
          if(contact.displayName) {
            const first_letter = contact.displayName[0]
            const code = first_letter.charCodeAt()
            
            contact.first_letter = first_letter
            if(code >= 19968 && code <= 40869) {
              if(pinyin.all[code - 19968]) {
                contact.first_letter = pinyin.all[code - 19968]
              }
              else if(pinyin.polyphone[code]) {
                contact.first_letter = pinyin.polyphone[code][0]
              }
            }
            contact.first_letter = contact.first_letter.toUpperCase()
          }
        }).sort((a, b) => a.first_letter > b.first_letter ? 1 : -1)

        dispatch({
          type: 'contacts/save',
          payload: {
            list: contacts
          }
        })
      }, err => {})
    },
    update: function(data={}) {
      const { dispatch } = this

      dispatch({
        type: 'contacts/save',
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
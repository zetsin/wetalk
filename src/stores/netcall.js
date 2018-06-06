import { App } from 'stores'

const sessionConfig = {
  videoQuality: window.WebRTC.CHAT_VIDEO_QUALITY_HIGH,
  videoFrameRate: window.WebRTC.CHAT_VIDEO_FRAME_RATE_15,
  videoBitrate: 0,
  recordVideo: false,
  recordAudio: false,
  highAudio: true,
  bypassRtmp: false,
  rtmpUrl: '',
  rtmpRecord: false,
  splitMode: window.WebRTC.LAYOUT_SPLITLATTICETILE,
}

export default {
  state: {
    type: '',
    calling: false,
    beCalling: false,
    beCalledInfo: {},
  },

  actions: {
    init: function() {
      const { dispatch, getState } = this

      window.NIM.use(window.WebRTC)
      window.netcall = window.WebRTC.getInstance({
        nim: window.nim,
        debug: true,
      })
      .on('beCalling', (beCalledInfo) => {
        console.log(beCalledInfo)
        const { netcall } = getState()
        const { channelId, type } = beCalledInfo
        window.netcall.control({
          channelId,
          command: window.WebRTC.NETCALL_CONTROL_COMMAND_START_NOTIFY_RECEIVED
        })
        if (!window.netcall.calling && !netcall.beCalling) {
          dispatch(this.update({
            type,
            beCalling: true,
            beCalledInfo
          }))
        }
        else {
          let busy = false
          if (window.netcall.calling) {
            busy = window.netcall.notCurrentChannelId(beCalledInfo)
          } else if (netcall.beCalling) {
            busy = beCalledInfo.channelId !== channelId
          }
          if(busy) {
            window.netcall.control({
              channelId,
              command: window.WebRTC.NETCALL_CONTROL_COMMAND_BUSY
            })
            window.netcall.response({
              accepted: false,
              beCalledInfo: beCalledInfo
            })
          }
        }
      })
      .on('callRejected', (beCalledInfo) => {
        // clearCallTimer()
       dispatch(this.hangup())
      })
      .on('callerAckSync', (beCalledInfo) => {
          dispatch(App.update({
            message: '其他端已经做了处理'
          }))
          dispatch(this.hangup())
      })
      .on('callAccepted', (beCalledInfo) => {
        const { type } = beCalledInfo

        dispatch(this.update({
          type,
        }))

        // clearCallTimer()

        window.netcall.startDevice({
          type: window.WebRTC.DEVICE_TYPE_AUDIO_IN
        })
        .then(() => {
          window.netcall.setCaptureVolume(255)
          window.netcall.startRtc()
        })
        .catch(function(err) {
          dispatch(App.update({
            message: err.message
          }))
         dispatch(this.hangup())
        })
      })
      .on('remoteTrack', function(obj) {
        window.netcall.startDevice({
          type: window.WebRTC.DEVICE_TYPE_AUDIO_OUT_CHAT
        }).catch(function(err) {
          dispatch(App.update({
            message: err.message
          }))
        })
      })
      .on('hangup', function(beCalledInfo) {
        const { netcall } = getState()
        if (netcall.beCalledInfo.channelId === beCalledInfo.channelId) {
          dispatch(this.hangup(true))
        }
      })
      
    },
    call: function(account) {
      const { dispatch } = this
      window.netcall.call({
        type: window.WebRTC.NETCALL_TYPE_AUDIO,
        account,
        sessionConfig,
        webrtcEnable: true,
      })
      .catch(err => {
        dispatch(App.update({
          message: err.message
        }))
      })

      dispatch(this.update({
        calling: true,
      }))
    },
    resolve: function() {
      const { dispatch, getState } = this
      const { netcall } = getState()
      const { beCalledInfo } = netcall

      window.netcall.response({
        accepted: true,
        beCalledInfo: beCalledInfo,
        sessionConfig,
      })
      .catch(function(err) {
        dispatch(this.reject())
      })
    },
    reject: function() {
      const { dispatch, getState } = this
      const { netcall } = getState()
      const { beCalledInfo } = netcall
      const { channelId } = beCalledInfo

      window.netcall.control({
        channelId,
        command: window.WebRTC.NETCALL_CONTROL_COMMAND_BUSY
      })
      window.netcall.response({
        accepted: false,
        beCalledInfo
      })
      dispatch(this.hangup())
    },
    hangup: function(received=false) {
      const { dispatch } = this
      dispatch(this.update({
        type: '',
        calling: false,
        beCalling: false,
        beCalledInfo: {}
      }))
      if(received) {
        window.netcall.stopDevice(window.WebRTC.DEVICE_TYPE_AUDIO_IN)
        window.netcall.stopDevice(window.WebRTC.DEVICE_TYPE_AUDIO_OUT_LOCAL)
        window.netcall.stopDevice(window.WebRTC.DEVICE_TYPE_AUDIO_OUT_CHAT)
      }
      else {
        window.netcall.hangup()
      }
    },
    update: function(data={}) {
      const { dispatch } = this

      dispatch({
        type: 'netcall/save',
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

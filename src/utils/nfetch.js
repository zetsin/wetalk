import crypto from 'crypto'

import config from 'config'

export default (action='', obj={}) => {
  const Nonce = Math.random()
  const CurTime = parseInt(Date.now() / 1000, 10)
  const shasum = crypto.createHash('sha1')
  shasum.update(config.appSecret + Nonce + CurTime)
  const CheckSum = shasum.digest('hex')


  return fetch(`https://api.netease.im/nimserver/${action}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8',
      AppKey: config.appKey,
      Nonce,
      CurTime,
      CheckSum
    },
    body: Object.keys(obj).map(key => `${key}=${obj[key]}`).join('&')
  })
}

import crypto from 'crypto'

import nim from 'configs/nim'

export default (action='', obj={}) => {
  const Nonce = Math.random()
  const CurTime = parseInt(Date.now() / 1000, 10)
  const shasum = crypto.createHash('sha1')
  shasum.update(nim.AppSecret + Nonce + CurTime)
  const CheckSum = shasum.digest('hex')


  return fetch(`https://api.netease.im/nimserver/${action}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8',
      AppKey: nim.AppKey,
      Nonce,
      CurTime,
      CheckSum
    },
    body: Object.keys(obj).map(key => `${key}=${obj[key]}`).join('&')
  })
}

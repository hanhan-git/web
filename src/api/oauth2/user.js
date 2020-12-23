import request from '@/utils/request'
import { getRefreshToken } from '@/utils/auth'

import { OAUTH2_URL } from '@/api/baseUrl'
// 1、引入ibps-oauth包
import IbpsOAuth from './oauth2'

const grantType = process.env.VUE_APP_GRANT_TYPE
const CLIENT_ID = process.env.VUE_APP_CLIENT_ID
const CLIENT_SECRET = process.env.VUE_APP_CLIENT_SECRET

const CLIENT_ENCRYPT = process.env.USER_CLIENT_ENCRYPT

// 2、生成一个OAuth的实例，clientId和clientSecert作为构造参数
const oauthApi = new IbpsOAuth(CLIENT_ID, CLIENT_SECRET)

/**
 * 用户登录
 * @param {*} username 用户名
 * @param {*} password 密码
 * @param {*} captcha  验证码
 * @param {*} requestId 验证码请求ID
 */
export function login(params) {
  if (grantType === 'authorization_code') {
    return loginByCode(params)
  } else if (grantType === 'password_credentials') {
    return loginByPassword(params)
  }
}

/**
 * 通过[code授权]方式登录
 * @param {*} username 用户名
 * @param {*} password 密码
 * @param {*} captcha  验证码
 * @param {*} requestId 验证码请求ID
 */
export function loginByCode(params) {
  return new Promise((resolve, reject) => {
    oauthApi.getLoginCode(params, function(error, res) {
      if (error) {
        return reject(error)
      }
      resolve(res)
    })
  })
}

/**
 * 通过[密码]授权方式登录
 * @param {*} username 用户名
 * @param {*} password 密码
 * @param {*} captcha  验证码
 * @param {*} requestId 验证码请求ID
 */
export function loginByPassword(params) {
  return new Promise((resolve, reject) => {
    oauthApi.getAccessTokenByPassword(params, function(error, res) {
      if (error) {
        return reject(error)
      }
      resolve(res)
    })
  })
}

/**
 * 用户登出
 *
 */
export function logout(accessToken) {
  return request({
    url: OAUTH2_URL() + '/user/logout',
    method: 'post',
    params: {
      access_token: accessToken
    }
  })
}

/**
 *获取验证码[匿名]
 */
export function getValidCode(params) {
  return request({
    url: OAUTH2_URL() + '/user/captcha',
    method: 'get',
    params: params
  })
}

/**
 *  根据用户名， 获取用户上下文信息
 * @param {*} token
 */
export function getUserInfo(username) {
  return request({
    url: OAUTH2_URL() + '/user/context',
    method: 'post',
    params: {
      username
    }
  })
}

/**
 * 刷新tonken
 */
export function refreshAccessToken() {
  return new Promise((resolve, reject) => {
    oauthApi.refreshAccessToken(getRefreshToken(), function(error, res) {
      if (error) {
        return reject(error)
      }
      resolve(res)
    })
  })
}

export function switchUser({ username, token }) {
  return request({
    url: OAUTH2_URL() + '/authentication/switch',
    method: 'post',
    data: {
      'client_id': CLIENT_ID,
      'client_secret': CLIENT_SECRET,
      'grant_type': 'authorization_code',
      'access_token': token,
      'username': username
    }
  })
}

export function exitSwitchUser({ username, token }) {
  return request({
    url: OAUTH2_URL() + '/authentication/switch/exit',
    method: 'post',
    data: {
      'client_id': CLIENT_ID,
      'client_secret': CLIENT_SECRET,
      'grant_type': 'authorization_code',
      'access_token': token,
      'username': username
    }
  })
}
/**
 *  是否开启注册
 */
export function getRegisterOpen() {
  return request({
    url: OAUTH2_URL() + '/user/open',
    method: 'get'
  })
}

/**
 *  用户注册
 * @param {*} params
 */
export function register(params) {
  return request({
    url: OAUTH2_URL() + '/user/register',
    method: 'post',
    data: params
  })
}

/**
 *  用户短信验证
 * @param {*} params
 */
export function sendSms(params) {
  return request({
    url: OAUTH2_URL() + '/user/send/sms',
    method: 'get',
    params: params
  })
}

/**
 *  用户短信验证码
 * @param {*} params
 */
export function sendSmsTenant(params) {
  return request({
    url: OAUTH2_URL() + '/user/send/sms/tenant',
    method: 'get',
    params: params
  })
}
/**
 *  重置密码-注册用户使用
 * @param {*} params
 */
export function resetPasswd(params) {
  return request({
    url: OAUTH2_URL() + '/user/reset/passwd',
    method: 'post',
    data: params
  })
}
/**
 *  重置密码-企业租户用户使用
 * @param {*} params
 */
export function resetTenantPasswd(params) {
  return request({
    url: OAUTH2_URL() + '/user/reset/passwd/tenant',
    method: 'post',
    data: params
  })
}

/**
 * 是否开启租户模式
 */
export function open() {
  return request({
    url: OAUTH2_URL() + '/user/open/tenant',
    method: 'get'
  })
}

/**
 * 登录时的用户名、密码加密 
 * @param {*} data 加密内容
 */
export function encrypt(data) {
  return data
  var crypto = require('crypto')
  // console.log('Original cleartext: ' + data)
  var algorithm = 'aes-128-ecb'
  // 加密的密钥，必须与服务端配置的密钥相同
  var key = 'ihaierForTodoKey'
  var clearEncoding = 'utf8'
  var iv = ""
  //var cipherEncoding = 'hex'
  //If the next line is uncommented, the final cleartext is wrong.
  var cipherEncoding = 'base64'
  var cipher = crypto.createCipheriv(algorithm, key, iv)
  var cipherChunks = [];
  cipherChunks.push(cipher.update(data, clearEncoding, cipherEncoding));
  cipherChunks.push(cipher.final(cipherEncoding));
  // console.log(cipherEncoding + ' ciphertext: ' + cipherChunks.join(''));
  
  // var decipher = crypto.createDecipheriv(algorithm, key, iv);
  // var plainChunks = [];
  // for (var i = 0;i < cipherChunks.length;i++) {
  //   plainChunks.push(decipher.update(cipherChunks[i], cipherEncoding, clearEncoding));
  // }
  // plainChunks.push(decipher.final(clearEncoding));
  // console.log(clearEncoding + " plaintext deciphered: " + plainChunks.join(''));
  
  return cipherChunks.join('')
}

/**
 * Cookies工具类
 */
import JsCookies from 'js-cookie'
import setting from '@/setting.js'

const cookies = {
  /**
 * @description 存储 cookie 值
 * @param {String} name cookie name
 * @param {String} value cookie value
 * @param {Object} setting cookie setting
 * @param {Boolean} Whether the prefix
 *
 */
  set: function(name = 'default', value = '', cookieSetting = {}, isPrefix = true) {
    const currentCookieSetting = {
      expires: null
    }
    Object.assign(currentCookieSetting, cookieSetting)
    JsCookies.set(isPrefix ? setting.globalKey + '-' + name : name, value || '', currentCookieSetting)
  },
  /**
 * @description 获取 cookie 值
 * @param {String} name cookie name
 * @param {Boolean} Whether the prefix
 */
  get: function(name = 'default', isPrefix = true) {
    return JsCookies.get(isPrefix ? setting.globalKey + '-' + name : name)
  },
  /**
 * @description 获取 cookie 全部的值
 */
  getAll: function() {
    return JsCookies.get()
  },
  /**
 * @description 删除 cookie
 * @param {String} name cookie name
 * @param {Boolean} Whether the prefix
 */
  remove: function(name = 'default', isPrefix = true) {
    return JsCookies.remove(isPrefix ? setting.globalKey + '-' + name : name)
  }
}

export default cookies

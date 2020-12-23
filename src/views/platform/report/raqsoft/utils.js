/**
 * 报表工具类
 */

import env from '@/env'
import { getToken } from '@/utils/auth'

const util = {
  /**
   *
   * @param {String} url 情趣部分地址
   */
  reportUrl: function(urlText) {
    const HEADER_TOKEN_KEY = env.VUE_APP_FORM_TOKEN_KEY
    const REPORT_API = env.VUE_APP_REPORT_API
    const token = getToken()
    const url2 = REPORT_API + urlText + '&' + HEADER_TOKEN_KEY + '=' + token
    return url2
  }
}

export default util

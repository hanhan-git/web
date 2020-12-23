/**
 * 实现全局的请求 loading
 */
import { Loading } from 'element-ui'
import I18n from '@/utils/i18n' // Internationalization 国际化

let needLoadingRequestCount = 0
let loading

/**
 * 加载
 * @param {*} config
 */
function startLoading(config = {}) {
  loading = Loading.service({
    lock: config.lock || true,
    text: config.text || I18n.t('common.loading'),
    background: config.background
  })
}

/**
 * 清除loaing
 */
function closeLoading() {
  loading.close()
}

const tryCloseLoading = () => {
  if (needLoadingRequestCount === 0) {
    closeLoading()
  }
}

export function showFullScreenLoading(config) {
  if (needLoadingRequestCount === 0) {
    needLoadingRequestCount++
    startLoading(config)
  } else {
    needLoadingRequestCount++
  }
}

export function tryHideFullScreenLoading() {
  if (needLoadingRequestCount <= 0) return
  needLoadingRequestCount--
  if (needLoadingRequestCount === 0) {
    setTimeout(() => {
      tryCloseLoading()
    }, 200)
  }
}

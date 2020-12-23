// Element
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
// A modern alternative to CSS resets
import 'normalize.css/normalize.css'
// flex 布局库
import 'flex.css'
// 快速开发平台字体库
import '@/assets/fonts/iconfont.css'
// :focus-visible https://github.com/WICG/focus-visible/blob/master/explainer.md
import 'focus-visible'
// Internationalization 国际化
import i18n from '@/i18n'
// store
import store from '@/store'
// 工具类
import Utils from '@/utils/util'
// global filters 全局过滤
import * as filters from '@/filters'
// 拼音指令
import pinyin from '@/directives/pinyin'
// 置顶
import sticky from '@/directives/sticky'
// 加载更多
import loadMore from '@/directives/load-more'

// 通用组件
import '@/components'
// svg 图标
import '@/assets/svg-icons'

// 功能插件
import pluginError from '@/plugins/error'
import pluginLog from '@/plugins/log'
import pluginOpen from '@/plugins/open'
// 平台配置文件
import setting from '@/setting.js'
import env from '@/env'

export default {
  async install(Vue, options) {
    // 设置为 false 以阻止 vue 在启动时生成生产提示。
    // https://cn.vuejs.org/v2/api/#productionTip
    Vue.config.productionTip = false
    // 当前环境
    Vue.prototype.$nodeEnv = process.env.NODE_ENV
    // 当前环境变量
    Vue.prototype.$env = env

    // 当前的 baseUrl   简化代码中 process.env.VUE_APP_PUBLIC_PATH 取值
    Vue.prototype.$baseUrl = process.env.VUE_APP_PUBLIC_PATH || '/'
    // 构建时间
    Vue.prototype.$buildTime = process.env.VUE_APP_BUILD_TIME

    // 获得用户设置的全局尺寸
    const size = await store.dispatch('ibps/db/get', {
      dbName: 'sys',
      path: 'size.value',
      defaultValue: setting.system.size,
      user: true
    })

    // 注册Element UI
    Vue.use(ElementUI, {
      size,
      i18n: (key, value) => i18n.t(key, value)
    })
    // 注册全局过滤器（register global utility filters. ）
    Object.keys(filters).forEach(key => {
      Vue.filter(key, filters[key])
    })
    // 设置拼音指令
    Vue.directive('pinyin', pinyin)
    Vue.directive('sticky', sticky)
    Vue.directive('load-more', loadMore)

    // 插件
    Vue.use(pluginError)
    Vue.use(pluginLog)
    Vue.use(pluginOpen)
    // 使用帮助类
    Vue.prototype.$utils = Utils
    // 快速打印 log
    Vue.prototype.$log = Utils.log
  }
}

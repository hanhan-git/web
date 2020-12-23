
/**
 * 数据模版--封装自定义代码扩展接口
 */
import _ from 'lodash'
import Vue from 'vue'
import request from '@/utils/request'
import dialog from '@/utils/dialog'
const _import = require('@/utils/util.import.' + process.env.NODE_ENV)

// 定义全局
var JTemplate
if (!window.JTemplate) {
  JTemplate = window.JTemplate = {}
} else {
  JTemplate = window.JTemplate
}
/**
   * 封装自定义代码扩展接口
   */
_.extend(JTemplate, {
  // 已经初始化
  _isInitialization: false,
  _isLoadJavaScriptFile: false,
  // 初始化表单
  _init: function(template) {
    if (this._isInitialization) return
    this.$template = template
    this.$vue = Vue
    this.$request = request
    this.$dialog = dialog
    this.$import = _import
    this._ = _
    this._isInitialization = true
  },

  // 页面加载
  _onLoad: function(template) {
    this._init(template)
    if (_.isFunction(this.onLoad)) {
      this.onLoad(template)
    }
  },

  // 加载按钮
  _onLoadActions: function(template, action, button, type, row) {
    if (_.isFunction(this.onLoadActions)) {
      return this.onLoadActions(template, action, button, type, row)
    }
  },
  // 按钮提交前事件
  _beforeSubmit: function(template, action, position, selection, data, callback) {
    if (_.isFunction(this.beforeSubmit)) {
      return this.beforeSubmit(template, action, position, selection, data, callback)
    }
    if (_.isFunction(callback)) {
      const flag = true
      callback(flag)
    }
  },

  // 按钮提交后事件
  _afterSubmit: function(template, action, position, selection, data, callback) {
    if (_.isFunction(this.afterSubmit)) {
      return this.afterSubmit(template, action, position, selection, data, callback)
    }
    if (_.isFunction(callback)) {
      const flag = true
      callback(flag)
    }
  },
  // 单元格自定义格式
  _customFormatter: function(template, name, value, rowData, column) {
    if (_.isFunction(this.customFormatter)) {
      return this.customFormatter(template, name, value, rowData, column)
    }
  },
  // 清理所有自定义事件
  cleanEvents: function() {
    this.onLoad = null
    this.onLoadActions = null
    this.onValidate = null
    this.beforeSubmit = null
    this.afterSubmit = null
    this.customFormatter = null
    this._isInitialization = false
  }
})

export default JTemplate

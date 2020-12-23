<template>
  <el-form>
    <data-formrender
      ref="formrender"
      :template-key="templateKey"
      :form-key="formKey"
      :print-template-id="printTemplateId"
      :pk-value="pkValue"
      :toolbars="toolbars"
      :readonly="readonly"
      :default-data="defaultData"
      @callback="handleCallback"
    />
  </el-form>
</template>
<script>
import DataFormrender from './index'
import { getBuildDataById } from '@/api/platform/data/dataTemplate'
import ButtonsConstants from '@/business/platform/data/constants/buttons'
import JTemplate from '../utils/JTemplate'// 自定义脚本
export default {
  components: {
    DataFormrender
  },
  props: {
    dataTemplateId: {
      type: String
    }
  },
  data() {
    return {
      templateKey: '',
      formKey: '',
      printTemplateId: '',
      pkValue: '',
      toolbars: [],
      readonly: false,
      defaultData: {}
    }
  },
  watch: {
    dataTemplateId: {
      handler: function(val, oldVal) {
        this.loadDataTemplate()
      },
      immediate: true
    }
  },
  methods: {
    loadDataTemplate() {
      const loading = this.$loading({
        lock: false,
        background: 'transparent'
      })
      getBuildDataById({
        dataTemplateId: this.dataTemplateId,
        isFilterForm: false,
        isRightsFilter: true
      }).then(response => {
        // 从后台获取数据
        const data = this.$utils.parseData(response.data)
        if (data && data.attrs && this.$utils.isNotEmpty(data.attrs.form_key)) {
          this.templateKey = data.key
          this.formKey = data.attrs.form_key
          this.template = data.templates[0]
          this.editButtons = this.template.buttons ? this.template.buttons.edit_buttons || [] : []
          this.editButtons.forEach((rf, i) => {
            const btn = this.buildButton(rf, i)
            // 编辑页顶部按钮
            // if (hasButton(rf.button_type, 'save', rf.position)) {
            //   editToolbars.push(btn)
            //   console.log(editToolbars)
            // }
            this.toolbars.push(btn)
          })
          setTimeout(() => {
            this.$refs.formrender.loadFormData()
            loading.close()
          }, 100)
        } else {
          this.dataTemplate = data
          setTimeout(() => {
            loading.close()
          }, 1000)
        }
      }).catch(() => {
        loading.close()
      })
    },
    /**
     * 构建按钮npm
     */
    buildButton(rf, i) {
      const defaultButton = ButtonsConstants[rf.button_type] || {}
      let key = rf.button_type
      let mode
      let rightIcon
      let menus
      if (key === 'custom' || key === 'sefStartFlow') {
        key = rf.code ? rf.code : key + i
      }
      if (rf.button_type === 'export') {
        mode = 'dropdown'
        rightIcon = true
        menus = ButtonsConstants[rf.button_type].menus
      }
      let disabled = false
      let hidden = false
      if (this.hasButtonAction(key, rf)) {
        hidden = (row, data) => {
          return JTemplate._onLoadActions(this, key, rf, 'hidden', row, data)
        }
        disabled = (row, data) => {
          return JTemplate._onLoadActions(this, key, rf, 'disabled', row, data)
        }
      }
      return {
        '$index': i,
        key: key,
        button_type: rf.button_type,
        code: rf.code,
        label: rf.label || defaultButton.label,
        icon: rf.icon ? 'ibps-icon-' + rf.icon : defaultButton.icon,
        type: rf.style || defaultButton.type,
        deflow: rf.deflow || null,
        mode: mode,
        rightIcon: rightIcon,
        menus: menus,
        disabled: disabled,
        hidden: hidden
      }
    },
    // 自定义格式数据事件
    hasButtonAction: function(key, button) {
      const buttonActionResult = JTemplate._onLoadActions(this, key, button)
      if (typeof (buttonActionResult) !== 'undefined' && buttonActionResult) {
        return true
      }
      return false
    },
    handleCallback(data) {
      this.$emit('callback', data)
    },
    // 关闭当前窗口
    closeDialog() {
      this.$emit('close', false)
    }
  }
}
</script>
<style lang="scss">
   .el-form{
     background: white;
   }
   .form-toolbar{
     position: inherit;
     margin-top: 0px;
     z-index: 100;
   }
</style>

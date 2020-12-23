import { nestedFieldTypes, otherFieldTypes } from '@/business/platform/form/constants/fieldTypes'
import { accept as ACCEPT } from '@/business/platform/file/constants/fileTypes'
import FormOptions from '@/business/platform/form/constants/formOptions'
import Utils from '@/utils/util'
import DateFormatUtil from '@/business/platform/form/utils/dateFormatUtil'
import I18n from '@/utils/i18n'
import { dataFormatMap } from '@/business/platform/form/constants/fieldOptions'

// 保存控件的import语句
let sentences = []
// 保存控件的components
let components = []
// 保存样式
let styles = []
// 保存验证规则
let formRules = []
// 描述显示位置
let descPosition = ''
// 事件模版
let eventTemplate = ''
// 验证导入方法
let validators = []
// 保存布局默认值
let layoutVal = []
// 保存自动编号的字段
let autoNumbers = []
// 保存自动编号的identity
let autoNumberIdentities = []
// 保存自动编号的事件
let autoNumberEvent = ''
// 保存数字输入框事件
let inputNumberEvent = ''
// 保存按钮事件
let btnEvent = ''
// 保存computed
let returnSocpe = ''
// 获取FromId
let getFormId = ''
// 保存按钮数据
let btns = {}
// 保存步骤条步骤事件
let stepsEvent = ''
// 步骤条数据
let stepsActive = {}
// 保存富文本的工具栏
let ueditorConfig = {}

// 记录所有子表名称
let subTableNames = []
// 记录所有checkbox字段名称
let checkboxFieldNames = []

// 图标前缀
const prefix = 'ibps-icon-'
// 流水号绑定
function setAutoNumber(prop, identity, init) {
  if (Utils.toBoolean(init, false)) {
    const temp = `async initAuto(identity,name){
      let result = ''
      await getNextIdByAlias({
        alias: identity
      }).then(response => {
        result = response.data
      }).catch(() => {})
      this.form[name] = result
    }`
    if (autoNumberEvent !== temp) autoNumberEvent = temp
    if (!autoNumbers.includes(prop)) {
      autoNumbers.push(prop)
      autoNumberIdentities.push(identity)
    }
  }
}

/**
 * 生成表单数据
 * @param {*} fields
 * @param {*} form
 */
function generateModles(fields, form, subTableName) {
  for (let i = 0; i < fields.length; i++) {
    const field = fields[i]
    const fieldName = field.name
    const fieldType = field.field_type
    const fieldOptions = field.field_options
    const val = fieldOptions.default_value

    if (nestedFieldTypes.includes(fieldType)) { // 嵌套布局
      if (Utils.isNotEmpty(fieldOptions) && Utils.isNotEmpty(fieldOptions.columns)) {
        // 循环遍历所有字段
        fieldOptions.columns.forEach(item => {
          generateModles(item.fields, form, "")
        })
        // for(let i=0;i<fieldOptions.length;i++){
        //   generateModles(fieldOptions[i].fields, form)
        // }
      }
    } else if (fieldType === 'table') { // 子表单
      if(!subTableNames.includes("'" + fieldName + "PoList'")){
        subTableNames.push("'" + fieldName + "PoList'")
      }
      form[fieldName + "PoList"] = []
      const temp = {}
      generateModles(fieldOptions.columns, temp, fieldName + "PoList")//子表名
      form[fieldName + "PoList"].push(temp)
    } else if (fieldType === 'approval_opinion') { // 审批意见
      form[fieldName] = ''
    } else {
      // 不是只读字段
      if (!FormOptions.t.NON_MODEL_FIELD_TYPES.includes(fieldType)) {
        if (fieldType === 'checkbox') {
          let a = (subTableName==="")? "'"+fieldName+"'" : "'"+subTableName+"."+fieldName+"'"
          if(!checkboxFieldNames.includes(a)){
            checkboxFieldNames.push(a)
          }
          form[fieldName] = []
          fieldOptions.options.forEach(el => {
            if (el.checked) {
              form[fieldName].push(el.val)
            }
          })
        } else if (fieldType === 'radio') {
          form[fieldName] = ''
          fieldOptions.options.forEach(el => {
            if (el.checked) {
              form[fieldName] = el.val
            }
          })
        } else if (fieldType === 'select') {
          if (Utils.isNotEmpty(fieldOptions.multiple) && fieldOptions.multiple) {
            form[fieldName] = []
            fieldOptions.options.forEach(el => {
              if (el.checked) {
                form[fieldName].push(el.val)
              }
            })
          } else {
            form[fieldName] = ''
            fieldOptions.options.forEach(el => {
              if (el.checked) {
                form[fieldName] = el.val
              }
            })
          }
        } else {
          form[fieldName] = Utils.isNotEmpty(val) ? val : ''
        }
      }
    }
  }
}

/**
 * 表单模版
 * @param {*} fields
 */
function generateFormTempale(fields) {
  const template = []

  for (let i = 0; i < fields.length; i++) {
    const field = fields[i]
    // const fieldName = field.name
    const fieldType = field.field_type
    // const fieldOptions = field.field_options

    if (nestedFieldTypes.includes(fieldType)) { // 嵌套布局
      template.push(generateNestedFieldTempale(field))
    } else {
      template.push(generateFieldItemTemplate(field))
    }
  }

  return template.join('')
}

/**
 * 记录checkbox字段名称，for load and save
 * @param {*} fields
 */
function recordCheckboxFieldName(fields) {
  const template = []
  for (let i = 0; i < fields.length; i++) {
    const field = fields[i]
    const fieldType = field.field_type
    // const fieldOptions = field.field_options
    if (fieldType === 'checkbox') {
      template.push("'" + field.name + "'" )
    }
  }
  return template.join(',')
}

// 根据传入的数据保存
function setData(data, name, val) {
  data[name] = JSON.parse(JSON.stringify(val))
}

// 保存布局默认显示
function setLayoutVal(val) {
  if (layoutVal.includes(val)) return
  layoutVal.push(val)
}

// 保存步骤条数据
function setStepsActive(prop, active) {
  stepsActive[prop] = Utils.isNotEmpty(active) ? active : 0
}

/**
 * 嵌套字段
 * @param {*} field
 */
function generateNestedFieldTempale(field, type, model) {
  const fieldType = field.field_type
  const fieldOptions = field.field_options
  const columns = fieldOptions.columns
  const prop = generateProp(field)

  // 栅格布局
  if (fieldType === 'grid') {
    const gutter = fieldOptions.gutter ? fieldOptions.gutter : 0
    const justify = fieldOptions.justify
    const align = fieldOptions.align

    return `
      <el-row
        :gutter="${gutter}"
        justify="${justify || ''}"
        align="${align || ''}"
        class="widget-col"
        type="flex"
      >
      ${columns.map(col => {
    return `<el-col :span="${col.span ? col.span : 0}">
        ${col.fields.map(item => {
    return `${nestedFieldTypes.includes(item.field_type) ? generateNestedFieldTempale(item, type, model) : generateFieldItemTemplate(item, type, model)}`
  }).join('')}
        </el-col>
        `
  }).join('')}
      </el-row>
      `
  // 标签布局
  } else if (fieldType === 'tabs') {
    return `<el-tabs
        v-model="formLayout.${prop}"
        type="${fieldOptions.type}"
        tab-position="${fieldOptions.position}"
        :stretch="${fieldOptions.stretch}"
        class="ibps-mb-10"
      >
      ${columns.map((col, i) => {
    if (col.checked || (i === 0 && !col.checked)) {
      setLayoutVal(`${prop}:'${col.name}'`)
    }
    return `<el-tab-pane name="${col.name}">
          <span slot="label">${col.label}</span>
          ${col.fields.map(item => {
    return `${nestedFieldTypes.includes(item.field_type) ? generateNestedFieldTempale(item, type, model) : generateFieldItemTemplate(item, type, model)}`
  }).join('')}
          </el-tab-pane>
          `
  }).join('')}
      </el-tabs>
      `
  // 折叠面板
  } else if (fieldType === 'collapse') {
    const arrs = []
    const temp =
     `<el-collapse
        v-model="formLayout.${prop}"
        type="${fieldOptions.type}"
        :accordion="${fieldOptions.accordion}"
        tab-position="${fieldOptions.position}"
        :stretch="${fieldOptions.stretch}"
        class="ibps-mb-10"
      >
      ${columns.map(col => {
    if (col.checked) {
      arrs.push(`'${col.name}'`)
    }
    return `<el-collapse-item name="${col.name}" >
          <span slot="title">${col.label}</span>
          ${col.fields.map(item => {
    return `${nestedFieldTypes.includes(item.field_type) ? generateNestedFieldTempale(item, type, model) : generateFieldItemTemplate(item, type, model)}`
  }).join('')}
          </el-collapse-item>
          `
  }).join('')}
      </el-collapse>
      `
    if (arrs && arrs.length > 0) {
      setLayoutVal(`${prop}:[${arrs.join(',')}]`)
    } else {
      setLayoutVal(`${prop}:[]`)
    }
    return temp
  // 步骤条
  } else if (fieldType === 'steps') {
    let template = `<ibps-steps
    space="${fieldOptions.space}"
    direction="${fieldOptions.direction}"
    :align-center="${fieldOptions.align_center}"
    :simple="${fieldOptions.simple}"
    process-status="${fieldOptions.process_status}"
    finish-status="${fieldOptions.finish_status}"
    :active="stepsActive.${prop}"
    class="ibps-mb-10"
  >
  ${columns.map((col, colIndex) => {
    return `<ibps-step-pane
    title="${col.label}"
    name="${col.name ? col.name : 'steps_' + colIndex}"
    class="ibps-mt-10 ibps-mb-10">
    ${col.fields.map(item => {
    return `${nestedFieldTypes.includes(item.field_type) ? generateNestedFieldTempale(item, type, model) : generateFieldItemTemplate(item, type, model)}`
  }).join('')}
      </ibps-step-pane>
      `
  }).join('')}
    </ibps-steps>
    `

    template += `
    <div class="ibps-p-10">
      <el-button-group>
        ${fieldOptions.buttons.map((button, i) => {
    return `
        <el-button
          :disabled="${button.key === 'prev'
    ? `stepsActive.${prop} <= 0`
    : `stepsActive.${prop} >= ${columns.length - 1}`}"
          icon="${prefix + button.icon}"
          @click="${button.key === 'prev' ? `prevSteps('${prop}')` : `nextSteps('${prop}',${columns.length})`}"
        >
          ${button.label}
        </el-button>`
  }).join('')}
      </el-button-group>
    </div>
  `
    stepsEvent = `
      nextSteps(name,length){
        if(length - 1 <= this.stepsActive[name]) return
        this.stepsActive[name] ++
      },
      prevSteps(name){
        if(this.stepsActive[name] === 0) return
        this.stepsActive[name] --
      },
      `
    setStepsActive(prop, field.active)
    return template
  }
}

function generateProp(field, code, row) {
  if (Utils.isNotEmpty(row)) {
    return code + '.' + row + '.' + field.name
  }
  return field.name
}

function generateRules(field) {
  const required = field.field_options.required
  return buildFormRules(field, required, {})
}

// 保存validators语句
function setValidators(validator) {
  if (!validators.includes(validator)) {
    validators.push(validator)
  }
}

function buildFormRules(field, required, form) {
  const rules = []
  const fieldOptions = field.field_options || {}
  let validator = ''
  // 必填验证
  if (required) {
    validator = 'validateRequired'
    rules.push({ required: true, message: I18n.t('validate.required') })
    rules.push({ validator: validator, message: I18n.t('validate.required') })
    setValidators(validator)
  }
  // 整型验证
  if (fieldOptions.integer) {
    validator = 'validateInteger'
    rules.push({ validator: validator, message: I18n.t('validate.integer') })
    setValidators(validator)
  }
  // 小数验证
  if (fieldOptions.decimal) {
    validator = 'validateDecimal'
    setValidators(validator)
    rules.push({
      validator: validator,
      decimal: fieldOptions.decimal
    })
  }

  //  最大、最小字符串长度验证
  if ((fieldOptions['is_min_length'] && Utils.isNotEmpty(fieldOptions['min_length'])) ||
    (fieldOptions['is_max_length'] && Utils.isNotEmpty(fieldOptions['max_length']))) {
    validator = 'validateLengthRange'
    setValidators(validator)
    rules.push({
      validator: validator,
      format: field.field_type === 'editor' ? (v) => {
        let content = v.replace(/<\/?[^>]*>/g, '') // 去除HTML Tag
        content = content.replace(/[|]*\n/, '') // 去除行尾空格
        content = content.replace(/&npsp;/ig, '') // 去掉npsp
        return content
      } : false,
      min: fieldOptions['is_min_length'] ? fieldOptions['min_length'] : null,
      max: fieldOptions['is_max_length'] ? fieldOptions['max_length'] : null
    })
  }

  //  最大、最小值验证[数字]
  if ((fieldOptions['is_min'] && Utils.isNotEmpty(fieldOptions['min'])) ||
      (fieldOptions['is_max'] && Utils.isNotEmpty(fieldOptions['max']))) {
    validator = 'validateNumberRange'
    setValidators(validator)
    rules.push({
      validator: validator,
      min: fieldOptions['is_min'] ? fieldOptions['min'] : null,
      max: fieldOptions['is_max'] ? fieldOptions['max'] : null
    })
  }

  // 日期验证 date_format 不需要

  // 日期范围验证-开始、结束时间 date_between
  if (Utils.isNotEmpty(fieldOptions['start_date_type']) ||
      Utils.isNotEmpty(fieldOptions['end_date_type'])) {
    validator = 'validateDateBetween'
    setValidators(validator)
    rules.push({
      validator: validator,
      fieldOptions: fieldOptions,
      form: form
    })
  }

  //  最多、最少选项验证
  if ((fieldOptions['is_min_mum'] && Utils.isNotEmpty(fieldOptions['min_mum'])) ||
    (fieldOptions['is_max_mum'] && Utils.isNotEmpty(fieldOptions['max_mum']))) {
    validator = 'validateOptions'
    setValidators(validator)
    rules.push({
      validator: validator,
      min: fieldOptions['is_min_mum'] ? fieldOptions['min_mum'] : null,
      max: fieldOptions['is_max_mum'] ? fieldOptions['max_mum'] : null
    })
  }
  // 正则表达式
  if (fieldOptions['data_format']) {
    let dataFormatValue = fieldOptions['data_format_value']
    let dataFormatMsg = fieldOptions['data_format_msg']
    if (fieldOptions['data_format'] !== 'custom') {
      dataFormatValue = dataFormatMap[fieldOptions['data_format']].regexp
      dataFormatMsg = I18n.t('validate.' + fieldOptions['data_format'])
    }
    rules.push({
      pattern: dataFormatValue,
      message: dataFormatMsg
    })
  }
  return rules
}

// 子表单样式导入
function setTableStyle() {
  const style = `
  .dynamic-form-table{
    .panel-heading{
      border-bottom:0;
      border-left: 1px solid #dde7ee;
      border-right: 1px solid #dde7ee;
    }
    .dynamic-form-table__inner{
      .panel-body{
        padding: 0;
      }
    }
    .dynamic-form-table__block{
      padding-bottom:10px;
      .panel-body{
        border: 1px solid #dde7ee;
      }
    }
    .el-rate{
      position: relative;
      display: inline-block;
    }
  }
  .is-error{
    .dynamic-form-table{
      border: 1px solid #F56C6C;
    }
  }
  
  .is-required:not(.is-no-asterisk){
    .dynamic-form-table__label:before {
      content: '*';
      color: #F56C6C;
      margin-right: 4px;
    }
  }
  `
  if (!styles.includes(style)) {
    styles.push(style)
  }
}

/**
 * 子表单控件
 * @param {*} field
 * @param {*} prop
 */
function generateTableTemplate(field, prop) {
  setTableStyle()
  const tableName = field.name
  const fieldOptions = field.field_options
  const columns = fieldOptions.columns
  const buttons = fieldOptions.buttons
  const mode = fieldOptions.mode || 'inner'
  const model = prop

  const manageButtons = buttons.filter(item => {
    return Utils.isNotEmpty(item.position) && item.position === 'all'
  })

  let template = `
    <div class="dynamic-form-table">
  `
  if (!(columns && columns.length > 0)) {
    template += `
      <el-table
        :data="[]"
        empty-text="您尚未创建任何字段。请在表单中添加字段。"
        border
      />
    </div>
    `
    return template
  }

  // 表内和弹窗模式
  if (mode === 'inner' || mode === 'dialog') {
    template += `
      <div class="dynamic-form-table__inner panel panel-info">
        <div class="panel-heading ibps-clearfix">
          <div class="ibps-fl dynamic-form-table__label">${field.label}</div>
      `
    if (fieldOptions.buttons && fieldOptions.buttons.length > 0) {
      template += `
          <div class="ibps-fr hidden-print">
            <el-button-group>
            ${fieldOptions.buttons.map((button, i) => {
    return `
                <el-button
                :key="${i}"
                :hidden="readonly"
                type="${button.style}"
                icon="${prefix + button.icon}"
                @click="handleActionEvent('${button.type}','${model}','${model}')"
              >
                ${button.label}
              </el-button>`
  }).join('')}
            </el-button-group>
          </div>
      `

      setBtnEventTemplate('handleActionEvent', columns, tableName)
    }
    template += `
        </div>
        <div class="panel-body">
          <el-table
            ref="${model}"
            :data="form.${model}"
            border
            stripe
          >
            <el-table-column
              type="selection"
              width="50"
            />
            ${fieldOptions.index
    ? `<el-table-column
                type="index"
                label="序号"
                width="50"
              />`
    : ''}`

    columns.forEach((column, j) => {
      if (column.field_type === 'hidden') return
      template += `
        <el-table-column
          :key="${j}"
          prop="${column.name}"
          ${Utils.isNotEmpty(column.field_options.is_label_width) && column.field_options.is_label_width ? `width="${column.field_options.label_width + (column.field_options.label_width_unit || 'px')}"` : ''}
        >
          <template slot="header">
            ${Utils.isNotEmpty(column.field_options.units) ? column.label + '(' + column.field_options.units + ')' : column.label}
            ${(column && column.desc && descPosition === 'lableIcon') ? `<ibps-help type="tooltip" content="${column.desc}" />` : ''}
          </template>
          <template slot-scope="props">
            ${generateTableItemTemplate(column, mode, model)}
          </template>
        </el-table-column>
      `
    })
    if (manageButtons && manageButtons.length > 0) {
      template +=
      `
      <el-table-column
        align="center"
        fixed="right"
        class-name="hidden-print"
        label="操作"
      >
        <template slot-scope="scope">
          <ibps-toolbar
            :actions="manageButtons.${model}"
            :hidden="readonly"
            :data="scope.row"
            :socpe="thatSocpe"
            position="manage"
            class="hidden-print"
            @action-event="(action)=>operationEvent(action, scope.$index, '${model}')"
          />
        </template>
      </el-table-column>`

      returnSocpe = `
      thatSocpe() {
        return this
      },
      `
      
      getFormId = `
		  formId() {
		    return this.id
		  }, `
      
      btnEvent = `
      operationEvent(button, index, name){
        console.info(button, index)
        // todo
        // 根据button.key判断不同的按钮，再通过index获取指定位置的数据（index为点击行在models的下标）
        switch (button.key) {
          case 'add':
            console.info('新增')
            break
          case 'edit':
            console.info('修改')
            break
          case 'remove':
            console.info('删除')
            this.$confirm('确定删除当前行?', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            }).then(() => {
              this.form[name].splice(index, 1)
              this.$message({
                message: '删除成功',
                type: 'success'
              })
            }).catch(() => {
              this.$message({
                type: 'info',
                message: '已取消删除'
              });          
            });
            break
          case 'import':
            console.info('导入')
            break
          case 'export':
            console.info('导出')
            break
          case 'custom':
            break
          default:
            break
        }
      },
      `
      setOperationBtn(manageButtons, model)
    }

    template += `
          </el-table>
        </div>
      </div>
    
    `
  // 块模式
  } else if (mode === 'block') {
    template += `
      <div class="dynamic-form-table__block panel panel-info">
        <div class="panel-heading ibps-clearfix">
          <!--块模式：工具栏-->
          <div class="ibps-fl dynamic-form-table__label">
            ${field.label}
          </div>
      `

    if (buttons && buttons.length > 0) {
      template += `
        <div class="ibps-fr">
          <el-button-group>
            ${buttons.map((button, b) => {
    // if (button.key === 'remove' && dataModel.length === 1) return ''
    return `
              <el-button
                :key="${b}"
                :hidden="readonly"
                type="${button.style}"
                icon="${prefix + button.icon}"
                @click="handleActionEvent('${button.type}','${model}')"
              >
                ${button.label}
              </el-button>`
  }).join('')}
          </el-button-group>
        </div>
      `
      setBtnEventTemplate('handleActionEvent', columns, tableName)
    }
    template += `
      </div>
        <!--块模式：表单-->
        <div class="panel-body">
    `
    columns.forEach((el, j) => {
      if (el.field_type === 'grid' || el.field_type === 'tabs' || el.field_type === 'collapse' || el.field_type === 'steps') {
        template += generateNestedFieldTempale(el, mode, model)
      } else {
        template += generateFieldItemTemplate(el, mode, model)
      }
    })
    template += `
                </div>
                  </div>
                `
  }

  return template + `</div>`
}

// 保存操作按钮
function setOperationBtn(data, name) {
  btns[name] = data.map(item => {
    return {
      key: item.type,
      type: item.style,
      label: item.label,
      icon: prefix + item.icon
    }
  })
}

/**
 * ibps-dynamic-form-table-item
 * @param {*} field
 */
function generateTableItemTemplate(field, type, model) {
  const prop = generateProp(field)
  const rules = generateRules(field)
  setFormRules(rules, prop)
  const mode = field.field_options.mode
  let template = `
    <el-form-item
      :prop="\`${model + '[${props.$index}].' + prop}\`"
      :rules="rules.${prop}"
      ${mode === 'block' ? `label="${field.label}"` : ''}
      label-width="${mode === 'block' ? field.field_options.label_width : '0px'}"
      :class="{
        'dynamic-form-table-item__readonly':readonly
      }"
    >
  `
  if (field.field_type === 'table') {
    template += generateTableTemplate(field, prop)
  } else {
    template += generateFieldTemplate(field, prop, type)
  }

  if (field && field.desc && descPosition === 'inline') {
    template += `
      <div
        class="ibps-help-block"
        v-html="'${Utils.formatText(field.desc).replace(/"/g, '&quot;').replace(/'/g, '&acute;')}'"
      />
    `
  }
  template += `
    </el-form-item>
  `
  return template
}

// 保存验证规则
function setFormRules(rules, prop) {
  const index = formRules.findIndex((v) => {
    return v.startsWith(prop)
  })
  if (index !== -1 && Utils.isNotEmpty(prop)) {
    return
  }
  if (Utils.isNotEmpty(rules)) {
    formRules.push(`${prop}:${JSON.stringify(rules)}`)
  }
}

/**
 * ibps-dynamic-form-item
 * @param {*} field
 */
function generateFieldItemTemplate(field, type, model) {
  const fieldType = field.field_type
  if (fieldType === 'hidden') {
    return ''
  } else if (otherFieldTypes.includes(fieldType)) {
    return generateOtherFieldTemplate(field)
  } else {
    const prop = generateProp(field)
    const rules = generateRules(field)
    setFormRules(rules, prop)
    const flag = Utils.isNotEmpty(model)

    let template = `
      <el-form-item
      label="${fieldType === 'table' ? '' : field.label}"
      ${fieldType === 'table' ? `label-width="0"` : ''}
      prop="${flag ? model + '[0].' + prop : prop}"
      ${flag ? `:rules="rules.${prop}"` : ''}
      >`

    if (fieldType === 'approval_opinion') {
      // 表单意见
    } else if (fieldType === 'table') {
      template += generateTableTemplate(field, prop + "PoList")
    } else {
      template += generateFieldTemplate(field, prop, type, model)
    }

    if (field && field.desc && descPosition === 'inline') {
      template += `
        <div
          class="ibps-help-block"
          v-html="'${Utils.formatText(field.desc).replace(/"/g, '&quot;').replace(/"/g, '&acute;')}'"
        />
      `
    }
    template += `
      </el-form-item>
    `
    return template
  }
}

/**
 * ibps-dynamic-form-field
 * @param {*} field
 * @param {*} prop
 */
function generateFieldTemplate(field, prop, type, name) {
  const fieldOptions = field.field_options
  const placeholder = fieldOptions['placeholder'] || ''
  const fieldType = field.field_type
  const dataOptions = fieldOptions['options']
  const model = Utils.isNotEmpty(type) ? type === 'block' ? `form.${name}[0].${prop}` : `props.row.${prop}` : `form.${prop}`
  let template = ''
  // 单行文本、 多行文本、数字
  if (fieldType === 'text' || fieldType === 'textarea') {
    template =
  `<el-input
      v-model="${model}"
      placeholder="${placeholder}"
      type="${fieldType}"
      name="${field.name}"
      :autosize="autosize"
      :rows="${fieldOptions.rows || 3}"
      :readonly="readonly"
      clearable
      :style="{width:width}"
    /> `
  // 多行文本、数字
  } else if (fieldType === 'number') {
    template =
  `<el-input
      v-model="${model}"
      placeholder="${placeholder}"
      type="${fieldType}"
      name="${field.name}"
      :autosize="autosize"
      :rows="${fieldOptions.rows || 3}"
      :readonly="readonly"
      clearable
      @keypress="channelInputLimit"
      :style="{width:width}"
    /> `
    inputNumberEvent = `
  channelInputLimit(e) {
    if (e.key === 'e') {
      e.returnValue = false
      return false
    }
    return true
  },
  `
  // 单项选择
  } else if (fieldType === 'radio') {
    template =
    `<el-radio-group
          v-model="${model}"
          :disabled="readonly"
          ${Utils.isNotEmpty(fieldOptions.arrangement) && fieldOptions.arrangement === 'vertical' ? `class='machine_direction'` : ''}
        > 
        ${dataOptions.map(o => {
    return `
          <component
          :is="'${fieldOptions.button ? 'el-radio-button' : 'el-radio'}'"
          :label="'${o.val}'"` +
          (Utils.isNotEmpty(fieldOptions.border) ? (`
          border="${fieldOptions.border}
          `) : '') +
          `
          class="ibps-pt-5"
        >
          ${o.label}
        </component>`
  }).join('')}
      </el-radio-group>`
  // 多选项选择
  } else if (fieldType === 'checkbox') {
    template =
    `<el-checkbox-group
          v-model="${model}"
          :disabled="readonly"
          ${Utils.isNotEmpty(fieldOptions.arrangement) && fieldOptions.arrangement === 'vertical' ? `class='machine_direction'` : ''}
        > 
        ${dataOptions.map(o => {
    return `
          <component
          :is="'${fieldOptions.button ? 'el-checkbox-button' : 'el-checkbox'}'"
          :label="'${o.val}'"` +
          (Utils.isNotEmpty(fieldOptions.border) ? (`
          :border="${fieldOptions.border}
          `) : '') +
          `
          class="ibps-pt-5"
        >
          ${o.label}
        </component>`
  }).join('')}
      </el-checkbox-group>`
  //  计数器
  } else if (fieldType === 'inputNumber') {
    template =
    `<el-input-number
      v-model="${model}"
      :max="${fieldOptions.max}"
      :min="${fieldOptions.min}"
      :step="${fieldOptions.step}"
      :controls="${fieldOptions.controls}"
      controls-position="${fieldOptions.controls_position}"
      placeholder="${placeholder}"
      :disabled="readonly"
      :style="{width:width}"
    />`
  // 下拉框
  } else if (fieldType === 'select') {
    template =
    `
    <el-select
      v-model="${model}"
      placeholder="${placeholder}"
      name="${field.name}"
      :disabled="readonly"
      :style="{width:width}"
      clearable
    >
    ${dataOptions.map(o => {
    return `
        <el-option
          key="${o.val}"
          label="${o.label}"
          value="${o.val}"
        />`
  }).join('')}
        
    </el-select>`
  // 开关
  } else if (fieldType === 'switch') {
    if (fieldOptions.appearance === 'checkbox') {
      template =
        `<el-checkbox
          v-model="${model}"
          :disabled="readonly"
        />`
    } else {
      template =
      `
        <el-switch
          v-model="${model}"
          active-value="${fieldOptions.active_value}"
          inactive-value="${fieldOptions.inactive_value}"
          active-text="${fieldOptions.active_text}"
          inactive-text="${fieldOptions.inactive_text}"
          active-color="${fieldOptions.active_color}"
          inactive-color="${fieldOptions.inactive_color}"
          :disabled="readonly"
        />`
    }
  // 滑块
  } else if (fieldType === 'slider') {
    template =
      `<div style="width:99%;">
        <el-slider
          v-model="${model}"
          :show-input="${fieldOptions.show_input}"
          :show-tooltip="${fieldOptions.show_tooltip}"
          :max="${fieldOptions.max}"
          :min="${fieldOptions.min}"
          :step="${fieldOptions.step}"
          :disabled="readonly"
          :style="{width:width}"
        />
      </div>`
  // 评分
  } else if (fieldType === 'rate') {
    template =
      `<el-rate
        v-model="${model}"
        :max="${fieldOptions.max}"
        :allow-half="${fieldOptions.allow_half}"
        ${fieldOptions.show_text ? `show-text="${fieldOptions.show_text}"` : ''}
        ${fieldOptions.show_score ? `show-score="${fieldOptions.show_score}"` : ''}
        :disabled="readonly"
        class="ibps-pt-10"
      />`
  // 日期控件
  } else if (fieldType === 'datePicker' || fieldType === 'currentTime' || fieldType === 'currentDate') {
    const type = datePckerType(fieldOptions, fieldType)
    const dateType = dateDealFmt(fieldOptions, fieldType).dateType || 'datetime'
    const _datefmt = datefmt(fieldOptions, fieldType)
    if (type === 'datePicker') {
      template =
      `<el-date-picker
        v-model="${model}"
        type="${dateType}"
        value-format="yyyy-MM-dd HH:mm:ss"
        format="${_datefmt}"
        placeholder="${placeholder}"
        :style="{width:width}"
        :readonly="${fieldType === 'currentTime' || fieldType === 'currentDate' ? true : 'readonly'}"
        :clearable="${Utils.isNotEmpty(fieldOptions.clearable) ? fieldOptions.clearable : false}"
      />`
    } else if (type === 'timePicker') {
      template =
        `
        <el-time-picker
          v-model="${model}"
          value-format="${_datefmt}"
          format="${_datefmt}"
          placeholder="${placeholder}"
          :style="{width:width}"
          :readonly="${fieldType === 'currentTime' || fieldType === 'currentDate' ? true : 'readonly'}"
          :clearable="${Utils.isNotEmpty(fieldOptions.clearable) ? fieldOptions.clearable : false}"
        />`
    }
  /**
   * 增强字段
   */
  // 富文本框
  } else if (fieldType === 'editor') {
    template = `
      <ibps-ueditor
        v-model="${model}"
        placeholder="${placeholder}"
        :config="ueditorConfig.${prop}"
        :readonly="readonly"
        destroy
      />`
    // 保存import语句
    const sentence = "import IbpsUeditor from '@/components/ibps-ueditor'"
    const component = "'ibps-ueditor': IbpsUeditor"
    setSentences(sentence, component)

    const config = {
      initialContent: placeholder,
      toolbars: []
    }

    const toolbars = fieldOptions.toolbars
    if (toolbars && toolbars.length > 0) {
      config.toolbars.push(toolbars)
    }

    setData(ueditorConfig, prop, config)

  // 数据字典
  } else if (fieldType === 'dictionary') {
    template = `
      <ibps-dictionary
        v-model="${model}"
        type-key="${fieldOptions.dictionary}"
        :multiple="${Utils.isNotEmpty(fieldOptions.multiple) ? fieldOptions.multiple : false}"
        select-mode="${fieldOptions.select_mode}"
        display-mode="${fieldOptions.display_mode}"
        separator="${fieldOptions.split}"
        placeholder="${placeholder}"
        :disabled="readonly"
        :readonly="readonly"
        :readonly-text="readonlyText?'text':'original'"
        :clearable="${Utils.isNotEmpty(fieldOptions.clearable) ? fieldOptions.clearable : false}"
        :style="{width:width}"
      />
    `
    // 保存import语句
    const sentence = "import IbpsDictionary from '@/business/platform/cat/dictionary/select'"
    const component = "'ibps-dictionary': IbpsDictionary"
    setSentences(sentence, component)

  // 自动编号
  } else if (fieldType === 'autoNumber') {
    template = `<ibps-auto-number
        v-model="${model}"
        alias="${fieldOptions.identity}"
        :init="${fieldOptions.init === 'true' || fieldOptions.init}"
        placeholder="${placeholder}"
        :readonly="readonly"
        :readonly-text="readonlyText"
      />`
    // 保存import语句
    const sentence = "import IbpsAutoNumber from '@/business/platform/system/identity/auto-number'"
    const component = "'ibps-auto-number': IbpsAutoNumber"
    setSentences(sentence, component)
    setAutoNumber(prop, fieldOptions.identity, fieldOptions.init)

  // 上传附件
  } else if (fieldType === 'attachment') {
    template = `
      <ibps-attachment
        v-model="${model}"
        placeholder="${placeholder}"
        :download="${fieldOptions.download}"
        :readonly="readonly"
        ${Utils.isNotEmpty(fieldOptions.max_file_quantity) ? `:limit="${fieldOptions.max_file_quantity}"` : ''}
        ${Utils.isNotEmpty(fieldOptions.max_file_size) ? `:file-size="${fieldOptions.max_file_size}"` : ''}
        accept="${fileAccept(fieldOptions).replace(/\s+/g, '')}"
        :multiple="${fieldOptions.multiple}"
        upload-type="${fieldOptions.uploadType}"
        store="${fieldOptions.store}"
        media-type="${fieldOptions.media_type}"
        media="${fieldOptions.media}"
        :style="{width:width}"
      />
    `
    // 保存import语句
    const sentence = "import IbpsAttachment from '@/business/platform/file/attachment/selector'"
    const component = "'ibps-attachment': IbpsAttachment"
    setSentences(sentence, component)

  // 选择器
  } else if (fieldType === 'selector' || fieldType === 'currentUser' || fieldType === 'currentOrg') {
    template = `
      <ibps-user-selector
        v-model="${model}"
        placeholder="${placeholder}"
        type="${fieldOptions.selector_type}"
        ${Utils.isNotEmpty(fieldOptions.filter) ? `filter="${fieldOptions.filter}"` : ''}
        :multiple="${Utils.isNotEmpty(fieldOptions.multiple) ? fieldOptions.multiple : false}"
        store="${fieldOptions.store || 'id'}"
        :disabled="${(fieldType === 'currentUser' || fieldType === 'currentOrg') ? true : 'readonly'}"
        :readonly-text="readonlyText?'text':null"
        :style="{width:width}"
      />
    `
    // 保存import语句
    const sentence = "import IbpsUserSelector from '@/business/platform/org/selector'"
    const component = "'ibps-user-selector': IbpsUserSelector"
    setSentences(sentence, component)

  // 自定义对话框
  } else if (fieldType === 'customDialog') {
    template = `
    <ibps-custom-dialog
      v-model="${model}"
      template-key="${fieldOptions.dialog}"
      placeholder="${placeholder}"
      store="${fieldOptions.store}"
      icon="${fieldOptions.icon ? prefix + fieldOptions.icon : ''}"
      type="${fieldOptions.dialog_type}"
      :disabled="readonly"
      :readonly-text="readonlyText?'text':null"
      :style="{width:width}"
    />
    `
    // 保存import语句
    const sentence = "import IbpsCustomDialog from '@/business/platform/data/templaterender/custom-dialog'"
    const component = "'ibps-custom-dialog': IbpsCustomDialog"
    setSentences(sentence, component)

  // 关联数据
  } else if (fieldType === 'linkdata') {
    template = `
      <ibps-link-data
        v-model="${model}"
        template-key="${fieldOptions.linkdata}"
        placeholder="${placeholder}"
        :multiple="${Utils.toBoolean(fieldOptions['multiple'] === 'Y', true)}"
        structure="${fieldOptions['link_config'] ? fieldOptions['link_config'].structure || 'list' : 'list'}"
        value-key="${fieldOptions['link_config'] ? fieldOptions['link_config'].id || '' : ''}"
        label-type="${fieldOptions['link_config'] ? fieldOptions['link_config'].type || 'first' : 'first'}"
        label-key="${fieldOptions['link_config'] ? fieldOptions['link_config'].text || '' : ''}"
        :disabled="readonly"
        :readonly="readonly"
        :readonly-text="readonlyText?'text':'original'"
        :style="{width:width}"
      />
    `
    // 保存import语句
    const sentence = "import IbpsLinkData from '@/business/platform/data/templaterender/link-data'"
    const component = "'ibps-link-data': IbpsLinkData"
    setSentences(sentence, component)

  // 地址
  } else if (fieldType === 'address') {
    template = `
    <div>
      <ibps-address
        v-model="${model}"
        ${fieldOptions.size ? `size="${fieldOptions.size}"` : ''}
        top="${fieldOptions.top || 'country'}"
        top-val="${fieldOptions.topval ? fieldOptions.topval : ''}"
        level="${fieldOptions.level || 'district'}"
        :disabled="readonly"
        :readonly-text="readonlyText?'text':null"
        placeholder="${placeholder}"
        data-type="code"
        :style="{width:width}"
      />
      <span v-if="readonlyText">
        ${Utils.isNotEmpty(fieldOptions.street) ? fieldOptions.street : ''}
      </span>
      <template v-else>
        <p />`
    if (fieldOptions.is_street) {
      template += `
        <el-input
          v-model="${Utils.isNotEmpty(type) ? 'props.row.streetValue' : 'form.streetValue'}streetValue"
          :disabled="readonly"
          :style="{width:width}"
          placeholder="${fieldOptions.street_placeholder ? fieldOptions.street_placeholder : ''}"
          type="textarea"
        />
      `
    }
    template += `</template></div>`
    // 保存import语句
    const sentence = "import IbpsAddressCascader from '@/components/ibps-address/cascader'"
    const component = "'ibps-address': IbpsAddressCascader"
    setSentences(sentence, component)
  // 签名
  } else if (fieldType === 'signature') {
    template = `
      <ibps-signature
        v-model="${model}"
        placeholder="${placeholder}"
        ${fieldOptions.height ? `height="${fieldOptions.height}` : ''}
        :disabled="readonly"
        :style="{width:width}"
      />
    `
    // 保存import语句
    const sentence = "import IbpsSignature from '@/business/platform/form/formrender/dynamic-form/components/signature'"
    const component = "'ibps-signature': IbpsSignature"
    setSentences(sentence, component)

  // 图片
  } else if (fieldType === 'image') {
    template = `
      <ibps-image
        v-model="${model}"
        width="${Utils.isNotEmpty(fieldOptions.width) ? fieldOptions.width : ''}"
        height="${Utils.isNotEmpty(fieldOptions.height) ? fieldOptions.height : ''}"
        limit="${Utils.isNotEmpty(fieldOptions.limit) ? fieldOptions.limit : ''}"
        accept="${imagesAccept(fieldOptions).replace(/\s+/g, '')}"
        media="${Utils.isNotEmpty(fieldOptions.media) ? fieldOptions.media : ''}"
        tip="${Utils.isNotEmpty(fieldOptions.tip) ? fieldOptions.tip : ''}"
        size="${Utils.isNotEmpty(fieldOptions.size) ? fieldOptions.size : ''}"
        upload-type="${Utils.isNotEmpty(fieldOptions.uploadType) ? fieldOptions.uploadType : ''}"
        :disabled="readonly"
      />
    `
    // 保存import语句
    const sentence = "import IbpsImage from '@/business/platform/file/image'"
    const component = "'ibps-image': IbpsImage"
    setSentences(sentence, component)
  // 链接
  } else if (fieldType === 'hyperlink') {
    template = `
      <ibps-link
        text="${fieldOptions.text}"
        link="${fieldOptions.link}"
        show-type="${fieldOptions.showType}"
        text-type="${fieldOptions.textType}"
        link-type="${fieldOptions.linkType}"
        text-javascript="${fieldOptions.text_javascript}"
        type="${fieldOptions.type}"
        :form-data="dynamicForm"
        preview-entrance
        icon="${fieldOptions.icon ? prefix + fieldOptions.icon : ''}"
      />
    `
    // 保存import语句
    const sentence = "import IbpsLink from '@/components/ibps-link'"
    const component = "'ibps-link': IbpsLink"
    setSentences(sentence, component)
  // 文本
  } else if (fieldType === 'label') {
    template = `<span>
        ${fieldOptions.default_value ? fieldOptions.default_value : placeholder}
      </span>`
  }

  return template
}

// 其他字段
function generateOtherFieldTemplate(field) {
  const fieldType = field.field_type
  let template = ''
  // 描述
  if (fieldType === 'desc') {
    if (Utils.isNotEmpty(field)) {
      template = `
        <div class="ibps-desc">
          <div class="title">${field.label}</div>
          ${field.field_options && field.field_options.split_line ? `
          <div class="ibps-${field.field_options.line_style || 'dashed'}  divider" />
          ` : ''}
          ${field && field.desc ? `
          <div
            class="desc"
            v-html="'${Utils.formatText(field.desc).replace(/"/g, '&quot;').replace(/"/g, '&acute;')}'"
          />
          ` : ''}
        </div>
      `
    }

  // 分隔线
  } else if (fieldType === 'divider') {
    template =
      `
      <div>
        <el-divider
          content-position="${field.field_options.content_position}"
        >${field.label}
        </el-divider>
        ${field && field.desc ? `
        <div class="ibps-help-block">
          ${field.desc}
        </div>` : ''}
      </div>
      `
  // 警告
  } else if (fieldType === 'alert') {
    template =
    `
    <div class="ibps-pb-10">
      <el-alert
        title="${field.label}"
        description="${field.desc}"
        type="${field.field_options.type}"
        :closable="${field.field_options.closable}"
        close-text="${field.field_options.close_text}"
        :center="${field.field_options.center}"
        :show-icon="${field.field_options.show_icon}"
        effect="${field.field_options.effect}"
      />
    </div>
    `
  }
  return template
}

// 格式类型
function fileAccept(fieldOptions) {
  const mediaType = fieldOptions.media_type
  if (Utils.isEmpty(mediaType)) { return '*' }
  return ACCEPT[mediaType] || '*'
}
function imagesAccept(fieldOptions) {
  const accept = fieldOptions.accept
  if (Utils.isEmpty(accept)) { return ACCEPT['images'] }
  if (accept === 'custom') {
    return fieldOptions.media
  }
  return accept
}

let addLine = ''
// 生成按钮事件模版
function setBtnEventTemplate(eventName, columns, tableName) {
  // 为表格增加数据
  eventTemplate = `
    ${eventName}(type,name,tableName){
      // console.info(this.$refs[tableName].selection)
      // todo
      // 修改、删除可根据this.$refs[tableName].selection获取选中行的数据
      switch (type) {
        case 'add':
          console.info('新增:')
          // 为表格增加数据
          if(!(this.form[name] && Array.isArray(this.form[name]))){
            this.form[name] = []
          }
            ${
              addLine += (addLine.indexOf(tableName) != -1)? "" :
              " if(name === '"+tableName+"PoList')"+
                "this.form['"+tableName+"PoList'].push({"+
                    columns.map(item => {
                    if (item.field_type === 'checkbox' || item.field_type === 'table') {
                      return item.name + ':[]'
                    } else {
                      return item.name + ":''"
                    }
                  }).join(',\n')+ "});"
            }
          break
        case 'edit':
          console.info('修改:')
          break
        case 'remove':
          console.info('删除:')
          // eslint-disable-next-line no-case-declarations
          const _temps = this.$refs[tableName].selection
          if (_temps && _temps.length > 0) {
            this.$confirm('确定删除?', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            }).then(() => {
              this.form[name] = this.form[name].filter(item => {
                return !_temps.includes(item)
              })
              this.$message({
                message: '批量删除成功',
                type: 'success'
              })
            }).catch(() => {
              this.$message({
                type: 'info',
                message: '已取消删除'
              });          
            });
          } else {
            this.$message({
              message: '当前没有选择数据，请先选择数据',
              type: 'warning'
            })
          }
          break
        case 'import':
          console.info('导入')
          break
        case 'export':
          console.info('导出')
          break
        case 'custom':
          // 新增自定义对话框按钮
          break
        default:
          break
      }
    }
  `
}

// 保存import语句
function setSentences(sentence, component) {
  if (!sentences.includes(sentence)) {
    sentences.push(sentence)
    components.push(component)
  }
}

// 日期格式
function datefmt(fieldOptions, fieldType) {
  if (fieldOptions['datefmt_type'] && fieldOptions['datefmt_type'] !== 'custom') {
    if (fieldType === 'currentDate') {
      return FormOptions.t.DATE_FORMATS['date']
    } else if (fieldType === 'currentTime') {
      return FormOptions.t.DATE_FORMATS['time']
    } else {
      return FormOptions.t.DATE_FORMATS[fieldOptions['datefmt_type']] || FormOptions.t.DATE_FORMATS['date']
    }
  } else {
    return fieldOptions['datefmt'] || FormOptions.t.DATE_FORMATS['date']
  }
}
/**
 * 日期格式处理
 */
function dateDealFmt(fieldOptions, fieldType) {
  return DateFormatUtil.dealFmt(datefmt(fieldOptions, fieldType))
}
// 日期控件类型
function datePckerType(fieldOptions, fieldType) {
  return dateDealFmt(fieldOptions, fieldType).datePckerType
}

// 去除字符串引号
function dislodgeQuotationMarks(str, item) {
  validators.forEach(el => {
    str = str.replace(new RegExp(`"${item}":"${el}"`, 'gm'), `"${item}":${el}`)
    str = str.replace(new RegExp(`'${item}':'${el}'`, 'gm'), `'${item}':${el}`)
  })
  return str
}

/**
 * 生成模版
 * @param {*} formDef
 */
export default function(formDef) {
  sentences = []
  components = []
  styles = []
  formRules = []
  validators = []
  layoutVal = []
  eventTemplate = ''
  autoNumbers = []
  autoNumberIdentities = []
  autoNumberEvent = ''
  inputNumberEvent = ''
  btnEvent = ''
  returnSocpe = ''
  btns = {}
  stepsEvent = ''
  stepsActive = {}
  ueditorConfig = {}

  // 表单数据
  const formAttrs = formDef ? formDef.attrs || {} : {}

  // const hasHeader = formAttrs && !formAttrs.hide_name
  // const hasDesc = formAttrs && !formAttrs.hide_desc && Utils.isNotEmpty(formDef.desc)
  // const titlePosition = formAttrs.title_position === 'center' ? 'ibps-tc' : (formAttrs.title_position === 'right' ? 'ibps-tr' : '')

  const inline = formAttrs.inline || false
  const labelSuffix = formAttrs ? (formAttrs.colon ? formAttrs.labelSuffix || ':' : '') : ''
  const labelWidth = Utils.isNotEmpty(formAttrs.labelWidth) && Utils.isNotEmpty(formAttrs.labelWidthUnit) ? (formAttrs.labelWidth + formAttrs.labelWidthUnit) : '100px'

  const labelPosition = Utils.isNotEmpty(formAttrs.labelPosition) ? formAttrs.labelPosition : 'right'

  const statusIcon = Utils.isNotEmpty(formAttrs.statusIcon) ? formAttrs.statusIcon : false
  const hideRequiredAsterisk = Utils.toBoolean(formAttrs.hideRequiredAsterisk, false)

  // 表单数据
  const form = {}
  descPosition = formDef.attrs ? formDef.attrs.descPosition : ''
  generateModles(formDef.fields, form, "")
  // 表单模版
  const formTempale = generateFormTempale(formDef.fields)
  // 形成created方法模板
  let createdMethod = `
    created(){
      this.defaultForm = JSON.parse(JSON.stringify(this.form))
      this.defaulRules = JSON.parse(JSON.stringify(this.rules))
    },
    `

  // 形成autoNumbers初始化方法模板
  let autoNumbersInit = '// 初始化流水号'
  if (Utils.isNotEmpty(autoNumbers)) {
    autoNumbers.forEach((el, i) => {
      autoNumbersInit += `
        this.initAuto('${autoNumberIdentities[i]}','${el}')
        `
    })
  }

  return `<template>
  <el-dialog
    :title="title"
    :visible.sync="dialogVisible"
    :close-on-click-modal="false"
    class="dialog"
    :fullscreen="true"
    @open="getFormData"
    @close="closeDialog"
  >
      <el-form
        ref="form"
        :model="form"
        ${Utils.isNotEmpty(formRules) ? `:rules="rules"` : ''}
        :inline="inline"
        :label-suffix="labelSuffix"
        :label-width="labelWidth"
        :label-position="labelPosition"
        :status-icon="statusIcon"
        :size="size"
        :hide-required-asterisk="hideRequiredAsterisk"
        @submit.native.prevent
      >
        ${formTempale}
      </el-form>

      ${formTempale ? `
      <div slot="footer" class="el-dialog--center">
        <ibps-toolbar :actions="toolbars" @action-event="handleDialogActionEvent" ref="toolbar" />
      </div>
      ` : ''}

    </el-dialog>
</template>
<script>
${Utils.isNotEmpty(autoNumbers) ? `import { getNextIdByAlias } from '@/api/platform/system/identity'` : ''}
${Utils.isNotEmpty(validators) ? `import { ${validators.join(', ')} } from '@/utils/validate'` : ''}

import ActionUtils from '@/utils/action'
import { save, get } from '@/api/sysName/moduleName/formName@'

${sentences.join('\n')}
  export default {
    props: {
      visible: {
        type: Boolean,
        default: true
      },
      readonly: {
        type: Boolean,
        default: false
      },
      id: String,
      title: String
    },
    ${components && components.length > 0 ? `
    components: {
      ${components.join(',\n')}
    },` : ''}
    data () {
      return {
        //
        formName: 'form',
        formLabelWidth: '120px',
        dialogVisible: this.visible,
        dialogLoading: false,
        defaultForm: {},
        defaulRules: {},
        //
        dynamicForm: this,
        form:${JSON.stringify(form)},
        inline:${inline},
        labelSuffix:'${labelSuffix}',
        labelWidth:'${labelWidth}',
        labelPosition:'${labelPosition}',
        statusIcon:${statusIcon},
        size:'',
        hideRequiredAsterisk:${hideRequiredAsterisk},
        
        // readonly:false,
        readonlyText:true,
        multiple:false,
        autosize:'',
        width:'',
        toolbars:[
          {
            key: 'save', hidden: () => { return this.readonly },
            label: '提交',
            type: 'primary',
          },
          {
            key: 'cancel',
            label: '关闭'
          }
        ]
        ${Utils.isNotEmpty(layoutVal) ? `,formLayout:{${layoutVal.join(',')}}` : ''}
        ${Utils.isNotEmpty(formRules) ? ',rules:{' + dislodgeQuotationMarks(formRules.join(',\n'), 'validator') + '}' : ''}
        ${Utils.isNotEmpty(btns) ? `,manageButtons:${JSON.stringify(btns)}` : ''}
        ${Utils.isNotEmpty(stepsActive) ? `,stepsActive:${JSON.stringify(stepsActive)}` : ''}
        ${Utils.isNotEmpty(ueditorConfig) ? `,ueditorConfig:${JSON.stringify(ueditorConfig)}` : ''}
      }
    },

    ${Utils.isNotEmpty(returnSocpe) ? `
    computed: {
      ${returnSocpe}
      ${getFormId}
    },
    ` : `
    computed: {
      ${getFormId}
    },`}

    watch: {
      visible: {
        handler: function (val, oldVal) {
          this.dialogVisible = this.visible
        },
        immediate: true,
      },
      form: {
        handler(val) {
          this.$nextTick(() => {
            setTimeout(() => {
              this.$refs[this.formName].validate(() => {})
            }, 500)
          })
        },
        deep: true
      }
    },
    
    ${createdMethod}
    methods: {
      ${stepsEvent}
      ${btnEvent}
      ${Utils.isNotEmpty(inputNumberEvent) ? inputNumberEvent : ''}

      // 保存所有子表名称
      ${Utils.isNotEmpty(subTableNames) ? `
        getSubTableNames() {
          return [${subTableNames}]
        },
        ` : `
        getSubTableNames() {
          return []
        },`}
        // 保存所有checkbox字段名称
        ${Utils.isNotEmpty(checkboxFieldNames) ? `
          getCheckboxFileds() {
            return [${checkboxFieldNames}]
          },
          ` : `
          getCheckboxFileds() {
            return []
          },`}

          //加载表单数据时，转换checkbox字符串to数组
          convertCheckboxStrToArray() {
            let fieldNameArray = this.getCheckboxFileds()
            let subTableArray = this.getSubTableNames()
            // 主表checkbox
            fieldNameArray.forEach((fieldName) => {
              // console.log('this.form:fieldName='+fieldName)
              if(this.form[fieldName]){
                this.form[fieldName] = this.form[fieldName].split(',')
              }
            })
            // 子表checkbox
            subTableArray.forEach((tableName) => {
              // console.log('tableName:' + tableName)
              for (var p in this.form[tableName]) {
                // 遍历json对象的每个key/value对,p为key
                for (var k in this.form[tableName][p]) {
                  if ( fieldNameArray.includes(tableName + '.' + k) ) {
                    this.form[tableName][p][k] = this.form[tableName][p][k].split(',')
                  }
                }
              }
            })
            // console.log("this.form:" + JSON.stringify(this.form))
          },
          //提交表单数据时，转换checkbox数组to字符串
          convertCheckboxArrayToStr() {
            let formCopy = JSON.parse(JSON.stringify(this.form))
            let fieldNameArray = this.getCheckboxFileds()
            let subTableArray = this.getSubTableNames()
            // 主表checkbox
            fieldNameArray.forEach((fieldName) => {
              // console.log("fieldName=" + fieldName)
              if (formCopy[fieldName]) {
                formCopy[fieldName] = formCopy[fieldName].join(',')
              }
            })
            // 子表checkbox
            subTableArray.forEach((tableName) => {
              // console.log('tableName:' + tableName)
              for (var p in formCopy[tableName]) {
                // 遍历json对象的每个key/value对,p为key
                for (var k in formCopy[tableName][p]) {
                  if (
                    fieldNameArray.includes(tableName + '.' + k) && Array.isArray(formCopy[tableName][p][k])
                  ) {
                    formCopy[tableName][p][k] = formCopy[tableName][p][k].join(',')
                  }
                }
              }
            })
            // console.log('formCopy:' + JSON.stringify(formCopy))
            return formCopy
          },

      handleDialogActionEvent(button){
        // console.log('handleDialogActionEvent:button=' + JSON.stringify(button))
        switch (button.key) {
          case 'save':
            this.handleSave()
            break
          case 'cancel':
            this.closeDialog()
            break
          default:
            break
        }
      },

      // 表单验证
      formValidate() {
        if (this.readonly) return
        this.$nextTick(() => {
          this.$refs[this.formName].validate(() => {})
        })
      },

      // 保存数据
      handleSave() {
        this.$refs[this.formName].validate(valid => {
          if (valid) {
            this.saveData()
          } else {
            ActionUtils.saveErrorMessage()
          }
        })
      },

      // 提交保存数据
      saveData() {
        // console.log('saveData-from:' + JSON.stringify(this.form))
        let formCopy = this.convertCheckboxArrayToStr()
        // console.log('saveData-formCopy' + JSON.stringify(formCopy))
        save(formCopy).then(response => {
          this.$emit('callback', this)
          ActionUtils.saveSuccessAlert(response.message, (rtn) => {
            if (this.$utils.isEmpty(this.formId)) {
              this.$refs[this.formName].resetFields()
            }
            if (rtn) {
              this.closeDialog()
            }
          })
        }).catch((err) => {
          console.info(err)
        })
      },

      // 关闭当前窗口
      closeDialog() {
        this.$emit('close', false)
        this.$refs[this.formName].resetFields()
      },

      // 获取表单数据
      getFormData() {
        // console.log('getFormData formId:' + this.formId)
        if (this.readonly) {
          this.rules = {}
        } else {
          this.rules = this.defaulRules
        }
        if (this.$utils.isEmpty(this.formId)) {
          // 重置表单
          this.form = JSON.parse(JSON.stringify(this.defaultForm))
          ${autoNumbersInit}
          this.formValidate()
          return
        }
        this.dialogLoading = true
        get({
          id: this.formId
        }).then(response => {
          // console.log('response:' + JSON.stringify(response))
          this.form = response.data
          // console.log('response.data:' + JSON.stringify(response.data))
          this.convertCheckboxStrToArray()
          this.dialogLoading = false
        }).catch(() => {
          this.dialogLoading = false
        })
      }
      ${Utils.isNotEmpty(autoNumberEvent) ? `,${autoNumberEvent}` : ''}
      ${Utils.isNotEmpty(eventTemplate) ? `,${eventTemplate}` : ''}
    }
  }
</script>
<style lang="scss">
.dynamic-form {
  .el-input{
    width: 100%;
  }
  .el-select{
    width: 100%;
  }

  .el-collapse-item__header.is-active{
    border-bottom: 1px solid #EBEEF5;
    margin-bottom: 5px;
  }
  .form-header {
    border-bottom: 1px solid #2b34410d;
    margin-bottom: 5px;
    .title {
      font-size: 16px;
      font-weight: bold;
      color: #222;
      text-align: left;
      padding: 8px 10px 10px;
      margin: 0;
    }
    .desc {
      word-wrap: break-word;
      word-break: normal;
      text-indent: 0;
      line-height: 1.6;
      margin: 0 0 11px;
      padding: 3px 30px 8px;
    }
  }
  .dynamic-form-table-item__readonly{
    margin-bottom: 0;
  }

//===================border-form====================
  .ibps-border-form {
    border: 1px solid #cfd7e5;

    .el-form-item{
      border-top: 1px solid #cfd7e5;
    }

    .el-form-item__content:before {
      width: 1px;
      background: #cfd7e5;
      display: block;
      content: "";
      position: absolute;
      left: 0;
      top: 0;
      bottom:-20px;
    }

    .el-form-item__content .el-form-item__error {
      left: 5px
    }

    .el-form--label-top .el-form-item__content:before,
    .no-label-form-item .el-form-item__content:before {
      background: transparent
    }

    .el-row+.el-row {
      border-top: 1px solid #cfd7e5
    }

    .el-col+.el-col {
      border-left: 1px solid #cfd7e5
    }

    .el-col {
      overflow: hidden
    }

    .el-form-item__content {
      padding: 5px;
      padding-bottom: 0
    }

    .el-form-item__label {
      padding: 5px
    }

    .el-table{
      .el-form-item{
          border-top: 0;
      }
      .el-form-item__content:before {
        width: 0;
      }
      .el-form-item__content {
        padding: 0;
      }

    }

  }
  .machine_direction{
    display: flex;
    flex-direction: column;
  }
  .edui-editor{
    z-index: 1000!important;
  }

}
${styles.join(',\n')}

.el-dialog__header__todo {
  padding: 0;
  border-bottom: 0;
}
.el-dialog__body {
  padding: 0 2px 0 2px;
}
.el-dialog__headerbtn {
  z-index: 99999;
}
@media print {
  .el-dialog__headerbtn {
    display: none !important;
  }
  .hidden-print {
    padding: 0;
    margin: 0;
  }
}

</style>
`
}

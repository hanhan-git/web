<template>
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
        
        :inline="inline"
        :label-suffix="labelSuffix"
        :label-width="labelWidth"
        :label-position="labelPosition"
        :status-icon="statusIcon"
        :size="size"
        :hide-required-asterisk="hideRequiredAsterisk"
        @submit.native.prevent
      >
        
      <el-form-item
      label="采购人"
      
      prop="caiGouRen"
      
      ><el-input
      v-model="form.caiGouRen"
      placeholder="请输入"
      type="text"
      name="caiGouRen"
      :autosize="autosize"
      :rows="3"
      :readonly="readonly"
      clearable
      :style="{width:width}"
    /> 
      </el-form-item>
    
      <el-form-item
      label="金额"
      
      prop="jinE"
      
      ><el-input
      v-model="form.jinE"
      placeholder="请输入"
      type="number"
      name="jinE"
      :autosize="autosize"
      :rows="3"
      :readonly="readonly"
      clearable
      @keypress="channelInputLimit"
      :style="{width:width}"
    /> 
      </el-form-item>
    
      <el-form-item
      label="创建时间"
      
      prop="createTime"
      
      ><el-date-picker
        v-model="form.createTime"
        type="date"
        value-format="yyyy-MM-dd HH:mm:ss"
        format="yyyy-MM-dd"
        placeholder="请选择"
        :style="{width:width}"
        :readonly="readonly"
        :clearable="false"
      />
      </el-form-item>
    
      </el-form>

      
      <div slot="footer" class="el-dialog--center">
        <ibps-toolbar :actions="toolbars" @action-event="handleDialogActionEvent" ref="toolbar" />
      </div>
      

    </el-dialog>
</template>
<script>



import ActionUtils from '@/utils/action'


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
        form:{"id":"","caiGouRen":"","jinE":"","createTime":""},
        inline:false,
        labelSuffix:'',
        labelWidth:'100px',
        labelPosition:'right',
        statusIcon:false,
        size:'',
        hideRequiredAsterisk:false,
        
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
        
        
        
        
        
      }
    },

    
    computed: {
      
    },

    watch: {
      visible: {
        handler: function (val, oldVal) {
          this.dialogVisible = this.visible
        },
        immediate: true,
      },
      form: {
        handler(val) {
          this.$nextTick(() => {
            setTimeout(() => {
              this.$refs[this.formName].validate(() => {})
            }, 500)
          })
        },
        deep: true
      }
    },
    
    
    created(){
      this.defaultForm = JSON.parse(JSON.stringify(this.form))
      this.defaulRules = JSON.parse(JSON.stringify(this.rules))
    },
    
    methods: {
      
      
      
  channelInputLimit(e) {
    if (e.key === 'e') {
      e.returnValue = false
      return false
    }
    return true
  },
  

      // 保存所有子表名称
      
        getSubTableNames() {
          return []
        },
        // 保存所有checkbox字段名称
        
          getCheckboxFileds() {
            return []
          },

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
          // 初始化流水号
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

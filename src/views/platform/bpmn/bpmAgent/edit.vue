<template>
  <el-dialog
    :title="title"
    :visible.sync="dialogVisible"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    append-to-body
    class="bpmn-agent-dialog"
    width="80%"
    top="10vh"
    @open="getFormData"
    @close="closeDialog"
  >
    <el-form
      ref="agentForm"
      v-loading="dialogLoading"
      :element-loading-text="$t('common.loading')"
      :model="bpmAgent"
      :rules="rules"
      :label-width="formLabelWidth"
      @submit.native.prevent
    >
      <el-form-item label="标题:" prop="title">
        <el-input v-if="!readonly" v-model="bpmAgent.title" />
        <span v-else>{{ bpmAgent.title }}</span>
      </el-form-item>
      <el-row>
        <el-col :span="12" col>
          <el-form-item label="代理类型:" prop="agentType">
            <el-radio-group v-if="!readonly" v-model="bpmAgent.agentType">
              <el-radio
                v-for="option in agentTypeOptions"
                :key="option.value"
                :label="option.value"
              >{{ option.label }}</el-radio>
            </el-radio-group>
            <el-tag v-else :type="bpmAgent.agentType|optionsFilter(agentTypeOptions,'type')">{{ bpmAgent.agentType|optionsFilter(agentTypeOptions,'label') }}</el-tag>
          </el-form-item>

        </el-col>
        <el-col :span="12" col>
          <el-form-item label="是否启用:" prop="isEnabled">
            <el-switch
              v-if="!readonly"
              v-model="bpmAgent.isEnabled"
              active-value="enabled"
              inactive-value="disabled"
            />
            <el-tag v-else :type="bpmAgent.isEnabled|optionsFilter(statusOptions,'type')">{{ bpmAgent.isEnabled|optionsFilter(statusOptions,'label') }}</el-tag>
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item label="委托人:" prop="delegatorId">
        <ibps-employee-selector
          v-if="!readonly"
          v-model="bpmAgent.delegatorId"
          @callback="callbackDelegatorrInfo"
        />
        <span v-else>{{ bpmAgent.delegatorName }}</span>
      </el-form-item>
      <el-row>
        <el-col :span="12" col>
          <el-form-item label="生效时间:" prop="effectiveTime">
            <el-date-picker v-if="!readonly" v-model="bpmAgent.effectiveTime" type="date" value-format="yyyy-MM-dd" style="width：100%;" />
            <span v-else>{{ bpmAgent.effectiveTime }}</span>
          </el-form-item>

        </el-col>
        <el-col :span="12" col>
          <el-form-item label="失效时间:" prop="expiryTime">
            <el-date-picker v-if="!readonly" v-model="bpmAgent.expiryTime" type="date" value-format="yyyy-MM-dd" style="width：100%;" />
            <span v-else>{{ bpmAgent.expiryTime }}</span>
          </el-form-item>

        </el-col>
      </el-row>

      <!-- 全部代理 || 部分代理 -->
      <el-form-item v-if="bpmAgent.agentType === 'all' || bpmAgent.agentType === 'part'" label="代理人:" prop="agenterId">
        <ibps-employee-selector
          v-if="!readonly"
          v-model="bpmAgent.agenterId"
          @callback="callbackAgenterInfo"
        />
        <span v-else>{{ bpmAgent.agenterName }}</span>
      </el-form-item>

      <div v-if="bpmAgent.agentType === 'part'">
        <el-form-item label="流程定义">
          <div v-if="!readonly" class="dialog-right">
            <bpm-definition-selector
              button
              multiple
              @callback="updateDefine"
            />
            <el-button class="ibps-icon-remove ibps-ml-10" type="danger" @click="handleAllDelete(multipleSelection)">删除</el-button>
          </div>
        </el-form-item>
        <el-form-item
          v-loading="rowLoading"
          label-width="20px"
          :element-loading-text="$t('common.loading')"
        >
          <el-table
            ref="multipleTable"
            border
            :data="bpmAgent.bpmAgentDefPoList"
            tooltip-effect="dark"
            style="width: 100%"
            @selection-change="handleSelectionChange"
          >
            <el-table-column
              v-if="!readonly"
              type="selection"
              width="45"
            />
            <el-table-column
              label="流程名称"
            >
              <template slot-scope="scope">{{ scope.row.procDefName?scope.row.procDefName:scope.row.name }}</template>
            </el-table-column>
            <el-table-column v-if="!readonly" label="操作" width="55">
              <template slot-scope="scope">
                <el-button type="danger" icon="el-icon-delete" circle @click="handleDelete(scope.$index, scope.row)" />
              </template>
            </el-table-column>
          </el-table>
        </el-form-item>
      </div>

      <!-- 条件代理 -->
      <div v-if="bpmAgent.agentType === 'condition'">
        <el-form-item label="流程名称:">
          <bpm-definition-selector
            v-model="bpmAgent.procDefId"
            :disabled="readonly"
          />
        </el-form-item>
        <el-form-item label="流程代理条件">
          <div v-if="!readonly" class="dialog-right">
            <el-button class="ibps-icon-add" type="primary" @click="openConditionDialog">添加</el-button>
            <el-button class="ibps-icon-remove ibps-ml-5" type="danger">删除</el-button>
          </div>
        </el-form-item>
        <el-form-item
          v-loading="rowLoading"
          label-width="20px"
          :element-loading-text="$t('common.loading')"
        >
          <el-table
            ref="multipleTable"
            :data="bpmAgent.bpmAgentConditionPoList"
            tooltip-effect="dark"
            style="width: 100%"
            @selection-change="handleConditionChange"
          >
            <el-table-column
              type="selection"
              width="55"
            />
            <el-table-column
              label="代理人"
            >
              <template slot-scope="scope">{{ scope.row.agenterName }}</template>
            </el-table-column>
            <el-table-column
              label="条件名称"
            >
              <template slot-scope="scope">{{ scope.row.name }}</template>
            </el-table-column>
            <el-table-column
              prop="address"
              label="管理"
              width="100px"
              show-overflow-tooltip
            >
              <el-button type="primary" icon="el-icon-edit" circle @click="handleEdit(scope.$index, scope.row)" />
              <el-button type="danger" icon="el-icon-delete" circle @click="handleRemove(scope.$index, scope.row)" />
            </el-table-column>
          </el-table>
        </el-form-item>

      </div>
    </el-form>
    <div slot="footer" class="el-dialog--center">
      <ibps-toolbar
        :actions="toolbars"
        @action-event="handleActionEvent"
      />
    </div>

    <!-- 添加规则弹窗 -->
    <condition
      :def-id="bpmAgent.procDefId"
      :visible="conditionDialogVisible"
      @callback="callbackBpmAgentConditionPoList"
      @close="visible => conditionDialogVisible = visible"
    />
  </el-dialog>
</template>

<script>
import { save, get } from '@/api/platform/bpmn/bpmAgent'
import { agentTypeOptions, statusOptions } from './constants'
import ActionUtils from '@/utils/action'
import IbpsEmployeeSelector from '@/business/platform/org/employee/selector'
import BpmDefinitionSelector from '@/business/platform/bpmn/definition/selector'
import Condition from './condition'
import { setTimeout } from 'timers'

export default {
  components: {
    IbpsEmployeeSelector,
    BpmDefinitionSelector,
    Condition
  },
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    readonly: {
      type: Boolean,
      default: false
    },
    id: String,
    title: String
  },
  data() {
    return {
      formName: 'agentForm',
      formLabelWidth: '120px',
      dialogVisible: this.visible,
      conditionDialogVisible: false, // 条件规则界面
      dialogLoading: false,
      rowLoading: false,
      statusOptions: statusOptions,
      agentTypeOptions: agentTypeOptions,
      defaultForm: {},
      multipleSelection: [],
      conditionSelection: [],
      bpmAgent: {
        title: '',
        procDefId: '',
        procDefKey: '',
        delegatorId: this.$store.getters.userId,
        delegatorName: this.$store.getters.name,
        effectiveTime: '',
        expiryTime: '',
        agenterId: '',
        agenterName: '',
        agentType: 'all',
        isEnabled: 'enabled',
        bpmAgentDefPoList: [],
        bpmAgentConditionPoList: []
      },
      rules: {
        title: [{ required: true, message: this.$t('validate.required') },
          { min: 1, max: 64, message: '长度不能超过64个字符', trigger: 'blur' }],
        delegatorId: [{ required: true, message: this.$t('validate.required') }],
        agenterId: [{ required: true, message: this.$t('validate.required') }],
        effectiveTime: [{ required: true, message: this.$t('validate.required') }],
        expiryTime: [{ required: true, message: this.$t('validate.required') }]
      },
      toolbars: [
        { key: 'save', hidden: () => { return this.readonly } },
        { key: 'cancel' }
      ]
    }
  },
  computed: {
    formId() {
      return this.id
    }
  },
  watch: {
    visible: {
      handler: function(val, oldVal) {
        this.dialogVisible = this.visible
      },
      immediate: true
    }
  },
  created() {
    this.defaultForm = JSON.parse(JSON.stringify(this.bpmAgent))
  },
  mounted() {
    this.$nextTick(() => {
      if (this.$refs.multipleTable) {
        this.$refs.multipleTable.doLayout()
      }
    })
  },
  methods: {
    handleEdit() {
      this.rowLoading = true
      setTimeout(() => {
        this.rowLoading = false
        // TODO:
      })
    },
    handleRemove() {
      this.rowLoading = true
      setTimeout(() => {
        this.rowLoading = false
        // TODO:
      })
    },
    callbackBpmAgentConditionPoList(data) {
      console.log(data)
    },
    handleDelete(index, arr) {
      this.rowLoading = true
      setTimeout(() => {
        if (arr !== []) {
          this.bpmAgent.bpmAgentDefPoList.splice(index, 1)
        } else {
          arr.forEach(i => {
            this.bpmAgent.bpmAgentDefPoList.forEach(l => {
              if (i.procDefKey === l.procDefKey) {
                this.bpmAgent.bpmAgentDefPoList.splice(l, 1)
              }
            })
          })
        }
        this.rowLoading = false
      })
    },
    handleAllDelete(arr) {
      this.rowLoading = true
      setTimeout(() => {
        if (!this.$utils.isEmpty(arr)) {
          arr.forEach(i => {
            this.bpmAgent.bpmAgentDefPoList.forEach(l => {
              if (i.procDefKey === l.procDefKey) {
                this.bpmAgent.bpmAgentDefPoList.splice(l, 1)
              }
            })
          })
        }
        this.rowLoading = false
      })
    },
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    handleConditionChange(val) {
      this.conditionSelection = val
    },
    handleActionEvent({ key }) {
      switch (key) {
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
      const data = JSON.parse(JSON.stringify(this.bpmAgent))
      data.effectiveTime = new Date(this.bpmAgent.effectiveTime).getTime() || ''
      data.expiryTime = new Date(this.bpmAgent.expiryTime).getTime() || ''
      // 检测生效时间日期是否发布日期在之前。
      if (data.effectiveTime > data.expiryTime) {
        ActionUtils.error('生效时间与失效时间范围不合法!')
        return
      }
      if (this.$utils.isEmpty(this.bpmAgent.bpmAgentDefPoList) && this.bpmAgent.agentType === 'part') {
        ActionUtils.error('流程定义数据不能为空！')
        return
      }
      save(this.bpmAgent).then(response => {
        this.$emit('callback', this)
        ActionUtils.saveSuccessMessage(response.message, (rtn) => {
          if (this.$utils.isEmpty(this.formId)) {
            this.$refs[this.formName].resetFields()
          }
          if (rtn) {
            this.closeDialog()
          }
        })
      }).catch((err) => {
        console.error(err)
      })
    },
    // 关闭当前窗口
    closeDialog() {
      this.$emit('close', false)
      this.$refs[this.formName].resetFields()
    },
    /**
     * 表单验证
     */
    formValidate() {
      if (this.readonly) return
      this.$nextTick(() => {
        this.$refs[this.formName].validate(() => {})
      })
    },
    /**
     * 获取表单数据
     */
    getFormData() {
      if (this.$utils.isEmpty(this.formId)) {
        // 重置表单
        this.bpmAgent = JSON.parse(JSON.stringify(this.defaultForm))
        this.formValidate()
        return
      }
      this.dialogLoading = true
      get({
        id: this.formId
      }).then(response => {
        this.bpmAgent = response.data
        console.log(this.bpmAgent)
        this.formValidate()
        this.dialogLoading = false
      }).catch(() => {
        this.dialogLoading = false
      })
    },
    addDef() {
      alert('打开流程选择器')
    },
    callbackDelegatorrInfo(data) {
      this.bpmAgent.delegatorName = data.name
    },
    callbackAgenterInfo(data) {
      this.bpmAgent.agenterName = data.name
    },
    updateDefine(data) {
      this.rowLoading = true
      const arr = data.map(item => {
        return {
          id: '',
          agentId: '',
          procDefKey: item.defKey,
          nodeId: '',
          name: item.name
        }
      })
      setTimeout(() => {
        if (this.$utils.isEmpty(this.bpmAgent.bpmAgentDefPoList)) {
          this.bpmAgent.bpmAgentDefPoList = arr
        } else {
          this.bpmAgent.bpmAgentDefPoList = this.bpmAgent.bpmAgentDefPoList.concat(arr)
        }
        this.rowLoading = false
      })
    },
    openConditionDialog() {
      if (this.$utils.isEmpty(this.bpmAgent.procDefId)) {
        ActionUtils.warning('请选择流程！!')
        return
      }
      this.conditionDialogVisible = true
    }
  }

}
</script>

<style lang="scss">
.bpmn-agent-dialog{
  .el-dialog__body{
    height:  calc(70vh - 110px) !important;
  }
  .dialog-right{
    float: right;
    div{
      display: inline-block;
    }
  }
}
</style>

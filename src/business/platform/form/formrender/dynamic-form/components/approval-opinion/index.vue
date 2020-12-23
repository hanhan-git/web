<template>
  <div>
    <template v-if="opinionData && opinionData.length >0">
      <!--审批历史记录-- 横向-->
      <el-table v-if="layout === 'horizontal'" :data="opinionData" border stripe>
        <template v-for="(item,j) in options">
          <el-table-column v-if="item.checked" :key="j" :label="item.label">
            <template slot-scope="{row}">
              <template v-if="item.value==='statusName'">
                <el-tag style="border: 0;background-color:unset;" :style="{'color':row.nodeColor}" effect="plain">
                  {{ row[item.value]|filterData(item,row) }}
                </el-tag>
              </template>
              <template v-else-if="item.value==='opinion'">
                <el-tooltip placement="bottom">
                  <div slot="content" style="width:500px;"> {{ row[item.value]|filterData(item,row) }}</div>
                  <div class="ibps-field-text ibps-multi-ellipsis--l3">
                    {{ row[item.value]|filterData(item,row) }}
                  </div>
                </el-tooltip>
              </template>
              <template v-else>
                <div class="ibps-field-text">{{ row[item.value]|filterData(item,row) }}</div>
              </template>
            </template>
          </el-table-column>
        </template>
      </el-table>
      <template v-else>
        <!--审批历史记录, 纵向-->
        <template v-for="(row,i) in opinionData">
          <el-card :key="i" shadow="hover" class="ibps-mb-10">
            <el-row v-for="(item,j) in options" :key="i+j" :gutter="20">
              <template v-if="item.checked">
                <el-col :xs="8" :sm="6" :md="4" :lg="3" :xl="1" class="ibps-tr">{{ item.label }}:</el-col>
                <el-col :xs="16" :sm="18" :md="20" :lg="21" :xl="23">
                  <el-tag v-if="item.value==='statusName'" style="border: 0;background-color:unset;" :style="{'color':row.nodeColor}" effect="plain">
                    {{ row[item.value]|filterData(item,row) }}
                  </el-tag>
                  <template v-else-if="item.value==='opinion'">
                    <el-tooltip placement="bottom">
                      <div slot="content" style="width:500px;"> {{ row[item.value]|filterData(item,row) }}</div>
                      <div class="ibps-field-text ibps-multi-ellipsis--l3">
                        {{ row[item.value]|filterData(item,row) }}
                      </div>
                    </el-tooltip>
                  </template>
                  <template v-else>
                    {{ row[item.value]|filterData(item,row) }}
                  </template>
                </el-col>
              </template>
            </el-row>
          </el-card>

        <!-- <el-table :data="opinionData" :show-header="false" border stripe>
          <el-table-column>
            <template slot-scope="{row}">
              <template v-for="(item,j) in options">
                <span v-if="item.checked" :key="j">
                  {{ item.label }}:
                  <el-tag v-if="item.value==='statusName'" style="border: 0;background-color:unset;" :style="{'color':row.nodeColor}" effect="plain">
                    {{ row[item.value]|filterData(item,row) }}
                  </el-tag>
                  <template v-else-if="item.value==='opinion'">
                    <el-tooltip placement="bottom">
                      <div slot="content" style="width:500px;"> {{ row[item.value]|filterData(item,row) }}</div>
                      <div class="ibps-field-text ibps-multi-ellipsis--l3">
                        {{ row[item.value]|filterData(item,row) }}
                      </div>
                    </el-tooltip>
                  </template>
                  <div v-else class="ibps-field-text">{{ row[item.value]|filterData(item,row) }}</div>
                  <div
                    v-if="itemsCheckedLength !== j"
                    class="el-divider el-divider--horizontal ibps-mt-5 ibps-mb-5"
                  />
                </span>
              </template>
            </template>
          </el-table-column>
        </el-table> -->
        </template>
      </template>
    </template>
    <ibps-approval-opinion
      v-if="!readonly"
      v-model="data"
      :enable-common="commonCtatment"
      :placeholder="placeholder"
    />
  </div>
</template>
<script>
import Utils from '@/utils/util'
import { format, dateDealFmt } from '@/utils/fecha'
import IbpsApprovalOpinion from '@/business/platform/bpmn/components/approval-opinion'

export default {
  components: {
    IbpsApprovalOpinion
  },
  filters: {
    filterData(val, config, data) {
      if (config.value === 'auditorName') {
        if (Utils.isEmpty(data.auditor) &&
          Utils.isNotEmpty(data.qualifiedExecutor)) {
          // 会签  审批人处理
          const name = []
          for (var i = 0; i < data.qualifiedExecutor.length; i++) {
            name.push(data.qualifiedExecutor[i].executor)
          }
          val = name.join(' ')
        }
      } else if (config.value === 'completeTime') { // 审批时间
        if (Utils.isNotEmpty(val)) {
          let dateObj = val
          const dateFormat = 'yyyy-MM-dd HH:mm:ss'
          try {
            if (typeof dateObj === 'number') {
              dateObj = new Date(dateObj)
            }
            if (Object.prototype.toString.call(dateObj) !== '[object Date]' || isNaN(dateObj.getTime())) {
              // 需要把字符串转换日期格式
              dateObj = dateDealFmt.dealFmt(dateObj, dateFormat)
            }
            val = format(dateObj, dateFormat)
          } catch (error) {
            console.error('转换日期格式错误：', error)
            val = ''
          }
        }
      }
      return val
    }
  },
  inject: {
    elForm: {
      default: ''
    }
  },
  props: {
    value: String,
    field: Object, // 字段
    readonly: { // 只读
      type: Boolean,
      default: false
    },
    readonlyStyle: String, // 只读样式
    opinionData: { // 审批意见
      type: Array
    },
    params: Object
  },
  data() {
    return {
      data: ''
    }
  },
  computed: {
    commonCtatment() {
      return this.field ? this.field.field_options.common_statment : true
    },
    layout() {
      return this.field ? this.field.field_options.arrangement : 'horizontal'
    },
    options() {
      return this.field ? this.field.field_options.options : []
    },
    optionsCheckedLength() {
      let k = 0
      for (let i = 0; i < this.options.length; i++) {
        const option = this.options[i]
        if (option.checked) {
          k = i
        }
      }
      return k
    },
    placeholder() {
      return this.field ? this.field.field_options.placeholder : ''
    }
  },
  watch: {
    value(val) {
      this.data = val
    },
    data: {
      handler(val) {
        this.$emit('update:value', val)
      },
      deep: true
    }
  }
}
</script>

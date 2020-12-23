<template>
  <!--其他-->
  <widget-form-other
    v-if="isOtherFieldType"
    :element="element"
    :select.sync="selectWidget"
    :index="index"
    :data="data"
    :code="code"
  />
  <!--字段-->
  <el-form-item
    v-else
    class="widget-view"
    :class="{active: selectWidget&&selectWidget.id == element.id}"
    :label="element.label+(element.field_options && element.field_options.units?'('+element.field_options.units+')':'') "
    :label-width="element.field_options.is_label_width?element.field_options.label_width+(element.field_options.label_width_unit||'px'):null"
    :required="element.field_options.required"
    @click.native.stop="handleSelectWidget(index)"
  >
    <widget-form-field
      :element="element"
      @click="handleSelectWidget(index)"
    />
    <div v-if="selectWidget&&selectWidget.id == element.id" class="widget-view-action">
      <i class="ibps-icon-clone" @click.stop="handleWidgetClone(index)" />
      <i class="ibps-icon-trash" @click.stop="handleWidgetDelete(index)" />
    </div>

    <div v-if="selectWidget&&selectWidget.id == element.id" class="widget-view-drag">
      <i class="ibps-icon-arrows drag-widget" />
    </div>
  </el-form-item>
</template>

<script>
import WidgetFormOther from './widget-form-other'
import WidgetFormField from './widget-form-field'
import FormOptions from '@/business/platform/form/constants/formOptions'
import { otherFieldTypes } from '@/business/platform/form/constants/fieldTypes'
import Ids from 'ids'

export default {
  components: {
    WidgetFormField,
    WidgetFormOther
  },
  props: {
    element: Object,
    select: Object,
    index: Number,
    data: Object,
    code: String,
    isSub: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      selectWidget: this.select
    }
  },
  computed: {
    fields() {
      if (this.isTable) {
        return this.data.field_options.columns
      } else {
        return this.data.fields
      }
    },
    isTable() {
      return this.data.field_type === 'table'
    },
    isOtherFieldType() {
      return otherFieldTypes.includes(this.element.field_type)
    }
  },
  watch: {
    select(val) {
      this.selectWidget = val
    },
    selectWidget: {
      handler(val) {
        this.$emit('update:select', val)
      },
      deep: true
    }
  },
  methods: {
    handleSelectWidget(index) {
      let code = this.code
      let isSub = this.isSub
      if (this.isTable) {
        code = this.data.name
        isSub = true
      }
      this.fields[index].code = code
      this.fields[index].isSub = isSub
      this.selectWidget = this.fields[index]
    },
    handleWidgetDelete(index) {
      if (this.fields.length - 1 === index) {
        if (index === 0) {
          this.selectWidget = {}
        } else {
          this.selectWidget = this.fields[index - 1]
        }
      } else {
        this.selectWidget = this.fields[index + 1]
      }

      this.$nextTick(() => {
        this.fields.splice(index, 1)
      })
    },
    handleWidgetClone(index) {
      const id = new Ids([32, 36, 1]).next()
      const cloneData = {
        ...this.fields[index],
        field_options: { ...this.fields[index].field_options },
        id: id
      }
      const fieldType = cloneData.field_type
      if (FormOptions.t.NEED_MODEL_FIELD_TYPES.includes(fieldType)) {
        cloneData.name = fieldType + '_' + new Ids([32, 36, 1]).next()
      }

      this.fields.splice(index, 0, JSON.parse(JSON.stringify(cloneData)))

      this.$nextTick(() => {
        this.selectWidget = this.fields[index + 1]
      })
    }
  }
}
</script>

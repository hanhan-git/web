
<template>
  <el-popover
    :width="width"
    :title="showTitle"
    :trigger="trigger"
  >
    <i slot="reference" class="ibps-help-icon" :class="[icon]" />
    <div v-html="showContent" />
  </el-popover>
</template>
<script>

export default {
  props: {
    title: String,
    content: String,
    width: {
      type: [Number, String],
      default: 250
    },
    icon: {
      type: String,
      default: 'ibps-icon-help'
    },
    trigger: {
      type: String,
      default: 'hover'
    }

  },
  computed: {
    showTitle() {
      return this.title || ''
    },
    showContent() {
      return this.content
    }
  }
}
</script>

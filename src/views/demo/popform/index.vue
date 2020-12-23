<template>
  <data-template-formrender-form
    ref="formrender"
    :data-template-id="dataTemplateId"
    @callback="handleCallback"
  />
</template>
<script>
import DataTemplateFormrenderForm from '@/business/platform/data/templaterender/form/form'

export default {
  components: {
    DataTemplateFormrenderForm
  },
  data() {
    return {
      dataTemplateId: '745872149893349376'
    }
  },
  methods: {
    handleCallback(data) {
      console.log(data)
    } }
}
</script>


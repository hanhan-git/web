<template>
  <div>
    <el-form-item label="类型">
      <el-select v-model="fieldOptions.type" placeholder="类型">
        <el-option value="success" label="成功" />
        <el-option value="info" label="消息" />
        <el-option value="warning" label="警告" />
        <el-option value="error" label="错误" />
      </el-select>
    </el-form-item>
    <el-form-item>
      <template slot="label">主题</template>
      <el-radio-group v-model="fieldOptions.effect">
        <el-radio-button label="light">light</el-radio-button>
        <el-radio-button label="dark">dark</el-radio-button>
      </el-radio-group>
    </el-form-item>
  </div>
</template>
<script>
import EditorMixin from '../mixins/editor'

export default {
  mixins: [EditorMixin],
  data() {
    return {
    }
  }
}
</script>

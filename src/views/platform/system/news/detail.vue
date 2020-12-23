<template>
  <el-dialog
    :title="title"
    :visible.sync="dialogVisible"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    append-to-body
    width="65%"
    top="5vh"
    class="news-detail-dialog"
    @open="getFormData"
    @close="closeDialog"
  >
    <div>
      <p class="title">
        <span ref="title" /><label>{{ form.title }}</label>
      </p>
      <el-row>
        <el-col :span="24">
          <el-col :span="18">
            <el-col :span="24">
              <el-col :span="8">
                <p>发布人：{{ form.userName }}</p>
              </el-col>
              <el-col :span="8">
                <p>作者：{{ form.author }}</p>
              </el-col>
              <el-col :span="8">
                <p>公告类型：{{ form.publicItem|optionsFilter(publicItemOptions,'label') }}</p>
              </el-col>
            </el-col>
            <el-col :span="24">
              <el-col :span="8">
                <p>是否公共：{{ form.isPublic|optionsFilter(isPublicOptions,'label') }}</p>
              </el-col>
              <el-col :span="16">
                <p>查看范围组织：{{ form.depName }} </p>
              </el-col>
            </el-col>
            <el-col :span="24">
              <el-col :span="8">
                <p>有效时间：{{ form.publicDate|dateFormat('yyyy-MM-dd') }} 至 {{ form.loseDate|dateFormat('yyyy-MM-dd') }}</p>
              </el-col>
              <el-col :span="16">
                <p>关键字：<label style="color:red">{{ form.key }}</label></p>
              </el-col>
            </el-col>
            <el-col :span="24">
              <p>附件：</p>
              <ibps-attachment-selector
                ref="fileAttach"
                :value="form.fileAttach"
                multiple
                readonly
                allow-download
                :download="readonly"
                style="margin:5px;"
                @callback="data => formId = data.id"
              />
            </el-col>
          </el-col>
          <el-col :span="6">
            <el-image :src="image" class="avatar" style="width: 180px; height: 180px; display: block;">
              <div slot="error">
                <i class="el-icon-picture-outline" style="font-size:180px;color: #909399;" />
              </div>
            </el-image>
            <!-- <img :src="image" class="avatar"> -->
          </el-col>
        </el-col>
        <el-col :span="24">
          <el-row :gutter="10">
            <el-col :span="24">内容：</el-col>
            <el-col :span="24">
              <div class="ibps-p-10" v-html="form.content" />
            </el-col>
          </el-row>
          <p />

          <!-- <ibps-ueditor v-model="form.content" :readonly="readonly" destroy /> -->
        </el-col>
      </el-row>

    </div>
    <div slot="footer" class="el-dialog--center">
      <ibps-toolbar
        :actions="toolbars"
        @action-event="handleActionEvent"
      />
    </div>
  </el-dialog>
</template>

<script>
import IbpsAttachmentSelector from '@/business/platform/file/attachment/selector'
import { get } from '@/api/platform/system/news'
import { typeOptions, publicItemOptions, isPublicOptions } from './constants'
import { getFile } from '@/utils/avatar'
export default {
  components: {
    IbpsAttachmentSelector
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
      formName: 'form',
      dialogVisible: this.visible,
      dialogLoading: false,
      dialogFormVisible: false, // 弹窗
      typeOptions: typeOptions,
      publicItemOptions: publicItemOptions,
      isPublicOptions: isPublicOptions,
      form: {},
      toolbars: [
        { key: 'cancel' }
      ]
    }
  },
  computed: {
    formId() {
      return this.id
    },
    image() {
      return getFile(this.form.picture)
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
  methods: {
    handleActionEvent({ key }) {
      switch (key) {
        case 'cancel':
          this.closeDialog()
          break
        default:
          break
      }
    },
    // 关闭当前窗口
    closeDialog() {
      this.$emit('close', false)
    },
    titleStyle(color) {
      this.$refs.title.style.color = color
    },
    /**
     * 获取表单数据
     */
    getFormData() {
      this.dialogLoading = true
      get({
        newsId: this.formId
      }).then(response => {
        const data = response.data
        this.form = data
        if (response.data.publicItem === 'important') {
          this.titleStyle('red')
        } else {
          this.titleStyle('black')
        }

        this.dialogLoading = false
      }).catch(() => {
        this.dialogLoading = false
      })
    }
  }

}
</script>
<style lang="scss">
.news-detail-dialog{
  p{
    margin:10px 0;
  }
  .title{
    font-size: 18px;
    margin: 0;
  }
  .el-dialog__body{
    height:  calc(70vh - 110px) !important;
  }
}
</style>

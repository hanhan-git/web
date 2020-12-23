<template>
  <div class="ibps-mr-5">
    <el-tooltip
      v-if="messageCount === 0"
      :content="tooltipContent"
      effect="dark"
      placement="bottom"
    >
      <el-button
        class="ibps-ml-0 ibps-mr btn-text can-hover"
        type="text"
      >
        <el-badge
          :max="99"
          :value="messageCount"
        >
          <ibps-icon
            name="bell-o"
            size="16"
          />
        </el-badge>
      </el-button>
    </el-tooltip>
    <el-popover
      v-else
      placement="bottom-end"
      width="350"
      trigger="click"
      popper-class="header-message-popper"
    >

      <el-button
        slot="reference"
        class="ibps-ml-0 ibps-mr btn-text can-hover"
        type="text"
      >
        <el-badge
          :max="99"
          :value="messageCount"
        >
          <ibps-icon
            name="bell-o"
            size="16"
          />
        </el-badge>
      </el-button>

      <el-card body-style="padding:0;">
        <div slot="header" style="font-size: 20px; font-weight: 600;">
          {{ $t('layout.header-aside.header-message.message-count',{messageCount:messageCount}) }}
        </div>
        <div style="height:250px;">
          <el-scrollbar
            style="height: 100%;width:100%;"
            wrap-class="ibps-scrollbar-wrapper "
          >
            <ibps-list-group>
              <ibps-list
                v-for="(message,index) in messageList"
                :key="index"
                :title="message.subject"
                :label="message.ownerName"
                :extra="message.createTime|formatRelativeTime({'year':'yyyy-MM-dd'})"
                @click="handelInteriorClick(message)"
              >
                <el-avatar
                  slot="icon"
                  :icon="message.messageType==='bulletin'?'ibps-icon-bullhorn':'ibps-icon-user'"
                  shape="circle"
                  style="background-color: #87d068"
                />
              </ibps-list>
            </ibps-list-group>
          </el-scrollbar>
        </div>
        <div class="message-more">
          <el-link type="primary" @click="clickMore">{{ $t('layout.header-aside.header-message.viewmore') }}</el-link>
        </div>
      </el-card>
    </el-popover>

    <!-- 消息明细 -->
    <inner-detail-dialog
      :id="editId"
      :visible="dialogFormVisible"
      :title="$t('layout.header-aside.header-message.details')"
      inside
      readonly
      @callback="loadData"
      @close="visible => dialogFormVisible = visible"
    />
  </div>
</template>

<script>
import { getMsgList } from '@/api/platform/message/innerMessage'
import InnerDetailDialog from '@/views/platform/message/inner/detail/dialog'
export default {
  components: {
    InnerDetailDialog
  },
  data() {
    return {
      editId: '',
      dialogFormVisible: false,

      messageList: [],
      messageCount: 0
    }
  },
  computed: {
    tooltipContent() {
      return this.messageCount === 0 ? this.$t('layout.header-aside.header-message.empty') : ''
    }
  },
  created() {
    this.loadData()
  },
  mounted() {
    setTimeout(() => {
      this.loadData()
    }, 1000)
  },
  methods: {
    // 加载数据
    loadData() {
      getMsgList().then(response => {
        const data = response.data
        this.messageList = data.dataResult
        this.messageCount = data.pageResult ? data.pageResult.totalCount : 0
      }).catch(() => {
      })
    },
    handelInteriorClick(message) {
      this.editId = message.id
      this.dialogFormVisible = true
    },
    clickMore() {
      // 更多消息
      this.$router.push('/officeDesk/innerMessage/receiveMessage')
    }
  }

}
</script>
<style lang="scss" >
  .header-message-popper{
    padding: 0 !important;
    .message-more{
      padding: 15px 0;
      text-align: center;
      border-top: 1px solid #EBEEF5;
    }
  }
</style>

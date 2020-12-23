import { doEndProcess, doAddSignTask, lock, unlock, suspendProcess, recoverProcess } from '@/api/platform/bpmn/bpmTask'
import { agree, oppose, abandon, reject, rejectToStarter, rejectToPrevious, bpmTaskSave } from '@/api/platform/bpmn/bpmTask'
import { startFlow, saveDraft } from '@/api/platform/bpmn/bpmInst'
import Print from '@/utils/print'

export default {
  methods: {
    // 内嵌url表单,外部url表单 【自定义】
    emitButtonEventHandler(actionName, args) {
      // 前置事件
      this.beforeScript(actionName, (result) => {
        if (result) {
          return this.emitEventHandler(actionName, args)
        }
      })
    },
    emitEventHandler(actionName, args) {
      this.actionName = actionName
      const buttonType = args && args.attributes ? args.attributes.button_type || actionName : actionName
      this.actionTitle = args && args.attributes ? args.attributes.label : null
      this.submitFormOpinion = this.getFormOpinionData()
      switch (buttonType) {
        case 'close': // 关闭窗口
          this.closeDialog()
          break
        case 'flowImage':// 流程图
          this.flowDiagramVisible = true
          break
        case 'approvalHistory': // 审批历史
          this.approvalHistoryVisible = true
          break
        case 'instanceDetail': // 流程实例明细
          this.instanceDetailVisible = true
          break
        case 'startFlow': // 启动流程
          this.handleStartFlow()
          break
        case 'saveDraft': // 保存草稿
          this.handleSaveDraft()
          break
        case 'agree': // 同意
        case 'oppose':// 反对
        case 'abandon':// 弃权
          if (this.isHide()) {
            this.handleDirectActionEvent(actionName)
          } else {
            this.agreeDialogVisible = true
          }
          break
        case 'rejectToPrevious':// 驳回上一步
        case 'rejectToStart':// 驳回发起人
        case 'reject':// 驳回
          if (this.isBpmOpinionHide && actionName === 'rejectToPrevious') {
            this.handleDirectActionEvent(actionName)
          } else {
            this.rejectDialogVisible = true
          }
          break
        case 'delegate':// 转办
          this.delegateReadonly = false
          this.delegateDialogVisible = true
          break
        case 'delegateDetail':// 转办/代理明细
          this.delegateReadonly = true
          this.delegateDialogVisible = true
          break
        case 'addSign':// 加签
          this.addSignTaskDialogVisible = true
          break
        case 'endProcess':// 终止流程
          this.handleEndProcess()
          break
        case 'print':// 打印
          this.handlePrint()
          break
        case 'lock':// 锁定
          this.handleLock()
          break
        case 'unlock':// 解锁
          this.handleUnlock()
          break
        case 'forceUnlock':// 强制解锁
          this.handleForceUnlock()
          break
        case 'suspendProcess':// 挂起流程
          this.handleSuspendProcess()
          break
        case 'recoverProcess':// 撤回流程
          this.handleRecoverProcess()
          break
        case 'save':// 节点按钮设置-保存
          this.handleSave()
          break
        default:
          break
      }
    },
    /**
     * 是否隐藏
     */
    isHide() {
      return (this.isBpmOpinionHide && this.attributes.isHidePath) ||
      (this.attributes.isCommonJumpType && this.attributes.isHideOpinion && this.attributes.isHidePath) ||
      (this.attributes.isEnd && this.attributes.isHideOpinion)
    },
    /**
     * 是否保存[节点-按钮设置-保存]
     */
    handleSave() {
      const formData = this.getFormData()
      const loading = this.$loading({
        lock: true,
        text: this.$t('common.saving')
      })
      if (!formData) return
      bpmTaskSave({
        taskId: this.taskId,
        data: JSON.stringify(formData)
      }).then(res => {
        loading.close()
        this.closeDialog()
      })
    },
    /**
     * 处理启动流程
     */
    handleStartFlow() {
      const firstNodeUserAssign = this.attributes.firstNodeUserAssign || false
      if (firstNodeUserAssign) {
        const formData = this.getFormData()
        if (!formData) return
        this.submitFormData = formData
        this.startFlowDialogVisible = true
      } else {
        this.saveStartFlow()
      }
    },
    /**
     * 保存启动流程
     * @param {*}
     */
    saveStartFlow(params = {}) {
      const formData = this.getFormData()
      if (!formData) return
      const jsonData = {
        defId: this.defId,
        version: this.version || '0',
        data: JSON.stringify(formData)
      }
      if (this.$utils.isNotEmpty(params.nodeUsers)) {
        jsonData.nodeUsers = JSON.stringify(params.nodeUsers) || ''
      }
      if (this.$utils.isNotEmpty(params.destination)) {
        jsonData.destination = params.destination || ''
      }
      if (this.$utils.isNotEmpty(this.proInstId)) {
        jsonData.proInstId = this.proInstId || ''
      }

      const loading = this.$loading({
        lock: true,
        text: this.$t('common.saving')
      })
      // 1、直接启动
      startFlow(jsonData).then(response => {
        loading.close()
        this.$alert(`启动成功！`, {
          showClose: false
        }).then(() => {
          this.startFlowDialogVisible = false
          // 后置事件
          this.afterScript(this.actionName, {
            data: response.data,
            variables: response.variables
          }, () => {
            // 回调上个页面
            this.callbackPage()
          })
        }).catch(() => {})
      }).catch(() => {
        loading.close()
      })
    },
    /**
     * 保存草稿
     */
    handleSaveDraft() {
      // 表单数据
      const formData = this.getFormData()
      if (!formData) return
      const jsonData = {
        defId: this.defId,
        version: this.version || '',
        proInstId: this.proInstId || '',
        data: JSON.stringify(formData)
      }
      const loading = this.$loading({
        lock: true,
        text: this.$t('common.saving')
      })
      saveDraft(jsonData).then(response => {
        loading.close()
        this.$alert(`保存成功！`, {
          showClose: false
        }).then(() => {
        // 后置事件
          this.afterScript(this.actionName, {
            data: response.data,
            variables: response.variables
          }, () => {
            // 回调上个页面
            this.callbackPage()
          })
        }).catch(() => {
        })
      }).catch(() => {
        loading.close()
      })
    },
    /**
     * 直接同意流程
     * @param {*} actionName
     */
    handleDirectActionEvent(actionName) {
      const opinion = this.hasFormOpinion() ? this.getFormOpinionData() : ''
      this.handleActionEvent(actionName, {
        opinion: opinion
      })
    },
    /**
     * 处理按钮事件
     * @param {*} actionName
     * @param {*} params
     */
    handleActionEvent(actionName, params) {
      if (actionName === 'agree' ||
       actionName === 'oppose' ||
       actionName === 'abandon' ||
       actionName === 'rejectToPrevious' ||
       actionName === 'rejectToStart' ||
       actionName === 'reject'
      ) {
        this.handleComplete(actionName, params)
      } else if (actionName === 'endProcess') {
        this.handleDoEndProcess(params)
      } else if (actionName === 'addSign') {
        this.handleAddSignTask(params)
      }
    },
    handleComplete(actionName, params = {}) {
      const formData = this.getFormData()
      if (!formData) return
      const loading = this.$loading({
        lock: true,
        text: this.$t('common.saving')
      })
      // params.actionName = actionName
      params.taskId = this.taskId
      params.data = JSON.stringify(formData)

      if (actionName === 'agree') {
        agree(params).then(response => {
          this.handleResponse(actionName, loading, response)
        }).catch(() => {
          loading.close()
        })
      } else if (actionName === 'oppose') {
        oppose(params).then(response => {
          this.handleResponse(actionName, loading, response)
        }).catch(() => {
          loading.close()
        })
      } else if (actionName === 'abandon') {
        abandon(params).then(response => {
          this.handleResponse(actionName, loading, response)
        }).catch(() => {
          loading.close()
        })
      } else if (actionName === 'rejectToPrevious') {
        rejectToPrevious(params).then(response => {
          this.handleResponse(actionName, loading, response)
        }).catch(() => {
          loading.close()
        })
      } else if (actionName === 'rejectToStart') {
        rejectToStarter(params).then(response => {
          this.handleResponse(actionName, loading, response)
        }).catch(() => {
          loading.close()
        })
      } else if (actionName === 'reject') {
        reject(params).then(response => {
          this.handleResponse(actionName, loading, response)
        }).catch(() => {
          loading.close()
        })
      }
    },
    handleResponse(actionName, loading, response) {
      loading.close()
      this.$alert(response.message, {
        showClose: false
      }).then(() => {
        // 关闭窗口
        if (actionName === 'agree' || actionName === 'oppose' || actionName === 'abandon') {
          this.agreeDialogVisible = false
        } else if (actionName === 'rejectToPrevious' || actionName === 'rejectToStart' || actionName === 'reject') {
          this.rejectDialogVisible = false
        }
        // 后置事件
        this.afterScript(this.actionName, {
          data: response.data,
          variables: response.variables
        }, () => {
          // 回调上个页面
          this.callbackPage()
        })
      }).catch(() => {})
    },
    handleEndProcess() {
      if (this.isBpmOpinionHide) {
        this.$confirm('确定终止流程!', '提示', {
          type: 'warning'
        }).then(() => {
          const opinion = this.hasFormOpinion() ? this.getFormOpinionData() : ''
          this.handleDoEndProcess({
            opinion: opinion
          })
        }).catch(() => {})
      } else {
        this.approveDialogVisible = true
      }
    },
    /**
     * 处理终止任务
     * @param {*} params
     */
    handleDoEndProcess(params) {
      const loading = this.$loading({
        lock: true,
        text: this.$t('common.saving')
      })
      doEndProcess({
        taskId: this.taskId,
        endReason: params.opinion
      }).then(response => {
        loading.close()
        this.$alert(response.message, {
          showClose: false
        }).then(() => {
          this.approveDialogVisible = false
          // 后置事件
          this.afterScript(this.actionName, {
            data: response.data,
            variables: response.variables
          }, () => {
            // 回调上个页面
            this.callbackPage()
          })
        })
      }).catch((err) => {
        loading.close()
        console.error(err)
      })
    },
    /**
     * 补签
     * @param {*} params
     */
    handleAddSignTask(params) {
      const loading = this.$loading({
        lock: true,
        text: this.$t('common.saving')
      })
      doAddSignTask({
        taskId: this.taskId,
        addSignTaskUserId: params.addSignTaskUserId,
        messageType: params.messageType,
        addReason: params.opinion
      }).then(response => {
        loading.close()
        this.$alert(response.message, {
          showClose: false
        }).then(() => {
          this.addSignTaskDialogVisible = false
          // 后置事件
          this.afterScript(this.actionName, {
            data: response.data,
            variables: response.variables
          }, () => {
            // 回调上个页面
            this.callbackPage()
          })
        })
      }).catch((err) => {
        loading.close()
        console.error(err)
      })
    },
    /**
     * 打印
     */
    handlePrint() {
      if (this.$utils.isNotEmpty(this.printTemplateId)) {
        this.submitFormData = this.getFormData()
        // 打开打印模版页面
        this.formPrintTemplateDialogVisible = true
      } else {
        const loading = this.$loading({
          lock: true,
          text: this.$t('common.loading')
        })
        setTimeout(() => {
          Print(this.$refs.formrender.$el, {
            title: '',
            callback: () => {
              loading.close()
            }
          })
        }, 300)
      }
    },
    /**
     * 锁定任务
     */
    handleLock() {
      this.$confirm('确定锁定任务!', '提示', {
        type: 'warning'
      }).then(() => {
        const loading = this.$loading({
          lock: true,
          text: this.$t('common.saving')
        })
        lock({ taskId: this.taskId }).then(response => {
          loading.close()
          this.$alert(`锁定任务成功！`, {
            showClose: false
          }).then(() => {
            // 后置事件
            this.afterScript(this.actionName, {
              data: response.data,
              variables: response.variables
            }, () => {
              // 回调上个页面
              this.callbackPage()
            })
          }).catch(() => {})
        }).catch(() => {
          loading.close()
        })
      }).catch(() => {})
    },
    /**
     * 解锁任务
     */
    handleUnlock() {
      this.$confirm('确定解锁任务!', '提示', {
        type: 'warning'
      }).then(() => {
        const loading = this.$loading({
          lock: true,
          text: this.$t('common.saving')
        })
        unlock({ taskId: this.taskId }).then(response => {
          loading.close()
          this.$alert(`解锁任务成功！`, {
            showClose: false
          }).then(() => {
            // 后置事件
            this.afterScript(this.actionName, {
              data: response.data,
              variables: response.variables
            }, () => {
              // 回调上个页面
              this.callbackPage()
            })
          }).catch(() => {})
        }).catch(() => {
          loading.close()
        })
      }).catch(() => {})
    },

    /**
     * 强制解锁任务
     */
    handleForceUnlock() {
      this.$confirm('确定强制解锁任务!', '提示', {
        type: 'warning'
      }).then(() => {
        const loading = this.$loading({
          lock: true,
          text: this.$t('common.saving')
        })
        unlock({ taskId: this.taskId }).then(response => {
          loading.close()
          this.$alert(`强制解锁任务成功！`, {
            showClose: false
          }).then(() => {
            // 后置事件
            this.afterScript(this.actionName, {
              data: response.data,
              variables: response.variables
            }, () => {
              // 回调上个页面
              this.callbackPage()
            })
          }).catch(() => {})
        }).catch(() => {
          loading.close()
        })
      }).catch(() => {})
    },
    /**
     * 挂起任务
     */
    handleSuspendProcess() {
      this.$confirm('确定挂起任务', '提示', {
        type: 'warning'
      }).then(() => {
        const loading = this.$loading({
          lock: true,
          text: this.$t('common.saving')
        })
        suspendProcess({ taskId: this.taskId }).then(response => {
          loading.close()
          this.$alert(`挂起任务成功！`, {
            showClose: false
          }).then(() => {
            // 后置事件
            this.afterScript(this.actionName, {
              data: response.data,
              variables: response.variables
            }, () => {
              // 回调上个页面
              this.callbackPage()
            })
          }).catch(() => {})
        }).catch(() => {
          loading.close()
        })
      }).catch(() => {})
    },
    /**
     * 恢复任务
     */
    handleRecoverProcess() {
      this.$confirm('确定恢复任务', '提示', {
        type: 'warning'
      }).then(() => {
        const loading = this.$loading({
          lock: true,
          text: this.$t('common.saving')
        })
        recoverProcess({
          taskId: this.taskId
        }).then(response => {
          loading.close()
          this.$alert(`恢复任务成功！`, {
            showClose: false
          }).then(() => {
            // 后置事件
            this.afterScript(this.actionName, {
              data: response.data,
              variables: response.variables
            }, () => {
              // 回调上个页面
              this.callbackPage()
            })
          })
        }).catch(() => {
          loading.close()
        })
      }).catch(() => {

      })
    },
    finishTask(actionName, params, callback) {

    }
  }
}

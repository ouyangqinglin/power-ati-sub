<template>
  <div class="pages-task-fault-view">
    <el-card class="pages-task-fault-view-card">
      <div class="pages-task-fault-view-card-title">{{ $t('task.info') }}</div>
      <el-form class="pages-task-fault-view-card-form" :model="base" ref="ruleForm">
        <common-flex justify="space-between">
          <el-form-item style="flex: 1" prop="title" :label="$t('task.faultTitle')">
            <el-input v-model="base.title" disabled type="text" />
          </el-form-item>
          <el-form-item prop="taskCode" :label="$t('task.code')" style="margin-left: 90px">
            <el-input v-model="base.taskCode" disabled type="text" />
          </el-form-item>
        </common-flex>
        <el-form-item style="flex-grow: 1" prop="title" :label="$t('task.faultDescription')">
          <el-input v-model="base.remark" disabled type="textarea" />
        </el-form-item>
        <common-flex justify="space-between">
          <el-form-item prop="siteName" :label="$t('task.site')">
            <el-input v-model="base.siteName" disabled type="text" />
          </el-form-item>
          <el-form-item prop="agentName" :label="$t('common.agency')">
            <el-input v-model="base.agentName" disabled type="text" />
          </el-form-item>
          <el-form-item prop="siteCode" :label="$t('common.customer')">
            <el-input v-model="base.customer" disabled type="text" />
          </el-form-item>
        </common-flex>
        <common-flex justify="space-between">
          <el-form-item prop="phone" :label="$t('common.phone')" style="margin-right: 90px">
            <el-input v-model="base.phone" disabled type="text" />
          </el-form-item>
          <el-form-item style="flex: 1" prop="address" :label="$t('common.address')">
            <el-input type="textarea" v-model="base.address" disabled />
          </el-form-item>
        </common-flex>
        <common-flex :style="{ justifyContent: [4, 5].includes(+base.status) ? 'space-between' : '' }">
          <el-form-item prop="status" :label="$t('common.status')" class="posr">
            <el-input disabled type="text" />
            <dict-tag class="posa" style="bottom: 0; left: 20px; color: #C0C4CC" :options="taskFaultStatus" :value="base.status"/>
          </el-form-item>
          <el-form-item prop="createTime" :label="$t('common.creationTime')" :style="{marginLeft: [4, 5].includes(+base.status) ? '' : '90px'}">
            <el-input v-model="base.createTime" disabled type="text" />
          </el-form-item>
          <el-form-item v-if="[4, 5].includes(+base.status)" prop="endTime" :label="$t('task.repairedTime')">
            <el-input v-model="base.endTime" disabled type="text" />
          </el-form-item>
          <el-form-item v-if="(+base.status) === 3" prop="endTime" :label="$t('task.finishedTime')" style="margin-left: 90px">
            <el-input v-model="base.endTime" disabled type="text" />
          </el-form-item>
        </common-flex>
        <common-flex v-if="[4, 5].includes(+base.status)">
          <el-form-item prop="relationCode" :label="$t('task.associatedRepairCode')">
            <el-input v-model="base.relationCode" disabled type="text" />
          </el-form-item>
        </common-flex>
        <el-form-item v-if="(+base.status) === 3" prop="finishDesc" :label="$t('task.finishedReason')">
          <el-input v-model="base.finishDesc" disabled type="textarea" />
        </el-form-item>
      </el-form>

    </el-card>
    <el-card class="pages-task-fault-view-footer">
      <common-flex justify="center">
        <el-button @click="cancel">{{ $t('common.cancel') }}</el-button>
        <template v-if="+base.status === 1">
          <el-button v-hasPermi="['ati:task:fault:remove']" @click="show = true">{{ $t('common.finish') }}</el-button>
          <router-link style="margin-left: 10px" :to="`/task/fault/toRepair/${id}`"><el-button type="primary">{{ $t('task.toRepair') }}</el-button></router-link>
        </template>
      </common-flex>
    </el-card>
    <el-dialog :visible.sync="show" :title="$t('common.close')"
               :before-close="beforeClose"
               :close-on-click-modal ="false"
               width="46%">
      <el-form :model="reason" :rules="rule" ref="reasonForm">
        <el-form-item :label="$t('common.reason')" prop="closeReason">
          <el-input v-model.trim="reason.closeReason" maxlength="200" show-word-limit type="textarea" :placeholder="$t('common.pleaseEnter')"></el-input>
        </el-form-item>
      </el-form>
      <common-flex style="margin-top: 60px" justify="center">
        <el-button type="primary" @click="submit">{{ $t('common.submit') }}</el-button>
        <el-button @click="beforeClose">{{ $t('common.cancel') }}</el-button>
      </common-flex>
    </el-dialog>
  </div>
</template>

<script>
import { getTaskInfo, finishClosed } from '@/api/task'
import {mapState} from "vuex"
import {taskFaultStatus} from '@sub/utils/dict'

export default {
  name: "pages-task-fault-view",
  data() {
    return {
      taskFaultStatus,
      base: {},
      id: '',
      show: false,
      rule: {
        closeReason: [
          { required: true, message: 'Please enter', trigger: 'blur'}
        ],
      },
      reason: {
        closeReason: '',
      }
    }
  },
  computed: {
    ...mapState({
      'timeZone': state => state.user.timeZone,
    })
  },
  created() {
    this.id = this.$route.params?.id
    getTaskInfo(this.id).then(res => {
      let temp = res.data
      if (temp.createTime) temp.createTime = this.UTC_DATE_FORMAT(temp.createTime, this.timeZone)
      if (temp.endTime) temp.endTime = this.UTC_DATE_FORMAT(temp.endTime, this.timeZone)
      this.base = temp
    })
  },
  methods: {
    beforeClose() {
      this.show = false
      this.reason.closeReason = ''
    },
    submit() {
      this.$refs.reasonForm.validate((valid) => {
        if (valid) {
          let data = {
            id: +this.id,
            finishDesc: this.reason.closeReason
          }
          this.$modal.loading()
          finishClosed(data).then(res => {
            if (+res.code === 200) {
              this.$message({
                type: 'success',
                message: this.$t('common.success')
              })
              setTimeout(() => {
                this.cancel()
              }, 500)
            }
          }).finally(() => this.$modal.closeLoading())
        }
      })
    },
    cancel() {
      history.go(-1)
    },
  }
}
</script>

<style lang="scss">
.pages-task-fault-view {
  padding: 24px;
  &-card {
    margin-bottom: 24px;
    padding-bottom: 20px;
    &-title {
      margin-bottom: 12px;
      font-weight: 700;
    }
    &-form {
      padding: 0 50px;
      .el-form-item {
        min-width: calc(100% / 3 - 60px);
      }
      .require-prop {
        color: #FF0000;
      }
    }
  }
}
</style>

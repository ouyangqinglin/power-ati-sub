<template>
  <div class="pages-task-repair-view">
    <el-card class="pages-task-repair-view-card">
      <div class="pages-task-repair-view-card-title">{{ $t('task.process') }}</div>
      <div style="padding: 0 80px">
        <el-steps class="custom-step" :active="active" finish-status="success">
          <el-step :title="$t('task.created')">
            <template slot="description">
              <div>{{ base.createBy }}</div>
            </template>
            <template slot="description">
              <div v-if="base.createTime">{{ UTC_DATE_FORMAT(base.createTime, timeZone) }}</div>
              <div v-else>--</div>
            </template>
          </el-step>
          <el-step :title="$t('task.received')">
            <template v-if="+active > 1">
              <template slot="description">
                <div>{{ base.installer }}</div>
              </template>
              <template slot="description">
                <div v-if="base.startTime">{{ UTC_DATE_FORMAT(base.startTime, timeZone) }}</div>
                <div v-else>--</div>
              </template>
            </template>
          </el-step>
          <el-step :title="$t('task.completed')">
            <template v-if="+active > 2">
              <template slot="description">
                <div>{{ base.installer }}</div>
              </template>
              <template slot="description">
                <div v-if="base.endTime">{{ UTC_DATE_FORMAT(base.endTime, timeZone) }}</div>
                <div v-else>--</div>
              </template>
            </template>
          </el-step>
        </el-steps>
      </div>
    </el-card>
    <el-card class="pages-task-repair-view-card">
      <div class="pages-task-repair-view-card-title">{{ $t('task.info') }}</div>
      <el-form class="pages-task-repair-view-card-form" :model="base" :rules="rule" ref="ruleForm">
        <el-form-item prop="title" :label="$t('task.faultTitle')">
          <el-input disabled v-model="base.title" type="text" />
        </el-form-item>
        <el-form-item prop="remark" :label="$t('task.faultDescription')">
          <el-input disabled v-model="base.remark" type="textarea" />
        </el-form-item>
        <common-flex>
          <el-form-item prop="type" :label="$t('task.type')" style="margin-right: 90px">
            <el-input disabled type="text" />
            <dict-tag class="posa" style="bottom: 0; left: 20px; color: #C0C4CC" :options="taskType" :value="base.type"/>
          </el-form-item>
          <el-form-item prop="taskCode" :label="$t('task.code')" style="margin-right: 90px">
            <el-input v-model="base.taskCode" :placeholder="$t('common.systemGeneration')" disabled type="text" />
          </el-form-item>
          <el-form-item prop="customer" :label="$t('common.customer')" style="margin-right: 90px">
            <el-input v-model="base.customer" disabled type="text" />
          </el-form-item>
        </common-flex>
        <common-flex justify="space-between">
          <el-form-item prop="siteName" :label="$t('site.name')" style="margin-right: 90px">
            <el-input v-model="base.siteName" disabled type="text" />
          </el-form-item>
          <el-form-item prop="agentName" :label="$t('common.agency')" style="margin-right: 90px">
            <el-input v-model="base.agentName" disabled type="text" />
          </el-form-item>
          <el-form-item prop="appointTime" :label="$t('task.appointmentTime')" style="margin-right: 90px">
            <el-date-picker style="width: 100%" type="datetime" format="M/d/yyyy HH:mm"
                            v-model="base.appointTime"
                            value-format="yyyy-MM-dd HH:mm"
                            disabled
                            size="medium" />
          </el-form-item>
        </common-flex>
        <common-flex>
          <el-form-item prop="phone" :label="$t('common.phone')" style="margin-right: 90px">
            <el-input disabled v-model="base.phone" type="text" />
          </el-form-item>
        </common-flex>
        <el-form-item prop="address" :label="$t('common.address')">
          <el-input disabled v-model="base.address" type="text" />
        </el-form-item>
      </el-form>
    </el-card>
    <el-card class="pages-task-repair-view-card">
      <div class="pages-task-repair-view-card-title">{{ $t('task.repairedInfo') }}</div>
      <el-form class="pages-task-repair-view-card-form" :model="base">
        <el-form-item :label="$t('task.repairDescription')">
          <el-input type="textarea" disabled v-model="base.finishDesc"></el-input>
        </el-form-item>
      </el-form>
    </el-card>
    <el-card class="pages-task-repair-view-card">
      <div class="pages-task-repair-view-card-title">{{ $t('task.repairman') }}</div>
      <el-form class="pages-task-repair-view-card-form" :model="repairmanInfo" :rules="manRule" ref="installForm">
        <common-flex>
          <el-form-item :label="$t('task.repairman')" class="my-item" prop="userName">
            <div class="posr">
              <el-input disabled @focus="openMan" style="width: 100%" readonly v-model="repairmanInfo.userName"></el-input>
              <i @click="openMan" class="el-icon-search posa right-search"></i>
            </div>
          </el-form-item>
        </common-flex>
      </el-form>
    </el-card>
    <el-card class="pages-task-repair-view-footer">
      <common-flex justify="center">
        <el-button @click="cancel">{{ $t('common.cancel') }}</el-button>
      </common-flex>
    </el-card>
  </div>
</template>

<script>
import { getTaskInfo } from '@/api/task'
import {mapState} from "vuex";
import { taskType } from '@sub/utils/dict'

export default {
  name: "pages-repair-view",
  data() {
    return {
      taskType,
      active: 1,
      base: {
        type: 1
      },
      id: '',
      repairmanInfo: {
        userName: '',
        id: ''
      },
      manRule: {
        userName: [
          { required: true, message: 'Please select a installer', trigger: 'change'}
        ]
      },
      rule: {
        title: [
          { required: true, message: 'Please enter', trigger: 'blur'}
        ],
        remark: [
          { required: true, message: 'Please enter', trigger: 'blur'}
        ],
        appointTime: [
          { required: true, message: 'Please enter', trigger: 'blur' }
        ],
        customer: [
          { required: true, message: 'Please enter', trigger: 'blur'}
        ],
        phone: [
          { required: true, message: 'Please enter', trigger: 'blur'}
        ],
        repairMan: [
          { required: true, message: 'Please enter', trigger: 'blur'}
        ]
      },
    }
  },
  computed: {
    ...mapState({
      'timeZone': state => state.user.timeZone,
    })
  },
  mounted() {
    this.id = this.$route.params?.id
    getTaskInfo(this.id).then(res => {
      if (res.data.appointTime) res.data.appointTime = this.UTC_DATE_FORMAT(res.data.appointTime, this.timeZone)
      this.base = res.data
      this.repairmanInfo.userName = this.base.installer
      this.repairmanInfo.id = this.base.installUid
      this.active = +this.base.status
    })
  },
  methods: {
    getRepairman(i) {
      this.repairmanInfo = i
    },
    beforeClose() {
      this.show = false
    },
    cancel() {
      history.go(-1)
    },
    openMan() {
      this.show = true
    },
  }
}
</script>

<style lang="scss">
.pages-task-repair-view {
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
    .custom-step {
      .is-process {
        color: #909399;
        font-weight: 400;
      }
      .el-step__main {
        margin-top: 15px;
      }
      .el-step__icon {
        position: absolute;
        top: 6px;
        left: 0;
        @include wh(8);
        border-color: #E1E1E1;
        background-color: #E1E1E1;
      }
      .el-step__icon-inner {
        display: none;
      }
      .is-success {
        color: $commonColor;
        border-color: $commonColor;
        .el-step__icon {
          background-color: $commonColor;
          border-color: $commonColor;
        }
      }
      .el-step__line {
        top: 9px;
      }
    }
  }
  .my-item {
    display: flex;
    flex-direction: column;
    .el-form-item__label {
      text-align: left;
    }
    .right-search {
      right: 10px;
      top: 50%;
      transform: translateY(-50%);
      font-size: 20px;
      color: #898989;
      cursor: not-allowed;
      z-index: 2;
    }
  }
  .el-radio__label {
    display: none;
  }
}
</style>

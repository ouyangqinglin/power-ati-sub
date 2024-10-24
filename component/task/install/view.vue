<template>
  <div class="pages-task-view">
    <el-card class="pages-task-view-card">
      <div class="pages-task-view-card-title">{{ $t('task.process') }}</div>
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
    <el-card class="pages-task-view-card">
      <div class="pages-task-view-card-title">{{ $t('task.info') }}</div>
      <el-form class="pages-task-view-card-form mt10" :model="base" :rules="rules" ref="ruleForm">
        <el-form-item v-for="(i, index) of formList" :key="i.prop" :prop="i.prop">
          <template slot="label"><span>{{ i.label }}</span></template>
          <template v-if="i.prop === 'remark'">
            <el-input disabled style="width: 60vw" type="textarea" v-model="base[i.prop]"></el-input>
          </template>
          <template v-else-if="i.prop === 'appointTime'">
            <el-date-picker style="width: 100%" type="datetime" format="M/d/yyyy HH:mm"
                            v-model="base.appointTime"
                            value-format="yyyy-MM-dd HH:mm"
                            size="medium"
                            disabled
            >

            </el-date-picker>
          </template>
          <template v-else-if="i.prop === 'type'">
            <el-input disabled type="text" />
            <dict-tag class="posa" style="bottom: 0; left: 20px; color: #C0C4CC" :options="taskType" :value="base.type"/>
          </template>
          <template v-else-if="i.prop === 'address'">
            <el-input disabled v-model="base[i.prop]" type="textarea"></el-input>
          </template>
          <template v-else-if="i.prop === 'status'">
            <el-input disabled type="text" />
            <dict-tag class="posa" style="bottom: 0; left: 20px; color: #C0C4CC" :options="taskInstallStatus" :value="base.status"/>
          </template>
          <template v-else>
            <el-input disabled v-model="base[i.prop]"></el-input>
          </template>
        </el-form-item>
      </el-form>

    </el-card>
    <el-card class="pages-task-view-card">
      <div class="pages-task-view-card-title">{{ $t('task.installer') }}</div>
      <el-form class="pages-task-view-card-form" :model="base" :rules="installRule" ref="installForm">
        <el-form-item :label="$t('task.installer')" class="my-item" prop="userName">
          <div class="posr">
            <el-input disabled style="width: 100%" v-model="base.installer"></el-input>
            <i class="el-icon-search posa right-search"></i>
          </div>
        </el-form-item>
      </el-form>
    </el-card>
    <el-card class="pages-task-view-footer">
      <common-flex justify="center">
        <el-button @click="cancel">{{ $t('common.cancel') }}</el-button>
      </common-flex>
    </el-card>
  </div>
</template>

<script>
import { getTaskInfo } from '@/api/task'
import {mapState} from "vuex";
import { taskType, taskInstallStatus } from '@sub/utils/dict'
import { formList } from "./config"

export default {
  name: "pages-task-view",
  data() {
    return {
      taskType,
      taskInstallStatus,
      active: 1,
      installerInfo: {
        userName: '',
        id: ''
      },
      base: {},
      showModel: false,
      id: '',
      installRule: {
        installer: [
          { required: true, message: 'Please select a installer', trigger: 'change'}
        ]
      },
      rules: {
        phone: [
          { required: true, message: 'Please enter phone', trigger: 'blur'}
        ],
        appointTime: [
          { required: true, message: 'Please enter appoint time', trigger: 'blur'}
        ],
        address: [
          { required: true, message: 'Please enter address', trigger: 'blur'}
        ],
      },
      formList,
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
      if (res.data.appointTime) res.data.appointTime = this.UTC_DATE_FORMAT(res.data.appointTime, this.timeZone)
      this.base = res.data
      this.active = +this.base.status
    })
  },
  methods: {
    cancel() {
      history.go(-1)
    },
  }
}
</script>

<style lang="scss">
.pages-task-view {
  padding: 24px;
  &-card {
    margin-bottom: 24px;
    padding-bottom: 20px;
    &-title {
      margin-bottom: 12px;
      font-weight: 700;
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
    &-form {
      padding: 0 50px;
      display: flex;
      //justify-content: space-between;
      flex-wrap: wrap;
      .el-form-item {
        margin-right: 60px;
        min-width: calc(100% / 3 - 80px);
      }
      >:nth-child(3n) {
        margin-right: 0;
      }
      .require-prop {
        color: #FF0000;
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
  }
  .el-radio__label {
    display: none;
  }
}
</style>

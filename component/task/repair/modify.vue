<template>
  <div class="pages-task-repair-modify">
    <el-card class="pages-task-repair-modify-card">
      <div class="pages-task-repair-modify-card-title">{{ $t('task.process') }}</div>
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
    <el-card class="pages-task-repair-modify-card">
      <div class="pages-task-repair-modify-card-title">{{ $t('task.info') }}</div>
      <el-form class="pages-task-repair-modify-card-form" :model="base" :rules="rule" ref="ruleForm">
        <el-form-item prop="title" :label="$t('task.faultTitle')">
          <el-input maxlength="50" v-model="base.title" type="text" :placeholder="$t('common.pleaseEnter')" />
        </el-form-item>
        <el-form-item prop="remark" :label="$t('task.faultDescription')">
          <el-input maxlength="200" v-model="base.remark" show-word-limit type="textarea" :placeholder="$t('common.pleaseEnter')" />
        </el-form-item>
        <common-flex>
          <el-form-item prop="type" :label="$t('task.type')" style="margin-right: 90px">
            <el-input disabled type="text" />
            <dict-tag class="posa" style="bottom: 0; left: 20px; color: #C0C4CC" :options="taskType" :value="base.type"/>
          </el-form-item>
          <el-form-item prop="taskCode" :label="$t('task.code')" style="margin-right: 90px">
            <el-input v-model="base.taskCode" :placeholder="$t('common.systemGeneration')" disabled type="text" />
          </el-form-item>
          <el-form-item prop="uid" :label="$t('common.customer')" style="margin-right: 90px">
            <el-select style="width: 100%" v-model="base.uid" :placeholder="$t('common.pleaseSelect')" :disabled="customerOption.length === 1">
              <el-option v-for="(i, k) of customerOption" :key="k" :label="i.userName" :value="i.id"></el-option>
            </el-select>
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
                            :placeholder="$t('common.pleaseSelect')" />
          </el-form-item>
        </common-flex>
        <common-flex>
          <el-form-item prop="phone" :label="$t('common.phone')" style="margin-right: 90px">
            <el-input @input="checkPhone" v-model="base.phone" type="text" maxlength="20" :placeholder="$t('common.pleaseEnter')" />
          </el-form-item>
        </common-flex>
        <el-form-item prop="address" :label="$t('common.address')">
          <el-input v-model="base.address" maxlength="200" type="textarea" show-word-limit :placeholder="$t('common.pleaseEnter')" />
        </el-form-item>
      </el-form>
    </el-card>
    <el-card class="pages-task-repair-modify-card">
      <div class="pages-task-repair-modify-card-title">{{ $t('task.repairman') }}</div>
      <el-form class="pages-task-repair-modify-card-form" :model="base" :rules="manRule" ref="installForm">
        <common-flex>
          <el-form-item :label="$t('task.repairman')" class="my-item" prop="installer">
            <div class="posr">
              <el-input @focus="openMan" style="width: 100%" readonly v-model="base.installer" :placeholder="$t('common.pleaseSelect')"></el-input>
              <i @click="openMan" class="el-icon-search posa right-search"></i>
            </div>
          </el-form-item>
        </common-flex>
      </el-form>
    </el-card>
    <el-card class="pages-task-repair-modify-footer">
      <common-flex justify="center">
        <el-button @click="submit('ruleForm')" type="primary">{{ $t('common.submit') }}</el-button>
        <el-button @click="cancel">{{ $t('common.cancel') }}</el-button>
      </common-flex>
    </el-card>
    <AddDialog :show.sync="show" :type="2" :haveSelect="base.installUid" @change="getRepairman" :header="`${$t('common.pleaseSelect')}${$t('task.repairman')}`" />
  </div>
</template>

<script>
import { getTaskInfo, modifyTask } from '@/api/task'
import { getReCustomer } from '@/api/user'
import AddDialog from "@subComp/task/install/add-dialog.vue"
import {mapState} from "vuex";
import { taskType } from '@sub/utils/dict'

export default {
  name: "pages-repair-modify",
  dicts: ['fault_status'],
  components: { AddDialog },
  data() {
    return {
      taskType,
      active: 1,
      show: false,
      base: {},
      id: '',
      repairmanInfo: {
        userName: '',
        id: ''
      },
      customerOption: [],
      manRule: {
        userName: [
          { required: true, message: this.$t('common.pleaseSelect'), trigger: 'change'}
        ]
      },
      submit1: false,
      submit2: false,
      rule: {
        title: [
          { required: true, message: this.$t('common.pleaseEnter'), trigger: 'blur'}
        ],
        remark: [
          { required: true, message: this.$t('common.pleaseEnter'), trigger: 'blur'}
        ],
        appointTime: [
          { required: true, message: this.$t('common.pleaseEnter'), trigger: 'blur' }
        ],
        uid: [
          { required: true, message: this.$t('common.pleaseSelect'), trigger: ['blur', 'change']}
        ],
        phone: [
          { required: true, message: this.$t('common.pleaseEnter'), trigger: 'blur'}
        ],
        address: [
          { required: true, message: this.$t('common.pleaseEnter'), trigger: 'blur'}
        ],
        repairMan: [
          { required: true, message: this.$t('common.pleaseEnter'), trigger: 'blur'}
        ]
      },
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
      if (res.data.appointTime) res.data.appointTime = this.DATE_FORMAT('M/d/yyyy hh:mm', +res.data.appointTime * 1000)
      this.base = res.data
      this.repairmanInfo.id = res.data.installUid
      this.getReCustomer(this.base.siteCode)
    })
  },
  methods: {
    checkPhone() {
      this.base.phone = this.PHONE_REG(this.base.phone)
    },
    getReCustomer(code) {
      let data = {
        pageNum: 1,
        pageSize: 50,
        siteCode: code
      }
      getReCustomer(data).then(res => {
        this.customerOption = res.rows
        if (this.customerOption.length === 1) this.base.uid = this.customerOption[0].id
      })
    },
    getRepairman(i) {
      this.repairmanInfo = i
      this.base.installer = i.userName
      this.base.installUid = i.id
    },
    beforeClose() {
      this.show = false
    },
    submit(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) this.submit1 = true
        else this.submit1 = false
      })
      this.$refs.installForm.validate((valid) => {
        if (valid) this.submit2 = true
        else this.submit2 = false
      })
      if (this.submit1 && this.submit2) {
        let data = {
          type: 1,
          address: this.base.address,
          uid: this.base.uid,
          installUid: this.repairmanInfo.id,
          remark: this.base.remark,
          appointTime: new Date(this.base.appointTime).getTime() / 1000,
          phone: this.base.phone,
          title: this.base.title,
          siteCode: this.base.siteCode,
          id: this.id,
          agencyId: this.base.agencyId
        }
        this.$modal.loading()
        modifyTask(data).then(res => {
          if (+res.code === 200) {
            this.$message({
              type: 'success',
              message: this.$t('common.succeeded')
            })
            setTimeout(() => {
              this.$router.push(`/task/repair?refresh=${true}`)
            }, 500)
          }
        }).finally(() => this.$modal.closeLoading())
      }
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
.pages-task-repair-modify {
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
      cursor: pointer;
      z-index: 2;
    }
  }
  .el-radio__label {
    display: none;
  }
}
</style>

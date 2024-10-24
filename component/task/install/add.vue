<template>
  <div class="pages-task-add">
    <el-card class="pages-task-add-card">
      <div class="pages-task-add-card-title mb10">{{ $t('task.info') }}</div>
      <el-form class="pages-task-add-card-form" :model="base" :rules="rules" ref="ruleForm">
        <el-form-item v-for="(i, index) of formList" :key="i.prop" :prop="i.prop">
          <template slot="label"><span>{{ i.label }}</span></template>
          <template v-if="['remark', 'address'].includes(i.prop)">
            <el-input maxlength="200" show-word-limit style="width: 60vw" type="textarea" :placeholder="$t('common.pleaseEnter')" v-model="base[i.prop]"></el-input>
          </template>
          <template v-else-if="i.prop === 'appointTime'">
            <el-date-picker style="width: 100%" type="datetime" format="M/d/yyyy HH:mm"
                            v-model="base.appointTime"
                            value-format="yyyy-MM-dd HH:mm:ss"
                            :placeholder="$t('common.pleaseSelect')"
            />
          </template>
          <template v-else-if="i.prop === 'type'">
            <el-input disabled type="text" />
            <dict-tag class="posa" style="bottom: 0; left: 20px; color: #C0C4CC" :options="taskType" :value="base.type"/>
          </template>
          <template v-else-if="i.prop === 'phone'">
            <el-input @input="checkPhone" v-model="base[i.prop]" type="text" maxlength="20" :placeholder="$t('common.pleaseEnter')"></el-input>
          </template>
          <template v-else-if="i.prop === 'status'">
            <el-input disabled type="text" />
            <dict-tag class="posa" style="bottom: 0; left: 20px; color: #C0C4CC" :options="taskInstallStatus" :value="base.status"/>
          </template>
          <template v-else>
            <el-input :disabled="!(index > 5)" v-model="base[i.prop]"></el-input>
          </template>
        </el-form-item>
      </el-form>

    </el-card>
    <el-card class="pages-task-add-card">
      <div class="pages-task-add-card-title">{{ $t('task.installer') }}</div>
      <el-form class="pages-task-add-card-form" :model="installerInfo" :rules="installRule" ref="installForm">
        <el-form-item :label="$t('task.installer')" class="my-item" prop="userName">
          <div class="posr">
            <el-input @focus="openAdd" style="width: 100%" readonly v-model="installerInfo.userName" :placeholder="$t('common.pleaseSelect')"></el-input>
            <i @click="openAdd" class="el-icon-search posa right-search"></i>
          </div>
        </el-form-item>
      </el-form>
    </el-card>
    <el-card class="pages-task-add-footer">
      <common-flex justify="center">
        <el-button type="primary" @click="submitForm('ruleForm')">{{ $t('common.submit') }}</el-button>
        <el-button @click="cancel">{{ $t('common.cancel') }}</el-button>
      </common-flex>
    </el-card>
    <AddDialog :show.sync="showModel" :type="2" @change="getInstaller" :haveSelect="base.installUid" :header="`${$t('common.pleaseSelect')}${$t('task.installer')}`" />
  </div>
</template>

<script>
import { getAtiUser } from '@/api/user'
import { createTask } from '@/api/task'
import AddDialog from "@subComp/task/install/add-dialog.vue"
import { taskType, taskInstallStatus } from '@sub/utils/dict'
import { formList } from "./config"
import I18n from "@/i18n"

export default {
  name: "pages-task-add",
  components: { AddDialog },
  data() {
    return {
      taskType,
      taskInstallStatus,
      baseInfo: {
        type: 2,
        address: '',
        taskCode: I18n.t('common.systemGeneration'),
        appointTime: '',
        uid: '',
        installUid: '',
        phone: '',
        remark: '',
        status: '--',
      },
      installerInfo: {
        userName: '',
        id: ''
      },
      base: {},
      showModel: false,
      id: '',
      installRule: {
        userName: [
          { required: true, message: I18n.t('common.pleaseSelect'), trigger: 'change'}
        ]
      },
      rules: {
        phone: [
          { required: true, message: I18n.t('common.pleaseEnter'), trigger: 'blur'}
        ],
        appointTime: [
          { type: 'string', required: true, message: I18n.t('common.pleaseSelect'), trigger: 'blur'}
        ],
        address: [
          { required: true, message: I18n.t('common.pleaseEnter'), trigger: 'blur'}
        ],
      },
      formList,
      submit1: false,
      submit2: false,
    }
  },
  created() {
    this.id = this.$route.params?.id
    this.base.uid = this.id
    getAtiUser(this.id).then(res => {
      res.data.remark = ''
      this.base = {...this.baseInfo, ...res.data, customer: res.data.userName, type: 2}
    })
  },
  methods: {
    checkPhone() {
      this.base.phone = this.PHONE_REG(this.base.phone)
    },
    cancel() {
      history.go(-1)
    },
    getInstaller(data) {
      this.installerInfo = data
      this.base.installUid = this.installerInfo.id
    },
    // 打开add弹窗
    openAdd() {
      this.showModel = true
    },
    submitForm(formName) {
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
          type: 2,
          address: this.base.address,
          uid: this.base.id,
          installUid: this.installerInfo.id,
          remark: this.base.remark,
          appointTime: new Date(this.base.appointTime).getTime() / 1000,
          phone: this.base.phone,
          agencyId: this.base.agencyId
        }
        this.$modal.loading()
        createTask(data).then(res => {
          if (+res.code === 200) {
            this.$message({
              type: 'success',
              message: this.$t('common.succeeded')
            })
            setTimeout(() => {
              this.$router.push(`/task/install?refresh=${true}`)
            }, 500)
          }
        }).finally(() => this.$modal.closeLoading())
      }
    },
  }
}
</script>

<style lang="scss">
.pages-task-add {
  padding: 24px;
  &-card {
    margin-bottom: 24px;
    padding-bottom: 20px;
    &-title {
      font-weight: 700;
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
      margin-top: 10px;
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
  }
  .el-radio__label {
    display: none;
  }
}
</style>

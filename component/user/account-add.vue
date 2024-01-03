<template>
  <div v-if="show" class="account-add">
    <el-dialog :visible.sync="show"
               :title="$t('common.newlyBuild')"
               :before-close="beforeClose"
               :close-on-click-modal="false"
               width="65%"
    >
      <el-form class="account-add-form" :model="base" :rules="rules" ref="ruleForm">
        <el-form-item :label="$t('common.agency')" prop="agencyId" v-if="+type !== 5">
          <div class="posr">
            <el-input :disabled="!(+($store.state.user.agencyId) === -1)" readonly @focus="agencyShow = true" :placeholder="$t('common.pleaseSelect')" v-model="base['agentName']"></el-input>
            <i @click="+($store.state.user.agencyId) === -1? agencyShow = true : ''" class="el-icon-search posa right-search"></i>
          </div>
        </el-form-item>
        <el-form-item :label="$t('user.userAccount')" prop="email">
          <el-input :placeholder="`${$t('common.pleaseEnter')}${$t('common.email')}`" v-model="base.email" maxlength="50"></el-input>
        </el-form-item>
        <el-form-item :label="$t('common.userName')" prop="userName">
          <el-input :placeholder="$t('common.pleaseEnter')" maxlength="50" v-model.trim="base.userName"></el-input>
        </el-form-item>
        <el-form-item :label="$t('common.phone')" prop="phone">
          <el-input @input="checkPhone" maxlength="20" v-model="base.phone" :placeholder="$t('common.pleaseEnter')"></el-input>
        </el-form-item>
        <el-form-item :label="$t('user.role')" prop="roleIds">
          <el-select style="width: 100%" value-key="value" v-model="base.roleIds" multiple :placeholder="$t('common.pleaseSelect')" @change="changeSelect">
            <el-option v-for="item of roleList"
                       :key="item.value"
                       :disabled="item.disabled"
                       :label="item.label"
                       :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('common.status')" prop="status">
          <el-select style="width: 100%" v-model="base.status" :placeholder="$t('common.pleaseSelect')">
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('user.initialPassword')" prop="password">
          <el-input class="smallPlace" @input="verifyPsw" :placeholder="$t('user.initialPasswordRule')" v-model.trim="base.password"></el-input>
        </el-form-item>
        <el-form-item :label="$t('common.remarks')" prop="remark">
          <el-input style="width: 40vw" type="textarea" show-word-limit maxlength="200" v-model="base.remark" :placeholder="$t('common.pleaseEnter')"></el-input>
        </el-form-item>
      </el-form>
      <div class="table-content" v-if="+type === 1">
        <common-flex justify="space-between" align="center" style="margin-bottom: 10px">
          <div>{{ $t('site.siteList') }}</div>
          <div><el-button size="small" type="primary" @click="siteShow = true">{{  $t('common.add')  }}</el-button></div>
        </common-flex>
        <el-table :data="siteList"
                  max-height="530" border
                  :header-cell-style="{'text-align': 'center', 'border-bottom': 'none' }" :cell-style="{'text-align': 'center', 'border-left': 'none', 'border-right': 'none', 'border-top': 'none'}"
        >
          <el-table-column type="index" :label="$t('common.no')" prop="id" width="55"></el-table-column>
          <el-table-column :label="$t('site.name')" prop="siteName" show-tooltip-when-overflow></el-table-column>
          <el-table-column :label="$t('site.code')" prop="siteCode"></el-table-column>
          <el-table-column :label="$t('common.operation')">
            <template slot-scope="scope">
              <el-button type="text" @click="deleteItem(scope)">{{ $t('common.delete') }}</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <common-flex justify="center" style="margin-top: 29px" class="posr">
        <el-button size="small" type="primary" @click="submit">{{ $t('common.submit') }}</el-button>
        <el-button size="small" @click="$emit('update:show', false)">{{ $t('common.cancel') }}</el-button>
        <div class="tips posa">{{  $t('user.passwordTips') }}</div>
      </common-flex>
    </el-dialog>
    <siteList v-if="siteShow" :show.sync="siteShow" @change="getSelectSite" :haveSiteList="siteList" />
    <agentList :show.sync="agencyShow" :agencyId="base.agencyId" @change="getSelectAgent"/>
  </div>
</template>

<script>
import siteList from '@subComp/site/siteList.vue'
import agentList from '@subComp/user/agencyList.vue'
import {listRole} from "@/api/system/role"
import { addAtiUser } from '@/api/user'
import { agencyStatus } from '@sub/utils/dict'

export default {
  name: "account-add",
  components: { siteList, agentList },
  props: {
    show: Boolean,
    type: Number,
    active: String
  },
  data() {
    const validatePass = (rule, value, callback) => {
      if (value === '') {
        callback(new Error(this.$t('user.initialPasswordRule')));
      } else {
        const reg = /^(?![0-9]+$)(?![a-zA-Z]+$)(?![^a-zA-Z0-9]+$)[^\u4e00-\u9fa5 ]{8,16}$/
        if (reg.test(value)) {
          callback()
        } else callback(new Error(this.$t('user.initialPasswordRule')))
      }
    }
    return {
      siteShow: false,
      agencyShow: false,
      siteList: [],
      siteCodeList: [],
      roleList: [],
      base: {
        status: 1,
        email: '',
        userName: '',
        phone: '',
        agencyId: '',
        password: '',
        remark: '',
        agentName: '',
        roleIds: []
      },
      options: agencyStatus,
      rules: {
        email: [
          { required: true, message: this.$t('common.pleaseEnter'), trigger: 'blur' },
          { type: 'email', message: this.$t('login.formatIncorrect'), trigger: ['blur', 'change'] }
        ],
        userName: [
          { required: true, message: this.$t('common.pleaseEnter'), trigger: 'blur'}
        ],
        status: [
          { required: true, message: this.$t('common.pleaseSelect'), trigger: ['blur', 'change']}
        ],
        roleIds: [
          { required: true, message: this.$t('common.pleaseSelect'), trigger: ['blur', 'change']}
        ],
        agencyId: [
          { required: true, message: this.$t('common.pleaseSelect'), trigger: 'change'}
        ],
        password: [
          { required: true, validator: validatePass, trigger: 'blur'}
        ],
      },
    }
  },
  mounted() {
    this.getRoleList()
    if (+this.$store.state.user.agencyId !== -1) {
      this.base.agencyId = this.$store.state.user.agencyId
      this.base.agentName = this.$store.state.user.agency || '--'
    }
    if (+this.active === 3) this.base.roleIds = [2, 104, 105]
  },
  methods: {
    changeSelect() {
      if (+this.active === 3) {
        [2, 104, 105].forEach(i => {
          if (!this.base.roleIds.includes(i)) this.base.roleIds.push(i)
        })
      }
    },
    verifyPsw(v) {
      this.base.password = v.replace(/\s+/g,"")
    },
    checkPhone() {
      this.base.phone = this.PHONE_REG(this.base.phone)
    },
    getRoleList() {
      let data = {
        pageNum: 1,
        pageSize: 100,
        status: 0,
        source: 2
      }
      listRole(data).then(res => {
        if (res.rows.length) {
          res.rows.forEach(i => {
            if ([2, 104, 105].includes(+i.roleId) && +this.active === 3) i.disabled = true
            i.label = i.roleName
            i.value = i.roleId
          })
        }
        this.roleList = res.rows
      })
    },
    getSelectSite(v) {
      this.siteList = [...this.siteList, ...v]
      this.siteList = this.removeDuplicateObj(this.siteList)
    },
    getSelectAgent(v) {
      this.base.agencyId = v.id
      this.base.agentName = v.agency
    },
    // 去重
    removeDuplicateObj(arr) {
      let obj = {}
      arr = arr.reduce((newArr, next) => {
        if (obj[next.id]) {}
        else {
          obj[next.id] = true
          newArr.push(next)
        }
        return newArr
      }, [])
      return arr
    },
    beforeClose() {
      this.$emit('update:show', false)
    },
    deleteItem(i) {
      this.siteList.splice(i.$index, 1)
    },
    submit() {
      this.$refs.ruleForm.validate((v) => {
        if (v) {
          this.siteCodeList = []
          this.siteList.forEach(i => {
            this.siteCodeList.push(i.siteCode)
          })
          let data = {
            email: this.base.email,
            password: this.base.password,
            userName: this.base.userName,
            remark: this.base.remark,
            type: +this.type,
            phone: this.base.phone,
            siteCodeList: this.siteCodeList,
            status: this.base.status,
            roleIds: this.base.roleIds,
          }
          if (+this.type !== 5) data.agencyId = +this.base.agencyId
          this.$modal.loading()
          addAtiUser(data).then(res => {
            if (+res.code === 200) {
              // Add successfully!
              this.$message({
                type: 'success',
                message: this.$t('common.success')
              })
              this.beforeClose()
              this.$emit('refresh')
            }
          }).finally(() => this.$modal.closeLoading());
        }
      })
    },
  }
}
</script>

<style lang="scss">
.account-add {
  &-form {
    padding: 0 20px;
    display: flex;
    //justify-content: space-between;
    flex-wrap: wrap;
    .el-form-item {
      margin-right: 60px;
      min-width: calc(100% / 3 - 50px);
    }
    >:nth-child(3n) {
      margin-right: 0;
    }
    .require-prop {
      color: #FF0000;
    }
  }
  .table-content {
    padding: 0 20px;
  }
  .right-search {
    right: 10px;
    bottom: 8px;
    font-size: 20px;
    color: #898989;
    cursor: pointer;
    z-index: 2;
  }
  .smallPlace {
    input {
      min-width: 500px;
      &::placeholder {
        font-size: 12px;
      }
    }
  }
  .tips {
    right: 10px;
    top: 0;
    max-width: 206px;
    font-size: 12px;
    color: $commonColor;
  }
}
</style>

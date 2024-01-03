<template>
  <div class="pages-aboutus app-container">
    <el-card style="height: 100%">
      <common-flex justify="space-between">
        <h3>{{ $t('user.contactInfo') }}</h3>
        <div v-if="edit"><el-button type="primary" @click="edit = false">{{ $t('common.edit') }}</el-button></div>
        <div v-else>
          <el-button type="primary" @click="save">{{ $t('common.save') }}</el-button>
          <el-button @click="cancel">{{ $t('common.cancel') }}</el-button>
        </div>
      </common-flex>
      <div class="pages-aboutus-main">
        <el-row>
          <el-col :span="8">
            <el-form :rules="rule" :model="base" ref="baseForm" :disabled="edit">
              <el-form-item :label="$t('common.address')" prop="address">
                <el-input v-model="base.address" type="textarea" maxlength="200" show-word-limit :placeholder="$t('common.pleaseEnter')"></el-input>
              </el-form-item>
              <el-form-item :label="$t('user.supportPhone')" prop="phone">
                <el-input v-model="base.phone" @input="checkPhone" maxlength="20" :placeholder="$t('common.pleaseEnter')"></el-input>
              </el-form-item>
              <el-form-item :label="$t('user.supportEmail')" prop="email">
                <el-input v-model="base.email" maxlength="50" :placeholder="$t('common.pleaseEnter')"></el-input>
              </el-form-item>
              <el-form-item :label="$t('user.salesEmail')" prop="salesEmail">
                <el-input v-model="base.salesEmail" maxlength="50" :placeholder="$t('common.pleaseEnter')"></el-input>
              </el-form-item>
            </el-form>
          </el-col>
        </el-row>
      </div>
    </el-card>
  </div>
</template>

<script>
import { getContact, editContact } from '@/api/user'
export default {
  name: "pages-aboutus",
  data() {
    return {
      edit: true,
      base: {
        phone: '',
        email: '',
        salesEmail: '',
        address: '',
        id: '',
      },
      rule: {
        address: [
          { required: true, message: this.$t('common.pleaseEnter'), trigger: ['blur', 'change']}
        ],
        email: [
          { required: true, message: this.$t('common.pleaseEnter'), trigger: ['blur', 'change']}
        ],
        salesEmail: [
          { required: true, message: this.$t('common.pleaseEnter'), trigger: ['blur', 'change']}
        ],
        phone: [
          { required: true, message: this.$t('common.pleaseEnter'), trigger: ['blur', 'change']}
        ],
      }
    }
  },
  mounted() {
    this.getBase()
  },
  methods: {
    checkPhone() {
      this.base.phone = this.PHONE_REG(this.base.phone)
    },
    getBase() {
      getContact().then(res => {
        if (res.rows.length) {
          this.base.email = res.rows[0].email
          this.base.phone = res.rows[0].phone
          this.base.id = res.rows[0].id
          this.base.address = res.rows[0].address
          this.base.salesEmail = res.rows[0].salesEmail
        }
      })
    },
    save() {
      this.$refs.baseForm.validate(v => {
        if (v) {
          this.$modal.loading()
          editContact(this.base).then(res => {
            if (+res.code === 200) {
              this.$message({
                type: 'success',
                message: this.$t('common.success')
              })
            }
          }).finally(() => {
            this.cancel()
            this.$modal.closeLoading()
          })
        }
      })
    },
    cancel() {
      this.getBase()
      this.edit = true
    },
  }
}
</script>

<style lang="scss">
.pages-aboutus {
  height: 88vh;
  overflow: hidden;
  &-main {
    margin-top: 80px;
    padding-left: 100px;
    .my-icon {
      margin: 3px 8px 0 0;
      font-size: 30px;
    }
  }
}
</style>

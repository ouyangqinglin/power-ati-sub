<template>
  <div v-if="show" class="agency-add">
    <el-dialog :visible.sync="show"
               :title="type === 'add' ? $t('common.newlyBuild') : $t('common.modify')"
               :before-close="beforeClose"
               :close-on-click-modal ="false"
               width="65%"
    >
      <el-form class="agency-add-form" :model="base" :rules="rules" ref="ruleForm">
        <template v-for="i of formList">
          <el-form-item :prop="i.prop">
            <template slot="label"><span>{{ i.label }}</span></template>
            <template v-if="i.prop === 'remark'">
              <el-input style="width: 40vw" type="textarea" show-word-limit maxlength="200" v-model="base[i.prop]" :placeholder="i.placeholder"></el-input>
            </template>
            <template v-else-if="i.prop === 'agency'">
              <el-input maxlength="50" v-model="base[i.prop]" :placeholder="i.placeholder"></el-input>
            </template>
            <template v-else-if="i.prop === 'phone'">
              <el-input @input="checkPhone" maxlength="20" v-model="base[i.prop]" :placeholder="i.placeholder"></el-input>
            </template>
            <template v-else-if="i.prop === 'status'">
              <el-select style="width: 100%" v-model="base[i.prop]" :placeholder="i.placeholder">
                <el-option
                  v-for="item in options"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                >
                </el-option>
              </el-select>
            </template>
            <template v-else>
              <el-input :disabled="i.disabled" :placeholder="i.placeholder" v-model="base[i.prop]"></el-input>
            </template>
          </el-form-item>
        </template>
      </el-form>
      <div class="table-content">
        <common-flex justify="center" style="margin-top: 29px">
          <el-button size="small" type="primary" @click="submit">{{ $t('common.submit') }}</el-button>
          <el-button size="small" @click="$emit('update:show', false)">{{ $t('common.cancel') }}</el-button>
        </common-flex>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { addAgency, modifyAgency } from '@/api/agency'
import { agencyStatus } from '@sub/utils/dict'

export default {
  name: "agency-add",
  props: {
    show: Boolean,
    type: String,
    item: {}
  },
  data() {
    return {
      base: {
        status: 1,
        agency: '',
        agencyCode: '',
        remark: '',
        phone: ''
      },
      options: agencyStatus,
      rules: {
        agency: [
          { required: true, message: this.$t('common.pleaseEnter'), trigger: 'blur'}
        ]
      },
      formList: [
        {
          label: this.$t('common.agency'),
          prop: 'agency',
          placeholder: this.$t('common.pleaseEnter'),
        },
        {
          label: this.$t('user.agencyCode'),
          prop: 'agencyCode',
          disabled: true
        },
        {
          label: this.$t('common.status'),
          prop: 'status',
          placeholder: this.$t('common.pleaseSelect'),
        },
        {
          label: this.$t('common.phone'),
          prop: 'phone',
          placeholder: this.$t('common.pleaseEnter'),
        },
        {
          label: this.$t('common.remarks'),
          prop: 'remark',
          placeholder: this.$t('common.pleaseEnter'),
        }
      ],
    }
  },
  watch: {
    item: {
      immediate: true,
      handler(v) {
        if (Object.keys(v).length) {
          Object.keys(this.base).forEach(key => {
            this.base[key] = v[key]
          })
        }
      },
    }
  },
  methods: {
    checkPhone() {
      this.base.phone = this.PHONE_REG(this.base.phone)
    },
    beforeClose() {
      this.$emit('update:show', false)
    },
    submit() {
      this.$refs.ruleForm.validate((v) => {
        if (v) {
          let data = {
            agency: this.base.agency,
            remark: this.base.remark,
            status: this.base.status,
            phone: this.base.phone
          }
          if (this.type === 'modify') {
            data.id = this.item.id
            this.modify(data)
          }
          else this.add(data)
        }
      })
    },
    add(data) {
      this.$modal.loading()
      addAgency(data).then(res => {
        if (+res.code === 200) {
          // Add successfully!
          this.$message({
            type: 'success',
            message: this.$t('common.success')
          })
          this.beforeClose()
          this.$emit('refresh')
        }
      }).finally(() => this.$modal.closeLoading())
    },
    modify(data) {
      this.$modal.loading()
      modifyAgency(data).then(res => {
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
    },
  }
}
</script>

<style lang="scss">
.agency-add {
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
}
</style>

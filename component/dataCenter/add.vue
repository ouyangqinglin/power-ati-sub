<template>
  <el-dialog
    :title="$t('common.newlyBuild')"
    :before-close="beforeClose"
    :close-on-click-modal="false"
    width="65%"
    :visible.sync="show">
    <el-form :model="addBase" label-position="top" :rules="rules" ref="formBase">
      <el-row :gutter="24">
        <el-col :span="8">
          <el-form-item :label="$t('dataCenter.name')" prop="name">
            <el-input :placeholder="$t('common.pleaseEnter')" v-model="addBase.name" maxlength="50" show-word-limit></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item :label="$t('common.status')" prop="status">
            <el-select style="width: 100%" class="status-select" v-model="addBase.status" :placeholder="$t('common.pleaseSelect')">
              <el-option v-for="i of statusOptions" :value="i.value" :key="i.value" :label="i.label" />
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="24">
        <el-col :span="8">
          <el-form-item :label="$t('dataCenter.port')" prop="api">
            <el-input :placeholder="$t('common.pleaseEnter')" v-model="addBase.api" maxlength="50" show-word-limit></el-input>
          </el-form-item>
        </el-col>
<!--        <el-col :span="8">-->
<!--          <el-form-item label="Port" prop="apiPort">-->
<!--            <el-input placeholder="Please enter" maxlength="50" disabled v-model.number="addBase.apiPort"></el-input>-->
<!--          </el-form-item>-->
<!--        </el-col>-->
      </el-row>
      <el-row :gutter="24">
        <el-col :span="8">
          <el-form-item :label="`${$t('dataCenter.serverAddressV')}1.0`" prop="loggerV1Url">
            <el-input @change="checkUrl('loggerV1')" :placeholder="$t('common.pleaseEnter')" v-model="addBase.loggerV1Url" maxlength="50"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item :label="$t('dataCenter.port')" prop="loggerV1Port">
            <el-input @change="checkUrl('loggerV1')" maxlength="5" :placeholder="$t('common.pleaseEnter')" v-model.number="addBase.loggerV1Port"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="24">
        <el-col :span="8">
          <el-form-item :label="$t('dataCenter.serverAddressNon')" prop="loggerV2Url">
            <el-input @change="checkUrl('loggerV2')" :placeholder="$t('common.pleaseEnter')" v-model="addBase.loggerV2Url" maxlength="50"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item :label="$t('dataCenter.port')" prop="loggerV2Port">
            <el-input @change="checkUrl('loggerV2')" maxlength="5" :placeholder="$t('common.pleaseEnter')" v-model.number="addBase.loggerV2Port"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="24">
        <el-col :span="8">
          <el-form-item :label="$t('dataCenter.chargerAddress')" prop="pileUrl">
            <el-input :placeholder="$t('common.pleaseEnter')" @change="checkUrl('pile')" maxlength="50" v-model="addBase.pileUrl">
              <el-select v-model="addBase.schema" slot="prepend" :placeholder="$t('common.pleaseSelect')">
                <el-option label="ws://" :value="1"></el-option>
                <el-option label="wss://" :value="2"></el-option>
              </el-select>
            </el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item :label="$t('dataCenter.port')" prop="pilePort">
            <el-input @change="checkUrl('pile')" maxlength="5" :placeholder="$t('common.pleaseEnter')" v-model.number="addBase.pilePort"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item :label="$t('common.remarks')" prop="remarks">
        <el-input type="textarea" v-model="addBase.remarks" maxlength="200" show-word-limit :placeholder="$t('common.pleaseEnter')"></el-input>
      </el-form-item>
    </el-form>
    <common-flex justify="center" style="margin-top: 29px">
      <el-button type="primary" @click="submit">{{ $t('common.submit') }}</el-button>
      <el-button @click="beforeClose">{{ $t('common.cancel') }}</el-button>
    </common-flex>
  </el-dialog>
</template>

<script>
import { add } from '@/api/dataCenter'
import { agencyStatus } from '@sub/utils/dict'

export default {
  props: {
    show: Boolean
  },
  data() {
    return {
      statusOptions: agencyStatus,
      addBase: {
        status: 1,
        name: '',
        loggerV1Url: '',
        loggerV2Url: '',
        loggerV1Port: '',
        loggerV2Port: '',
        api: '',
        apiPort: 80,
        schema: 1,
        pilePort: '',
        pileUrl: '',
        remarks: ''
      },
      rules: {
        name: [
          { required: true, message: this.$t('common.pleaseEnter'), trigger: ['blur', 'change']}
        ],
        api: [
          { required: true, message: this.$t('common.pleaseEnter'), trigger: ['blur', 'change']}
        ],
        loggerV1Url: [
          { required: false, message: this.$t('common.pleaseEnter'), trigger: ['blur', 'change']}
        ],
        loggerV1Port: [
          { required: false, message: this.$t('common.pleaseEnter'), trigger: ['blur', 'change']}
        ],
        loggerV2Url: [
          { required: false, message: this.$t('common.pleaseEnter'), trigger: ['blur', 'change']}
        ],
        loggerV2Port: [
          { required: false, message: this.$t('common.pleaseEnter'), trigger: ['blur', 'change']}
        ],
        pileUrl: [
          { required: false, message: this.$t('common.pleaseEnter'), trigger: ['blur', 'change']}
        ],
        pilePort: [
          { required: false, message: this.$t('common.pleaseEnter'), trigger: ['blur', 'change']}
        ],
      }

    }
  },
  methods: {
    submit() {
      this.$refs.formBase.validate(v => {
        if (v) {
          this.$modal.loading()
          add(this.addBase).then(res => {
            if (+res.code === 200) {
              this.beforeClose()
              this.$emit('refresh')
            }
          }).finally(() => this.$modal.closeLoading())
        }
      })
    },
    checkUrl(type) {
      this.rules[`${type}Port`][0].required = !!this.addBase[`${type}Url`]
      this.rules[`${type}Url`][0].required = !!this.addBase[`${type}Port`]
      this.rules = {...this.rules}
    },
    beforeClose() {
      this.$emit('update:show', false)
      setTimeout(() => {
        this.resetBase()
      }, 600)
    },
    resetBase() {
      Object.keys(this.addBase).forEach(i => {
        this.addBase[i] = ''
      })
      this.addBase.apiPort = 80
      this.addBase.schema = 1
    },
  }
}
</script>

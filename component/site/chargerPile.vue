<template>
  <div style="width: 100%" class="comp-device-card-content-right">
    <el-radio-group v-model="sn">
      <template v-for="i of pileList">
        <el-radio-button :label="i.serialNumber">{{ i.serialNumber }}</el-radio-button>
      </template>
    </el-radio-group>
    <div class="part">
      <div class="part-title">{{ $t('common.basicInfo') }}</div>
      <common-flex>
        <common-flex direction="column" class="part-img-box" align="center">
          <img class="device-img" :src="require('./img/device-discharge.svg')" alt=""><br>
          <el-button type="primary" size="mini" v-if="+curDevInfo.status === 1" @click="stopCharge">{{ $t('site.stopCharging') }}</el-button>
          <span class="status-tips" v-else>{{ $t('site.notConnected') }}</span>
        </common-flex>
        <el-form disabled style="padding-right: 24px; flex-grow: 1" label-width="260px" label-position="top">
          <el-row type="flex" :gutter="60">
            <el-col :span="10">
              <el-form-item :label="$t('common.status')">
                <el-input disabled type="text" />
                <dict-tag class="posa" style="bottom: 0; left: 20px; color: #C0C4CC" :options="networkStatus" :value="curDevInfo.net"/>
              </el-form-item>
            </el-col>
            <el-col :span="10"><el-form-item :label="$t('site.sessionStarted')"><el-input v-model="curDevInfo.startTime"></el-input></el-form-item></el-col>
          </el-row>
          <el-row type="flex" :gutter="60">
            <el-col :span="10"><el-form-item :label="$t('site.duration')"><el-input v-model="curDevInfo.duration"></el-input></el-form-item></el-col>
            <el-col :span="10"><el-form-item :label="$t('site.energyAdded')"><el-input v-model="curDevInfo.energy"></el-input></el-form-item></el-col>
          </el-row>
          <el-row type="flex" :gutter="60">
            <el-col :span="10"><el-form-item :label="$t('common.serialNumber')"><el-input v-model="curDevInfo.serialNumber"></el-input></el-form-item></el-col>
            <el-col :span="10"><el-form-item :label="$t('site.newInstallation')">
              <el-input disabled type="text" />
              <dict-tag class="posa" style="bottom: 0; left: 20px; color: #C0C4CC" :options="newInstall" :value="curDevInfo.installation"/>
            </el-form-item></el-col>
          </el-row>
          <el-row type="flex" :gutter="60">
            <el-col :span="10"><el-form-item :label="$t('common.lifetime')"><el-input v-model="curDevInfo.lifetime"></el-input></el-form-item></el-col>
          </el-row>
        </el-form>
      </common-flex>
    </div>

    <div style="margin-top: 24px">
      <div class="part">
        <div class="part-title">{{ $t('common.realtimeData') }}</div>
        <common-flex style="margin-top: 24px">
          <common-flex class="part-img-box" justify="flex-end">
            <div class="part-title" style="border: none; line-height: 35px; margin-right: 12px">{{ $t('common.import') }}:</div>
          </common-flex>
          <el-form disabled style="padding-right: 24px; flex-grow: 1" label-width="260px" label-position="top">
            <div class="part-title" style="border: none; line-height: 35px; text-indent: 0; margin-bottom: 0; color: #606266">{{ $t('common.power') }}(kW) {{ curDevInfo.extInfo.powerImport }}</div>
            <el-row type="flex" :gutter="60">
              <el-col :span="20">
                <el-table class="table" :data="curDevInfo.importList">
                  <el-table-column label="" prop="pvNum"></el-table-column>
                  <el-table-column :label="`${$t('common.voltage')}(V)`" prop="v"></el-table-column>
                  <el-table-column :label="`${$t('common.current')}(A)`" prop="A"></el-table-column>
                </el-table>
              </el-col>
            </el-row>
          </el-form>
        </common-flex>
        <common-flex style="margin-top: 24px">
          <common-flex class="part-img-box" justify="flex-end">
            <div class="part-title" style="border: none; line-height: 35px; margin-right: 12px">{{ $t('common.export') }}:</div>
          </common-flex>
          <el-form disabled style="padding-right: 24px; flex-grow: 1" label-width="260px" label-position="top">
            <div class="part-title" style="border: none; line-height: 35px; text-indent: 0; margin-bottom: 0; color: #606266">{{ $t('common.power') }}(kW) {{ curDevInfo.extInfo.powerExport }}</div>
            <el-row type="flex" :gutter="60">
              <el-col :span="20">
                <el-table class="table" :data="curDevInfo.exportList">
                  <el-table-column label="" prop="pvNum"></el-table-column>
                  <el-table-column :label="`${$t('common.voltage')}(V)`" prop="v"></el-table-column>
                  <el-table-column :label="`${$t('common.current')}(A)`" prop="A"></el-table-column>
                </el-table>
              </el-col>
            </el-row>
          </el-form>
        </common-flex>

        <common-flex style="margin-top: 24px">
          <common-flex class="part-img-box" justify="flex-end">
            <div class="part-title" style="border: none; line-height: 35px; margin-right: 12px">{{ $t('site.chargingEnergy') }}:</div>
          </common-flex>
          <el-form disabled style="padding-right: 24px; flex-grow: 1" label-width="260px" label-position="top">
            <el-row type="flex" :gutter="60">
              <el-col :span="10"><el-form-item :label="`${$t('common.today')}(kWh)`"><el-input v-model="curDevInfo.dayEnergy"></el-input></el-form-item></el-col>
              <el-col :span="10"><el-form-item :label="`${$t('common.thisMonth')}(kWh)`"><el-input v-model="curDevInfo.monthEnergy"></el-input></el-form-item></el-col>
            </el-row>
            <el-row type="flex" :gutter="60">
              <el-col :span="10"><el-form-item :label="`${$t('common.thisYear')}(kWh)`"><el-input v-model="curDevInfo.yearEnergy"></el-input></el-form-item></el-col>
              <el-col :span="10"><el-form-item :label="`${$t('common.lifetime')}(kWh)`"><el-input v-model="curDevInfo.allEnergy"></el-input></el-form-item></el-col>
            </el-row>
          </el-form>
        </common-flex>
      </div>
    </div>
    <div style="margin-top: 24px">
      <div class="part">
        <div class="part-title">{{ $t('common.chargeSet') }}</div>
        <common-flex style="margin: 24px 0">
          <common-flex class="part-img-box" justify="flex-end"></common-flex>
          <el-form :model="chargeModel" ref="chargeForm" :rules="rules" size="small" style="padding-right: 24px; flex-grow: 1" label-width="260px" label-position="top">
            <el-row type="flex" :gutter="60">
              <el-col :span="10">
                <el-form-item label="Charging Type" prop="chargingType">
                  <el-select v-model="chargeModel['chargingType']" style="width: 100%" @change="changeChargeType">
                    <el-option v-for="(i, k) of chargeTypeOptions" :value="i.value" :label="i.label" :key="k"></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="10" v-if="chargeModel['chargingType']">
                <el-form-item :label="`Charging Params${chargeParamsLabel}`" prop="chargingPara">
                  <el-input @input="verifyChargeParams" v-model="chargeModel['chargingPara']" style="width: 100%" :placeholder="chargeTypeOptions[chargeModel['chargingType']].placeholder"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="4">
                <el-form-item label="1" label-width="0px" class="form-btn">
                  <el-button @click="chargeForm" type="primary">Start Charge</el-button>
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
        </common-flex>

      </div>
    </div>
  </div>
</template>

<script>
import {orderRes, stopCharge, chargeSet, getChargeSet} from "@/api/device"
import { networkStatus, newInstall } from '@sub/utils/dict'
const statusList = ['NO_RESPONSE', 'SUCCESS', 'ERROR', 'EXECUTING', 'NOT_ONLINE', 'UN_EXIST_FILE', 'SUBMIT_SUCCESS', 'NO_MATCH']
let timerInter = null, times = 1
export default {
  name: 'comp-charger',
  props: {
    curDevInfo: {
      type: Object,
      default: () => {
        return {}
      }
    },
    pileList: {
      type: Array,
      default: () => {
        return []
      }
    },
  },
  watch: {
    pileList: {
      handler(v) {
        if (v.length) {
          this.sn = v[0].serialNumber
          this.getChargeSetFn()
        }
      },
      immediate: true
    },
    sn() {
      this.changeCurPile()
      this.getChargeSetFn()
    },
  },
  data() {
    return {
      networkStatus,
      newInstall,
      sn: '',
      chargeModel: {
        chargingType: undefined,
        chargingPara: undefined
      },
      rules: {
        chargingType: [
          {
            required: true, message: '请选择充电类型', trigger: 'change'
          }
        ],
        chargingPara: [
          {
            required: true, message: '请输入充电参数', trigger: ['blur', 'change']
          }
        ]
      },
      chargeTypeOptions: [
        {
          label: '立即充电',
          value: 0,
          placeholder: ''
        },
        {
          label: '预约充电',
          value: 1,
          placeholder: '[1,24]'
        },
        {
          label: '按时长充电',
          value: 2,
          placeholder: '[1,24]'
        },
        {
          label: '按电量充电',
          value: 3,
          placeholder: '[1,100]'
        },
      ]
    }
  },
  computed: {
    chargeParamsLabel() {
      const labelMap = {
        0: '(h)',
        1: '(h)',
        2: '(h)',
        3: '(kWh)'
      }
      return labelMap[this.chargeModel.chargingType]
    }
  },
  methods: {
    changeChargeType(v) {
      if(v === 0) this.chargeModel.chargingPara = 0
      else this.chargeModel.chargingPara = undefined
    },
    chargeForm() {
      this.$refs.chargeForm.validate(v => {
        if(v) {
          const data = {
            siteCode: this.$route.query.siteCode,
            deviceSn: this.sn,
            type: 20001,
            baseParam: JSON.stringify([{...this.chargeModel}])
          }
          chargeSet(data).then(res => {
            if (+res.data === 3) {
              this.$modal.loading()
              this.getOrderRes()
            } else this.$modal.msg(statusList[+res.data])
          })
        }
      })
    },
    getChargeSetFn() {
      getChargeSet({ siteCode: this.$route.query.siteCode, deviceSn: this.sn}).then(res => {
        const item = res.data.find(i => i.type === 20001)
        this.chargeModel.chargingType = JSON.parse(item.param)[0].ChargingType
        this.chargeModel.chargingPara = JSON.parse(item.param)[0].ChargingPara
      })
    },
    verifyChargeParams(v) {
      this.chargeModel.chargingPara = v.replace(/^(0+)|[^\d]+/g, '')
      if (this.chargeModel.chargingType === 3) { // 1-100
        if(+this.chargeModel.chargingPara < 1 || +this.chargeModel.chargingPara > 100) {
          this.rules.chargingPara[0].message = '请输入充电参数[0, 100]范围内'
          this.chargeModel.chargingPara = ''
        } else this.rules.chargingPara[0].message = ''
      } else {
        if(+this.chargeModel.chargingPara < 1 || +this.chargeModel.chargingPara > 24) {
          this.rules.chargingPara[0].message = '请输入充电参数[0, 24]范围内'
          this.chargeModel.chargingPara = ''
        } else this.rules.chargingPara[0].message = ''
      }
      this.rules = {...this.rules}
    },
    changeCurPile() {
      this.$emit('common', this.sn)
    },
    stopCharge() {
      let data = {
        siteCode: this.$route.query?.siteCode,
        sn: this.sn
      }
      stopCharge(data).then(res => {
        if (+res.data === 3) {
          this.$modal.loading()
          this.getOrderRes()
        } else this.$modal.msg(statusList[+res.data])
      })
    },
    getOrderRes() {
      let data = {
        sn: this.sn,
      }
      clearInterval(timerInter)
      timerInter = setInterval(() => {
        times++
        orderRes(data).then(res => {
          if (+res.data === 3) {
            if(times > 15) {
              clearInterval(timerInter)
              times = 1
              this.$modal.closeLoading()
              return this.$modal.msgError('timeout')
            } else this.getOrderRes()
          } else {
            clearInterval(timerInter)
            times = 1
            if (+res.data === 1) {
              this.$modal.msgSuccess('SUCCESS')
            } else this.$modal.msgError(statusList[+res.data])
            this.$modal.closeLoading()
          }
        })
      }, 1000)
    },
  },
}
</script>

<style lang="scss">
.form-btn {
  .el-form-item__label {
    width: 0;
    opacity: 0;
  }
}
</style>

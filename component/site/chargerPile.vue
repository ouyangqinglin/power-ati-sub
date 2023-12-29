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

  </div>
</template>

<script>
import {orderRes, stopCharge} from "@/api/device"
import { networkStatus, newInstall } from '@sub/utils/dict'

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
        }
      },
      immediate: true
    },
    sn() {
      this.changeCurPile()
    },
  },
  data() {
    return {
      networkStatus,
      newInstall,
      sn: ''
    }
  },
  methods: {
    changeCurPile() {
      this.$emit('common', this.sn)
    },
    stopCharge() {
      let data = {
        siteCode: this.$route.query?.siteCode,
        sn: this.sn
      }
      stopCharge(data).then(res => {
        let statusList = ['NO_RESPONSE', 'SUCCESS', 'ERROR', 'EXECUTING', 'NOT_ONLINE', 'UN_EXIST_FILE', 'SUBMIT_SUCCESS', 'NO_MATCH']
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
      let statusList = ['NO_RESPONSE', 'SUCCESS', 'ERROR', 'EXECUTING', 'NOT_ONLINE', 'UN_EXIST_FILE', 'SUBMIT_SUCCESS', 'NO_MATCH']
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

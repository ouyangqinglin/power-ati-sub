<script>
import {deviceSet, getSettingInfo, orderRes} from "@/api/device";
let timerInter = null
let times = 1
let copyDeviceInfo = {}
export default {
  name: "yuanSet",
  data() {
    return {
      siteCode: '',
      rules: {
        317: [
          { required: false, message: '', trigger: ['blur', 'change'] }
        ],
        318: [
          { required: false, message: '', trigger: ['blur', 'change'] }
        ],
        319: [
          { required: false, message: '', trigger: ['blur', 'change'] }
        ],
        320: [
          { required: false, message: '', trigger: ['blur', 'change'] }
        ],
        321: [
          { required: false, message: '', trigger: ['blur', 'change'] }
        ],
        322: [
          { required: false, message: '', trigger: ['blur', 'change'] }
        ],
        323: [
          { required: false, message: '', trigger: ['blur', 'change'] }
        ],
        325: [
          { required: false, message: '', trigger: ['blur', 'change'] }
        ],
        303: [
          { required: false, message: '', trigger: ['blur', 'change'] }
        ],
        304: [
          { required: false, message: '', trigger: ['blur', 'change'] }
        ],
        305: [
          { required: false, message: '', trigger: ['blur', 'change'] }
        ],
        309: [
          { required: false, message: '', trigger: ['blur', 'change'] }
        ],
        310: [
          { required: false, message: '', trigger: ['blur', 'change'] }
        ],
        313: [
          { required: false, message: '', trigger: ['blur', 'change'] }
        ],
        329: [
          { required: false, message: '', trigger: ['blur', 'change'] }
        ],
        331: [
          { required: false, message: '', trigger: ['blur', 'change'] }
        ],
      },
      deviceBase: {},
      peakShaving: [
        {
          ecoModePeriodEnable: '',
          chargeDischargeSetting: '',
          battChargeBy: '',
          battPowerLimit: '',
          startTime: '00:00',
          stopTime: '00:00'
        },
        {
          ecoModePeriodEnable: '',
          chargeDischargeSetting: '',
          battChargeBy: '',
          battPowerLimit: '',
          startTime: '00:00',
          stopTime: '00:00'
        },
        {
          ecoModePeriodEnable: '',
          chargeDischargeSetting: '',
          battChargeBy: '',
          battPowerLimit: '',
          startTime: '00:00',
          stopTime: '00:00'
        },
        {
          ecoModePeriodEnable: '',
          chargeDischargeSetting: '',
          battChargeBy: '',
          battPowerLimit: '',
          startTime: '00:00',
          stopTime: '00:00'
        },
        {
          ecoModePeriodEnable: '',
          chargeDischargeSetting: '',
          battChargeBy: '',
          battPowerLimit: '',
          startTime: '00:00',
          stopTime: '00:00'
        },
        {
          ecoModePeriodEnable: '',
          chargeDischargeSetting: '',
          battChargeBy: '',
          battPowerLimit: '',
          startTime: '00:00',
          stopTime: '00:00'
        },
      ],
      overloadOptions: [
        {
          label: 'Rated',
          value: 0
        },
        {
          label: 'Overloading',
          value: 1
        },
        {
          label: 'Limit',
          value: 2
        },
      ],
      onOffOptions: [
        {
          label: 'OFF',
          value: 0
        },
        {
          label: 'ON',
          value: 1
        }
      ],
      paveSignOptions: [
        {
          label: 'Independent',
          value: 0
        },    {
          label: 'Slave',
          value: 1
        },    {
          label: 'Master',
          value: 2
        },
      ],
      inverterWorkOptions: [
        {
          label: 'General Mode',
          value: 0
        },
        {
          label: 'Economic Mode',
          value: 1
        },
        {
          label: 'UPS Mode',
          value: 2
        },
        {
          label: 'Off Grid Mode',
          value: 3
        },
        {
          label: 'EMS_ACCtrlMode',
          value: 4
        },
        {
          label: 'EMS_GeneralMode',
          value: 5
        },
        {
          label: 'EMS_BattCtrlMode',
          value: 6
        },
        {
          label: 'EMS_OffGridMode',
          value: 7
        },
      ],
      enableOptions: [
        {
          label: 'Enable',
          value: 1
        },
        {
          label: 'Disable',
          value: 0
        },
      ],
      chargeOptions: [
        {
          label: 'NONE',
          value: 0
        },
        {
          label: 'Charge',
          value: 1
        },
        {
          label: 'Discharge',
          value: 2
        }
      ],
      chargeByOptions: [
        {
          label: 'PV',
          value: 0
        },
        {
          label: 'PV + GRID',
          value: 1
        }
      ],
      acPowerOptions: [
        {
          label: 'OFF',
          value: 0
        },
        {
          label: 'TotalPower-setting',
          value: 1
        },
        {
          label: 'Power Setting on each phase',
          value: 2
        },
      ],
      powerOutOptions: [
        {
          label: 'PV Output Priority',
          value: 0
        },
        {
          label: 'Battery Output Priority',
          value: 1
        }
      ],
      controlModeOptions: [
        {
          label: 'OFF',
          value: 0
        },
        {
          label: 'PF',
          value: 1
        },
        {
          label: 'QT',
          value: 2
        },
        {
          label: 'QP',
          value: 3
        },
        {
          label: 'QU',
          value: 4
        },
      ],
      safeCodeOptions: [
        {
          label: '50Hz Default',
          value: 10
        },        {
          label: '60Hz Default',
          value: 11
        },        {
          label: 'VDE4105',
          value: 12
        },        {
          label: 'AS4777.2(A)',
          value: 13
        },        {
          label: 'AS4777.2(NZ)',
          value: 14
        },        {
          label: 'EN50549',
          value: 16
        },        {
          label: 'IEC61727(50Hz)',
          value: 18
        },        {
          label: 'IEC61727(60Hz)',
          value: 19
        },        {
          label: 'Italy',
          value: 24
        },        {
          label: 'Czech(A1)',
          value: 25
        },        {
          label: 'Czech(A2)',
          value: 26
        },        {
          label: 'EN50549(PL)',
          value: 29
        },        {
          label: 'Belgium',
          value: 31
        },        {
          label: 'VDE0126',
          value: 35
        },        {
          label: 'Italy(MV)',
          value: 36
        },        {
          label: 'South Africa',
          value: 37
        },        {
          label: 'G98',
          value: 40
        },        {
          label: 'G99',
          value: 41
        },        {
          label: 'Austria',
          value: 42
        },        {
          label: 'AS4777.2(B)',
          value: 46
        },        {
          label: 'ES:UNE217002',
          value: 47
        },        {
          label: 'AS4777.2(C)',
          value: 48
        },        {
          label: 'ES:NTS631',
          value: 49
        },
      ],
    }
  },
  watch: {
    base: {
      immediate: true,
      handler(v) {
        this.siteCode = this.$route.query?.siteCode
        this.getDeviceSet()
      }
    }
  },
  beforeDestroy() {
    clearInterval(timerInter)
  },
  methods: {
    enterLimit(v, index) {
      this.peakShaving[index].battPowerLimit = v.replace(/\D/g, "")
    },
    setTimeList() {
      let params = {
        type: 333,
        siteCode: this.siteCode,
        timeList: this.peakShaving
      }
      deviceSet(params).then(res => {
        if ([1002, 10030, 10031, 10032, 10033].includes(+res.code)) {
          this.$modal.msgError(res.msg)
          this.getDeviceSet()
        } else {
          let statusList = ['NO_RESPONSE', 'SUCCESS', 'ERROR', 'EXECUTING', 'NOT_ONLINE', 'UN_EXIST_FILE', 'SUBMIT_SUCCESS', 'NO_MATCH']
          if (+res.data === 3) {
            this.$modal.loading()
            this.getOrderRes()
          } else {
            this.$modal.msgError(statusList[+res.data])
            this.getDeviceSet()
          }
        }
      })
    },
    getOrderRes() {
      let statusList = ['NO_RESPONSE', 'SUCCESS', 'ERROR', 'EXECUTING', 'NOT_ONLINE', 'UN_EXIST_FILE', 'SUBMIT_SUCCESS', 'NO_MATCH']
      let data = {
        siteCode: this.siteCode
      }
      clearInterval(timerInter)
      timerInter = setInterval(() => {
        times++
        orderRes(data).then(res => {
          if (+res.data === 3) {
            if(times > 15) {
              times = 1
              clearInterval(timerInter)
              this.getDeviceSet()
              this.$modal.closeLoading()
              return this.$modal.msgError('timeout')
            }
            this.getOrderRes()
          } else {
            times = 1
            if (+res.data === 1) {
              this.$modal.msgSuccess('SUCCESS')
            } else this.$modal.msgError(statusList[+res.data])
            clearInterval(timerInter)
            this.getDeviceSet()
            this.$modal.closeLoading()
          }
        })
      }, 1000)
    },
    setDevice(type) {
      if (copyDeviceInfo[type] === this.deviceBase[type]) return this.$modal.confirm('Value not changed').catch((err) => console.log(err))
      let data = {
        siteCode: this.siteCode,
        type,
        baseParam: this.deviceBase[type]
      }
      deviceSet(data).then(res => {
        if ([1002, 10030, 10031, 10032, 10033].includes(+res.code)) {
          this.$modal.msgError(res.msg)
          this.getDeviceSet()
        } else {
          let statusList = ['NO_RESPONSE', 'SUCCESS', 'ERROR', 'EXECUTING', 'NOT_ONLINE', 'UN_EXIST_FILE', 'SUBMIT_SUCCESS', 'NO_MATCH']
          if (+res.data === 3) {
            this.$modal.loading()
            this.getOrderRes()
          } else {
            this.$modal.msgError(statusList[+res.data])
            this.getDeviceSet()
          }
        }
      })
    },
    getDeviceSet() {
      let data = {
        siteCode: this.siteCode
      }
      getSettingInfo(data).then(res => {
        let item = {}
        res.data.forEach(i => {
          if (i.param !== null && typeof i.param !== 'undefined') item[i.type] = +i.param
          else item[i.type] = ''
        })
        this.deviceBase = item
        if (this.deviceBase[333]) {
          this.peakShaving = JSON.parse(this.deviceBase[333])
        }
        copyDeviceInfo = JSON.parse(JSON.stringify(this.deviceBase))
      })
    },
    inputVerify(type) {
      for(let key in this.rules) {
        this.rules[key][0].required = false
        this.rules[key][0].message = ''
      }
      if (!Number.isInteger(+this.deviceBase[type])) {
        this.deviceBase[type] = ''
        this.rules[+type][0].message = 'Please enter the number'
        this.rules[+type][0].required = true
      } else {
        this.rules[+type][0].required = false
        this.rules[+type][0].message = ''
      }
      this.rules = {...this.rules}
    },
  }
}
</script>

<template>
  <div class="remote">
    <div class="set-part">
      <div class="set-type">System Setting</div>
      <el-form label-position="top" :model="deviceBase" :rules="rules" size="small" hide-required-asterisk>
        <el-row :gutter="16">
          <el-col :span="8">
            <el-form-item label="Overload Method" prop="301">
              <el-select v-model="deviceBase[301]" style="width: 60%">
                <el-option v-for="(i, k) of overloadOptions" :value="i.value" :label="i.label" :key="k"></el-option>
              </el-select>
              <el-button type="primary" plain class="ml10" @click="setDevice(301)">Set</el-button>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="N_PE Check SwitchN_PE" prop="315">
              <el-select v-model="deviceBase[315]" style="width: 60%">
                <el-option v-for="(i, k) of onOffOptions" :value="i.value" :label="i.label" :key="k"></el-option>
              </el-select>
              <el-button type="primary" plain class="ml10" @click="setDevice(315)">Set</el-button>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="Inverter Working Mode Setting" prop="307">
              <el-select v-model="deviceBase[307]" style="width: 60%">
                <el-option v-for="(i, k) of inverterWorkOptions" :value="i.value" :label="i.label" :key="k"></el-option>
              </el-select>
              <el-button type="primary" plain class="ml10" @click="setDevice(307)">Set</el-button>
            </el-form-item>
          </el-col>
        </el-row>
<!--        选择EconomicMode-->
        <div class="peak-yuan" v-if="+deviceBase[307] === 1">
          <span>Economic Mode</span><el-button type="primary" plain class="ml10" size="small" @click="setTimeList">Set</el-button>
          <template v-for="(i, k) of peakShaving">
            <el-row :gutter="16" class="mt15">
              <el-col :span="2"><span class="mt10" style="font-size: 14px">time{{ k+1 }}：</span></el-col>
              <el-col :span="7">
                <common-flex class="time-range" align="center">
                  <div class="time-range-label" style="min-width: 100px">On/Off Enable</div>
                  <el-select v-model="i.ecoModePeriodEnable" size="small" style="width: 60%">
                    <el-option v-for="(i, k) of enableOptions" :label="i.label" :value="i.value" :key="k"></el-option>
                  </el-select>
                </common-flex>
              </el-col>
              <el-col :span="7">
                <common-flex class="time-range" align="center">
                  <div class="time-range-label">Charge Or Discharge</div>
                  <el-select v-model="i.chargeDischargeSetting" size="small" style="width: 60%">
                    <el-option v-for="(i, k) of chargeOptions" :label="i.label" :value="i.value" :key="k"></el-option>
                  </el-select>
                </common-flex>
              </el-col>
              <el-col :span="7">
                <common-flex class="time-range" align="center">
                  <div class="time-range-label">Battery Charge By</div>
                  <el-select v-model="i.battChargeBy" size="small" style="width: 60%">
                    <el-option v-for="(i, k) of chargeByOptions" :label="i.label" :value="i.value" :key="k"></el-option>
                  </el-select>
                </common-flex>
              </el-col>
            </el-row>
            <el-row :gutter="16" class="mt10">
              <el-col :span="2"><span class="mt5 opacity">time{{ k+1 }}}：</span></el-col>
              <el-col :span="7">
                <common-flex class="time-range" align="center">
                  <div class="time-range-label" style="min-width: 100px">Power Limit(%)</div>
                  <el-input @input="enterLimit(i.battPowerLimit, k)" placeholder="Enter" v-model="i.battPowerLimit" style="width: 60%" size="small"></el-input>
                </common-flex>
              </el-col>
              <el-col :span="7">
                <common-flex class="time-range-box ml10" align="center">
                  <el-time-select size="small" v-model="i.startTime" :picker-options="{start: '00:00', step: '00:01', end: '24:00'}"></el-time-select>
                  <div>-</div>
                  <el-time-select size="small" v-model="i.stopTime" :picker-options="{start: '00:00', step: '00:01', end: '24:00'}"></el-time-select>
                </common-flex>
              </el-col>
            </el-row>
          </template>
        </div>
<!--        选择EMS_ACCtrlMode-->
        <template v-if="+deviceBase[307] === 4">
          <el-row :gutter="16">
            <el-col :span="8">
              <el-form-item label="AC Power Scheduling Mode" prop="316">
                <el-select v-model="deviceBase[316]" style="width: 60%">
                  <el-option v-for="(i, k) of acPowerOptions" :value="i.value" :label="i.label" :key="k"></el-option>
                </el-select>
                <el-button type="primary" plain class="ml10" @click="setDevice(316)">Set</el-button>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="Total AC Power Scheduling(kW)" prop="317">
                <el-input @blur="inputVerify(317)" v-model="deviceBase[317]" style="width: 60%" placeholder="Please enter"></el-input>
                <el-button type="primary" plain class="ml10" :disabled="!deviceBase[317]" @click="setDevice(317)">Set</el-button>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="Phase A Power Scheduling(kW)" prop="318">
                <el-input @blur="inputVerify(318)" v-model="deviceBase[318]" style="width: 60%" placeholder="Please enter"></el-input>
                <el-button type="primary" plain class="ml10" :disabled="!deviceBase[318]" @click="setDevice(318)">Set</el-button>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="16">
            <el-col :span="8">
              <el-form-item label="Phase B Power Scheduling(kW)" prop="319">
                <el-input @blur="inputVerify(319)" v-model="deviceBase[319]" style="width: 60%" placeholder="Please enter"></el-input>
                <el-button type="primary" plain class="ml10" :disabled="!deviceBase[319]" @click="setDevice(319)">Set</el-button>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="Phase C Power Scheduling(kW)" prop="320">
                <el-input @blur="inputVerify(320)" v-model="deviceBase[320]" style="width: 60%" placeholder="Please enter"></el-input>
                <el-button type="primary" plain class="ml10" :disabled="!deviceBase[320]" @click="setDevice(320)">Set</el-button>
              </el-form-item>
            </el-col>
          </el-row>
        </template>
<!--        选择EMS_BattCtrlMode-->
        <template v-if="+deviceBase[307] === 6">
          <el-row :gutter="16">
            <el-col :span="8">
              <el-form-item label="Battery Power Scheduling(kW)" prop="321">
                <el-input @blur="inputVerify(321)" v-model="deviceBase[321]" style="width: 60%" placeholder="Please enter"></el-input>
                <el-button type="primary" :disabled="!deviceBase[321]" plain class="ml10" @click="setDevice(321)">Set</el-button>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="Max AC Power Limit(kW)" prop="322">
                <el-input @blur="inputVerify(322)" v-model="deviceBase[322]" style="width: 60%" placeholder="Please enter"></el-input>
                <el-button :disabled="!deviceBase[322]" type="primary" plain class="ml10" @click="setDevice(322)">Set</el-button>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="Min AC Power Limit(kW)" prop="323">
                <el-input @blur="inputVerify(323)" v-model="deviceBase[323]" style="width: 60%" placeholder="Please enter"></el-input>
                <el-button :disabled="!deviceBase[323]" type="primary" plain class="ml10" @click="setDevice(323)">Set</el-button>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="16">
            <el-col :span="8">
              <el-form-item label="Priority Of Power Output" prop="324">
                <el-select v-model="deviceBase[324]" style="width: 60%">
                  <el-option v-for="(i, k) of powerOutOptions" :value="i.value" :label="i.label" :key="k"></el-option>
                </el-select>
                <el-button type="primary" plain class="ml10" @click="setDevice(324)">Set</el-button>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="PV Power Scheduling(kW)" prop="325">
                <el-input @blur="inputVerify(325)" v-model="deviceBase[325]" style="width: 60%" placeholder="Please enter"></el-input>
                <el-button :disabled="!deviceBase[325]" type="primary" plain class="ml10" @click="setDevice(325)">Set</el-button>
              </el-form-item>
            </el-col>
          </el-row>
        </template>
      </el-form>
    </div>
    <div class="set-part">
      <div class="set-type">Power Control</div>
      <el-form label-position="top" :model="deviceBase" :rules="rules" size="small" hide-required-asterisk>
        <el-row :gutter="16">
          <el-col :span="8">
            <el-form-item label="Grid Power Limit Switch" prop="302">
              <el-select v-model="deviceBase[302]" style="width: 60%">
                <el-option v-for="(i, k) of onOffOptions" :value="i.value" :label="i.label" :key="k"></el-option>
              </el-select>
              <el-button type="primary" plain class="ml10" @click="setDevice(302)">Set</el-button>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="Grid Power Ratio Setting(%)" prop="303">
              <el-input @blur="inputVerify(303)" v-model="deviceBase[303]" style="width: 60%" placeholder="Please enter"></el-input>
              <el-button :disabled="!deviceBase[303]" type="primary" plain class="ml10" @click="setDevice(303)">Set</el-button>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="Reactive Power Percentage(%)" prop="304">
              <el-input @blur="inputVerify(304)" v-model="deviceBase[304]" style="width: 60%" placeholder="Please enter"></el-input>
              <el-button :disabled="!deviceBase[304]" type="primary" plain class="ml10" @click="setDevice(304)">Set</el-button>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="16">
          <el-col :span="8">
            <el-form-item label="PF" prop="305">
              <el-input @blur="inputVerify(305)" v-model="deviceBase[305]" style="width: 60%" placeholder="Please enter"></el-input>
              <el-button :disabled="!deviceBase[305]" type="primary" plain class="ml10" @click="setDevice(305)">Set</el-button>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="Reactive Power Control Mode" prop="306">
              <el-select v-model="deviceBase[306]" style="width: 60%">
                <el-option v-for="(i, k) of controlModeOptions" :value="i.value" :label="i.label" :key="k"></el-option>
              </el-select>
              <el-button type="primary" plain class="ml10" @click="setDevice(306)">Set</el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </div>
    <div class="set-part">
      <div class="set-type">Grid Parameters</div>
      <el-form label-position="top" :model="deviceBase" :rules="rules" size="small" hide-required-asterisk>
        <el-row :gutter="16">
          <el-col :span="8">
            <el-form-item label="Safety Code" prop="300">
              <el-select v-model="deviceBase[300]" style="width: 60%">
                <el-option v-for="(i, k) of safeCodeOptions" :value="i.value" :label="i.label" :key="k"></el-option>
              </el-select>
              <el-button type="primary" plain class="ml10" @click="setDevice(300)">Set</el-button>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="Enable UPS Switch" prop="308">
              <el-select v-model="deviceBase[308]" style="width: 60%">
                <el-option v-for="(i, k) of onOffOptions" :value="i.value" :label="i.label" :key="k"></el-option>
              </el-select>
              <el-button type="primary" plain class="ml10" @click="setDevice(308)">Set</el-button>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="On Grid Unbalanced Output Switch" prop="311">
              <el-select v-model="deviceBase[311]" style="width: 60%">
                <el-option v-for="(i, k) of onOffOptions" :value="i.value" :label="i.label" :key="k"></el-option>
              </el-select>
              <el-button type="primary" plain class="ml10" @click="setDevice(311)">Set</el-button>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="16">
          <el-col :span="8">
            <el-form-item label="Peak Load Shifting Switch" prop="312">
              <el-select v-model="deviceBase[312]" style="width: 60%">
                <el-option v-for="(i, k) of onOffOptions" :value="i.value" :label="i.label" :key="k"></el-option>
              </el-select>
              <el-button type="primary" plain class="ml10" @click="setDevice(312)">Set</el-button>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="Off Grid Voltage(V)" prop="309">
              <el-input @blur="inputVerify(309)" v-model="deviceBase[309]" style="width: 60%" placeholder="Please enter"></el-input>
              <el-button :disabled="!deviceBase[309]" type="primary" plain class="ml10" @click="setDevice(309)">Set</el-button>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="Off Grid Frequency(Hz)" prop="310">
              <el-input @blur="inputVerify(310)" v-model="deviceBase[310]" style="width: 60%" placeholder="Please enter"></el-input>
              <el-button :disabled="!deviceBase[310]" type="primary" plain class="ml10" @click="setDevice(310)">Set</el-button>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="16">
          <el-col :span="8">
            <el-form-item label="Max Grid Power Value(kVA)" prop="313">
              <el-input @blur="inputVerify(313)" v-model="deviceBase[313]" style="width: 60%" placeholder="Please enter"></el-input>
              <el-button :disabled="!deviceBase[313]" type="primary" plain class="ml10" @click="setDevice(313)">Set</el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </div>
    <div class="set-part">
      <div class="set-type">Battery Parameters</div>
      <el-form label-position="top" :model="deviceBase" :rules="rules" size="small" hide-required-asterisk>
        <el-row :gutter="16">
          <el-col :span="8">
            <el-form-item label="On Grid SOC Protection" prop="328">
              <el-select v-model="deviceBase[328]" style="width: 60%">
                <el-option v-for="(i, k) of onOffOptions" :value="i.value" :label="i.label" :key="k"></el-option>
              </el-select>
              <el-button type="primary" plain class="ml10" @click="setDevice(328)">Set</el-button>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="On Grid Battery End SOC(%)" prop="329">
              <el-input @blur="inputVerify(329)" v-model="deviceBase[329]" style="width: 60%" placeholder="Please enter"></el-input>
              <el-button :disabled="!deviceBase[329]" type="primary" plain class="ml10" @click="setDevice(329)">Set</el-button>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="Off Grid SOC Protection" prop="330">
              <el-select v-model="deviceBase[330]" style="width: 60%">
                <el-option v-for="(i, k) of onOffOptions" :value="i.value" :label="i.label" :key="k"></el-option>
              </el-select>
              <el-button type="primary" plain class="ml10" @click="setDevice(330)">Set</el-button>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="16">
          <el-col :span="8">
            <el-form-item label="Off Grid Battery End SOC(%)" prop="331">
              <el-input @blur="inputVerify(331)" v-model="deviceBase[331]" style="width: 60%" placeholder="Please enter"></el-input>
              <el-button :disabled="!deviceBase[331]" type="primary" plain class="ml10" @click="setDevice(331)">Set</el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </div>
    <div class="set-part">
      <div class="set-type">Feature Parameters</div>
      <el-form label-position="top" :model="deviceBase" :rules="rules" size="small" hide-required-asterisk>
        <el-row :gutter="16">
          <el-col :span="8">
            <el-form-item label="Pave Sign" prop="314">
              <el-select v-model="deviceBase[314]" style="width: 60%">
                <el-option v-for="(i, k) of paveSignOptions" :value="i.value" :label="i.label" :key="k"></el-option>
              </el-select>
              <el-button type="primary" plain class="ml10" @click="setDevice(314)">Set</el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </div>
  </div>
</template>

<style lang="scss">
.peak-yuan {
  padding: 16px 0 24px 10px;
  border: 1px solid #D8DCE6;
  border-radius: 2px;
  .time-range {
    &-label {
      margin-right: 10px;
      text-align: right;
      min-width: 120px;
      @include nFont(12 #828282)
    }
    &-box {
      width: 160px;
      border: 1px solid #dcdfe6;
      border-radius: 4px;
      .el-input__prefix {
        display: none;
      }
      .el-date-editor.el-input {
        width: 80px !important;
        border: none !important;
      }
      .el-input__inner {
        border: none;
        padding: 0 14px;
      }
    }
  }
  .opacity {
    opacity: 0;
  }
}
</style>

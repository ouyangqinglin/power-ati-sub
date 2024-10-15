<script>
import {getSettingInfo, deviceSet, orderRes} from '@/api/device'
import inverterMixin from "@sub/utils/inverterMixin";
let copyDeviceInfo = {}
let statusList = ['NO_RESPONSE', 'SUCCESS', 'ERROR', 'EXECUTING', 'NOT_ONLINE', 'UN_EXIST_FILE', 'SUBMIT_SUCCESS', 'NO_MATCH']

export default {
  name: "site-magraySet",
  mixins: [inverterMixin],
  data() {
    return {
      peakShaving: {
        chargeS1: '',
        chargeS2: '',
        chargeS3: '',
        chargeE1: '',
        chargeE2: '',
        chargeE3: '',
        dischargeS1: '',
        dischargeS2: '',
        dischargeS3: '',
        dischargeE1: '',
        dischargeE2: '',
        dischargeE3: '',
      },
      workOption: [
        {
          label: 'Self Consumption',
          value: 0
        },
        {
          label: 'Peak Shaving',
          value: 1
        },
        {
          label: 'Battery Priority',
          value: 2
        }
      ],
      pvTypeOption: [
        {
          label: 'Independent',
          value: 0
        },
        {
          label: 'Parallel',
          value: 1
        },
        {
          label: 'Constant Voltage',
          value: 2
        },
      ],
      remoteSwitchOptions: [
        {
          label: 'disable',
          value: 0
        },
        {
          label: 'enable',
          value: 1
        },
      ],
      remoteSwitchTypeOptions: [
        {
          label: 'armtwisting',
          value: 1
        },
        {
          label: 'daily',
          value: 2
        },
        {
          label: 'date',
          value: 3
        },
      ],
      remoteSwitchTypeOneOptions: [
        {
          label: 'Off',
          value: -86
        },
        {
          label: 'On',
          value: 85
        },
      ],
      dailyOn: '',
      dailyOff: '',
      dateOn: '',
      dateOff: '',
      remoteSwitchIsAble: '',
      remoteSwitchType: '',
      isArmtwisting: '',
      batTypeOption: [
        {
          label: 'DC-source',
          value: 0
        },
        {
          label: 'Lead acid',
          value: 1
        },
        {
          label: 'Lithium',
          value: 2
        }
      ],
      batComuTypeOption: [
        {
          label: 'CAN',
          value: 1
        },
        {
          label: '485',
          value: 2
        }
      ],
      gridFunctionOption: [
        {
          label: 'disabled',
          value: 0
        },
        {
          label: 'No battery system function',
          value: 2048
        }
      ],
      reactiveTypeOption: [
        {
          label: 'Power Factor',
          value: '0'
        },
        {
          label: 'React Power',
          value: '1'
        }
      ],
      gridOption: [
        {
          label: 'Australia',
          value: '0'
        },
        {
          label: 'West Australia',
          value: '1'
        },
        {
          label: 'New Zealand',
          value: '2'
        },
        {
          label: 'United Kingdom',
          value: '3'
        },
        {
          label: 'Pakistan',
          value: '4'
        },
        {
          label: 'Korea',
          value: '5'
        },
        {
          label: 'The Philippines',
          value: '6'
        },
        {
          label: 'China',
          value: '7'
        },
        {
          label: 'The United States',
          value: '8'
        },
        {
          label: 'Thailand',
          value: '9'
        },
        {
          label: 'South Africa',
          value: '10'
        },
        {
          label: 'Custom',
          value: '11'
        },
        {
          label: 'Poland',
          value: '12'
        },
        {
          label: 'EN50549',
          value: '13'
        },
        {
          label: 'VDE4105',
          value: '14'
        },
        {
          label: 'Japan',
          value: '15'
        },
      ],
      gridSetOptions: [
        {
          value: '0',
          label: 'single phase'
        },
        {
          value: '1',
          label: 'split phase'
        },
        {
          value: '2',
          label: 'US208V'
        },
        {
          value: '3',
          label: 'JP120V'
        },
      ],
      usGridClassOptions: [
        {
          value: '0',
          label: 'UL1741&IEEE1547.2020'
        },
        {
          value: '1',
          label: 'Rule21'
        },
        {
          value: '2',
          label: 'SRD-UL1741 1.0'
        },
        {
          value: '3',
          label: 'UL1741 SB'
        },
        {
          value: '4',
          label: 'UL1741 SA'
        },
        {
          value: '5',
          label: 'Heco 2.0'
        },
      ],
      rules: {
        1: [
          { required: false, message: '', trigger: ['blur', 'change'] }
        ],
        2: [
          { required: false, message: '', trigger: ['blur', 'change'] }
        ],
        3: [
          { required: false, message: '', trigger: ['blur', 'change'] }
        ],
        4: [
          { required: false, message: '', trigger: ['blur', 'change'] }
        ],
        5: [
          { required: false, message: '', trigger: ['blur', 'change'] }
        ],
        6: [
          { required: false, message: '', trigger: ['blur', 'change'] }
        ],
        7: [
          { required: false, message: '', trigger: ['blur', 'change'] }
        ],
        8: [
          { required: false, message: '', trigger: ['blur', 'change'] }
        ],
        17: [
          { required: false, message: '', trigger: ['blur', 'change'] }
        ],
        24: [
          { required: false, message: '', trigger: ['blur', 'change'] }
        ],
        30: [
          { required: false, message: '', trigger: ['blur', 'change'] }
        ],
        33: [
          { required: false, message: '', trigger: 'blur' }
        ],
      }
    }
  },
  methods: {
    inputVerify(min, max, type) {
      for(let key in this.rules) {
        this.rules[key][0].required = false
        this.rules[key][0].message = ''
      }
      let arr = [1, 30]
      if (!Number.isInteger(+this.deviceBase[type])) {
        this.deviceBase[type] = ''
        this.rules[+type][0].message = 'Please enter the number'
        this.rules[+type][0].required = true
      } else if (+this.deviceBase[type] > max || +this.deviceBase[type] < min) {
        this.deviceBase[type] = ''
        if (arr.includes(+type)) this.rules[+type][0].message = ' '
        else this.rules[+type][0].message = `Please enter the number in [${min}, ${max}]`
        this.rules[+type][0].required = true
      } else {
        this.rules[+type][0].required = false
        this.rules[+type][0].message = ''
      }
      this.rules = {...this.rules}
    },
    setTimeList() {
      let timeList = []
      for(let i = 1; i < 4; i++) {
        let item = {}
        if (this.peakShaving[`chargeS${i}`] && this.peakShaving[`chargeE${i}`]) {
          item.chargeStartTime = this.peakShaving[`chargeS${i}`]
          item.chargeEndTime = this.peakShaving[`chargeE${i}`]
        } else {
          item.chargeStartTime = '00:00'
          item.chargeEndTime = '00:00'
        }
        if (this.peakShaving[`dischargeS${i}`] && this.peakShaving[`dischargeE${i}`]) {
          item.dischargeStartTime = this.peakShaving[`dischargeS${i}`]
          item.dischargeEndTime = this.peakShaving[`dischargeE${i}`]
        } else {
          item.dischargeStartTime = '00:00'
          item.dischargeEndTime = '00:00'
        }
        timeList.push(item)
      }
      let params = {
        type: 34,
        siteCode: this.siteCode,
        timeList
      }
      deviceSet(params).then(res => {
        if ([1002, 10030, 10031, 10032, 10033].includes(+res.code)) {
          this.$modal.msgError(res.msg)
          this.getDeviceSet()
          this.$modal.closeLoading()
        } else {
          if (+res.data === 3) {
            this.$modal.loading()
            this.getOrderRes(34, params)
          } else {
            this.$modal.msgError(statusList[+res.data])
            this.getDeviceSet()
          }
        }
      })
    },
    confirmSetDevice(type) {
      let message = +type === 23 ? 'Please confirm whether to clear the record' : 'Please confirm whether to restore factory settings'
      this.$modal.confirm(message).then(() => {
        return this.setDevice(type)
      })
    },
    setDevice(type) {
      if (copyDeviceInfo[type] === this.deviceBase[type]) {
        if (![22, 23, 101].includes(+type)) return this.$modal.confirm('Value not changed')
      }
      let data = {
        siteCode: this.siteCode,
        type,
        baseParam: this.deviceBase[type]
      }
      let arr = [13, 21, 25, 31, 38]
      if (arr.includes(+type)) {
        if (type === 13) data.baseParam = this.deviceBase[type] ? 0 : 1
        else data.baseParam = this.deviceBase[type] ? 1 : 0
      }
      if(type === 101) {
        const specialParams = {
          isAble: this.remoteSwitchIsAble,
          isArmtwisting: this.isArmtwisting,
          powerOffTime: '',
          powerOnTime: '',
          type: this.remoteSwitchType
        }
        if (this.remoteSwitchType === 2) {
          specialParams.powerOffTime = this.dailyOff
          specialParams.powerOnTime = this.dailyOn
        }
        if (this.remoteSwitchType === 3) {
          let timeOn = this.dateOn.split(' ')
          let timeOff = this.dateOff.split(' ')
          specialParams.powerOnTime = timeOn[0].split('-').join(':') + ':' + timeOn[1]
          specialParams.powerOffTime = timeOff[0].split('-').join(':') + ':' + timeOff[1]
        }
        data.baseParam = JSON.stringify(specialParams)
      }
      deviceSet(data).then(res => {
        if ([1002, 10030, 10031, 10032, 10033].includes(+res.code)) {
          this.$modal.msgError(res.msg)
          this.getDeviceSet()
          this.$modal.closeLoading()
        } else {
          if (+res.data === 3) {
            this.$modal.loading()
            this.getOrderRes(type, data)
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
        let arr = [13, 21, 25, 31, 38]
        res.data.forEach(i => {
          if (arr.includes(+i.type)) {
            if(i.type === 13) item[+i.type] = +i.param !== 1
            else item[+i.type] = +i.param === 1
          } else item[i.type] = i.param
        })
        this.deviceBase = item
        if (this.deviceBase[34]) {
          let timeList = JSON.parse(this.deviceBase[34])
          timeList.forEach((i, index) => {
            this.peakShaving[`chargeS${index+1}`] = i.chargeStartTime
            this.peakShaving[`chargeE${index+1}`] = i.chargeEndTime
            this.peakShaving[`dischargeS${index+1}`] = i.dischargeStartTime
            this.peakShaving[`dischargeE${index+1}`] = i.dischargeEndTime
          })
        }
        if (this.deviceBase[101]) {
          const remoteSwitch = JSON.parse(this.deviceBase[101])
          this.remoteSwitchIsAble = remoteSwitch.isAble
          this.isArmtwisting = remoteSwitch.isArmtwisting
          this.remoteSwitchType = remoteSwitch.type
          if (+this.remoteSwitchType === 3) {
            if (remoteSwitch.powerOnTime) {
              const dateOnList = remoteSwitch.powerOnTime?.split(':')
              this.dateOn = dateOnList.slice(0, 3).join('-') + ' ' + dateOnList[3]
            }
            if (remoteSwitch.powerOffTime) {
              const dateOffList = remoteSwitch.powerOffTime?.split(':')
              this.dateOff = dateOffList.slice(0, 3).join('-') + ' ' + dateOffList[3]
            }
          }
          if (+this.remoteSwitchType === 2) {
            if (remoteSwitch.powerOnTime) this.dailyOn = remoteSwitch.powerOnTime
            if (remoteSwitch.powerOffTime) this.dailyOff = remoteSwitch.powerOffTime
          }
        }
        copyDeviceInfo = JSON.parse(JSON.stringify(this.deviceBase))
      })
    }
  }
}
</script>

<template>
  <div>
    <div v-if="+userType === 1" class="remote">
      <div class="set-part">
        <div class="set-type">{{ $t('site.systemSetting') }}</div>
        <el-form :model="deviceBase" label-position="top" :rules="rules" size="small" hide-required-asterisk>
          <el-row :gutter="16">
            <el-col :span="8">
              <el-form-item label="Work Mode" prop="0">
                <el-select v-model="deviceBase[0]" style="width: 60%">
                  <el-option v-for="(i, k) of workOption" :value="i.label" :label="i.label" :key="k"></el-option>
                </el-select>
                <el-button type="primary" plain style="margin-left: 10px" @click="setDevice(0)">Set</el-button>
              </el-form-item>
            </el-col>
          </el-row>
          <div class="peak-box" v-if="deviceBase[0] === 'Peak Shaving'">
            <span>Peak Shaving</span>
            <el-button style="margin-left: 10px" type="primary" plain @click="setTimeList" size="small">Set</el-button>
            <el-row :gutter="12" style="margin-top: 12px">
              <el-col :span="8">
                <common-flex class="time-range" align="center">
                  <div class="time-range-label">Charging time1</div>
                  <common-flex class="time-range-picker" align="center">
                    <el-time-select size="small" v-model="peakShaving.chargeS1" :picker-options="{start: '00:00', step: '00:01', end: '24:00'}"></el-time-select>
                    <div>-</div>
                    <el-time-select size="small" v-model="peakShaving.chargeE1" :picker-options="{start: '00:00', step: '00:01', end: '24:00'}"></el-time-select>
                  </common-flex>
                </common-flex>
              </el-col>
              <el-col :span="8">
                <common-flex class="time-range" align="center">
                  <div class="time-range-label">Charging time2</div>
                  <common-flex class="time-range-picker" align="center">
                    <el-time-select size="small" v-model="peakShaving.chargeS2" :picker-options="{start: '00:00', step: '00:01', end: '24:00'}"></el-time-select>
                    <div>-</div>
                    <el-time-select size="small" v-model="peakShaving.chargeE2" :picker-options="{start: '00:00', step: '00:01', end: '24:00'}"></el-time-select>
                  </common-flex>
                </common-flex>
              </el-col>
              <el-col :span="8">
                <common-flex class="time-range" align="center">
                  <div class="time-range-label">Charging time3</div>
                  <common-flex class="time-range-picker" align="center">
                    <el-time-select size="small" v-model="peakShaving.chargeS3" :picker-options="{start: '00:00', step: '00:01', end: '24:00'}"></el-time-select>
                    <div>-</div>
                    <el-time-select size="small" v-model="peakShaving.chargeE3" :picker-options="{start: '00:00', step: '00:01', end: '24:00'}"></el-time-select>
                  </common-flex>
                </common-flex>
              </el-col>
            </el-row>
            <el-row :gutter="12" style="margin-top: 12px">
              <el-col :span="8">
                <common-flex class="time-range" align="center">
                  <div class="time-range-label">discharging time1</div>
                  <common-flex class="time-range-picker" align="center">
                    <el-time-select size="small" v-model="peakShaving.dischargeS1" :picker-options="{start: '00:00', step: '00:01', end: '24:00'}"></el-time-select>
                    <div>-</div>
                    <el-time-select size="small" v-model="peakShaving.dischargeE1" :picker-options="{start: '00:00', step: '00:01', end: '24:00'}"></el-time-select>
                  </common-flex>
                </common-flex>
              </el-col>
              <el-col :span="8">
                <common-flex class="time-range" align="center">
                  <div class="time-range-label">discharging time2</div>
                  <common-flex class="time-range-picker" align="center">
                    <el-time-select size="small" v-model="peakShaving.dischargeS2" :picker-options="{start: '00:00', step: '00:01', end: '24:00'}"></el-time-select>
                    <div>-</div>
                    <el-time-select size="small" v-model="peakShaving.dischargeE2" :picker-options="{start: '00:00', step: '00:01', end: '24:00'}"></el-time-select>
                  </common-flex>
                </common-flex>
              </el-col>
              <el-col :span="8">
                <common-flex class="time-range" align="center">
                  <div class="time-range-label">discharging time3</div>
                  <common-flex class="time-range-picker" align="center">
                    <el-time-select size="small" v-model="peakShaving.dischargeS3" :picker-options="{start: '00:00', step: '00:01', end: '24:00'}"></el-time-select>
                    <div>-</div>
                    <el-time-select size="small" v-model="peakShaving.dischargeE3" :picker-options="{start: '00:00', step: '00:01', end: '24:00'}"></el-time-select>
                  </common-flex>
                </common-flex>
              </el-col>
            </el-row>
          </div>
        </el-form>
      </div>
      <div class="set-part">
        <div class="set-type">{{ $t('device.batteryParameters') }}</div>
        <el-form :model="deviceBase" label-position="top" :rules="rules" size="small" hide-required-asterisk>
          <el-row :gutter="16">
            <el-col :span="8">
              <el-form-item prop="1" label="Battery grid DOD(%)">
                <el-input style="width: 60%" @blur="inputVerify(0, 100, 1)" v-model.trim="deviceBase[1]" placeholder="[10,90]"></el-input>
                <el-button type="primary" plain style="margin-left: 10px" :disabled="!deviceBase[1]" @click="setDevice(1)">Set</el-button>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item prop="30" label="Battery Off-grid DOD(%)">
                <el-input style="width: 60%" @blur="inputVerify(0, 100, 30)" v-model.trim="deviceBase[30]" placeholder="[10,90]"></el-input>
                <el-button type="primary" plain style="margin-left: 10px" :disabled="!deviceBase[30]" @click="setDevice(30)">Set</el-button>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </div>
    </div>
    <div v-else class="remote">
      <div class="set-part">
        <div class="set-type">{{ $t('device.systemSetting') }}</div>
        <el-form :model="deviceBase" label-position="top" :rules="rules" size="small" hide-required-asterisk>
          <el-row :gutter="20">
            <el-col :span="8">
              <el-form-item label="Work Mode" prop="0">
                <el-select v-model="deviceBase[0]" style="width: 60%">
                  <el-option v-for="(i, k) of workOption" :value="i.label" :label="i.label" :key="k"></el-option>
                </el-select>
                <el-button type="primary" plain style="margin-left: 10px" @click="setDevice(0)">Set</el-button>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="PV input type" prop="14">
                <el-select v-model="deviceBase[14]" style="width: 60%">
                  <el-option v-for="(i, k) of pvTypeOption" :value="i.label" :label="i.label" :key="k"></el-option>
                </el-select>
                <el-button type="primary" plain style="margin-left: 10px" @click="setDevice(14)">Set</el-button>
              </el-form-item>
            </el-col>
          </el-row>
          <div class="peak-box" v-if="deviceBase[0] === 'Peak Shaving'">
            <span>Peak Shaving</span>
            <el-button style="margin-left: 10px" type="primary" plain @click="setTimeList" size="small">Set</el-button>
            <el-row :gutter="12" style="margin-top: 12px">
              <el-col :span="8">
                <common-flex class="time-range" align="center">
                  <div class="time-range-label">Charging time1</div>
                  <common-flex class="time-range-picker" align="center">
                    <el-time-select size="small" v-model="peakShaving.chargeS1" :picker-options="{start: '00:00', step: '00:01', end: '24:00'}"></el-time-select>
                    <div>-</div>
                    <el-time-select size="small" v-model="peakShaving.chargeE1" :picker-options="{start: '00:00', step: '00:01', end: '24:00'}"></el-time-select>
                  </common-flex>
                </common-flex>
              </el-col>
              <el-col :span="8">
                <common-flex class="time-range" align="center">
                  <div class="time-range-label">Charging time2</div>
                  <common-flex class="time-range-picker" align="center">
                    <el-time-select size="small" v-model="peakShaving.chargeS2" :picker-options="{start: '00:00', step: '00:01', end: '24:00'}"></el-time-select>
                    <div>-</div>
                    <el-time-select size="small" v-model="peakShaving.chargeE2" :picker-options="{start: '00:00', step: '00:01', end: '24:00'}"></el-time-select>
                  </common-flex>
                </common-flex>
              </el-col>
              <el-col :span="8">
                <common-flex class="time-range" align="center">
                  <div class="time-range-label">Charging time3</div>
                  <common-flex class="time-range-picker" align="center">
                    <el-time-select size="small" v-model="peakShaving.chargeS3" :picker-options="{start: '00:00', step: '00:01', end: '24:00'}"></el-time-select>
                    <div>-</div>
                    <el-time-select size="small" v-model="peakShaving.chargeE3" :picker-options="{start: '00:00', step: '00:01', end: '24:00'}"></el-time-select>
                  </common-flex>
                </common-flex>
              </el-col>
            </el-row>
            <el-row :gutter="12" style="margin-top: 12px">
              <el-col :span="8">
                <common-flex class="time-range" align="center">
                  <div class="time-range-label">discharging time1</div>
                  <common-flex class="time-range-picker" align="center">
                    <el-time-select size="small" v-model="peakShaving.dischargeS1" :picker-options="{start: '00:00', step: '00:01', end: '24:00'}"></el-time-select>
                    <div>-</div>
                    <el-time-select size="small" v-model="peakShaving.dischargeE1" :picker-options="{start: '00:00', step: '00:01', end: '24:00'}"></el-time-select>
                  </common-flex>
                </common-flex>
              </el-col>
              <el-col :span="8">
                <common-flex class="time-range" align="center">
                  <div class="time-range-label">discharging time2</div>
                  <common-flex class="time-range-picker" align="center">
                    <el-time-select size="small" v-model="peakShaving.dischargeS2" :picker-options="{start: '00:00', step: '00:01', end: '24:00'}"></el-time-select>
                    <div>-</div>
                    <el-time-select size="small" v-model="peakShaving.dischargeE2" :picker-options="{start: '00:00', step: '00:01', end: '24:00'}"></el-time-select>
                  </common-flex>
                </common-flex>
              </el-col>
              <el-col :span="8">
                <common-flex class="time-range" align="center">
                  <div class="time-range-label">discharging time3</div>
                  <common-flex class="time-range-picker" align="center">
                    <el-time-select size="small" v-model="peakShaving.dischargeS3" :picker-options="{start: '00:00', step: '00:01', end: '24:00'}"></el-time-select>
                    <div>-</div>
                    <el-time-select size="small" v-model="peakShaving.dischargeE3" :picker-options="{start: '00:00', step: '00:01', end: '24:00'}"></el-time-select>
                  </common-flex>
                </common-flex>
              </el-col>
            </el-row>
          </div>
          <el-row :gutter="20">
            <el-col :span="4">
              <el-form-item prop="21" label="Backup Enable"><el-switch v-model="deviceBase[21]" @change="setDevice(21)" /></el-form-item>
            </el-col>
            <el-col :span="4">
              <el-form-item prop="25" label="Battery awaken"><el-switch v-model="deviceBase[25]" @change="setDevice(25)" /></el-form-item>
            </el-col>
            <el-col :span="4">
              <el-form-item prop="13" label="Grid Sell">
                <common-flex slot="label">
                  <span>Grid Sell</span>
                  <el-tooltip effect="dark" placement="top">
                          <span slot="content">
                            Enable Anti reflux/Disable Grid Sell: indicates that electricity sales are not allowed
                          </span>
                    <img class="question" :src="require('@img/question.svg')" alt="">
                  </el-tooltip>
                </common-flex>
                <el-switch v-model="deviceBase[13]" @change="setDevice(13)" />
              </el-form-item>
            </el-col>
            <el-col :span="4">
              <el-form-item prop="31" label="ARC enable"><el-switch v-model="deviceBase[31]" @change="setDevice(31)" /></el-form-item>
            </el-col>
            <el-col :span="4">
              <el-form-item prop="38" label="On/off enable"><el-switch v-model="deviceBase[38]" @change="setDevice(38)" /></el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </div>
      <div class="set-part">
        <div class="set-type">{{ $t('device.batteryParameters') }}</div>
        <el-form :model="deviceBase" label-position="top" :rules="rules" size="small" hide-required-asterisk>
          <el-row :gutter="20">
            <el-col :span="8">
              <el-form-item prop="15" label="Battery type">
                <el-select v-model="deviceBase[15]" style="width: 60%">
                  <el-option v-for="(i, k) of batTypeOption" :value="i.label" :label="i.label" :key="k"></el-option>
                </el-select>
                <el-button type="primary" plain style="margin-left: 10px" @click="setDevice(15)">Set</el-button>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item prop="1" label="Battery grid DOD(%)">
                <el-input style="width: 60%" @blur="inputVerify(0, 100, 1)" v-model.trim="deviceBase[1]" placeholder="[10,90]"></el-input>
                <el-button type="primary" plain style="margin-left: 10px" :disabled="!deviceBase[1]" @click="setDevice(1)">Set</el-button>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item prop="30" label="Battery Off-grid DOD(%)">
                <el-input style="width: 60%" @blur="inputVerify(0, 100, 30)" v-model.trim="deviceBase[30]" placeholder="[10,90]"></el-input>
                <el-button type="primary" plain style="margin-left: 10px" :disabled="!deviceBase[30]" @click="setDevice(30)">Set</el-button>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="8">
              <el-form-item prop="24" label="Battery EodHyst(%)">
                <el-input style="width: 60%" @blur="inputVerify(10, 90, 24)" v-model.trim="deviceBase[24]" placeholder="[10,90]"></el-input>
                <el-button type="primary" plain style="margin-left: 10px" :disabled="!deviceBase[24]" @click="setDevice(24)">Set</el-button>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item prop="11" label="Battery communication type">
                <el-select v-model="deviceBase[11]" style="width: 60%">
                  <el-option v-for="(i, k) of batComuTypeOption" :value="i.label" :label="i.label" :key="k"></el-option>
                </el-select>
                <el-button type="primary" plain style="margin-left: 10px" @click="setDevice(11)">Set</el-button>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </div>
      <div class="set-part">
        <div class="set-type">{{ $t('device.operatingParameters') }}</div>
        <el-form :model="deviceBase" label-position="top" :rules="rules" size="small" hide-required-asterisk>
          <el-row :gutter="20">
            <el-col :span="8">
              <el-form-item prop="3" label="Grid Power(%)">
                <el-input @blur="inputVerify(0, 100, 3)" v-model.trim="deviceBase[3]" style="width: 60%" placeholder="[0,100]"></el-input>
                <el-button type="primary" plain style="margin-left: 10px" :disabled="!deviceBase[3]" @click="setDevice(3)">Set</el-button>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item prop="4" label="Battery discharge power(%)">
                <el-input @blur="inputVerify(0, 100, 4)" v-model.trim="deviceBase[4]" style="width: 60%" placeholder="[0,100]"></el-input>
                <el-button type="primary" plain style="margin-left: 10px" :disabled="!deviceBase[4]" @click="setDevice(4)">Set</el-button>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item prop="17" label="PV Power(%)">
                <el-input @blur="inputVerify(0, 100, 17)" v-model.trim="deviceBase[17]" style="width: 60%" placeholder="[0,100]"></el-input>
                <el-button type="primary" plain style="margin-left: 10px" :disabled="!deviceBase[17]" @click="setDevice(17)">Set</el-button>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="8">
              <el-form-item prop="7" label="Grid Voltage low(V)">
                <el-input @blur="inputVerify(150, 220, 7)" v-model.trim="deviceBase[7]" type="primary" plain style="width: 60%" placeholder="[150,220]"></el-input>
                <el-button type="primary" plain style="margin-left: 10px" :disabled="!deviceBase[7]" @click="setDevice(7)">Set</el-button>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item prop="8" label="Grid Voltage high(V)">
                <el-input @blur="inputVerify(240, 280, 8)" v-model.trim="deviceBase[8]" type="primary" plain style="width: 60%" placeholder="[240,280]"></el-input>
                <el-button type="primary" plain style="margin-left: 10px" :disabled="!deviceBase[8]" @click="setDevice(8)">Set</el-button>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item prop="26" label="Reactive Type">
                <el-select v-model="deviceBase[26]" style="width: 60%">
                  <el-option v-for="(i, k) of reactiveTypeOption" :value="i.value" :label="i.label" :key="k"></el-option>
                </el-select>
                <el-button type="primary" plain style="margin-left: 10px" @click="setDevice(26)">Set</el-button>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="8">
              <el-form-item prop="5" label="Power Factor(%)">
                <el-input @blur="inputVerify(-99, 100, 5)" v-model.trim="deviceBase[5]" type="primary" plain style="width: 60%" placeholder="[-99,100]"></el-input>
                <el-button type="primary" plain style="margin-left: 10px" :disabled="!deviceBase[5]" @click="setDevice(5)">Set</el-button>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item prop="6" label="Reactive Power(%)">
                <el-input @blur="inputVerify(-65, 65, 6)" v-model.trim="deviceBase[6]" type="primary" plain style="width: 60%" placeholder="[-65,65]"></el-input>
                <el-button type="primary" plain style="margin-left: 10px" :disabled="!deviceBase[6]" @click="setDevice(6)">Set</el-button>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item prop="40" label="Grid Function">
                <el-select v-model="deviceBase[40]" style="width: 60%">
                  <el-option v-for="(i, k) of gridFunctionOption" :value="i.value" :label="i.label" :key="k"></el-option>
                </el-select>
                <el-button type="primary" plain style="margin-left: 10px" @click="setDevice(40)">Set</el-button>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </div>
      <div class="set-part">
        <div class="set-type">Remote switch Settings</div>
        <el-form :model="deviceBase" label-position="top" :rules="rules" size="small" hide-required-asterisk>
          <el-row :gutter="20">
            <el-col :span="8">
              <el-form-item label="Remote switch Settings Enabled">
                <el-select v-model="remoteSwitchIsAble" style="width: 60%">
                  <el-option v-for="(i, k) of remoteSwitchOptions" :value="i.value" :label="i.label" :key="k"></el-option>
                </el-select>
                <el-button v-if="+remoteSwitchIsAble === 0" type="primary" plain style="margin-left: 10px" @click="setDevice(101)">Set</el-button>
              </el-form-item>
            </el-col>
            <el-col :span="8" v-if="+remoteSwitchIsAble === 1">
              <el-form-item label="Remote switch Settings Type">
                <el-select v-model="remoteSwitchType" style="width: 60%">
                  <el-option v-for="(i, k) of remoteSwitchTypeOptions" :value="i.value" :label="i.label" :key="k"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="8" v-if="+remoteSwitchIsAble === 1 && +remoteSwitchType === 1">
              <el-form-item label="Remote switch Settings Params">
                <el-select v-model="isArmtwisting" style="width: 60%">
                  <el-option v-for="(i, k) of remoteSwitchTypeOneOptions" :value="i.value" :label="i.label" :key="k"></el-option>
                </el-select>
                <el-button type="primary" plain style="margin-left: 10px" @click="setDevice(101)" :disabled="!isArmtwisting">Set</el-button>
              </el-form-item>
            </el-col>
            <el-col :span="8" v-if="+remoteSwitchIsAble === 1 && +remoteSwitchType === 2">
              <el-form-item label="Remote switch Settings Params">
                <el-time-picker v-model="dailyOn"
                                style="width: 160px"
                                size="small"
                                value-format="H:m"
                                format="H:m"
                                :placeholder="$t('site.setting.onTime')">
                </el-time-picker>
                <el-time-picker v-model="dailyOff"
                                size="small"
                                style="width: 160px"
                                format="H:m"
                                value-format="H:m"
                                :placeholder="$t('site.setting.offTime')">
                </el-time-picker>
                <el-button type="primary" plain style="margin-left: 10px" @click="setDevice(101)" :disabled="!(dailyOff && dailyOn)">Set</el-button>
              </el-form-item>
            </el-col>
            <el-col :span="8" v-if="+remoteSwitchIsAble === 1 && +remoteSwitchType === 3">
              <el-form-item label="Remote switch Settings Params">
                <el-date-picker
                  v-model="dateOn"
                  size="small"
                  style="width: 160px"
                  type="datetime"
                  format="yyyy-MM-dd HH"
                  value-format="yyyy-M-d H"
                  placeholder="选择开机日期">
                </el-date-picker>
                <el-date-picker
                  size="small"
                  style="width: 160px"
                  v-model="dateOff"
                  type="datetime"
                  format="yyyy-MM-dd HH"
                  value-format="yyyy-M-d H"
                  placeholder="选择关机日期">
                </el-date-picker>
                <el-button type="primary" plain style="margin-left: 10px" @click="setDevice(101)" :disabled="!(dateOff && dateOn)">Set</el-button>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </div>
      <div class="set-part">
        <div class="set-type">{{ $t('device.gridStandard') }}</div>
        <el-form :model="deviceBase" label-position="top" :rules="rules" size="small" hide-required-asterisk>
          <el-row :gutter="20">
            <el-col :span="8">
              <el-form-item prop="37" label="Grid Set">
                <el-select v-model="deviceBase[37]" style="width: 60%">
                  <el-option v-for="(i, k) of gridSetOptions" :value="i.value" :label="i.label" :key="k"></el-option>
                </el-select>
                <el-button type="primary" plain style="margin-left: 10px" @click="setDevice(37)">Set</el-button>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item prop="19" label="Grid Standard">
                <el-select v-model="deviceBase[19]" style="width: 60%">
                  <el-option v-for="(i, k) of gridOption" :value="i.label" :label="i.label" :key="k"></el-option>
                </el-select>
                <el-button type="primary" plain style="margin-left: 10px" @click="setDevice(19)">Set</el-button>
              </el-form-item>
            </el-col>
            <el-col :span="8" v-if="deviceBase[19] === 'The United States'">
              <el-form-item prop="39" label="US Grid Class">
                <el-select v-model="deviceBase[39]" style="width: 60%">
                  <el-option v-for="(i, k) of usGridClassOptions" :value="i.value" :label="i.label" :key="k"></el-option>
                </el-select>
                <el-button type="primary" plain style="margin-left: 10px" @click="setDevice(39)">Set</el-button>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </div>
      <div class="set-part">
        <div class="set-type">{{ $t('device.clearRecord') }}</div>
        <el-form>
          <el-form-item label="Clear record">
            <el-button size="small" type="primary" plain style="margin-left: 10px" @click="confirmSetDevice(23)">Set</el-button>
          </el-form-item>
        </el-form>
      </div>
      <div class="set-part">
        <div class="set-type">{{ $t('device.restoreFactorySetting') }}</div>
        <el-form>
          <el-form-item label="Restore Factory Setting"><el-button size="small" type="primary" plain style="margin-left: 10px" @click="confirmSetDevice(22)">Set</el-button></el-form-item>
        </el-form>
      </div>
    </div>
  </div>
</template>

<style lang="scss">
.peak-box {
  padding: 16px 0 24px 10px;
  border: 1px solid #D8DCE6;
  border-radius: 2px;
  .time-range {
    &-label {
      margin-right: 10px;
      text-align: right;
      width: 100px;
      @include nFont(12 #828282)
    }
    &-picker {
      border: 1px solid #dcdfe6;
      border-radius: 4px;
    }
    .el-input__prefix {
      display: none;
    }
    .el-date-editor.el-input {
      width: 100px;
    }
    .el-input {
      width: 80px !important;
      @media screen and (max-width: 1334px) {
        width: 50px !important;
      }
    }
    .el-input__inner {
      width: 80px;
      border: none !important;
      padding: 0 14px;
      @media screen and (max-width: 1334px) {
        width: 50px !important;
        padding: 0 5px;
        font-size: 12px;
      }
    }
  }
}
</style>

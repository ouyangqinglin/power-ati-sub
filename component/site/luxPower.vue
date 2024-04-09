<script>
import inverterMixin from "@sub/utils/inverterMixin";
import {deviceSet, getSettingInfo} from "@/api/device";
let copyDeviceInfo = {}
let statusList = ['NO_RESPONSE', 'SUCCESS', 'ERROR', 'EXECUTING', 'NOT_ONLINE', 'UN_EXIST_FILE', 'SUBMIT_SUCCESS', 'NO_MATCH']

export default {
  name: "luxPower",
  mixins: [inverterMixin],
  data() {
    return {
      rules: {},
      activeChargeSet: '1',
      activeDischargeSet: '1',
      langOptions: [
        {
          label: 'English',
          value: 0
        },
        {
          label: 'German',
          value: 1
        },
      ],
      pvInputModeOptions: [
        {
          label: 'two separate PVs',
          value: 0
        },
        {
          label: 'No PV plug in',
          value: 1
        },
        {
          label: 'PV1 plug in',
          value: 2
        },
        {
          label: 'PV2 plug in',
          value: 3
        },
        {
          label: 'two PVs in parallel',
          value: 4
        },
      ],
      ctSampleRatioOptions: [
        {
          label: '1/1000',
          value: 1
        },
        {
          label: '1/3000',
          value: 2
        },
      ],
      epsFrequencyOptions: [
        {
          label: '50',
          value: 1
        },
        {
          label: '60',
          value: 2
        },
      ],
      systemTypeOptions: [
        {
          label: '1 Phase Primary',
          value: 1
        },
        {
          label: 'Subordinates',
          value: 2
        },
        {
          label: '3 Phase Primary',
          value: 3
        },
      ],
      composedPhaseOptions: [
        {
          label: 'R',
          value: 1
        },
        {
          label: 's',
          value: 2
        },
        {
          label: 't',
          value: 3
        },
      ],
      gridRegulationOptions: [
        {
          label: 'UL1741&IEEE1547',
          value: 1
        },
        {
          label: 'HECO',
          value: 2
        },
        {
          label: 'USA(rule21)',
          value: 3
        },
        {
          label: 'South Africa',
          value: 4
        },
        {
          label: 'General',
          value: 5
        },
        {
          label: 'PR-LUMA',
          value: 6
        },
        {
          label: 'KIUC',
          value: 7
        },
        {
          label: 'G99',
          value: 8
        },
        {
          label: 'G98',
          value: 9
        },
      ],
      gridTypeOptions: [
        {
          label: '240V/120V',
          value: 1
        },
        {
          label: '208V/120V',
          value: 2
        },
        {
          label: '240V',
          value: 3
        },
        {
          label: '230V',
          value: 4
        },
        {
          label: '200V/100V',
          value: 5
        },
      ],
      battChargeControlOptions: [
        {
          label: 'SOC',
          value: 1
        },
        {
          label: 'Volt',
          value: 2
        },
      ],
    }
  },
  methods: {
    confirmSetDevice(type) {
      let message = 'Please confirm whether to restore default values'
      this.$modal.confirm(message).then(() => {
        return this.setDevice(type)
      })
    },
    inputVerify(min, max, type) {
      for(let key in this.rules) {
        this.rules[key][0].required = false
        this.rules[key][0].message = ''
      }
      if (!this.moreOneDot(+this.deviceBase[type])) {
        this.deviceBase[type] = ''
        this.rules[+type][0].message = 'Please enter a number of up to one decimal place'
        this.rules[+type][0].required = true
      } else if (+this.deviceBase[type] > max || +this.deviceBase[type] < min) {
        this.deviceBase[type] = ''
        this.rules[+type][0].message = `Please enter the number in [${min}.0, ${max}.0]`
        this.rules[+type][0].required = true
      } else {
        this.rules[+type][0].required = false
        this.rules[+type][0].message = ''
      }
      this.rules = {...this.rules}
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
          this.$modal.closeLoading()
        } else {
          if (+res.data === 3) {
            this.$modal.loading()
            this.getOrderRes(type)
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
          if (i.param !== null && typeof i.param !== 'undefined') {
            item[i.type] = +i.param
          } else item[i.type] = ''
        })
        this.deviceBase = item
        console.log(this.deviceBase)
        copyDeviceInfo = JSON.parse(JSON.stringify(this.deviceBase))
      })
    },
  }
}
</script>

<template>
<div class="remote">
  <div class="set-part">
    <div class="set-type">{{ $t('device.commonSetting') }}</div>
    <el-form label-position="top" :model="deviceBase" :rules="rules" size="small" hide-required-asterisk>
      <el-row :gutter="16">
        <el-col :span="8">
          <el-form-item label="MODBUS Addr" prop="1111">
            <el-input @blur="inputVerify(0, 150, 1111)" v-model="deviceBase[1111]" style="width: 60%" placeholder="[0, 150]"></el-input>
            <el-button :disabled="!deviceBase[1111]" type="primary" plain class="ml10" @click="setDevice(1111)">Set</el-button>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="Language Set" prop="1111">
            <el-select v-model="deviceBase[1111]" style="width: 60%">
              <el-option v-for="(i, k) of langOptions" :value="i.label" :label="i.label" :key="k"></el-option>
            </el-select>
            <el-button :disabled="!deviceBase[1111]" type="primary" plain class="ml10" @click="setDevice(1111)">Set</el-button>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="PV Input Mode" prop="1111">
            <el-select v-model="deviceBase[1111]" style="width: 60%">
              <el-option v-for="(i, k) of pvInputModeOptions" :value="i.label" :label="i.label" :key="k"></el-option>
            </el-select>
            <el-button :disabled="!deviceBase[1111]" type="primary" plain class="ml10" @click="setDevice(1111)">Set</el-button>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="16">
        <el-col :span="8">
          <el-form-item label="Start PV Volt(V)" prop="1111">
            <el-input @blur="inputVerify(90, 500, 1111)" v-model="deviceBase[1111]" style="width: 60%" placeholder="[90, 500]"></el-input>
            <el-button :disabled="!deviceBase[1111]" type="primary" plain class="ml10" @click="setDevice(1111)">Set</el-button>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="Neutral Detect Enable" prop="1111">
            <el-switch v-model="deviceBase[1111]" @change="setDevice(1111)" />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="CT Sample Ratio" prop="1111">
            <el-select v-model="deviceBase[1111]" style="width: 60%">
              <el-option v-for="(i, k) of ctSampleRatioOptions" :value="i.label" :label="i.label" :key="k"></el-option>
            </el-select>
            <el-button :disabled="!deviceBase[1111]" type="primary" plain class="ml10" @click="setDevice(1111)">Set</el-button>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
  </div>
  <div class="set-part">
    <div class="set-type">{{ $t('device.applicationSetting') }}</div>
    <el-form label-position="top" :model="deviceBase" :rules="rules" size="small" hide-required-asterisk>
      <el-row :gutter="16">
        <el-col :span="6">
          <el-form-item label="Power Backup" prop="1111">
            <el-switch v-model="deviceBase[1111]" @change="setDevice(1111)" />
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="Normal / Standby" prop="1111">
            <el-switch v-model="deviceBase[1111]" @change="setDevice(1111)" />
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="Fast Zero Export" prop="1111">
            <el-switch v-model="deviceBase[1111]" @change="setDevice(1111)" />
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="Grid Sell Back" prop="1111">
            <el-switch v-model="deviceBase[1111]" @change="setDevice(1111)" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="16">
        <el-col :span="6">
          <el-form-item label="Share Battery" prop="1111">
            <el-switch v-model="deviceBase[1111]" @change="setDevice(1111)" />
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="PV Arc" prop="1111">
            <el-switch v-model="deviceBase[1111]" @change="setDevice(1111)" />
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="Run Without Grid" prop="1111">
            <el-switch v-model="deviceBase[1111]" @change="setDevice(1111)" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="16">
        <el-col :span="8">
          <el-form-item label="EPS Frequency Set(Hz)" prop="1111">
            <el-select v-model="deviceBase[1111]" style="width: 60%">
              <el-option v-for="(i, k) of epsFrequencyOptions" :value="i.label" :label="i.label" :key="k"></el-option>
            </el-select>
            <el-button :disabled="!deviceBase[1111]" type="primary" plain class="ml10" @click="setDevice(1111)">Set</el-button>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="Grid Sell Back Power(%)" prop="1111">
            <el-input @blur="inputVerify(0, 100, 1111)" v-model="deviceBase[1111]" style="width: 60%" placeholder="[0, 100]"></el-input>
            <el-button :disabled="!deviceBase[1111]" type="primary" plain class="ml10" @click="setDevice(1111)">Set</el-button>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="Set System Type" prop="1111">
            <el-select v-model="deviceBase[1111]" style="width: 60%">
              <el-option v-for="(i, k) of systemTypeOptions" :value="i.label" :label="i.label" :key="k"></el-option>
            </el-select>
            <el-button :disabled="!deviceBase[1111]" type="primary" plain class="ml10" @click="setDevice(1111)">Set</el-button>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="16">
        <el-col :span="8">
          <el-form-item label="Set Composed Phase" prop="1111">
            <el-select v-model="deviceBase[1111]" style="width: 60%">
              <el-option v-for="(i, k) of composedPhaseOptions" :value="i.label" :label="i.label" :key="k"></el-option>
            </el-select>
            <el-button :disabled="!deviceBase[1111]" type="primary" plain class="ml10" @click="setDevice(1111)">Set</el-button>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="Max. AC Input Power" prop="1111">
            <el-input @blur="inputVerify(0, 6553.5, 1111)" v-model="deviceBase[1111]" style="width: 60%" placeholder="[0, 6553.5]"></el-input>
            <el-button :disabled="!deviceBase[1111]" type="primary" plain class="ml10" @click="setDevice(1111)">Set</el-button>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
  </div>
  <div class="set-part">
    <div class="set-type">{{ $t('device.gridConnectSetting') }}</div>
    <el-form label-position="top" :model="deviceBase" :rules="rules" size="small" hide-required-asterisk>
      <el-row :gutter="16">
        <el-col :span="8">
          <el-form-item label="Grid Regulation" prop="1111">
            <el-select v-model="deviceBase[1111]" style="width: 60%">
              <el-option v-for="(i, k) of gridRegulationOptions" :value="i.label" :label="i.label" :key="k"></el-option>
            </el-select>
            <el-button :disabled="!deviceBase[1111]" type="primary" plain class="ml10" @click="setDevice(1111)">Set</el-button>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="Grid Type" prop="1111">
            <el-select v-model="deviceBase[1111]" style="width: 60%">
              <el-option v-for="(i, k) of gridTypeOptions" :value="i.label" :label="i.label" :key="k"></el-option>
            </el-select>
            <el-button :disabled="!deviceBase[1111]" type="primary" plain class="ml10" @click="setDevice(1111)">Set</el-button>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
  </div>
  <div class="set-part">
    <div class="set-type">{{ $t('device.generatorChargeSetting') }}</div>
    <el-form label-position="top" :model="deviceBase" :rules="rules" size="small" hide-required-asterisk>
      <el-row :gutter="16">
        <el-col :span="8">
          <el-form-item label="Batt Charge Current Limit(A)" prop="1111">
            <el-input @blur="inputVerify(0, 250, 1111)" v-model="deviceBase[1111]" style="width: 60%" placeholder="[0, 250]"></el-input>
            <el-button :disabled="!deviceBase[1111]" type="primary" plain class="ml10" @click="setDevice(1111)">Set</el-button>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="Gen Rated Power(kW)" prop="1111">
            <el-input @blur="inputVerify(0, 25.5, 1111)" v-model="deviceBase[1111]" style="width: 60%" placeholder="[0, 25.5]"></el-input>
            <el-button :disabled="!deviceBase[1111]" type="primary" plain class="ml10" @click="setDevice(1111)">Set</el-button>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="Charge Start Volt(V)" prop="1111">
            <el-input @blur="inputVerify(40, 59, 1111)" v-model="deviceBase[1111]" style="width: 60%" placeholder="[40, 59]"></el-input>
            <el-button :disabled="!deviceBase[1111]" type="primary" plain class="ml10" @click="setDevice(1111)">Set</el-button>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="16">
        <el-col :span="8">
          <el-form-item label="Charge Start SOC(%)" prop="1111">
            <el-input @blur="inputVerify(0, 90, 1111)" v-model="deviceBase[1111]" style="width: 60%" placeholder="[0, 90]"></el-input>
            <el-button :disabled="!deviceBase[1111]" type="primary" plain class="ml10" @click="setDevice(1111)">Set</el-button>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="Charge End Volt(V)" prop="1111">
            <el-input @blur="inputVerify(40, 59, 1111)" v-model="deviceBase[1111]" style="width: 60%" placeholder="[40, 59]"></el-input>
            <el-button :disabled="!deviceBase[1111]" type="primary" plain class="ml10" @click="setDevice(1111)">Set</el-button>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="Charge End SOC(%)" prop="1111">
            <el-input @blur="inputVerify(20, 100, 1111)" v-model="deviceBase[1111]" style="width: 60%" placeholder="[20, 100]"></el-input>
            <el-button :disabled="!deviceBase[1111]" type="primary" plain class="ml10" @click="setDevice(1111)">Set</el-button>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
  </div>
  <div class="set-part">
    <div class="set-type">{{ $t('device.chargeSetting') }}</div>
    <el-form label-position="top" :model="deviceBase" :rules="rules" size="small" hide-required-asterisk>
      <el-row :gutter="16">
        <el-col :span="8">
          <el-form-item label="Batt Charge Control" prop="1111">
            <el-select v-model="deviceBase[1111]" style="width: 60%">
              <el-option v-for="(i, k) of battChargeControlOptions" :value="i.label" :label="i.label" :key="k"></el-option>
            </el-select>
            <el-button :disabled="!deviceBase[1111]" type="primary" plain class="ml10" @click="setDevice(1111)">Set</el-button>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="Charge Current Limit(A)" prop="1111">
            <el-input @blur="inputVerify(0, 250, 1111)" v-model="deviceBase[1111]" style="width: 60%" placeholder="[0, 250]"></el-input>
            <el-button :disabled="!deviceBase[1111]" type="primary" plain class="ml10" @click="setDevice(1111)">Set</el-button>
          </el-form-item>
        </el-col>
      </el-row>
      <el-radio-group v-model="activeChargeSet">
        <el-radio-button label="1">AC Charge</el-radio-button>
        <el-radio-button label="2">Charge First</el-radio-button>
      </el-radio-group>
      <div class="set-tab-container">
        <template v-if="+activeChargeSet === 1">
          <el-row>
            <el-col :span="8">
              <el-form-item label="Batt Charge Control" prop="1111">
                <el-switch v-model="deviceBase[1111]" @change="setDevice(1111)" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="8">
              <el-form-item label="AC Charge Power(kW)" prop="1111">
                <el-input @blur="inputVerify(0, 25.5, 1111)" v-model="deviceBase[1111]" style="width: 60%" placeholder="[0, 25.5]"></el-input>
                <el-button :disabled="!deviceBase[1111]" type="primary" plain class="ml10" @click="setDevice(1111)">Set</el-button>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="Stop AC Charge SOC(%)" prop="1111">
                <el-input @blur="inputVerify(0, 100, 1111)" v-model="deviceBase[1111]" style="width: 60%" placeholder="[0, 100]"></el-input>
                <el-button :disabled="!deviceBase[1111]" type="primary" plain class="ml10" @click="setDevice(1111)">Set</el-button>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="Stop AC Charge Volt(V)" prop="1111">
                <el-input @blur="inputVerify(48, 59, 1111)" v-model="deviceBase[1111]" style="width: 60%" placeholder="[48, 59]"></el-input>
                <el-button :disabled="!deviceBase[1111]" type="primary" plain class="ml10" @click="setDevice(1111)">Set</el-button>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="8">
              <el-form-item label="AC Charge Start Time 1" prop="1111">
                <el-input @blur="inputVerify(0, 23, 1111)" v-model="deviceBase[1111]" style="width: 29%" placeholder="[0, 23]"></el-input>
                <span class="colon">:</span>
                <el-input @blur="inputVerify(0, 59, 1111)" v-model="deviceBase[1111]" style="width: 29%" placeholder="[0, 59]"></el-input>
                <el-button :disabled="!deviceBase[1111]" type="primary" plain class="ml10" @click="setDevice(1111)">Set</el-button>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="AC Charge Start Time 2" prop="1111">
                <el-input @blur="inputVerify(0, 23, 1111)" v-model="deviceBase[1111]" style="width: 29%" placeholder="[0, 23]"></el-input>
                <span class="colon">:</span>
                <el-input @blur="inputVerify(0, 59, 1111)" v-model="deviceBase[1111]" style="width: 29%" placeholder="[0, 59]"></el-input>
                <el-button :disabled="!deviceBase[1111]" type="primary" plain class="ml10" @click="setDevice(1111)">Set</el-button>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="AC Charge Start Time 3" prop="1111">
                <el-input @blur="inputVerify(0, 23, 1111)" v-model="deviceBase[1111]" style="width: 29%" placeholder="[0, 23]"></el-input>
                <span class="colon">:</span>
                <el-input @blur="inputVerify(0, 59, 1111)" v-model="deviceBase[1111]" style="width: 29%" placeholder="[0, 59]"></el-input>
                <el-button :disabled="!deviceBase[1111]" type="primary" plain class="ml10" @click="setDevice(1111)">Set</el-button>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="8">
              <el-form-item label="AC Charge End Time 1" prop="1111">
                <el-input @blur="inputVerify(0, 23, 1111)" v-model="deviceBase[1111]" style="width: 29%" placeholder="[0, 23]"></el-input>
                <span class="colon">:</span>
                <el-input @blur="inputVerify(0, 59, 1111)" v-model="deviceBase[1111]" style="width: 29%" placeholder="[0, 59]"></el-input>
                <el-button :disabled="!deviceBase[1111]" type="primary" plain class="ml10" @click="setDevice(1111)">Set</el-button>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="AC Charge End Time 2" prop="1111">
                <el-input @blur="inputVerify(0, 23, 1111)" v-model="deviceBase[1111]" style="width: 29%" placeholder="[0, 23]"></el-input>
                <span class="colon">:</span>
                <el-input @blur="inputVerify(0, 59, 1111)" v-model="deviceBase[1111]" style="width: 29%" placeholder="[0, 59]"></el-input>
                <el-button :disabled="!deviceBase[1111]" type="primary" plain class="ml10" @click="setDevice(1111)">Set</el-button>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="AC Charge End Time 3" prop="1111">
                <el-input @blur="inputVerify(0, 23, 1111)" v-model="deviceBase[1111]" style="width: 29%" placeholder="[0, 23]"></el-input>
                <span class="colon">:</span>
                <el-input @blur="inputVerify(0, 59, 1111)" v-model="deviceBase[1111]" style="width: 29%" placeholder="[0, 59]"></el-input>
                <el-button :disabled="!deviceBase[1111]" type="primary" plain class="ml10" @click="setDevice(1111)">Set</el-button>
              </el-form-item>
            </el-col>
          </el-row>
        </template>
        <template v-else>
          <el-row>
            <el-col :span="8">
              <el-form-item label="Charge First(PV)" prop="1111">
                <el-switch v-model="deviceBase[1111]" @change="setDevice(1111)" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="8">
              <el-form-item label="Charge First Power(kW)" prop="1111">
                <el-input @blur="inputVerify(0, 25.5, 1111)" v-model="deviceBase[1111]" style="width: 60%" placeholder="[0, 25.5]"></el-input>
                <el-button :disabled="!deviceBase[1111]" type="primary" plain class="ml10" @click="setDevice(1111)">Set</el-button>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="Stop Charge First SOC(%) " prop="1111">
                <el-input @blur="inputVerify(0, 100, 1111)" v-model="deviceBase[1111]" style="width: 60%" placeholder="[0, 100]"></el-input>
                <el-button :disabled="!deviceBase[1111]" type="primary" plain class="ml10" @click="setDevice(1111)">Set</el-button>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="Stop Charge First Volt(V) " prop="1111">
                <el-input @blur="inputVerify(48, 59, 1111)" v-model="deviceBase[1111]" style="width: 60%" placeholder="[48, 59]"></el-input>
                <el-button :disabled="!deviceBase[1111]" type="primary" plain class="ml10" @click="setDevice(1111)">Set</el-button>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="8">
              <el-form-item label="Charge First Start Time 1" prop="1111">
                <el-input @blur="inputVerify(0, 23, 1111)" v-model="deviceBase[1111]" style="width: 29%" placeholder="[0, 23]"></el-input>
                <span class="colon">:</span>
                <el-input @blur="inputVerify(0, 59, 1111)" v-model="deviceBase[1111]" style="width: 29%" placeholder="[0, 59]"></el-input>
                <el-button :disabled="!deviceBase[1111]" type="primary" plain class="ml10" @click="setDevice(1111)">Set</el-button>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="Charge First Start Time 2" prop="1111">
                <el-input @blur="inputVerify(0, 23, 1111)" v-model="deviceBase[1111]" style="width: 29%" placeholder="[0, 23]"></el-input>
                <span class="colon">:</span>
                <el-input @blur="inputVerify(0, 59, 1111)" v-model="deviceBase[1111]" style="width: 29%" placeholder="[0, 59]"></el-input>
                <el-button :disabled="!deviceBase[1111]" type="primary" plain class="ml10" @click="setDevice(1111)">Set</el-button>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="Charge First Start Time 3" prop="1111">
                <el-input @blur="inputVerify(0, 23, 1111)" v-model="deviceBase[1111]" style="width: 29%" placeholder="[0, 23]"></el-input>
                <span class="colon">:</span>
                <el-input @blur="inputVerify(0, 59, 1111)" v-model="deviceBase[1111]" style="width: 29%" placeholder="[0, 59]"></el-input>
                <el-button :disabled="!deviceBase[1111]" type="primary" plain class="ml10" @click="setDevice(1111)">Set</el-button>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="8">
              <el-form-item label="Charge First End Time 1" prop="1111">
                <el-input @blur="inputVerify(0, 23, 1111)" v-model="deviceBase[1111]" style="width: 29%" placeholder="[0, 23]"></el-input>
                <span class="colon">:</span>
                <el-input @blur="inputVerify(0, 59, 1111)" v-model="deviceBase[1111]" style="width: 29%" placeholder="[0, 59]"></el-input>
                <el-button :disabled="!deviceBase[1111]" type="primary" plain class="ml10" @click="setDevice(1111)">Set</el-button>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="Charge First End Time 2" prop="1111">
                <el-input @blur="inputVerify(0, 23, 1111)" v-model="deviceBase[1111]" style="width: 29%" placeholder="[0, 23]"></el-input>
                <span class="colon">:</span>
                <el-input @blur="inputVerify(0, 59, 1111)" v-model="deviceBase[1111]" style="width: 29%" placeholder="[0, 59]"></el-input>
                <el-button :disabled="!deviceBase[1111]" type="primary" plain class="ml10" @click="setDevice(1111)">Set</el-button>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="Charge First End Time 3" prop="1111">
                <el-input @blur="inputVerify(0, 23, 1111)" v-model="deviceBase[1111]" style="width: 29%" placeholder="[0, 23]"></el-input>
                <span class="colon">:</span>
                <el-input @blur="inputVerify(0, 59, 1111)" v-model="deviceBase[1111]" style="width: 29%" placeholder="[0, 59]"></el-input>
                <el-button :disabled="!deviceBase[1111]" type="primary" plain class="ml10" @click="setDevice(1111)">Set</el-button>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="8">
              <el-form-item label="EqualVolt(V)" prop="1111">
                <el-input @blur="inputVerify(50, 59, 1111)" v-model="deviceBase[1111]" style="width: 60%" placeholder="[50, 59]"></el-input>
                <el-button :disabled="!deviceBase[1111]" type="primary" plain class="ml10" @click="setDevice(1111)">Set</el-button>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="FloatVolt(V)" prop="1111">
                <el-input @blur="inputVerify(50, 59, 1111)" v-model="deviceBase[1111]" style="width: 60%" placeholder="[50, 59]"></el-input>
                <el-button :disabled="!deviceBase[1111]" type="primary" plain class="ml10" @click="setDevice(1111)">Set</el-button>
              </el-form-item>
            </el-col>
          </el-row>
        </template>
      </div>
    </el-form>
  </div>
  <div class="set-part">
    <div class="set-type">{{ $t('device.dischargeSetting') }}</div>
    <el-form label-position="top" :model="deviceBase" :rules="rules" size="small" hide-required-asterisk>
      <el-row :span="16">
        <el-col :span="8">
          <el-form-item label="Batt Discharge Control" prop="1111">
            <el-select v-model="deviceBase[1111]" style="width: 60%">
              <el-option v-for="(i, k) of battChargeControlOptions" :value="i.label" :label="i.label" :key="k"></el-option>
            </el-select>
            <el-button :disabled="!deviceBase[1111]" type="primary" plain class="ml10" @click="setDevice(1111)">Set</el-button>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="Discharge Current Limit(A)" prop="1111">
            <el-input @blur="inputVerify(0, 250, 1111)" v-model="deviceBase[1111]" style="width: 60%" placeholder="[0, 250]"></el-input>
            <el-button :disabled="!deviceBase[1111]" type="primary" plain class="ml10" @click="setDevice(1111)">Set</el-button>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="On-Grid Cut-Off Volt(V)" prop="1111">
            <el-input @blur="inputVerify(40, 56, 1111)" v-model="deviceBase[1111]" style="width: 60%" placeholder="[40, 56]"></el-input>
            <el-button :disabled="!deviceBase[1111]" type="primary" plain class="ml10" @click="setDevice(1111)">Set</el-button>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :span="16">
        <el-col :span="8">
          <el-form-item label="On-Grid Cut-Off SOC(%) " prop="1111">
            <el-input @blur="inputVerify(0, 90, 1111)" v-model="deviceBase[1111]" style="width: 60%" placeholder="[0, 90]"></el-input>
            <el-button :disabled="!deviceBase[1111]" type="primary" plain class="ml10" @click="setDevice(1111)">Set</el-button>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="Off-Grid Cut-Off Volt(V)" prop="1111">
            <el-input @blur="inputVerify(40, 56, 1111)" v-model="deviceBase[1111]" style="width: 60%" placeholder="[40, 56]"></el-input>
            <el-button :disabled="!deviceBase[1111]" type="primary" plain class="ml10" @click="setDevice(1111)">Set</el-button>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="Off-Grid Cut-Off SOC(%)" prop="1111">
            <el-input @blur="inputVerify(0, 90, 1111)" v-model="deviceBase[1111]" style="width: 60%" placeholder="[0, 90]"></el-input>
            <el-button :disabled="!deviceBase[1111]" type="primary" plain class="ml10" @click="setDevice(1111)">Set</el-button>
          </el-form-item>
        </el-col>
      </el-row>
      <el-radio-group v-model="activeDischargeSet">
        <el-radio-button label="1">Forced Discharge</el-radio-button>
        <el-radio-button label="2">Peak Shaving</el-radio-button>
        <el-radio-button label="3">Smart Load</el-radio-button>
      </el-radio-group>
      <div class="set-tab-container">
        <template v-if="+activeDischargeSet === 1">
          <el-row>
            <el-col :span="8">
              <el-form-item label="Forced Discharge Enable" prop="1111">
                <el-switch v-model="deviceBase[1111]" @change="setDevice(1111)" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="8">
              <el-form-item label="Forced Discharge Power(kW)" prop="1111">
                <el-input @blur="inputVerify(0, 25.5, 1111)" v-model="deviceBase[1111]" style="width: 60%" placeholder="[0, 25.5]"></el-input>
                <el-button :disabled="!deviceBase[1111]" type="primary" plain class="ml10" @click="setDevice(1111)">Set</el-button>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="Stop Discharge Volt(V)" prop="1111">
                <el-input @blur="inputVerify(40, 56, 1111)" v-model="deviceBase[1111]" style="width: 60%" placeholder="[40, 56]"></el-input>
                <el-button :disabled="!deviceBase[1111]" type="primary" plain class="ml10" @click="setDevice(1111)">Set</el-button>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="Stop Discharge SOC(%)" prop="1111">
                <el-input @blur="inputVerify(0, 100, 1111)" v-model="deviceBase[1111]" style="width: 60%" placeholder="[0, 100]"></el-input>
                <el-button :disabled="!deviceBase[1111]" type="primary" plain class="ml10" @click="setDevice(1111)">Set</el-button>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="8">
              <el-form-item label="Forced Discharge Start Time 1" prop="1111">
                <el-input @blur="inputVerify(0, 23, 1111)" v-model="deviceBase[1111]" style="width: 29%" placeholder="[0, 23]"></el-input>
                <span class="colon">:</span>
                <el-input @blur="inputVerify(0, 59, 1111)" v-model="deviceBase[1111]" style="width: 29%" placeholder="[0, 59]"></el-input>
                <el-button :disabled="!deviceBase[1111]" type="primary" plain class="ml10" @click="setDevice(1111)">Set</el-button>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="Forced Discharge Start Time 2" prop="1111">
                <el-input @blur="inputVerify(0, 23, 1111)" v-model="deviceBase[1111]" style="width: 29%" placeholder="[0, 23]"></el-input>
                <span class="colon">:</span>
                <el-input @blur="inputVerify(0, 59, 1111)" v-model="deviceBase[1111]" style="width: 29%" placeholder="[0, 59]"></el-input>
                <el-button :disabled="!deviceBase[1111]" type="primary" plain class="ml10" @click="setDevice(1111)">Set</el-button>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="Forced Discharge Start Time 3" prop="1111">
                <el-input @blur="inputVerify(0, 23, 1111)" v-model="deviceBase[1111]" style="width: 29%" placeholder="[0, 23]"></el-input>
                <span class="colon">:</span>
                <el-input @blur="inputVerify(0, 59, 1111)" v-model="deviceBase[1111]" style="width: 29%" placeholder="[0, 59]"></el-input>
                <el-button :disabled="!deviceBase[1111]" type="primary" plain class="ml10" @click="setDevice(1111)">Set</el-button>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="8">
              <el-form-item label="Forced Discharge End Time 1" prop="1111">
                <el-input @blur="inputVerify(0, 23, 1111)" v-model="deviceBase[1111]" style="width: 29%" placeholder="[0, 23]"></el-input>
                <span class="colon">:</span>
                <el-input @blur="inputVerify(0, 59, 1111)" v-model="deviceBase[1111]" style="width: 29%" placeholder="[0, 59]"></el-input>
                <el-button :disabled="!deviceBase[1111]" type="primary" plain class="ml10" @click="setDevice(1111)">Set</el-button>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="Forced Discharge End Time 2" prop="1111">
                <el-input @blur="inputVerify(0, 23, 1111)" v-model="deviceBase[1111]" style="width: 29%" placeholder="[0, 23]"></el-input>
                <span class="colon">:</span>
                <el-input @blur="inputVerify(0, 59, 1111)" v-model="deviceBase[1111]" style="width: 29%" placeholder="[0, 59]"></el-input>
                <el-button :disabled="!deviceBase[1111]" type="primary" plain class="ml10" @click="setDevice(1111)">Set</el-button>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="Forced Discharge End Time 3" prop="1111">
                <el-input @blur="inputVerify(0, 23, 1111)" v-model="deviceBase[1111]" style="width: 29%" placeholder="[0, 23]"></el-input>
                <span class="colon">:</span>
                <el-input @blur="inputVerify(0, 59, 1111)" v-model="deviceBase[1111]" style="width: 29%" placeholder="[0, 59]"></el-input>
                <el-button :disabled="!deviceBase[1111]" type="primary" plain class="ml10" @click="setDevice(1111)">Set</el-button>
              </el-form-item>
            </el-col>
          </el-row>
        </template>
        <template v-else-if="+activeDischargeSet === 2">
          <el-row>
            <el-col :span="8">
              <el-form-item label="Grid Peak-Shaving" prop="1111">
                <el-switch v-model="deviceBase[1111]" @change="setDevice(1111)" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="8">
              <el-form-item label="Grid Peak-Shaving Power(kW)" prop="1111">
                <el-input @blur="inputVerify(0, 25.5, 1111)" v-model="deviceBase[1111]" style="width: 60%" placeholder="[0, 25.5]"></el-input>
                <el-button :disabled="!deviceBase[1111]" type="primary" plain class="ml10" @click="setDevice(1111)">Set</el-button>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="Start Peak-Shaving Volt 1(V)" prop="1111">
                <el-input @blur="inputVerify(40, 59, 1111)" v-model="deviceBase[1111]" style="width: 60%" placeholder="[40, 59]"></el-input>
                <el-button :disabled="!deviceBase[1111]" type="primary" plain class="ml10" @click="setDevice(1111)">Set</el-button>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="Start Peak-Shaving SOC 1(%)" prop="1111">
                <el-input @blur="inputVerify(0, 100, 1111)" v-model="deviceBase[1111]" style="width: 60%" placeholder="[0, 100]"></el-input>
                <el-button :disabled="!deviceBase[1111]" type="primary" plain class="ml10" @click="setDevice(1111)">Set</el-button>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="8">
              <el-form-item label="Start Peak-Shaving Volt 2(V)" prop="1111">
                <el-input @blur="inputVerify(40, 59, 1111)" v-model="deviceBase[1111]" style="width: 60%" placeholder="[40, 59]"></el-input>
                <el-button :disabled="!deviceBase[1111]" type="primary" plain class="ml10" @click="setDevice(1111)">Set</el-button>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="Start Peak-Shaving SOC 2(%) " prop="1111">
                <el-input @blur="inputVerify(0, 100, 1111)" v-model="deviceBase[1111]" style="width: 60%" placeholder="[0, 100]"></el-input>
                <el-button :disabled="!deviceBase[1111]" type="primary" plain class="ml10" @click="setDevice(1111)">Set</el-button>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="Peak Shaving Start Time 1" prop="1111">
                <el-input @blur="inputVerify(0, 23, 1111)" v-model="deviceBase[1111]" style="width: 29%" placeholder="[0, 23]"></el-input>
                <span class="colon">:</span>
                <el-input @blur="inputVerify(0, 59, 1111)" v-model="deviceBase[1111]" style="width: 29%" placeholder="[0, 59]"></el-input>
                <el-button :disabled="!deviceBase[1111]" type="primary" plain class="ml10" @click="setDevice(1111)">Set</el-button>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="8">
              <el-form-item label="Peak Shaving Start Time 2" prop="1111">
                <el-input @blur="inputVerify(0, 23, 1111)" v-model="deviceBase[1111]" style="width: 29%" placeholder="[0, 23]"></el-input>
                <span class="colon">:</span>
                <el-input @blur="inputVerify(0, 59, 1111)" v-model="deviceBase[1111]" style="width: 29%" placeholder="[0, 59]"></el-input>
                <el-button :disabled="!deviceBase[1111]" type="primary" plain class="ml10" @click="setDevice(1111)">Set</el-button>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="Peak Shaving End Time 1" prop="1111">
                <el-input @blur="inputVerify(0, 23, 1111)" v-model="deviceBase[1111]" style="width: 29%" placeholder="[0, 23]"></el-input>
                <span class="colon">:</span>
                <el-input @blur="inputVerify(0, 59, 1111)" v-model="deviceBase[1111]" style="width: 29%" placeholder="[0, 59]"></el-input>
                <el-button :disabled="!deviceBase[1111]" type="primary" plain class="ml10" @click="setDevice(1111)">Set</el-button>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="Peak Shaving End Time 2" prop="1111">
                <el-input @blur="inputVerify(0, 23, 1111)" v-model="deviceBase[1111]" style="width: 29%" placeholder="[0, 23]"></el-input>
                <span class="colon">:</span>
                <el-input @blur="inputVerify(0, 59, 1111)" v-model="deviceBase[1111]" style="width: 29%" placeholder="[0, 59]"></el-input>
                <el-button :disabled="!deviceBase[1111]" type="primary" plain class="ml10" @click="setDevice(1111)">Set</el-button>
              </el-form-item>
            </el-col>
          </el-row>
        </template>
        <template v-else>
          <el-row>
            <el-col :span="8">
              <el-form-item label="On Grid Always On" prop="1111">
                <el-switch v-model="deviceBase[1111]" @change="setDevice(1111)" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="8">
              <el-form-item label="Start PV Power(kW)" prop="1111">
                <el-input @blur="inputVerify(0, 25.5, 1111)" v-model="deviceBase[1111]" style="width: 60%" placeholder="[0, 25.5]"></el-input>
                <el-button :disabled="!deviceBase[1111]" type="primary" plain class="ml10" @click="setDevice(1111)">Set</el-button>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="Smart Load Start Volt(V)" prop="1111">
                <el-input @blur="inputVerify(40, 59, 1111)" v-model="deviceBase[1111]" style="width: 60%" placeholder="[40, 59]"></el-input>
                <el-button :disabled="!deviceBase[1111]" type="primary" plain class="ml10" @click="setDevice(1111)">Set</el-button>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="Smart Load Start SOC(%)" prop="1111">
                <el-input @blur="inputVerify(0, 100, 1111)" v-model="deviceBase[1111]" style="width: 60%" placeholder="[0, 100]"></el-input>
                <el-button :disabled="!deviceBase[1111]" type="primary" plain class="ml10" @click="setDevice(1111)">Set</el-button>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="8">
              <el-form-item label="Smart Load End Volt(V)" prop="1111">
                <el-input @blur="inputVerify(40, 59, 1111)" v-model="deviceBase[1111]" style="width: 60%" placeholder="[40, 59]"></el-input>
                <el-button :disabled="!deviceBase[1111]" type="primary" plain class="ml10" @click="setDevice(1111)">Set</el-button>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="Smart Load End SOC(%) " prop="1111">
                <el-input @blur="inputVerify(0, 100, 1111)" v-model="deviceBase[1111]" style="width: 60%" placeholder="[0, 100]"></el-input>
                <el-button :disabled="!deviceBase[1111]" type="primary" plain class="ml10" @click="setDevice(1111)">Set</el-button>
              </el-form-item>
            </el-col>
          </el-row>
        </template>
      </div>
    </el-form>
  </div>
  <div class="set-part">
    <div class="set-type">{{ $t('device.otherSetting') }}</div>
    <el-form>
      <el-row :gutter="16">
        <el-col :span="8">
          <el-form-item label="Restore Factory Setting">
            <el-button size="small" type="primary" plain style="margin-left: 10px" @click="confirmSetDevice(11111)">Set</el-button>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="ReverseCT">
            <el-switch v-model="deviceBase[1111]" @change="setDevice(1111)" />
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
  </div>
</div>
</template>

<style lang="scss">
.set-tab-container {
  padding: 16px;
  border: 1px solid #D8DCE6;
  .colon {
    margin: 0 4px;
    font-size: 14px;
    color: #000;
    font-weight: 600;
  }
}
</style>

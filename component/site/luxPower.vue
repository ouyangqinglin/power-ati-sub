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
          label: 'No PV plug in',
          value: 0
        },
        {
          label: 'PV1 plug in',
          value: 1
        },
        {
          label: 'PV2 plug in',
          value: 2
        },
        {
          label: 'two PVs in parallel',
          value: 3
        },
        {
          label: 'two separate PVs',
          value: 4
        },
      ],
      ctSampleRatioOptions: [
        {
          label: '1/1000',
          value: 0
        },
        {
          label: '1/3000',
          value: 1
        },
      ],
      epsFrequencyOptions: [
        {
          label: '50',
          value: 50
        },
        {
          label: '60',
          value: 60
        },
      ],
      systemTypeOptions: [
        {
          label: '1 Phase Primary',
          value: 0
        },
        {
          label: 'Subordinates',
          value: 1
        },
        {
          label: '3 Phase Primary',
          value: 2
        },
      ],
      composedPhaseOptions: [
        {
          label: 'R',
          value: 1
        },
        {
          label: 'S',
          value: 2
        },
        {
          label: 'T',
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
          value: 0
        },
        {
          label: 'Volt',
          value: 1
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
      let arrSwitch = [338, 340, 342, 343, 344, 347, 415, 416, 360, 370, 388, 398, 408, 414]
      if (arrSwitch.includes(+type)) {
        if (this.deviceBase[type]) data.baseParam = 1
        else data.baseParam = 0
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
    // 时间插入 : 符号
    insertSymbol(str) {
      const position = str.length - 2; // 从后面第2位
      let hourStr = str.slice(0, position)
      if (hourStr.length === 1) hourStr = '0' + hourStr // 给小时位置补0
      return hourStr + ':' + str.slice(position);
    },
    getDeviceSet() {
      getSettingInfo({ siteCode: this.siteCode }).then(res => {
        let item = {}
        let arrSwitch = [338, 340, 342, 343, 344, 347, 415, 416, 360, 370, 388, 398, 408, 414]
        let arrTime = [364, 365, 366, 367, 368, 369, 374, 375, 376, 377, 378, 379, 392, 393, 394, 395, 396, 397, 404, 405, 406, 407]
        res.data.forEach(i => {
          if (i.param !== null && typeof i.param !== 'undefined') {
            if (arrSwitch.includes(+i.type)) item[+i.type] = +i.param === 1
            else if (arrTime.includes(+i.type)) item[+i.type] = this.insertSymbol(i.param)
            else item[i.type] = +i.param
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
          <el-form-item label="MODBUS Addr" prop="334">
            <el-input @blur="inputVerify(0, 150, 334)" v-model="deviceBase[334]" style="width: 60%" placeholder="[0, 150]"></el-input>
            <el-button :disabled="!deviceBase[334]" type="primary" plain class="ml10" @click="setDevice(334)">Set</el-button>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="Language Set" prop="335">
            <el-select v-model="deviceBase[335]" style="width: 60%">
              <el-option v-for="(i, k) of langOptions" :value="i.value" :label="i.label" :key="k"></el-option>
            </el-select>
            <el-button type="primary" plain class="ml10" @click="setDevice(335)">Set</el-button>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="PV Input Mode" prop="336">
            <el-select v-model="deviceBase[336]" style="width: 60%">
              <el-option v-for="(i, k) of pvInputModeOptions" :value="i.value" :label="i.label" :key="k"></el-option>
            </el-select>
            <el-button type="primary" plain class="ml10" @click="setDevice(336)">Set</el-button>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="16">
        <el-col :span="8">
          <el-form-item label="Start PV Volt(V)" prop="337">
            <el-input @blur="inputVerify(90, 500, 337)" v-model="deviceBase[337]" style="width: 60%" placeholder="[90, 500]"></el-input>
            <el-button :disabled="!deviceBase[337]" type="primary" plain class="ml10" @click="setDevice(337)">Set</el-button>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="Neutral Detect Enable" prop="338">
            <el-switch v-model="deviceBase[338]" @change="setDevice(338)" />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="CT Sample Ratio" prop="339">
            <el-select v-model="deviceBase[339]" style="width: 60%">
              <el-option v-for="(i, k) of ctSampleRatioOptions" :value="i.value" :label="i.label" :key="k"></el-option>
            </el-select>
            <el-button type="primary" plain class="ml10" @click="setDevice(339)">Set</el-button>
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
          <el-form-item label="Power Backup" prop="340">
            <el-switch v-model="deviceBase[340]" @change="setDevice(340)" />
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="Normal / Standby" prop="342">
            <el-switch v-model="deviceBase[342]" @change="setDevice(342)" />
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="Fast Zero Export" prop="343">
            <el-switch v-model="deviceBase[343]" @change="setDevice(343)" />
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="Grid Sell Back" prop="344">
            <el-switch v-model="deviceBase[344]" @change="setDevice(344)" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="16">
        <el-col :span="6">
          <el-form-item label="Share Battery" prop="347">
            <el-switch v-model="deviceBase[347]" @change="setDevice(347)" />
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="PV Arc" prop="415">
            <el-switch v-model="deviceBase[415]" @change="setDevice(415)" />
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="Run Without Grid" prop="416">
            <el-switch v-model="deviceBase[416]" @change="setDevice(416)" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="16">
        <el-col :span="8">
          <el-form-item label="EPS Frequency Set(Hz)" prop="341">
            <el-select v-model="deviceBase[341]" style="width: 60%">
              <el-option v-for="(i, k) of epsFrequencyOptions" :value="i.value" :label="i.label" :key="k"></el-option>
            </el-select>
            <el-button :disabled="!deviceBase[341]" type="primary" plain class="ml10" @click="setDevice(341)">Set</el-button>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="Grid Sell Back Power(%)" prop="345">
            <el-input @blur="inputVerify(0, 100, 345)" v-model="deviceBase[345]" style="width: 60%" placeholder="[0, 100]"></el-input>
            <el-button :disabled="!deviceBase[345]" type="primary" plain class="ml10" @click="setDevice(345)">Set</el-button>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="Set System Type" prop="346">
            <el-select v-model="deviceBase[346]" style="width: 60%">
              <el-option v-for="(i, k) of systemTypeOptions" :value="i.value" :label="i.label" :key="k"></el-option>
            </el-select>
            <el-button type="primary" plain class="ml10" @click="setDevice(346)">Set</el-button>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="16">
        <el-col :span="8">
          <el-form-item label="Set Composed Phase" prop="348">
            <el-select v-model="deviceBase[348]" style="width: 60%">
              <el-option v-for="(i, k) of composedPhaseOptions" :value="i.value" :label="i.label" :key="k"></el-option>
            </el-select>
            <el-button :disabled="!deviceBase[348]" type="primary" plain class="ml10" @click="setDevice(348)">Set</el-button>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="Max. AC Input Power" prop="349">
            <el-input @blur="inputVerify(0, 6553.5, 349)" v-model="deviceBase[349]" style="width: 60%" placeholder="[0, 6553.5]"></el-input>
            <el-button :disabled="!deviceBase[349]" type="primary" plain class="ml10" @click="setDevice(349)">Set</el-button>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
  </div>
<!--  <div class="set-part">-->
<!--    <div class="set-type">{{ $t('device.gridConnectSetting') }}</div>-->
<!--    <el-form label-position="top" :model="deviceBase" :rules="rules" size="small" hide-required-asterisk>-->
<!--      <el-row :gutter="16">-->
<!--        <el-col :span="8">-->
<!--          <el-form-item label="Grid Regulation" prop="350">-->
<!--            <el-select v-model="deviceBase[350]" style="width: 60%">-->
<!--              <el-option v-for="(i, k) of gridRegulationOptions" :value="i.value" :label="i.label" :key="k"></el-option>-->
<!--            </el-select>-->
<!--            <el-button :disabled="!deviceBase[350]" type="primary" plain class="ml10" @click="setDevice(350)">Set</el-button>-->
<!--          </el-form-item>-->
<!--        </el-col>-->
<!--        <el-col :span="8">-->
<!--          <el-form-item label="Grid Type" prop="351">-->
<!--            <el-select v-model="deviceBase[351]" style="width: 60%">-->
<!--              <el-option v-for="(i, k) of gridTypeOptions" :value="i.value" :label="i.label" :key="k"></el-option>-->
<!--            </el-select>-->
<!--            <el-button :disabled="!deviceBase[351]" type="primary" plain class="ml10" @click="setDevice(351)">Set</el-button>-->
<!--          </el-form-item>-->
<!--        </el-col>-->
<!--      </el-row>-->
<!--    </el-form>-->
<!--  </div>-->
  <div class="set-part">
    <div class="set-type">{{ $t('device.generatorChargeSetting') }}</div>
    <el-form label-position="top" :model="deviceBase" :rules="rules" size="small" hide-required-asterisk>
      <el-row :gutter="16">
        <el-col :span="8">
          <el-form-item label="Batt Charge Current Limit(A)" prop="353">
            <el-input @blur="inputVerify(0, 250, 353)" v-model="deviceBase[353]" style="width: 60%" placeholder="[0, 250]"></el-input>
            <el-button :disabled="!deviceBase[353]" type="primary" plain class="ml10" @click="setDevice(353)">Set</el-button>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="Gen Rated Power(kW)" prop="353">
            <el-input @blur="inputVerify(0, 25.5, 353)" v-model="deviceBase[353]" style="width: 60%" placeholder="[0, 25.5]"></el-input>
            <el-button :disabled="!deviceBase[353]" type="primary" plain class="ml10" @click="setDevice(353)">Set</el-button>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="Charge Start Volt(V)" prop="354">
            <el-input @blur="inputVerify(40, 59, 354)" v-model="deviceBase[354]" style="width: 60%" placeholder="[40, 59]"></el-input>
            <el-button :disabled="!deviceBase[354]" type="primary" plain class="ml10" @click="setDevice(354)">Set</el-button>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="16">
        <el-col :span="8">
          <el-form-item label="Charge Start SOC(%)" prop="356">
            <el-input @blur="inputVerify(0, 90, 356)" v-model="deviceBase[356]" style="width: 60%" placeholder="[0, 90]"></el-input>
            <el-button :disabled="!deviceBase[356]" type="primary" plain class="ml10" @click="setDevice(356)">Set</el-button>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="Charge End Volt(V)" prop="355">
            <el-input @blur="inputVerify(40, 59, 355)" v-model="deviceBase[355]" style="width: 60%" placeholder="[40, 59]"></el-input>
            <el-button :disabled="!deviceBase[355]" type="primary" plain class="ml10" @click="setDevice(355)">Set</el-button>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="Charge End SOC(%)" prop="357">
            <el-input @blur="inputVerify(20, 100, 357)" v-model="deviceBase[357]" style="width: 60%" placeholder="[20, 100]"></el-input>
            <el-button :disabled="!deviceBase[357]" type="primary" plain class="ml10" @click="setDevice(357)">Set</el-button>
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
          <el-form-item label="Batt Charge Control" prop="359">
            <el-select v-model="deviceBase[359]" style="width: 60%">
              <el-option v-for="(i, k) of battChargeControlOptions" :value="i.value" :label="i.label" :key="k"></el-option>
            </el-select>
            <el-button type="primary" plain class="ml10" @click="setDevice(359)">Set</el-button>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="Charge Current Limit(A)" prop="358">
            <el-input @blur="inputVerify(0, 250, 358)" v-model="deviceBase[358]" style="width: 60%" placeholder="[0, 250]"></el-input>
            <el-button :disabled="!deviceBase[358]" type="primary" plain class="ml10" @click="setDevice(358)">Set</el-button>
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
              <el-form-item label="AC Charge Enable  AC" prop="360">
                <el-switch v-model="deviceBase[360]" @change="setDevice(360)" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="8">
              <el-form-item label="AC Charge Power(kW)" prop="361">
                <el-input @blur="inputVerify(0, 25.5, 361)" v-model="deviceBase[361]" style="width: 60%" placeholder="[0, 25.5]"></el-input>
                <el-button :disabled="!deviceBase[361]" type="primary" plain class="ml10" @click="setDevice(361)">Set</el-button>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="Stop AC Charge SOC(%)" prop="362">
                <el-input @blur="inputVerify(0, 100, 362)" v-model="deviceBase[362]" style="width: 60%" placeholder="[0, 100]"></el-input>
                <el-button :disabled="!deviceBase[362]" type="primary" plain class="ml10" @click="setDevice(362)">Set</el-button>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="Stop AC Charge Volt(V)" prop="363">
                <el-input @blur="inputVerify(48, 59, 363)" v-model="deviceBase[363]" style="width: 60%" placeholder="[48, 59]"></el-input>
                <el-button :disabled="!deviceBase[363]" type="primary" plain class="ml10" @click="setDevice(363)">Set</el-button>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="8">
              <el-form-item label="AC Charge Start Time 1" prop="364">
                <common-flex class="time-range-box" align="center">
                  <el-time-select size="small" style="width: 60%" v-model="deviceBase[364]" :picker-options="{start: '00:00', step: '00:01', end: '24:00'}"></el-time-select>
                  <el-button :disabled="!deviceBase[364]" type="primary" plain class="ml10" @click="setDevice(364)">Set</el-button>
                </common-flex>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="AC Charge Start Time 2" prop="366">
                <common-flex class="time-range-box" align="center">
                  <el-time-select size="small" style="width: 60%" v-model="deviceBase[366]" :picker-options="{start: '00:00', step: '00:01', end: '24:00'}"></el-time-select>
                  <el-button :disabled="!deviceBase[366]" type="primary" plain class="ml10" @click="setDevice(366)">Set</el-button>
                </common-flex>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="AC Charge Start Time 3" prop="368">
                <common-flex class="time-range-box" align="center">
                  <el-time-select size="small" style="width: 60%" v-model="deviceBase[368]" :picker-options="{start: '00:00', step: '00:01', end: '24:00'}"></el-time-select>
                  <el-button :disabled="!deviceBase[368]" type="primary" plain class="ml10" @click="setDevice(368)">Set</el-button>
                </common-flex>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="8">
              <el-form-item label="AC Charge End Time 1" prop="365">
                <common-flex class="time-range-box" align="center">
                  <el-time-select size="small" style="width: 60%" v-model="deviceBase[365]" :picker-options="{start: '00:00', step: '00:01', end: '24:00'}"></el-time-select>
                  <el-button :disabled="!deviceBase[365]" type="primary" plain class="ml10" @click="setDevice(365)">Set</el-button>
                </common-flex>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="AC Charge End Time 2" prop="367">
                <common-flex class="time-range-box" align="center">
                  <el-time-select size="small" style="width: 60%" v-model="deviceBase[367]" :picker-options="{start: '00:00', step: '00:01', end: '24:00'}"></el-time-select>
                  <el-button :disabled="!deviceBase[367]" type="primary" plain class="ml10" @click="setDevice(367)">Set</el-button>
                </common-flex>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="AC Charge End Time 3" prop="369">
                <common-flex class="time-range-box" align="center">
                  <el-time-select size="small" style="width: 60%" v-model="deviceBase[369]" :picker-options="{start: '00:00', step: '00:01', end: '24:00'}"></el-time-select>
                  <el-button :disabled="!deviceBase[369]" type="primary" plain class="ml10" @click="setDevice(369)">Set</el-button>
                </common-flex>
              </el-form-item>
            </el-col>
          </el-row>
        </template>
        <template v-else>
          <el-row>
            <el-col :span="8">
              <el-form-item label="Charge First(PV)" prop="370">
                <el-switch v-model="deviceBase[370]" @change="setDevice(370)" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="8">
              <el-form-item label="Charge First Power(kW)" prop="373">
                <el-input @blur="inputVerify(0, 25.5, 373)" v-model="deviceBase[373]" style="width: 60%" placeholder="[0, 25.5]"></el-input>
                <el-button :disabled="!deviceBase[373]" type="primary" plain class="ml10" @click="setDevice(373)">Set</el-button>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="Stop Charge First SOC(%) " prop="371">
                <el-input @blur="inputVerify(0, 100, 371)" v-model="deviceBase[371]" style="width: 60%" placeholder="[0, 100]"></el-input>
                <el-button :disabled="!deviceBase[371]" type="primary" plain class="ml10" @click="setDevice(371)">Set</el-button>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="Stop Charge First Volt(V) " prop="372">
                <el-input @blur="inputVerify(48, 59, 372)" v-model="deviceBase[372]" style="width: 60%" placeholder="[48, 59]"></el-input>
                <el-button :disabled="!deviceBase[372]" type="primary" plain class="ml10" @click="setDevice(372)">Set</el-button>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="8">
              <el-form-item label="Charge First Start Time 1" prop="374">
                <common-flex class="time-range-box" align="center">
                  <el-time-select size="small" style="width: 60%" v-model="deviceBase[374]" :picker-options="{start: '00:00', step: '00:01', end: '24:00'}"></el-time-select>
                  <el-button :disabled="!deviceBase[374]" type="primary" plain class="ml10" @click="setDevice(374)">Set</el-button>
                </common-flex>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="Charge First Start Time 2" prop="376">
                <common-flex class="time-range-box" align="center">
                  <el-time-select size="small" style="width: 60%" v-model="deviceBase[376]" :picker-options="{start: '00:00', step: '00:01', end: '24:00'}"></el-time-select>
                  <el-button :disabled="!deviceBase[376]" type="primary" plain class="ml10" @click="setDevice(376)">Set</el-button>
                </common-flex>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="Charge First Start Time 3" prop="378">
                <common-flex class="time-range-box" align="center">
                  <el-time-select size="small" style="width: 60%" v-model="deviceBase[378]" :picker-options="{start: '00:00', step: '00:01', end: '24:00'}"></el-time-select>
                  <el-button :disabled="!deviceBase[378]" type="primary" plain class="ml10" @click="setDevice(378)">Set</el-button>
                </common-flex>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="8">
              <el-form-item label="Charge First End Time 1" prop="375">
                <common-flex class="time-range-box" align="center">
                  <el-time-select size="small" style="width: 60%" v-model="deviceBase[375]" :picker-options="{start: '00:00', step: '00:01', end: '24:00'}"></el-time-select>
                  <el-button :disabled="!deviceBase[375]" type="primary" plain class="ml10" @click="setDevice(375)">Set</el-button>
                </common-flex>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="Charge First End Time 2" prop="377">
                <common-flex class="time-range-box" align="center">
                  <el-time-select size="small" style="width: 60%" v-model="deviceBase[377]" :picker-options="{start: '00:00', step: '00:01', end: '24:00'}"></el-time-select>
                  <el-button :disabled="!deviceBase[377]" type="primary" plain class="ml10" @click="setDevice(377)">Set</el-button>
                </common-flex>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="Charge First End Time 3" prop="379">
                <common-flex class="time-range-box" align="center">
                  <el-time-select size="small" style="width: 60%" v-model="deviceBase[379]" :picker-options="{start: '00:00', step: '00:01', end: '24:00'}"></el-time-select>
                  <el-button :disabled="!deviceBase[379]" type="primary" plain class="ml10" @click="setDevice(379)">Set</el-button>
                </common-flex>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="8">
              <el-form-item label="EqualVolt(V)" prop="380">
                <el-input @blur="inputVerify(50, 59, 380)" v-model="deviceBase[380]" style="width: 60%" placeholder="[50, 59]"></el-input>
                <el-button :disabled="!deviceBase[380]" type="primary" plain class="ml10" @click="setDevice(380)">Set</el-button>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="FloatVolt(V)" prop="381">
                <el-input @blur="inputVerify(50, 59, 381)" v-model="deviceBase[381]" style="width: 60%" placeholder="[50, 59]"></el-input>
                <el-button :disabled="!deviceBase[381]" type="primary" plain class="ml10" @click="setDevice(381)">Set</el-button>
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
          <el-form-item label="Batt Discharge Control" prop="382">
            <el-select v-model="deviceBase[382]" style="width: 60%">
              <el-option v-for="(i, k) of battChargeControlOptions" :value="i.value" :label="i.label" :key="k"></el-option>
            </el-select>
            <el-button :disabled="!deviceBase[382]" type="primary" plain class="ml10" @click="setDevice(382)">Set</el-button>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="Discharge Current Limit(A)" prop="387">
            <el-input @blur="inputVerify(0, 250, 387)" v-model="deviceBase[387]" style="width: 60%" placeholder="[0, 250]"></el-input>
            <el-button :disabled="!deviceBase[387]" type="primary" plain class="ml10" @click="setDevice(387)">Set</el-button>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="On-Grid Cut-Off Volt(V)" prop="385">
            <el-input @blur="inputVerify(40, 56, 385)" v-model="deviceBase[385]" style="width: 60%" placeholder="[40, 56]"></el-input>
            <el-button :disabled="!deviceBase[385]" type="primary" plain class="ml10" @click="setDevice(385)">Set</el-button>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :span="16">
        <el-col :span="8">
          <el-form-item label="On-Grid Cut-Off SOC(%) " prop="383">
            <el-input @blur="inputVerify(0, 90, 383)" v-model="deviceBase[383]" style="width: 60%" placeholder="[0, 90]"></el-input>
            <el-button :disabled="!deviceBase[383]" type="primary" plain class="ml10" @click="setDevice(383)">Set</el-button>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="Off-Grid Cut-Off Volt(V)" prop="386">
            <el-input @blur="inputVerify(40, 56, 386)" v-model="deviceBase[386]" style="width: 60%" placeholder="[40, 56]"></el-input>
            <el-button :disabled="!deviceBase[386]" type="primary" plain class="ml10" @click="setDevice(386)">Set</el-button>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="Off-Grid Cut-Off SOC(%)" prop="384">
            <el-input @blur="inputVerify(0, 90, 384)" v-model="deviceBase[384]" style="width: 60%" placeholder="[0, 90]"></el-input>
            <el-button :disabled="!deviceBase[384]" type="primary" plain class="ml10" @click="setDevice(384)">Set</el-button>
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
              <el-form-item label="Forced Discharge Enable" prop="388">
                <el-switch v-model="deviceBase[388]" @change="setDevice(388)" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="8">
              <el-form-item label="Forced Discharge Power(kW)" prop="389">
                <el-input @blur="inputVerify(0, 25.5, 389)" v-model="deviceBase[389]" style="width: 60%" placeholder="[0, 25.5]"></el-input>
                <el-button :disabled="!deviceBase[389]" type="primary" plain class="ml10" @click="setDevice(389)">Set</el-button>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="Stop Discharge Volt(V)" prop="391">
                <el-input @blur="inputVerify(40, 56, 391)" v-model="deviceBase[391]" style="width: 60%" placeholder="[40, 56]"></el-input>
                <el-button :disabled="!deviceBase[391]" type="primary" plain class="ml10" @click="setDevice(391)">Set</el-button>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="Stop Discharge SOC(%)" prop="390">
                <el-input @blur="inputVerify(0, 100, 390)" v-model="deviceBase[390]" style="width: 60%" placeholder="[0, 100]"></el-input>
                <el-button :disabled="!deviceBase[390]" type="primary" plain class="ml10" @click="setDevice(390)">Set</el-button>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="8">
              <el-form-item label="Forced Discharge Start Time 1" prop="392">
                <common-flex class="time-range-box" align="center">
                  <el-time-select size="small" style="width: 60%" v-model="deviceBase[392]" :picker-options="{start: '00:00', step: '00:01', end: '24:00'}"></el-time-select>
                  <el-button :disabled="!deviceBase[392]" type="primary" plain class="ml10" @click="setDevice(392)">Set</el-button>
                </common-flex>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="Forced Discharge Start Time 2" prop="394">
                <common-flex class="time-range-box" align="center">
                  <el-time-select size="small" style="width: 60%" v-model="deviceBase[394]" :picker-options="{start: '00:00', step: '00:01', end: '24:00'}"></el-time-select>
                  <el-button :disabled="!deviceBase[394]" type="primary" plain class="ml10" @click="setDevice(394)">Set</el-button>
                </common-flex>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="Forced Discharge Start Time 3" prop="396">
                <common-flex class="time-range-box" align="center">
                  <el-time-select size="small" style="width: 60%" v-model="deviceBase[396]" :picker-options="{start: '00:00', step: '00:01', end: '24:00'}"></el-time-select>
                  <el-button :disabled="!deviceBase[396]" type="primary" plain class="ml10" @click="setDevice(396)">Set</el-button>
                </common-flex>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="8">
              <el-form-item label="Forced Discharge End Time 1" prop="393">
                <common-flex class="time-range-box" align="center">
                  <el-time-select size="small" style="width: 60%" v-model="deviceBase[393]" :picker-options="{start: '00:00', step: '00:01', end: '24:00'}"></el-time-select>
                  <el-button :disabled="!deviceBase[393]" type="primary" plain class="ml10" @click="setDevice(393)">Set</el-button>
                </common-flex>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="Forced Discharge End Time 2" prop="395">
                <common-flex class="time-range-box" align="center">
                  <el-time-select size="small" style="width: 60%" v-model="deviceBase[395]" :picker-options="{start: '00:00', step: '00:01', end: '24:00'}"></el-time-select>
                  <el-button :disabled="!deviceBase[395]" type="primary" plain class="ml10" @click="setDevice(395)">Set</el-button>
                </common-flex>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="Forced Discharge End Time 3" prop="397">
                <common-flex class="time-range-box" align="center">
                  <el-time-select size="small" style="width: 60%" v-model="deviceBase[397]" :picker-options="{start: '00:00', step: '00:01', end: '24:00'}"></el-time-select>
                  <el-button :disabled="!deviceBase[397]" type="primary" plain class="ml10" @click="setDevice(397)">Set</el-button>
                </common-flex>
              </el-form-item>
            </el-col>
          </el-row>
        </template>
        <template v-else-if="+activeDischargeSet === 2">
          <el-row>
            <el-col :span="8">
              <el-form-item label="Grid Peak-Shaving" prop="398">
                <el-switch v-model="deviceBase[398]" @change="setDevice(398)" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="8">
              <el-form-item label="Grid Peak-Shaving Power(kW)" prop="399">
                <el-input @blur="inputVerify(0, 25.5, 399)" v-model="deviceBase[399]" style="width: 60%" placeholder="[0, 25.5]"></el-input>
                <el-button :disabled="!deviceBase[399]" type="primary" plain class="ml10" @click="setDevice(399)">Set</el-button>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="Start Peak-Shaving Volt 1(V)" prop="400">
                <el-input @blur="inputVerify(40, 59, 400)" v-model="deviceBase[400]" style="width: 60%" placeholder="[40, 59]"></el-input>
                <el-button :disabled="!deviceBase[400]" type="primary" plain class="ml10" @click="setDevice(400)">Set</el-button>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="Start Peak-Shaving SOC 1(%)" prop="401">
                <el-input @blur="inputVerify(0, 100, 401)" v-model="deviceBase[401]" style="width: 60%" placeholder="[0, 100]"></el-input>
                <el-button :disabled="!deviceBase[401]" type="primary" plain class="ml10" @click="setDevice(401)">Set</el-button>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="8">
              <el-form-item label="Start Peak-Shaving Volt 2(V)" prop="402">
                <el-input @blur="inputVerify(40, 59, 402)" v-model="deviceBase[402]" style="width: 60%" placeholder="[40, 59]"></el-input>
                <el-button :disabled="!deviceBase[402]" type="primary" plain class="ml10" @click="setDevice(402)">Set</el-button>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="Start Peak-Shaving SOC 2(%) " prop="403">
                <el-input @blur="inputVerify(0, 100, 403)" v-model="deviceBase[403]" style="width: 60%" placeholder="[0, 100]"></el-input>
                <el-button :disabled="!deviceBase[403]" type="primary" plain class="ml10" @click="setDevice(403)">Set</el-button>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="Peak Shaving Start Time 1" prop="404">
                <common-flex class="time-range-box" align="center">
                  <el-time-select size="small" style="width: 60%" v-model="deviceBase[404]" :picker-options="{start: '00:00', step: '00:01', end: '24:00'}"></el-time-select>
                  <el-button :disabled="!deviceBase[404]" type="primary" plain class="ml10" @click="setDevice(404)">Set</el-button>
                </common-flex>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="8">
              <el-form-item label="Peak Shaving Start Time 2" prop="406">
                <common-flex class="time-range-box" align="center">
                  <el-time-select size="small" style="width: 60%" v-model="deviceBase[406]" :picker-options="{start: '00:00', step: '00:01', end: '24:00'}"></el-time-select>
                  <el-button :disabled="!deviceBase[406]" type="primary" plain class="ml10" @click="setDevice(406)">Set</el-button>
                </common-flex>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="Peak Shaving End Time 1" prop="405">
                <common-flex class="time-range-box" align="center">
                  <el-time-select size="small" style="width: 60%" v-model="deviceBase[405]" :picker-options="{start: '00:00', step: '00:01', end: '24:00'}"></el-time-select>
                  <el-button :disabled="!deviceBase[405]" type="primary" plain class="ml10" @click="setDevice(405)">Set</el-button>
                </common-flex>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="Peak Shaving End Time 2" prop="407">
                <common-flex class="time-range-box" align="center">
                  <el-time-select size="small" style="width: 60%" v-model="deviceBase[407]" :picker-options="{start: '00:00', step: '00:01', end: '24:00'}"></el-time-select>
                  <el-button :disabled="!deviceBase[407]" type="primary" plain class="ml10" @click="setDevice(407)">Set</el-button>
                </common-flex>
              </el-form-item>
            </el-col>
          </el-row>
        </template>
        <template v-else>
          <el-row>
            <el-col :span="8">
              <el-form-item label="On Grid Always On" prop="408">
                <el-switch v-model="deviceBase[408]" @change="setDevice(408)" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="8">
              <el-form-item label="Start PV Power(kW)" prop="409">
                <el-input @blur="inputVerify(0, 25.5, 409)" v-model="deviceBase[409]" style="width: 60%" placeholder="[0, 25.5]"></el-input>
                <el-button :disabled="!deviceBase[409]" type="primary" plain class="ml10" @click="setDevice(409)">Set</el-button>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="Smart Load Start Volt(V)" prop="410">
                <el-input @blur="inputVerify(40, 59, 410)" v-model="deviceBase[410]" style="width: 60%" placeholder="[40, 59]"></el-input>
                <el-button :disabled="!deviceBase[410]" type="primary" plain class="ml10" @click="setDevice(410)">Set</el-button>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="Smart Load Start SOC(%)" prop="412">
                <el-input @blur="inputVerify(0, 100, 412)" v-model="deviceBase[412]" style="width: 60%" placeholder="[0, 100]"></el-input>
                <el-button :disabled="!deviceBase[412]" type="primary" plain class="ml10" @click="setDevice(412)">Set</el-button>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="8">
              <el-form-item label="Smart Load End Volt(V)" prop="411">
                <el-input @blur="inputVerify(40, 59, 411)" v-model="deviceBase[411]" style="width: 60%" placeholder="[40, 59]"></el-input>
                <el-button :disabled="!deviceBase[411]" type="primary" plain class="ml10" @click="setDevice(411)">Set</el-button>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="Smart Load End SOC(%) " prop="413">
                <el-input @blur="inputVerify(0, 100, 413)" v-model="deviceBase[413]" style="width: 60%" placeholder="[0, 100]"></el-input>
                <el-button :disabled="!deviceBase[413]" type="primary" plain class="ml10" @click="setDevice(413)">Set</el-button>
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
          <el-form-item label="All to Default" prop="417">
            <el-button size="small" type="primary" plain style="margin-left: 10px" @click="confirmSetDevice(417)">Set</el-button>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="ReverseCT" prop="414">
            <el-switch v-model="deviceBase[414]" @change="setDevice(414)" />
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

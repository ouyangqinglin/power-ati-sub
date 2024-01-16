<template>
  <div class="comp-device-card-content-right comp-battery">
    <div class="part">
      <div class="part-title">{{ $t('common.basicInfo') }}</div>
      <common-flex>
        <common-flex class="part-img-box" justify="center">
          <div class="posr" style="width: 80px; height: 80px">
            <div v-if="+base.storeConnectStatus === 1 && +curDevInfo.net === 1" class="posa dynamicSoc" :style="{height: dynamicSoc * 68 + 'px'}"></div>
            <img v-if="+curDevInfo.net === 1" class="device-img posr" style="z-index: 1" :src="require('./img/device-battery.svg')" alt="">
            <img v-else class="device-img posr" style="z-index: 1" :src="require('./img/device-battery-offline.svg')" alt="">
          </div>
        </common-flex>
        <el-form disabled style="padding-right: 24px; flex-grow: 1" label-width="260px" label-position="top">
          <el-row type="flex" :gutter="60">
            <el-col :span="10">
              <el-form-item :label="$t('site.communication')">
                <el-input disabled type="text" />
                <dict-tag class="posa" style="bottom: 0; left: 20px; color: #C0C4CC" :options="networkStatus" :value="curDevInfo.net"/>
              </el-form-item>
            </el-col>
            <el-col :span="10"><el-form-item :label="$t('common.status')">
              <template v-if="+base.storeConnectStatus === 1">
                <el-input disabled type="text" />
                <dict-tag class="posa" style="bottom: 0; left: 20px; color: #C0C4CC" :options="storeStatus" :value="curDevInfo.storeStatus"/>
              </template>
              <el-input v-else></el-input>
            </el-form-item></el-col>
          </el-row>
          <el-row type="flex" :gutter="60">
            <el-col :span="10"><el-form-item :label="$t('site.siteBatteryQuantity')"><el-input v-model="batList.length"></el-input></el-form-item></el-col>
            <el-col :span="10"><el-form-item :label="`${$t('site.totalCapacity')} (kWh)`"><el-input v-model="batEnergy.totalCapacity"></el-input></el-form-item></el-col>
          </el-row>
        </el-form>
      </common-flex>
    </div>

    <div class="part" style="margin-top: 24px">
      <div class="part-title">{{ $t('common.realtimeData') }}</div>
      <common-flex>
        <common-flex class="part-img-box" justify="flex-end"></common-flex>
        <el-form disabled style="padding-right: 24px; flex-grow: 1" label-width="260px" label-position="top">
          <el-row type="flex" :gutter="60">
            <el-col :span="10"><el-form-item label="SOC(%)"><el-input v-model="batEnergy.soc"></el-input></el-form-item></el-col>
            <el-col :span="10"><el-form-item :label="`${$t('common.power')} (kW)`"><el-input v-model="batEnergy.power"></el-input></el-form-item></el-col>
          </el-row>
          <el-row type="flex" :gutter="60">
            <el-col :span="10"><el-form-item :label="`${$t('common.voltage')} (V)`"><el-input v-model="batEnergy.voltage"></el-input></el-form-item></el-col>
            <el-col :span="10"><el-form-item :label="`${$t('common.current')} (A)`"><el-input v-model="batEnergy.current"></el-input></el-form-item></el-col>
          </el-row>
          <el-row type="flex" :gutter="60">
            <el-col :span="10"><el-form-item :label="`${$t('common.temperature')} (°C)`"><el-input v-model="batEnergy.temperature"></el-input></el-form-item></el-col>
          </el-row>
        </el-form>
      </common-flex>
      <common-flex>
        <common-flex class="part-img-box" justify="flex-end">
          <div class="part-title" style="border: none; line-height: 35px; margin-right: 12px">{{ $t('site.totalChargingEnergy') }}:</div>
        </common-flex>
        <el-form disabled style="padding-right: 24px; flex-grow: 1" label-width="260px" label-position="top">
          <el-row type="flex" :gutter="60">
            <el-col :span="10"><el-form-item :label="`${$t('common.today')}(kWh)`"><el-input v-model="batEnergy.dayChargeEnergy"></el-input></el-form-item></el-col>
            <el-col :span="10"><el-form-item :label="`${$t('common.thisMonth')}(kWh)`"><el-input v-model="batEnergy.monthChargeEnergy"></el-input></el-form-item></el-col>
          </el-row>
          <el-row type="flex" :gutter="60">
            <el-col :span="10"><el-form-item :label="`${$t('common.thisYear')}(kWh)`"><el-input v-model="batEnergy.yearChargeEnergy"></el-input></el-form-item></el-col>
            <el-col :span="10"><el-form-item :label="`${$t('common.lifetime')}(kWh)`"><el-input v-model="batEnergy.allChargeEnergy"></el-input></el-form-item></el-col>
          </el-row>
        </el-form>
      </common-flex>
      <common-flex>
        <common-flex class="part-img-box" justify="flex-end">
          <div class="part-title" style="border: none; line-height: 35px; margin-right: 12px">{{ $t('site.totalDischargingEnergy') }}:</div>
        </common-flex>
        <el-form disabled style="padding-right: 24px; flex-grow: 1" label-width="260px" label-position="top">
          <el-row type="flex" :gutter="60">
            <el-col :span="10"><el-form-item :label="`${$t('common.today')}(kWh)`"><el-input v-model="batEnergy.dayDisChargeEnergy"></el-input></el-form-item></el-col>
            <el-col :span="10"><el-form-item :label="`${$t('common.thisMonth')}(kWh)`"><el-input v-model="batEnergy.monthDisChargeEnergy"></el-input></el-form-item></el-col>
          </el-row>
          <el-row type="flex" :gutter="60">
            <el-col :span="10"><el-form-item :label="`${$t('common.thisYear')}(kWh)`"><el-input v-model="batEnergy.yearDisChargeEnergy"></el-input></el-form-item></el-col>
            <el-col :span="10"><el-form-item :label="`${$t('common.lifetime')}(kWh)`"><el-input v-model="batEnergy.allDisChargeEnergy"></el-input></el-form-item></el-col>
          </el-row>
        </el-form>
      </common-flex>
    </div>
    <div class="part" style="margin-top: 24px">
      <div class="part-title">{{ $t('common.historicalInformation') }}</div>
      <common-flex justify="space-between" align="center">
        <div></div>
        <common-flex justify="flex-end" style="margin: 40px 0 20px 0">
          <el-radio-group size="small" v-model="batteryHis.batteryType" @change="changeBatType">
            <template v-for="item of batInfoItemBtn">
              <el-radio-button :label="item.value">{{ item.label }}</el-radio-button>
            </template>
          </el-radio-group>
          <el-date-picker
            size="small"
            style="margin: 0 40px 0 10px"
            format="MM-dd-yyyy"
            value-format="yyyy-MM-dd"
            @change="changeBatDate"
            v-model="batteryHis.dateVal"
          >
          </el-date-picker>
        </common-flex>
      </common-flex>
      <el-skeleton style="width: 100%; height: 45vh" :loading="loading" animated>
        <template slot="template">
          <el-skeleton-item
            variant="rect"
            style="width: 100%; height: 45vh;"
          />
        </template>
        <template slot="default">
          <div id="batteryChart" class="batteryChart"></div>
        </template>
      </el-skeleton>
    </div>

    <div class="part" style="margin-top: 24px">
      <div class="part-title">{{ $t('site.batteryList') }}</div>
      <el-form disabled style="padding: 0 24px 24px; flex-grow: 1" label-width="260px" label-position="top">
        <el-table :data="batList">
          <el-table-column :label="$t('common.sn')" prop="serialNumber">
            <template slot-scope="{ row }">
              <common-flex align="center" @click.native="+row.type === 1 ? details(row.serialNumber) : ''" :style="{cursor: +row.type === 1 ? 'pointer' : 'not-allowed'}">
                <span class="dot" :style="{backgroundColor: ['#AAB2BC', '#8BEA91'][+curDevInfo.net]}"></span>
                <span class="themeColor">{{ row.serialNumber }}</span>
              </common-flex>
            </template>
          </el-table-column>
          <el-table-column :label="`${$t('common.capacity')}(kWh)`" prop="nameplateCapacity"></el-table-column>
          <el-table-column :label="$t('site.newInstallation')" prop="installation">
            <template slot-scope="{ row }">
              <span>{{ newInstall[+row.installation] }}</span>
            </template>
          </el-table-column>
          <el-table-column :label="$t('common.lifetime')" prop="lifetime"></el-table-column>
        </el-table>
      </el-form>
    </div>

    <BatteryDetails :base="base" :show.sync="show" :batteryInfo="batteryInfo" :dialogHisData="dialogHisData" @date="changeDate" />
  </div>
</template>

<script>
import BatteryDetails from "./batteryDetails.vue"
import {batEnergy, batHistoryData, infoDevice, batTotalHistoryData} from '@/api/device'
import * as echarts from "echarts"
import { networkStatus, storeStatus, batInfoItemBtn } from '@sub/utils/dict'
import { newInstall } from '@sub/utils/map'

let batteryStorage = {}
let batteryInstance = null
let arr = [], arr1 = [], arr5 = [], batData = []
for (let i = 0; i < 24; i++) {
  arr.push(i)
}
const optionBat = {
  tooltip: {
    trigger: 'axis',
    position: function (pt, param) {
      if (pt[0] > 960) {
        if (param.length > 1) {
          if (param[0].value === 'NaN') return [pt[0] - 100, pt[1] - 10]
          else return [pt[0] - 220, pt[1] - 10]
        }
        else return [pt[0] - 100, pt[1] - 10]
      }
      return [pt[0] + 20, pt[1] - 10];
    },
    formatter(v) {
      if (v[0].value === 'NaN') return 'No data'
      if (optionBat.yAxis.name === 'kW') {
        let t1, unit1
        if (v[0].value < 1) {
          t1 = `${(v[0].value * 1000).toFixed(2)}`
          unit1 = 'W'
        } else if (v[0].value > 1 && v[0].value < 1000) {
          t1 = `${(+v[0].value).toFixed(2)}`
          unit1 = 'kW'
        } else {
          t1 = `${(+v[0].value / 1000).toFixed(2)}`
          unit1 = 'MW'
        }
        return `${v[0].name}<br>${v[0].marker} ${t1}${unit1}`
      } else {
        if (v.length > 1) return `${v[0].name}<br>${v[0].marker}${v[0].seriesName}: ${v[0].value}<br>${v[1].marker}${v[1].seriesName}: ${v[1].value}`
        else return `${v[0].name}<br>${v[0].marker} ${v[0].value}`
      }
    }
  },
  grid: {
    left: '5%',
    right: '5%'
  },
  xAxis: [
    {
      type: 'category',
      show: false,
      boundaryGap: true,
      data: [], // 接受接口时间点
      position: 'bottom',
    },
    {
      type: 'category',
      boundaryGap: true,
      data: arr,
      position: 'bottom',
      axisLine: {
        lineStyle: {
          color: '#E7E7E7'
        }
      },
      axisLabel: {
        textStyle: {
          color: '#000'
        }
      },
      axisPointer: {
        type: 'none',
      },
    },

  ],
  yAxis: {
    name: 'V',
    type: 'value',
    axisLine: {
      show: false,
    },
    axisTick: {
      show: false
    },
    splitLine: {
      lineStyle: {
        type: 'dashed'
      }
    }
  },
  dataZoom: [
    {
      showDetail: true,
      type: 'inside',
      height: 26,
      bottom: 2,
      left: '5%',
      right: '5%',
      start: 0,
      // zoomOnMouseWheel: false,
      end: 1999
    },
    {
      height: 22,
      bottom: 15,
      left: '5%',
      right: '5%',
      start: 0,
      end: 1999,
      backgroundColor: 'white',
      dataBackground: {
        lineStyle: {
          color: '#E67A73'
        },
        areaStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
            offset: 0,
            color: 'rgba(252, 219, 218, 0.1)'
          }, {
            offset: 1,
            color: 'rgb(255, 255, 255)'
          }])
        }
      },
      fillerColor: 'rgba(51, 149, 250, 0.06)',
      handleStyle: {
        color: '#7A84B0'
      }
    }
  ],
  series: []
}

export default {
  name: 'comp-battery',
  components: { BatteryDetails },
  props: {
    base: {
      type: Object,
      default: () => {
        return {}
      }
    },
    curDevInfo: {
      type: Object,
      default: () => {
        return {}
      }
    },
    batList: {
      type: Array,
      default: () => {
        return []
      }
    },
  },
  computed: {
    dynamicSoc() {
      return +this.curDevInfo.soc / 100
    }
  },
  data() {
    const that = this
    return {
      networkStatus,
      storeStatus,
      batInfoItemBtn,
      newInstall,
      loading: false,
      batEnergy: {},
      sn: '',
      batteryHis: {
        batteryType: 'Voltage',
        dateVal: new Date(that.UTC_START_OF(this.base.timeZone))
      },
      show: false,
      batteryInfo: {},
      dialogHisData: []
    }
  },
  watch: {
    batList: {
      handler(v) {
        console.log('batList', v)
        // 设备类型 1-1.5 2-mini  3-1.0
        if (v.length) {
          this.sn = v[0].serialNumber
          this.$nextTick(() => this.getBatHisData())
          window.addEventListener('resize', this.changeSize)
        }
      },
      immediate: true
    },
    curDevInfo(v) {
      console.log('battery', v)
    }
  },
  mounted() {
    batteryStorage = {}
    this.getBatEnergy()
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.changeSize)
  },
  methods: {
    changeDate(date) {
      this.getDialogHisData(date)
    },
    getDialogHisData(date) {
      let formatTime = this.DATE_FORMAT('yyyy-MM-dd', date)
      let params = {
        sn: this.sn,
        siteCode: this.$route.query?.siteCode,
        startTimeLong: (this.ISD_TIMESTAMP(`${formatTime} 00:00:00`, this.base.timeZone)) / 1000,
        endTimeLong: (this.ISD_TIMESTAMP(`${formatTime} 23:59:59`, this.base.timeZone)) / 1000,
      }
      batHistoryData(params).then(res => {
        this.dialogHisData = res.data
      })
    },
    beforeClose() {
      this.show = false
    },
    details(sn) {
      this.show = true
      this.changeCurBat(sn)
    },
    changeSize() {
      if (batteryInstance) batteryInstance.resize()
    },
    changeBatDate() {
      this.getBatHisData()
    },
    changeBatType() {
      arr1 = []
      let arr2 = []
      optionBat.series = []
      if (this.batteryHis.batteryType === 'Voltage') {
        optionBat.yAxis.name = 'V'
        for(let i = 0; i < batData.length; i++) {
          arr1.push((+batData[i].storeVoltage).toFixed(2))
        }
      }
      if (this.batteryHis.batteryType === 'Current') {
        optionBat.yAxis.name = 'A'
        for(let i = 0; i < batData.length; i++) {
          arr1.push((+batData[i].storeCurrent).toFixed(2))
        }
      }
      if (this.batteryHis.batteryType === 'Power') {
        optionBat.yAxis.name = 'kW'
        for(let i = 0; i < batData.length; i++) {
          arr1.push((+batData[i].storeChargePower).toFixed(2))
        }
      }
      if (this.batteryHis.batteryType === 'SOC') {
        optionBat.yAxis.name = '%'
        for(let i = 0; i < batData.length; i++) {
          arr1.push((+batData[i].storeSoc).toFixed(2))
        }
      }
      if (this.batteryHis.batteryType === 'Temperature') {
        optionBat.yAxis.name = '℃'
        optionBat.legend = {
          left: 40,
          data: [this.$t('site.minTemperature'), this.$t('site.maxTemperature')],
          icon: 'circle'
        }
        for(let i = 0; i < batData.length; i++) {
          arr1.push((+batData[i].maxTemperature).toFixed(2))
          arr2.push((+batData[i].minTemperature).toFixed(2))
        }
      } else optionBat.legend = {}
      let itemOne = {
        symbol: "none",
        // name: 'A相',
        type: 'line',
        smooth: true,
        itemStyle: {
          color: '#3EBCD4'
        },
        data: arr1
      }
      if (this.batteryHis.batteryType === 'Temperature') {
        let itemTwo = {
          name: this.$t('site.minTemperature'),
          symbol: 'none',
          type: 'line',
          smooth: true,
          itemStyle: {
            color: '#FFB968'
          },
          data: arr2
        }
        itemOne.name = this.$t('site.maxTemperature')
        optionBat.series.push(itemTwo)
      }
      optionBat.series.push(itemOne)
      if (batteryInstance) {
        batteryInstance.dispose()
        batteryInstance= null
      }
      this.$nextTick(() => {
        batteryInstance = echarts.init(document.getElementById('batteryChart'))
        batteryInstance.setOption(optionBat)
      })
    },
    getBatHisData() {
      this.loading = true
      if (batteryInstance) {
        batteryInstance.dispose()
        batteryInstance= null
      }
      let formatTime = this.DATE_FORMAT('yyyy-MM-dd', this.batteryHis.dateVal)
      let params = {
        siteCode: this.$route.query?.siteCode,
        startTimeLong: (this.ISD_TIMESTAMP(`${formatTime} 00:00:00`, this.base.timeZone)) / 1000,
        endTimeLong: (this.ISD_TIMESTAMP(`${formatTime} 23:59:59`, this.base.timeZone)) / 1000,
      }
      batTotalHistoryData(params).then(res => {
        this.loading = false
        batData = res.data
        arr5 = []
        for(let i = 0; i < res.data.length; i++) {
          arr5.push(res.data[i].timestamp)
        }
        optionBat.xAxis[0].data = arr5
        this.changeBatType()
      })
    },
    getBatEnergy() {
      let params = {
        siteCode: this.$route.query?.siteCode
      }
      batEnergy(params).then(res => {
        this.batEnergy = res.data
      })
    },
    getDeviceInfo() {
      let data = {
        sn: this.sn,
        siteCode: this.$route.query?.siteCode
      }
      infoDevice(data).then(res => {
        let item = this.batList.find(i => i.serialNumber === this.sn)
        let data = {...item, ...res.data}
        if (+data.installation === 2) {
          data.lifetime = '--'
        } else {
          let resStr = ''
          resStr += `${data.periodDay} Days ${data.periodMonth} Months ${data.periodYear} Year`
          data.lifetime = resStr
        }
        if (data.upgradeTime) data.upgradeTime = this.DATE_FORMAT('M/d/yyyy hh:mm', data.upgradeTime * 1000)
        batteryStorage[this.sn] = data
        this.batteryInfo = batteryStorage[this.sn]
      })
    },
    changeCurBat(sn) {
      this.sn = sn
      if (batteryStorage[this.sn]) this.batteryInfo = batteryStorage[this.sn]
      else this.getDeviceInfo()
      this.getDialogHisData(new Date(this.UTC_START_OF(this.base.timeZone)))
    },
  }
}
</script>

<style lang="scss">
.comp-battery {
  .dot {
    margin-right: 4px;
    @include wh(10);
    border-radius: 50%;
  }
}
</style>

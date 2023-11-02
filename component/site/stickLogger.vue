<template>
  <div class="comp-device-card-content-right">
    <div class="part">
      <div class="part-title">Basic Info</div>
      <common-flex>
        <common-flex class="part-img-box" justify="center">
          <img class="device-img" :src="require('./img/device-stick.svg')" alt="">
        </common-flex>
        <el-form disabled style="padding-right: 24px; flex-grow: 1" label-width="260px" label-position="top">
          <el-row type="flex" :gutter="60">
            <el-col :span="10"><el-form-item label="Status"><el-input v-model="['Off-line', 'On-line'][+curDevInfo.net]"></el-input></el-form-item></el-col>
            <el-col :span="10"><el-form-item label="Wireless Signal Strength" v-if="[1, 2].includes(+curDevInfo.type)">
              <div class="posr">
                <el-input v-model="curDevInfo.wifi"></el-input>
                <img class="posa wifi-img" :src="require('./img/device-wifi.svg')" alt="">
              </div>
            </el-form-item></el-col>
          </el-row>
          <el-row type="flex" :gutter="60">
            <el-col :span="10"><el-form-item label="Lifetime"><el-input v-model="curDevInfo.lifetime"></el-input></el-form-item></el-col>
          </el-row>
        </el-form>
      </common-flex>

      <common-flex style="padding-top: 12px; background-color: #F5F7FA; border-top: 1px solid #D8DCE6">
        <common-flex class="part-img-box" justify="center"></common-flex>
        <el-form style="padding-right: 24px; flex-grow: 1" label-width="260px" label-position="top">
          <el-row type="flex" :gutter="60">
            <el-col :span="10"><el-form-item label="Serial number"><el-input readonly v-model="curDevInfo.serialNumber"></el-input></el-form-item></el-col>
            <el-col :span="10"><el-form-item label="Software version"><el-input readonly v-model="curDevInfo.version"></el-input></el-form-item></el-col>
          </el-row>
          <el-row type="flex" :gutter="60">
            <el-col :span="10"><el-form-item label="Hardware version"><el-input readonly v-model="curDevInfo.hardVersion"></el-input></el-form-item></el-col>
            <el-col :span="10"><el-form-item label="Last version upgrade time"><el-input readonly v-model="curDevInfo.upgradeTime"></el-input></el-form-item></el-col>
          </el-row>
          <el-row type="flex" :gutter="60">
            <el-col :span="10"><el-form-item label="Device Model"><el-input readonly v-model="['', '1.5', 'Mini', '1.0'][+curDevInfo.type]"></el-input></el-form-item></el-col>
          </el-row>
        </el-form>
      </common-flex>
    </div>

    <div class="part" style="margin-top: 24px" v-if="[1, 2].includes(+curDevInfo.type)">
      <div class="part-title">Historical Information</div>
      <common-flex justify="space-between" align="center">
        <div></div>
        <common-flex justify="flex-end" style="margin: 40px 0 20px 0">
          <el-date-picker
              size="small"
              style="margin: 0 40px 0 10px"
              format="MM-dd-yyyy"
              value-format="yyyy-MM-dd"
              @change="changeDate"
              v-model="dataHis.dateVal"
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

  </div>
</template>

<script>
import {wifiChart} from "@/api/index"

import * as echarts from "echarts"

let batteryInstance = null
let arr = [], arr1 = [], arrSeries = []
for (let i = 0; i < 24; i++) {
  arr.push(i)
}
const optionBat = {
  color: ['#FFB968'],
  legend: {
    data: ['Wireless Signal Strength'],
    right: 40,
    icon: 'circle'
  },
  tooltip: {
    trigger: 'axis',
    formatter(v) {
      if (v[0].value === 'NaN') return 'No data'
      return `${v[0].name}<br>${v[0].marker} ${v[0].value}`
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
  series: [
    {
      type: 'line',
      name: 'Wireless Signal Strength',
      data: [],
      smooth: true,
      symbol: 'none'
    }
  ]
}
// 设备类型 1-1.5 2-mini  3-1.0
export default {
  name: 'comp-sticker',
  props: {
    curDevInfo: {
      type: Object,
      default: () => {
        return {}
      }
    },
    base: {
      type: Object,
      default: () => {
        return {}
      }
    },
    sn: String
  },
  data() {
    const that = this
    return {
      loading: false,
      dataHis: {
        batteryType: 'Voltage',
        dateVal: new Date(that.UTC_START_OF(this.base.timeZone))
      },
    }
  },
  watch: {
    curDevInfo(v) {
      console.log('stickInfo', v)
      if ([1, 2].includes(+this.curDevInfo.type)) this.getWifiData()
    }
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.changeSize)
  },
  methods: {
    changeSize() {
      if (batteryInstance) batteryInstance.resize()
    },
    changeDate() {
      this.getWifiData()
    },
    getWifiData() {
      this.loading = true
      if (batteryInstance) {
        batteryInstance.dispose()
        batteryInstance= null
      }
      let formatTime = this.DATE_FORMAT('yyyy-MM-dd', this.dataHis.dateVal)
      let params = {
        sn: this.sn,
        siteCode: this.$route.query?.siteCode,
        startTimeLong: (this.ISD_TIMESTAMP(`${formatTime} 00:00:00`, this.base.timeZone)) / 1000,
        endTimeLong: (this.ISD_TIMESTAMP(`${formatTime} 23:59:59`, this.base.timeZone)) / 1000,
      }
      wifiChart(params).then(res => {
        this.loading = false
        arr1 = []
        arrSeries = []
        for(let i = 0; i < res.data.length; i++) {
          arr1.push(res.data[i].timestamp)
          arrSeries.push((+res.data[i].wifi).toFixed(3))
        }
        optionBat.xAxis[0].data = arr1
        optionBat.series[0].data = arrSeries
        this.$nextTick(() => {
          batteryInstance = echarts.init(document.getElementById('batteryChart'))
          window.addEventListener('resize', this.changeSize)
          batteryInstance.setOption(optionBat)
        })
      })
    },
  }
}
</script>

<style lang="scss">

</style>

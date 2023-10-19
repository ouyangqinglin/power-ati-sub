<template>
  <div class="comp-device-card-content-right">
    <div class="part">
      <div class="part-title">Basic Info</div>
      <common-flex>
        <common-flex class="part-img-box" justify="center">
          <img class="device-img" :src="require('./img/device-pv.svg')" alt="">
        </common-flex>
        <el-form disabled style="padding-right: 24px; flex-grow: 1" label-width="260px" label-position="top">
          <el-row type="flex" :gutter="60">
            <el-col :span="10"><el-form-item label="Serial number"><el-input v-model="curDevInfo.serialNumber"></el-input></el-form-item></el-col>
            <el-col :span="10"><el-form-item label="Total component capacity(kW)"><el-input v-model="curDevInfo.nameplateCapacity"></el-input></el-form-item></el-col>
          </el-row>
          <el-row type="flex" :gutter="60">
            <el-col :span="10"><el-form-item label="New installation"><el-input v-model="['', 'Yes', 'No'][+curDevInfo.installation]"></el-input></el-form-item></el-col>
            <el-col :span="10"><el-form-item label="Lifetime"><el-input v-model="curDevInfo.lifetime"></el-input></el-form-item></el-col>
          </el-row>
        </el-form>
      </common-flex>
    </div>

    <div style="margin-top: 24px">
      <div class="part">
        <div class="part-title">Real-Time Data</div>
        <common-flex style="margin-top: 24px">
          <common-flex class="part-img-box" justify="center"></common-flex>
          <el-form disabled style="padding-right: 24px; flex-grow: 1" label-width="260px" label-position="top">
            <el-row type="flex" :gutter="60">
              <el-col :span="20">
                <el-table class="table" :data="curDevInfo.pvList">
                  <el-table-column label="" prop="pvNum"></el-table-column>
                  <el-table-column label="Voltage(V)" prop="v"></el-table-column>
                  <el-table-column label="Current(A)" prop="c"></el-table-column>
                  <el-table-column label="Power(kW)" prop="p"></el-table-column>
                </el-table>
              </el-col>
            </el-row>
          </el-form>
        </common-flex>

        <common-flex style="margin-top: 24px">
          <common-flex class="part-img-box" justify="flex-end">
            <div class="part-title" style="border: none; line-height: 35px; margin-right: 12px">PV Energy Produced:</div>
          </common-flex>
          <el-form disabled style="padding-right: 24px; flex-grow: 1" label-width="260px" label-position="top">
            <el-row type="flex" :gutter="60">
              <el-col :span="10"><el-form-item label="Today(kWh)"><el-input v-model="curDevInfo.dayPvEnergyProduce"></el-input></el-form-item></el-col>
              <el-col :span="10"><el-form-item label="This Month(kWh)"><el-input v-model="curDevInfo.monthPvEnergyProduce"></el-input></el-form-item></el-col>
            </el-row>
            <el-row type="flex" :gutter="60">
              <el-col :span="10"><el-form-item label="This Year(kWh)"><el-input v-model="curDevInfo.yearPvEnergyProduce"></el-input></el-form-item></el-col>
              <el-col :span="10"><el-form-item label="Lifetime(kWh)"><el-input v-model="curDevInfo.allPvEnergyProduce"></el-input></el-form-item></el-col>
            </el-row>
          </el-form>
        </common-flex>
      </div>
    </div>

    <div class="part" style="margin-top: 24px">
      <div class="part-title">Historical Information</div>
      <div class="posr">
        <common-flex class="pv-nav posa" justify="flex-end">
          <el-radio-group v-model="pvHis.pvType" size="small" @change="changePvType">
            <el-radio-button label="Voltage"></el-radio-button>
            <el-radio-button label="Current"></el-radio-button>
            <el-radio-button label="Power"></el-radio-button>
          </el-radio-group>
          <el-date-picker
              size="small"
              style="margin: 0 40px 0 10px"
              format="MM-dd-yyyy"
              value-format="yyyy-MM-dd"
              @change="changePvDate"
              v-model="pvHis.dateVal"
          />
        </common-flex>
        <div class="pvChart" v-if="!this.navBar['Inverter']">
          <no-data />
        </div>
        <template v-else>
          <el-skeleton style="width: 100%; height: 55vh" :loading="loading" animated>
            <template slot="template">
              <el-skeleton-item
                  variant="rect"
                  style="width: 100%; height: 55vh;"
              />
            </template>
            <template slot="default">
              <div id="pvChart" class="pvChart"></div>
            </template>
          </el-skeleton>
        </template>
      </div>
    </div>
  </div>
</template>

<script>
import * as echarts from "echarts"
import { pvHistoryData } from '@/api/device'

let pvInstance = null
let timer = null
let arrX1 = [], arrX2 = [], pv1 = [], pv2 = [], pv3 = [], pv4 = []
let pvData = []
for (let i = 0; i < 24; i++) {
  arrX1.push(i)
}
const optionPv = {
  tooltip: {
    trigger: 'axis',
    position: function (pt, param) {
      if (pt[0] > 960) {
        if (param[0].value === 'NaN') return [pt[0] - 100, pt[1] - 10];
        else return [pt[0] - 140, pt[1] - 10];
      }
      return [pt[0] + 20, pt[1] - 10];
    },
    formatter(v) {
      if (v[0].value === 'NaN') return 'No data'
      let v0, v1, v2, v3, t1, t2, t3, t4, res, unit1, unit2, unit3, unit4
      if (optionPv.yAxis.name === 'kW') {
        if (v[0]) {
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
          v0 = `${v[0].marker}${v[0].seriesName}: ${t1}${unit1}`
        }
        if (v[1]) {
          if (v[1].value < 1) {
            t2 = `${(v[1].value * 1000).toFixed(2)}`
            unit2 = 'W'
          } else if (v[1].value > 1 && v[1].value < 1000) {
            t2 = `${(+v[1].value).toFixed(2)}`
            unit2 = 'kW'
          } else {
            t2 = `${(+v[1].value / 1000).toFixed(2)}`
            unit2 = 'MW'
          }
          v1 = `${v[1].marker}${v[1].seriesName}：${t2}${unit2}`
        }
        if (v[2]) {
          if (v[2].value < 1) {
            t3 = `${(v[2].value * 1000).toFixed(2)}`
            unit3 = 'W'
          } else if (v[2].value > 1 && v[2].value < 1000) {
            t3 = `${(+v[2].value).toFixed(2)}`
            unit3 = 'kW'
          } else {
            t3 = `${(+v[2].value / 1000).toFixed(2)}`
            unit3 = 'MW'
          }
          v2 = `${v[2].marker}${v[2].seriesName}：${t3}${unit3}`
        }
        if (v[3]) {
          if (v[3].value < 1) {
            t4 = `${(v[3].value * 1000).toFixed(2)}`
            unit4 = 'W'
          } else if (v[3].value > 1 && v[3].value < 1000) {
            t4 = `${(+v[3].value).toFixed(2)}`
            unit4 = 'kW'
          } else {
            t4 = `${(+v[3].value / 1000).toFixed(2)}`
            unit4 = 'MW'
          }
          v3 = `${v[3].marker}${v[3].seriesName}：${t4}${unit4}`
        }
        if (v0) res = `${v0}<br>`
        if (v1) res += `${v1}<br>`
        if (v2) res += `${v2}<br>`
        if (v3) res += `${v3}<br>`
        return `${v[0].name}<br>${res}`
      } else {
        if (v[0]) {
          t1 = `${(+v[0].value).toFixed(2)}`
          v0 = `${v[0].marker}${v[0].seriesName}: ${t1}`
        }
        if (v[1]) {
          t2 = `${(+v[1].value).toFixed(2)}`
          v1 = `${v[1].marker}${v[1].seriesName}: ${t2}`
        }
        if (v[2]) {
          t3 = `${(+v[2].value).toFixed(2)}`
          v2 = `${v[2].marker}${v[2].seriesName}: ${t3}`
        }
        if (v[3]) {
          t4 = `${(+v[3].value).toFixed(2)}`
          v3 = `${v[3].marker}${v[3].seriesName}: ${t4}`
        }
        if (v0) res = `${v0}<br>`
        if (v1) res += `${v1}<br>`
        if (v2) res += `${v2}<br>`
        if (v3) res += `${v3}<br>`
        return `${v[0].name}<br>${res}`
      }
    }
  },
  legend: {
    data: ['PV1', 'PV2', 'PV3', 'PV4'],
    icon: 'circle',
    top: '10%',
    left: '5%'
  },
  grid: {
    left: '5%',
    right: '5%',
    top: '30%'
  },
  xAxis: [
    {
      type: 'category',
      show: false,
      boundaryGap: true,
      data: [], // 接受接口时间点
      position: 'bottom',
      axisPointer: {
        show: true
      },
    },
    {
      type: 'category',
      boundaryGap: true,
      data: arrX1,
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
        type: 'none'
      },
    }

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
      symbol: "none",
      name: 'PV1',
      type: 'line',
      smooth: true,
      itemStyle: {
        color: '#FFB968'
      },
      data: [],
      zlevel: 1,
      z: 1
    },
    {
      symbol: "none",
      name: 'PV2',
      type: 'line',
      smooth: true,
      itemStyle: {
        color: '#3DAABF'
      },
      data: [],
      zlevel: 2,
      z: 2
    },
    {
      symbol: "none",
      name: 'PV3',
      type: 'line',
      smooth: true,
      itemStyle: {
        color: '#8BEA91'
      },
      data: [],
      zlevel: 3,
      z: 3
    },
    {
      symbol: "none",
      name: 'PV4',
      type: 'line',
      smooth: true,
      itemStyle: {
        color: '#638AE3'
      },
      data: [],
      zlevel: 4,
      z: 4
    }
  ]
}
export default {
  name: 'comp-pv',
  props: {
    curDevInfo: {
      type: Object,
      default: () => {
        return {}
      }
    },
    navBar: {
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
      pvHis: {
        pvType: 'Voltage',
        dateVal: new Date(that.UTC_START_OF(this.base.timeZone))
      },
    }
  },
  watch: {
    navBar: {
      immediate: true,
      handler() {
        if (this.navBar['Inverter']) this.getPvHisData()
      }
    }
  },
  mounted() {
    window.addEventListener('resize', this.changeSize)
  },
  methods: {
    changePvDate() {
      if (!this.navBar['Inverter']) return
      this.getPvHisData()
    },
    getPvHisData() {
      this.loading = true
      if (pvInstance) {
        pvInstance.dispose()
        pvInstance = null
      }
      let formatTime = this.DATE_FORMAT('yyyy-MM-dd', this.pvHis.dateVal)
      let params = {
        sn: this.sn,
        siteCode: this.$route.query?.siteCode,
        startTimeLong: (this.ISD_TIMESTAMP(`${formatTime} 00:00:00`, this.base.timeZone)) / 1000,
        endTimeLong: (this.ISD_TIMESTAMP(`${formatTime} 23:59:59`, this.base.timeZone)) / 1000,
      }
      pvHistoryData(params).then(res => {
        this.loading = false
        arrX2 = []
        pvData = res.data
        for(let i = 0; i < pvData.length; i++) {
          arrX2.push(res.data[i].timestamp)
        }
        optionPv.xAxis[0].data = arrX2
        this.changePvType()
      })
    },
    changePvType() {
      if (!this.navBar['Inverter']) return
      pv1 = []
      pv2 = []
      pv3 = []
      pv4 = []
      for(let i = 0; i < pvData.length; i++) {
        pv1.push((+pvData[i][`pv1${this.pvHis.pvType}`]).toFixed(2))
        pv2.push((+pvData[i][`pv2${this.pvHis.pvType}`]).toFixed(2))
        pv3.push((+pvData[i][`pv3${this.pvHis.pvType}`]).toFixed(2))
        pv4.push((+pvData[i][`pv4${this.pvHis.pvType}`]).toFixed(2))
      }
      const weakMap = {
        'Voltage' : 'V',
        'Current' : 'A',
        'Power' : 'kW',
      }
      optionPv.yAxis.name = weakMap[this.pvHis.pvType]
      optionPv.series[0].data = pv1
      optionPv.series[1].data = pv2
      optionPv.series[2].data = pv3
      optionPv.series[3].data = pv4
      if (pvInstance) {
        pvInstance.dispose()
        pvInstance = null
      }
      this.$nextTick(() => {
        pvInstance = echarts.init(document.getElementById('pvChart'))
        pvInstance.setOption(optionPv)
      })
    },
    changeSize() {
      clearTimeout(timer)
      if (pvInstance) {
        timer = setTimeout(() => {
          pvInstance.resize()
        }, 500)
      }
    },
    beforeDestroy() {
      clearTimeout(timer)
      window.removeEventListener('resize', this.changeSize)
    },
  }
}
</script>

<style lang="scss">

</style>

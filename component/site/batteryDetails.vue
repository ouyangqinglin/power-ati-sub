<template>
  <el-dialog v-if="show" :visible.sync="show" title="Battery details"
             :before-close="beforeClose"
             :close-on-click-modal ="false"
             width="66%">
    <div class="part">
      <common-flex style="width: 100%; padding-right: 24px" class="part-title" justify="space-between">
        <div>Real-Time Data</div>
        <el-button type="text" @click="toBms()">Go to BMS</el-button>
      </common-flex>
      <el-form disabled label-width="260px" label-position="top" style="padding: 0 24px 24px">
        <el-row :gutter="24">
          <el-col :span="8">
            <el-form-item label="Communication">
              <el-input disabled type="text" />
              <dict-tag class="posa" style="bottom: 0; left: 20px; color: #C0C4CC" :options="networkStatus" :value="batteryInfo.net"/>
            </el-form-item>
          </el-col>
          <el-col :span="8"><el-form-item label="Status">
            <template v-if="+batteryInfo.storeConnectStatus === 1">
              <el-input disabled type="text" />
              <dict-tag class="posa" style="bottom: 0; left: 20px; color: #C0C4CC" :options="storeStatus" :value="batteryInfo.storeStatus"/>
            </template>
            <el-input v-else></el-input>
          </el-form-item></el-col>
        </el-row>
        <el-row type="flex" :gutter="24">
          <el-col :span="8"><el-form-item label="SOC(%)"><el-input v-model="batteryInfo.soc"></el-input></el-form-item></el-col>
          <el-col :span="8"><el-form-item label="Power (kW)"><el-input v-model="batteryInfo.power"></el-input></el-form-item></el-col>
          <el-col :span="8"><el-form-item label="Voltage (V)"><el-input v-model="batteryInfo.voltage"></el-input></el-form-item></el-col>
        </el-row>
        <el-row type="flex" :gutter="24">
          <el-col :span="8"><el-form-item label="Current (A)"><el-input v-model="batteryInfo.current"></el-input></el-form-item></el-col>
        </el-row>
      </el-form>
      <el-form style="padding: 0 24px 24px; background-color: #F5F7FA; border-top: 1px solid #D8DCE6" label-width="260px" label-position="top">
        <el-row type="flex" :gutter="24">
          <el-col :span="8"><el-form-item label="SN"><el-input readonly v-model="batteryInfo.serialNumber"></el-input></el-form-item></el-col>
          <el-col :span="8"><el-form-item label="Hardware version"><el-input readonly v-model="batteryInfo.hardVersion"></el-input></el-form-item></el-col>
          <el-col :span="8"><el-form-item label="Software version"><el-input readonly v-model="batteryInfo.version"></el-input></el-form-item></el-col>
        </el-row>
        <el-row type="flex" :gutter="24">
          <el-col :span="8"><el-form-item label="Last version upgrade time"><el-input readonly v-model="batteryInfo.upgradeTime"></el-input></el-form-item></el-col>
          <el-col :span="8"><el-form-item label="Manufacturer"><el-input readonly v-model="batteryInfo.manufacturer"></el-input></el-form-item></el-col>
        </el-row>
      </el-form>
    </div>
    <div class="part" style="margin-top: 24px">
      <div class="part-title">Historical Information</div>
      <common-flex justify="space-between" align="center">
        <div></div>
        <common-flex justify="flex-end" style="margin: 40px 0 20px 0">
          <el-radio-group size="small" v-model="batteryHis.batteryType" @change="changeBatType">
            <el-radio-button label="Voltage"></el-radio-button>
            <el-radio-button label="Current"></el-radio-button>
            <el-radio-button label="Power"></el-radio-button>
            <el-radio-button label="SOC"></el-radio-button>
            <el-radio-button label="Temperature"></el-radio-button>
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
          <div id="batteryDetailsChart" class="batteryChart"></div>
        </template>
      </el-skeleton>
    </div>
  </el-dialog>
</template>
<script>
import * as echarts from "echarts"
import { networkStatus, storeStatus } from '@sub/utils/dict'

let batteryInstance = null
let arr = [], arr1 = [], arr5 = []
for (let i = 0; i < 24; i++) {
  arr.push(i)
}
const optionBat = {
  tooltip: {
    show: true,
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
    right: '5%',
    z: 5,
    zlevel: 10
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
      end: 1999,
      zlevel: '7'
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
  props: {
    base: {
      type: Object,
      default: () => {
        return {}
      }
    },
    batteryInfo: {
      type: Object,
      default: () => {
        return {}
      }
    },
    dialogHisData: {
      type: Array,
      default: () => {
        return []
      }
    },
    show: Boolean
  },
  watch: {
    dialogHisData() {
      this.loading = true
      this.$nextTick(() => {
        this.changeBatType()
      })
    },
  },
  data() {
    const that = this
    return {
      networkStatus,
      storeStatus,
      loading: true,
      batEnergy: {},
      batteryHis: {
        batteryType: 'Voltage',
        dateVal: new Date(that.UTC_START_OF(this.base.timeZone))
      },
    }
  },
  methods: {
    toBms() {
      this.$emit('update:show', false)
      this.$router.push({
        name: 'monitoring-view',
        params: {id: this.batteryInfo.id, info: this.batteryInfo.extInfo, sn: this.batteryInfo.sn, siteCode: this.$route.query.siteCode}
      })
    },
    beforeClose() {
      this.$emit('update:show', false)
      this.loading = true
      this.batteryHis.dateVal = new Date(this.UTC_START_OF(this.base.timeZone))
    },
    changeSize() {
      if (batteryInstance) batteryInstance.resize()
    },
    changeBatDate() {
      this.loading = true
      if (batteryInstance) {
        batteryInstance.dispose()
        batteryInstance = null
      }
      this.$emit('date', this.batteryHis.dateVal)
    },
    changeBatType() {
      arr5 = []
      for(let i = 0; i < this.dialogHisData.length; i++) {
        arr5.push(this.dialogHisData[i].timestamp)
      }
      optionBat.xAxis[0].data = arr5
      arr1 = []
      let arr2 = []
      optionBat.series = []
      if (this.batteryHis.batteryType === 'Voltage') {
        optionBat.yAxis.name = 'V'
        for(let i = 0; i < this.dialogHisData.length; i++) {
          arr1.push((+this.dialogHisData[i].storeVoltage).toFixed(2))
        }
      }
      if (this.batteryHis.batteryType === 'Current') {
        optionBat.yAxis.name = 'A'
        for(let i = 0; i < this.dialogHisData.length; i++) {
          arr1.push((+this.dialogHisData[i].storeCurrent).toFixed(2))
        }
      }
      if (this.batteryHis.batteryType === 'Power') {
        optionBat.yAxis.name = 'kW'
        for(let i = 0; i < this.dialogHisData.length; i++) {
          arr1.push((+this.dialogHisData[i].storeChargePower).toFixed(2))
        }
      }
      if (this.batteryHis.batteryType === 'SOC') {
        optionBat.yAxis.name = '%'
        for(let i = 0; i < this.dialogHisData.length; i++) {
          arr1.push((+this.dialogHisData[i].storeSoc).toFixed(2))
        }
      }
      if (this.batteryHis.batteryType === 'Temperature') {
        optionBat.yAxis.name = '℃'
        optionBat.legend = {
          left: 40,
          data: ['minTemperature', 'maxTemperature'],
          icon: 'circle'
        }
        for(let i = 0; i < this.dialogHisData.length; i++) {
          arr1.push((+this.dialogHisData[i].maxTemperature).toFixed(2))
          arr2.push((+this.dialogHisData[i].minTemperature).toFixed(2))
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
          name: 'minTemperature',
          symbol: 'none',
          type: 'line',
          smooth: true,
          itemStyle: {
            color: '#FFB968'
          },
          data: arr2
        }
        itemOne.name = 'maxTemperature'
        optionBat.series.push(itemTwo)
      }
      optionBat.series.push(itemOne)
      if (batteryInstance) {
        batteryInstance.dispose()
        batteryInstance= null
      }
      this.loading = false
      this.$nextTick(() => {
        batteryInstance = echarts.init(document.getElementById('batteryDetailsChart'))
        batteryInstance.setOption(optionBat)
        window.addEventListener('resize', this.changeSize)
      })
    },

  }
}
</script>

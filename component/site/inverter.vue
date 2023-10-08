<template>
  <div class="comp-device-card-content-right">
    <div class="part">
      <div class="part-title">Basic Info</div>
      <common-flex>
        <common-flex class="part-img-box" justify="center">
          <img class="device-img" :src="require('./img/device-inverter.svg')" alt="">
        </common-flex>
        <el-form disabled style="padding-right: 24px; flex-grow: 1" label-width="260px" label-position="top">
          <el-row type="flex" :gutter="60">
            <el-col :span="10"><el-form-item label="Current working mode"><el-input v-model="['Off-line', 'On-line'][+curDevInfo.net]"></el-input></el-form-item></el-col>
            <el-col :span="10"><el-form-item label="New installation"><el-input v-model="['', 'Yes', 'No'][+curDevInfo.installation]"></el-input></el-form-item></el-col>
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
            <el-col :span="10"><el-form-item label="Rated power (kW)"><el-input readonly v-model="curDevInfo.nameplateCapacity"></el-input></el-form-item></el-col>
          </el-row>
<!--          // 设备类型 1-1.5 2-mini  3-1.0-->
          <template v-if="+curDevInfo.type === 1">
            <el-row type="flex" :gutter="60">
              <el-col :span="10"><el-form-item label="Hardware version"><el-input readonly v-model="curDevInfo.hardVersion"></el-input></el-form-item></el-col>
              <el-col :span="10"><el-form-item label="Software version"><el-input readonly v-model="curDevInfo.version"></el-input></el-form-item></el-col>
            </el-row>
            <el-row type="flex" :gutter="60">
              <el-col :span="10"><el-form-item label="Last version upgrade time"><el-input readonly v-model="curDevInfo.upgradeTime"></el-input></el-form-item></el-col>
              <el-col :span="10"><el-form-item label="Inverter phase"><el-input readonly v-model="curDevInfo.phase"></el-input></el-form-item></el-col>
            </el-row>
            <el-row type="flex" :gutter="60">
              <el-col :span="10"><el-form-item label="Manufacturer"><el-input readonly v-model="curDevInfo.manufacturer"></el-input></el-form-item></el-col>
            </el-row>
          </template>
        </el-form>
      </common-flex>
    </div>
    <div style="margin-top: 24px">
      <el-radio-group v-model="name">
        <el-radio-button label="grid">Grid</el-radio-button>
        <el-radio-button label="load">Load</el-radio-button>
      </el-radio-group>
      <div class="part" v-if="name === 'grid'">
        <div class="part-title">Real-Time Data</div>
        <common-flex>
          <common-flex class="part-img-box" justify="center">
            <img class="device-img" :src="require('./img/device-grid.svg')" alt="">
          </common-flex>
          <el-form disabled style="padding-right: 24px; flex-grow: 1" label-width="260px" label-position="top">
            <el-row type="flex" :gutter="60">
              <el-col :span="10"><el-form-item label="Status"><el-input v-model="gridStatus"></el-input></el-form-item></el-col>
            </el-row>
            <el-row type="flex" :gutter="60">
              <el-col :span="20">
                <el-table class="table" :data="curDevInfo.gridList">
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
            <div class="part-title" style="border: none; line-height: 35px; margin-right: 12px">Export Energy:</div>
          </common-flex>
          <el-form disabled style="padding-right: 24px; flex-grow: 1" label-width="260px" label-position="top">
            <el-row type="flex" :gutter="60">
              <el-col :span="10"><el-form-item label="Today(kWh)"><el-input v-model="curDevInfo.dayGridExportEnergy"></el-input></el-form-item></el-col>
              <el-col :span="10"><el-form-item label="This Month(kWh)"><el-input v-model="curDevInfo.monthGridExportEnergy"></el-input></el-form-item></el-col>
            </el-row>
            <el-row type="flex" :gutter="60">
              <el-col :span="10"><el-form-item label="This Year(kWh)"><el-input v-model="curDevInfo.yearGridExportEnergy"></el-input></el-form-item></el-col>
              <el-col :span="10"><el-form-item label="Lifetime(kWh)"><el-input v-model="curDevInfo.allGridExportEnergy"></el-input></el-form-item></el-col>
            </el-row>
          </el-form>
        </common-flex>

        <common-flex style="margin-top: 24px">
          <common-flex class="part-img-box" justify="flex-end">
            <div class="part-title" style="border: none; line-height: 35px; margin-right: 12px">Import Energy:</div>
          </common-flex>
          <el-form disabled style="padding-right: 24px; flex-grow: 1" label-width="260px" label-position="top">
            <el-row type="flex" :gutter="60">
              <el-col :span="10"><el-form-item label="Today(kWh)"><el-input v-model="curDevInfo.dayGridBuyEnergy"></el-input></el-form-item></el-col>
              <el-col :span="10"><el-form-item label="This Month(kWh)"><el-input v-model="curDevInfo.monthGridBuyEnergy"></el-input></el-form-item></el-col>
            </el-row>
            <el-row type="flex" :gutter="60">
              <el-col :span="10"><el-form-item label="This Year(kWh)"><el-input v-model="curDevInfo.yearGridBuyEnergy"></el-input></el-form-item></el-col>
              <el-col :span="10"><el-form-item label="Lifetime(kWh)"><el-input v-model="curDevInfo.allGridBuyEnergy"></el-input></el-form-item></el-col>
            </el-row>
          </el-form>
        </common-flex>
      </div>
      <div class="part" v-else>
        <div class="part-title">Real-Time Data</div>
        <common-flex>
          <common-flex class="part-img-box" justify="center">
            <img class="device-img" :src="require('./img/device-load.svg')" alt="">
          </common-flex>
          <el-form disabled style="padding-right: 24px; flex-grow: 1" label-width="260px" label-position="top">
            <el-row type="flex" :gutter="60">
              <el-col :span="20">
                <el-table class="table" :data="curDevInfo.loadList">
                  <el-table-column label="" prop="pvNum"></el-table-column>
                  <el-table-column label="Voltage(V)" prop="v"></el-table-column>
                  <el-table-column label="Current(A)" prop="c"></el-table-column>
                  <el-table-column label="Power(kW)" prop="p"></el-table-column>
                </el-table>
              </el-col>
            </el-row>
          </el-form>
        </common-flex>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'comp-inverter',
  props: {
    curDevInfo: {
      type: Object,
      default: () => {
        return {}
      }
    },
  },
  watch: {
    curDevInfo(v) {
      console.log('inverter', v)
    }
  },
  data() {
    return {
      name: 'grid',
      gridStatus: 'Export'
    }
  }
}
</script>

<style lang="scss">

</style>

<template>
  <div class="comp-device-card-content-right">
    <div class="part">
      <div class="part-title">{{ $t('common.basicInfo') }}</div>
      <common-flex>
        <common-flex class="part-img-box" justify="center">
          <img class="device-img" :src="require('./img/device-inverter.svg')" alt="">
        </common-flex>
        <el-form disabled style="padding-right: 24px; flex-grow: 1" label-width="260px" label-position="top">
          <el-row type="flex" :gutter="60">
<!--            自发自用字段-->
            <el-col :span="10"><el-form-item :label="$t('site.currentWorkingMode')"><el-input v-model="curDevInfo.workMode"></el-input></el-form-item></el-col>
            <el-col :span="10">
              <el-form-item :label="$t('site.newInstallation')">
                <el-input disabled type="text" />
                <dict-tag class="posa" style="bottom: 0; left: 20px; color: #C0C4CC" :options="newInstall" :value="curDevInfo.installation"/>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row type="flex" :gutter="60">
            <el-col :span="10"><el-form-item :label="$t('common.lifetime')"><el-input v-model="curDevInfo.lifetime"></el-input></el-form-item></el-col>
          </el-row>
        </el-form>
      </common-flex>

      <common-flex style="padding-top: 12px; background-color: #F5F7FA; border-top: 1px solid #D8DCE6">
        <common-flex class="part-img-box" justify="center"></common-flex>
        <el-form style="padding-right: 24px; flex-grow: 1" label-width="260px" label-position="top">
          <el-row type="flex" :gutter="60">
            <el-col :span="10"><el-form-item :label="$t('common.serialNumber')"><el-input readonly v-model="curDevInfo.serialNumber"></el-input></el-form-item></el-col>
            <el-col :span="10"><el-form-item :label="`${$t('site.ratedPower')}(kW)`"><el-input readonly v-model="curDevInfo.nameplateCapacity"></el-input></el-form-item></el-col>
          </el-row>
<!--          // 设备类型 1-1.5 2-mini  3-1.0-->
          <template v-if="[1, 2].includes(+curDevInfo.type)">
            <el-row type="flex" :gutter="60">
              <el-col :span="10"><el-form-item :label="$t('common.hardwareVersion')"><el-input readonly v-model="curDevInfo.hardVersion"></el-input></el-form-item></el-col>
              <el-col :span="10"><el-form-item :label="$t('common.softwareVersion')"><el-input readonly v-model="curDevInfo.version"></el-input></el-form-item></el-col>
            </el-row>
            <el-row type="flex" :gutter="60">
              <el-col :span="10"><el-form-item :label="$t('common.lastVersionUpgradeTime')"><el-input readonly v-model="curDevInfo.upgradeTime"></el-input></el-form-item></el-col>
<!--              <el-col :span="10"><el-form-item :label="$t('common.inverterPhase')"><el-input readonly v-model="curDevInfo.phase"></el-input></el-form-item></el-col>-->
              <el-col :span="10"><el-form-item :label="$t('common.manufacturer')"><el-input readonly v-model="curDevInfo.manufacturer"></el-input></el-form-item></el-col>
            </el-row>
<!--            <el-row type="flex" :gutter="60">-->
<!--              <el-col :span="10"><el-form-item :label="$t('common.manufacturer')"><el-input readonly v-model="curDevInfo.manufacturer"></el-input></el-form-item></el-col>-->
<!--            </el-row>-->
          </template>
        </el-form>
      </common-flex>
    </div>
    <div style="margin-top: 24px">
      <el-radio-group v-model="name">
        <el-radio-button label="grid">{{ $t('common.grid') }}</el-radio-button>
        <el-radio-button label="load">{{ $t('common.load') }}</el-radio-button>
      </el-radio-group>
      <div class="part" v-if="name === 'grid'">
        <div class="part-title">{{ $t('common.realtimeData') }}</div>
        <common-flex>
          <common-flex class="part-img-box" justify="center">
            <img class="device-img" :src="require('./img/device-grid.svg')" alt="">
          </common-flex>
          <el-form disabled style="padding-right: 24px; flex-grow: 1" label-width="260px" label-position="top">
            <el-row type="flex" :gutter="60">
              <el-col :span="10"><el-form-item :label="$t('common.status')">
                <el-input disabled type="text" />
                <dict-tag class="posa" style="bottom: 0; left: 20px; color: #C0C4CC" :options="gridStatus" :value="curDevInfo.gridStatus"/>
              </el-form-item></el-col>
            </el-row>
            <el-row type="flex" :gutter="60">
              <el-col :span="20">
                <el-table class="table" :data="curDevInfo.gridList">
                  <el-table-column label="" prop="pvNum"></el-table-column>
                  <el-table-column :label="`${$t('common.voltage')}(V)`" prop="v"></el-table-column>
                  <el-table-column :label="`${$t('common.current')}(A)`" prop="c"></el-table-column>
                  <el-table-column :label="`${$t('common.power')}(kW)`" prop="p"></el-table-column>
                </el-table>
              </el-col>
            </el-row>
          </el-form>
        </common-flex>

        <common-flex style="margin-top: 24px">
          <common-flex class="part-img-box" justify="flex-end">
            <div class="part-title" style="border: none; line-height: 35px; margin-right: 12px">{{ $t('site.exportEnergy') }}:</div>
          </common-flex>
          <el-form disabled style="padding-right: 24px; flex-grow: 1" label-width="260px" label-position="top">
            <el-row type="flex" :gutter="60">
              <el-col :span="10"><el-form-item :label="`${$t('common.today')}(kWh)`"><el-input v-model="curDevInfo.dayGridExportEnergy"></el-input></el-form-item></el-col>
              <el-col :span="10"><el-form-item :label="`${$t('common.thisMonth')}(kWh)`"><el-input v-model="curDevInfo.monthGridExportEnergy"></el-input></el-form-item></el-col>
            </el-row>
            <el-row type="flex" :gutter="60">
              <el-col :span="10"><el-form-item :label="`${$t('common.thisYear')}(kWh)`"><el-input v-model="curDevInfo.yearGridExportEnergy"></el-input></el-form-item></el-col>
              <el-col :span="10"><el-form-item :label="`${$t('common.lifetime')}(kWh)`"><el-input v-model="curDevInfo.allGridExportEnergy"></el-input></el-form-item></el-col>
            </el-row>
          </el-form>
        </common-flex>

        <common-flex style="margin-top: 24px">
          <common-flex class="part-img-box" justify="flex-end">
            <div class="part-title" style="border: none; line-height: 35px; margin-right: 12px">{{ $t('site.importEnergy') }}:</div>
          </common-flex>
          <el-form disabled style="padding-right: 24px; flex-grow: 1" label-width="260px" label-position="top">
            <el-row type="flex" :gutter="60">
              <el-col :span="10"><el-form-item :label="`${$t('common.today')}(kWh)`"><el-input v-model="curDevInfo.dayGridBuyEnergy"></el-input></el-form-item></el-col>
              <el-col :span="10"><el-form-item :label="`${$t('common.thisMonth')}(kWh)`"><el-input v-model="curDevInfo.monthGridBuyEnergy"></el-input></el-form-item></el-col>
            </el-row>
            <el-row type="flex" :gutter="60">
              <el-col :span="10"><el-form-item :label="`${$t('common.thisYear')}(kWh)`"><el-input v-model="curDevInfo.yearGridBuyEnergy"></el-input></el-form-item></el-col>
              <el-col :span="10"><el-form-item :label="`${$t('common.lifetime')}(kWh)`"><el-input v-model="curDevInfo.allGridBuyEnergy"></el-input></el-form-item></el-col>
            </el-row>
          </el-form>
        </common-flex>
      </div>
      <div class="part" v-else>
        <div class="part-title">{{ $t('common.realtimeData') }}</div>
        <common-flex>
          <common-flex class="part-img-box" justify="center">
            <img class="device-img" :src="require('./img/device-load.svg')" alt="">
          </common-flex>
          <el-form disabled style="padding-right: 24px; flex-grow: 1" label-width="260px" label-position="top">
            <el-row type="flex" :gutter="60">
              <el-col :span="20">
                <el-table class="table" :data="curDevInfo.loadList">
                  <el-table-column label="" prop="pvNum"></el-table-column>
                  <el-table-column :label="`${$t('common.voltage')}(V)`" prop="v"></el-table-column>
                  <el-table-column :label="`${$t('common.current')}(A)`" prop="c"></el-table-column>
                  <el-table-column :label="`${$t('common.power')}(kW)`" prop="p"></el-table-column>
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
import { gridStatus, newInstall } from '@sub/utils/dict'
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
  // watch: {
  //   curDevInfo(v) {
  //     console.log('inverter', v)
  //   }
  // },
  data() {
    return {
      gridStatus,
      newInstall,
      name: 'grid',
    }
  }
}
</script>

<style lang="scss">

</style>

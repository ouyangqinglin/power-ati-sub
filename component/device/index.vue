<template>
  <div class="pages-device app-container">
    <el-card class="pages-device-card pane">
      <el-tabs v-model="deviceType" @tab-click="tabToggle">
        <el-tab-pane name="4" :label="`${$t('device.type.stickLogger')} (${stickTotal})`"></el-tab-pane>
        <el-tab-pane name="1" :label="`${$t('device.type.inverter')} (${inverterTotal})`"></el-tab-pane>
        <el-tab-pane name="2" :label="`${$t('device.type.battery')} (${batteryTotal})`"></el-tab-pane>
        <el-tab-pane name="3" :label="`${$t('device.type.charger')} (${chargeTotal})`"></el-tab-pane>
        <el-tab-pane name="6" :label="`${$t('device.type.pv')} (${pvTotal})`"></el-tab-pane>
      </el-tabs>
    </el-card>
    <el-card style="margin-top: 24px">
      <el-form :inline="true" :model="queryParams" ref="queryForm">
        <common-flex justify="space-between">
          <common-flex style="flex-grow: 4" wrap="wrap">
            <el-form-item label="SN：" prop="serialNumber">
              <el-input clearable @keyup.enter.native="handleQuery" class="same-input" v-model="queryParams.serialNumber" :placeholder="$t('common.pleaseEnter')"></el-input>
            </el-form-item>
            <el-form-item :label="`${$t('device.site')}：`" prop="siteName">
              <el-input clearable @keyup.enter.native="handleQuery" class="same-input" v-model="queryParams.siteName" :placeholder="$t('common.pleaseEnter')"></el-input>
            </el-form-item>
          </common-flex>
          <common-flex justify="flex-end" style="flex-grow: 1; flex-shrink: 0">
            <el-form-item>
              <el-button type="primary" @click="handleQuery">{{ $t('common.query') }}</el-button>
              <el-button @click="resetQuery">{{ $t('common.reset') }}</el-button>
            </el-form-item>
          </common-flex>
        </common-flex>
      </el-form>
    </el-card>
    <el-card style="margin-top: 24px">
      <el-table :header-cell-style="{'text-align': 'center', 'border-bottom': 'none' }" :cell-style="{'text-align': 'center', 'border-left': 'none', 'border-right': 'none', 'border-top': 'none'}"
                v-loading="loading" :data="list" border
      >
        <el-table-column :label="$t('common.no')" align="center" width="60">
          <template slot-scope="scope">
            {{ (+queryParams.pageNum - 1) * (+queryParams.pageSize) + scope.$index + 1 }}
          </template>
        </el-table-column>
        <el-table-column :label="$t('device.type')" prop="deviceType" min-width="120">
          <template slot-scope="{ row }">
            <dict-tag :options="productType" :value="row.deviceType"></dict-tag>
          </template>
        </el-table-column>
        <el-table-column label="SN" prop="serialNumber" min-width="140">
          <template slot-scope="{ row }">
            <common-flex align="center" justify="center">
              <span>{{ row.serialNumber }}</span>
              <el-tooltip v-if="!(+row.workStatus === 1 || !row.workStatus)" effect="dark" placement="top-start">
                <common-flex align="center" slot="content">
                  <img v-if="+row.workStatus === 2" style="margin-right: 3px; width: 20px; height: 20px" :src="require('@img/device-warning.svg')" alt="">
                  <img v-else style="margin-right: 3px; width: 20px; height: 20px" :src="require('@img/device-fault.svg')" alt="">
                  <div>{{ hoverWarn || '--' }}</div>
                </common-flex>
                <img v-if="+row.workStatus === 2" class="device-tips" :src="require('@img/device-warning.svg')" alt="" @mouseenter="dynamicCon(row)">
                <img v-else class="device-tips" :src="require('@img/device-fault.svg')" alt="" @mouseenter="dynamicCon(row)">
              </el-tooltip>
            </common-flex>
          </template>
        </el-table-column>
        <el-table-column :label="$t('device.installationStatus')" prop="" min-width="140">
          <template slot-scope="{ row }">
            <dict-tag :options="deviceInstallStatus" :value="row.installStatus"></dict-tag>
          </template>
        </el-table-column>
        <el-table-column :label="`${$t('site.ratedPower')} (kW)`" prop="nameplateCapacity" min-width="140" v-if="+deviceType === 1" />
        <el-table-column :label="`${$t('common.capacity')} (kWh)`" prop="nameplateCapacity" min-width="120" v-if="+deviceType === 2" />
        <el-table-column :label="`${$t('common.capacity')} (kW)`" prop="nameplateCapacity" min-width="120" v-if="+deviceType === 6" />
        <el-table-column :label="$t('device.site')" prop="siteName" min-width="120" show-overflow-tooltip>
          <template slot-scope="{ row }">
            <span v-if="+row.siteCode === -1">--</span>
            <span v-else>{{ row.siteName || '--'}}</span>
          </template>
        </el-table-column>
        <el-table-column :label="$t('common.operator')" prop="updateBy" min-width="120" show-overflow-tooltip />
        <el-table-column :label="$t('common.agency')" prop="agency" min-width="140" show-overflow-tooltip />
        <el-table-column :label="$t('device.deviceInstalledTime')" prop="bindTime" min-width="200">
          <template slot-scope="{ row }">
            <span v-if="row.bindTime && row.bindTime !== '--'">{{ UTC_DATE_FORMAT(row.bindTime, timeZone) }}</span>
            <span v-else>--</span>
          </template>
        </el-table-column>
        <el-table-column :label="$t('device.deviceUnbindTime')" prop="unBindTime" min-width="200">
          <template slot-scope="{ row }">
            <span v-if="row.unBindTime && row.unBindTime !== '--'">{{ UTC_DATE_FORMAT(row.unBindTime, timeZone) }}</span>
            <span v-else>--</span>
          </template>
        </el-table-column>
        <el-table-column :label="$t('common.operation')" fixed="right">
          <template slot-scope="{ row }">
            <router-link :to="`/device/details/${row.id}`"><el-button v-hasPermi="['ati:device:view']" type="text">{{$t('common.detail')}}</el-button></router-link>
          </template>
        </el-table-column>
      </el-table>
      <pagination
        v-show="total>0"
        :total="total"
        :page.sync="queryParams.pageNum"
        :limit.sync="queryParams.pageSize"
        @pagination="getList(deviceType)"
      />
    </el-card>
  </div>
</template>

<script>
import { warnList } from '@/api/site'
import { listDevice } from '@/api/device'
import {mapState} from "vuex"
import { productType, deviceInstallStatus } from '@sub/utils/dict'

const storageRes = {}
export default {
  name: "Device",
  data() {
    return {
      productType,
      deviceInstallStatus,
      hoverWarn: '',
      deviceType: '4',
      list: [],
      total: 0,
      inverterTotal: '',
      batteryTotal: '',
      chargeTotal: '',
      pvTotal: '',
      stickTotal: '',
      loading: false,
      queryParams: {
        deviceType: '',
        pageNum: 1,
        pageSize: 10,
        serialNumber: '',
        siteName: ''
      },
    }
  },
  computed: {
    ...mapState({
      'timeZone': state => state.user.timeZone,
    })
  },
  mounted() {
    this.getManyList()
  },
  methods: {
    dynamicCon(v) {
      let data = {
        siteCode: v.siteCode,
        deviceType: v.deviceType
      }
      let str = '', list = []
      warnList(data).then(res => {
        list = res.data
        if (list.length) {
          list.forEach(i => str += i)
          this.hoverWarn = str
        } else  this.hoverWarn = '--'
      })

    },
    async getManyList() {
      await this.firstGetList('1')
      await this.firstGetList('2')
      await this.firstGetList('3')
      await this.firstGetList('6')
      await this.getList('4')

    },
    firstGetList(type) {
      const typeFace = {
        '1': 'inverterTotal',
        '2': 'batteryTotal',
        '3': 'chargeTotal',
        '4': 'stickTotal',
        '6': 'pvTotal',
      }
      this.queryParams.deviceType = type
      listDevice(this.queryParams).then(res => {
        storageRes[`${type}~${this.queryParams.pageNum}`] = res
        this[`${typeFace[type]}`] = res.total
      })
    },
    getList(type) {
      this.loading = true
      const typeFace = {
        '1': 'inverterTotal',
        '2': 'batteryTotal',
        '3': 'chargeTotal',
        '4': 'stickTotal',
        '6': 'pvTotal',
      }
      this.queryParams.deviceType = type
      listDevice(this.queryParams).then(res => {
        if (this.queryParams.siteName || this.queryParams.serialNumber) {
          this.list = res.rows
          this.total = res.total
        } else {
          storageRes[`${type}~${this.queryParams.pageNum}`] = res
          this[`${typeFace[type]}`] = res.total
          this.list = storageRes[`${type}~${this.queryParams.pageNum}`].rows
          this.total = storageRes[`${type}~${this.queryParams.pageNum}`].total
        }
      }).finally(() => this.loading = false)
    },
    tabToggle() {
      this.queryParams.serialNumber = ''
      this.queryParams.siteName = ''
      this.queryParams.pageSize = 10
      this.queryParams.pageNum = 1
      if (storageRes[`${this.deviceType}~${this.queryParams.pageNum}`]) {
        this.list = storageRes[`${this.deviceType}~${this.queryParams.pageNum}`].rows
        this.total = storageRes[`${this.deviceType}~${this.queryParams.pageNum}`].total
        return
      }
      this.getList(this.deviceType)
    },
    resetQuery() {
      this.resetForm("queryForm")
      this.handleQuery()
    },
    handleQuery() {
      this.queryParams.pageNum = 1
      this.getList(this.deviceType)
    },
  }
}
</script>

<style lang="scss">
.pages-device {
  &-card {
    padding-bottom: 20px;
    &-title {
      margin-bottom: 25px;
      font-weight: 700;
    }
  }
  .pane {
    padding-bottom: 0;
    .el-tabs__nav-wrap {
      &:after {
        background-color: #fff;
      }
    }
    .el-card__body {
      padding-bottom: 0;
    }
  }
  .same-input {
    .el-input__inner {
      width: 230px;
      @media screen and (max-width: 1334px) {
        width: 160px;
      }
    }
  }
  .device-tips {
    margin-left: 2px;
    @include wh(20);
    cursor: pointer;
  }
}
</style>

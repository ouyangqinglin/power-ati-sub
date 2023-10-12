<template>
  <div class="comp-device-details app-container">
    <el-card>
      <span style="font-weight: 600">Device Info</span>
      <el-form class="form" disabled :model="base">
        <common-flex wrap="wrap">
          <el-form-item label="Product Type" prop="deviceType">
            <el-input v-model="deviceType[base.deviceType]"></el-input>
          </el-form-item>
          <el-form-item label="SN" prop="sn">
            <el-input v-model="base.sn"></el-input>
          </el-form-item>
          <el-form-item label="Agency" prop="agency">
            <el-input v-model="base.agency"></el-input>
          </el-form-item>
          <el-form-item label="Installation Status" prop="installStatus">
            <el-input v-model="installStatus[base.installStatus]"></el-input>
          </el-form-item>
          <el-form-item label="Networking Status" prop="net" v-if="+base.installStatus === 1">
            <el-input v-model="netStatus[base.net]"></el-input>
          </el-form-item>
          <el-form-item :label="dyLabel" prop="capacity" v-if="[1, 2, 6].includes(+base.deviceType)">
            <el-input v-model="base.capacity"></el-input>
          </el-form-item>
        </common-flex>
        <el-row type="flex" justify="end" v-if="[1, 2, 6].includes(+base.deviceType)">
          <el-button type="primary" :disabled="false" @click="openShow">Edit</el-button>
        </el-row>
      </el-form>
    </el-card>
    <el-card style="margin-top: 20px" v-if="+base.installStatus === 0">
      <span style="font-weight: 600">Unbind Info</span>
      <el-form class="form" disabled :model="base">
        <common-flex wrap="wrap">
          <el-form-item label="Time of Device Unbind" prop="unBindTime">
            <el-input v-model="base.unBindTime"></el-input>
          </el-form-item>
          <el-form-item label="Unbind Operator" prop="unBindOperator">
            <el-input v-model="base.unBindOperator"></el-input>
          </el-form-item>
        </common-flex>
      </el-form>
    </el-card>
    <el-card style="margin-top: 20px">
      <span style="font-weight: 600">Historical Installation Info</span>
      <el-form class="form" disabled :model="base">
        <common-flex wrap="wrap">
          <el-form-item label="Time of Device Installed" prop="installTime">
            <el-input v-model="base.installTime"></el-input>
          </el-form-item>
          <el-form-item label="Installed Operator" prop="bindOperator">
            <el-input v-model="base.bindOperator"></el-input>
          </el-form-item>
          <el-form-item label="Site Name" prop="siteName">
            <el-input v-model="base.siteName"></el-input>
          </el-form-item>
          <el-form-item label="Site Code" prop="siteCode">
            <el-input v-model="base.siteCode"></el-input>
          </el-form-item>
          <el-form-item label="Address" prop="address">
            <el-input type="textarea" v-model="base.address"></el-input>
          </el-form-item>
          <el-form-item label="Region" prop="city">
            <el-input v-model="base.region || '--'"></el-input>
          </el-form-item>
        </common-flex>
      </el-form>
    </el-card>
    <el-card v-if="[1, 2, 4].includes(+base.deviceType)" style="margin-top: 20px">
      <div style="font-weight: 600; margin-bottom: 20px">Firmware update</div>
      <el-form disabled :model="currentApk">
        <el-row :gutter="36">
          <el-col :span="6">
            <el-form-item label="Software Version" prop="currentVersion">
              <el-input v-model="currentApk.version"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="Hardware Version" prop="hardVersion">
              <el-input v-model="currentApk.hardVersion"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="Upgrade Time" prop="upgradeTime">
              <el-input v-model="currentApk.upgradeTime"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div style="font-weight: 600; margin: 20px 0">Upgrade Record</div>
      <el-table :header-cell-style="{'text-align': 'center'}" :cell-style="{'text-align': 'center'}"
                v-loading="loading" :data="list"
      >
        <el-table-column label="No." align="center" width="60">
          <template slot-scope="scope">
            {{ (+queryParams.pageNum - 1) * (+queryParams.pageSize) + scope.$index + 1 }}
          </template>
        </el-table-column>
        <el-table-column label="File Type" prop="fileType" min-width="160">
          <template slot-scope="{ row }">
            <dict-tag :options="dict.type.file_type" :value="row.fileType"></dict-tag>
          </template>
        </el-table-column>
        <el-table-column label="Software version" prop="versionNum"></el-table-column>
        <el-table-column label="Operation time" prop="">
          <template slot-scope="{ row }">
            <span v-if="row.createTime && row.createTime !== '--'">{{ DATE_FORMAT('M/d/yyyy hh:mm:ss', row.createTime) }}</span>
            <span v-else>--</span>
          </template>
        </el-table-column>
        <el-table-column label="Status" prop="status">
          <template slot-scope="{ row }">
            <span>{{ ['', 'Success', 'Fail', 'Upgrading'][row.status] }}</span>
          </template>
        </el-table-column>
      </el-table>
      <pagination
        v-show="total>0"
        :total="total"
        :page.sync="queryParams.pageNum"
        :limit.sync="queryParams.pageSize"
        @pagination="getList"
      />
    </el-card>
    <common-flex style="margin-top: 20px" justify="center"><el-button @click="cancel">Cancel</el-button></common-flex>
    <el-dialog
      title="Device Info"
      :before-close="beforeClose"
      :close-on-click-modal="false"
      width="46%"
      :visible.sync="show">
      <el-form :model="modal" :rules="rules" ref="editRef">
        <el-row>
          <el-col :span="14">
            <el-form-item :label="dyLabel" prop="capacity">
              <el-input v-model.trim="modal.capacity"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <el-row type="flex" justify="center">
        <el-button type="primary" :disabled="!modal.capacity" @click="editDevice">Save</el-button>
        <el-button @click="beforeClose">Cancel</el-button>
      </el-row>
    </el-dialog>
  </div>
</template>

<script>
import { baseDevice, updateDevice } from '@/api/device'
import { versionRecord, versionUpgrade} from "@/api/remote"
import {mapState} from "vuex";
export default {
  name: "comp-details",
  dicts: ['file_type'],
  data() {
    const validate = (rule, value, callback) => {
      const reg = /^(?!^\.)(\d*(\.\d{0,3})?)?$/
      if (value === '') {
        callback(new Error('Please enter'))
      } else {
        if (!reg.test(value)) {
          callback(new Error('At most three significant decimals'))
        } else callback()
      }
    }
    return {
      currentApk: {
        version: '',
        hardVersion: '',
        upgradeTime: ''
      },
      total: 0,
      modal: {
        capacity: 0
      },
      rules: {
        capacity: [
          {required: true, trigger: ['blur', 'change'], validator: validate}
        ]
      },
      loading: false,
      list: [],
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        sn: ''
      },
      base: {},
      show: false,
      deviceType: {
        '1': 'Inverter',
        '2': 'Battery',
        '3': 'EV Charger',
        '4': 'Stick Logger',
        '6': 'Photovoltaic',
      },
      installStatus: {
        '0': 'Unbind',
        '1': 'Installed'
      },
      netStatus: {
        '0': 'Off-line',
        '1': 'On-line'
      }
    }
  },
  computed: {
    ...mapState({
      'timeZone': state => state.user.timeZone,
    }),
    dyLabel() {
      let map = {
        1: 'Rated Power (kW)',
        2: 'Capacity (kWh)',
        6: 'Total Component capacity(kW) ',
      }
      return map[+this.base.deviceType]
    }
  },
  mounted() {
    baseDevice(this.$route.params.id).then(res => {
      if (res.data.installTime) res.data.installTime = this.UTC_DATE_FORMAT(res.data.installTime, this.timeZone)
      if (res.data.unBindTime) res.data.unBindTime = this.UTC_DATE_FORMAT(res.data.unBindTime, this.timeZone)
      res.data.region = ''
      if (res.data.city) res.data.region = `${res.data.city}`
      if (res.data.province) res.data.region = `${res.data.region}${res.data.province}`
      if (res.data.country) res.data.region = `${res.data.region}${res.data.country}`
      this.queryParams.sn = res.data.sn
      this.base = res.data
      this.getList()
      if (res.data.upgradeTime) this.currentApk.upgradeTime = this.UTC_DATE_FORMAT(res.data.upgradeTime, this.timeZone)
      this.currentApk.version = res.data.version
      this.currentApk.hardVersion = res.data.hardVersion
    })
  },
  methods: {
    editDevice() {
      let data = {
        id: this.$route.params.id,
        nameplateCapacity: this.modal.capacity,
        deviceType: this.base.deviceType
      }
      this.$refs.editRef.validate(v => {
        if (v) {
          this.$modal.loading()
          updateDevice(data).then(res => {
            if (+res.code === 200) {
              this.$modal.msgSuccess('Succeed')
              this.base.capacity = data.nameplateCapacity
              this.beforeClose()
            }
          }).finally(() => this.$modal.closeLoading())
        }
      })

    },
    openShow() {
      this.show = true
      this.modal.capacity = this.base.capacity
    },
    beforeClose() {
      this.show = false
      this.modal.capacity = this.base.capacity
    },
    cancel() {
      history.go(-1)
    },
    getList() {
      this.loading = true
      versionRecord(this.queryParams).then(res => {
        this.list = res.rows
        this.total = res.total
      }).finally(() => {
        this.loading = false
      })
    },
  }
}
</script>

<style lang="scss">
.comp-device-details {
  .el-icon-arrow-left {
    margin-right: 5px;
    cursor: pointer;
    font-weight: 700;
  }
  .form {
    margin-top: 10px;
    .el-form-item {
      margin-right: 60px;
      width: calc(100% / 3 - 60px);
    }
    >:nth-child(3n) {
      margin-right: 0;
    }
  }
}
</style>

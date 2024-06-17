<template>
  <div>
    <el-card>
      <el-row type="flex" justify="space-between" align="center" style="margin-bottom: 20px">
        <strong>{{ $t('upgrade.firmWare') }}</strong>
        <el-button v-has-permi="['device:upgrade']" type="primary" @click="openShow">{{ $t('upgrade.upgrade') }}</el-button>
      </el-row>
      <el-table :header-cell-style="{'text-align': 'center', 'border-bottom': 'none' }" :cell-style="{'text-align': 'center', 'border-left': 'none', 'border-right': 'none', 'border-top': 'none'}"
                :data="list" border
      >
        <el-table-column :label="$t('common.no')" align="center" width="60">
          <template slot-scope="scope">
            {{ (+queryParams.pageNum - 1) * (+queryParams.pageSize) + scope.$index + 1 }}
          </template>
        </el-table-column>
        <el-table-column :label="$t('upgrade.componentM')" prop="fileType" min-width="120">
          <template slot-scope="{ row }">
            <dict-tag :options="fileType" :value="row.fileType"></dict-tag>
          </template>
        </el-table-column>
        <el-table-column :label="$t('upgrade.componentS')" prop="component" min-width="120">
          <template slot-scope="{ row }">
            <dict-tag :options="inverterVersion" :value="+row.component"></dict-tag>
          </template>
        </el-table-column>
        <el-table-column :label="$t('common.manufacturer')" prop="manufacturer" min-width="120">
          <template slot-scope="{ row }">
            <span>{{manuLabel(row)}}</span>
          </template>
        </el-table-column>
        <el-table-column :label="$t('upgrade.submodule')" prop="subModule" min-width="120">
          <template slot-scope="{ row }">
            <span>{{submoduleLabel(row)}}</span>
          </template>
        </el-table-column>
        <el-table-column :label="$t('upgrade.applicationType')" prop="applicationType" min-width="140">
          <template slot-scope="{ row }">
            <dict-tag :options="appOptions" :value="row.applicationType"></dict-tag>
          </template>
        </el-table-column>
        <el-table-column :label="$t('common.softwareVersion')" prop="versionNum" min-width="140"></el-table-column>
        <el-table-column :label="$t('upgrade.firmwareName')" prop="name" show-overflow-tooltip min-width="140"></el-table-column>
        <el-table-column :label="$t('upgrade.operationTime')" prop="" min-width="140">
          <template slot-scope="{ row }">
            <span v-if="row.createTime && row.createTime !== '--'">{{ DATE_FORMAT('M/d/yyyy hh:mm:ss', row.createTime) }}</span>
            <span v-else>--</span>
          </template>
        </el-table-column>
        <el-table-column :label="$t('common.status')" prop="status" min-width="160" fixed="right">
          <template slot-scope="{ row }">
            <common-flex style="width: 100%" align="center" justify="center">
              <el-progress :percentage="row.progress" style="flex-grow: 0.7" v-if="+row.status === 3"></el-progress>
              <span v-if="+row.status === 3">{{ +row.progress > 10 ? 'update device…' : 'download from cloud...'}}</span>
              <dict-tag v-else :options="upgradeResStatus" :value="row.status"></dict-tag>
            </common-flex>
          </template>
        </el-table-column>
        <el-table-column :label="$t('upgrade.failReason')" prop="reasonForFailure" min-width="120">
          <template slot-scope="{ row }">
            <span v-if="row.status === 2">{{ updateFailReasonMap[row.reasonForFailure] }}</span>
          </template>
        </el-table-column>
      </el-table>
      <div style="padding-bottom: 20px">
        <pagination
          v-show="total>0"
          :total="total"
          :page.sync="queryParams.pageNum"
          :limit.sync="queryParams.pageSize"
          @pagination="getList"
        />
      </div>
    </el-card>
    <div v-if="show">
      <el-dialog :visible.sync="show" :title="$t('upgrade.upgrade')"
                 :before-close="beforeClose"
                 :close-on-click-modal ="false"
                 width="46%">
        <el-form :model="toastData" :rules="rules" ref="toastRef" label-position="top">
          <el-row :gutter="24">
            <el-col :span="10">
              <el-form-item :label="$t('upgrade.componentM')" prop="fileType">
                <el-select style="width: 100%" v-model="toastData.fileType" :placeholder="$t('common.pleaseSelect')" @change="getVersionList()">
                  <el-option v-for="i of compMOptions" :key="i.value" :label="i.label" :value="i.value"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="10">
              <el-form-item :label="$t('common.manufacturer')" prop="manufacturer">
                <el-select style="width: 100%" v-model="toastData.manufacturer" :placeholder="$t('common.pleaseSelect')" :disabled="disabledManu" @change="getVersionList()">
                  <el-option v-for="i of manufacturerOptions" :key="i.value" :label="i.label" :value="i.value"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="24">
            <el-col :span="10">
              <el-form-item :label="$t('upgrade.componentS')" prop="component">
                <el-select style="width: 100%" v-model="toastData.component" :placeholder="$t('common.pleaseSelect')" :disabled="disabledComp" @change="getVersionList()">
                  <el-option v-for="i of compSOptions" :key="i.value" :label="i.label" :value="i.value"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="10">
              <el-form-item :label="$t('upgrade.submodule')" prop="subModule">
                <el-select style="width: 100%" v-model="toastData.subModule" :placeholder="$t('common.pleaseSelect')" :disabled="disabledSubmodule" @change="getVersionList()">
                  <el-option v-for="i of submoduleOptions" :key="i.value" :label="i.label" :value="i.value"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="24">
            <el-col :span="10">
              <el-form-item :label="$t('upgrade.applicationType')" prop="applicationType">
                <el-select style="width: 100%" v-model="toastData.applicationType" :placeholder="$t('common.pleaseSelect')" @change="getVersionList()">
                  <el-option v-for="i of appOptions" :key="i.value" :label="i.label" :value="i.value"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="10">
              <el-form-item :label="$t('upgrade.firmwareName')" prop="name">
                <el-input :placeholder="$t('common.pleaseEnter')" v-model="toastData.name" maxlength="50" readonly></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="24">
            <el-col :span="10">
              <el-form-item :label="$t('common.version')" prop="newVersion">
                <el-select style="width: 100%" v-model="toastData.newVersion" @change="getVersion">
                  <el-option v-for="(i, k) of newVersionList" :value="i.versionNum" :label="i.versionNum" :key="k"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
        <common-flex justify="center">
          <el-button type="primary" @click="submit">{{ $t('common.submit') }}</el-button>
          <el-button @click="abort">{{ $t('common.cancel') }}</el-button>
        </common-flex>
        <common-flex class="mt10" justify="center" style="color: #65c9dd;" v-show="[1, 2].includes(toastData.fileType)">This upgrade is expected to take 20 minutes. Please be patient and wait!</common-flex>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import {versionList, versionRecord, versionUpgrade} from "@/api/remote"
import {
  fileType,
  comMType,
  applicationType,
  inverterVersion,
  manufacturerTBox,
  manufacturerPcs,
  manufacturerBms,
  submoduleBms,
  submoduleSignalBms,
  submodulePcs,
  upgradeResStatus,
  bmsType
} from '@sub/utils/dict'
import { updateFailReasonMap } from '@sub/utils/map'
let timer = null
export default {
  name: "comp-site-firmware",
  props: {
    base: {
      type: Object,
      default: () => {
        return {}
      }
    }
  },
  data() {
    return {
      fileType,
      inverterVersion,
      bmsType,
      upgradeResStatus,
      updateFailReasonMap,
      toastData: {
        fileType: '',
        newVersion: '',
        component: '',
        subModule: '',
        manufacturer: '',
        applicationType: '',
        name: '',
      },
      rules: {
        newVersion: [
          { required: true, trigger: 'blur', message: this.$t('common.pleaseSelect') }
        ],
        fileType: [
          { required: true, message: this.$t('common.pleaseSelect'), trigger: ['change', 'blur']}
        ],
        component: [
          { required: true, message: this.$t('common.pleaseSelect'), trigger: ['change', 'blur']}
        ],
        subModule: [
          { required: true, message: this.$t('common.pleaseSelect'), trigger: ['change', 'blur']}
        ],
        manufacturer: [
          { required: true, message: this.$t('common.pleaseSelect'), trigger: ['change', 'blur']}
        ],
        applicationType: [
          { required: true, message: this.$t('common.pleaseSelect'), trigger: ['change', 'blur']}
        ],
        name: [
          { required: true, message: this.$t('common.pleaseEnter'), trigger: 'blur'}
        ],
      },
      compMOptions: comMType,
      appOptions: applicationType,
      disabledComp: false,
      disabledManu: false,
      disabledSubmodule: false,
      show: false,
      currentApk: {
        currentVersion: '',
        hardVersion: '',
        upgradeTime: ''
      },
      total: 0,
      newVersionList: [],
      list: [],
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        siteCode: '',
      },
    }
  },
  computed: {
    compSOptions() {
      return +this.toastData.fileType === 0 ? inverterVersion : +this.toastData.fileType === 1 ? bmsType: []
    },
    manufacturerOptions() {
      return +this.toastData.fileType === 0 ? manufacturerTBox : +this.toastData.fileType === 1 ? manufacturerBms : +this.toastData.fileType === 2 ? manufacturerPcs : []
    },
    submoduleOptions() {
      const bmsMap = {
        0: submoduleSignalBms,
        11: submoduleBms,
        13: submoduleBms
      }
      return +this.toastData.fileType === 0 ? [] : +this.toastData.fileType === 1 ? bmsMap[+this.toastData.component] : +this.toastData.fileType === 2 ? submodulePcs : []
    }
  },
  watch: {
    disabledComp(v) {
      this.rules.component[0].required = !v
    },
    disabledManu(v) {
      this.rules.manufacturer[0].required = !v
    },
    disabledSubmodule(v) {
      this.rules.subModule[0].required = !v
    },
    'toastData.fileType': {
      handler(v) {
        if (+v === 0) {
          this.disabledComp = false
          this.disabledManu = true
          this.disabledSubmodule = true
          this.toastData.manufacturer = 0
          this.toastData.subModule = ''
        } else {
          this.disabledComp = +v !== 1;
          this.disabledManu = false
          this.disabledSubmodule = false
          this.toastData.manufacturer = ''
          this.toastData.component = ''
          this.toastData.subModule = ''
        }
      }
    },
    'toastData.component': {
      handler(v) {
        this.toastData.subModule = ''
      }
    }
  },
  beforeDestroy() {
    if (timer) clearInterval(timer)
  },
  activated() {
    this.queryParams.siteCode = this.$route.query?.siteCode
    this.getList()
  },
  deactivated() {
    if (timer) clearInterval(timer)
  },
  methods: {
    getVersion(v) {
      if (v) {
        let item = this.newVersionList.find(i => i.versionNum === v)
        this.toastData.name = item.name
      } else this.toastData.name = ''
    },
    manuLabel(row) {
      if (+row.manufacturer === 0) return 'Yotai'
      if (+row.fileType === 1 && +row.manufacturer === 1) return 'TIAN POWER'
      if (+row.fileType === 1 && +row.manufacturer === 2) return 'PACE'
      if (+row.fileType === 2 && +row.manufacturer === 1) return 'MEGAREVO'
      if (+row.fileType === 2 && +row.manufacturer === 2) return 'LUXPOWER'
    },
    submoduleLabel(row) {
      if (+row.fileType === 0) return '--'
      if (+row.fileType === 1 && +row.subModule === 1) return 'BAU'
      if (+row.fileType === 1 && +row.subModule === 2) return 'BCU'
      if (+row.fileType === 1 && +row.subModule === 3) return 'BMU'
      if (+row.fileType === 2 && +row.subModule === 1) return 'ARM'
      if (+row.fileType === 2 && +row.subModule === 2) return 'DSP'
    },

    submit() {
      this.$refs.toastRef.validate(v => {
        if (v) {
          this.$modal.loading(this.$t('upgrade.upgrading'))
          let data = {
            siteCode: this.$route.query?.siteCode,
            version: this.toastData.newVersion
          }
          versionUpgrade({...data, ...this.toastData}).then(res => {
            if (+res.code === 200) {
              this.$modal.msgSuccess(this.$t('common.success'))
              this.getList()
              this.beforeClose()
            }
          }).finally(() => {
            this.$modal.closeLoading()
          })
        }
      })
    },
    openShow() {
      this.show = true
    },
    getVersionList() {
      this.toastData.newVersion = ''
      this.toastData.name = ''
      let version = {
        siteCode: this.$route.query?.siteCode
      }
      versionList({...version, ...this.toastData}).then(res => {
        this.newVersionList = res.rows
      })
    },
    getList() {
      versionRecord(this.queryParams).then(res => {
        if(res.rows.length) {
          res.rows.forEach((row) => {
            if(row.progress) row.progress = (+row.progress).toFixed(2)
          })
        }
        this.list = res.rows
        this.total = res.total
      }).finally(() => {
        if (timer) clearInterval(timer)
        timer = setInterval(() => {
          this.getList()
        }, 5000)
      })
    },
    beforeClose() {
      this.show = false
      Object.keys(this.toastData).forEach(i => {
        this.toastData[i] = ''
      })
    },
    abort() {
      this.beforeClose()
    }
  }
}
</script>

<style lang="scss">

</style>

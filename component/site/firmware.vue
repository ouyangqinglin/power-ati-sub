<template>
  <div>
    <el-card>
      <el-row type="flex" justify="space-between" align="center" style="margin-bottom: 20px">
        <strong>Firmware update</strong>
        <el-button type="primary" @click="openShow">Upgrade</el-button>
      </el-row>
      <el-table :header-cell-style="{'text-align': 'center'}" :cell-style="{'text-align': 'center'}"
                v-loading="loading" :data="list"
      >
        <el-table-column label="No." align="center" width="60">
          <template slot-scope="scope">
            {{ (+queryParams.pageNum - 1) * (+queryParams.pageSize) + scope.$index + 1 }}
          </template>
        </el-table-column>
        <el-table-column label="Component M" prop="fileType" min-width="120">
          <template slot-scope="{ row }">
            <dict-tag :options="dict.type.file_type" :value="row.fileType"></dict-tag>
          </template>
        </el-table-column>
        <el-table-column label="Component S" prop="component" min-width="120">
          <template slot-scope="{ row }">
            <span>{{['V1.5', 'Mini', 'V1.0'][+row.component]}}</span>
          </template>
        </el-table-column>
        <el-table-column label="Manufacturer" prop="manufacturer" min-width="120">
          <template slot-scope="{ row }">
            <span>{{manuLabel(row)}}</span>
          </template>
        </el-table-column>
        <el-table-column label="Sub-module" prop="subModule" min-width="120">
          <template slot-scope="{ row }">
            <span>{{submoduleLabel(row)}}</span>
          </template>
        </el-table-column>
        <el-table-column label="Application Type" prop="applicationType" min-width="140">
          <template slot-scope="{ row }">
            <span>{{['Boot', 'App'][+row.applicationType]}}</span>
          </template>
        </el-table-column>
        <el-table-column label="Software version" prop="versionNum" min-width="140"></el-table-column>
        <el-table-column label="Firmware Name" prop="name" show-overflow-tooltip min-width="140"></el-table-column>
        <el-table-column label="Operation time" prop="" min-width="140">
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
      <el-dialog :visible.sync="show" title="Upgrade"
                 :before-close="beforeClose"
                 :close-on-click-modal ="false"
                 width="46%">
        <el-form :model="toastData" :rules="rules" ref="toastRef" label-position="top">
          <el-row :gutter="24">
            <el-col :span="10">
              <el-form-item label="Component M" prop="fileType">
                <el-select style="width: 100%" v-model="toastData.fileType" placeholder="Please select">
                  <el-option v-for="i of compMOptions" :key="i.value" :label="i.label" :value="i.value"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <!--            111-->
            <el-col :span="10">
              <el-form-item label="Component S" prop="component">
                <el-select style="width: 100%" v-model="toastData.component" placeholder="Please select" :disabled="disabledComp">
                  <el-option v-for="i of compSOptions" :key="i.value" :label="i.label" :value="i.value"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="24">
            <el-col :span="10">
              <el-form-item label="Manufacturer" prop="manufacturer">
                <el-select style="width: 100%" v-model="toastData.manufacturer" placeholder="Please select" :disabled="disabledManu">
                  <el-option v-for="i of manufacturerOptions" :key="i.value" :label="i.label" :value="i.value"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="10">
              <el-form-item label="Sub-module" prop="subModule">
                <el-select style="width: 100%" v-model="toastData.subModule" placeholder="Please select" :disabled="disabledSubmodule">
                  <el-option v-for="i of submoduleOptions" :key="i.value" :label="i.label" :value="i.value"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="24">
            <el-col :span="10">
              <el-form-item label="Application Type" prop="applicationType">
                <el-select style="width: 100%" v-model="toastData.applicationType" placeholder="Please select">
                  <el-option v-for="i of appOptions" :key="i.value" :label="i.label" :value="i.value"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="10">
              <el-form-item label="Firmware Name" prop="name">
                <el-input placeholder="Please enter" v-model="toastData.name" maxlength="50" readonly></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="24">
            <el-col :span="10">
              <el-form-item label="Version" prop="newVersion">
                <el-select style="width: 100%" v-model="toastData.newVersion" @change="getVersion">
                  <el-option v-for="(i, k) of newVersionList" :value="i.versionNum" :label="i.versionNum" :key="k"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
        <common-flex justify="center">
          <el-button type="primary" @click="submit">Submit</el-button>
          <el-button @click="abort">Cancel</el-button>
        </common-flex>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import {versionList, versionRecord, versionUpgrade} from "@/api/remote";

export default {
  name: "comp-site-firmware",
  dicts: ['file_type'],
  data() {
    return {
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
          { required: true, trigger: 'change', message: 'Please select'}
        ],
        fileType: [
          { required: true, message: 'Please select', trigger: ['change', 'blur']}
        ],
        component: [
          { required: true, message: 'Please select', trigger: ['change', 'blur']}
        ],
        subModule: [
          { required: true, message: 'Please select', trigger: ['change', 'blur']}
        ],
        manufacturer: [
          { required: true, message: 'Please select', trigger: ['change', 'blur']}
        ],
        applicationType: [
          { required: true, message: 'Please select', trigger: ['change', 'blur']}
        ],
        name: [
          { required: true, message: 'Please enter', trigger: 'blur'}
        ],
      },
      compMOptions: [
        {
          label: 'T-box',
          value: 0
        },
        {
          label: 'BMS',
          value: 1
        },
        {
          label: 'PCS',
          value: 2
        },
        // {
        //   label: 'EV Charger',
        //   value: 3
        // },
        // {
        //   label: 'HMI',
        //   value: 4
        // }
      ],
      appOptions: [
        {
          label: 'Boot',
          value: 0
        },
        {
          label: 'App',
          value: 1
        }
      ],
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
      loading: false,
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
      let arrBox = [
        {
          label: 'V1.5',
          value: 0
        },
        {
          label: 'Mini',
          value: 1
        },
        {
          label: 'V1.0',
          value: 2
        }
      ]
      return +this.toastData.fileType === 0 ? arrBox : []
    },
    manufacturerOptions() {
      let arrBox = [
        {
          label: 'Yotai',
          value: 0
        }
      ]
      let arrBms = [
        {
          label: 'TIANBDA',
          value: 1
        },
        {
          label: 'PACEEX',
          value: 2
        }
      ]
      let arrPcs = [
        {
          label: 'MEGAREVO',
          value: 1
        },
        {
          label: 'LUXPOWER',
          value: 2
        }
      ]
      return +this.toastData.fileType === 0 ? arrBox : +this.toastData.fileType === 1 ? arrBms : +this.toastData.fileType === 2 ? arrPcs : []
    },
    submoduleOptions() {
      let arrBms = [
        {
          label: 'BAU',
          value: 1
        },
        {
          label: 'BCU',
          value: 2
        },
        {
          label: 'BMU',
          value: 3
        }
      ]
      let arrPcs = [
        {
          label: 'ARM',
          value: 1
        },
        {
          label: 'DSP',
          value: 2
        },
      ]
      return +this.toastData.fileType === 0 ? [] : +this.toastData.fileType === 1 ? arrBms : +this.toastData.fileType === 2 ? arrPcs : []
    }
  },
  watch: {
    toastData: {
      deep: true,
      handler(v) {
        this.getVersionList()
      },
    },
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
          this.disabledComp = true
          this.disabledManu = false
          this.disabledSubmodule = false
          this.toastData.manufacturer = ''
          this.toastData.component = ''
          this.toastData.subModule = ''
        }
      }
    }
  },
  mounted() {
    this.queryParams.siteCode = this.$route.query?.siteCode
    this.getList()
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
      if (+row.fileType === 1 && +row.manufacturer === 1) return 'TIANBDA'
      if (+row.fileType === 1 && +row.manufacturer === 2) return 'PACEEX'
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
          this.$modal.loading("Upgrading")
          let data = {
            siteCode: this.$route.query?.siteCode,
            version: this.toastData.newVersion
          }
          versionUpgrade({...data, ...this.toastData}).then(res => {
            if (+res.code === 200) {
              this.$modal.msgSuccess("Succeeded")
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
      let version = {
        siteCode: this.$route.query?.siteCode
      }
      versionList({...version, ...this.toastData}).then(res => {
        this.newVersionList = res.rows
      })
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

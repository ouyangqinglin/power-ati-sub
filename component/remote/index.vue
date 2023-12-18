<template>
  <div class="pages-remote app-container">
    <el-card>
      <el-form :inline="true" :model="queryParams" label-width="140px" ref="queryForm">
        <el-row>
          <el-col :span="8">
            <el-form-item label="Version：" prop="versionNum">
              <el-input clearable placeholder="Please enter" v-model="queryParams.versionNum"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="Component M：" prop="fileType">
              <el-select placeholder="All" v-model="queryParams.fileType">
                <el-option v-for="i of compMOptions" :key="i.value" :label="i.label" :value="i.value"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="Manufacturer：" prop="manufacturer">
              <el-select placeholder="All" v-model="queryParams.manufacturer" :disabled="queryManuDisabled">
                <el-option v-for="i of manufacturerQueryOptions" :key="i.value" :label="i.label" :value="i.value"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row type="flex" justify="space-between">
          <el-col :span="8">
            <el-form-item label="Sub-module：" prop="subModule">
              <el-select placeholder="All" v-model="queryParams.subModule" :disabled="querySubDisabled">
                <el-option v-for="i of submoduleQueryOptions" :key="i.value" :label="i.label" :value="i.value"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="Application Type：" prop="applicationType" label-width="140px">
              <el-select placeholder="All" v-model="queryParams.applicationType">
                <el-option v-for="i of appOptions" :key="i.value" :label="i.label" :value="i.value"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <common-flex justify="flex-end">
              <el-button type="primary" @click="handleQuery">{{ $t('common.query') }}</el-button>
              <el-button @click="resetQuery">{{ $t('common.reset') }}</el-button>
            </common-flex>
          </el-col>
        </el-row>
      </el-form>
    </el-card>
    <el-card style="margin-top: 24px">
      <common-flex justify="space-between">
        <p>List</p>
        <div v-hasPermi="['ati:remote:add']"><el-button type="primary" @click="show = true">{{ $t('common.add') }}</el-button></div>
      </common-flex>
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
            <dict-tag :options="fileType" :value="row.fileType"></dict-tag>
          </template>
        </el-table-column>
        <el-table-column label="Component S" prop="component" min-width="120">
          <template slot-scope="{ row }">
            <dict-tag :options="inverterVersion" :value="row.component"></dict-tag>
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
            <dict-tag :options="appOptions" :value="row.applicationType"></dict-tag>
          </template>
        </el-table-column>
        <el-table-column label="Version" prop="versionNum" min-width="130"></el-table-column>
        <el-table-column label="Firmware Name" prop="name" show-overflow-tooltip min-width="140"></el-table-column>
        <el-table-column label="Firmware package" prop="name" show-overflow-tooltip min-width="140">
          <template slot-scope="{ row }">
            <el-link :href="`${baseUrl}${row.path}`" :underline="false" target="_blank">
              <span class="themeColor">{{ row.name }}</span>
            </el-link>
          </template>
        </el-table-column>
        <el-table-column label="Version description" prop="remark" min-width="150" show-tooltip-when-overflow />
        <el-table-column label="Upload Time" prop="updateTime" min-width="150">
          <template slot-scope="{ row }">
            <span v-if="row.updateTime && row.updateTime !== '--'">{{ DATE_FORMAT('M/d/yyyy hh:mm:ss', row.updateTime) }}</span>
            <span v-else>--</span>
          </template>
        </el-table-column>
        <el-table-column label="Upload by" prop="updateBy" min-width="100"></el-table-column>
        <el-table-column fixed="right" label="Operation" min-width="130">
          <template slot-scope="{ row }">
            <el-button type="text"><router-link :to="`/remote/details/${row.id}`">{{ $t('common.detail') }}</router-link></el-button>
            <el-button type="text" v-hasPermi="['ati:version:remove']" @click="handleDelete(row)">{{ $t('common.delete') }}</el-button>
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

    <div v-if="show">
      <el-dialog :visible.sync="show" title="Newly Build"
                 :before-close="beforeClose"
                 :close-on-click-modal ="false"
                 width="56%">
        <el-form @submit.native.prevent label-position="top" label-width="100" :model="base" :rules="rules" ref="formRef">
          <el-row :gutter="24">
            <el-col :span="10">
              <el-form-item label="Component M" prop="fileType">
                <el-select style="width: 100%" v-model="base.fileType" placeholder="Please select">
                  <el-option v-for="i of compMOptions" :key="i.value" :label="i.label" :value="i.value"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
<!--            111-->
            <el-col :span="10">
              <el-form-item label="Component S" prop="component">
                <el-select style="width: 100%" v-model="base.component" placeholder="Please select" :disabled="disabledComp">
                  <el-option v-for="i of compSOptions" :key="i.value" :label="i.label" :value="i.value"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="24">
            <el-col :span="10">
              <el-form-item label="Manufacturer" prop="manufacturer">
                <el-select style="width: 100%" v-model="base.manufacturer" placeholder="Please select" :disabled="disabledManu">
                  <el-option v-for="i of manufacturerOptions" :key="i.value" :label="i.label" :value="i.value"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="10">
              <el-form-item label="Sub-module" prop="subModule">
                <el-select style="width: 100%" v-model="base.subModule" placeholder="Please select" :disabled="disabledSubmodule">
                  <el-option v-for="i of submoduleOptions" :key="i.value" :label="i.label" :value="i.value"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="24">
            <el-col :span="10">
              <el-form-item label="Application Type" prop="applicationType">
                <el-select style="width: 100%" v-model="base.applicationType" placeholder="Please select">
                  <el-option v-for="i of appOptions" :key="i.value" :label="i.label" :value="i.value"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="10">
              <el-form-item label="Version" prop="versionNum">
                <el-input placeholder="Please enter" v-model="base.versionNum"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="24">
            <el-col :span="10">
              <el-form-item label="Firmware Name" prop="name">
                <el-input placeholder="Please enter" v-model="base.name" maxlength="50"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="10">
              <el-form-item label="Firmware package" class="posr fileType" prop="file">
                <div class="upload-wrap posa"
                     :style="{cursor: fileName ? 'not-allowed' : 'pointer'}">
                  <input @change="changeFile" id="file" class="file-ele" type="file"
                         :style="{display: fileName ? 'none': 'block', cursor: fileName ? 'not-allow' : 'pointer'}">
                  upload
                  <common-flex align="center" class="file-display posa" v-if="fileName">
                    <el-link :underline="false" target="_blank">
                      <div class="file-name ellipsis">{{ fileName }}</div>
                    </el-link>
                    <img class="delete-img" @click="deleteFile" :src="require('@img/delete.svg')" alt="">
                  </common-flex>
                </div>
              </el-form-item>
            </el-col>
          </el-row>
          <el-form-item label="Version description" style="margin-top: 24px">
            <el-input type="textarea" show-word-limit maxlength="200" v-model="base.remark" placeholder="Please enter"></el-input>
          </el-form-item>
        </el-form>
        <common-flex justify="center">
          <el-button type="primary" @click="submit">Submit</el-button>
          <el-button @click="cancel">Cancel</el-button>
        </common-flex>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import {uploadFile, versionList, delRemote} from "@/api/remote"
import {mapState} from "vuex"
import {
  fileType,
  comMType,
  applicationType,
  inverterVersion,
  manufacturerTBox,
  manufacturerPcs,
  manufacturerBms,
  submoduleBms,
  submodulePcs
} from '@sub/utils/dict'

export default {
  name: "pages-remote",
  data() {
    const validateVersion = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('Please enter'));
      } else {
        const reg = /^([1-9]\d|[1-9])(.([1-9]\d|\d)){2}$/
        if (reg.test(value)) {
          callback()
        } else callback(new Error('Please enter the correct version number, for example, 1.1.1'))
      }
    }
    return {
      fileType,
      inverterVersion,
      baseUrl: process.env.VUE_APP_BASE_API,
      show: false,
      total: 0,
      loading: false,
      list: [],
      fileName: '',
      fileItem: {},
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        versionNum: '',
        fileType: '',
        component: '',
        subModule: '',
        manufacturer: '',
        applicationType: ''
      },
      // 1111
      compMOptions: comMType,
      appOptions: applicationType,
      base: {
        fileType: '',
        component: '',
        subModule: '',
        manufacturer: '',
        applicationType: '',
        versionNum: '',
        file: '',
        name: '',
        remark: ''
      },
      rules: {
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
        versionNum: [
          { required: true, message: 'Please enter', trigger: 'blur'}
        ],
        name: [
          { required: true, message: 'Please enter', trigger: 'blur'}
        ],
        file: [
          { required: true, message: 'Please upload', trigger: ['change', 'blur']}
        ]
      },
      disabledComp: false,
      disabledManu: false,
      disabledSubmodule: false,
      queryManuDisabled: true,
      querySubDisabled: true,
    }
  },
  computed: {
    ...mapState({
      'timeZone': state => state.user.timeZone,
    }),
    compSOptions() {
      return +this.base.fileType === 0 ? inverterVersion : []
    },
    manufacturerQueryOptions() {
      return +this.queryParams.fileType === 0 ? manufacturerTBox : +this.queryParams.fileType === 1 ? manufacturerBms : +this.queryParams.fileType === 2 ? manufacturerPcs : []
    },
    manufacturerOptions() {
      return +this.base.fileType === 0 ? manufacturerTBox : +this.base.fileType === 1 ? manufacturerBms : +this.base.fileType === 2 ? manufacturerPcs : []
    },
    submoduleQueryOptions() {
      return +this.queryParams.fileType === 0 ? [] : +this.queryParams.fileType === 1 ? submoduleBms : +this.queryParams.fileType === 2 ? submodulePcs : []
    },
    submoduleOptions() {
      return +this.base.fileType === 0 ? [] : +this.base.fileType === 1 ? submoduleBms : +this.base.fileType === 2 ? submodulePcs : []
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
    'queryParams.fileType': {
      handler(v) {
        if (typeof v === 'number') {
          this.queryManuDisabled = false
          this.querySubDisabled = false
          this.queryParams.manufacturer = ''
          this.queryParams.subModule = ''
        } else {
          this.queryManuDisabled = true
          this.querySubDisabled = true
        }
      }
    },
    'base.fileType': {
      handler(v) {
        if (+v === 0) {
          this.disabledComp = false
          this.disabledManu = true
          this.disabledSubmodule = true
          this.base.manufacturer = 0
          this.base.subModule = ''
        } else {
          this.disabledComp = true
          this.disabledManu = false
          this.disabledSubmodule = false
          this.base.manufacturer = ''
          this.base.component = ''
          this.base.subModule = ''
        }
      }
    }
  },
  mounted() {
    this.getList()
  },
  methods: {
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
    handleDelete(row) {
      const ids = row.id
      this.$modal.confirm(`Please confirm whether to delete`).then(() => {
        this.$modal.loading()
        return delRemote(ids);
      }).then(() => {
        this.getList();
        this.$modal.msgSuccess("Deleted!");
      }).finally(() => this.$modal.closeLoading());
    },
    changeFile() {
      this.fileItem = document.getElementById('file')
      let file = this.fileItem.files
      const isLt = (+(file[0].size / 1024 / 1024)) < 5
      if (!isLt) {
        return this.$modal.msgError(`The size of the uploaded file cannot exceed 5 MB!`)
      }
      this.fileName = file[0].name
      this.base.file = this.fileItem.files[0]
      if (this.base.file) this.rules.file[0].message = ''
      else this.rules.file[0].message = 'Please upload'
    },
    submit() {
      this.$refs.formRef.validate(v => {
        if (v) {
          this.$modal.loading("Uploading file...")
          const formData = new FormData()
          formData.append("fileType", this.base.fileType)
          formData.append("file", this.base.file)
          formData.append("versionNum", this.base.versionNum)
          formData.append("remark", this.base.remark)
          formData.append("name", this.base.name)
          formData.append("component", this.base.component)
          formData.append("subModule", this.base.subModule)
          formData.append("manufacturer", this.base.manufacturer)
          formData.append("applicationType", this.base.applicationType)
          uploadFile(formData).then(res => {
            if (+res.code === 200) {
              this.$modal.closeLoading()
              this.$modal.msgSuccess("Succeeded")
              this.cancel()
              this.getList()
            }
          }).finally(() => {
            this.$modal.closeLoading()
          })
        }
      })
    },
    cancel() {
      this.beforeClose()
      this.fileItem.value = ''
      this.fileName = ''
      for (let v in this.base) {
        this.base[v] = ''
      }
    },
    deleteFile() {
      this.fileItem.value = ''
      this.fileName = ''
      this.base.file = ''
    },
    beforeClose() {
      this.show = false
    },
    handleQuery() {
      this.queryParams.pageNum = 1
      this.getList()
    },
    resetQuery() {
      this.resetForm("queryForm")
      this.handleQuery()
    },
    getList() {
      this.loading = true
      versionList(this.queryParams).then(res => {
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
.pages-remote {
  p {
    font-weight: 600;
  }
  input[type='number'] {
    -moz-appearance: textfield !important;
  }
  input::-webkit-outer-spin-button, input::-webkit-inner-spin-button {
    -webkit-appearance: none !important;
  }
  .upload-wrap {
    left: 8px;
    top: 0;
    height: 36px;
    width: 85px;
    border-radius: 4px;
    z-index: 2;
    cursor: pointer;
    text-align: center;
    color: #fff;
    background-color: $commonColor;
    .file-ele {
      position: absolute;
      top: 0;
      right: 0;
      opacity: 0;
      height: 36px;
      width: 85px;
      cursor: pointer;
      z-index: 1;
    }
    .file-display {
      right: -190px;
      top: 0;
      width: 160px;
      height: 36px;
      color: $commonColor;
      text-align: left;
      cursor: default;
      .file-name {
        max-width: 120px;
        color: $commonColor;
        opacity: 1;
        cursor: default;
      }
      .delete-img {
        margin-left: 8px;
        @include wh(16);
        cursor: pointer;
      }
    }
    .uploaded {
      background-color: $commonColor;
      opacity: .6;
    }
  }
  .fileType {
    .el-form-item__error {
      position: absolute;
      left: 0;
      top: 38px;
    }
  }
}
</style>

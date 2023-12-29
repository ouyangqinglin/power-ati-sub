<template>
  <div class="pages-remote-details app-container">
    <el-card>
      <el-form label-width="160px">
        <el-row>
          <el-col :span="8">
            <el-form-item :label="`${$t('upgrade.componentM')}：`" prop="fileType">
              <dict-tag :options="fileType" :value="base.fileType"></dict-tag>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item :label="`${$t('upgrade.componentS')}：`" prop="component">
              <dict-tag :options="inverterVersion" :value="base.component"></dict-tag>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item :label="`${$t('common.manufacturer')}：`" prop="manufacturer">
              <span>{{manuLabel(base)}}</span>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item :label="`${$t('upgrade.submodule')}：`" prop="subModule">
              <span>{{submoduleLabel(base)}}</span>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item :label="`${$t('upgrade.applicationType')}：`" prop="applicationType">
              <dict-tag :options="applicationType" :value="base.applicationType"></dict-tag>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item :label="`${$t('common.version')}：`" prop="versionNum"><span>{{base.versionNum}}</span></el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item label="Firmware Name:" prop="name">
              <div class="ellipsis" style="max-width: 400px" :title="base.name">{{base.name}}</div>
<!--              <el-tooltip :content="base.name" placement="top" style="max-width: 400px">-->
<!--                <div class="ellipsis" style="max-width: 400px">{{base.name}}</div>-->
<!--              </el-tooltip>-->
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item :label="`${$t('upgrade.firmwareName')}：`" prop="name">
              <el-tooltip :content="base.name" placement="top">
                <el-link :href="`${baseUrl}${base.path}`" :underline="false" target="_blank">
                  <div style="max-width: 400px" class="ellipsis themeColor">{{base.name}}</div>
                </el-link>
              </el-tooltip>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item :label="`${$t('upgrade.uploadBy')}：`" prop="updateBy"><span>{{ base.updateBy }}</span></el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item :label="`${$t('upgrade.uploadTime')}：`" prop="updateTime"><span>{{ DATE_FORMAT('M/d/yyyy hh:mm:ss', new Date(base.updateTime)) }}</span></el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item :label="`${$t('upgrade.versionDescription')}：`" prop="remark">
              <el-tooltip :content="base.remark" placement="top-start">
                <div style="max-width: 400px" class="ellipsis themeColor">{{base.remark}}</div>
              </el-tooltip>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </el-card>
    <el-card style="margin-top: 20px">
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane :label="$t('upgrade.upgradeTask')" name="1">
          <el-row justify="space-between" type="flex">
            <el-col :span="5">
              <el-input clearable prefix-icon="el-icon-search" @input="searchList()" v-model.trim="params.name" :placeholder="$t('upgrade.pleaseEnterTaskName')"></el-input>
            </el-col>
            <el-col :span="2">
              <el-button type="primary" @click="addShow = true">{{ $t('common.add') }}</el-button>
            </el-col>
          </el-row>
          <el-table style="margin-top: 20px" :header-cell-style="{'text-align': 'center', 'border-bottom': 'none' }" :cell-style="{'text-align': 'center', 'border-left': 'none', 'border-right': 'none', 'border-top': 'none'}"
                    v-loading="loading" :data="taskList" border
          >
            <el-table-column :label="$t('common.no')" align="center" width="60">
              <template slot-scope="scope">
                {{ (+params.pageNum - 1) * (+params.pageSize) + scope.$index + 1 }}
              </template>
            </el-table-column>
            <el-table-column :label="$t('task.id')" prop="code"></el-table-column>
            <el-table-column :label="$t('task.name')" prop="name" min-width="120"></el-table-column>
            <el-table-column :label="$t('upgrade.qtfSite')" prop="num" min-width="120">
              <template slot-scope="{row}">
                <span style="cursor: pointer" class="themeColor" @click="lookNum(row.code)">{{row.num}}</span>
              </template>
            </el-table-column>
            <el-table-column :label="$t('common.status')" prop="status">
              <template slot-scope="{ row }">
                <dict-tag :options="upgradeTaskStatus" :value="row.status" />
              </template>
            </el-table-column>
            <el-table-column :label="$t('common.remarks')" prop="remarks"></el-table-column>
            <el-table-column :label="$t('common.creationTime')" prop="createTime" min-width="120">
              <template slot-scope="{row}">
                <span>{{DATE_FORMAT('M/d/yyyy hh:mm:ss', new Date(row.createTime))}}</span>
              </template>
            </el-table-column>
            <el-table-column :label="$t('common.creationBy')" prop="createBy" min-width="120"></el-table-column>
          </el-table>
          <pagination
            v-show="params.total>0"
            :total="params.total"
            :page.sync="params.pageNum"
            :limit.sync="params.pageSize"
            @pagination="getUpgradeTaskList"
          />
        </el-tab-pane>
        <el-tab-pane :label="$t('upgrade.upgradeRecord')" name="2">
          <el-row justify="space-between" type="flex">
            <el-col :span="5">
              <el-input clearable prefix-icon="el-icon-search" @input="searchList()" v-model.trim="queryParams.name" :placeholder="$t('upgrade.pleaseEnterTaskSiteName')"></el-input>
            </el-col>
            <el-col :span="2">
              <el-button type="primary" @click="excelExport"><i style="font-size: 16px" class="el-icon-download"></i></el-button>
            </el-col>
          </el-row>
          <el-table style="margin-top: 20px" :header-cell-style="{'text-align': 'center', 'border-bottom': 'none' }" :cell-style="{'text-align': 'center', 'border-left': 'none', 'border-right': 'none', 'border-top': 'none'}"
                    v-loading="loading" :data="recordList" border
          >
            <el-table-column :label="$t('common.no')" align="center" width="60">
              <template slot-scope="scope">
                {{ (+queryParams.pageNum - 1) * (+queryParams.pageSize) + scope.$index + 1 }}
              </template>
            </el-table-column>
            <el-table-column :label="$t('site.name')" prop="siteName" min-width="120"></el-table-column>
            <el-table-column :label="$t('upgrade.upgradeMode')" prop="upgradeType" min-width="160">
              <template slot-scope="{row}">
                <dict-tag :options="upgradeMode" :value="row.upgradeType" />
              </template>
            </el-table-column>
            <el-table-column :label="$t('upgrade.upgradeVersion')" prop="versionNum" min-width="160">
              <template slot-scope="{row}">
                <span>{{ row.oldVersion }}->{{row.versionNum}}</span>
              </template>
            </el-table-column>
            <el-table-column :label="$t('common.status')" prop="status">
              <template slot-scope="{ row }">
                <dict-tag :options="upgradeResStatus" :value="row.status" />
              </template>
            </el-table-column>
            <el-table-column :label="$t('common.remarks')" prop="remark"></el-table-column>
            <el-table-column :label="$t('common.operationTime')" prop="createTime" min-width="160">
              <template slot-scope="{row}">
                <span>{{DATE_FORMAT('M/d/yyyy hh:mm:ss', new Date(row.createTime))}}</span>
              </template>
            </el-table-column>
            <el-table-column :label="$t('task.name')" prop="taskName" min-width="120"></el-table-column>
            <el-table-column :label="$t('common.agency')" prop="agency"></el-table-column>
          </el-table>
          <pagination
            v-show="queryParams.total>0"
            :total="queryParams.total"
            :page.sync="queryParams.pageNum"
            :limit.sync="queryParams.pageSize"
            @pagination="getTaskRecord"
          />
        </el-tab-pane>
      </el-tabs>
    </el-card>
    <el-dialog :visible.sync="show" :title="$t('upgrade.qtfSite')"
               :before-close="beforeClose"
               width="66%">
      <el-form :inline="true" @submit.native.prevent size="small">
        <el-row type="flex" justify="space-between" align="middle">
          <el-col :span="10">
            <el-form-item :label="`${$t('site.name')}：`">
              <el-input clearable @keyup.enter.native="getNumList" type="text" :placeholder="$t('common.pleaseEnter')" v-model.trim="numParams.name"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="5">
            <el-button type="primary" size="mini" @click="getNumList">{{ $t('common.query') }}</el-button>
            <el-button size="mini" @click="resetGetNumList">{{ $t('common.reset') }}</el-button>
          </el-col>
        </el-row>
      </el-form>
      <el-form>
        <el-row>
          <el-col :span="5">
            <el-form-item :label="`${$t('dict.success')}:`"><span class="themeColor">{{ successNum }}</span></el-form-item>
          </el-col>
          <el-col :span="5">
            <el-form-item :label="`${$t('dict.waiting')}:`"><span class="themeColor">{{ waitingNum }}</span></el-form-item>
          </el-col>
          <el-col :span="5">
            <el-form-item :label="`${$t('dict.upgrading')}:`"><span class="themeColor">{{ upgradingNum }}</span></el-form-item>
          </el-col>
          <el-col :span="9">
            <el-form-item :label="`${$t('dict.fail')}:`"><span class="themeColor">{{ failNum }}</span>  <el-link :disabled="!failNum" @click="againUpgradeTask" type="primary" style="margin-bottom: 3px">  {{ $t('upgrade.clickUpgradeAgain') }}</el-link></el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <el-table :header-cell-style="{'text-align': 'center', 'border-bottom': 'none' }" :cell-style="{'text-align': 'center', 'border-left': 'none', 'border-right': 'none', 'border-top': 'none'}"
               :data="numList" border
      >
        <el-table-column label="No." align="center" width="60">
          <template slot-scope="scope">
            {{ (+numParams.pageNum - 1) * (+numParams.pageSize) + scope.$index + 1 }}
          </template>
        </el-table-column>
        <el-table-column label="Site Name" prop="siteName"></el-table-column>
        <el-table-column label="Logger SN" prop="sn">
          <template slot-scope="{row}">
            <common-flex justify="center">
              <span>{{ row.sn }}/</span>
              <dict-tag :options="networkStatus" :value="row.net" />
            </common-flex>
          </template>
        </el-table-column>
        <el-table-column label="Upgrade Version" prop="versionNum">
          <template slot-scope="{row}">
            <span>{{ row.oldVersion }}->{{row.versionNum}}</span>
          </template>
        </el-table-column>
        <el-table-column label="Status" prop="status">
          <template slot-scope="{ row }">
            <dict-tag :options="siteUpgradeStatus" :value="row.status" />
          </template>
        </el-table-column>
        <el-table-column label="Operation Time" prop="createTime">
          <template slot-scope="{row}">
            <span>{{DATE_FORMAT('M/d/yyyy hh:mm:ss', new Date(row.createTime))}}</span>
          </template>
        </el-table-column>
      </el-table>
      <pagination
        v-show="numParams.total>0"
        :total="numParams.total"
        :page.sync="numParams.pageNum"
        :limit.sync="numParams.pageSize"
        @pagination="getNumList"
      />
      <common-flex justify="center" style="margin-top: 16px">
        <el-button @click="show = false">{{ $t('common.cancel') }}</el-button>
      </common-flex>
    </el-dialog>

    <el-dialog :visible.sync="addShow" :title="$t('task.newUpgradeTask')"
               :before-close="beforeClose"
               width="66%">
      <el-form label-position="top" :model="addModal" :rules="rules" ref="addModal">
        <el-row>
          <el-col :span="12">
            <el-form-item :label="$t('task.name')" prop="name">
              <el-input maxlength="50" type="text" :placeholder="$t('common.pleaseEnter')" v-model.trim="addModal.name"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item :label="$t('common.remarks')">
          <el-input maxlength="200" type="textarea" :placeholder="$t('common.pleaseEnter')" v-model.trim="addModal.remark"></el-input>
        </el-form-item>
      </el-form>
      <el-row type="flex" justify="space-between">
        <strong>{{ $t('task.upgradeList') }}</strong>
        <div>
          <el-button type="primary" size="mini" @click="siteShow = true">{{ $t('common.add') }}</el-button>
          <el-button size="mini" @click="deleteSel">{{ $t('common.delete') }}</el-button>
        </div>
      </el-row>
      <el-table style="margin-top: 20px" :header-cell-style="{'text-align': 'center', 'border-bottom': 'none' }" :cell-style="{'text-align': 'center', 'border-left': 'none', 'border-right': 'none', 'border-top': 'none'}"
                :data="siteList" @selection-change="addSelect" max-height="530" border
      >
        <el-table-column
          v-if="deleteShow"
          type="selection"
          width="55" />
        <el-table-column :label="$t('common.no')" type="index" align="center" width="60"></el-table-column>
        <el-table-column :label="$t('site.name')" prop="siteName"></el-table-column>
        <el-table-column :label="$t('task.loggerSn')" prop="sn">
          <template slot-scope="{row}">
            <common-flex justify="center">
              <span>{{ row.serialNumber }}/</span>
              <dict-tag :options="networkStatus" :value="row.net" />
            </common-flex>
          </template>
        </el-table-column>
        <el-table-column :label="$t('common.operation')" prop="createTime">
          <template slot-scope="{row}">
            <el-button type="text" @click="removeArrItem(row.id)">{{ $t('common.delete') }}</el-button>
          </template>
        </el-table-column>
      </el-table>
      <common-flex justify="center" style="margin-top: 16px">
        <el-button :type="siteList.length ? 'primary' : ''" :disabled="!siteList.length" @click="addUpgrade">{{ $t('upgrade.upgrade') }}</el-button>
        <el-button @click="closeAdd">{{ $t('common.cancel') }}</el-button>
      </common-flex>
    </el-dialog>

    <siteList v-if="siteShow" :show.sync="siteShow" @change="getSelectSite" :haveSiteList="siteList" />
  </div>
</template>

<script>
import {
  versionDetails,
  upgradeTaskList,
  upgradeTaskRecord,
  upgradeNum,
  againUpgrade,
  addUpgradeTask
} from '@/api/remote'
import {
  fileType,
  upgradeResStatus,
  upgradeMode,
  applicationType,
  inverterVersion,
  upgradeTaskStatus,
  networkStatus,
  siteUpgradeStatus
} from '@sub/utils/dict'
import siteList from '@subComp/remote/siteList.vue'
import {mapState} from "vuex"

let timer = null
export default {
  name: "pages-remote-details",
  components: { siteList },
  data() {
    return {
      fileType,
      upgradeMode,
      upgradeResStatus,
      inverterVersion,
      applicationType,
      upgradeTaskStatus,
      networkStatus,
      siteUpgradeStatus,
      siteList: [],
      selected: [],
      siteShow: false,
      deleteShow: false,
      addModal: {
        name: '',
        remark: '',
        snList: [],
        versionId: ''
      },
      rules:{
        name: [
          { required: true, message: 'Please enter', trigger: 'blur'}
        ]
      },
      addShow: false,
      show: false,
      baseUrl: process.env.VUE_APP_BASE_API,
      id: '',
      activeName: '1',
      base: {},
      loading: false,
      taskList: [],
      recordList: [],
      numList: [],
      params: {
        versionId: '',
        total: 0,
        name: '',
        pageNum: 1,
        pageSize: 10
      },
      queryParams: {
        versionId: '',
        total: 0,
        name: '',
        pageNum: 1,
        pageSize: 10
      },
      upgradeNumber: [],
      numParams: {
        name: '',
        total: 0,
        pageNum: 1,
        pageSize: 10,
        taskCode: ''
      },
    }
  },
  computed: {
    ...mapState({
      'timeZone': state => state.user.timeZone,
    }),
    //1-成功 2-失败 3-升级中 4-waiting
    successNum() {
      let item = this.upgradeNumber.find(i => +i.status === 1)
      return item ? item.num : 0
    },
    failNum() {
      let item = this.upgradeNumber.find(i => +i.status === 2)
      return item ? item.num : 0
    },
    upgradingNum() {
      let item = this.upgradeNumber.find(i => +i.status === 3)
      return item ? item.num : 0
    },
    waitingNum() {
      let item = this.upgradeNumber.find(i => +i.status === 4)
      return item ? item.num : 0
    },
  },
  mounted() {
    this.id = this.$route.params.id
    this.getVersionBase()
    this.getUpgradeTaskList()
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
    closeAdd() {
      this.addShow = false
      this.addModal.name = ''
      this.addModal.remark = ''
      this.siteList = []
    },
    addUpgrade() {
      this.$refs.addModal.validate(v => {
        if (v) {
          let snList = []
          for (let i = 0; i < this.siteList.length; i++) {
            snList.push(this.siteList[i].serialNumber)
          }
          let data = {
            name: this.addModal.name,
            remarks: this.addModal.remark,
            snList,
            versionId: this.id
          }
          this.$modal.loading()
          addUpgradeTask(data).then(res => {
            if (+res.code === 200) {
              this.$modal.msgSuccess('Succeed')
              this.getUpgradeTaskList()
              this.closeAdd()
            }
          }).finally(() => this.$modal.closeLoading())
        }
      })
    },
    deleteSel() {
      this.deleteShow = !this.deleteShow
      if (this.selected.length) {
        for (let i = 0; i < this.selected.length; i++) {
          this.removeArrItem(this.selected[i].id)
        }
      }
    },
    removeArrItem(id) {
      this.siteList = this.siteList.filter(i => i.id !== id)
    },
    getSelectSite(v) {
      this.siteList = [...this.siteList, ...v]
      this.siteList = this.removeDuplicateObj(this.siteList)
    },
    // 去重
    removeDuplicateObj(arr) {
      let obj = {}
      arr = arr.reduce((newArr, next) => {
        if (obj[next.id]) {}
        else {
          obj[next.id] = true
          newArr.push(next)
        }
        return newArr
      }, [])
      return arr
    },
    addSelect(v) {
      this.selected = v
    },
    againUpgradeTask() {
      let data = {
        taskCode: this.numParams.taskCode
      }
      this.$modal.loading()
      againUpgrade(data).then(res => {
        if (+res.code === 200) {
          this.$modal.msgSuccess('Succeed')
          this.getNumList()
        }
      }).finally(() => {
        this.getUpgradeNum()
        this.$modal.closeLoading()
      })
    },
    resetGetNumList() {
      this.numParams.name = ''
      this.getNumList()
    },
    beforeClose() {
      this.show = false
      this.addShow = false
    },
    searchList() {
      clearTimeout(timer)
      timer = setTimeout(() => {
        if (+this.activeName === 1) this.getUpgradeTaskList()
        else this.getTaskRecord()
      }, 1000)
    },
    handleClick() {
      if (+this.activeName === 2) {
        this.queryParams.pageSize = 10
        this.queryParams.pageNum = 1
        this.getTaskRecord()
      } else {
        this.params.pageNum = 1
        this.params.pageSize = 10
        this.getUpgradeTaskList()
      }
    },
    getTaskRecord() {
      this.loading = true
      upgradeTaskRecord({...this.queryParams, versionId: this.id }).then(res => {
        this.recordList = res.rows
        this.queryParams.total = res.total
        this.loading = false
      })
    },
    getUpgradeTaskList() {
      this.loading = true
      upgradeTaskList({...this.params, versionId: this.id }).then(res => {
        this.taskList = res.rows
        this.params.total = res.total
        this.loading = false
      })
    },
    getNumList() {
      this.$modal.loading()
      upgradeTaskRecord({...this.numParams, versionId: this.id }).then(res => {
        this.numList = res.rows
        this.numParams.total = res.total
        this.show = true
      }).finally(() => this.$modal.closeLoading())
    },
    lookNum(code) {
      this.numParams.taskCode = code
      this.getNumList()
      this.getUpgradeNum()
    },
    getUpgradeNum() {
      let data = {
        taskCode: this.numParams.taskCode
      }
      upgradeNum(data).then(res => {
        this.upgradeNumber = res.data
      })
    },
    getVersionBase() {
      versionDetails(this.id).then(res => {
        this.base = res.data
      })
    },
    excelExport() {
      let data = {
        versionId: this.id
      }
      this.download('/upgradeTask/export', {
        ...data
      }, `upgrade_${new Date().getTime()}.xlsx`)
    },
  }
}
</script>

<style lang="scss">
.pages-remote-details {

}
</style>

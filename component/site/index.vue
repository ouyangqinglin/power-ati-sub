<template>
  <div class="app-container pages-site">
    <el-card class="pages-site-header" >
      <el-form>
        <el-row>
          <el-col :span="20">
            <el-form-item class="region" :label="$t('site.region')+'：'" prop="province" label-width="110px">
              <el-select
                :disabled="!(queryParams.province && queryParams.country)"
                v-model="queryParams.city"
                :placeholder="$t('common.pleaseSelect') + $t('common.city')"
                clearable
                @keyup.enter.native="handleQuery"
              >
                <el-option
                  v-for="(item, index) in cityOption"
                  :key="index"
                  :label="item.label"
                  :value="item.value"
                  :disabled="item.disabled">
                </el-option>
              </el-select>
              <el-select
                :disabled="!queryParams.country"
                v-model="queryParams.province"
                :placeholder="$t('common.pleaseSelect') + $t('common.province')"
                clearable
                @keyup.enter.native="handleQuery"
              >
                <el-option
                  v-for="(item, index) in provinceOption"
                  :key="index"
                  :label="item.label"
                  :value="item.value"
                  :disabled="item.disabled">
                </el-option>
              </el-select>
              <el-select
                v-model="queryParams.country"
                class="area-select"
                :placeholder="$t('common.pleaseSelect') + $t('common.country')"
                clearable
                @keyup.enter.native="handleQuery"
              >
                <el-option
                  v-for="(item, index) in countryOption"
                  :key="index"
                  :label="item.label"
                  :value="item.value"
                  :disabled="item.disabled">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <common-flex justify="flex-end">
              <el-button type="primary" @click="handleQuery">{{ $t('common.query') }}</el-button>
              <el-button @click="resetQuery">{{ $t('common.reset') }}</el-button>
            </common-flex>
          </el-col>
        </el-row>
      </el-form>
      <el-form :model="queryParams" ref="queryForm" :inline="true">
        <common-flex wrap="wrap" class="mt15" style="width: 100%">
          <el-form-item :label="$t('site.name')+'：'" prop="siteName" label-width="110px">
            <el-input
              v-model="queryParams.siteName"
              :placeholder="$t('common.pleaseEnter')"
              clearable
              @keyup.enter.native="handleQuery"
            />
          </el-form-item>
          <el-form-item :label="$t('site.code')+'：'" prop="siteCode">
            <el-input
              v-model="queryParams.siteCode"
              :placeholder="$t('common.pleaseEnter')"
              clearable
              @keyup.enter.native="handleQuery"
            />
          </el-form-item>
          <el-form-item v-if="!brandShow" :label="$t('site.communicationModule')+'：'" prop="loggerExist">
            <el-select v-model="queryParams.loggerExist" :placeholder="$t('common.all')">
              <el-option v-for="i of communicationModule" :label="i.label" :value="i.value" :key="i.value"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item :label="$t('site.localTime') + '：'">
            <el-date-picker
              clearable
              v-model="queryTime"
              type="date"
              format="M/d/yyyy"
              value-format="yyyy-MM-dd"
              :placeholder="$t('common.pleaseSelect')"
              >
            </el-date-picker>
          </el-form-item>
        </common-flex>
      </el-form>
    </el-card>
    <div style="height: 20px"></div>
    <el-card>
      <common-flex class="mt5 mb10" justify="space-between" align="center">
        <div></div>
        <common-flex>
          <common-flex align="center" class="item">
            <span class="dot" style="background-color: #06A561"></span>
            <span>{{ $t('common.onLine') }}</span>
          </common-flex>
          <common-flex align="center" class="item">
            <span class="dot" style="background-color: #F0142F"></span>
            <span>{{ $t('common.alarm') }}</span>
          </common-flex>
          <common-flex align="center" class="item" style="margin-right: 4px">
            <span class="dot" style="background-color: #92929D"></span>
            <span>{{ $t('common.offLine') }}</span>
          </common-flex>
        </common-flex>
      </common-flex>
      <el-table v-loading="loading" :data="siteList" @selection-change="handleSelectionChange"
                border :header-cell-style="{'text-align': 'center', 'border-bottom': 'none' }" :cell-style="{'text-align': 'center', 'border-left': 'none', 'border-right': 'none', 'border-top': 'none'}"
      >
        <el-table-column :label="$t('common.no')" align="center" width="60">
          <template slot-scope="scope">
            {{ (+queryParams.pageNum - 1) * (+queryParams.pageSize) + scope.$index + 1 }}
          </template>
        </el-table-column>
        <el-table-column :label="$t('site.name')" align="center" prop="siteName" min-width="180" show-overflow-tooltip>
          <template slot-scope="{ row }">
            <common-flex align="center" justify="center">
              <span class="dot" v-if="+row.netStatus === 0" style="background-color: #92929D"></span>
              <span class="dot" v-if="+row.netStatus === 1 && +row.alarmStatus === 1" style="background-color: #F0142F"></span>
              <span class="dot" v-if="+row.netStatus === 1 && +row.alarmStatus === 0" style="background-color: #06A561"></span>
              <span class="ellipsis">{{ row.siteName }}</span>
            </common-flex>
          </template>
        </el-table-column>
        <el-table-column :label="$t('site.code')" align="center" prop="siteCode" min-width="130" />
        <el-table-column :label="$t('site.installationStatus')" align="center" prop="status" min-width="140">
          <template slot-scope="{ row }">
            <dict-tag :options="siteStatus" :value="row.status" />
          </template>
        </el-table-column>
        <el-table-column :label="$t('site.communicationModule')" align="center" prop="" min-width="180" v-if="!brandShow">
          <template slot-scope="{ row }">
            <dict-tag :options="communicationModule" :value="row.loggerExist"/>
          </template>
        </el-table-column>
        <el-table-column :label="$t('common.city')" align="center" prop="city" min-width="140" show-overflow-tooltip />
        <el-table-column :label="$t('common.province')" align="center" prop="province" min-width="140" show-overflow-tooltip />
        <el-table-column :label="$t('common.country')" align="center" prop="country" min-width="140" show-overflow-tooltip />
        <el-table-column :label="$t('common.installedTime')" align="center" prop="createTime" min-width="210">
          <template slot-scope="{ row }">
            <span v-if="row.createTime && row.createTime !== '--'">{{ UTC_DATE_FORMAT(+row.createTime, row.timeZone) }} {{row.utcTime}}</span>
            <span v-else>--</span>
          </template>
        </el-table-column>
        <el-table-column :label="$t('site.localTime')" align="center" prop="createTime" min-width="210">
          <template slot-scope="{ row }">
            <span v-if="row.createTime && row.createTime !== '--'">{{ DATE_FORMAT('M/d/yyyy hh:mm', +row.createTime * 1000) }} {{localUTC}}</span>
            <span v-else>--</span>
          </template>
        </el-table-column>
        <el-table-column :label="$t('common.agency')" align="center" prop="agentName" min-width="140" show-overflow-tooltip />
        <el-table-column v-if="brandShow" :label="$t('site.productBrand')" align="center" prop="brand" min-width="120" show-overflow-tooltip>
          <template slot-scope="{ row }">
            <span>{{ ['', 'Yoho', 'Jasper'][+row.brand] }}</span>
          </template>
        </el-table-column>
        <el-table-column :label="$t('common.lastUpdateTime')" align="center" prop="updateTime" min-width="130">
          <template slot-scope="{ row }">
            <span v-if="row.updateTime && row.updateTime !== '--'">{{ UTC_DATE_FORMAT(+row.updateTime, row.timeZone) }}</span>
            <span v-else>--</span>
          </template>
        </el-table-column>
        <el-table-column :label="$t('common.lastUpdateBy')" align="center" prop="updateBy" min-width="140" show-overflow-tooltip />
        <el-table-column fixed="right" :label="$t('common.operat')" align="center" class-name="small-padding fixed-width" min-width="130">
          <template slot-scope="scope">
            <el-button
              type="text"
            >
              <router-link v-hasPermi="['ati:site:view']" :to="`/site/details/${scope.row.id}?siteCode=${scope.row.siteCode}`">{{$t('common.detail')}}</router-link>
            </el-button>
            <el-button
              type="text"
              @click="handleDelete(scope.row)"
              v-hasPermi="['ati:site:remove']"
            >{{$t('common.delete')}}</el-button>
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
  </div>
</template>

<script>
import { listSite, getAddress, delSite } from "@/api/site"
import { communicationModule, siteStatus } from '@sub/utils/dict'

export default {
  name: "Site-view",
  data() {
    return {
      communicationModule,
      siteStatus,
      brandShow: process.env.VUE_APP_TITLE === 'ASPIRE TECH',
      queryTime: '',
      // 遮罩层
      loading: true,
      // 选中数组
      ids: [],
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      // 总条数
      total: 0,
      // 站点表格数据
      siteList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        startTime: '',
        endTime: '',
        loggerExist: '',
        pageNum: 1,
        pageSize: 10,
        siteName: null,
        address: null,
        siteCode: null,
        nickName: null,
        country: null,
        city: null,
        province: null
      },
      countryOption: [],
      provinceOption: [],
      cityOption: [],
      // 表单参数
      form: {},
      // 表单校验
      rules: {
      },
      optionsParams: {
        pageNum: '1',
        pageSize: '100',
        country: '', // 示例值：1 国家
        province: '', // 2 省
        city: '', // 2 城市
      }
    };
  },
  computed: {
    localUTC() {
      let offNum = this.GET_LOCAL_UTC() / 60
      if (offNum > 0 && offNum < 10) return `UTC+0${offNum}:00`
      else if (offNum < 0 && offNum > -10) return `UTC-0${offNum}:00`
      else if (offNum < -10) return `UTC-${offNum}:00`
      else return `UTC+${offNum}:00`
    }
  },
  watch: {
    queryTime(v) {
      if (!v) this.queryParams.startTime = this.queryParams.endTime = ''
    },
    'queryParams.country': {
      handler(v) {
        this.optionsParams.country = v
        this.optionsParams.province = this.optionsParams.city = this.queryParams.province = this.queryParams.city = ''
        this.getAddressOption()
      },
    },
    'queryParams.province': {
      handler(v) {
        this.optionsParams.province = v
        this.optionsParams.city = this.queryParams.city = ''
        this.getAddressOption()
      },
    }
  },
  mounted() {
    this.getList()
    this.getAddressOption()
  },
  methods: {
    getAddressOption() {
      getAddress(this.optionsParams).then(res => {
        if (!this.optionsParams.country) {
          this.countryOption = []
          res.rows.forEach(i => {
            let obj = {
              label: i.country,
              value: i.country,
            }
            this.countryOption.push(obj)
          })
          return
        }
        if (!this.optionsParams.province) {
          this.provinceOption = []
          res.rows.forEach(i => {
            let obj = {
              label: i.province,
              value: i.province,
            }
            this.provinceOption.push(obj)
          })
          return
        }
        if (!this.optionsParams.city) {
          this.cityOption = []
          res.rows.forEach(i => {
            let obj = {
              label: i.city,
              value: i.city,
            }
            this.cityOption.push(obj)
          })
        }
      })
    },
    /** 查询站点列表 */
    getList() {
      if (this.queryTime) {
        this.queryParams.startTime = new Date((`${this.queryTime} 00:00:00`)).getTime() / 1000
        this.queryParams.endTime = new Date((`${this.queryTime} 23:59:59`)).getTime() / 1000
      }
      this.loading = true;
      listSite(this.queryParams).then(response => {
        response.rows.forEach(i => {
          Object.keys(i).forEach(k => {
            if (!i[k] && !['loggerExist', 'netStatus', 'alarmStatus'].includes(k)) i[k] = '--'
          })
        })
        this.siteList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
    },
    // 取消按钮
    cancel() {
      this.open = false;
      this.reset();
    },
    // 表单重置
    reset() {
      this.form = {
        id: null,
        siteName: null,
        address: null,
        siteCode: null,
        country: null,
        city: null,
        province: null
      };
      this.resetForm("form");
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNum = 1;
      this.getList();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.queryParams.country = this.queryParams.province = this.queryParams.city = null
      this.queryTime = ''
      this.queryParams.startTime = this.queryParams.endTime = ''
      this.resetForm("queryForm");
      this.handleQuery();
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.id)
      this.single = selection.length!==1
      this.multiple = !selection.length
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "添加站点";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const ids = row.id || this.ids;
      this.$modal.confirm(this.$t('common.deleteConfirm')).then(() => {
        this.$modal.loading()
        return delSite(ids);
      }).then(() => {
        this.getList();
        this.$modal.msgSuccess(this.$t('common.deleted'));
      }).finally(() => this.$modal.closeLoading());
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download('ati/site/export', {
        ...this.queryParams
      }, `site_${new Date().getTime()}.xlsx`)
    }
  }
};
</script>

<style lang="scss">
.pages-site {
  .region {
    margin-bottom: 0;
  }
  .el-select {
    margin-right: 8px;
  }
  .table-title {
    margin-bottom: 25px;
    font-weight: 700;
  }
  .area-select {
    .el-input__inner {
      min-width: 220px;
    }
  }
  .dot {
    margin-right: 6px;
    flex-shrink: 0;
    @include wh(8);
    border-radius: 50%;
  }
  .item {
    margin-left: 24px;
    color: #606266;
  }
}
</style>

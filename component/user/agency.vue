<template>
  <div class="pages-user-agency app-container">
    <el-card class="pages-user-agency-card pane">
      <el-form :model="queryParams" :inline="true" ref="queryForm">
        <common-flex>
          <el-form-item :label="`${$t('common.agency')}:`" prop="agency">
            <el-input
              class="same-input"
              v-model="queryParams.agency"
              :placeholder="$t('common.pleaseEnter')"
              clearable
              @keyup.enter.native="handleQuery"
            />
          </el-form-item>
          <el-form-item :label="`${$t('user.agencyCode')}:`" prop="agencyCode">
            <el-input
              class="same-input"
              v-model="queryParams.agencyCode"
              :placeholder="$t('common.pleaseEnter')"
              clearable
              @keyup.enter.native="handleQuery"
            />
          </el-form-item>
          <el-form-item :label="`${$t('common.status')}:`" prop="status">
            <el-select
              class="same-input"
              v-model="queryParams.status"
              :placeholder="$t('common.all')"
              clearable
              @keyup.enter.native="handleQuery"
            >
              <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value"
                :disabled="item.disabled">
              </el-option>
            </el-select>
          </el-form-item>
          <common-flex style="flex-grow: 1; flex-shrink: 0" justify="flex-end" align="flex-end">
            <el-form-item>
              <el-button type="primary" @click="handleQuery">{{ $t('common.query') }}</el-button>
              <el-button @click="resetQuery">{{ $t('common.reset') }}</el-button>
            </el-form-item>
          </common-flex>
        </common-flex>
      </el-form>
    </el-card>
    <el-card class="pages-user-agency-card">
      <common-flex justify="flex-end" class="mb10">
        <el-button v-hasPermi="['ati:user:agency:add']" type="primary" @click="openToast(1)">{{ $t('common.add') }}</el-button>
      </common-flex>
      <el-table v-loading="loading" :data="agencyList" border
                :header-cell-style="{'text-align': 'center', 'border-bottom': 'none' }" :cell-style="{'text-align': 'center', 'border-left': 'none', 'border-right': 'none', 'border-top': 'none'}">
        <el-table-column :label="$t('common.no')" align="center" width="60">
          <template slot-scope="scope">
            {{ (+queryParams.pageNum - 1) * (+queryParams.pageSize) + scope.$index + 1 }}
          </template>
        </el-table-column>
        <el-table-column :label="$t('common.agency')" align="center" prop="agency" min-width="120" show-overflow-tooltip />
        <el-table-column :label="$t('user.agencyCode')" align="center" prop="agencyCode" min-width="120"/>
        <el-table-column :label="$t('common.status')" align="center" prop="status">
          <template slot-scope="{ row }">
            <dict-tag v-if="row.status && row.status !== '--'" :options="options" :value="row.status" />
            <span v-else>--</span>
          </template>
        </el-table-column>
        <el-table-column :label="$t('common.remarks')" align="center" prop="remark" show-overflow-tooltip></el-table-column>
        <el-table-column :label="$t('common.creationTime')" align="center" prop="createTime" min-width="160">
          <template slot-scope="{ row }">
            <span v-if="row.createTime && row.createTime !== '--'">{{ UTC_DATE_FORMAT(row.createTime, timeZone) }}</span>
            <span v-else>--</span>
          </template>
        </el-table-column>
        <el-table-column :label="$t('common.creationBy')" align="center" prop="createBy" min-width="120" />
        <el-table-column :label="$t('common.lastUpdateTime')" align="center" prop="updateTime" min-width="160">
          <template slot-scope="{ row }">
            <span v-if="row.updateTime && row.updateTime !== '--'">{{ UTC_DATE_FORMAT(row.updateTime, timeZone) }}</span>
            <span v-else>--</span>
          </template>
        </el-table-column>
        <el-table-column :label="$t('common.lastUpdateBy')" align="center" prop="updateBy" min-width="160" />
        <el-table-column :label="$t('common.operation')" align="center" fixed="right" class-name="small-padding fixed-width" min-width="120">
          <template slot-scope="scope">
            <el-button
              type="text"
              @click="openToast(0, scope.row)"
              v-hasPermi="['ati:user:agency:edit']"
            >{{ $t('common.modify') }}</el-button>
            <el-button
              type="text"
              @click="handleDelete(scope.row)"
              v-hasPermi="['ati:user:agency:remove']"
            >{{ $t('common.delete') }}</el-button>
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
    <AccountAdd v-if="show" :show.sync="show" :type="type" :item="modifyItem" @refresh="getList" />
  </div>
</template>

<script>
import AccountAdd from '@subComp/user/agency-add.vue'
import { delAtiAgency, getAgencyList } from "@/api/agency"
import {mapState} from "vuex"
import { agencyStatus } from '@sub/utils/dict'

export default {
  name: "pages-agency",
  components: { AccountAdd },
  data() {
    return {
      type: '',
      modifyItem: {},
      agencyList: [],
      loading: true,
      show: false,
      total: 0,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        agency: null,
        agencyCode: null,
        status: null
      },
      options: agencyStatus,
    }
  },
  computed: {
    ...mapState({
      'timeZone': state => state.user.timeZone,
    })
  },
  mounted() {
    this.getList()
  },
  methods: {
    openToast(flag, item) {
      if (flag) this.type = 'add'
      else this.type = 'modify'
      this.show = true
      if (item) this.modifyItem = item
      else this.modifyItem = {}
    },
    handleDelete(row) {
      const ids = row.id
      this.$modal.confirm(this.$t('common.deleteConfirm')).then(() => {
        this.$modal.loading()
        return delAtiAgency(ids)
      }).then(() => {
        this.getList()
        this.$modal.msgSuccess(this.$t('common.deleted'))
      }).finally(() => this.$modal.closeLoading())
    },
    getList() {
      this.loading = true;
      getAgencyList(this.queryParams).then(response => {
        response.rows.forEach(i => {
          Object.keys(i).forEach(k => {
            if (!i[k]) i[k] = '--'
          })
        })
        this.agencyList = response.rows
        this.total = response.total
        this.loading = false
      });
    },
    handleQuery() {
      this.queryParams.pageNum = 1;
      this.getList();
    },
    resetQuery() {
      this.resetForm("queryForm");
      this.handleQuery();
    },
  }
}
</script>

<style lang="scss">
.pages-user-agency {
  &-card {
    margin-bottom: 24px;
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
      //padding-bottom: 0;
    }
  }
  .el-radio__label {
    display: none;
  }
  .same-input {
    .el-input__inner {
      width: 230px;
      @media screen and (max-width: 1334px) {
        width: 130px;
      }
    }
  }
}
</style>

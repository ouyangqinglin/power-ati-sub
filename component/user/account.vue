<template>
  <div class="app-container pages-user-account">
    <el-card class="pages-user-account-card pane">
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane :label="$t('common.customer')" name="1"></el-tab-pane>
        <el-tab-pane :label="$t('task.installer')" name="2"></el-tab-pane>
        <el-tab-pane :label="$t('common.agency')" name="3"></el-tab-pane>
        <el-tab-pane v-if="+($store.state.user.userType) === 4" :label="$t('common.administrator')" name="5"></el-tab-pane>
      </el-tabs>
    </el-card>
    <el-card class="pages-user-account-card pane">
      <el-form :model="queryParams" :inline="true" ref="queryForm">
        <common-flex>
          <common-flex wrap="wrap">
            <el-form-item :label="`${$t('user.userName')}:`" prop="userName">
              <el-input
                v-model="queryParams.userName"
                :placeholder="$t('common.pleaseEnter')"
                clearable
                @keyup.enter.native="handleQuery"
              />
            </el-form-item>
            <el-form-item :label="`${$t('user.userAccount')}:`" prop="email">
              <el-input
                v-model="queryParams.email"
                :placeholder="$t('common.pleaseEnter')"
                clearable
                @keyup.enter.native="handleQuery"
              />
            </el-form-item>
            <el-form-item :label="`${$t('common.status')}:`" prop="status">
              <el-select
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
            <el-form-item v-if="![4, 5].includes(+queryParams.type)" :label="`${$t('common.agency')}:`" prop="agentName">
              <el-input
                v-model="queryParams.agentName"
                :placeholder="$t('common.pleaseEnter')"
                clearable
                @keyup.enter.native="handleQuery"
              />
            </el-form-item>
          </common-flex>
          <common-flex style="flex-grow: 1; flex-shrink: 0" justify="flex-end">
            <el-form-item>
              <el-button type="primary" @click="handleQuery">{{ $t('common.query') }}</el-button>
              <el-button @click="resetQuery">{{ $t('common.reset') }}</el-button>
            </el-form-item>
          </common-flex>
        </common-flex>
      </el-form>
    </el-card>
    <el-card class="pages-user-account-card">
      <common-flex justify="flex-end" class="mb10">
        <el-button type="primary" @click="show = true" v-hasPermi="['ati:user:account:add']">{{ $t('common.add') }}</el-button>
      </common-flex>
      <el-table v-loading="loading" :data="atiUserList"
                key="1" border
                :header-cell-style="{'text-align': 'center', 'border-bottom': 'none' }" :cell-style="{'text-align': 'center', 'border-left': 'none', 'border-right': 'none', 'border-top': 'none'}"
                @selection-change="handleSelectionChange">
        <el-table-column :label="$t('common.no')" align="center" width="60">
          <template slot-scope="scope">
            {{ (+queryParams.pageNum - 1) * (+queryParams.pageSize) + scope.$index + 1 }}
          </template>
        </el-table-column>
        <el-table-column v-if="+queryParams.type === 1" :label="$t('user.userAccount')" align="center" prop="email" min-width="270">
          <template slot-scope="{ row }">
            <span style="margin-right: 6px">{{ row.email }}</span>
            <el-tag v-if="+queryParams.type === 1" size="mini" :type="tagType[+row.active]">{{accountActive[+row.active] }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column v-else :label="$t('user.userAccount')" align="center" prop="email" min-width="160" />
        <el-table-column :label="$t('user.userName')" align="center" prop="userName" min-width="120" show-overflow-tooltip />
        <el-table-column :label="$t('user.role')" align="center" prop="rolesList" min-width="120" show-overflow-tooltip>
        </el-table-column>
        <el-table-column v-if="+queryParams.type === 1" :label="$t('common.phone')" align="center" prop="phone" min-width="120" show-overflow-tooltip/>
        <el-table-column v-if="+queryParams.type !== 5" :label="$t('common.agency')" align="center" prop="agentName" min-width="140" show-overflow-tooltip />
        <el-table-column v-if="+queryParams.type === 3" :label="$t('user.agencyCode')" align="center" prop="agencyCode" min-width="120" />
        <el-table-column :label="$t('common.status')" align="center" prop="status">
          <template slot-scope="{ row }">
            <dict-tag v-if="row.status && row.status !== '--'" :options="options" :value="row.status" />
            <span v-else>--</span>
          </template>
        </el-table-column>
        <el-table-column :label="$t('common.remarks')" align="center" show-overflow-tooltip prop="remark" min-width="120" />
        <el-table-column :label="$t('common.creationTime')" align="center" prop="createTime" min-width="160">
          <template slot-scope="{ row }">
            <span v-if="row.createTime && row.createTime !== '--'">{{ UTC_DATE_FORMAT(row.createTime, timeZone) }}</span>
            <span v-else>--</span>
          </template>
        </el-table-column>
        <el-table-column :label="$t('common.creationBy')" align="center" prop="createBy" min-width="130" show-overflow-tooltip />
        <el-table-column :label="$t('common.lastUpdateTime')" align="center" prop="updateTime" min-width="160">
          <template slot-scope="{ row }">
            <span v-if="row.updateTime && row.updateTime !== '--'">{{ UTC_DATE_FORMAT(row.updateTime, timeZone) }}</span>
            <span v-else>--</span>
          </template>
        </el-table-column>
        <el-table-column :label="$t('common.lastUpdateBy')" align="center" prop="updateBy" min-width="130" show-overflow-tooltip />
        <el-table-column :label="$t('common.operation')" align="center" fixed="right" class-name="small-padding fixed-width" min-width="120">
          <template slot-scope="scope">
            <el-button
              :disabled="+($store.state.user.userId) === +scope.row.id"
              type="text"
              @click="openModify(scope.row)"
              v-hasPermi="['ati:user:account:edit']"
            >{{ $t('common.modify') }}</el-button>
            <el-button
              type="text"
              @click="handleDelete(scope.row)"
              v-hasPermi="['ati:user:account:remove']"
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
    <AccountAdd v-if="show" :show.sync="show" :type="+queryParams.type" :active="activeName" @refresh="getList" />
    <AccountModify :show.sync="showModify" :type="+queryParams.type" :active="activeName" :id="userId" @refresh="getList" />
  </div>
</template>

<script>
import { listAtiUser, getAtiUser, delAtiUser, addAtiUser, updateAtiUser } from "@/api/user"
import AccountAdd from '@subComp/user/account-add.vue'
import AccountModify from '@subComp/user/account-modify.vue'
import {mapState} from "vuex";
import { agencyStatus } from '@sub/utils/dict'
import { tagType, accountActive } from '@sub/utils/map'

const storageList = {}
// 添加customer 类型账号要agency && siteList 添加其他类型账号不需要siteList
// 添加admin 类型账号不需要agency && siteList
export default {
  name: "pages-account",
  components: { AccountAdd, AccountModify },
  data() {
    return {
      tagType,
      accountActive,
      userId: '',
      show: false,
      showModify: false,
      activeName: '1',
      // 遮罩层
      loading: true,
      // 选中数组
      ids: [],
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      // 显示搜索条件
      showSearch: true,
      // 总条数
      total: 0,
      // 用户表格数据
      atiUserList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        type: 1,
        email: '',
        userName: '',
        status: '',
        agentName: ''
      },
      options: agencyStatus,
      // 表单参数
      form: {},
    };
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
    openModify(i) {
      this.showModify = true
      this.userId = i.id + ''
    },
    handleClick() {
      this.queryParams.type = +this.activeName
      if (storageList[this.queryParams.type]) {
        this.atiUserList = storageList[this.queryParams.type].rows
        this.total = storageList[this.queryParams.type].total
      } else this.getList()

    },
    /** 查询用户列表 */
    getList() {
      this.loading = true;
      let data = {}
      if (+this.queryParams.type === 5) {
        data = {...this.queryParams, agentName: ''}
      } else data = this.queryParams
      listAtiUser(data).then(response => {
        response.rows.forEach(i => {
          Object.keys(i).forEach(k => {
            if (!i[k]) i[k] = '--'
          })
        })
        storageList[this.queryParams.type] = response
        this.atiUserList = response.rows
        this.total = response.total
        this.loading = false
      });
    },

    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNum = 1;
      this.getList();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.resetForm("queryForm");
      if (+this.queryParams.type !== 5) this.queryParams.agentName = ''
      this.handleQuery();
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.id)
      this.single = selection.length!==1
      this.multiple = !selection.length
    },

    /** 删除按钮操作 */
    handleDelete(row) {
      const ids = row.id || this.ids;
      this.$modal.confirm(this.$t('common.deleteConfirm')).then(() => {
        this.$modal.loading()
        return delAtiUser(ids);
      }).then(() => {
        this.getList();
        this.$modal.msgSuccess(this.$t('common.deleted'));
      }).finally(() => this.$modal.closeLoading());
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download('ati/atiUser/export', {
        ...this.queryParams
      }, `atiUser_${new Date().getTime()}.xlsx`)
    }
  }
};
</script>
<style lang="scss">
.pages-user-account {
  &-card {
    margin-bottom: 24px;
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
  .el-radio__label {
    display: none;
  }
}
</style>

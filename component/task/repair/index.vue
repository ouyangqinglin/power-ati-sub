<template>
  <div class="app-container pages-repair">
    <el-card class="pages-repair-header" >
      <el-form :model="queryParams" ref="queryForm" :inline="true" label-width="100px">
        <common-flex>
          <el-form-item :label="`${$t('task.code')}：`" prop="code">
            <el-input
              class="same-input"
              v-model="queryParams.code"
              :placeholder="$t('common.pleaseEnter')"
              clearable
              @keyup.enter.native="handleQuery"
            />
          </el-form-item>
          <el-form-item class="second-item" :label="`${$t('task.repairman')}：`" prop="installer" label-width="200px">
            <el-input
              class="same-input"
              v-model="queryParams.installer"
              :placeholder="$t('common.pleaseEnter')"
              @keyup.enter.native="handleQuery"
              clearable />
          </el-form-item>
          <common-flex style="flex: 1" justify="flex-end">
            <el-form-item>
              <el-button type="primary" @click="handleQuery">{{ $t('common.query') }}</el-button>
              <el-button @click="resetQuery">{{ $t('common.reset') }}</el-button>
            </el-form-item>
          </common-flex>
        </common-flex>
      </el-form>
      <el-form :model="queryParams" :inline="true" label-width="100px">
        <el-form-item class="region" :label="`${$t('common.status')}：`" prop="status" style="margin-bottom: 0">
          <el-select
            class="same-input"
            v-model="queryParams.status"
            :placeholder="$t('common.all')"
            clearable
            @keyup.enter.native="handleQuery"
          >
            <el-option
              v-for="item in taskInstallStatus"
              :key="item.value"
              :label="item.label"
              :value="item.value"
              :disabled="item.disabled">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item class="second-item" :label="`${$t('task.taskCompletedTime')}：`" prop="createTime" label-width="200px" style="margin-bottom: 0">
          <el-date-picker
            class="same-input"
            clearable
            v-model="queryTime"
            type="date"
            format="MM/dd/yyyy"
            value-format="yyyy-M-d"
            :placeholder="$t('common.pleaseSelect')">
          </el-date-picker>
        </el-form-item>
      </el-form>
    </el-card>
    <div style="height: 20px"></div>
    <el-card>
      <common-flex justify="flex-end" class="mb10">
        <el-button @click="openAdd" type="primary" v-hasPermi="['ati:task:repair:add']">{{ $t('common.add') }}</el-button>
      </common-flex>
      <el-table :header-cell-style="{'text-align': 'center', 'border-bottom': 'none' }" :cell-style="{'text-align': 'center', 'border-left': 'none', 'border-right': 'none', 'border-top': 'none'}" border
                v-loading="loading" :data="taskList" @selection-change="handleSelectionChange">
        <el-table-column :label="$t('common.no')" align="center" width="60">
          <template slot-scope="scope">
            {{ (+queryParams.pageNum - 1) * (+queryParams.pageSize) + scope.$index + 1 }}
          </template>
        </el-table-column>
        <el-table-column :label="$t('task.code')" align="center" prop="code" min-width="210" />
        <el-table-column :label="$t('task.type')" align="center" prop="type" min-width="130">
          <template slot-scope="{ row }">
            <dict-tag :options="taskType" :value="row.type"/>
          </template>
        </el-table-column>
        <el-table-column :label="$t('common.status')" align="center" prop="status" min-width="100">
          <template slot-scope="{ row }">
            <dict-tag :options="taskInstallStatus" :value="row.status"/>
          </template>
        </el-table-column>
        <el-table-column :label="$t('common.customer')" align="center" prop="customer" min-width="130" show-tooltip-when-overflow />
        <el-table-column :label="$t('task.repairman')" align="center" prop="installer" min-width="130" show-overflow-tooltip />
        <el-table-column :label="$t('task.appointmentTime')" align="center" prop="appointTime" min-width="180">
          <template slot-scope="{ row }">
            <span v-if="row.appointTime && row.appointTime !== '--'">{{ UTC_DATE_FORMAT(row.appointTime, timeZone) }}</span>
            <span v-else>--</span>
          </template>
        </el-table-column>
        <el-table-column :label="$t('task.taskReceivingTime')" align="center" prop="startTime" min-width="180">
          <template slot-scope="{ row }">
            <span v-if="row.startTime && row.startTime !== '--'">{{ UTC_DATE_FORMAT(row.startTime, timeZone) }}</span>
            <span v-else>--</span>
          </template>
        </el-table-column>
        <el-table-column :label="$t('task.taskCompletedTime')" align="center" prop="endTime" min-width="180">
          <template slot-scope="{ row }">
            <span v-if="row.endTime && row.endTime !== '--'">{{ UTC_DATE_FORMAT(row.endTime, timeZone) }}</span>
            <span v-else>--</span>
          </template>
        </el-table-column>
        <el-table-column :label="$t('common.agency')" align="center" prop="agentName" min-width="130" />
        <el-table-column :label="$t('common.creationTime')" align="center" prop="createTime" min-width="180">
          <template slot-scope="{ row }">
            <span v-if="row.createTime && row.createTime !== '--'">{{ UTC_DATE_FORMAT(row.createTime, timeZone) }}</span>
            <span v-else>--</span>
          </template>
        </el-table-column>
        <el-table-column :label="$t('common.creationBy')" align="center" prop="createBy" min-width="140" />
        <el-table-column :label="$t('common.lastUpdateTime')" align="center" prop="updateTime" min-width="140">
          <template slot-scope="{ row }">
            <span v-if="row.updateTime && row.updateTime !== '--'">{{ UTC_DATE_FORMAT(row.updateTime, timeZone) }}</span>
            <span v-else>--</span>
          </template>
        </el-table-column>
        <el-table-column :label="$t('common.lastUpdateBy')" align="center" prop="updateBy" min-width="140" />
        <el-table-column fixed="right" :label="$t('common.operation')" align="center" class-name="small-padding fixed-width" min-width="160">
          <template slot-scope="scope">
            <el-button
              type="text"
            >
              <router-link v-hasPermi="['ati:task:repair:view']" :to="`/task/repair/view/${scope.row.id}`">{{ $t('common.detail') }}</router-link>
            </el-button>
            <el-button
              :disabled="+scope.row.status > 1"
              type="text"
            >
              <router-link v-if="!(+scope.row.status > 1)" v-hasPermi="['ati:task:repair:edit']" :to="`/task/repair/modify/${scope.row.id}`">{{ $t('common.modify') }}</router-link>
              <span v-else>{{ $t('common.modify') }}</span>
            </el-button>
            <el-button
              :disabled="+scope.row.status > 1"
              type="text"
              @click="handleDelete(scope.row)"
              v-hasPermi="['ati:task:repair:remove']"
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
    <AddDialog :show.sync="showModel" :type="1" header="Please select a customer" />
  </div>
</template>

<script>
import { listTask, delTask } from "@/api/task"
import AddDialog from "@subComp/task/siteList.vue"
import {mapState} from "vuex";
import { taskType, taskInstallStatus } from '@sub/utils/dict'

export default {
  name: "Repair",
  components: { AddDialog },
  data() {
    return {
      taskType,
      taskInstallStatus,
      showModel: false, // 选择用户弹窗
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
      taskList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      queryTime: '',
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        endTime: '', // 2022-9-23
        status: '', // {number} 1-pending 2-procession 3-complete
        code: '', // 任务编码
        installer: '', // {number} 安装用户id
        type: 1
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
      },
    };
  },
  computed: {
    ...mapState({
      'timeZone': state => state.user.timeZone,
    })
  },
  watch: {
    queryTime(v) {
      if (!v) this.queryParams.startTime = this.queryParams.endTime = ''
    },
  },
  mounted() {
    this.getList()
  },
  activated() {
    if (this.$route.query?.refresh) this.getList()
  },
  methods: {
    // 打开add弹窗
    openAdd() {
      this.showModel = true
    },
    /** 查询站点列表 */
    getList() {
      this.loading = true;
      if (this.queryTime) {
        this.queryParams.startTime = new Date((`${this.queryTime} 00:00:00`)).getTime() / 1000
        this.queryParams.endTime = new Date((`${this.queryTime} 23:59:59`)).getTime() / 1000
      }
      listTask(this.queryParams).then(response => {
        response.rows.forEach(i => {
          Object.keys(i).forEach(k => {
            if (i === 'remark') {}
            else if (!i[k]) i[k] = '--'
          })
        })
        this.taskList = response.rows;
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
        endTime: null,
        status: null,
        code: null,
        installer: null,
      }
      this.resetForm("form");
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNum = 1;
      this.getList();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.queryParams.status = ''
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
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.id != null) {
            updateSite(this.form).then(response => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addSite(this.form).then(response => {
              this.$modal.msgSuccess("新增成功");
              this.open = false;
              this.getList();
            });
          }
        }
      });
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const ids = row.id || this.ids;
      this.$modal.confirm(`Please confirm whether to delete`).then(() => {
        this.$modal.loading()
        return delTask(ids);
      }).then(() => {
        this.getList();
        this.$modal.msgSuccess("Deleted!");
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
.pages-repair {
  .el-radio__label {
    display: none;
  }
  .table-title {
    margin-bottom: 25px;
    font-weight: 700;
  }
  .same-input {
    .el-input__inner {
      width: 230px;
      @media screen and (max-width: 1334px) {
        width: 160px;
      }
    }
  }
}
</style>

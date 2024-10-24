<template>
  <div class="app-container pages-fault-repair">
    <el-card class="pages-fault-repair-header" >
      <el-form :model="queryParams" ref="queryForm" :inline="true">
        <el-row>
          <el-col :span="6">
            <el-form-item :label="`${$t('task.faultCode')}：`" prop="code" class="same-input">
              <el-input
                v-model="queryParams.code"
                :placeholder="$t('common.pleaseEnter')"
                clearable
                @keyup.enter.native="handleQuery"
              />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item :label="`${$t('common.creationTime')}：`" prop="createTime">
              <el-date-picker
                clearable
                v-model="queryTime"
                type="date"
                format="MM/dd/yyyy"
                value-format="yyyy-M-d"
                :placeholder="$t('common.pleaseSelect')">
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item :label="`${$t('common.status')}：`" prop="status" class="same-input">
              <el-select
                v-model="queryParams.status"
                :placeholder="$t('common.all')"
                clearable
                @keyup.enter.native="handleQuery"
              >
                <el-option
                  v-for="item in taskFaultStatus"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                  :disabled="item.disabled">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <common-flex justify="flex-end">
              <el-form-item>
                <el-button type="primary" @click="handleQuery">{{ $t('common.query') }}</el-button>
                <el-button @click="resetQuery">{{ $t('common.reset') }}</el-button>
              </el-form-item>
            </common-flex>
          </el-col>
        </el-row>
      </el-form>
    </el-card>
    <div style="height: 20px"></div>
    <el-card>
      <el-table :header-cell-style="{'text-align': 'center', 'border-bottom': 'none' }" :cell-style="{'text-align': 'center', 'border-left': 'none', 'border-right': 'none', 'border-top': 'none'}" border
                v-loading="loading" :data="taskList" @selection-change="handleSelectionChange">
        <el-table-column :label="$t('common.no')" align="center" width="60">
          <template slot-scope="scope">
            {{ (+queryParams.pageNum - 1) * (+queryParams.pageSize) + scope.$index + 1 }}
          </template>
        </el-table-column>
        <el-table-column :label="$t('task.faultCode')" align="center" prop="code" min-width="160" show-overflow-tooltip />
        <el-table-column :label="$t('task.faultTitle')" align="center" prop="title" min-width="130">
        </el-table-column>
        <el-table-column :label="$t('common.status')" align="center" prop="status" min-width="100">
          <template slot-scope="{ row }">
            <dict-tag :options="taskFaultStatus" :value="row.status"/>
          </template>
        </el-table-column>
        <el-table-column :label="$t('task.site')" align="center" prop="siteName" show-overflow-tooltip min-width="130" />
        <el-table-column :label="$t('common.customer')" align="center" show-tooltip-when-overflow prop="customer" min-width="130"/>
        <el-table-column :label="$t('task.taskCompletedTime')" align="center" prop="endTime" min-width="180">
          <template slot-scope="{ row }">
            <span v-if="row.endTime && row.endTime !== '--'">{{ UTC_DATE_FORMAT(row.endTime, timeZone) }}</span>
            <span v-else>--</span>
          </template>
        </el-table-column>
        <el-table-column :label="$t('common.agency')" align="center" prop="agentName" min-width="130" show-overflow-tooltip />
        <el-table-column :label="$t('common.creationTime')" align="center" prop="createTime" min-width="180">
          <template slot-scope="{ row }">
            <span v-if="row.createTime && row.createTime !== '--'">{{ UTC_DATE_FORMAT(row.createTime, timeZone) }}</span>
            <span v-else>--</span>
          </template>
        </el-table-column>
        <el-table-column :label="$t('common.creationBy')" align="center" prop="createBy" min-width="140" show-overflow-tooltip />
        <el-table-column :label="$t('common.lastUpdateTime')" align="center" prop="updateTime" min-width="140">
          <template slot-scope="{ row }">
            <span v-if="row.updateTime && row.updateTime !== '--'">{{ UTC_DATE_FORMAT(row.updateTime, timeZone) }}</span>
            <span v-else>--</span>
          </template>
        </el-table-column>
        <el-table-column :label="$t('common.lastUpdateBy')" align="center" prop="updateBy" min-width="140" />
        <el-table-column fixed="right" :label="$t('common.operation')" align="center" class-name="small-padding fixed-width" min-width="100">
          <template slot-scope="scope">
            <el-button type="text">
              <router-link v-hasPermi="['ati:task:fault:view']" :to="`/task/fault/view/${scope.row.id}`">{{ $t('common.detail') }}</router-link>
            </el-button>
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
import { listTask, delTask } from "@/api/task"
import {taskFaultStatus} from '@sub/utils/dict'
import {mapState} from "vuex";

export default {
  name: "pages-fault-repair",
  data() {
    return {
      taskFaultStatus,
      showModel: false, // 选择用户弹窗
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
        createTime: '', // 2022-9-23
        status: '', // {number} 1-pending 2-procession 3-complete
        code: '', // 任务编码
        type: 3
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
  created() {
    this.getList()
  },
  methods: {
    // 打开add弹窗
    openAdd() {
      this.showModel = true
    },
    /** 查询站点列表 */
    getList() {
      this.loading = true
      if (this.queryTime) {
        this.queryParams.startTime = new Date((`${this.queryTime} 00:00:00`)).getTime() / 1000
        this.queryParams.endTime = new Date((`${this.queryTime} 23:59:59`)).getTime() / 1000
      }
      listTask(this.queryParams).then(response => {
        response.rows.forEach(i => {
          Object.keys(i).forEach(k => {
            if (!i[k]) i[k] = '--'
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
        install_uid: null,
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
      this.$modal.confirm(`Please confirm whether to delete`).then(function() {
        return delTask(ids);
      }).then(() => {
        this.getList();
        this.$modal.msgSuccess("Deleted!");
      }).catch(() => {});
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
.pages-fault-repair {
  overflow-x: auto;
  .table-title {
    margin-bottom: 25px;
    font-weight: 700;
  }
  .el-card__body {
    padding: 20px 20px 20px 20px;
  }
  .el-form-item {
    //margin-bottom: 0;
  }

  .same-input {
    .el-form-item__content {
      @media screen and (max-width: 1334px) {
        width: 130px;
      }
      .el-date-editor.el-input {
        @media screen and (max-width: 1334px) {
          width: 130px;
        }
      }
    }
    .el-date-editor.el-input {
      width: 130px;
    }
    .el-input__inner {
      //width: 230px;
      @media screen and (max-width: 1334px) {
        width: 130px;
      }
    }
  }
}
</style>

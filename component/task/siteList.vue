<template>
  <el-dialog :visible.sync="show" :title="$t('common.pleaseSelect')"
             :before-close="beforeClose"
             :close-on-click-modal ="false"
             width="65%">
    <el-form @submit.native.prevent :model="queryParams" ref="queryForm" size="small" :inline="true">
      <common-flex justify="space-between">
        <el-form-item :label="`${$t('site.name')}:`" prop="siteName">
          <el-input
            v-model="queryParams.siteName"
            :placeholder="$t('common.pleaseEnter')"
            maxlength="200"
            clearable
            @keyup.enter.native="handleQuery"
          />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" size="mini" @click="handleQuery">{{ $t('common.query') }}</el-button>
          <el-button size="mini" @click="resetQuery">{{ $t('common.reset') }}</el-button>
        </el-form-item>
      </common-flex>
    </el-form>


    <el-table v-loading="loading" :data="atiUserList"
              :header-cell-style="{'text-align': 'center', 'border-bottom': 'none' }" :cell-style="{'text-align': 'center', 'border-left': 'none', 'border-right': 'none', 'border-top': 'none'}"
              @selection-change="handleSelectionChange"
              border
    >
            <el-table-column width="85">
              <template slot-scope="{ row }">
                <el-radio class="my-radio" v-model="chooseRadio" :label="row.id"></el-radio>
              </template>
            </el-table-column>
      <el-table-column :label="$t('site.name')" align="center" prop="siteName" />
      <el-table-column :label="$t('site.code')" align="center" prop="siteCode" />
    </el-table>

    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      @pagination="getList"
    />
    <common-flex style="margin-top: 30px" justify="center">
      <el-button :type="btnType" :disabled="!chooseRadio" @click="change">
        <span>{{ $t('common.confirm') }}</span>
      </el-button>
      <el-button @click="cancel">{{ $t('common.cancel') }}</el-button>
    </common-flex>

  </el-dialog>
</template>

<script>
import { listSite } from "@/api/site"

export default {
  name: "comp-add-dialog",
  props: {
    show: Boolean,
  },
  data() {
    return {
      multipleSelection: [],
      chooseRadio: '',
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
        siteName: null,
      },
      // 表单参数
      form: {},
    }
  },
  computed: {
    btnType() {
      return this.chooseRadio ? 'primary' : ''
    }
  },
  watch: {
    show(v) {
      if (!v) {
        this.chooseRadio = ''
        return
      }
      Object.keys(this.queryParams).forEach(i => {
        this.queryParams[i] = ''
      })
      this.queryParams.pageNum = 1
      this.queryParams.pageSize = 10
      this.getList();
    }
  },
  created() {
    this.getList();
  },
  methods: {
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    change() {
      let installer
      this.atiUserList.forEach(i => {
        if (i.id === this.chooseRadio) installer = i
      })
      this.$emit('change', installer)
      this.$router.push({name: 'Repair-add', params: installer})
      this.beforeClose()
    },
    beforeClose() {
      this.$emit('update:show', false)
    },
    /** 查询用户列表 */
    getList() {
      this.loading = true
      listSite(this.queryParams).then(response => {
        response.rows.forEach(i => {
          Object.keys(i).forEach(k => {
            if (!i[k]) i[k] = '--'
          })
        })
        this.atiUserList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
    },
    // 取消按钮
    cancel() {
      this.beforeClose()
    },
    // 表单重置
    reset() {
      this.form = {
        id: null,
        email: null,
        password: null,
        phone: null,
        type: null,
        createTime: null,
        userName: null,
        agentUid: null
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
      this.resetForm("queryForm");
      this.handleQuery();
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "添加用户";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids
      getAtiUser(id).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改用户";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.id != null) {
            updateAtiUser(this.form).then(response => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addAtiUser(this.form).then(response => {
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
      this.$modal.confirm('是否确认删除用户编号为"' + ids + '"的数据项？').then(function() {
        return delAtiUser(ids);
      }).then(() => {
        this.getList();
        this.$modal.msgSuccess("删除成功");
      }).catch(() => {});
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download('ati/atiUser/export', {
        ...this.queryParams
      }, `atiUser_${new Date().getTime()}.xlsx`)
    }
  }
}
</script>

<style lang="scss">
.comp-add-dialog {

}
</style>

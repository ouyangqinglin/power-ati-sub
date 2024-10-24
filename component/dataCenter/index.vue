<template>
  <div class="pages-data-center app-container">
    <el-card>
      <common-flex justify="flex-end" class="mb10">
        <div v-hasPermi="['ati:data:add']"><el-button type="primary" @click="addShow = true">{{ $t('common.add') }}</el-button></div>
      </common-flex>
      <el-table :header-cell-style="{'text-align': 'center', 'border-bottom': 'none' }" :cell-style="{'text-align': 'center', 'border-left': 'none', 'border-right': 'none', 'border-top': 'none'}"
                v-loading="loading" :data="list" border
      >
        <el-table-column :label="$t('common.no')" align="center" width="60">
          <template slot-scope="scope">
            {{ (+queryParams.pageNum - 1) * (+queryParams.pageSize) + scope.$index + 1 }}
          </template>
        </el-table-column>
        <el-table-column :label="$t('dataCenter.name')" prop="name"></el-table-column>
        <el-table-column :label="$t('dataCenter.updateTime')" prop="updateTime">
          <template slot-scope="{ row }">
            <span v-if="row.updateTime && row.updateTime !== '--'">{{ DATE_FORMAT('M/d/yyyy hh:mm', row.updateTime) }}</span>
            <span v-else>--</span>
          </template>
        </el-table-column>
        <el-table-column :label="$t('common.remarks')" prop="remarks" show-tooltip-when-overflow></el-table-column>
        <el-table-column :label="$t('common.status')" prop="status">
          <template slot-scope="{ row }">
            <span v-if="row.status && row.status !== '--'">{{ validMap[+row.status] }}</span>
            <span v-else>--</span>
          </template>
        </el-table-column>
        <el-table-column fixed="right" :label="$t('common.operation')" align="center" class-name="small-padding fixed-width" min-width="100">
          <template slot-scope="scope">
            <el-button v-hasPermi="['ati:data:view']" type="text" @click="changeShow(1, scope.row.id)">{{ $t('common.detail') }}</el-button>
            <el-button v-if="+scope.row.type !== 1" v-hasPermi="['ati:data:edit']" type="text" @click="changeShow(2, scope.row.id)">{{ $t('common.modify') }}</el-button>
            <el-button v-if="+scope.row.type !== 1" v-hasPermi="['ati:data:remove']" type="text" @click="deleteItem(scope.row.id)">{{ $t('common.delete') }}</el-button>
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
    <Add v-if="addShow" @refresh="getList" :show.sync="addShow" />
    <Details v-if="show" @refresh="getList" :id="id" :type="toastType" :show.sync="show" />
  </div>
</template>

<script>
import { getList, del } from '@/api/dataCenter'
import Add from './add.vue'
import Details from './view.vue'
import { validMap } from '@sub/utils/map'

export default {
  name: "pages-data-center",
  components: { Add, Details },
  data() {
    return {
      validMap,
      total: 0,
      loading: false,
      addShow: false,
      show: false,
      list: [],
      toastType: 1,
      id: '',
      base: {},
      queryParams: {
        pageNum: 1,
        pageSize: 10
      }
    }
  },
  mounted() {
    this.getList()
  },
  methods: {
    deleteItem(id) {
      this.$modal.confirm(this.$t('dataCenter.deletePleaseCautious')).then(() => {
        this.$modal.loading()
        return del(id)
      }).then(() => {
        this.getList()
        this.$modal.msgSuccess(this.$t('common.deleted'))
      }).finally(() => this.$modal.closeLoading())
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
      getList(this.queryParams).then(res => {
        this.list = res.rows
        this.total = res.total
      }).finally(() => this.loading = false)
    },
    changeShow(type, id) {
      this.toastType = type
      this.show = true
      this.id = id
    }
  }
}
</script>

<style lang="scss">
.pages-data-center {
  p {
    font-weight: 600;
  }
  .el-input-group__prepend {
    background-color: #fff;
  }
  .el-select .el-input {
    width: 100px;
  }
}
</style>

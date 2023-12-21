<script>
import {setRecodeList} from "@/api/device";
import { inverterSetRes } from '@sub/utils/map'
export default {
  name: "site-setRecord",
  props: {
    base: {
      type: Object,
      default: () => {
        return {}
      }
    }
  },
  data() {
    return {
      inverterSetRes,
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        siteCode: '',
        createTime: new Date()
      },
      total: 0,
      loading: false,
      list: [],
    }
  },
  mounted() {
    this.queryParams.siteCode = this.$route.query?.siteCode
    this.getList()
  },
  methods: {
    getList() {
      this.queryParams.createTime = this.DATE_FORMAT('yyyy-MM-dd', this.queryParams.createTime)
      this.loading = true
      let data = {
        pageNum: this.queryParams.pageNum,
        pageSize: this.queryParams.pageSize,
        siteCode: this.queryParams.siteCode,
        startTime: (this.ISD_TIMESTAMP(`${this.queryParams.createTime} 00:00:00`, this.base.timeZone)) / 1000,
        endTime: (this.ISD_TIMESTAMP(`${this.queryParams.createTime} 23:59:59`, this.base.timeZone)) / 1000,
      }
      setRecodeList(data).then(res => {
        this.list = res.rows
        this.total = res.total
      }).finally(() => {
        this.loading = false
      })
    },
  }
}
</script>

<template>
  <div class="site-setRecord">
    <common-flex justify="space-between" align="center" style="margin-bottom: 24px">
      <div style="font-weight: 600">Set Record</div>
      <el-date-picker
        style="margin-right: 40px"
        format="MM-dd-yyyy"
        value-format="yyyy-M-d"
        v-model="queryParams.createTime"
        @change="getList"
      />
    </common-flex>
    <div style="min-height: 300px">
      <el-table :header-cell-style="{'text-align': 'center', 'border-bottom': 'none' }" :cell-style="{'text-align': 'center', 'border-left': 'none', 'border-right': 'none', 'border-top': 'none'}"
                v-loading="loading" :data="list" border
      >
        <el-table-column label="No." type="index" />
        <el-table-column label="Time" prop="">
          <template slot-scope="{ row }">
            <span v-if="row.createTime && row.createTime !== '--'">{{ UTC_DATE_FORMAT(+row.createTime , base.timeZone) }}</span>
            <span v-else>--</span>
          </template>
        </el-table-column>
        <el-table-column label="Parameter Name" prop="desc"></el-table-column>
        <el-table-column label="Parameter Value" prop="param" show-overflow-tooltip></el-table-column>
        <el-table-column label="Set Result" prop="status">
          <template slot-scope="{ row }"><span>{{ inverterSetRes[+row.status] }}</span></template>
        </el-table-column>
        <el-table-column label="Client Type" prop="clientType">
          <template slot-scope="{ row }"><span>{{ ['', 'APP', 'Web'][+row.clientType] }}</span></template>
        </el-table-column>
        <el-table-column label="User Name" prop="createBy"></el-table-column>
      </el-table>
    </div>
    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      @pagination="getList"
    />
  </div>
</template>

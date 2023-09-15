<template>
  <div class="comp-alarm">
    <el-card>
      <el-tabs v-model="queryParams.recoveryStatus" @tab-click="getList">
        <el-tab-pane name="0" label="Open"></el-tab-pane>
        <el-tab-pane name="1" label="Closed"></el-tab-pane>
      </el-tabs>
      <el-form :inline="true" :model="queryParams" ref="queryForm" size="small" style="margin-top: 12px">
        <common-flex>
          <common-flex style="flex-grow: 1">
            <el-form-item label="Alarm：" prop="fault">
              <el-input v-model="queryParams.fault" placeholder="Please enter"></el-input>
            </el-form-item>
            <el-form-item label="Fault Code：" prop="faultCode" label-width="100px">
              <el-input v-model="queryParams.faultCode" placeholder="Please enter"></el-input>
            </el-form-item>
            <el-form-item label="Occurrence Time" label-width="140px">
              <el-date-picker
                size="small"
                ref="dataEnd"
                @change="sureDate"
                v-model="dateVal"
                type="daterange"
                range-separator="->"
                :format="displayFormat"
                :value-format="dateFormat"
                start-placeholder="start time"
                end-placeholder="end time">
              </el-date-picker>
            </el-form-item>
          </common-flex>
          <el-form-item>
            <el-button size="small" type="primary" @click="handleQuery">Query</el-button>
            <el-button size="small" @click="resetQuery">Reset</el-button>
          </el-form-item>
        </common-flex>
      </el-form>
    </el-card>
    <el-card style="margin-top: 24px; padding-bottom: 20px">
      <common-flex justify="space-between" align="center">
        <p>Alarm List</p>
        <common-flex style="margin-right: 6px">
          <el-checkbox-group v-model="queryParams.alarmTypes" class="my-check" @change="getList">
            <el-checkbox label="2">
              <common-flex align="center">
                <img :src="require('@subImg/fault.svg')" alt="">
                <span>Fault</span>
                <span style="margin-left: 4px">{{faultItem}}</span>
              </common-flex>
            </el-checkbox>
            <el-checkbox label="1">
              <common-flex align="center">
                <img :src="require('@subImg/warning.svg')" alt="">
                <span>Warning</span>
                <span style="margin-left: 4px">{{warnItem}}</span>
              </common-flex>
            </el-checkbox>
            <el-checkbox label="3">
              <common-flex align="center">
                <img :src="require('@subImg/notice.svg')" alt="">
                <span>Notice</span>
                <span style="margin-left: 4px">{{noticeItem}}</span>
              </common-flex>
            </el-checkbox>
          </el-checkbox-group>
        </common-flex>
      </common-flex>
      <el-table :header-cell-style="{'text-align': 'center'}" :cell-style="{'text-align': 'center'}"
                v-loading="loading" :data="list"
      >
        <el-table-column label="No" align="center" width="60">
          <template slot-scope="scope">
            {{ (+queryParams.pageNum - 1) * (+queryParams.pageSize) + scope.$index + 1 }}
          </template>
        </el-table-column>
        <el-table-column label="Importance" prop="type" width="120" align="center">
          <template slot-scope="{ row }">
            <common-flex justify="center" align="center" class="level" :style="{backgroundColor: ['', '#FFF4C9', '#FCD5D9', '#C4F8E2'][+row.type], color: ['', '#F99600', '#F0142F', '#06A561'][+row.type]}">
              <img :src="require('@subImg/warning.svg')" alt="" v-if="+row.type === 1">
              <img :src="require('@subImg/fault.svg')" alt="" v-if="+row.type === 2">
              <img :src="require('@subImg/notice.svg')" alt="" v-if="+row.type === 3">
              <span>{{ ['--', 'Warning', 'Fault', 'Notice'][+row.type] }}</span>
            </common-flex>
          </template>
        </el-table-column>
        <el-table-column label="Alarm" prop="fault" min-width="180" show-overflow-tooltip>
          <template slot-scope="{ row }">
            <span v-if="row.deviceErrorInfo">{{ row.deviceErrorInfo }}：</span>
            <span>{{ row.fault || '--' }}</span>
          </template>
        </el-table-column>
        <el-table-column label="Fault code" prop="faultCode"></el-table-column>
        <el-table-column label="SN" prop="sn"></el-table-column>
        <el-table-column label="Importance" prop="type" width="120">
          <template slot-scope="{ row }"><span>{{ ['--', 'Warning', 'Fault', 'Notice'][+row.type] }}</span></template>
        </el-table-column>
        <el-table-column label="Status" prop="recoveryStatus" width="120">
          <template slot-scope="{ row }">
            <common-flex justify="center" align="center">
              <span class="dot" :style="{backgroundColor: ['#06A561', '#92929D'][+row.recoveryStatus]}"></span>
              <span>{{ ['Open', 'Closed'][+row.recoveryStatus] }}</span>
            </common-flex>
          </template>
        </el-table-column>
        <el-table-column label="Alarm Start Time" prop="createTime" min-width="160">
          <template slot-scope="{ row }">
            <span v-if="row.createTime && row.createTime !== '--'">{{ UTC_DATE_FORMAT(+row.createTime , base.timeZone) }}</span>
            <span v-else>--</span>
          </template>
        </el-table-column>
        <el-table-column label="Alarm Recovery Time" prop="" min-width="160">
          <template slot-scope="{ row }">
            <span v-if="row.recoveryTime && row.recoveryTime !== '--'">{{ UTC_DATE_FORMAT(+row.recoveryTime , base.timeZone) }}</span>
            <span v-else>--</span>
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
import { alarmList } from '@/api/site'
import {pileNum} from "@/api/fault";
export default {
  name: "comp-alarm",
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
      dateFormat: 'yyyy-M-d',
      displayFormat: 'MM-dd-yyyy',
      dateVal: '',
      total: 0,
      loading: false,
      list: [],
      noticeItem: 0,
      warnItem: 0,
      faultItem: 0,
      impOptions: [
        {
          label: "Warning",
          value: 1,
        },
        {
          label: "Fault",
          value: 2,
        },
        {
          label: "Notice",
          value: 3,
        },
      ],
      statusOptions: [
        {
          label: 'Open',
          value: 0
        },
        {
          label: 'Closed',
          value: 1
        },
      ],
      queryParams: {
        startTime: '',
        endTime: '',
        siteCode: '',
        pageNum: 1,
        pageSize: 10,
        fault: '',
        faultCode: '',
        recoveryStatus: 0,
        alarmTypes: []
      }
    }
  },
  watch: {
    base: {
      handler(v) {
        this.queryParams.siteCode = this.$route.query?.siteCode
        this.getList()
        this.getPileNum()
      },
      immediate: true
    }
  },
  methods: {
    sureDate(v) {
      this.queryParams.startTime = new Date((`${v[0]} 00:00:00`)).getTime() / 1000
      this.queryParams.endTime = new Date((`${v[1]} 23:59:59`)).getTime() / 1000
      this.getList()
    },
    getPileNum() {
      let data = {
        siteCode: this.$route.query?.siteCode
      }
      pileNum(data).then(res => {
        // 故障类型 1-Warning 2-Fault 3-Notice
        this.noticeItem = res.data.find(i => +i.type === 3)?.num
        this.warnItem = res.data.find(i => +i.type === 1)?.num
        this.faultItem = res.data.find(i => +i.type === 2)?.num
      })
    },
    handleQuery() {
      this.queryParams.pageNum = 1
      this.getList()
    },
    getList() {
      this.loading = true
      alarmList(this.queryParams).then(res => {
        this.list = res.rows;
        this.total = res.total;
        this.loading = false
      })
    },
    resetQuery() {
      this.resetForm("queryForm")
      this.queryParams.startTime = ''
      this.queryParams.endTime = ''
      this.dateVal = ''
      this.handleQuery()
    },
  }
}
</script>

<style lang="scss">
.comp-alarm {
  p {
    font-weight: 600;
  }
  .level {
    @include wh(80 24);
    border-radius: 4px;
  }
  .dot {
    margin-right: 4px;
    @include wh(6);
    border-radius: 50%;
  }
  .my-check {
    img {
      margin: 0 3px 2px 0;
    }
    .el-checkbox__input {
      margin-bottom: 6px;
    }
  }
}
</style>

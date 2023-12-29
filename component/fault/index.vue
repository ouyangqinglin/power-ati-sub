<template>
  <div class="pages-fault app-container">
    <el-card class="pages-fault-card pane">
      <el-tabs v-model="queryParams.recoveryStatus" @tab-click="changePane">
        <template v-for="i of alarmStatus">
          <el-tab-pane :name="i.value+''" :label="i.label"></el-tab-pane>
        </template>
      </el-tabs>
    </el-card>
    <el-card style="margin-top: 24px">
      <el-form :model="queryParams" label-width="100px" ref="queryForm">
        <el-row>
          <el-col :span="6">
            <el-form-item :label="`${$t('site.name')}：`" prop="siteName">
              <el-input @keyup.enter.native="handleQuery" :placeholder="$t('common.pleaseEnter')" v-model="queryParams.siteName"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item :label="`${$t('alarm.alarm')}：`" prop="fault">
              <el-input @keyup.enter.native="handleQuery" :placeholder="$t('common.pleaseEnter')" v-model="queryParams.fault"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item :label="`${$t('alarm.occurrenceTime')}：`" label-width="150px">
              <el-date-picker
                ref="dataEnd"
                @change="sureDate"
                v-model="dateVal"
                type="daterange"
                range-separator="->"
                :format="displayFormat"
                :value-format="dateFormat"
                :start-placeholder="$t('common.startTime')"
                :end-placeholder="$t('common.endTime')">
              </el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row type="flex" justify="space-between">
          <el-col :span="6">
            <el-form-item label-width="100px" :label="`${$t('alarm.faultCode')}：`" prop="faultCode">
              <el-input @keyup.enter.native="handleQuery" :placeholder="$t('common.pleaseEnter')" v-model="queryParams.faultCode"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <common-flex justify="flex-end">
              <el-button type="primary" @click="handleQuery">{{ $t('common.query') }}</el-button>
              <el-button @click="resetQuery">{{ $t('common.reset') }}</el-button>
            </common-flex>
          </el-col>
        </el-row>
      </el-form>
    </el-card>
    <el-card style="margin-top: 24px">
      <common-flex justify="flex-end" align="center" class="mb10">
        <common-flex style="margin-right: 6px">
          <el-checkbox-group v-model="queryParams.alarmTypes" class="my-check" @change="getList">
            <el-checkbox label="2">
              <common-flex align="center">
                <img :src="require('@subImg/fault.svg')" alt="">
                <span>{{ $t('alarm.fault') }}</span>
                <span style="margin-left: 4px">{{faultItem}}</span>
              </common-flex>
            </el-checkbox>
            <el-checkbox label="1">
              <common-flex align="center">
                <img :src="require('@subImg/warning.svg')" alt="">
                <span>{{ $t('alarm.warning') }}</span>
                <span style="margin-left: 4px">{{warnItem}}</span>
              </common-flex>
            </el-checkbox>
            <el-checkbox label="3">
              <common-flex align="center">
                <img :src="require('@subImg/notice.svg')" alt="">
                <span>{{ $t('alarm.notice') }}</span>
                <span style="margin-left: 4px">{{noticeItem}}</span>
              </common-flex>
            </el-checkbox>
          </el-checkbox-group>
        </common-flex>
      </common-flex>
      <!--      <el-table-->
      <!--        class="my-expanded"-->
      <!--        ref="multipleTable"-->
      <!--        @row-click="rowClick"-->
      <!--        :data="list"-->
      <!--        style="width: 100%">-->
      <!--        <el-table-column type="expand">-->
      <!--          <template slot-scope="props">-->
      <!--            <el-form label-position="left" inline class="demo-table-expand">-->
      <!--              <el-form-item label="商品名称">-->
      <!--                <span>{{ props.row.name }}</span>-->
      <!--              </el-form-item>-->
      <!--              <el-form-item label="所属店铺">-->
      <!--                <span>{{ props.row.shop }}</span>-->
      <!--              </el-form-item>-->
      <!--              <el-form-item label="商品 ID">-->
      <!--                <span>{{ props.row.id }}</span>-->
      <!--              </el-form-item>-->
      <!--              <el-form-item label="店铺 ID">-->
      <!--                <span>{{ props.row.shopId }}</span>-->
      <!--              </el-form-item>-->
      <!--              <el-form-item label="商品分类">-->
      <!--                <span>{{ props.row.category }}</span>-->
      <!--              </el-form-item>-->
      <!--              <el-form-item label="店铺地址">-->
      <!--                <span>{{ props.row.address }}</span>-->
      <!--              </el-form-item>-->
      <!--              <el-form-item label="商品描述">-->
      <!--                <span>{{ props.row.desc }}</span>-->
      <!--              </el-form-item>-->
      <!--            </el-form>-->
      <!--          </template>-->
      <!--        </el-table-column>-->
      <!--      </el-table>-->
      <el-table :header-cell-style="{'text-align': 'center', 'border-bottom': 'none' }" :cell-style="{'text-align': 'center', 'border-left': 'none', 'border-right': 'none', 'border-top': 'none'}"
                v-loading="loading" :data="list" border
      >
        <el-table-column :label="$t('common.no')" align="center" width="60">
          <template slot-scope="scope">
            {{ (+queryParams.pageNum - 1) * (+queryParams.pageSize) + scope.$index + 1 }}
          </template>
        </el-table-column>
        <el-table-column :label="$t('alarm.importance')" prop="type" width="120">
          <template slot-scope="{ row }">
            <common-flex justify="center" align="center" class="level" :style="{backgroundColor: ['', '#FFF4C9', '#FCD5D9', '#C4F8E2'][+row.type], color: ['', '#F99600', '#F0142F', '#06A561'][+row.type]}">
              <img :src="require('@subImg/warning.svg')" alt="" v-if="+row.type === 1">
              <img :src="require('@subImg/fault.svg')" alt="" v-if="+row.type === 2">
              <img :src="require('@subImg/notice.svg')" alt="" v-if="+row.type === 3">
              <dict-tag :options="alarmImportance" :value="row.type" />
            </common-flex>
          </template>
        </el-table-column>
        <el-table-column :label="$t('alarm.alarm')" prop="fault" min-width="180" show-overflow-tooltip>
          <template slot-scope="{row}">
            <span>{{ row.deviceErrorInfo }}：{{row.fault}}</span>
          </template>
        </el-table-column>
        <el-table-column :label="$t('site.name')" prop="siteName" min-width="160" show-overflow-tooltip>
          <template slot-scope="{ row }">
            <router-link v-hasPermi="['ati:site:view']" :to="`/site/details/${row.siteId}?tab=${1}&siteCode=${row.siteCode}`"><span class="themeColor">{{ row.siteName }}</span></router-link>
          </template>
        </el-table-column>
        <el-table-column :label="$t('alarm.faultCode')" prop="faultCode" min-width="120" />
        <el-table-column :label="$t('alarm.collectionSource')" prop="collectionSource" min-width="140" />
        <el-table-column :label="$t('alarm.collectionSourceSn')" prop="sn" show-overflow-tooltip min-width="160" />
        <el-table-column :label="$t('common.status')" prop="recoveryStatus" width="120">
          <template slot-scope="{ row }">
            <common-flex justify="center" align="center">
              <span class="dot" :style="{backgroundColor: ['#06A561', '#92929D'][+row.recoveryStatus]}"></span>
              <dict-tag :options="alarmStatus" :value="row.recoveryStatus" />
            </common-flex>
          </template>
        </el-table-column>
        <el-table-column v-if="+queryParams.recoveryStatus === 1" :label="$t('alarm.alarmClearingType')" prop="cleanType" width="160">
          <template slot-scope="{ row }">
            <dict-tag :options="alarmClearType" :value="row.cleanType" />
          </template>
        </el-table-column>
        <el-table-column :label="$t('alarm.occurrenceTime')" prop="createTime" min-width="160">
          <template slot-scope="{ row }">
            <span v-if="row.createTime && row.createTime !== '--'">{{ UTC_DATE_FORMAT(row.createTime, timeZone) }}</span>
            <span v-else>--</span>
          </template>
        </el-table-column>
        <el-table-column v-if="+queryParams.recoveryStatus === 1" :label="$t('alarm.recoveryTime')" prop="recoveryTime" min-width="160">
          <template slot-scope="{ row }">
            <span v-if="row.recoveryTime && row.recoveryTime !== '--'">{{ UTC_DATE_FORMAT(row.recoveryTime, timeZone) }}</span>
            <span v-else>--</span>
          </template>
        </el-table-column>
        <el-table-column v-if="+queryParams.recoveryStatus === 0" :label="$t('alarm.operation')" prop="" fixed="right" min-width="90px">
          <template slot-scope="{ row }">
            <img :src="require('@subImg/clear.svg')" @click="cleanFault(row.id)" style="cursor: pointer" alt="">
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
import {alarmList, editAlarm} from "@/api/site"
import {pileNum} from "@/api/fault"
import {mapState} from "vuex"
import { alarmImportance, alarmClearType, alarmStatus } from '@sub/utils/dict'

let storage_id = ''
export default {
  name: "Fault-index",
  data() {
    return {
      alarmImportance,
      alarmStatus,
      alarmClearType,
      total: 0,
      loading: false,
      list: [],
      dateFormat: 'yyyy-M-d',
      displayFormat: 'MM-dd-yyyy',
      dateVal: '',
      queryParams: {
        startTime: '',
        endTime: '',
        siteName: '',
        fault: '',
        faultCode: '',
        recoveryStatus: 0,
        pageNum: 1,
        pageSize: 10,
        type: '',
        status: '',
        alarmTypes: ['1', '2', '3']
      },
      noticeItem: 0,
      warnItem: 0,
      faultItem: 0,
    }
  },
  computed: {
    ...mapState({
      'timeZone': state => state.user.timeZone,
    })
  },
  mounted() {
    this.getList()
    this.getPileNum()
  },
  methods: {
    changePane() {
      this.getList()
      this.getPileNum()
    },
    sureDate(v) {
      this.queryParams.startTime = new Date((`${v[0]} 00:00:00`)).getTime() / 1000
      this.queryParams.endTime = new Date((`${v[1]} 23:59:59`)).getTime() / 1000
      this.getList()
    },
    getPileNum() {
      let data = {
        recoveryStatus: this.queryParams.recoveryStatus
      }
      pileNum(data).then(res => {
        // 故障类型 1-Warning 2-Fault 3-Notice
        this.noticeItem = res.data.find(i => +i.type === 3)?.num
        this.warnItem = res.data.find(i => +i.type === 1)?.num
        this.faultItem = res.data.find(i => +i.type === 2)?.num
      })
    },
    cleanFault(id) {
      const that = this
      const h = this.$createElement
      this.$msgbox({
        message: h('p', null, [
          h('i', { style: 'color: #fa8c15; fontSize: 18px; marginRight: 4px', class: 'el-icon-warning'}),
          h('span', { style: 'fontWeight: 600'}, this.$t('alarm.clearTipContent')),
          h('br'),
          h('p', {style: 'fontSize: 12px'}, this.$t('alarm.clearTipNote'))
        ]),
        showCancelButton: true,
        confirmButtonText: this.$t('common.confirm'),
        cancelButtonText: this.$t('common.cancel'),
        beforeClose: (action, instance, done) => {
          if (action === 'confirm') {
            instance.confirmButtonLoading = true;
            instance.confirmButtonText = 'Loading...'
            let data = {
              recoveryStatus: 1,
              id
            }
            editAlarm(data).then(res => {
              if (+res.code === 200) {
                done()
                instance.confirmButtonLoading = false
                that.$modal.msgSuccess(this.$t('common.deleted'))
                this.getList()
                this.getPileNum()
              }
            })
          } else {
            done()
          }
        }
      }).then(action => {
        console.log(action)
      })
    },
    handleQuery() {
      this.getList()
    },
    resetQuery() {
      this.resetForm("queryForm")
      this.queryParams.alarmTypes = []
      this.queryParams.pageNum = 1
      this.queryParams.startTime = ''
      this.queryParams.endTime = ''
      this.dateVal = ''
      this.handleQuery()
    },
    getList() {
      this.loading = true
      let timestamp = {
        createTime: new Date(this.queryParams.createTime).getTime() / 1000,
        startTime: new Date((`${this.queryParams.createTime} 00:00:00`)).getTime() / 1000,
        endTime: new Date((`${this.queryParams.createTime} 23:59:59`)).getTime() / 1000
      }
      let data = {
        ...this.queryParams, ...timestamp
      }
      let params
      params = this.queryParams.createTime ? data : this.queryParams
      alarmList(params).then(res => {
        this.list = res.rows
        this.total = res.total
        this.loading = false
      })
    },
    rowClick(row){
      //第二个参数是布尔值
      if (storage_id) {
        if (storage_id !== row.id) {
          let item = this.list.find(i => i.id === storage_id)
          this.$refs.multipleTable.toggleRowExpansion(item, false)
          this.$refs.multipleTable.toggleRowExpansion(row, row.listStatus)
          storage_id = row.id
        } else  {
          this.$refs.multipleTable.toggleRowExpansion(row, !row.listStatus)
          row.listStatus = !row.listStatus
        }
      } else {
        storage_id = row.id
        this.$refs.multipleTable.toggleRowExpansion(row, row.listStatus)
      }
      this.list.forEach( i => {
        if (row.id === i.id) {}
        else i.listStatus = true
      })
    }
  }
}
</script>

<style lang="scss">
.pages-fault {
  &-card {
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
  p {
    font-weight: 600;
  }
  .demo-table-expand {
    font-size: 0;
  }
  .demo-table-expand label {
    width: 90px;
    color: #99a9bf;
  }
  .demo-table-expand .el-form-item {
    margin-right: 0;
    margin-bottom: 0;
    width: 50%;
  }
  .my-expanded {
    .el-table__expand-icon {
      display: none;
    }
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

<template>
  <div class="pages-bms app-container">
    <el-card>
      <el-form :inline="true" :model="queryParams" ref="queryForm">
        <common-flex>
          <common-flex style="flex-grow: 1">
            <el-form-item label="SN：" prop="serialNumber">
              <el-input clearable :placeholder="$t('common.pleaseEnter')" @keyup.enter.native="handleQuery" v-model="queryParams.serialNumber"></el-input>
            </el-form-item>
            <el-form-item :label="`${$t('task.site')}：`" prop="siteName">
              <el-input clearable :placeholder="$t('common.pleaseEnter')" @keyup.enter.native="handleQuery" v-model="queryParams.siteName"></el-input>
            </el-form-item>
            <el-form-item :label="`${$t('bms.follow')}：`" prop="followBms">
              <el-select clearable v-model="queryParams.followBms" :placeholder="$t('common.pleaseSelect')">
                <el-option v-for="i of followOption" :value="i.value" :label="i.label" :key="i.value"></el-option>
              </el-select>
            </el-form-item>
          </common-flex>
          <el-form-item>
            <el-button type="primary" @click="handleQuery">{{ $t('common.query') }}</el-button>
            <el-button @click="resetQuery">{{ $t('common.reset') }}</el-button>
          </el-form-item>
        </common-flex>
      </el-form>
    </el-card>
    <el-card style="margin-top: 24px">
      <el-table :header-cell-style="{'text-align': 'center', 'border-bottom': 'none' }" :cell-style="{'text-align': 'center', 'border-left': 'none', 'border-right': 'none', 'border-top': 'none'}"
                v-loading="loading" :data="list" border
      >
        <el-table-column :label="$t('common.no')" type="index">
          <template slot-scope="scope">
            {{ (+queryParams.pageNum - 1) * (+queryParams.pageSize) + scope.$index + 1 }}
          </template>
        </el-table-column>
        <el-table-column label="SN" prop="serialNumber"></el-table-column>
        <el-table-column :label="`${$t('common.capacity')}(kWh)`" prop="nameplateCapacity"></el-table-column>
        <el-table-column :label="$t('task.site')" prop="siteName" show-tooltip-when-overflow>
          <template slot-scope="{ row }">
            <span>{{ row.siteName }}</span>
          </template>
        </el-table-column>
        <el-table-column fixed="right" align="center" class-name="small-padding fixed-width" min-width="100">
          <common-flex justify="center" align="center" slot="header">
            <span>{{ $t('common.operation') }}</span>
            <el-tooltip effect="dark" placement="top">
              <span slot="content" v-html="$t('bms.operateTips')"></span>
              <img style="width: 18px; margin-left: 14px" :src="require('@img/question.svg')" alt="">
            </el-tooltip>
          </common-flex>
          <template slot-scope="scope">
<!--            // 设备类型 1-1.5 2-mini  3-1.0-->
            <common-flex justify="center" align="center">
              <router-link :to="{name: 'monitoring-view', params: {id: scope.row.id, info: scope.row.extInfo, sn: scope.row.serialNumber, siteCode: scope.row.siteCode}}">
                <el-button type="text" :disabled="+scope.row.type !== 1">{{ $t('bms.monitoring') }}</el-button>
              </router-link>
              <img @click="follow(2, scope.row.id)" v-if="+scope.row.followBms === 1" class="follow" :src="require('@img/followed.svg')" alt="">
              <img :title="$t('bms.follow')" @click="follow(1, scope.row.id)" v-else class="follow" :src="require('@img/follow.svg')" alt="Follow">
            </common-flex>
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
import { listDevice, editDevice } from '@/api/device'

export default {
  name: "Monitor-index",
  data() {
    return {
      total: 0,
      loading: false,
      list: [],
      queryParams: {
        deviceType: '2',
        pageNum: 1,
        pageSize: 10,
        serialNumber: '',
        siteName: '',
        followBms: null
      },
      followOption: [
        {
          label: this.$t('bms.allBattery'),
          value: '',
        },
        {
          label: this.$t('bms.followedBattery'),
          value: 1,
        },
      ]
    }
  },
  mounted() {
    this.getList()
  },
  methods: {
    follow(type, id) {
      let data = {
        followBms: type,
        id
      }
      if (type === 2) {
        this.$modal.confirm(this.$t('bms.followedConfirm')).then(() => {
          this.changeFollow(data)
        })
      } else this.changeFollow(data)
    },
    changeFollow(data) {
      this.$modal.loading()
      editDevice(data).then(res => {
        this.$modal.msgSuccess(this.$t('common.success'))
      }).finally(() => {
        this.$modal.closeLoading()
        this.getList()
      })
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
      listDevice(this.queryParams).then(res => {
        this.list = res.rows
        this.total = res.total
      }).finally(() => this.loading = false)
    },
  }
}
</script>

<style lang="scss">
.pages-bms {
  p {
    font-weight: 600;
  }
  .follow {
    margin-left: 20px;
    width: 16px;
    cursor: pointer;
  }
}
</style>

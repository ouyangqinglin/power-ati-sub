<template>
  <div class="app-container pages-site-details">
    <el-card style="margin-bottom: 24px">
      <el-row>
        <el-col :span="12">
          <el-tabs v-model="activeName">
            <el-tab-pane :label="$t('site.overview')" name="overview"></el-tab-pane>
            <el-tab-pane :label="$t('site.siteInfo')" name="siteInfo"></el-tab-pane>
            <el-tab-pane :label="$t('common.device')" name="Device"></el-tab-pane>
            <el-tab-pane :label="$t('common.alarm')" name="Alarm"></el-tab-pane>
            <el-tab-pane :label="$t('site.set')" name="OtherSettings"></el-tab-pane>
            <el-tab-pane :label="$t('site.firmwareUpdate')" name="Firmware"></el-tab-pane>
          </el-tabs>
        </el-col>
        <el-col :span="12">
          <common-flex style="width: 100%" justify="flex-end" align="center">
            <div>
              <div class="pages-site-details-time">{{ $t('site.refreshTime') }} :</div><span>{{ refreshDate }}</span><br>
              <div class="pages-site-details-site">{{ $t('site.name') }}  :</div><span>{{ details.siteName }}({{ details.siteCode }})</span>
            </div>
            <div class="pages-site-details-refresh">
              <img @click="refresh" :class="{rotateAni: active}" class="pages-site-details-refresh-img" :src="require('@img/site/refresh.svg')" alt="">
            </div>
          </common-flex>
        </el-col>
      </el-row>
    </el-card>
    <keep-alive exclude="Firmware">
      <component :is="dynamicComp" :base="details" @refresh="refresh" />
    </keep-alive>
    <el-backtop />
  </div>
</template>

<script>
import { getSite } from "@/api/site"

export default {
  name: "Site-view",
  components: {
    Overview: () => import('@subComp/site/overview'),
    SiteInfo: () => import('@subComp/site/siteInfo'),
    Device: () => import('@subComp/site/device'),
    OtherSettings: () => import('@subComp/site/siteSetting'),
    Alarm: () => import('@subComp/site/alarm'),
    Firmware: () => import('@subComp/site/firmware'),
  },
  data() {
    return {
      refreshDate: '',
      active: false,
      params: {
        id: ''
      },
      details: {},
      activeName: 'overview'
    }
  },
  computed: {
    dynamicComp() {
      const arr = {
        'overview': 'overview',
        'siteInfo': 'SiteInfo',
        'Device': 'Device',
        'OtherSettings': 'OtherSettings',
        'Alarm': 'Alarm',
        'Firmware': 'Firmware'
      }
      return arr[this.activeName] || 'overview'
    }
  },
  mounted() {
    this.params.id = this.$route.params?.id
    this.getDetails()
  },
  methods: {
    getDetails() {
      getSite(this.params).then(res => {
        res.data.installTime = this.UTC_DATE_FORMAT(res.data.installTime, res.data.timeZone)
        let regionStr = ''
        if (res.data.city) regionStr += res.data.city + ','
        if (res.data.province) regionStr += res.data.province + ','
        if (res.data.country) regionStr += res.data.country
        res.data.region = regionStr
        this.details = res.data
        if (this.$route.query?.tab) this.activeName = 'Alarm'
        this.refreshDate = this.UTC_DATE_FORMAT((new Date()).getTime() / 1000, res.data.timeZone)
      })
    },
    refresh() {
      this.getDetails()
      this.active = true
      this.$modal.loading()
      setTimeout(() => {
        this.active = false
        this.$modal.closeLoading()
      }, 500)
    }
  }
}
</script>

<style lang="scss">
.pages-site-details {
  .el-tabs__nav-wrap {
    &:after {
      background-color: #fff;
    }
  }
  .el-card__body {
    padding-bottom: 0;
  }
  &-time, &-site {
    margin-right: 13px;
    display: inline-block;
    width: 120px;
    font-size: 14px;
    text-align: right;
  }
  &-time + span, &-site + span {
    @include nFont(14 #909399 26)
  }
  &-refresh {
    margin-left: 40px;
    cursor: pointer;
    img {
      @include wh(18);
    }
    .rotateAni {
      animation: autoRotate infinite linear .5s;
    }
    @keyframes  autoRotate{
      from { transform: rotate(0) }
      to { transform: rotate(-360deg) }
    }
  }
}
</style>

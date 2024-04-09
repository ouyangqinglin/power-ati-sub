<template>
  <div class="comp-site-set">
    <el-card>
      <common-flex class="comp-site-set-content">
        <div class="comp-site-set-content-nav">
          <div class="comp-site-set-content-nav-item" @click="changeNav(v)" :class="{ opacityTrans: active === v, themeBackColor: active === v }" v-for="(v, k) in navBar">{{ k }}</div>
        </div>
        <div style="flex-grow: 1; min-height: 650px">
          <template v-if="+active === 1">
            <template v-if="!atiShow">
              <template v-if="base.inverterMf">
                <component :is="dynamicComp" :base="base"></component>
              </template>
              <NoData v-else />
            </template>
            <MagraySet v-else :base="base" />
          </template>
          <template v-else-if="+active === 2">
            <SetRecord :base="base" />
          </template>
        </div>
      </common-flex>
    </el-card>
  </div>
</template>

<script>
import SetRecord from "@subComp/site/setRecord.vue";

export default {
  name: "siteSetting",
  components: { SetRecord,
    MagraySet: () => import('@subComp/site/magraySet.vue'),
    YuanSet: () => import('@subComp/site/yuanSet.vue'),
    luxPower: () => import('@subComp/site/luxPower.vue')
  },
  props: {
    base: {
      type: Object,
      default: () => {
        return {}
      }
    }
  },
  computed: {
    dynamicComp() {
      // return 'luxPower'
      return this.base.inverterMf === 'MEGAREVO' ? 'MagraySet' : 'YuanSet'
    }
  },
  data() {
    return {
      atiShow: process.env.VUE_APP_TITLE === 'ASPIRE TECH',
      navBar: {
        [this.$t('site.remoteSet')]: '1',
        [this.$t('site.setRecord')]: '2',
      },
      active: '1',
    }
  },
  methods: {
    changeNav(v) {
      this.active = v
    },
  }
}
</script>

<style lang="scss">
.comp-site-set {
  .card-title {
    margin-bottom: 24px;
    font-weight: 700;
  }

  &-content {
    margin-top: 24px;
    &-nav {
      flex-shrink: 0;
      margin-right: 48px;
      width: 160px;
      border-right: 1px solid #D8DCE6;
      @media screen and (max-width: 1334px) {
        width: 100px;
        font-size: 12px;
      }
      &-item {
        height: 40px;
        text-indent: 16px;
        cursor: pointer;
        line-height: 40px;
      }
      .opacityTrans {
        color: #fff;
        opacity: 1;
        transition: all .2s;
      }
    }
  }
  .remote {
    padding: 24px;
    border: 1px solid #D8DCE6;
    border-radius: 2px;
    .set-part {
      margin-bottom: 40px;
    }
    .set-type {
      margin-bottom: 10px;
      width: 100%;
      border-bottom: 1px solid #D8DCE6;
      font-weight: 600;
    }
    .el-input__inner {
      @media screen and (max-width: 1334px) {
        width: 130px;
      }
    }

  }
  .question {
    margin-left: 3px;
    width: 18px;
    cursor: pointer;
  }
}
</style>

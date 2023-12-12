<template>
  <div class="comp-site-set">
    <el-card>
      <common-flex class="comp-site-set-content">
        <div class="comp-site-set-content-nav">
          <div class="comp-site-set-content-nav-item" @click="changeNav(v)" :class="{ opacityTrans: active === v, themeBackColor: active === v }" v-for="(v, k) in navBar">{{ k }}</div>
        </div>
        <div style="flex-grow: 1; min-height: 650px">
          <template v-if="+active === 1">
            <MagraySet v-if="base.inverterMf === 'MEGAREVO'" />
            <YuanSet v-else-if="base.inverterMf === 'SOLINTEG'" />
            <NoData v-else />
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
import MagraySet from "@subComp/site/magraySet.vue";
import YuanSet from "@subComp/site/yuanSet.vue";

export default {
  name: "siteSetting",
  components: { SetRecord, MagraySet, YuanSet },
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
      navBar: {
        'Remote Set': '1',
        'Set Record': '2',
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

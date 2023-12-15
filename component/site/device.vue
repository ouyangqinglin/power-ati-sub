<template>
  <div class="comp-device">
    <el-card class="comp-device-card">
      <common-flex align="center" class="comp-device-card-header">
        <div class="title-text">Device Info</div>
        <common-flex auto justify="flex-end">
          <el-button type="primary" @click="addDevice">Add</el-button>
          <el-button @click="delShow = true">Delete</el-button>
        </common-flex>
      </common-flex>
      <common-flex class="comp-device-card-content" v-if="currentItem">
        <div class="comp-device-card-content-nav">
          <div class="comp-device-card-content-nav-item" @click="changeNav(v)" :class="{ opacityTrans: active === v,  themeBackColor: active === v}" v-for="(v, k) in navBar">{{ k }}</div>
        </div>
        <StickLogger :curDevInfo="curDevInfo" :base="base" v-if="+active === 4" :sn="sn" />
        <Battery :base="base" :batList="batList" :curDevInfo="curDevInfo" v-else-if="+active === 2"  />
        <ChargerPile :curDevInfo="curDevInfo" :pileList="pileList" v-else-if="+active === 3" @common="emitCommon" />
        <Pv v-else-if="+active === 6" :base="base" :curDevInfo="curDevInfo" :navBar="navBar" :sn="sn"></Pv>
        <Inverter :curDevInfo="curDevInfo" v-else />
      </common-flex>
    </el-card>
    <el-dialog v-if="addShow" :visible.sync="addShow" title="Add Device"
               :before-close="beforeClose"
               :close-on-click-modal ="false"
               width="66%">
      <common-flex align="center">
        <strong>Stick Logger</strong>
        <common-flex v-if="!addDialogInfo[4]">
          <el-tooltip class="item" effect="dark" content="Add Manually" placement="top">
            <img class="device-plus" :src="require('@img/site/device-plus.svg')" alt="" @click="addSn(4)">
          </el-tooltip>
          <img v-if="easyShow" class="device-refresh" :class="{rotateAni: activeStick}" :src="require('@img/site/refresh.svg')" alt="" @click="findDevice('Stick')">
        </common-flex>
      </common-flex>
      <el-form @submit.native.prevent v-if="addDialogInfo[4]">
        <div class="dialog-form">
          <el-form-item label="SN">
            <el-input maxlength="20" @input="verifySn($event, 4)" @change="change(4)" :disabled="addDialogInfo[4].disabled" v-model.trim="addDialogInfo[4].serialNumber" placeholder="Please enter the serial number"></el-input>
          </el-form-item>
          <div style="margin-top: 15px; cursor: pointer" v-if="!addDialogInfo[4].disabled" @click="deleteSn(4)"><img style="width: 20px" :src="require('@img/site/delete.svg')" alt=""></div>
        </div>
      </el-form>
      <div class="empty" v-else>No data</div>
      <common-flex align="center">
        <strong>Inverter</strong>
        <common-flex v-if="!addDialogInfo[1]">
          <el-tooltip class="item" effect="dark" content="Add Manually" placement="top">
            <img class="device-plus" :src="require('@img/site/device-plus.svg')" alt="" @click="addSn(1)">
          </el-tooltip>
          <img v-if="easyShow" class="device-refresh" :class="{rotateAni: activeInverter}" :src="require('@img/site/refresh.svg')" alt="" @click="findDevice('Inverter')">
        </common-flex>
      </common-flex>
      <el-form @submit.native.prevent v-if="addDialogInfo[1]" style="margin-top: 16px">
        <div class="dialog-form">
          <el-form-item label="SN">
            <el-input maxlength="20" @input="verifySn($event, 1)" @change="change(1)" :disabled="addDialogInfo[1].disabled" v-model.trim="addDialogInfo[1].serialNumber" placeholder="Please enter the serial number"></el-input>
          </el-form-item>
          <el-form-item label="Rated Power (kW)">
            <el-input maxlength="20" @input="checkCapacity(1)" :disabled="addDialogInfo[1].disabled" v-model.trim="addDialogInfo[1].nameplateCapacity" placeholder="Please enter"></el-input>
            <div class="err-msg posa">{{ inverterCapacityMsg['msg'] }}</div>
          </el-form-item>
          <el-form-item label="New installation or not">
            <el-select style="width: 100%" :disabled="addDialogInfo[1].disabled" @change="checkInstall(1)" v-model="addDialogInfo[1].installation" placeholder="Please select">
              <el-option v-for="(i, k) of installOption" :value="i.value" :label="i.label" :key="k"></el-option>
            </el-select>
            <div class="err-msg posa">{{ inverterInstallMsg['msg'] }}</div>
          </el-form-item>
          <div style="margin-top: 15px; cursor: pointer" v-if="!addDialogInfo[1].disabled" @click="deleteSn(1)"><img style="width: 20px" :src="require('@img/site/delete.svg')" alt=""></div>
        </div>
      </el-form>
      <div class="empty" v-else>No data</div>
      <template v-if="addDialogInfo[2]">
        <common-flex align="center">
          <strong>Battery</strong>
          <common-flex v-if="easyShow|| addDialogInfo[2].length < 1">
            <el-tooltip class="item" effect="dark" content="Add Manually" placement="top">
              <img class="device-plus" :src="require('@img/site/device-plus.svg')" alt="" @click="addSn(2)">
            </el-tooltip>
            <img v-if="easyShow" class="device-refresh" :class="{rotateAni: activeBat}" :src="require('@img/site/refresh.svg')" alt="" @click="findDevice('Bat')">
          </common-flex>
        </common-flex>
        <template v-for="(i, k) of addDialogInfo[2]">
          <el-form @submit.native.prevent :model="i">
            <div class="dialog-form">
<!--              11111-->
              <el-form-item label="SN">
                <el-input maxlength="20" @input="verifySn($event, 2, k)" @change="change(2, k)" :disabled="i.disabled" v-model.trim="i.serialNumber" placeholder="Please enter the serial number"></el-input>
              </el-form-item>
              <el-form-item label="Capacity (kWh)">
                <el-input @input="checkCapacity(2, k)" type="text" :disabled="i.disabled" v-model.trim="i.nameplateCapacity" placeholder="Please enter the capacity"></el-input>
                <div class="err-msg posa">{{ batCapacityMsg[k] }}</div>
              </el-form-item>
              <el-form-item label="New installation or not">
                <el-select style="width: 100%" :disabled="i.disabled" @change="checkInstall(2, k)" v-model="i.installation" placeholder="Please select">
                  <el-option v-for="(i, k) of installOption" :value="i.value" :label="i.label" :key="k"></el-option>
                </el-select>
                <div class="err-msg posa">{{ batInstallMsg[k] }}</div>
              </el-form-item>
              <div style="margin-top: 15px; cursor: pointer" v-if="!i.disabled" @click="deleteSn(2, k)"><img style="width: 20px" :src="require('@img/site/delete.svg')" alt=""></div>
            </div>
          </el-form>
        </template>
        <div class="empty" v-if="!addDialogInfo[2].length">No data</div>
      </template>
      <el-form @submit.native.prevent v-if="addDialogInfo[3]" style="margin-top: 16px">
        <common-flex align="center">
          <strong>EV Charger</strong>
          <common-flex v-if="easyShow || addDialogInfo[3].length < 1">
            <el-tooltip class="item" effect="dark" content="Add Manually" placement="top">
              <img class="device-plus" :src="require('@img/site/device-plus.svg')" alt="" @click="addSn(3)">
            </el-tooltip>
            <img v-if="easyShow" class="device-refresh" :class="{rotateAni: activeCharger}" :src="require('@img/site/refresh.svg')" alt="" @click="findDevice('Charger')">
          </common-flex>
        </common-flex>
        <div class="dialog-form" v-for="(i, k) of addDialogInfo[3]">
          <el-form-item label="SN">
            <el-input maxlength="20" @input="verifySn($event, 3, k)" @change="change(3, k)" :disabled="i.disabled" v-model.trim="i.serialNumber" placeholder="Please enter the serial number"></el-input>
          </el-form-item>
          <el-form-item label="New installation or not">
            <el-select style="width: 100%" :disabled="i.disabled" @change="checkInstall(3, k)" v-model="i.installation" placeholder="Please select">
              <el-option v-for="(i, k) of installOption" :value="i.value" :label="i.label" :key="k"></el-option>
            </el-select>
            <div class="err-msg posa">{{ chargeInstallMsg[k] }}</div>
          </el-form-item>
          <div style="margin-top: 15px; cursor: pointer" v-if="!i.disabled" @click="deleteSn(3, k)"><img style="width: 20px" :src="require('@img/site/delete.svg')" alt=""></div>
        </div>
        <div class="empty" v-if="!addDialogInfo[3].length">No data</div>
      </el-form>
      <template v-if="addDialogInfo[6]">
        <common-flex align="center" style="margin-top: 16px">
          <strong>Photovoltaic</strong>
          <template v-if="addDialogInfo[6].length < 1">
            <el-tooltip class="item" effect="dark" content="Add Manually" placement="top">
              <img class="device-plus" :src="require('@img/site/device-plus.svg')" alt="" @click="addSn(6)">
            </el-tooltip>
            <img v-if="easyShow" class="device-refresh" :class="{rotateAni: activePhotovoltaic}" :src="require('@img/site/refresh.svg')" alt="" @click="findDevice('Photovoltaic')">
          </template>
        </common-flex>
        <template v-for="(i, k) of addDialogInfo[6]">
          <el-form @submit.native.prevent :model="i" style="margin-top: 16px">
            <div class="dialog-form" >
              <el-form-item label="SN">
                <!--            1111111-->
                <el-input maxlength="20" @input="verifySn($event, 6, k)" @change="change(6, k)" :disabled="i.disabled" v-model.trim="i.serialNumber" placeholder="Please enter the serial number"></el-input>
              </el-form-item>
              <el-form-item label="Capacity (kW)">
                <el-input @input="checkCapacity(6, k)" type="text" :disabled="i.disabled" v-model.trim="i.nameplateCapacity" placeholder="Please enter the capacity"></el-input>
                <div class="err-msg posa">{{ pvCapacityMsg[k] }}</div>
              </el-form-item>
              <el-form-item label="New installation or not">
                <el-select style="width: 100%" :disabled="i.disabled" @change="checkInstall(6, k)" v-model="i.installation" placeholder="Please select">
                  <el-option v-for="(i, k) of installOption" :value="i.value" :label="i.label" :key="k"></el-option>
                </el-select>
                <div class="err-msg posa">{{ pvInstallMsg[k] }}</div>
              </el-form-item>
              <div style="margin-top: 15px; cursor: pointer" v-if="!i.disabled" @click="deleteSn(6, k)"><img style="width: 20px" :src="require('@img/site/delete.svg')" alt=""></div>
            </div>
          </el-form>
        </template>
        <div class="empty" v-if="!addDialogInfo[6].length">No data</div>
      </template>

      <common-flex style="margin-top: 30px" justify="center">
        <el-button @click="submitAdd" :disabled="addSubType">Submit</el-button>
        <el-button @click="addShow = false; fillAddDialog(); addSubType = true;">Cancel</el-button>
      </common-flex>
    </el-dialog>
    <el-dialog v-if="delShow" :visible.sync="delShow" title="Delete Device"
               :before-close="beforeClose"
               :close-on-click-modal ="false"
               width="50%">
      <el-form @submit.native.prevent class="dialog-form" label-position="top">
        <el-form-item class="select" label=" Product Type">
          <el-select @change="watchSelect" style="width: 100%" v-model="delDialogInfo.deviceType">
            <el-option v-for="i of delDialogInfo.option"
                       :label="i.label"
                       :value="i.value"
                       :key="i.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="SN">
          <el-select style="width: 100%" @change="chooseSn" v-model="delDialogInfo.sn">
            <el-option v-for="(i, k) of delDialogInfo.snOption" :value="i" :label="i" :key="k"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="Capacity(KWh)">
          <el-input disabled v-model="delDialogInfo.nameplateCapacity"></el-input>
        </el-form-item>
      </el-form>
      <common-flex style="margin-top: 30px" justify="center">
        <el-button :type="delSubType" :disabled="!delSubType" @click="delDevice">Delete</el-button>
        <el-button @click="cancelDelete">Cancel</el-button>
      </common-flex>
    </el-dialog>

  </div>
</template>

<script>
import { newInstall, productType } from "@sub/utils/dict"
import StickLogger from './stickLogger.vue'
import Pv from './pv.vue'
import Battery from './battery.vue'
import ChargerPile from './chargerPile.vue'
import Inverter from './inverter.vue'
import { listDevice, infoDevice, addBatchDevice, delDevice, netList } from '@/api/device'
let deviceNavInfo = {}


let arr = []
let arrX1 = [], arrX2 = [], pv1 = [], pv2 = [], pv3 = [], pv4 = []
let pvData = []
for (let i = 0; i < 24; i++) {
  arr.push(i)
  arrX1.push(i)
}

export default {
  name: "comp-device",
  props: {
    base: {
      type: Object,
      default: () => {
        return {}
      }
    }
  },
  components: {
    StickLogger,
    Battery,
    Pv,
    ChargerPile,
    Inverter
  },
  data() {
    const that = this
    return {
      easyShow: process.env.VUE_APP_TITLE === 'EASY POWER',
      inverterCapacityMsg: {},
      batCapacityMsg: {},
      pvCapacityMsg: {},
      inverterInstallMsg: {},
      batInstallMsg: {},
      pvInstallMsg: {},
      chargeInstallMsg: {},
      installOption: newInstall,
      activeStick: false,
      activeInverter: false,
      activeBat: false,
      activeCharger: false,
      activePhotovoltaic: false,
      pvHis: {
        pvType: 'Voltage',
        dateVal: new Date(that.UTC_START_OF(this.base.timeZone))
      },
      batList: [],
      pvList: [],
      pileList: [],
      curPv: '',

      queryParams: {
        pageNum: 1,
        pageSize: 100,
        delFlag: 0,
        siteCode: ''
      },
      listDev: [],
      curDevInfo: {},
      currentItem: null,
      sn: '',
      navBar: {},
      addDialogInfo: {},
      delDialogInfo: {
        id: '',
        deviceType: '',
        nameplateCapacity: '',
        option: productType,
        sn: '',
        snOption: []
      },
      addShow: false,
      delShow: false,
      active: '',
      inverterInfo: {},
      pvInfo: {},
      delSubType: '',
      localChangeList: {},
      loading: true,
      addSubType: true,
      dynamicSoc: 0
    }
  },
  watch: {
    base: {
      handler(v) {
        deviceNavInfo = {}
        this.queryParams.siteCode = this.$route.query?.siteCode
        this.getList()
      },
      immediate: true
    }
  },

  methods: {
    addSn(deviceType) {
      let item = {
        deviceType,
        nameplateCapacity: '',
        installation: '',
        serialNumber: '',
        disabled: false
      }
      if ([1, 4].includes(deviceType)) this.addDialogInfo[deviceType] = item
      else this.addDialogInfo[deviceType].push(item)
    },
    deleteSn(deviceType, index) {
      if ([1, 4].includes(deviceType)) {
        this.addDialogInfo[deviceType] = null
        this.inverterCapacityMsg = {}
        this.inverterInstallMsg = {}
        return
      }
      this.addDialogInfo[deviceType].splice(index, 1)
      let mapCapacity = {
        1: 'inverterCapacityMsg',
        2: 'batCapacityMsg',
        6: 'pvCapacityMsg'
      }
      let mapInstall = {
        2: 'batInstallMsg',
        6: 'pvInstallMsg',
        3: 'chargeInstallMsg'
      }
      if (deviceType !== 3) this.$delete(this[mapCapacity[deviceType]], index)
      this.$delete(this[mapInstall[deviceType]], index)
    },
    findDevice(str) {
      let item = this.listDev.find(i => +i.deviceType === 4)
      this.$modal.loading()
      this[`active${str}`] = true
      if (item && item.serialNumber) {
        let params = {
          sn: item.serialNumber
        }
        netList(params).then(res => {
          let findBatList = res.data.batteryList || []
          let inverList = res.data.inverterSnList || []
          if (!findBatList.length && !inverList.length) return this.$modal.alert('Device not found')
          if (findBatList.length) {
            let arr = [...findBatList, ...this.addDialogInfo[2]]
            this.addDialogInfo[2] = Array.from(arr.reduce((acc, cur) => {
              acc.has(cur.serialNumber) || acc.set(cur.serialNumber, cur)
              return acc;
            }, new Map()).values())
          }
          if (inverList.length) {
            this.addDialogInfo[1] = {
              deviceType: 1,
              disabled: true,
              serialNumber: inverList[0].serialNumber,
            }
          }
        }).catch(err => {
          this.$modal.alert('Device not found')
        }).finally(() => {
          this[`active${str}`] = false
          this.$modal.closeLoading()
        })
      } else {
        this.$modal.closeLoading()
        this.$modal.alert('Device not found')
        this[`active${str}`] = false
      }
    },
    emitCommon(sn) {
      this.sn = sn
      this.commonStore(sn)
    },
    commonStore(sn) {
      this.currentItem = this.listDev.find(i => i.serialNumber === sn)
      if (deviceNavInfo[sn]) {
        this.curDevInfo = deviceNavInfo[sn]
      } else this.getDeviceInfo()
    },
    cancelDelete() {
      this.delShow = false
      this.delDialogInfo.id = ''
      this.delDialogInfo.deviceType = ''
      this.delDialogInfo.nameplateCapacity = ''
      this.delDialogInfo.sn = ''
    },
    delDevice() {
      this.$modal.loading()
      delDevice(this.delDialogInfo.id).then(res => {
        if (+res.code === 200) {
          this.$message({
            type: 'success',
            message: 'Succeeded!'
          })
          this.cancelDelete()
          this.getList()
        }
      }).finally(() => this.$modal.closeLoading());
    },
    chooseSn() {
      this.delSubType = 'primary'
      let deviceType = +this.delDialogInfo.deviceType
      let mapDeviceList = {
        2: 'batList',
        3: 'pileList',
        6: 'pvList'
      }
      if ([2, 3, 6].includes(deviceType)) {
        this[mapDeviceList[deviceType]].forEach(i => {
          if (i.serialNumber === this.delDialogInfo.sn) {
            this.delDialogInfo.id = i.id
            this.delDialogInfo.nameplateCapacity = i.nameplateCapacity
          }
        })
      } else {
        let item = this.listDev.find(i => +i.deviceType === deviceType)
        if (item) this.delDialogInfo.nameplateCapacity = item.nameplateCapacity
      }
    },
    watchSelect() {
      this.delDialogInfo.sn = this.delDialogInfo.nameplateCapacity = this.delDialogInfo.id = ''
      let deviceType = +this.delDialogInfo.deviceType
      let item = this.listDev.find(i => +i.deviceType === deviceType)
      let snList = []
      if (deviceType === 2) {
        this.batList.forEach(i => {
          snList.push(i.serialNumber)
        })
      }
      if (deviceType === 3) {
        this.pileList.forEach(i => {
          snList.push(i.serialNumber)
        })
      }
      if (deviceType === 6) {
        this.pvList.forEach(i => {
          snList.push(i.serialNumber)
        })
      }
      if ([1, 4].includes(deviceType)) {
        if (item) {
          snList.push(item.serialNumber)
          this.delDialogInfo.id = item.id
        } else {
          this.delDialogInfo.sn = ''
          this.delDialogInfo.id = ''
        }
      }
      this.delDialogInfo.snOption = snList
      this.delSubType = this.delDialogInfo.sn ? 'primary' : ''
    },
    submitAdd () {
      let item = {}
      let data = {
        deviceList: [],
        siteCode: this.queryParams.siteCode
      }
      let deviceList = []
      for (let v in this.addDialogInfo) {
        if ([2, 6, 3].includes(+v)) {
          this.addDialogInfo[v].forEach((i, index) => {
            item = {
              siteCode: this.queryParams.siteCode,
              deviceType: +i.deviceType,
              serialNumber: i.serialNumber,
              nameplateCapacity: i.nameplateCapacity,
              installation: i.installation,
              index: index + 1
            }
            if (i.serialNumber) deviceList.push(item)
          })
        } else if (+v === 1) {
          item = {
            siteCode: this.queryParams.siteCode,
            deviceType: +v,
            serialNumber: this.addDialogInfo[v]?.serialNumber,
            nameplateCapacity: this.addDialogInfo[v]?.nameplateCapacity,
            installation: this.addDialogInfo[v]?.installation
          }
          if (this.addDialogInfo[v]?.serialNumber) deviceList.push(item)
        } else {
          item = {
            siteCode: this.queryParams.siteCode,
            deviceType: +v,
            serialNumber: this.addDialogInfo[v]?.serialNumber,
          }
          if (this.addDialogInfo[v]?.serialNumber) deviceList.push(item)
        }
      }
      let uniqueObj = {}
      for (let i = 0; i < deviceList.length; i++) {
        if (!uniqueObj[deviceList[i].serialNumber]) uniqueObj[deviceList[i].serialNumber] = 1
        else return this.$modal.msgError("sn:Coding repetition")
      }
      if (!deviceList.length) return
      let i = 0
      let mapCapacity = {
        1: 'inverterCapacityMsg',
        2: 'batCapacityMsg',
        6: 'pvCapacityMsg'
      }
      let mapInstall = {
        1: 'inverterInstallMsg',
        2: 'batInstallMsg',
        6: 'pvInstallMsg',
        3: 'chargeInstallMsg'
      }
      for (i; i < deviceList.length; i++) {
        // 先检验容量
        if ([1, 2, 6].includes(+deviceList[i].deviceType)) {
          if (typeof deviceList[i].nameplateCapacity === 'string' && !(deviceList[i].nameplateCapacity.length)) {
            if (deviceList[i].index) this.$set(this[mapCapacity[+deviceList[i].deviceType]], deviceList[i].index - 1, 'please enter capacity')
            else this.$set(this[mapCapacity[+deviceList[i].deviceType]], 'msg', 'please enter rated power')
          }
        }
        // 校验是否选择new installation or not
        if (+deviceList[i].deviceType !== 4) {
          if (!deviceList[i].installation) {
            if (+deviceList[i].deviceType !== 1) this.$set(this[mapInstall[+deviceList[i].deviceType]], deviceList[i].index - 1, 'please select')
            else this.$set(this[mapInstall[+deviceList[i].deviceType]], 'msg', 'please select')
          }
        }
      }
      let arrList = ['inverterCapacityMsg', 'batCapacityMsg', 'pvCapacityMsg', 'inverterInstallMsg', 'batInstallMsg', 'pvInstallMsg', 'chargeInstallMsg']
      for (let p = 0; p < arrList.length; p++) {
        for (let k in this[arrList[p]]) {
          if (this[arrList[p]][k]) return
        }
      }
      data.deviceList = deviceList
      this.$modal.loading()
      addBatchDevice(data).then(res => {
        if (+res.code === 200) {
          this.$message({
            type: 'success',
            message: 'Succeeded!'
          })
          this.beforeClose()
          this.getList()
        }
      }).finally(() => this.$modal.closeLoading())
    },
    checkInstall(deviceType, index) {
      let mapInstall = {
        1: 'inverterInstallMsg',
        2: 'batInstallMsg',
        6: 'pvInstallMsg',
        3: 'chargeInstallMsg'
      }
      if (deviceType !== 1) this.$delete(this[mapInstall[deviceType]], index)
      else this.$delete(this[mapInstall[deviceType]], 'msg')
    },
    checkCapacity(deviceType, index) {
      let msgType = deviceType === 1 ? 'inverterCapacityMsg' : deviceType === 2 ? 'batCapacityMsg' : 'pvCapacityMsg'
      const reg = /^(?!^\.)(\d*(\.\d{0,3})?)?$/
      // At most three significant decimals
      let capacity
      if (deviceType === 1) capacity = this.addDialogInfo[deviceType].nameplateCapacity.replace(/\s*/g,"")
      else capacity = this.addDialogInfo[deviceType][index].nameplateCapacity.replace(/\s*/g,"")
      if (!capacity.length) {
        if (deviceType === 1) this.$set(this[msgType], 'msg', 'please enter rated power')
        else this.$set(this[msgType], index, 'please enter capacity')
      } else {
        if (reg.test(capacity)) {
          if (deviceType === 1) this.$set(this[msgType], 'msg', '')
          else this.$set(this[msgType], index, '')
        } else {
          if (deviceType === 1) this.$set(this[msgType], 'msg', 'At most three significant decimals')
          else this.$set(this[msgType], index, 'At most three significant decimals')
        }
      }
    },
    verifySn(e, deviceType, index) {
      if ([2, 3, 6].includes(deviceType)) this.addDialogInfo[deviceType][index].serialNumber = e.replace(/[^a-zA-Z0-9-]/g, "")
      else this.addDialogInfo[deviceType].serialNumber = e.replace(/[^a-zA-Z0-9-]/g, "")
    },
    change(deviceType, index) {
      let sn = ''
      if ([2, 3, 6].includes(deviceType)) {
        sn = this.addDialogInfo[deviceType][index].serialNumber.replace(/\s*/g,"")
        if (sn) this.$set(this.localChangeList, `${deviceType}${index}`, sn)
        else this.$delete(this.localChangeList, `${deviceType}${index}`)
      } else {
        sn = this.addDialogInfo[deviceType].serialNumber
        if (sn) this.$set(this.localChangeList, deviceType, sn)
        else this.$delete(this.localChangeList, deviceType)
      }
      if (deviceType === 1 && !sn) {
        this.inverterInstallMsg = {}
        this.inverterCapacityMsg = {}
      }
      let arr = Object.keys(this.localChangeList)
      let i = 0;
      for(i; i < arr.length; i++) {
        if (arr[i]) break
      }
      this.addSubType = i >= arr.length
    },
    addDevice() {
      this.fillAddDialog()
      this.addShow = true
    },
    beforeClose() {
      this.addShow = false
      this.delShow = false
      this.delSubType = ''
      this.addSubType = true
    },
    fillAddDialog() {
      let haveTypeList = [4, 1, 2, 6, 3]
      let item = {
        deviceType: 0,
        nameplateCapacity: 0,
        installation: 2,
        serialNumber: '',
        disabled: false
      }
      for(let i = 0; i < haveTypeList.length; i++) {
        if (haveTypeList[i] === 2) {
          this.$set(this.addDialogInfo, 2, [])
          if (this.batList.length) {
            this.batList.forEach(i => {
              item = {
                deviceType: 2,
                nameplateCapacity: i.nameplateCapacity,
                installation: i.installation,
                serialNumber: i.serialNumber,
                disabled: true
              }
              this.addDialogInfo[2].push(item)
            })
          }
        }
        if (haveTypeList[i] === 3) {
          this.$set(this.addDialogInfo, 3, [])
          if (this.pileList.length) {
            this.pileList.forEach(i => {
              item = {
                deviceType: 3,
                nameplateCapacity: i.nameplateCapacity,
                installation: i.installation,
                serialNumber: i.serialNumber,
                disabled: true
              }
              this.addDialogInfo[3].push(item)
            })
          }
        }
        if (haveTypeList[i] === 6) {
          this.$set(this.addDialogInfo, 6, [])
          if (this.pvList.length) {
            this.pvList.forEach(i => {
              item = {
                deviceType: 6,
                nameplateCapacity: i.nameplateCapacity,
                installation: i.installation,
                serialNumber: i.serialNumber,
                disabled: true
              }
              this.addDialogInfo[6].push(item)
            })
          }
        }
        if (haveTypeList[i] === 4) {
          item = this.listDev.find(item => +item.deviceType === 4)
          let info = null
          if (item) {
            info = {
              deviceType: 4,
              disabled: true,
              serialNumber: item.serialNumber,
            }
          }
          this.$set(this.addDialogInfo, 4, info)
        }
        if (haveTypeList[i] === 1) {
          item = this.listDev.find(item => +item.deviceType === 1)
          let info = null
          if (item) {
            info = {
              deviceType: 1,
              disabled: true,
              serialNumber: item.serialNumber,
              nameplateCapacity: item.nameplateCapacity,
              installation: item.installation
            }
          }
          this.$set(this.addDialogInfo, 1, info)
        }
      }
    },
    getList() {
      this.navBar = {}
      this.batList = []
      this.pvList = []
      this.pileList = []
      listDevice(this.queryParams).then(res => {
        this.listDev = res.rows
        let haveBattery = this.listDev.find(i => +i.deviceType === 2)
        let haveCharge = this.listDev.find(i => +i.deviceType === 3)
        let haveInverter = this.listDev.find(i => +i.deviceType === 1)
        let haveStick = this.listDev.find(i => +i.deviceType === 4)
        let havePv = this.listDev.find(i => +i.deviceType === 6)
        if (haveStick) this.$set(this.navBar, 'Stick Logger', '4')
        if (haveInverter) this.$set(this.navBar, 'Inverter', '1')
        if (haveBattery) this.$set(this.navBar, 'Battery', '2')
        if (havePv) this.$set(this.navBar, 'Photovoltaic', '6')
        if (haveCharge) this.$set(this.navBar, 'EV Charger', '3')
        let haveTypeList = [4, 1, 2, 6, 3]
        let i = 0
        for(i; i < haveTypeList.length; i++) {
          if (this.listDev.find(item => +item.deviceType === haveTypeList[i])) break
        }
        this.currentItem = this.listDev.find(item => +item.deviceType === haveTypeList[i])
        if (this.currentItem) {
          this.sn = this.currentItem.serialNumber
          this.active = this.currentItem.deviceType + ''
          this.getDeviceInfo()
        }
        let list = res.rows
        for(let i = 0; i < list.length; i++) {
          if (+list[i]['deviceType'] === 2) this.batList.push(list[i])
          if (+list[i]['deviceType'] === 6) this.pvList.push(list[i])
          if (+list[i]['deviceType'] === 3) this.pileList.push(list[i])
        }
        if (this.pvList.length) this.curPv = this.pvList[0].serialNumber
        if (this.pileList.length) this.curPile = this.pileList[0].serialNumber
        for(let i = 0; i < this.batList.length; i++) {
          if (+this.batList[i].installation === 2) {
            this.batList[i].lifetime = '--'
          } else {
            let resStr = ''
            resStr += `${this.batList[i].periodDay || '0'} Days ${this.batList[i].periodMonth || '0'} Months ${this.batList[i].periodYear || '0'} Year`
            this.batList[i].lifetime = resStr
          }
          if (this.batList[i].upgradeTime) this.batList[i].upgradeTime = this.DATE_FORMAT('M/d/yyyy hh:mm', this.batList[i].upgradeTime * 1000)
          if (!this.batList[i]['curEnergy']) this.batList[i]['soc'] = 0
        }
      })
    },
    changeNav(v) {
      this.active = v
      if ([2, 3, 6].includes(+v)) {
        let list
        if (+v === 2) list = this.batList
        if (+v === 6) list = this.pvList
        if (+v === 3) list = this.pileList
        this.currentItem = this.listDev.find(i => i.serialNumber === list[0].serialNumber)
      } else this.currentItem = this.listDev.find(i => +i.deviceType === +v)
      this.sn = this.currentItem.serialNumber
      if (deviceNavInfo[this.sn]) {
        this.curDevInfo = deviceNavInfo[this.sn]
      } else this.getDeviceInfo()
    },
    getDeviceInfo() {
      let data = {
        sn: this.sn,
        siteCode: this.queryParams.siteCode
      }
      infoDevice(data).then(res => {
        deviceNavInfo[this.sn] = {...this.currentItem, ...res.data }
        this.curDevInfo = deviceNavInfo[this.sn]
        // status 1-充电中 2-已完成
        this.tempInfo()
      })
    },
    tempInfo() {
      if (+this.active === 3) {
        let arrImport = [
          {
            pvNum: 'L1',
            v: '',
            A: ''
          },
          {
            pvNum: 'L2',
            v: '',
            A: ''
          },
          {
            pvNum: 'L3',
            v: '',
            A: ''
          },
        ]
        let arrExport = [
          {
            pvNum: 'L1',
            v: '',
            A: ''
          },
          {
            pvNum: 'L2',
            v: '',
            A: ''
          },
          {
            pvNum: 'L3',
            v: '',
            A: ''
          },
        ]
        let extInfo
        if (this.curDevInfo.extInfo) {
          extInfo = JSON.parse(this.curDevInfo.extInfo)
          this.curDevInfo.extInfo = extInfo
        }
        arrImport.forEach((i, index) => {
          let prefix = i.pvNum.toLowerCase()
          i.v = extInfo[`${prefix}Voltage`]
          i.A = extInfo[`${prefix}CurrentImport`]
        })
        arrExport.forEach((i, index) => {
          let prefix = i.pvNum.toLowerCase()
          i.v = extInfo[`${prefix}Voltage`]
          i.A = extInfo[`${prefix}CurrentExport`]
        })
        if (+this.curDevInfo.status === 1) {
          this.curDevInfo.duration += 'Hours'
          if (this.curDevInfo['startTime']) this.curDevInfo['startTime'] = this.UTC_DATE_FORMAT(this.curDevInfo['startTime'], this.base.timeZone)
          else this.curDevInfo['startTime'] = '--'
        } else {
          this.curDevInfo['startTime'] = '--'
          this.curDevInfo.duration = 0
        }
        this.curDevInfo.importList = arrImport
        this.curDevInfo.exportList = arrExport
      } else if (+this.active === 6) {
        let arr = [
          {
            pvNum: 'pv1',
            v: '',
            c: '',
            p: ''
          },
          {
            pvNum: 'pv2',
            v: '',
            c: '',
            p: ''
          },
          {
            pvNum: 'pv3',
            v: '',
            c: '',
            p: ''
          },
          {
            pvNum: 'pv4',
            v: '',
            c: '',
            p: ''
          },
        ]
        let obj = this.curDevInfo.pvEntity
        arr.forEach((item, index) => {
          let prefix = `pv${index + 1}`
          item.v = obj[`${prefix}Voltage`] ? obj[`${prefix}Voltage`] : +obj[`${prefix}Voltage`] === 0 ? 0 : '--'
          item.c = obj[`${prefix}Current`] ? obj[`${prefix}Current`] : +obj[`${prefix}Current`] === 0 ? 0 : '--'
          item.p = obj[`${prefix}Power`] ? obj[`${prefix}Power`] : +obj[`${prefix}Power`] === 0 ? 0 : '--'
        })
        this.curDevInfo.pvList = arr
      } else if (+this.active === 1) {
        let arrGrid = [
          {
            pvNum: 'A',
            v: '',
            c: '',
            p: ''
          },
          {
            pvNum: 'B',
            v: '',
            c: '',
            p: ''
          },
          {
            pvNum: 'C',
            v: '',
            c: '',
            p: ''
          }
        ]
        let arrLoad = [
          {
            pvNum: 'A',
            v: '',
            c: '',
            p: ''
          },
          {
            pvNum: 'B',
            v: '',
            c: '',
            p: ''
          },
          {
            pvNum: 'C',
            v: '',
            c: '',
            p: ''
          }
        ]
        let objGrid = this.curDevInfo.inverterEntity?.gridEntity, objLoad = this.curDevInfo.inverterEntity?.loadEntity
        arrGrid.forEach((item, index) => {
          let prefix = item.pvNum.toLowerCase()
          item.v = objGrid[`${prefix}voltage`]
          item.c = objGrid[`${prefix}current`]
          item.p = objGrid[`${prefix}power`]
        })
        arrLoad.forEach((item, index) => {
          let prefix = item.pvNum.toLowerCase()
          item.v = objLoad[`${prefix}voltage`]
          item.c = objLoad[`${prefix}current`]
          item.p = objLoad[`${prefix}power`]
        })
        this.curDevInfo.gridList = arrGrid
        this.curDevInfo.loadList = arrLoad
        this.curDevInfo.gridStatus = objGrid.gridStatus
      }
      if (+this.curDevInfo.installation === 2) {
        this.curDevInfo.lifetime = '--'
      } else {
        let resStr = ''
        resStr += `${this.curDevInfo.periodDay} Days ${this.curDevInfo.periodMonth} Months ${this.curDevInfo.periodYear} Year`
        this.curDevInfo.lifetime = resStr
      }
      if (this.curDevInfo.upgradeTime) this.curDevInfo.upgradeTime = this.DATE_FORMAT('M/d/yyyy hh:mm', this.curDevInfo.upgradeTime * 1000)
    }
  }
}
</script>

<style lang="scss">
.comp-device {
  &-card {
    padding-bottom: 20px;
    .title-text {
      font-weight: 700;
    }
    &-content {
      margin-top: 24px;
      &-nav {
        flex-shrink: 0;
        margin-right: 48px;
        width: 160px;
        border-right: 1px solid #D8DCE6;
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
      &-right {
        // 99999
        flex-grow: 1;
        .part {
          border: 1px solid #D8DCE6;
          border-radius: 2px 2px 2px 2px;
          &-title {
            margin-bottom: 12px;
            height: 41px;
            @include nFont(14 #000 54 700);
            text-indent: 16px;
            border-bottom: 1px solid #D8DCE6;
          }
          &-img-box {
            width: 200px;
          }
          .table {
            .el-table__row, .el-table__cell {
              border-bottom: none
            }
          }
          .wifi-img {
            top: 50%;
            left: 80px;
            transform: translateY(-50%);
          }
        }
        .device-img {
          margin-top: 36px;
          @include wh(80);
        }
        .dynamicSoc {
          z-index: 0;
          width: 50px;
          bottom: -34px;
          left: 50%;
          transform: translateX(-50%);
          background-color: #8be186;
          transition: all .3s;
          border-radius: 4px;
        }
        &-container {
          .item {
            margin-top: 24px;
            &-title {
              font-weight: 700;
              line-height: 26px;
              border-bottom: 1px solid #D8DCE6;
            }
            &-body {
              max-width: 1200px;
              &-item {
                margin-top: 12px;
                flex-grow: 1;
                line-height: 26px;
                font-size: 14px;
                &-key {
                  color: #828282;
                }
                &-value {
                  color: #000;
                  font-weight: 500;
                }
              }
              .charge {
                flex-grow: 0;
                width: calc(100% / 4);
              }
            }
          }
        }
      }
    }
  }
  .device-plus, .device-refresh {
    margin-left: 24px;
    @include wh(16);
    cursor: pointer;
  }
  .device-plus {
    @include wh(20);
  }
  .dialog-form {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    opacity: 1;
    transition: all .3s;
    .el-form-item {
      position: relative;
      margin-right: 24px;
      width: calc(100% / 3 - 40px);
      .err-msg {
        left: 0;
        bottom: -30px;
        color: #ff4949;
        font-size: 12px;
      }
    }
    .select {
      .el-form-item__label{
        text-align:left;
        float: none;
        word-break: break-word;
      }
    }
  }
  .status-tips {
    margin-right: 10px;
    @include nFont(14 #828282)
  }
  input[type='number'] {
    -moz-appearance: textfield !important;
  }
  input::-webkit-outer-spin-button, input::-webkit-inner-spin-button {
    -webkit-appearance: none !important;
  }
  .time-range {
    &-label {
      margin-right: 15px;
      width: 125px;
      text-align: right;
    }
    &-picker {
      border: 1px solid #dcdfe6;
      border-radius: 4px;
    }
    .el-input__prefix {
      display: none;
    }
    .el-date-editor.el-input {
      width: 100px;
    }
    .el-input__inner {
      border: none !important;
    }
  }
  .pv-nav {
    right: 0;
    top: 10%;
    z-index: 521;
  }
  .batteryChart {
    height: 45vh;
  }
  .pvChart {
    height: 55vh;
  }
  .total-box {
    margin-bottom: 27px;
    padding: 0 24px 30px;
    border-radius: 2px;
    border: 1px solid #D8DCE6;
    .item {
      width: calc(100% / 2 - 40px);
      margin-top: 24px;
      &-title {
        font-weight: 700;
        line-height: 26px;
        border-bottom: 1px solid #D8DCE6;
      }
      &-body {
        max-width: 1200px;
        >:nth-child(1) {
          flex: 1 0 0;
        }
        >:nth-child(2) {
          flex: 1.5 0 0;
        }
        &-item {
          margin-top: 12px;
          line-height: 26px;
          font-size: 14px;
          &-key {
            color: #828282;
          }
          &-value {
            color: #000;
            font-weight: 500;
          }
        }
        .charge {
          flex-grow: 0;
          width: calc(100% / 4);
        }
      }
    }
    .real {
      flex: 1 !important;
    }
  }
  .bat-item {
    margin-right: 80px;
    cursor: pointer;
    .bat-pile {
      @include wh(120);
    }
    .bat-title {
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      :nth-child(1) {
        @include nFont(12 #828282)
      }
      :nth-child(2) {
        @include nFont(12 #000 600)
      }
    }
    .bat-sn {
      width: 120px;
      text-align: center;
      border-bottom: 3px solid #fff;
    }
    .curClick {
      border-bottom: 3px solid $commonColor;
      color: $commonColor;
      transition: all .3s;
    }
  }
  .rotateAni {
    animation: autoRotate infinite linear .5s;
  }
  @keyframes  autoRotate{
    from { transform: rotate(0) }
    to { transform: rotate(-360deg) }
  }
  .empty {
    color: #909399;
    text-indent: 8px;
    line-height: 40px;
  }
  strong {
    min-width: 120px;
  }
  .network {
    @include cImg();
  }
  .step {
    font-size: 16px;
    font-weight: 700;
  }
}
</style>

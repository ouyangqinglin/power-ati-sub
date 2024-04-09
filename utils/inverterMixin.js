import {deviceSet, orderRes} from "@/api/device";
import {mapState} from "vuex";
let timerInter = null, timeCount = null
let resTime = 0, requestTimes = 0, setDeviceTimes = 1
let statusList = ['NO_RESPONSE', 'SUCCESS', 'ERROR', 'EXECUTING', 'NOT_ONLINE', 'UN_EXIST_FILE', 'SUBMIT_SUCCESS', 'NO_MATCH']
export default {
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
      siteCode: '',
      deviceBase: {},
    }
  },
  watch: {
    base: {
      immediate: true,
      handler(v) {
        this.siteCode = this.$route.query?.siteCode
        this.getDeviceSet()
      }
    }
  },
  computed: {
    ...mapState({
      'userType': (state) => state.user.userType
    })
  },
  beforeDestroy() {
    clearInterval(timerInter)
  },
  methods: {
    // 请求次数大于3次
    timeOut() {
      requestTimes = 0
      setDeviceTimes = 1
      this.getDeviceSet()
      this.$modal.closeLoading()
      return this.$modal.msgError('Timeout')
    },
    // 重读请求 设置间隔时间防止重复提交警告
    getRepeatQuest(type) {
      setTimeout(() => {
        this.getOrderRes(type)
      }, 2000)
    },
    getOrderRes(type) {
      clearInterval(timeCount)
      resTime = 0
      timeCount = setInterval(() => {
        resTime++
      }, 1000)
      let data = {
        siteCode: this.siteCode
      }
      orderRes(data).then(res => {
        clearInterval(timeCount)
        requestTimes++
        if (resTime < 5) { // 响应时间
          if (+res.data === 3) {
            // 判断重复几次 > 3次直接timeout
            if (requestTimes < 3) {
              // 重复
              this.getRepeatQuest(type)
            } else {
              // > 3次重新下发指令
              this.setRepeatQuest(type)
              requestTimes = 0
            }
          } else { // 返回值状态
            requestTimes = 0
            setDeviceTimes = 1
            if (+res.data === 1) {
              this.$modal.msgSuccess('SUCCESS')
            } else this.$modal.msgError(statusList[+res.data])
            this.getDeviceSet()
            this.$modal.closeLoading()
          }
        } else { // 大于3s
          // 判断重复几次 > 3次直接timeout
          // < 3次 重复指令
          if (requestTimes < 3) {
            // 重复
            this.getRepeatQuest(type)
          } else {
            // > 3次重新下发指令
            this.setRepeatQuest(type)
            requestTimes = 0
          }
        }
      })
    },
    setRepeatQuest(type) {
      setDeviceTimes++
      if (setDeviceTimes > 3) return this.timeOut()
      setTimeout(() => {
        this.repeatSetDevice(type)
      }, 1000)
    },
    repeatSetDevice(type) {
      let data = {
        siteCode: this.siteCode,
        type,
        baseParam: this.deviceBase[type]
      }
      deviceSet(data).then(res => {
        if ([1002, 10030, 10031, 10032, 10033].includes(+res.code)) {
          this.$modal.msgError(res.msg)
          this.getDeviceSet()
          this.$modal.closeLoading()
        } else {
          if (+res.data === 3) {
            this.getOrderRes(type)
          } else {
            this.$modal.msgError(statusList[+res.data])
            this.getDeviceSet()
          }
        }
      })
    },
  }
}
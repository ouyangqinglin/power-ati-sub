<template>
  <el-form ref="form" :model="user" :rules="rules">
    <el-form-item :label="$t('login.oldPassword')" prop="oldPassword">
      <el-input
        @paste.native.capture.prevent
        @copy.native.capture.prevent
        v-model.trim="user.oldPassword" :placeholder="$t('common.pleaseEnter')"
        @input="verifyPsw($event,'oldPassword')"
        :type="inputOne">
        <template #suffix>
          <svg-icon v-if="eyes" @click.native="eyes = !eyes" style="cursor: pointer; margin-right: 10px" icon-class="eye" class="el-input__icon input-icon" />
          <svg-icon v-else @click.native="eyes = !eyes" style="cursor: pointer; margin-right: 10px" icon-class="eye-open" class="el-input__icon input-icon" />
        </template>
      </el-input>
    </el-form-item>
    <el-form-item :label="$t('login.newPassword')" prop="newPassword">
      <el-input
        @paste.native.capture.prevent
        @copy.native.capture.prevent
        v-model.trim="user.newPassword" :placeholder="$t('common.pleaseEnter')"
        @input="verifyPsw($event,'newPassword')"
        :type="inputTwo">
        <template #suffix>
          <svg-icon v-if="eyesTwo" @click.native="eyesTwo = !eyesTwo" style="cursor: pointer; margin-right: 10px" icon-class="eye" class="el-input__icon input-icon" />
          <svg-icon v-else @click.native="eyesTwo = !eyesTwo" style="cursor: pointer; margin-right: 10px" icon-class="eye-open" class="el-input__icon input-icon" />
        </template>
      </el-input>
    </el-form-item>
    <el-form-item :label="$t('login.confirmPassword')" prop="confirmPassword">
      <el-input @paste.native.capture.prevent
                @copy.native.capture.prevent
                v-model.trim="user.confirmPassword" :placeholder="$t('common.pleaseEnter')"
                @input="verifyPsw($event,'confirmPassword')"
                :type="inputThr">
        <template #suffix>
          <svg-icon v-if="eyesThree" @click.native="eyesThree = !eyesThree" style="cursor: pointer; margin-right: 10px" icon-class="eye" class="el-input__icon input-icon" />
          <svg-icon v-else @click.native="eyesThree = !eyesThree" style="cursor: pointer; margin-right: 10px" icon-class="eye-open" class="el-input__icon input-icon" />
        </template>
      </el-input>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" size="mini" @click="submit">{{ $t('common.save') }}</el-button>
      <el-button plain type="primary" size="mini" @click="close">{{ $t('common.cancel') }}</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
import { updateUserPwd } from "@/api/system/user";
import Cookies from "js-cookie";

export default {
  computed: {
    inputOne() {
      return this.eyes ? 'password' : 'text'
    },
    inputTwo() {
      return this.eyesTwo ? 'password' : 'text'
    },
    inputThr() {
      return this.eyesThree ? 'password' : 'text'
    },
  },
  data() {
    const validatePass = (rule, value, callback) => {
      if (value === '') {
        callback(new Error(this.$t('common.pleaseEnter')));
      } else {
        const reg = /^(?![0-9]+$)(?![a-zA-Z]+$)(?![^a-zA-Z0-9]+$)[^\u4e00-\u9fa5]{8,16}$/
        if (reg.test(value)) {
          callback()
        } else callback(new Error(this.$t('user.initialPasswordRule')))
      }
    }
    const equalToPassword = (rule, value, callback) => {
      if (this.user.newPassword !== value) {
        callback(new Error(this.$t('login.passwordInconsistent')));
      } else {
        callback();
      }
    }
    return {
      eyes: true,
      eyesTwo: true,
      eyesThree: true,
      user: {
        oldPassword: undefined,
        newPassword: undefined,
        confirmPassword: undefined
      },
      // 表单校验
      rules: {
        oldPassword: [
          { required: true, message: this.$t('common.pleaseEnter'), trigger: "blur" },
          { required: true, validator: validatePass, trigger: "blur" }
        ],
        newPassword: [
          { required: true, message: this.$t('common.pleaseEnter'), trigger: "blur" },
          { required: true, validator: validatePass, trigger: "blur" }
        ],
        confirmPassword: [
          { required: true, message: this.$t('common.pleaseEnter'), trigger: "blur" },
          { required: true, validator: equalToPassword, trigger: "blur" }
        ]
      }
    };
  },
  methods: {
    verifyPsw(v, str) {
      this.user[str] = v.replace(/\s+/g,"")
    },
    submit() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          updateUserPwd(this.user.oldPassword, this.user.newPassword).then(response => {
            this.$modal.msgSuccess(this.$t('common.success'));
            setTimeout(() => {
              this.$store.dispatch('LogOut').then(() => {
                location.href = '/index';
              })
              Cookies.remove("password");
            }, 200)
          });
        }
      });
    },
    close() {
      this.$tab.closePage();
    }
  }
};
</script>

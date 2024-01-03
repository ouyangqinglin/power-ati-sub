<template>
  <el-form ref="form" :model="user" :rules="rules">
    <el-form-item :label="$t('user.nickname')" prop="nickName">
      <el-input :placeholder="$t('common.pleaseEnter')" v-model.trim="user.nickName" maxlength="50" />
    </el-form-item>
    <el-form-item :label="$t('user.phone')" prop="phonenumber">
      <el-input :placeholder="$t('common.pleaseEnter')" v-model.trim="user.phonenumber" @input="checkPhone" maxlength="20" />
    </el-form-item>
<!--    <el-form-item label="邮箱" prop="email">-->
<!--      <el-input v-model="user.email" maxlength="50" />-->
<!--    </el-form-item>-->
    <el-form-item>
      <el-button type="primary" size="mini" @click="submit">{{ $t('common.save') }}</el-button>
      <el-button plain type="primary" size="mini" @click="close">{{ $t('common.cancel') }}</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
import { updateUserProfile } from "@/api/system/user";

export default {
  props: {
    user: {
      type: Object
    }
  },
  // regex = /^[0-9\+\-]{1,20}$/;
  data() {
    return {
      // 表单校验
      rules: {
        nickName: [
          { required: true, message: this.$t('common.pleaseEnter'), trigger: "blur" }
        ]
        // email: [
        //   { required: true, message: "邮箱地址不能为空", trigger: "blur" },
        //   {
        //     type: "email",
        //     message: "请输入正确的邮箱地址",
        //     trigger: ["blur", "change"]
        //   }
        // ],
      }
    };
  },
  methods: {
    checkPhone() {
      this.user.phonenumber = this.PHONE_REG(this.user.phonenumber)
    },
    submit() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          updateUserProfile(this.user).then(response => {
            this.$modal.msgSuccess(this.$t('common.success'));
          });
        }
      });
    },
    close() {
      this.$tab.closePage()
    }
  }
};
</script>

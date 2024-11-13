<template>
  <el-form
    ref="configFormRef"
    :model="form"
    :rules="rules"
    label-width="200px"
    style="max-width: 600px"
    status-icon
    class="config-form"
  >
    <el-form-item prop="desc" label="输入描述">
      <el-input
        maxlength="100"
        type="textarea"
        resize="none"
        :rows="4"
        placeholder="请输入描述"
        v-model="form.desc"
      />
    </el-form-item>
    <el-form-item prop="version" label="输入版本">
      <el-input maxlength="20" placeholder="请输入版本" v-model="form.version" />
    </el-form-item>
    <el-form-item prop="groupNotice" label="是否发送群通知">
      <el-switch v-model="form.groupNotice" inline-prompt active-text="是" inactive-text="否" />
    </el-form-item>
    <el-form-item prop="isProd" label="是否为发布版本">
      <el-switch v-model="form.isProd" inline-prompt active-text="是" inactive-text="否" />
    </el-form-item>
    <el-form-item v-if="!form.isProd" prop="isAutoUpdateQrcode" label="是否自动更新本地版二维码 ">
      <el-switch
        v-model="form.isAutoUpdateQrcode"
        inline-prompt
        active-text="是"
        inactive-text="否"
      />
    </el-form-item>
    <el-form-item v-if="form.isProd" prop="isCreateTag" label="是否打tag">
      <el-switch v-model="form.isCreateTag" inline-prompt active-text="是" inactive-text="否" />
    </el-form-item>
    <el-form-item>
      <el-button class="config-form-clear" @click="emit('clearPage')">清空页面内容</el-button>
      <el-button class="config-form-submit" type="primary" @click="onSubmit(configFormRef)"
        >开始构建</el-button
      >
    </el-form-item>
  </el-form>
</template>

<script setup lang="ts">
import { reactive, ref, defineEmits } from 'vue';
import { ElMessage } from 'element-plus';
import type { FormInstance, FormRules } from 'element-plus';
import type { IConfigForm } from '@/services/config';
import { checkVersion } from '@/utils/common';

const configFormRef = ref<FormInstance>();
const rules = reactive<FormRules<IConfigForm>>({
  desc: [{ required: true, message: '请输入描述', trigger: 'blur' }],
  version: [
    {
      validator: (_, value: string, callback: any) => {
        if (value && !checkVersion(value)) {
          callback(new Error('格式为[x.[y.[z]]]，不填则以package.json的version字段为准!'));
        } else {
          callback();
        }
      },
      trigger: 'blur',
    },
  ],
});
const form = reactive<IConfigForm>({
  desc: '',
  version: '',
  groupNotice: false,
  isProd: false,
  isAutoUpdateQrcode: false,
  isCreateTag: false,
});
const emit = defineEmits<{
  clearPage: [];
  startBuild: [];
}>();

const onSubmit = async (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  await formEl.validate((valid) => {
    if (valid) {
      emit('startBuild');
    } else {
      ElMessage.warning('请完善表单信息!');
    }
  });
};
</script>
<style scoped lang="less">
.config-form {
  &-clear {
    position: absolute;
    right: 100px;
  }
  &-submit {
    position: absolute;
    right: 0;
  }
}
</style>

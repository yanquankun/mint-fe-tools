<template>
  <el-form
    ref="configFormRef"
    :model="form"
    :rules="rules"
    label-width="auto"
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
    <!-- <el-form-item label="Activity zone">
      <el-select v-model="form.region" placeholder="please select your zone">
        <el-option label="Zone one" value="shanghai" />
        <el-option label="Zone two" value="beijing" />
      </el-select>
    </el-form-item> -->
    <el-form-item label="Instant delivery">
      <el-switch v-model="form.delivery" />
    </el-form-item>
    <el-form-item label="Activity type">
      <el-checkbox-group v-model="form.type">
        <el-checkbox value="Online activities" name="type"> Online activities </el-checkbox>
        <el-checkbox value="Promotion activities" name="type"> Promotion activities </el-checkbox>
        <el-checkbox value="Offline activities" name="type"> Offline activities </el-checkbox>
        <el-checkbox value="Simple brand exposure" name="type"> Simple brand exposure </el-checkbox>
      </el-checkbox-group>
    </el-form-item>
    <el-form-item label="Resources">
      <el-radio-group v-model="form.resource">
        <el-radio value="Sponsor">Sponsor</el-radio>
        <el-radio value="Venue">Venue</el-radio>
      </el-radio-group>
    </el-form-item>
    <el-form-item>
      <el-button class="config-form-submit" type="primary" @click="onSubmit(configFormRef)"
        >开始构建</el-button
      >
    </el-form-item>
  </el-form>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue';
import type { ComponentSize, FormInstance, FormRules } from 'element-plus';
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
  delivery: false,
  type: [],
  resource: '',
});

const onSubmit = async (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  await formEl.validate((valid, fields) => {
    if (valid) {
      console.log('submit!');
    } else {
      console.log('error submit!', fields);
    }
  });
};
</script>
<style scoped lang="less">
.config-form {
  &-submit {
    position: absolute;
    right: 0;
  }
}
</style>

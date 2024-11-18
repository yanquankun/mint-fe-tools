<template>
  <div class="container">
    <el-container>
      <el-header height="50px" class="container-header">
        <div class="container-header-title">
          <span>小程序 ci 构建脚手架工具</span>
          <span class="container-header-title-line">|</span>
          <span class="container-header-title-extra">{{ baseInfo.version }}</span>
          <span class="container-header-title-line">|</span>
          <span class="container-header-title-extra">{{ baseInfo.projectName }}</span>
        </div>
        <div class="container-header-operations">
          <el-link
            type="primary"
            href="https://github.com/yanquankun/mint-fe-tools/blob/feature/v0.0.5/packages/%40mpsc/cli/README.md"
            target="_blank"
            >使用手册</el-link
          >
          <el-link
            type="primary"
            href="https://github.com/yanquankun/mint-fe-tools/issues"
            target="_blank"
            >问题反馈</el-link
          >
        </div>
      </el-header>
      <div v-if="!id">
        <el-divider content-position="left" border-style="dashed">构建选项</el-divider>
        <el-main class="container-config">
          <Config @startBuild="startBuild" @clearPage="clearPage" />
        </el-main>
        <el-divider content-position="left" border-style="dashed">输出日志</el-divider>
        <el-main class="container-log">
          <Log ref="logger" />
        </el-main>
      </div>
      <div class="container-result" v-else>
        <Result />
      </div>
    </el-container>
  </div>
</template>
<script setup lang="ts">
import { ref, onMounted } from 'vue';
import Log from './components/Log.vue';
import Config from './components/Config.vue';
import Result from './components/Result.vue';
import { ElMessage } from 'element-plus';
import { getBaseInfo } from '@/services/fetch';
import type { IConfigForm } from '@/services/config';

const id = new URLSearchParams(location.search).get('id') || '';
const logger = ref<InstanceType<typeof Log> | null>(null);
const baseInfo = ref<{
  version: string;
  projectName: string;
}>({
  version: '',
  projectName: '',
});

const startBuild = (form: IConfigForm) => {
  if (logger.value) {
    logger.value.startWatch(form);
  }
};
const clearPage = () => {
  if (logger.value) {
    logger.value.clear();
  }
};
const setBaseInfo = () => {
  getBaseInfo().then((response) => {
    if (response.code !== 0) {
      return ElMessage.error(response.message);
    }
    baseInfo.value = { ...response.data };
  });
};

onMounted(() => {
  setBaseInfo();
});
</script>
<style scoped lang="less">
.container {
  &-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    position: sticky;
    top: 0;
    background: #fff;
    z-index: 9999;
    border-bottom: 1px solid #dcdfe6;
    margin-bottom: 5px;

    &-title {
      font-size: 20px;
      display: flex;
      justify-content: center;
      align-items: center;

      &-line {
        margin: 0 5px;
        color: #ccc;
        font-size: 13px;
      }

      &-extra {
        font-size: 18px;
        color: #1e1f1e;
      }
    }

    &-operations {
      :nth-child(n) {
        font-size: 16px;
        margin-left: 5px;
      }
    }
  }

  &-result {
    padding: 20px;
  }
}
</style>

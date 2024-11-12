<template>
  <div class="container">
    <el-container>
      <el-header height="50px" class="container-header">
        <div class="container-header-title">小程序 ci 构建脚手架工具</div>
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
      <el-divider content-position="left" border-style="dashed">构建选项</el-divider>
      <el-main class="container-config">
        <Config />
      </el-main>
      <el-divider content-position="left" border-style="dashed">输出日志</el-divider>
      <el-main class="container-log">
        <Log ref="logger" />
      </el-main>
    </el-container>
  </div>
</template>
<script setup lang="ts">
import { ref } from 'vue';
import Log from './components/Log.vue';
import Config from './components/Config.vue';

const logger = ref<InstanceType<typeof Log> | null>(null);
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
    }

    &-operations {
      :nth-child(n) {
        font-size: 16px;
        margin-left: 5px;
      }
    }
  }

  &-config {
  }

  &-log {
  }
}
</style>

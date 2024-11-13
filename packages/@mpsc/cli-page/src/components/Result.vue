<template>
  <div
    v-loading="loading"
    element-loading-text="查询中..."
    element-loading-background="rgba(122, 122, 122, 0.4)"
    class="container"
  >
    <el-empty v-if="!result?.length" description="暂无数据" />
    <div class="container-qrcode" v-else></div>
  </div>
</template>
<script setup lang="ts">
import { ref } from 'vue';
import type { IResult } from '@/services/result';

const loading = ref<boolean>(false);
const result = ref<IResult[]>();
</script>
<style scoped lang="less">
.container {
  width: 100%;
  height: auto;
  min-height: 200px;
  border: 3px dashed #dcdfe6;
  border-radius: 6px;
}
</style>

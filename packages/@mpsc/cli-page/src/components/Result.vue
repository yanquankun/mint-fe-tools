<template>
  <el-form label-width="auto" style="max-width: 600px">
    <el-form-item label="分支：">
      <el-text type="primary">{{ result?.extraInfo?.branch ?? '未知' }}</el-text>
    </el-form-item>
    <el-form-item label="仓库：">
      <el-link :href="result?.extraInfo?.reomte" target="_blank" type="primary">{{
        result?.extraInfo?.reomte ?? '未知'
      }}</el-link>
    </el-form-item>
    <el-form-item label="tag：">
      <el-text type="primary">{{ result?.extraInfo?.tag ?? '未知' }}</el-text>
    </el-form-item>
    <el-form-item label="提交者：">
      <el-text type="primary">{{ result?.extraInfo?.user ?? '未知' }}</el-text>
    </el-form-item>
  </el-form>
  <div
    v-loading="loading"
    element-loading-text="查询中..."
    element-loading-background="rgba(122, 122, 122, 0.4)"
    class="container"
  >
    <el-empty v-if="!result?.qrcodeFiles.length" description="暂无数据" />
    <div class="container-qrcode" id="capture" ref="canvasRef" v-else>
      <div class="container-qrcode-image-btn" id="exportImgBtn" @click="exportImg">
        导出结果为图片
      </div>
      <div class="container-qrcode-item" v-for="(item, index) in result?.qrcodeFiles" :key="index">
        <span class="container-qrcode-item-name">{{ item.fileName }}</span>
        <el-image
          class="container-qrcode-item-image"
          :src="item.baseUrl"
          :zoom-rate="1.2"
          :max-scale="7"
          :min-scale="0.2"
          :initial-index="0"
          :preview-src-list="[item.baseUrl]"
          fit="cover"
        />
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref, onMounted } from 'vue';
import type { IResult } from '@/services/result';
import { ElMessage } from 'element-plus';
import { getQrcode as _getQrcode } from '@/services/fetch';
import html2canvas from 'html2canvas';

const id = new URLSearchParams(location.search).get('id') || '';
const loading = ref<boolean>(false);
const result = ref<IResult>();
const canvasRef = ref<HTMLElement>();

const getQrcode = () => {
  _getQrcode(id).then((response) => {
    if (response.code !== 0) {
      return ElMessage.error(response.message);
    }
    result.value = response.data;
  });
};
const exportImg = async () => {
  try {
    const element = canvasRef.value;
    if (element) {
      const canvas = await html2canvas(element, {
        ignoreElements: (element) => {
          if (element.id === 'exportImgBtn') return true;
          return false;
        },
      });
      const imgData = canvas.toDataURL('image/png');

      // 下载图片
      const link = document.createElement('a');
      link.href = imgData;
      link.download = '小程序本地版二维码.png';
      link.click();
    }
  } catch (error) {
    ElMessage.error('截图失败');
  }
};
onMounted(() => {
  getQrcode();
});
</script>
<style scoped lang="less">
.container {
  width: 100%;
  height: auto;
  min-height: 150px;
  border: 3px dashed #dcdfe6;
  border-radius: 6px;
  padding: 10px;
  box-sizing: border-box;
  position: relative;

  &-qrcode {
    &-image-btn {
      background: rgb(240, 248, 255);
      display: inline-flex;
      position: absolute;
      right: 0;
      top: 0;
      padding: 4px 5px;
      border-radius: 0 6px;
      cursor: pointer;
      color: #856b6b;
      font-weight: 600;
      border: 0 dashed #dcdfe6;
      border-width: 0 0 3px 3px;

      &:hover {
        background: rgb(248, 248, 248);
      }
    }

    &-item {
      display: flex;
      justify-content: center;
      align-items: start;
      flex-direction: column;

      &-name {
        font-size: 18px;
        font-weight: 600;
        font-family: cursive;
        margin-left: 8px;
      }
      &-image {
        margin-top: 5px;
        width: 117px;
        height: 120px;
        padding: 0;
      }
    }
  }
}
</style>

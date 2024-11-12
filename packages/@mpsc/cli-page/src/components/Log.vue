<template>
  <div class="logger-ui">
    <div class="logger-output" ref="logOutput">
      <p v-for="(log, index) in logs" :key="index">
        <span class="logger-output-time">{{ new Date().toLocaleTimeString() }}</span>
        <span :class="logMap[log.level]">{{ log.message }}</span>
      </p>
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref, nextTick, defineExpose, onMounted } from 'vue';
import { LogLevel } from '@/services/log';
import type { ILog } from '@/services/log';

const logOutput = ref<HTMLElement | null>(null);
const logs = ref<{ level: LogLevel; message: string }[]>([]);
const logMap = {
  [LogLevel.INFO]: 'logger-output-info',
  [LogLevel.WARN]: 'logger-output-warn',
  [LogLevel.ERROR]: 'logger-output-error',
  [LogLevel.DEBUG]: 'logger-output-debug',
};

//====== output ======
const log = (log: ILog) => {
  logs.value.push({
    level: LogLevel.INFO,
    message: log.message,
  });
  scrollToBottom();
};
const startWatch = () => {
  log({ level: LogLevel.INFO, message: '开始监听构建日志' });
};
const clear = () => {
  logs.value = [{ level: LogLevel.INFO, message: '小程序构建日志监控' }];
};
defineExpose({
  log,
  clear,
  startWatch,
});
//====== output end ======

const scrollToBottom = async () => {
  await nextTick();
  if (logOutput.value) {
    logOutput.value.scrollTop = logOutput.value.scrollHeight;
  }
};
onMounted(() => {
  log({ level: LogLevel.INFO, message: '小程序构建日志监控' });
});
</script>
<style scoped lang="less">
.logger-ui {
  width: 100%;
  margin: 0 auto;
}

.logger-output {
  height: 500px;
  background-color: #1e1e1e;
  color: #dcdcdc;
  overflow-y: auto;
  padding: 10px;
  border-radius: 4px;
  border: 1px solid #333;

  p {
    margin: 0;
    font-family: monospace;
    font-size: 14px;
    line-height: 1.5;
    font-weight: 900;
  }

  &-time {
    color: rgb(47, 247, 7);
    margin-right: 8px;
  }

  &-info {
    color: #dcdcdc;
  }

  &-warn {
    color: #f0ad4e;
  }

  &-error {
    color: #f00;
  }

  &-debug {
    color: #999;
  }
}
</style>

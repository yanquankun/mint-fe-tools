<template>
  <div class="logger-ui">
    <div class="logger-output" ref="logOutput">
      <p v-for="(log, index) in logs" :key="index">
        <span class="logger-output-time">{{ log.time }}</span>
        <span :class="logMap[log.level]">{{ log.message }}</span>
      </p>
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref, nextTick, defineExpose, onMounted, onUnmounted } from 'vue';
import { LogLevel } from '@/services/log';
import type { ILog } from '@/services/log';
import { ElMessage } from 'element-plus';
import type { IConfigForm } from '@/services/config';
import { postBuildInfo } from '@/services/fetch';

const logOutput = ref<HTMLElement | null>(null);
const logs = ref<{ level: LogLevel; message: string; time: string }[]>([]);
const logMap = {
  [LogLevel.INFO]: 'logger-output-info',
  [LogLevel.WARN]: 'logger-output-warn',
  [LogLevel.ERROR]: 'logger-output-error',
  [LogLevel.DONE]: 'logger-output-done',
  [LogLevel.LOG]: 'logger-output-log',
};
let eventSource: EventSource | null = null;

//====== output ======
const startWatch = (buildInfo: IConfigForm) => {
  clear();
  log({ level: LogLevel.INFO, message: '开始监听构建日志' });
  listen(buildInfo);
};
const clear = () => {
  logs.value = [
    { time: new Date().toLocaleTimeString(), level: LogLevel.INFO, message: '小程序构建日志监控' },
  ];
  eventSource && eventSource.close();
};
defineExpose({
  clear,
  startWatch,
});
//====== output end ======

const log = (log: ILog) => {
  logs.value.push({
    time: new Date().toLocaleTimeString(),
    level: log.level,
    message: log.message,
  });
  scrollToBottom();
};
const scrollToBottom = async () => {
  await nextTick();
  if (logOutput.value) {
    logOutput.value.scrollTop = logOutput.value.scrollHeight;
  }
};
const listen = (buildInfo: IConfigForm) => {
  eventSource = new EventSource('/api/message');

  eventSource.onopen = () => {
    // after message event success then send build info
    // Prevent the log generated before the event connection is successful from being obtained
    postBuildInfo(buildInfo)
      .then((response) => {
        if (response.code !== 0) {
          ElMessage.error(response.message);
          clear();
        }
      })
      .catch((error) => {
        ElMessage.error('开始构建失败，打开控制台查看原因');
        console.error('开始构建操作失败原因：', error);
        clear();
      });
  };

  eventSource.onmessage = (event) => {
    try {
      const data = JSON.parse(event.data);
      log({ level: data.level, message: data.message });
    } catch (error) {
      console.error('本条日志接收失败，原因：', error);
    }
  };

  eventSource.onerror = () => {
    clear();
    ElMessage.error('监听构建日志失败');
  };
};
onMounted(() => {
  log({ level: LogLevel.INFO, message: '小程序构建日志监控' });
});
onUnmounted(() => {
  if (eventSource) {
    eventSource.close();
  }
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
  word-wrap: break-word;

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

  &-done {
    color: #999;
  }

  &-log {
    color: #dcdcdc;
  }
}
</style>

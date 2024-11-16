import { ElMessage } from 'element-plus';
import type { IConfigForm } from '@/services/config';

export const getBaseInfo = () => {
  return fetch('/api/getBaseInfo', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  })
    .then((response) => response.json())
    .catch((error) => ElMessage.error(error));
};

export const postBuildInfo = (params: IConfigForm) => {
  return fetch('/api/postBuildInfo', {
    method: 'POST',
    body: JSON.stringify(params),
    headers: {
      'Content-Type': 'application/json',
    },
  })
    .then((response) => response.json())
    .catch((error) => ElMessage.error(error));
};

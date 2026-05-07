import apiClient from './client'

const unwrap = res => {
  const body = res.data;

  return {
    ...body,
    ...(body.data || {}),
  };
};

export const get = async (url) => {
  const res = await apiClient.get(url);
  return unwrap(res);
}

export const post = async (url, data) => {
  const res = await apiClient.post(url, data);
  return unwrap(res);
}

export const put = async (url, data) => {
  const res = await apiClient.put(url, data);
  return unwrap(res);
}

export const del = async (url) => {
  const res = await apiClient.delete(url);
  return unwrap(res);
}